import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const header = (req.headers.authorization as string) || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = verifyToken(token);
  if (!payload) return res.status(401).send('Unauthorized.');

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('admins')
      .select('id, email, name, photo, created_at')
      .eq('id', payload.sub)
      .limit(1);
    
    if (error || !data?.length) return res.status(404).send('Admin not found.');
    return res.status(200).json(data[0]);
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { name, photo } = body || {};

    const { data, error } = await supabase
      .from('admins')
      .update({ name, photo })
      .eq('id', payload.sub)
      .select('id, email, name, photo')
      .limit(1);

    if (error) {
      console.error('Profile update error:', error);
      return res.status(500).send('Failed to update profile.');
    }

    return res.status(200).json(data?.[0] || {});
  }

  return res.status(405).send('Method not allowed.');
}
