import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. GET: Ambil semua data untuk ditampilkan di tabel Admin
export async function GET() {
  try {
    const jobs = await prisma.sideHustle.findMany({
      orderBy: { id: 'desc' } // Tampilkan data terbaru di paling atas
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// 2. POST: Tambah data baru dari form Admin ke TiDB
// 2. POST: Tambah data baru dari form Admin ke TiDB
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newJob = await prisma.sideHustle.create({
      data: {
        name: body.name,
        category: body.category,
        minCapital: Number(body.minCapital),
        timePerDay: Number(body.timePerDay),
        requiredSkill: body.requiredSkill,
        steps: body.steps,
        
        // --- TAMBAHAN WAJIB AGAR TIDAK ERROR (Data Default) ---
        vibe: "Fleksibel",
        targetProfit: "Menengah",
        riskWarning: "Harus konsisten dan tekun.",
        sustainability: 7, // Angka default
        barrierToEntry: 5, // Angka default
        profitPotential: 7 // Angka default
      }
    });
    return NextResponse.json(newJob);
  } catch (error) {
    console.error("Error Prisma:", error);
    return NextResponse.json({ error: "Gagal menambah data" }, { status: 500 });
  }
}

// 3. DELETE: Hapus data dari TiDB
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: "ID dibutuhkan" }, { status: 400 });

    await prisma.sideHustle.delete({
      where: { id: Number(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}

// 4. PUT: Update/Edit data yang sudah ada di TiDB
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Prisma membutuhkan ID untuk tahu data mana yang di-update
    const updatedJob = await prisma.sideHustle.update({
      where: { id: Number(body.id) },
      data: {
        name: body.name,
        category: body.category,
        minCapital: Number(body.minCapital),
        timePerDay: Number(body.timePerDay),
        requiredSkill: body.requiredSkill,
        steps: body.steps
      }
    });
    
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Error Update Prisma:", error);
    return NextResponse.json({ error: "Gagal mengupdate data" }, { status: 500 });
  }
}