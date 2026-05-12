'use client'

import { useState } from 'react'
import { Rocket, Mail, Lock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { signIn } from 'next-auth/react' // Menggunakan NextAuth
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Memanggil fungsi signIn dari NextAuth
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    setLoading(false)

    if (res?.error) {
      alert(res.error) // Munculkan error jika password salah/email tidak ada
    } else {
      router.push('/') // Jika sukses, lempar ke halaman Dashboard utama
    }
  }

  return (
    <main className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-xl border border-slate-50 animate-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100 mb-6">
            <Rocket className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Selamat Datang!</h1>
          <p className="text-slate-400 font-medium text-center text-sm">Masuk untuk melanjutkan analisis Side Hustle kamu.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border-2 border-slate-50 py-4 pl-12 pr-4 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-sm transition-all" 
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border-2 border-slate-50 py-4 pl-12 pr-4 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-sm transition-all" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:bg-slate-300 mt-4 flex items-center justify-center gap-2">
            {loading ? 'MEMERIKSA...' : 'MASUK'} <ChevronRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-bold text-slate-500">
          Belum punya akun? <Link href="/register" className="text-blue-600 hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </main>
  )
}