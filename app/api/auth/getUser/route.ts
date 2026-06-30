import { NextRequest, NextResponse } from "next/server";
import { and, asc, count, eq, gt } from "drizzle-orm";

import { db } from "@/db";
import { users, sessions } from "@/db/schema";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const now = new Date();

    // 1. Cek session
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

    // 2. Ambil user yang sedang login
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

    // 3. Hanya super admin yang boleh lihat semua user
    if (requester.role !== "Super Admin" && requester.role !== "Admin") {
      return NextResponse.json(
        { message: "Forbidden. Anda tidak memiliki akses melihat semua user." },
        { status: 403 }
      );
    }

    // 4. Ambil query pagination dari URL
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);

    const safePage = Number.isInteger(page) && page > 0 ? page : 1;

    const safePageSize =
      Number.isInteger(pageSize) && pageSize > 0 && pageSize <= 100
        ? pageSize
        : 10;

    const offset = (safePage - 1) * safePageSize;

    // 5. Hitung total user
    const totalResult = await db
      .select({
        value: count(),
      })
      .from(users);

    const totalItems = Number(totalResult[0]?.value ?? 0);
    const totalPages = Math.ceil(totalItems / safePageSize);

    // 6. Ambil user sesuai halaman
    const userList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .orderBy(asc(users.id))
      .limit(safePageSize)
      .offset(offset);

    return NextResponse.json(
      {
        message: "Data user berhasil diambil",
        users: userList,
        pagination: {
          page: safePage,
          pageSize: safePageSize,
          totalItems,
          totalPages,
          hasNextPage: safePage < totalPages,
          hasPrevPage: safePage > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET_USERS_PAGINATION_ERROR]", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}