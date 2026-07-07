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


type SendPasswordResetEmailParams = {
  to: string;
  name?: string | null;
  resetUrl: string;
};


export async function sendPasswordResetEmail(
  params: SendPasswordResetEmailParams
) {
  const {
    to,
    name,
    resetUrl,
  } = params;


  if (!process.env.SMTP_HOST) {
    console.log(
      `[RESET_PASSWORD_DUMMY_MODE]
      Email: ${to}
      URL: ${resetUrl}`
    );

    return;
  }


  const transporter =
    nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(
        process.env.SMTP_PORT ?? 587
      ),
      secure:
        process.env.SMTP_SECURE === "true",

      auth:
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
          ? {
              user:
                process.env.SMTP_USER,
              pass:
                process.env.SMTP_PASS,
            }
          : undefined,
    });


  await transporter.sendMail({

    from:
      process.env.SMTP_FROM ??
      process.env.SMTP_USER,


    to,


    subject:
      "Reset Password Akun",


    text:
`Halo ${name ?? "User"}

Kami menerima permintaan reset password.

Klik link berikut:
${resetUrl}

Link berlaku selama 15 menit.

Jika bukan Anda, abaikan email ini.
`,


    html:
`
<p>
Halo ${name ?? "User"}
</p>

<p>
Kami menerima permintaan reset password akun Anda.
</p>


<p>
Klik tombol berikut:
</p>


<a href="${resetUrl}"
style="
background:#2563eb;
color:white;
padding:12px 20px;
border-radius:6px;
text-decoration:none;
">
Reset Password
</a>


<p>
Link berlaku selama 5 menit.
</p>


<p>
Jika Anda tidak meminta perubahan password,
abaikan email ini.
</p>

`,
  });
}