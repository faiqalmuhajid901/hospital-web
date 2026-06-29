import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

import { db } from "@/db";
import { users } from "@/db/section/auth";

export const runtime = "nodejs";

type OtpRecord = {
  email: string;
  userId: number | string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
};

const globalStore = globalThis as typeof globalThis & {
  __hospitalEmployeeOtpStore?: Map<string, OtpRecord>;
};

const otpStore =
  globalStore.__hospitalEmployeeOtpStore ??
  (globalStore.__hospitalEmployeeOtpStore = new Map<string, OtpRecord>());

const requestOtpSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid.")
    .transform((value) => value.trim().toLowerCase()),
  accountType: z.literal("employee").optional(),
});

function normalizeRole(role: string | null | undefined) {
  return role?.trim().toLowerCase();
}

function isPatientRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  return normalizedRole === "patient" || normalizedRole === "pasien";
}

function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

async function sendOtpEmail(params: {
  email: string;
  name: string | null;
  otp: string;
}) {
  const { email, name, otp } = params;

  /*
    DEVELOPMENT MODE:
    Untuk sekarang OTP ditampilkan di terminal.
    Nanti kalau sudah siap kirim email sungguhan, fungsi ini bisa diganti
    pakai Nodemailer, Resend, SMTP kantor, atau service email lain.
  */

  console.log("======================================");
  console.log("[EMPLOYEE_SSO_OTP]");
  console.log("Kepada :", email);
  console.log("Nama   :", name ?? "-");
  console.log("OTP    :", otp);
  console.log("Expired: 5 menit");
  console.log("======================================");
}
export async function GET() {
  return NextResponse.json({
    message: "GET request-otp endpoint aktif",
  });
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Data tidak valid.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { email } = parsed.data;

    const foundUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        status: users.status,
        role: users.role,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (foundUsers.length === 0) {
      return NextResponse.json(
        {
          message: "Email karyawan tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    const user = foundUsers[0];

    if (isPatientRole(user.role)) {
      return NextResponse.json(
        {
          message: "Login SSO hanya untuk karyawan rumah sakit.",
        },
        { status: 403 }
      );
    }

    if (user.status && user.status !== "active") {
      return NextResponse.json(
        {
          message: "Akun tidak aktif. Hubungi administrator.",
        },
        { status: 403 }
      );
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    otpStore.set(email, {
      email,
      userId: user.id,
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });

    await sendOtpEmail({
      email,
      name: user.name,
      otp,
    });

    return NextResponse.json(
      {
        message: "Kode OTP telah dikirim ke email karyawan.",
        devOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[REQUEST_EMPLOYEE_OTP_ERROR]", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat mengirim OTP.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}