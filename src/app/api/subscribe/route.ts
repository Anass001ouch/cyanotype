import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Save to DB
    // We use upsert so if they already subscribed, we don't crash
    const subscriber = await db.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Send email to admin
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'Anasouch9@gmail.com',
        subject: `New Drop Subscriber!`,
        html: `
          <h2>New Drop Subscriber</h2>
          <p>You have a new subscriber for your upcoming drops.</p>
          <p><strong>Email:</strong> ${email}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.warn('EMAIL_USER or EMAIL_PASS not set. Skipping email notification.');
    }

    return NextResponse.json({ success: true, subscriber }, { status: 201 });
  } catch (error: any) {
    console.error('Error in subscribe route:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
