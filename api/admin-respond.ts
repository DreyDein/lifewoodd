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

  const { id, decision, email, name, position } = req.body || {};
  if (!id || !decision || !email || !name) return res.status(400).send('Missing fields.');

  // Update status in Supabase
  const { error: dbErr } = await supabase
    .from('applications')
    .update({ status: decision })
    .eq('id', id);
  if (dbErr) console.error('Supabase update error:', dbErr);

  const isAccepted = decision === 'accepted';

  // Send email to applicant
  try {
    await transporter.sendMail({
      from: `"Lifewood Careers" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: isAccepted ? '🎉 Application Accepted — Lifewood' : 'Your Lifewood Application Update',
      html: isAccepted ? `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
          <div style="background:#046241;padding:32px 40px;text-align:center;">
            <div style="display:inline-block;background:#ffffff;padding:12px 28px;border-radius:50px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
              <img 
                src="https://lifewood-website-zlwn.vercel.app/lifewood-logo.png" 
                alt="Lifewood" 
                style="height:36px;width:auto;object-fit:contain;display:block;"
              />
            </div>
          </div>
          <div style="padding:32px 40px;">
            <div style="background:#FFC370;color:#133020;font-weight:800;font-size:13px;letter-spacing:1px;padding:8px 20px;border-radius:20px;display:inline-block;margin-bottom:24px;">Application Accepted</div>
            <p style="color:#133020;font-size:16px;margin:0 0 16px;">Dear <strong>${name}</strong>,</p>
            <p style="color:#444;line-height:1.7;margin:0 0 16px;">We are thrilled to inform you that your application for the position of <strong>${position || 'the role'}</strong> at Lifewood has been <strong style="color:#046241;">accepted!</strong></p>
            <p style="color:#444;line-height:1.7;margin:0 0 24px;">Congratulations! Your qualifications and experience stood out among many applicants, and we believe you will be a fantastic addition to our team.</p>
            <div style="background:#f8f9fa;border-left:4px solid #FFC370;border-radius:8px;padding:20px;margin-bottom:24px;">
              <p style="color:#133020;font-weight:700;margin:0 0 12px;">Next Steps</p>
              <ol style="color:#444;line-height:2;margin:0;padding-left:20px;">
                <li>Our HR team will reach out within <strong>3-5 business days</strong> with onboarding details.</li>
                <li>Please prepare a valid government-issued ID for verification.</li>
                <li>You will receive a separate email with your employment contract and start date.</li>
                <li>Questions? Email us at <a href="mailto:hr@lifewoodwebsite.com" style="color:#046241;">hr@lifewoodwebsite.com</a>.</li>
              </ol>
            </div>
            <p style="color:#444;line-height:1.7;margin:0 0 32px;">We are excited to welcome you to the Lifewood family!</p>
            <table style="width:100%;border-top:1px solid #eee;padding-top:16px;">
              <tr><td style="color:#999;font-size:13px;">Position:</td><td style="color:#133020;font-weight:600;font-size:13px;text-align:right;">${position || '—'}</td></tr>
              <tr><td style="color:#999;font-size:13px;">Date:</td><td style="color:#133020;font-weight:600;font-size:13px;text-align:right;">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td></tr>
              <tr><td style="color:#999;font-size:13px;">Status:</td><td style="color:#046241;font-weight:700;font-size:13px;text-align:right;">Accepted</td></tr>
            </table>
          </div>
          <div style="background:#f8f9fa;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="color:#133020;font-weight:700;margin:0 0 4px;">Lifewood Data Technology</p>
            <p style="color:#999;font-size:11px;margin:0;">hr@lifewoodwebsite.com · lifewoodwebsite.com</p>
          </div>
        </div>
      ` : `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
         <div style="background:#046241;padding:32px 40px;text-align:center;">
            <div style="display:inline-block;background:#ffffff;padding:12px 28px;border-radius:50px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
              <img 
                src="https://lifewood-website-zlwn.vercel.app/lifewood-logo.png" 
                alt="Lifewood" 
                style="height:36px;width:auto;object-fit:contain;display:block;"
              />
            </div>
          </div>
          <div style="padding:32px 40px;">
            <p style="color:#133020;font-size:16px;margin:0 0 16px;">Dear <strong>${name}</strong>,</p>
            <p style="color:#444;line-height:1.7;margin:0 0 16px;">Thank you for applying for <strong>${position || 'the role'}</strong> at Lifewood.</p>
            <p style="color:#444;line-height:1.7;margin:0 0 16px;">After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
            <p style="color:#444;line-height:1.7;margin:0 0 24px;">We encourage you to apply again in the future when a suitable opportunity arises. We will keep your profile on file for upcoming roles.</p>
            <p style="color:#444;line-height:1.7;">We wish you all the best in your career journey.</p>
          </div>
          <div style="background:#f8f9fa;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="color:#133020;font-weight:700;margin:0 0 4px;">Lifewood Data Technology</p>
            <p style="color:#999;font-size:11px;margin:0;">hr@lifewoodwebsite.com · lifewoodwebsite.com</p>
          </div>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('Email send error:', emailErr);
  }

  return res.status(200).json({ ok: true });
}