import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { users, sessions } from "@/db/section";

export const runtime = "nodejs";

const userIdSchema = z
  .string()
  .trim()
  .regex(/^USR-[0-9A-Za-z]{12}$/, "Format ID tidak valid");

const availableRoles = [
  "Super Admin",
  "Admin",
  "Perawat",
  "Pasien",
  "Finance",
  "Dokter",
  "Apoteker",
  "Laboratory",
] as const;

const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Nama minimal 3 karakter")
      .optional(),

    username: z
      .string()
      .trim()
      .min(3, "Username minimal 3 karakter")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Format email tidak valid")
      .optional(),

    status: z
      .string()
      .trim()
      .min(1, "Status tidak boleh kosong")
      .optional(),

    phone: z
      .string()
      .trim()
      .min(8, "Nomor telepon minimal 8 karakter")
      .nullable()
      .optional(),

    role: z
      .enum(availableRoles, {
        message: "Role tidak tersedia",
      })
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Tidak ada data yang dikirim",
  });

export async function PATCH(req: NextRequest) {
  try {
    /*
     * 1. Ambil ID user yang akan diubah.
     * Contoh:
     * PATCH /api/users?id=USR-AbCd12345678
     */
    const { searchParams } = new URL(req.url);
    const rawUserId = searchParams.get("id");

    const parsedUserId = userIdSchema.safeParse(rawUserId);

    if (!parsedUserId.success) {
      return NextResponse.json(
        {
          message: "User ID tidak valid",
          errors: parsedUserId.error.flatten().formErrors,
        },
        { status: 400 },
      );
    }

    const targetUserId = parsedUserId.data;

    /*
     * 2. Ambil session token dari cookie.
     */
    const sessionToken = req.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        {
          message: "Silakan login terlebih dahulu",
        },
        { status: 401 },
      );
    }

    /*
     * 3. Cari session berdasarkan token.
     *
     * Session dicari berdasarkan token saja agar kita dapat
     * membedakan session tidak ditemukan dan session expired.
     */
    const sessionResult = await db
      .select({
        id: sessions.id,
        userId: sessions.userId,
        expiresAt: sessions.expiresAt,
        lastActivity: sessions.lastActivity,
      })
      .from(sessions)
      .where(eq(sessions.token, sessionToken))
      .limit(1);

    if (sessionResult.length === 0) {
      const response = NextResponse.json(
        {
          message: "Session tidak ditemukan",
        },
        { status: 401 },
      );

      response.cookies.delete("session_token");

      return response;
    }

    const session = sessionResult[0];
    const now = new Date();

    /*
     * 4. Periksa waktu expired secara eksplisit.
     */
    if (session.expiresAt.getTime() <= now.getTime()) {
      await db
        .delete(sessions)
        .where(eq(sessions.id, session.id));

      const response = NextResponse.json(
        {
          message: "Session sudah expired, silakan login kembali",
        },
        { status: 401 },
      );

      response.cookies.delete("session_token");

      return response;
    }

    /*
     * 5. Cari user yang sedang login.
     */
    const requesterResult = await db
      .select({
        id: users.id,
        name: users.name,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (requesterResult.length === 0) {
      return NextResponse.json(
        {
          message: "User pemilik session tidak ditemukan",
        },
        { status: 401 },
      );
    }

    const requester = requesterResult[0];

    if (requester.status !== "active") {
      return NextResponse.json(
        {
          message: "Akun Anda sudah tidak aktif",
        },
        { status: 403 },
      );
    }

    /*
     * 6. Baca dan validasi body.
     */
    let rawBody: unknown;

    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        {
          message: "Request body harus berupa JSON",
        },
        { status: 400 },
      );
    }

    const parsedBody = updateUserSchema.safeParse(rawBody);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Data update tidak valid",
          errors: parsedBody.error.flatten(),
        },
        { status: 422 },
      );
    }

    const updateData = parsedBody.data;

    /*
     * 7. Cari user yang akan diedit.
     */
    const targetResult = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);

    if (targetResult.length === 0) {
      return NextResponse.json(
        {
          message: "User yang akan diubah tidak ditemukan",
        },
        { status: 404 },
      );
    }

    const target = targetResult[0];

    /*
     * Gunakan penulisan role yang konsisten.
     *
     * Jangan sebagian memakai "Admin" lalu sebagian memakai "admin".
     */
    const requesterIsAdmin =
      requester.role === "Admin" ||
      requester.role === "Super Admin";

    /*
     * 8. User biasa hanya boleh mengedit dirinya sendiri.
     *
     * Admin dan Super Admin boleh mengedit user lain.
     */
    const editingAnotherUser = requester.id !== targetUserId;

    if (editingAnotherUser && !requesterIsAdmin) {
      return NextResponse.json(
        {
          message: "Anda tidak memiliki izin untuk mengubah user lain",
        },
        { status: 403 },
      );
    }

    /*
     * 9. Cek apakah role benar-benar berubah.
     */
    const changingRole =
      updateData.role !== undefined &&
      updateData.role !== target.role;

    /*
     * Hanya Admin dan Super Admin yang boleh mengubah role.
     */
    if (changingRole && !requesterIsAdmin) {
      return NextResponse.json(
        {
          message: "Hanya Admin atau Super Admin yang boleh mengubah jabatan",
        },
        { status: 403 },
      );
    }

    /*
     * 10. Update user berdasarkan ID.
     *
     * Inilah bagian update yang sebenarnya.
     */
    const [updatedUser] = await db
      .update(users)
      .set({
        name: updateData.name,
        username: updateData.username,
        email: updateData.email,
        status: updateData.status,
        phone: updateData.phone,
        role: updateData.role,
        updatedAt: now,
      })
      .where(eq(users.id, targetUserId))
      .returning({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        status: users.status,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    /*
     * 11. Update aktivitas session.
     */
    await db
      .update(sessions)
      .set({
        lastActivity: now,
      })
      .where(eq(sessions.id, session.id));

    return NextResponse.json(
      {
        message: changingRole
          ? "Data dan jabatan user berhasil diubah"
          : "Data user berhasil diubah",
        data: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Users Error:", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat mengubah user",
      },
      { status: 500 },
    );
  }
}