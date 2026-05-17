import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Gunakan Prisma untuk memanggil TiDB
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { modal, waktu, skill } = body;

    // 1. Ambil SEMUA data 50 pekerjaan dari TiDB
    const allJobs = await prisma.sideHustle.findMany();

    // 2. Proses AHP (Pembobotan)
    const scoredJobs = allJobs.map((job) => {
      let modalScore = 0;
      let waktuScore = 0;
      let skillScore = 0;

      // Kriteria 1: Modal (Makin mendekati/di bawah modal user, skor makin tinggi)
      if (job.minCapital <= modal) modalScore = 100;
      else if (job.minCapital <= modal + 500000) modalScore = 70;
      else modalScore = 30;

      // Kriteria 2: Waktu (Makin cocok dengan waktu luang, makin bagus)
      if (job.timePerDay <= waktu) waktuScore = 100;
      else if (job.timePerDay <= waktu + 60) waktuScore = 80;
      else waktuScore = 40;

      // Kriteria 3: Keahlian (Sesuai atau tidak)
      if (job.requiredSkill.toLowerCase().includes(skill.toLowerCase())) skillScore = 100;
      else skillScore = 50;

      // Rumus Akhir AHP (Contoh: Modal 40%, Waktu 30%, Skill 30%)
      const finalScore = (modalScore * 0.4) + (waktuScore * 0.3) + (skillScore * 0.3);

      return {
        ...job,
        matchScore: Math.round(finalScore)
      };
    });

    // 3. Urutkan dari skor tertinggi (Ranking) dan ambil Top 3
    const top3 = scoredJobs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

    return NextResponse.json(top3);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghitung AHP" }, { status: 500 });
  }
}