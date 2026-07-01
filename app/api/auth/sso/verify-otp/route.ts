import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { db } from "@/db";
import { users, sessions } from "@/db/schema";

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

const verifyOtpSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid.")
    .transform((value) => value.trim().toLowerCase()),
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP harus 6 digit angka."),
  accountType: z.literal("employee").optional(),
});

function normalizeRole(role: string | null | undefined) {
  return role?.trim().toLowerCase();
}

function isPatientRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  return normalizedRole === "patient" || normalizedRole === "pasien";
}

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
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Data OTP tidak valid.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { email, otp } = parsed.data;

    const otpRecord = otpStore.get(email);

    if (!otpRecord) {
      return NextResponse.json(
        {
          message: "OTP tidak ditemukan. Silakan kirim ulang OTP.",
        },
        { status: 400 }
      );
    }

    if (Date.now() > otpRecord.expiresAt) {
      otpStore.delete(email);

      return NextResponse.json(
        {
          message: "OTP sudah kedaluwarsa. Silakan kirim ulang OTP.",
        },
        { status: 400 }
      );
    }

    if (otpRecord.attempts >= 5) {
      otpStore.delete(email);

      return NextResponse.json(
        {
          message: "Terlalu banyak percobaan OTP. Silakan kirim ulang OTP.",
        },
        { status: 429 }
      );
    }

    otpRecord.attempts += 1;
    otpStore.set(email, otpRecord);

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isOtpValid) {
      return NextResponse.json(
        {
          message: "Kode OTP salah.",
        },
        { status: 401 }
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
      otpStore.delete(email);

      return NextResponse.json(
        {
          message: "User tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    const user = foundUsers[0];

    if (isPatientRole(user.role)) {
      otpStore.delete(email);

      return NextResponse.json(
        {
          message: "Login SSO hanya untuk karyawan rumah sakit.",
        },
        { status: 403 }
      );
    }

    if (user.status && user.status !== "active") {
      otpStore.delete(email);

      return NextResponse.json(
        {
          message: "Akun tidak aktif. Hubungi administrator.",
        },
        { status: 403 }
      );
    }
    const sessionToken = crypto.randomBytes(32).toString("hex");
        
            const now = new Date();
        
            // 5. absolute expiry (7 hari)
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 1);
        
            // 6. simpan session + lastActivity
            const insertResult = await db.insert(sessions).values({
            userId: user.id,
            token: sessionToken,
            expiresAt,
            lastActivity: now,
          });
            // console.log("Done insert");
    
            
    otpStore.delete(email);

    const redirectTo = getRedirectByRole(user.role);

    const response = NextResponse.json(
      {
        message: "Login employee berhasil.",
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
    response.cookies.set("session_token", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 1,
        });


    response.cookies.set("hospital_user_id", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    response.cookies.set("hospital_user_role", String(user.role ?? ""), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("[VERIFY_EMPLOYEE_OTP_ERROR]", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat verifikasi OTP.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}