import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, email } = await request.json();

    // 1. Cari token di database
    const existingToken = await prisma.token.findUnique({
      where: { code: token }
    });

    // 2. Jika token tidak ditemukan sama sekali
    if (!existingToken) {
      return NextResponse.json({ success: false, message: "Token tidak dikenali oleh sistem!" }, { status: 400 });
    }

    // 3. KEAMANAN BARU: Cocokkan email pengguna dengan email target token
    if (existingToken.targetEmail !== email) {
      return NextResponse.json({ 
        success: false, 
        message: "Akses Ditolak: Token ini milik akun lain dan tidak dapat digunakan pada email Anda!" 
      }, { status: 403 });
    }

    // 4. Jika token sudah pernah dipakai
    if (existingToken.isUsed) {
      return NextResponse.json({ success: false, message: "Token ini sudah hangus/pernah digunakan!" }, { status: 400 });
    }

    // 5. Jika semua valid, ubah status token menjadi HANGUS
    await prisma.token.update({
      where: { id: existingToken.id },
      data: { 
        isUsed: true,
        usedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, message: "Verifikasi Cocok. Akses PRO berhasil dibuka!" });

  } catch (error) {
    console.error("Error Token Validation:", error);
    return NextResponse.json({ success: false, message: "Gangguan server database." }, { status: 500 });
  }
}