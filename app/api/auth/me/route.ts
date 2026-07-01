import { NextRequest, NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";

export const runtime = "nodejs";

function normalizeRole(role?: string | null) {
  const normalizedRole = role?.trim().toLowerCase();

  if (!normalizedRole) return "guest";

  if (["admin"].includes(normalizedRole)) {
    return "admin";
  }
  if (["super-admin"].includes(normalizedRole)) {
    return "super-admin";
  }

  if (["dokter"].includes(normalizedRole)) {
    return "dokter";
  }

  if (["pasien"].includes(normalizedRole)) {
    return "pasien";
  }

  if (["perawat"].includes(normalizedRole)) {
    return "perawat";
  }

  if (["apoteker"].includes(normalizedRole)) {
    return "apoteker";
  }

  if (["laboratorium"].includes(normalizedRole)) {
    return "laboratorium";
  }

  return "guest";
}

function getRoleLabel(role?: string | null) {
  const normalizedRole = normalizeRole(role);

  const labels: Record<string, string> = {
    guest: "Tamu",
    admin: "Super Admin",
    dokter: "Dokter",
    pasien: "Pasien",
    perawat: "Perawat",
    apoteker: "Farmasi",
    laboratorium: "Laboratorium",
  };

  return labels[normalizedRole] ?? "Tamu";
}

function getInitials(name?: string | null) {
  if (!name) return "U";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "U";
}

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        { status: 401 }
      );
    }

    const now = new Date();

    const rows = await db
      .select({
        sessionId: sessions.id,
        userId: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        status: users.status,
        role: users.role,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.token, sessionToken), gt(sessions.expiresAt, now)))
      .limit(1);

    if (rows.length === 0) {
      const response = NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        { status: 401 }
      );

      response.cookies.delete("session_token");
      response.cookies.delete("hospital_user_id");
      response.cookies.delete("hospital_user_role");

      return response;
    }

    const currentUser = rows[0];
    const normalizedRole = normalizeRole(currentUser.role);

    await db
      .update(sessions)
      .set({
        lastActivity: now,
      })
      .where(eq(sessions.id, currentUser.sessionId));

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: currentUser.userId,
          name: currentUser.name,
          username: currentUser.username,
          email: currentUser.email,
          phone: currentUser.phone,
          status: currentUser.status,
          role: normalizedRole,
          roleLabel: getRoleLabel(currentUser.role),
          avatarInitials: getInitials(currentUser.name),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AUTH_ME_ERROR]", error);

    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        message: "Gagal membaca session user.",
      },
      { status: 500 }
    );
  }
}