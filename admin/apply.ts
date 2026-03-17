import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed.');

  const form = formidable({ maxFileSize: 5 * 1024 * 1024 });

  const [fields, files] = await form.parse(req);

  const firstName = fields.firstName?.[0] || '';
  const lastName = fields.lastName?.[0] || '';
  const age = fields.age?.[0] || '';
  const email = fields.email?.[0] || '';
  const degree = fields.degree?.[0] || '';
  const project = fields.project?.[0] || '';
  const experience = fields.experience?.[0] || '';

  if (!firstName || !lastName || !email || !project) {
    return res.status(400).send('Missing required fields.');
  }

  let cvFilename = null;
  let cvUrl = null;

  // Handle CV upload to Supabase Storage
  const cvFile = files.cv?.[0];
  if (cvFile) {
    const ext = cvFile.originalFilename?.split('.').pop() || 'pdf';
    const allowedExts = ['pdf', 'doc', 'docx'];
    if (!allowedExts.includes(ext.toLowerCase())) {
      return res.status(400).send('Unsupported file type.');
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    cvFilename = cvFile.originalFilename;

    try {
      const fileBuffer = fs.readFileSync(cvFile.filepath);
      const { error: storageErr } = await supabase.storage
        .from('cvs')
        .upload(fileName, fileBuffer, {
          contentType: ext === 'pdf' ? 'application/pdf' : 'application/msword',
        });

      if (!storageErr) {
        const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(fileName);
        cvUrl = urlData?.publicUrl || null;
      } else {
        console.error('Storage error:', storageErr);
      }
    } catch (err) {
      console.error('CV upload error:', err);
    }
  }

  // Save to Supabase DB
  const { error: dbErr } = await supabase.from('applications').insert({
    first_name: firstName,
    last_name: lastName,
    age: age || null,
    email,
    degree: degree || null,
    position: project,
    experience: experience || null,
    cv_filename: cvFilename,
    cv_url: cvUrl,
  });
  if (dbErr) console.error('Supabase insert error:', dbErr);

  // Send email to admin
  if (ADMIN_EMAIL) {
    await resend.emails.send({
      from: 'Lifewood Website <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `🧑‍💼 New Application from ${firstName} ${lastName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e5e5;border-radius:12px;">
          <div style="background:#046241;padding:20px 24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px;">
            <h1 style="color:white;margin:0;font-size:20px;">New Job Application</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">Lifewood Careers</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;font-size:13px;width:140px;">Full Name</td><td style="padding:8px 0;font-weight:600;color:#133020;">${firstName} ${lastName}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#046241;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:13px;">Age</td><td style="padding:8px 0;font-weight:600;color:#133020;">${age || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:13px;">Degree</td><td style="padding:8px 0;font-weight:600;color:#133020;">${degree || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:13px;">Position</td><td style="padding:8px 0;font-weight:600;color:#133020;">${project}</td></tr>
          </table>
          ${experience ? `
          <div style="margin-top:16px;padding:16px;background:#f8f9fa;border-radius:8px;border-left:4px solid #046241;">
            <p style="margin:0;color:#666;font-size:12px;margin-bottom:8px;">EXPERIENCE</p>
            <p style="margin:0;color:#133020;line-height:1.6;">${experience}</p>
          </div>` : ''}
          ${cvUrl ? `
          <div style="margin-top:16px;">
            <a href="${cvUrl}" style="display:inline-block;padding:10px 20px;background:#FFC370;color:#133020;font-weight:700;border-radius:8px;text-decoration:none;">📎 Download CV</a>
          </div>` : ''}
          <p style="margin-top:24px;color:#999;font-size:12px;text-align:center;">Received at ${new Date().toLocaleString()}</p>
        </div>
      `,
    });
  }

  return res.status(200).json({ ok: true });
}