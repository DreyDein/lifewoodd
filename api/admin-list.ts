import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const payload = verifyToken(token || '');
  if (!payload) return res.status(401).send('Unauthorized.');

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('admins')
      .select('id, email, name, created_at')
      .order('created_at', { ascending: true });
    if (error) return res.status(500).send('Failed to list admins.');
    return res.status(200).json(data || []);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).send('ID required.');
    if (id === payload.sub) return res.status(400).send('Cannot delete yourself.');

    const { error } = await supabase.from('admins').delete().eq('id', id);
    if (error) return res.status(500).send('Failed to delete admin.');
    return res.status(200).json({ ok: true });
  }

  return res.status(405).send('Method not allowed.');
}
