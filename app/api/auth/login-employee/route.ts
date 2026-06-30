import { NextResponse } from "next/server";
import { or, eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { db } from "@/db";
import { users, sessions } from "@/db/schema";

export const runtime = "nodejs";

const loginEmployeeSchema = z.object({
  identity: z.string().min(1, "Username atau email wajib diisi."),
  password: z.string().min(1, "Password wajib diisi."),
});

function normalizeRole(role: string | null | undefined) {
  return role?.trim().toLowerCase();
}

function isEmployeeRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) return false;

  return [
    "dokter",
    "doctor",
    "perawat",
    "nurse",
    "apoteker",
    "pharmacist",
    "laboratorium",
    "laboratory",
    "lab",
    "akuntan",
    "accountant",
    "admin",
    "super_admin",
    "super admin",
    "employee",
    "pegawai",
  ].includes(normalizedRole);
}

function getRedirectByRole(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);

  switch (normalizedRole) {
    case "dokter":
    case "doctor":
      return "/dashboard/doctor";

    case "perawat":
    case "nurse":
      return "/dashboard/nurse";

    case "apoteker":
    case "pharmacist":
      return "/dashboard/pharmacy";

    case "laboratorium":
    case "laboratory":
    case "lab":
      return "/dashboard/laboratory";

    case "akuntan":
    case "accountant":
      return "/dashboard/billing";

    case "admin":
    case "super_admin":
    case "super admin":
    case "employee":
    case "pegawai":
      return "/dashboard/admin";

    default:
      return "/dashboard/admin";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginEmployeeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Data login tidak valid.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const identity = parsed.data.identity.trim().toLowerCase();
    const password = parsed.data.password;

    const foundUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        password: users.password,
        status: users.status,
        phone: users.phone,
        role: users.role,
      })
      .from(users)
      .where(or(eq(users.email, identity), eq(users.username, identity)))
      .limit(1);

    if (foundUsers.length === 0) {
      return NextResponse.json(
        {
          message: "Username/email atau password salah.",
        },
        { status: 401 }
      );
    }

    const user = foundUsers[0];

    if (!isEmployeeRole(user.role)) {
      return NextResponse.json(
        {
          message: "Akun ini bukan akun karyawan rumah sakit.",
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: "Username/email atau password salah.",
        },
        { status: 401 }
      );
    }

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
        console.log("Done insert");

        response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 1,
    });

    response.cookies.set("hospital_user_id", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 1,
    });

    response.cookies.set("hospital_user_role", String(user.role ?? ""), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 1,
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_EMPLOYEE_ERROR]", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat login employee.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}