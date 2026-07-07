import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { and, eq, isNull, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/section";

export const runtime = "nodejs";

const MAX_RESET_ATTEMPTS = 5;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validatePassword(password: string) {
  return password.length >= 8;
}

async function incrementAttemptCount(resetTokenId: string) {
  await db
    .update(passwordResetTokens)
    .set({
      attemptCount: sql`${passwordResetTokens.attemptCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(passwordResetTokens.id, resetTokenId));
}

function invalidResetResponse() {
  return NextResponse.json(
    {
      message: "Link reset password tidak valid atau sudah kedaluwarsa.",
    },
    {
      status: 400,
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const emailParam = req.nextUrl.searchParams.get("email");

    const body = await req.json();

    const newPassword = String(body.newPassword ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");

    if (!token || !emailParam) {
      return invalidResetResponse();
    }

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          message: "Password baru dan konfirmasi password wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    const email = normalizeEmail(emailParam);
    const tokenHash = hashToken(token);

    const [resetToken] = await db
      .select({
        id: passwordResetTokens.id,
        userId: passwordResetTokens.userId,
        email: passwordResetTokens.email,
        expiresAt: passwordResetTokens.expiresAt,
        usedAt: passwordResetTokens.usedAt,
        attemptCount: passwordResetTokens.attemptCount,
      })
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.email, email),
          eq(passwordResetTokens.tokenHash, tokenHash)
        )
      )
      .limit(1);

    if (!resetToken) {
      return invalidResetResponse();
    }

    if (resetToken.usedAt) {
      return invalidResetResponse();
    }

    if (resetToken.expiresAt.getTime() < Date.now()) {
      return invalidResetResponse();
    }

    if (resetToken.attemptCount >= MAX_RESET_ATTEMPTS) {
      return invalidResetResponse();
    }

    if (newPassword !== confirmPassword) {
      await incrementAttemptCount(resetToken.id);

      return NextResponse.json(
        {
          message: "Konfirmasi password tidak sama.",
        },
        {
          status: 400,
        }
      );
    }

    if (!validatePassword(newPassword)) {
      await incrementAttemptCount(resetToken.id);

      return NextResponse.json(
        {
          message: "Password minimal 8 karakter.",
        },
        {
          status: 400,
        }
      );
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, resetToken.userId))
      .limit(1);

    if (!user) {
      return invalidResetResponse();
    }

    if (!user.email || normalizeEmail(user.email) !== email) {
      return invalidResetResponse();
    }

    if (user.status && user.status !== "active") {
      return invalidResetResponse();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const now = new Date();

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
          updatedAt: now,
        })
        .where(eq(users.id, user.id));

      await tx
        .update(passwordResetTokens)
        .set({
          usedAt: now,
          updatedAt: now,
        })
        .where(eq(passwordResetTokens.id, resetToken.id));

      await tx
        .update(passwordResetTokens)
        .set({
          usedAt: now,
          updatedAt: now,
        })
        .where(
          and(
            eq(passwordResetTokens.userId, user.id),
            isNull(passwordResetTokens.usedAt)
          )
        );
    });

    return NextResponse.json(
      {
        message: "Password berhasil diubah. Silakan login kembali.",
        redirectTo: "/login",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);

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