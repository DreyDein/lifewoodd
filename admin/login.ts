import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me';
const ADMIN_TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

const base64UrlEncode = (value: any) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

const signToken = (payload: string) =>
  crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest('base64url');

const createToken = () => {
  const payload = { sub: 'admin', exp: Date.now() + ADMIN_TOKEN_TTL_MS };
  const body = base64UrlEncode(payload);
  return `${body}.${signToken(body)}`;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed.');

  const { password } = req.body || {};
  
  // ⚠️ TEMPORARY DEBUG - remove after fixing
  console.log('Received password:', password);
  console.log('Expected password:', process.env.ADMIN_PASSWORD);
  console.log('Match:', password === process.env.ADMIN_PASSWORD);

  if (!password) return res.status(400).send('Password is required.');
  if (password !== ADMIN_PASSWORD) return res.status(401).send('Invalid password.');

  return res.status(200).json({ token: createToken() });
}