import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

// KITA EXPORT BAGIAN INI AGAR BISA DIPAKAI DI FILE LAIN
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi!")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error("Email tidak ditemukan!")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Password salah!")
        }

        return { id: user.id.toString(), name: user.name, email: user.email }
      }
    })
  ],
  session: { strategy: "jwt" as const },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET || "rahasia_super_aman_123",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }