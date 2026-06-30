import { NextRequest, NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";

import { db } from "@/db";
import { users, sessions } from "@/db/schema";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("id"));

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "ID user tidak valid" },
        { status: 400 }
      );
    }

    const sessionToken = req.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const now = new Date();

    const sessionResult = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.token, sessionToken),
          gt(sessions.expiresAt, now)
        )
      )
      .limit(1);

    if (sessionResult.length === 0) {
      return NextResponse.json(
        { message: "Session tidak valid atau sudah expired" },
        { status: 401 }
      );
    }

    const session = sessionResult[0];

    const requesterResult = await db
      .select({
        id: users.id,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (requesterResult.length === 0) {
      return NextResponse.json(
        { message: "User login tidak ditemukan" },
        { status: 401 }
      );
    }

    const requester = requesterResult[0];

    if (requester.status !== "active") {
      return NextResponse.json(
        { message: "Akun tidak aktif" },
        { status: 403 }
      );
    }

    if (requester.role !== "Super Admin" && requester.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden. Anda tidak memiliki akses menghapus user." },
        { status: 403 }
      );
    }

    if (requester.id === userId) {
      return NextResponse.json(
        { message: "Tidak bisa menghapus akun sendiri" },
        { status: 400 }
      );
    }

    const targetResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (targetResult.length === 0) {
      return NextResponse.json(
        { message: "User yang akan dihapus tidak ditemukan" },
        { status: 404 }
      );
    }

    const targetUser = targetResult[0];

    await db.delete(sessions).where(eq(sessions.userId, userId));

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json(
      {
        message: "User berhasil dihapus",
        deletedUser: targetUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_USER_ERROR]", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}