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
  // Auth check
  const header = (req.headers.authorization as string) || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!verifyToken(token)) return res.status(401).send('Unauthorized.');

  if (req.method === 'GET') {
    const { data: applications, error: appErr } = await supabase
  .from('applications')
  .select('*')
  .is('deleted_at', null)
  .order('created_at', { ascending: false });

const { data: contacts, error: conErr } = await supabase
  .from('inquiries')
  .select('*')
  .is('deleted_at', null)
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

    combined.sort(
      (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );

    return res.status(200).json(combined);
  }

  return res.status(405).send('Method not allowed.');
}