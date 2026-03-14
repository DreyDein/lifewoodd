import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const app = express();
const PORT = Number(process.env.PORT || 5174);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const uploadDir = path.join(rootDir, 'uploads');

dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, '.env.local') });

await fs.mkdir(dataDir, { recursive: true });
await fs.mkdir(uploadDir, { recursive: true });

app.use(express.json({ limit: '1mb' }));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me';
const ADMIN_TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

if (ADMIN_PASSWORD === 'change-me' || ADMIN_TOKEN_SECRET === 'change-me') {
  console.warn('Admin auth is using default credentials. Set ADMIN_PASSWORD and ADMIN_TOKEN_SECRET.');
}

const allowedExtensions = new Set(['.pdf', '.doc', '.docx']);
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(ext)) {
      cb(new Error('Unsupported file type.'));
      return;
    }
    cb(null, true);
  }
});

const sanitizeFilename = (filename) =>
  filename.replace(/[^a-zA-Z0-9._-]/g, '_');

const base64UrlEncode = (value) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

const signToken = (payload) =>
  crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest('base64url');

const createToken = () => {
  const payload = {
    sub: 'admin',
    exp: Date.now() + ADMIN_TOKEN_TTL_MS
  };
  const body = base64UrlEncode(payload);
  return `${body}.${signToken(body)}`;
};

const verifyToken = (token) => {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  if (signToken(body) !== signature) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (!payload?.exp || payload.exp < Date.now()) return null;
  return payload;
};

const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).send('Unauthorized.');
    return;
  }
  req.admin = payload;
  next();
};

const appendJsonLine = async (filePath, payload) => {
  const line = `${JSON.stringify(payload)}\n`;
  await fs.appendFile(filePath, line, 'utf8');
};

const readJsonLines = async (filePath) => {
  try {
    const text = await fs.readFile(filePath, 'utf8');
    if (!text.trim()) return [];
    return text
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch (err) {
    if (err?.code === 'ENOENT') return [];
    throw err;
  }
};

const writeJsonLines = async (filePath, entries) => {
  const text = entries.map((entry) => JSON.stringify(entry)).join('\n');
  const output = text ? `${text}\n` : '';
  await fs.writeFile(filePath, output, 'utf8');
};

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) {
    res.status(400).send('Password is required.');
    return;
  }
  if (password !== ADMIN_PASSWORD) {
    res.status(401).send('Invalid password.');
    return;
  }
  res.status(200).json({ token: createToken() });
});

app.get('/api/admin/emails', requireAdmin, async (req, res, next) => {
  try {
    const applications = await readJsonLines(path.join(dataDir, 'applications.jsonl'));
    const contacts = await readJsonLines(path.join(dataDir, 'contacts.jsonl'));

    const combined = [
      ...applications.map((entry) => ({
        id: entry.id,
        email: entry.email,
        name: `${entry.firstName ?? ''} ${entry.lastName ?? ''}`.trim() || 'Applicant',
        receivedAt: entry.receivedAt,
        source: 'applications',
        detail: entry.project ?? ''
      })),
      ...contacts.map((entry) => ({
        id: entry.id,
        email: entry.email,
        name: entry.fullName ?? 'Contact',
        receivedAt: entry.receivedAt,
        source: 'contacts',
        detail: entry.inquiryType ?? ''
      }))
    ];

    combined.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    res.status(200).json(combined);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/admin/emails/:source/:id', requireAdmin, async (req, res, next) => {
  try {
    const { source, id } = req.params;
    if (!['applications', 'contacts'].includes(source)) {
      res.status(400).send('Invalid source.');
      return;
    }

    const filePath = path.join(dataDir, `${source}.jsonl`);
    const entries = await readJsonLines(filePath);
    const filtered = entries.filter((entry) => entry.id !== id);
    await writeJsonLines(filePath, filtered);
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.post('/api/contact', async (req, res, next) => {
  try {
    const { fullName, email, inquiryType, message } = req.body || {};

    if (!fullName || !email || !inquiryType || !message) {
      res.status(400).send('Missing required fields.');
      return;
    }

    const entry = {
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      fullName,
      email,
      inquiryType,
      message
    };

    await appendJsonLine(path.join(dataDir, 'contacts.jsonl'), entry);
    res.status(200).json({ ok: true, id: entry.id });
  } catch (err) {
    next(err);
  }
});

app.post('/api/apply', upload.single('cv'), async (req, res, next) => {
  try {
    const { firstName, lastName, age, email, degree, project, experience } = req.body || {};

    if (!firstName || !lastName || !email || !project) {
      res.status(400).send('Missing required fields.');
      return;
    }

    let storedFile = null;
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const safeName = sanitizeFilename(req.file.originalname);
      const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
      const targetPath = path.join(uploadDir, fileName);
      await fs.rename(req.file.path, targetPath);
      storedFile = {
        originalName: req.file.originalname,
        storedName: fileName,
        size: req.file.size,
        extension: ext
      };
    }

    const entry = {
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      firstName,
      lastName,
      age: age || null,
      email,
      degree: degree || null,
      project,
      experience: experience || null,
      cv: storedFile
    };

    await appendJsonLine(path.join(dataDir, 'applications.jsonl'), entry);
    res.status(200).json({ ok: true, id: entry.id });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const status = err?.message?.includes('Unsupported file type') ? 400 : 500;
  const message = status === 400 ? err.message : 'Server error.';
  res.status(status).send(message);
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
