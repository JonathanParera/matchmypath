import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route" // <-- 1. Kita import authOptions

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 2. Kita masukkan authOptions ke dalam getServerSession
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) return NextResponse.json([])

    const history = await prisma.analysisHistory.findMany({
      where: { userId: user.id },
      include: { sideHustle: true }, 
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const formattedHistory = history.map(h => ({
      id: h.id,
      date: h.createdAt.toLocaleString('id-ID'),
      topResult: h.sideHustle.name,
      score: h.matchScore,
      config: {
        modal: h.inputModal,
        skill: h.inputSkill
      },
      top3: h.top3Data ? JSON.parse(h.top3Data) : [] 
    }))

    return NextResponse.json(formattedHistory)
  } catch (error) {
    console.error("Error di API History:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}