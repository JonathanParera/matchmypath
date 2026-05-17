import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Library untuk membaca password enkripsi

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Kita tangkap 'email' dari form, bukan 'username' lagi
    const { email, password } = body; 

    // 1. Cari user berdasarkan Email saja
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    // Jika email tidak ada di database
    if (!user) {
      return NextResponse.json({ success: false, message: "Email tidak ditemukan!" }, { status: 401 });
    }

    // 2. Cocokkan password yang diketik dengan password enkripsi di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return NextResponse.json({ success: true, message: "Login berhasil!" });
    } else {
      return NextResponse.json({ success: false, message: "Password salah!" }, { status: 401 });
    }

  } catch (error) {
    console.error("Error Login:", error);
    return NextResponse.json({ success: false, message: "Gagal terhubung ke database." }, { status: 500 });
  }
}