import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me';

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

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).send('Missing fields.');

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
  if (currentPassword !== ADMIN_PASSWORD) {
    return res.status(401).send('Current password is incorrect.');
  }

  if (newPassword.length < 6) {
    return res.status(400).send('Password must be at least 6 characters.');
  }

  // Note: On Vercel, env variables can't be changed at runtime.
  // Return a message instructing admin to update env variable manually.
  return res.status(200).json({ 
    ok: true, 
    message: 'To complete the password change, update ADMIN_PASSWORD in your Vercel environment variables and redeploy.' 
  });
}