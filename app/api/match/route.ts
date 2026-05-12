import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route" // Sesuaikan path jika perlu

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) // Ambil sesi user yang login
    const { modal, skill, target } = await req.json()

    // 1. Ambil semua data Side Hustle
    const allHustles = await prisma.sideHustle.findMany()

    // 2. Logika Perhitungan AHP (Sederhana)
    const results = allHustles.map(h => {
      let score = 0
      if (modal >= h.minCapital) score += 40
      if (skill === h.requiredSkill) score += 30
      if (target === h.targetProfit) score += 30
      
      const finalScore = Math.min(score + (Math.random() * 5), 100)
      return { ...h, finalScore: parseFloat(finalScore.toFixed(1)) }
    }).sort((a, b) => b.finalScore - a.finalScore)

    const topResults = results.slice(0, 3)

    // 3. SIMPAN KE DATABASE (Jika user sudah login)
    if (session?.user?.email && topResults.length > 0) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      const top3Json = JSON.stringify(topResults.map(r => ({ name: r.name, score: r.finalScore, category: r.category })))
      if (user) {
        await prisma.analysisHistory.create({
          data: {
            userId: user.id,
            sideHustleId: topResults[0].id, // Simpan pemenang nomor 1
            matchScore: topResults[0].finalScore,
            inputModal: parseFloat(modal),
            inputSkill: skill,
            top3Data: top3Json
          }
        })
      }
    }

    return NextResponse.json(topResults)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal memproses analisis" }, { status: 500 })
  }
}