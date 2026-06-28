import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

const IDLE_LIMIT_MINUTES = 15;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session_token")?.value;

  const protectedPaths = ["/dashboard", "/admin", "/api"];

  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) return NextResponse.next();

  // 1. tidak ada token → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. cari session
  const sessionResult = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  if (sessionResult.length === 0) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const session = sessionResult[0];
  const now = new Date();

  // 3. cek expired (absolute session 7 hari)
  if (new Date(session.expiresAt) < now) {
    await db.delete(sessions).where(eq(sessions.token, token));

    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("session_token", "", {
      expires: new Date(0),
      path: "/",
    });

    return res;
  }

  // 4. cek idle timeout (15 menit)
  const diffMs = now.getTime() - new Date(session.lastActivity).getTime();
  const diffMinutes = diffMs / 1000 / 60;

  if (diffMinutes > IDLE_LIMIT_MINUTES) {
    // hapus session
    await db.delete(sessions).where(eq(sessions.token, token));

    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("session_token", "", {
      expires: new Date(0),
      path: "/",
    });

    return res;
  }

  // 5. update last activity (SLIDING SESSION)
  await db
    .update(sessions)
    .set({ lastActivity: now })
    .where(eq(sessions.token, token));

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/:path*"],
};