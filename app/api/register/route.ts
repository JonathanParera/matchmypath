import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // 1. Cek apakah email sudah terdaftar di database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: "Email sudah digunakan!" }, { status: 400 })
    }

    // 2. Enkripsi password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Simpan data user baru ke database MySQL
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json({ message: "Registrasi berhasil!" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 })
  }
}