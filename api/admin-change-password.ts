import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

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
  const header = (req.headers.authorization as string) || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = verifyToken(token);
  if (!payload) return res.status(401).send('Unauthorized.');
  if (req.method !== 'POST') return res.status(405).send('Method not allowed.');

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { currentPassword, newPassword } = body || {};
  if (!currentPassword || !newPassword) return res.status(400).send('Missing fields.');

  if (newPassword.length < 6) {
    return res.status(400).send('Password must be at least 6 characters.');
  }

  // Get current admin from database
  const { data: admins, error: fetchError } = await supabase
    .from('admins')
    .select('*')
    .eq('id', payload.sub)
    .limit(1);

  if (fetchError || !admins?.length) {
    return res.status(401).send('Admin not found.');
  }

  const admin = admins[0];

  // Verify current password
  const valid = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!valid) {
    return res.status(401).send('Current password is incorrect.');
  }

  // Update password in database
  const { error: updateError } = await supabase
    .from('admins')
    .update({ password_hash: await bcrypt.hash(newPassword, 10) })
    .eq('id', admin.id);

  if (updateError) {
    console.error('Password update error:', updateError);
    return res.status(500).send('Failed to update password.');
  }

  return res.status(200).json({ ok: true, message: 'Password updated successfully.' });
}
