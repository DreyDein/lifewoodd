import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me';
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

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

  const { id, status, replyMessage, email, name } = req.body || {};
  if (!id || !status) return res.status(400).send('Missing fields.');

  const allowed = ['resolved', 'irrelevant', 'pending'];
  if (!allowed.includes(status)) return res.status(400).send('Invalid status.');

  // Update status in Supabase
  const { error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Supabase update error:', error);
    return res.status(500).send('Failed to update status.');
  }

  // Send reply email if resolving with a message
  if (status === 'resolved' && replyMessage && email) {
    try {
      await transporter.sendMail({
        from: `"Lifewood" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Re: Your Inquiry — Lifewood',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
            <div style="background:#046241;padding:24px 40px;text-align:center;">
              <div style="display:inline-block;background:#ffffff;padding:10px 24px;border-radius:50px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
                <img src="https://lifewood-website-zlwn.vercel.app/lifewood-logo.png" alt="Lifewood" style="height:32px;width:auto;display:block;" />
              </div>
            </div>
            <div style="padding:32px 40px;">
              <p style="color:#133020;font-size:16px;margin:0 0 16px;">Dear <strong>${name || 'there'}</strong>,</p>
              <p style="color:#444;line-height:1.7;margin:0 0 16px;">Thank you for reaching out to Lifewood. Here is our response to your inquiry:</p>
              <div style="background:#f8f9fa;border-left:4px solid #046241;border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="margin:0;color:#133020;line-height:1.7;">${replyMessage}</p>
              </div>
              <p style="color:#444;line-height:1.7;">If you have any further questions, feel free to reach out to us again.</p>
            </div>
            <div style="background:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#133020;font-weight:700;margin:0 0 4px;">Lifewood Data Technology</p>
              <p style="color:#999;font-size:11px;margin:0;">hr@lifewoodwebsite.com · lifewoodwebsite.com</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }
  }

  return res.status(200).json({ ok: true });
}