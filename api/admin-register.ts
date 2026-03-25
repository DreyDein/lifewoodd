import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me';
const ADMIN_TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

const base64UrlEncode = (value: any) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

const signToken = (payload: string) =>
  crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest('base64url');

const verifyToken = (token: string) => {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  if (signToken(body) !== signature) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (!payload?.exp || payload.exp < Date.now()) return null;
  return payload;
};

const createToken = () => {
  const payload = { sub: 'admin', exp: Date.now() + ADMIN_TOKEN_TTL_MS };
  const body = base64UrlEncode(payload);
  return `${body}.${signToken(body)}`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).send('Method not allowed.');

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const payload = verifyToken(token || '');
  if (!payload) return res.status(401).send('Unauthorized.');

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { email, password, name } = body || {};

  if (!email || !password || !name) {
    return res.status(400).send('Email, password, and name are required.');
  }
  if (password.length < 6) {
    return res.status(400).send('Password must be at least 6 characters.');
  }

  const { data: existing } = await supabase
    .from('admins')
    .select('id')
    .eq('email', email.toLowerCase())
    .limit(1);

  if (existing?.length) return res.status(400).send('Email already registered.');

  const { error } = await supabase.from('admins').insert({
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    password_hash: await bcrypt.hash(password, 10),
    name,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Register error:', error);
    return res.status(500).send('Failed to create admin.');
  }

  return res.status(200).json({ ok: true, message: 'Admin created successfully.' });
}
