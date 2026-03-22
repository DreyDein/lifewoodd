import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me';
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');

const signToken = (payload: string) =>
  crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest('base64url');

const verifyToken = (token: string | null) => {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  if (signToken(body) !== signature) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (!payload?.exp || payload.exp < Date.now()) return null;
  return payload;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const header = (req.headers.authorization as string) || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!verifyToken(token)) return res.status(401).send('Unauthorized.');
  if (req.method !== 'POST') return res.status(405).send('Method not allowed.');

  const { id, status } = req.body || {};
  if (!id || !status) return res.status(400).send('Missing fields.');

  const allowed = ['resolved', 'irrelevant', 'pending'];
  if (!allowed.includes(status)) return res.status(400).send('Invalid status.');

  const { error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Supabase update error:', error);
    return res.status(500).send('Failed to update status.');
  }

  return res.status(200).json({ ok: true });
}