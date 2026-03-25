import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

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

// ── Auth ──────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me';
const ADMIN_TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

if (ADMIN_PASSWORD === 'change-me' || ADMIN_TOKEN_SECRET === 'change-me') {
  console.warn('⚠️  Admin auth is using default credentials. Set ADMIN_PASSWORD and ADMIN_TOKEN_SECRET.');
}

// ── Resend ────────────────────────────────────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

// ── Supabase ──────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// ── Admin Database ───────────────────────────────────────────────────────────
const initAdminsTable = async () => {
  try {
    const { data, error } = await supabase.from('admins').select('id').limit(1);
    if (error) {
      console.log('⚠️ Admins table not accessible:', error.message);
      console.log('Please run sql-setup.sql in Supabase SQL Editor');
    } else if (!data?.length) {
      console.log('No admins found. Creating initial admin...');
      const { error: insertErr } = await supabase.from('admins').insert({
        id: crypto.randomUUID(),
        email: 'admin@lifewood.com',
        password_hash: await bcrypt.hash(ADMIN_PASSWORD, 10),
        name: 'Super Admin',
        created_at: new Date().toISOString(),
      });
      if (insertErr) console.error('Insert error:', insertErr);
      else console.log('✅ Initial admin created. Email: admin@lifewood.com');
    }
  } catch (err) {
    console.error('Admin table init error:', err);
  }
};

await initAdminsTable();

// ── Debug endpoint ─────────────────────────────────────────────────────────────
app.get('/api/admin/debug', async (req, res) => {
  const { data, error } = await supabase.from('admins').select('email, name');
  res.json({ admins: data, error, supabaseUrl: !!process.env.SUPABASE_URL, hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY });
});

// ── Multer ────────────────────────────────────────────────────────────────────
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

// ── Token helpers ─────────────────────────────────────────────────────────────
const base64UrlEncode = (value) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

const signToken = (payload) =>
  crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest('base64url');

const createToken = () => {
  const payload = { sub: 'admin', exp: Date.now() + ADMIN_TOKEN_TTL_MS };
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
  if (!payload) { res.status(401).send('Unauthorized.'); return; }
  req.admin = payload;
  next();
};

// ── JSONL helpers (kept as fallback) ─────────────────────────────────────────
const appendJsonLine = async (filePath, payload) => {
  const line = `${JSON.stringify(payload)}\n`;
  await fs.appendFile(filePath, line, 'utf8');
};

const readJsonLines = async (filePath) => {
  try {
    const text = await fs.readFile(filePath, 'utf8');
    if (!text.trim()) return [];
    return text.split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (err) {
    if (err?.code === 'ENOENT') return [];
    throw err;
  }
};

const writeJsonLines = async (filePath, entries) => {
  const text = entries.map((entry) => JSON.stringify(entry)).join('\n');
  await fs.writeFile(filePath, text ? `${text}\n` : '', 'utf8');
};

// ── Admin login ───────────────────────────────────────────────────────────────
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body || {};
  console.log('Login attempt:', email);
  
  if (!email || !password) { res.status(400).send('Email and password are required.'); return; }
  
  const { data: admins, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email.toLowerCase())
    .limit(1);
  
  if (error) { console.error('Login query error:', error); res.status(500).send('Server error: ' + error.message); return; }
  if (!admins?.length) { 
    console.log('No admin found for:', email.toLowerCase());
    res.status(401).send('Invalid credentials.'); return; }
  
  const admin = admins[0];
  console.log('Admin found:', admin.email);
  const valid = await bcrypt.compare(password, admin.password_hash);
  console.log('Password valid:', valid);
  if (!valid) { res.status(401).send('Invalid credentials.'); return; }
  
  res.status(200).json({ 
    token: createToken(),
    user: { id: admin.id, email: admin.email, name: admin.name }
  });
});

// ── Admin registration (by existing admin) ─────────────────────────────────
app.post('/api/admin/register', requireAdmin, async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) { res.status(400).send('Email, password, and name are required.'); return; }
  if (password.length < 6) { res.status(400).send('Password must be at least 6 characters.'); return; }
  
  const { data: existing } = await supabase
    .from('admins')
    .select('id')
    .eq('email', email.toLowerCase())
    .limit(1);
  
  if (existing?.length) { res.status(400).send('Email already registered.'); return; }
  
  const { error } = await supabase.from('admins').insert({
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    password_hash: await bcrypt.hash(password, 10),
    name,
    created_at: new Date().toISOString(),
  });
  
  if (error) { console.error('Register error:', error); res.status(500).send('Failed to create admin.'); return; }
  res.status(200).json({ ok: true, message: 'Admin created successfully.' });
});

// ── Admin: list admins ───────────────────────────────────────────────────────
app.get('/api/admin/list', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('admins')
    .select('id, email, name, created_at')
    .order('created_at', { ascending: true });
  if (error) { console.error('List admins error:', error); res.status(500).send('Failed to list admins.'); return; }
  res.status(200).json(data || []);
});

// ── Admin: delete admin ──────────────────────────────────────────────────────
app.delete('/api/admin/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (id === req.admin.sub) { res.status(400).send('Cannot delete yourself.'); return; }
  const { error } = await supabase.from('admins').delete().eq('id', id);
  if (error) { console.error('Delete admin error:', error); res.status(500).send('Failed to delete admin.'); return; }
  res.status(200).json({ ok: true });
});

// ── Admin: list all emails (from Supabase) ────────────────────────────────────
app.get('/api/admin/emails', requireAdmin, async (req, res, next) => {
  try {
    const { data: applications, error: appErr } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: contacts, error: conErr } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (appErr) console.error('Supabase applications error:', appErr);
    if (conErr) console.error('Supabase contacts error:', conErr);

    const combined = [
      ...(applications || []).map((e) => ({
        id: e.id,
        email: e.email,
        name: `${e.first_name ?? ''} ${e.last_name ?? ''}`.trim() || 'Applicant',
        receivedAt: e.created_at,
        source: 'applications',
        detail: e.position ?? '',
        data: e,
      })),
      ...(contacts || []).map((e) => ({
        id: e.id,
        email: e.email,
        name: e.full_name ?? 'Contact',
        receivedAt: e.created_at,
        source: 'contacts',
        detail: e.inquiry_type ?? '',
        data: e,
      })),
    ];

    combined.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    res.status(200).json(combined);
  } catch (err) {
    next(err);
  }
});

// ── Admin: delete entry ───────────────────────────────────────────────────────
app.delete('/api/admin/emails/:source/:id', requireAdmin, async (req, res, next) => {
  try {
    const { source, id } = req.params;
    const table = source === 'applications' ? 'applications' : source === 'contacts' ? 'inquiries' : null;
    if (!table) { res.status(400).send('Invalid source.'); return; }

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ── Contact form ──────────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res, next) => {
  try {
    const { fullName, email, inquiryType, message } = req.body || {};
    if (!fullName || !email || !inquiryType || !message) {
      res.status(400).send('Missing required fields.');
      return;
    }

    // Save to Supabase
    const { error: dbErr } = await supabase.from('inquiries').insert({
      full_name: fullName,
      email,
      inquiry_type: inquiryType,
      message,
    });
    if (dbErr) console.error('Supabase insert error:', dbErr);

    // Also save to JSONL as backup
    await appendJsonLine(path.join(dataDir, 'contacts.jsonl'), {
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      fullName, email, inquiryType, message,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ── Apply form ────────────────────────────────────────────────────────────────
app.post('/api/apply', upload.single('cv'), async (req, res, next) => {
  try {
    const { firstName, lastName, age, email, degree, project, experience } = req.body || {};
    if (!firstName || !lastName || !email || !project) {
      res.status(400).send('Missing required fields.');
      return;
    }

    let cvFilename = null;
    let cvUrl = null;

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const safeName = sanitizeFilename(req.file.originalname);
      const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
      const targetPath = path.join(uploadDir, fileName);
      await fs.rename(req.file.path, targetPath);
      cvFilename = req.file.originalname;

      // Upload CV to Supabase Storage
      try {
        const fileBuffer = await fs.readFile(targetPath);
        const { data: storageData, error: storageErr } = await supabase.storage
          .from('cvs')
          .upload(fileName, fileBuffer, {
            contentType: ext === '.pdf' ? 'application/pdf' : 'application/msword',
          });
        if (storageErr) {
          console.error('Supabase storage error:', storageErr);
        } else {
          const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(fileName);
          cvUrl = urlData?.publicUrl || null;
        }
      } catch (storageErr) {
        console.error('CV upload error:', storageErr);
      }
    }

    // Save to Supabase DB
    const { error: dbErr } = await supabase.from('applications').insert({
      first_name: firstName,
      last_name: lastName,
      age: age || null,
      email,
      degree: degree || null,
      position: project,
      experience: experience || null,
      cv_filename: cvFilename,
      cv_url: cvUrl,
    });
    if (dbErr) console.error('Supabase insert error:', dbErr);

    // JSONL backup
    await appendJsonLine(path.join(dataDir, 'applications.jsonl'), {
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      firstName, lastName, age: age || null, email,
      degree: degree || null, project, experience: experience || null,
      cvFilename, cvUrl,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err?.message?.includes('Unsupported file type') ? 400 : 500;
  res.status(status).send(status === 400 ? err.message : 'Server error.');
});

app.listen(PORT, () => {
  console.log(`✅ API server listening on http://localhost:${PORT}`);
});