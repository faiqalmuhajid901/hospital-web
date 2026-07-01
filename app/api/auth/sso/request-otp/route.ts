// src/app/api/auth/employee/request-otp/route.ts

import { NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { db } from "@/db";
import { users, otp_requests } from "@/db/schema";
import { isEmployeeRole } from "@/lib/employee-auth";
import { sendOtpEmail } from "@/lib/mail";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const requestOtpSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
});

function getOtpPepper() {
  const pepper = process.env.OTP_PEPPER;

  if (!pepper && process.env.NODE_ENV === "production") {
    throw new Error("OTP_PEPPER wajib diisi di production.");
  }

  return pepper ?? "dev-only-change-this-otp-pepper";
}

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function safeSuccessResponse() {
  return NextResponse.json(
    {
      message:
        "Jika email terdaftar sebagai karyawan aktif, kode OTP akan dikirim.",
    },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Data request OTP tidak valid.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const ip = getClientIp(req);

    const ipLimit = checkRateLimit(
      `otp-request-ip:${ip}`,
      3,
      60 * 1000
    );

    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          message: "Terlalu banyak request OTP dari IP ini. Coba lagi 1 menit.",
        },
        { status: 429 }
      );
    }

    const emailLimit = checkRateLimit(
      `otp-request-email:${email}`,
      1,
      60 * 1000
    );

    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          message:
            "OTP sudah diminta. Tunggu minimal 1 menit sebelum meminta lagi.",
        },
        { status: 429 }
      );
    }

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
      message:
        "email tidak ditemukan",
    },
    { status: 200 }
  );
    }

    const user = foundUsers[0];

    if (!isEmployeeRole(user.role)) {
      return NextResponse.json(
    {
      message:
        "bukan seorang employee",
    },
    { status: 200 }
  );
    }

    if (user.status && user.status !== "active") {
      return NextResponse.json(
    {
      message:
        "email tidak aktif",
    },
    { status: 200 }
  );
    }

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const requestsInLastMinute = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(otp_requests)
      .where(
        and(
          eq(otp_requests.email, email),
          gte(otp_requests.created_at, oneMinuteAgo)
        )
      );

    if (Number(requestsInLastMinute[0]?.count ?? 0) >= 1) {
      return NextResponse.json(
        {
          message: "OTP sudah dikirim. Tunggu minimal 1 menit.",
        },
        { status: 429 }
      );
    }

    await db
      .delete(otp_requests)
      .where(eq(otp_requests.email, email));

    const otp = generateOtp();

    const otpHash = await bcrypt.hash(
      `${otp}:${getOtpPepper()}`,
      12
    );

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.insert(otp_requests).values({
      email,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });

    await sendOtpEmail({
      to: email,
      name: user.name,
      otp,
    });

    return safeSuccessResponse();
  } catch (error) {
    console.error("[REQUEST_OTP_ERROR]", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat request OTP.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}