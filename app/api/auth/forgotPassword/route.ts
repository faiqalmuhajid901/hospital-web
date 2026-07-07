import { createHash, randomBytes } from "crypto";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/section";
import { sendPasswordResetEmail } from "@/lib/mail";

export const runtime = "nodejs";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  const realIp = req.headers.get("x-real-ip");

  if (realIp) {
    return realIp;
  }

  return null;
}

function buildResetUrl(req: NextRequest, token: string, email: string) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    req.nextUrl.origin;

  const url = new URL("/reset-password", appUrl);

  url.searchParams.set("token", token);
  url.searchParams.set("email", email);

  return url.toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          message: "Email wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    const genericSuccessResponse = NextResponse.json(
      {
        message:
          "Jika email terdaftar, link reset password akan dikirim ke email tersebut.",
      },
      {
        status: 200,
      }
    );

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        status: users.status,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return genericSuccessResponse;
    }

    if (!user.email) {
      return genericSuccessResponse;
    }

    if (user.status && user.status !== "active") {
      return genericSuccessResponse;
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const ipAddress = getClientIp(req);
    const userAgent = req.headers.get("user-agent");

    await db
      .update(passwordResetTokens)
      .set({
        usedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(passwordResetTokens.userId, user.id),
          isNull(passwordResetTokens.usedAt)
        )
      );

    await db.insert(passwordResetTokens).values({
      userId: user.id,
      email: user.email.toLowerCase(),
      tokenHash,
      expiresAt,
      ipAddress,
      userAgent,
      attemptCount: 0,
    });

    const resetUrl = buildResetUrl(req, rawToken, user.email.toLowerCase());

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    return genericSuccessResponse;
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server.",
      },
      {
        status: 500,
      }
    );
  }
}