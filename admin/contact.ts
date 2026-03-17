import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed.');

  const { fullName, email, inquiryType, message } = req.body || {};
  if (!fullName || !email || !inquiryType || !message) {
    return res.status(400).send('Missing required fields.');
  }

  // Save to Supabase
  const { error: dbErr } = await supabase.from('inquiries').insert({
    full_name: fullName,
    email,
    inquiry_type: inquiryType,
    message,
  });
  if (dbErr) console.error('Supabase insert error:', dbErr);

  // Send email to admin
  if (ADMIN_EMAIL) {
    await resend.emails.send({
      from: 'Lifewood Website <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `📩 New Inquiry from ${fullName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e5e5;border-radius:12px;">
          <div style="background:#046241;padding:20px 24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px;">
            <h1 style="color:white;margin:0;font-size:20px;">New Contact Inquiry</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">Lifewood Website</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;font-size:13px;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;color:#133020;">${fullName}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#046241;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:13px;">Inquiry Type</td><td style="padding:8px 0;font-weight:600;color:#133020;">${inquiryType}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f8f9fa;border-radius:8px;border-left:4px solid #046241;">
            <p style="margin:0;color:#666;font-size:12px;margin-bottom:8px;">MESSAGE</p>
            <p style="margin:0;color:#133020;line-height:1.6;">${message}</p>
          </div>
          <p style="margin-top:24px;color:#999;font-size:12px;text-align:center;">Received at ${new Date().toLocaleString()}</p>
        </div>
      `,
    });
  }

  return res.status(200).json({ ok: true });
}