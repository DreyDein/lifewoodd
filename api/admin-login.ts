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

const createToken = () => {
  const payload = { sub: 'admin', exp: Date.now() + ADMIN_TOKEN_TTL_MS };
  const body = base64UrlEncode(payload);
  return `${body}.${signToken(body)}`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).send('Method not allowed.');

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { email, password } = body || {};

  if (!email || !password) return res.status(400).send('Email and password are required.');

  const { data: admins, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email.toLowerCase())
    .limit(1);

  if (error) {
    console.error('Login query error:', error);
    return res.status(500).send('Server error: ' + error.message);
  }

  if (!admins?.length) return res.status(401).send('Invalid credentials.');

  const admin = admins[0];
  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) return res.status(401).send('Invalid credentials.');

  return res.status(200).json({
    token: createToken(),
    user: { id: admin.id, email: admin.email, name: admin.name }
  });
}
