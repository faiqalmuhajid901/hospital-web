// src/app/api/auth/employee/verify-otp/route.ts

import { NextResponse } from "next/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { db } from "@/db";
import { users, sessions, otp_requests } from "@/db/schema";
import {
  getRedirectByRole,
  isEmployeeRole,
} from "@/lib/employee-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const verifyOtpSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP harus 6 digit angka."),
});

type FailureBucket = {
  count: number;
  resetAt: number;
};

const otpFailureBuckets = new Map<string, FailureBucket>();

function getOtpPepper() {
  const pepper = process.env.OTP_PEPPER;

<<<<<<< HEAD
function getRedirectByRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  switch (normalizedRole) {
    case "super_admin":
      return "/dashboard/super_admin";

    case "admin":
      return "/dashboard/admin";

    case "dokter":
      return "/dashboard/dokter";

    case "nurse":
    case "perawat":
      return "/dashboard/perawat";

    case "pharmacist":
    case "apoteker":
      return "/dashboard/apoteker";

    case "laboratorium":
      return "/dashboard/laboratorium";

    case "pasien":
      return "/dashboard/pasien";

    case "employee":
    case "pegawai":
      return "/dashboard/pegawai";

    default:
      return "login";
=======
  if (!pepper && process.env.NODE_ENV === "production") {
    throw new Error("OTP_PEPPER wajib diisi di production.");
>>>>>>> 99c7eea (complete pull req)
  }

  return pepper ?? "dev-only-change-this-otp-pepper";
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      message: "OTP tidak valid atau sudah kedaluwarsa.",
    },
    { status: 401 }
  );
}

function registerOtpFailure(key: string, ttlMs: number) {
  const now = Date.now();
  const existing = otpFailureBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const bucket = {
      count: 1,
      resetAt: now + ttlMs,
    };

    otpFailureBuckets.set(key, bucket);

    return bucket;
  }

  existing.count += 1;
  otpFailureBuckets.set(key, existing);

  return existing;
}

function clearOtpFailure(key: string) {
  otpFailureBuckets.delete(key);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Data verifikasi OTP tidak valid.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const otp = parsed.data.otp;
    const ip = getClientIp(req);

    const ipLimit = checkRateLimit(
      `otp-verify-ip:${ip}`,
      10,
      60 * 1000
    );

    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          message: "Terlalu banyak percobaan verifikasi dari IP ini.",
        },
        { status: 429 }
      );
    }

    const emailLimit = checkRateLimit(
      `otp-verify-email:${email}`,
      5,
      60 * 1000
    );

    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          message: "Terlalu banyak percobaan OTP untuk email ini.",
        },
        { status: 429 }
      );
    }

    const foundUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        status: users.status,
        role: users.role,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (foundUsers.length === 0) {
      return unauthorizedResponse();
    }

    const user = foundUsers[0];

    if (!isEmployeeRole(user.role)) {
      return unauthorizedResponse();
    }

    if (user.status && user.status !== "active") {
      return NextResponse.json(
        {
          message: "Akun tidak aktif. Hubungi administrator.",
        },
        { status: 403 }
      );
    }

    const now = new Date();

    const otpRows = await db
      .select({
        id: otp_requests.id,
        email: otp_requests.email,
        otp_hash: otp_requests.otp_hash,
        expires_at: otp_requests.expires_at,
        created_at: otp_requests.created_at,
      })
      .from(otp_requests)
      .where(
        and(
          eq(otp_requests.email, email),
          gt(otp_requests.expires_at, now)
        )
      )
      .orderBy(desc(otp_requests.created_at))
      .limit(1);

    if (otpRows.length === 0) {
      return unauthorizedResponse();
    }

    const otpRow = otpRows[0];

    const failureKey = `otp-failure:${email}:${otpRow.id}`;

    const isOtpValid = await bcrypt.compare(
      `${otp}:${getOtpPepper()}`,
      otpRow.otp_hash
    );

    if (!isOtpValid) {
      const resetAt =
        otpRow.expires_at instanceof Date
          ? otpRow.expires_at.getTime()
          : Date.now() + 5 * 60 * 1000;

      const ttlMs = Math.max(resetAt - Date.now(), 60 * 1000);

      const failure = registerOtpFailure(failureKey, ttlMs);

      if (failure.count >= 3) {
        await db
          .delete(otp_requests)
          .where(eq(otp_requests.id, otpRow.id));

        clearOtpFailure(failureKey);

        return NextResponse.json(
          {
            message:
              "OTP salah 3 kali. OTP sudah dihapus. Silakan request OTP baru.",
          },
          { status: 429 }
        );
      }

      return unauthorizedResponse();
    }

    await db
      .delete(otp_requests)
      .where(eq(otp_requests.id, otpRow.id));

    clearOtpFailure(failureKey);

    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      userId: user.id,
      token: sessionToken,
      expiresAt: sessionExpiresAt,
      lastActivity: now,
    });

    const redirectTo = getRedirectByRole(user.role);

    const response = NextResponse.json(
      {
        message: "Verifikasi OTP berhasil.",
        redirectTo,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          status: user.status,
          role: user.role,
        },
      },
      { status: 200 }
    );
<<<<<<< HEAD
    response.cookies.set("session_token", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 1,
        });
=======
>>>>>>> 99c7eea (complete pull req)

    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set("hospital_user_id", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set("hospital_user_role", String(user.role ?? ""), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("[VERIFY_OTP_ERROR]", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat verifikasi OTP.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}