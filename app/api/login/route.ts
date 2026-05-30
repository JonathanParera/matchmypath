import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Pastikan kamu sudah install bcryptjs

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body; 

    // 1. Cari user di database TiDB berdasarkan email
    // Kita gunakan findFirst atau findUnique
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    // Jika email tidak ditemukan di database
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "Akses Ditolak: Email tidak terdaftar di sistem. Silakan buat akun baru." 
      }, { status: 401 });
    }

    // 2. Cocokkan password yang diketik dengan enkripsi di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // 3. JIKA BERHASIL: Kembalikan data user ke frontend
      return NextResponse.json({ 
        success: true, 
        message: "Otorisasi Berhasil!",
        user: {
          name: user.name,
          email: user.email
        }
      });
    } else {
      // JIKA PASSWORD SALAH
      return NextResponse.json({ 
        success: false, 
        message: "Akses Ditolak: Kata sandi yang Anda masukkan salah." 
      }, { status: 401 });
    }

  } catch (error) {
    console.error("Error User Login:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Gangguan server database. Silakan coba lagi nanti." 
    }, { status: 500 });
  }
}