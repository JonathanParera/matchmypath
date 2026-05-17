"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Menembak API Login sesungguhnya untuk mengecek ke Database TiDB
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Jika cocok dengan database, masuk ke dashboard
        router.push("/admin/dashboard");
      } else {
        // Jika password/email salah
        setErrorMsg(data.message || "Akses Ditolak: Kredensial Tidak Dikenali.");
      }
    } catch (err) {
      setErrorMsg("Akses Ditolak: Server Database Sedang Gangguan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col justify-center items-center font-sans text-slate-300 p-6 relative overflow-hidden">
      
      {/* BACKGROUND CYBER */}
      <div className="absolute inset-0 z-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1.5px, transparent 1.5px), radial-gradient(#8b5cf6 1.5px, transparent 1.5px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* TOMBOL KEMBALI */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 bg-[#0a1120]/80 backdrop-blur-md border border-slate-800 hover:border-cyan-500/50 px-4 py-2 rounded-full shadow-lg">
          ← Kembali ke Sistem Utama
        </Link>
      </div>

      {/* KOTAK LOGIN */}
      <div className="w-full max-w-md bg-[#0a1120]/80 backdrop-blur-xl p-10 rounded-3xl border border-cyan-500/20 shadow-[0_0_40px_rgba(34,211,238,0.1)] relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-violet-600 shadow-[0_0_10px_#22d3ee]"></div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-2xl bg-[#050b14] border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] mb-4">
             <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L17 22L22 12" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Otorisasi Admin</h2>
          <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold">Secure Gateway Access</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 animate-pulse">
            <span className="w-2 h-2 bg-rose-500 rounded-full"></span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Email Identifier</label>
            {/* defaultValue dihapus, diganti placeholder */}
            <input 
              name="email"
              type="email" 
              placeholder="Masukkan email admin..."
              required
              className="w-full p-4 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all shadow-inner text-sm"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Security Key</label>
            {/* defaultValue dihapus, diganti placeholder */}
            <input 
              name="password"
              type="password" 
              placeholder="••••••••"
              required
              className="w-full p-4 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all shadow-inner text-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-600 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] tracking-widest uppercase text-sm"
          >
            {loading ? "MEMVERIFIKASI PROTOKOL..." : "MASUK KE CONTROL ROOM 🔒"}
          </button>
        </form>

      </div>
    </div>
  );
}