// src/lib/mail.ts

import nodemailer from "nodemailer";

type SendOtpEmailParams = {
  to: string;
  name?: string | null;
  otp: string;
};

export async function sendOtpEmail(params: SendOtpEmailParams) {
  const { to, name, otp } = params;

  if (!process.env.SMTP_HOST) {
    console.log(`[OTP_DUMMY_MODE] Email: ${to} | OTP: ${otp}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    subject: "Kode OTP Login Karyawan",
    text: `Halo ${name || "User"}, kode OTP login Anda adalah ${otp}. Kode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapa pun.`,
    html: `
      <p>Halo ${name || "User"},</p>
      <p>Kode OTP login Anda adalah:</p>
      <h2>${otp}</h2>
      <p>Kode ini berlaku selama 5 menit.</p>
      <p>Jangan berikan kode ini kepada siapa pun.</p>
    `,
  });
}