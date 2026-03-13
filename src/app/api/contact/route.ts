import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { name, email, company, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL;
    if (!apiKey || !recipientEmail) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const subjectLine = subject
      ? `[Portfolio] ${subject}: message from ${name}`
      : `[Portfolio] New message from ${name}`;

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [recipientEmail],
      replyTo: email,
      subject: subjectLine,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#09090b;color:#e2e8f0;border-radius:12px;border:1px solid #1e1e2e">
          <h2 style="margin:0 0 20px;color:#a78bfa;font-size:20px">New Portfolio Message</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#94a3b8;width:100px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#818cf8">${email}</a></td></tr>
            ${company ? `<tr><td style="padding:8px 0;color:#94a3b8">Company</td><td style="padding:8px 0">${company}</td></tr>` : ''}
            ${subject ? `<tr><td style="padding:8px 0;color:#94a3b8">Subject</td><td style="padding:8px 0">${subject}</td></tr>` : ''}
          </table>
          <hr style="border:none;border-top:1px solid #1e1e2e;margin:20px 0" />
          <h3 style="margin:0 0 12px;color:#94a3b8;font-size:14px;text-transform:uppercase;letter-spacing:0.05em">Message</h3>
          <p style="margin:0;line-height:1.7;white-space:pre-wrap">${message}</p>
          <hr style="border:none;border-top:1px solid #1e1e2e;margin:20px 0" />
          <p style="margin:0;font-size:12px;color:#4b5563">Sent from akshatbanga.net portfolio — reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
