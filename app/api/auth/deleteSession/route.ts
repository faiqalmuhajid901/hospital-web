import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import { eq, and, gt } from "drizzle-orm";
import { users, sessions } from "@/db/section";
import { error } from "console";

export const runtime = "nodejs"
const reqFrontend = z
  .string()
  .trim()
  .regex(/^USR-[0-9A-Za-z]{12}$/, "Format ID tidak Valid")


export async function DELETE(req:NextRequest) {
  try{
    const { searchParams } = new URL(req.url)
    const rawUserId = searchParams.get("id");
    const parsedUserId = reqFrontend.safeParse(rawUserId)

    if (!parsedUserId.success){
      return NextResponse.json(
        {
          message: "User ID tidak valid",
          errors: parsedUserId.error.flatten().formErrors,
        },
        {status : 402}
      )
    }
    const userId = parsedUserId.data

    const sessionsToken = req.cookies.get("session_token")?.value
    if (!sessionsToken){
      return NextResponse.json({
        message: "Lakukan login terlebih dahulu"
        
      },
    {status: 400}
    )}
   const now = new Date()
   const sessionResult = await db 
   .select({
    id: sessions.id,
    userId : sessions.userId,
    token : sessions.token,
    expiresAt : sessions.expiresAt
   }) 
   .from(sessions)
   .where(
    and(
      eq(sessions.token, sessionsToken),
      gt(sessions.expiresAt, now)
    )
   )
   .limit(1)

   if(sessionResult.length === 0){
    return NextResponse.json({
      message: "Session tidak valid"
    },
    {status: 400}
  )}
  const session = sessionResult[0]

  const requesterResult = await db
      .select({
        id: users.id,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

      if(requesterResult.length === 0){
        return NextResponse.json({
          message: "User tidak ditemukan"
        }, {status: 400})
      }

      const request = requesterResult[0]
      
      if(request.status !== "active"){
        return NextResponse.json({
        message: "User sudah tidak active"
        }, {status: 400})
      }
      if (request.role !== "Super Admin" && request.role !== "admin"){
        return NextResponse.json({
          message: "User tidak boleh mengotak atik"
        }, {status: 400})
      }
      if(session.id === userId){
        return NextResponse.json({
          message: "Tidak bisa menghapus akun sendiri"
        }, {status: 400})
      }
      const targetDelete = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
      if (targetDelete.length === 0){
        return NextResponse.json({
          message: "Data tidak ditemukan"
        }, {status: 400})
      }
      const target = targetDelete[0]
      
      const deletedSession = await db.transaction(async(tx)=> {
        await tx 
        .delete(sessions)
        .where(eq(sessions.userId, userId))
      } )
      return NextResponse.json({
        message: "Session berhasil dihapus"
      }, {status: 200})
  }
  catch{
    console.error("Delete Session Error", error);
    return NextResponse.json({
      message: "Error delete Session"
    }, {status: 404})
  }
}