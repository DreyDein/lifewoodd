import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

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
  
  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }
  
  const payload = verifyToken(token);
  
  return res.status(200).json({ 
    hasPayload: !!payload,
    payload,
    tokenPreview: token.slice(0, 50) + '...'
  });
}
