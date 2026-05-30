import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// MENGAMBIL SELURUH DATA TOKEN
export async function GET() {
  try {
    const tokens = await prisma.token.findMany({
      orderBy: { createdAt: 'desc' } // Urutkan dari yang paling baru dibuat
    });
    return NextResponse.json({ success: true, tokens });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal mengambil data token" }, { status: 500 });
  }
}

// MEMBUAT TOKEN BARU
export async function POST(request: Request) {
  try {
    const { code, targetEmail } = await request.json();
    
    const newToken = await prisma.token.create({
      data: {
        code: code.toUpperCase(),
        targetEmail: targetEmail.toLowerCase()
      }
    });
    
    return NextResponse.json({ success: true, token: newToken });
  } catch (error) {
    console.error("Error Create Token:", error);
    return NextResponse.json({ success: false, message: "Gagal membuat token. Kode mungkin sudah ada." }, { status: 500 });
  }
}