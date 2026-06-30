import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { or, eq } from "drizzle-orm";

import { db } from "@/db";
import { users, sessions } from "@/db/schema";

const IDLE_LIMIT_MINUTES = 15;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identity, password } = body;

    // 1. cari user
    const userResult = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, identity),
          eq(users.username, identity)
        )
      )
      .limit(1);
    if (userResult.length === 0) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // cek status user
    if (user.status === "suspended") {
      return NextResponse.json(
        { message: "account was suspended" },
        { status: 403 }
      );
    }

    if (user.status === "inactive") {
      return NextResponse.json(
        { message: "account was inactive" },
        { status: 403 }
      );
    }
    // 2. cek password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { message: "Password salah" },
        { status: 401 }
      );
    }

    // 3. cek status user
    if (user.status && user.status !== "active") {
      return NextResponse.json(
        { message: "Akun tidak aktif" },
        { status: 403 }
      );
    }

    // 4. generate session token
    const sessionToken = crypto.randomBytes(32).toString("hex");

    const now = new Date();

    // 5. absolute expiry (7 hari)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    // 6. simpan session + lastActivity
    await db.insert(sessions).values({
      userId: user.id,
      token: sessionToken,
      expiresAt,
      lastActivity: now,
    });

    // 7. response
    const response = NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });

    // 8. cookie session
    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 1,
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
    console.error("[LOGIN_ERROR]", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}