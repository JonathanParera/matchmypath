'use client'

import { useState } from 'react'
import { Rocket, Mail, Lock, User, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Tambahkan ini untuk redirect

export default function RegisterPage() {
  const router = useRouter() // Inisialisasi router
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Pendaftaran Berhasil! Silakan Login.")
        router.push('/login') // Otomatis pindah ke halaman login
      } else {
        alert(data.message) // Munculkan error jika email sudah ada
      }
    } catch (error) {
      alert("Gagal terhubung ke server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-xl border border-slate-50 animate-in slide-in-from-bottom-5 duration-500">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-900 p-3 rounded-2xl shadow-lg mb-6">
            <Rocket className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Buat Akun</h1>
          <p className="text-slate-400 font-medium text-center text-sm">Mulai petualangan karir sampinganmu.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                className="w-full bg-slate-50 border-2 border-slate-50 py-4 pl-12 pr-4 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-sm transition-all" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

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
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:bg-slate-300 mt-6 flex items-center justify-center gap-2">
            {loading ? 'MEMPROSES...' : 'DAFTAR SEKARANG'} <ChevronRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-bold text-slate-500">
          Sudah punya akun? <Link href="/login" className="text-slate-900 hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </main>
  )
}