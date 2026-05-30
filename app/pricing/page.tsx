"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PricingPayment() {
  const [loading, setLoading] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  
  // STATE BARU UNTUK MENGECEK LOGIN USER
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle antara Login & Register
  
  const router = useRouter();

  const waNumber = "6281234567890"; // Ganti nomor WA kamu
  const waMessage = "Halo Admin MatchMyPath, saya sudah transfer Rp 49.000 untuk langganan PRO. Berikut bukti transfer saya, mohon minta Kode Aktivasinya ya:";
  const SECRET_TOKEN = "MATCHPRO26";

  useEffect(() => {
    // Mengecek apakah user sudah login sebelumnya
    const userSession = localStorage.getItem('matchUserSession');
    if (userSession === 'active') {
      setIsLoggedIn(true);
    }
  }, []);

  // FUNGSI SIMULASI LOGIN / REGISTER
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi delay komunikasi ke server database
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('matchUserSession', 'active');
      setIsLoggedIn(true);
    }, 1200);
  };

  const handleManualConfirmation = () => {
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  const handleActivateToken = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (tokenInput.toUpperCase() === SECRET_TOKEN) {
        localStorage.setItem('ahpIsPremium', 'true');
        alert("🎉 AKTIVASI BERHASIL!\n\nToken Valid. Akses MatchMyPath PRO Anda telah dibuka selamanya!");
        router.push("/dashboard"); 
      } else {
        alert("❌ AKTIVASI GAGAL!\n\nToken tidak valid atau sudah kadaluarsa. Pastikan Anda mengetik kode dari Admin dengan benar.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col justify-center items-center font-sans text-slate-300 p-6 relative overflow-hidden">
      
      {/* BACKGROUND CYBER EFFECTS */}
      <div className="absolute inset-0 z-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1.5px, transparent 1.5px), radial-gradient(#8b5cf6 1.5px, transparent 1.5px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="w-full max-w-4xl bg-[#0a1120]/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-cyan-500/20 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-cyan-500 shadow-[0_0_15px_#10b981]"></div>

        {/* LOGIKA KONDISIONAL: JIKA BELUM LOGIN, TAMPILKAN FORM LOGIN */}
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto text-center py-6">
            <div className="w-16 h-16 mx-auto bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-2xl mb-6">🔒</div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Otorisasi Diperlukan</h2>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">
              Anda harus memiliki akun untuk melakukan transaksi dan menyimpan status langganan <strong className="text-amber-400">MatchMyPath PRO</strong>.
            </p>

            <form onSubmit={handleAuth} className="space-y-4 text-left">
              {!isLoginMode && (
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                  <input type="text" required placeholder="Cth: John Doe" className="w-full p-3.5 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1.5">Alamat Email</label>
                <input type="email" required placeholder="akun@email.com" className="w-full p-3.5 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1.5">Kata Sandi</label>
                <input type="password" required placeholder="••••••••" className="w-full p-3.5 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" />
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full py-4 mt-2 rounded-xl font-black text-slate-900 bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 transition-all tracking-widest uppercase text-xs"
              >
                {loading ? "MEMVERIFIKASI..." : (isLoginMode ? "MASUK & LANJUTKAN PEMBAYARAN" : "BUAT AKUN BARU")}
              </button>
            </form>

            <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-[11px] text-slate-500 hover:text-cyan-400 mt-6 transition-colors">
              {isLoginMode ? "Belum punya akun? Buat di sini." : "Sudah punya akun? Masuk di sini."}
            </button>
            
            <div className="mt-4">
              <Link href="/dashboard" className="text-[10px] text-rose-500/70 hover:text-rose-500 transition-colors uppercase font-bold tracking-widest">
                ← Batal & Kembali ke Dashboard
              </Link>
            </div>
          </div>
        ) : (
          
          /* JIKA SUDAH LOGIN, TAMPILKAN INVOICE & TOKEN SEPERTI BIASA */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* KOLOM KIRI: INVOICE DETAILS */}
            <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-800 pb-8 md:pb-0 md:pr-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 font-extrabold px-2.5 py-1 rounded-md border border-amber-500/20 tracking-wider uppercase">Upgrade Status</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-1 rounded-full border border-emerald-500/20">👤 Akun Terverifikasi</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">MatchMyPath PRO</h2>
                <p className="text-xs text-slate-400 leading-relaxed">Buka kunci algoritma AHP tanpa batas eksekusi. Sekali bayar untuk akses selamanya.</p>
              </div>

              <div className="mt-8 bg-[#050b14] p-5 rounded-2xl border border-slate-800 shadow-inner">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Pembayaran</div>
                <div className="text-3xl font-black text-emerald-400 mb-2">Rp 49.000</div>
                
                <div className="mt-5 space-y-3">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Transfer ke Rekening BCA:</p>
                    <p className="text-xl font-mono font-bold text-white tracking-widest bg-white/5 p-2 rounded text-center border border-white/10">8765 4321 00</p>
                    <p className="text-[10px] text-slate-400 uppercase text-center">A.N. ADMIN MATCHMYPATH</p>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN: KONFIRMASI & AKTIVASI TOKEN */}
            <div className="md:col-span-7 flex flex-col justify-between">
              {/* LANGKAH 1 */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="bg-cyan-500/20 text-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                  Kirim Bukti Transfer
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Setelah melakukan transfer, klik tombol di bawah untuk mengirimkan bukti resi via WhatsApp. Admin akan mengecek mutasi dan memberikan Anda <strong className="text-white">Token Aktivasi</strong>.
                </p>
                <button 
                  onClick={handleManualConfirmation}
                  className="w-full py-3.5 rounded-xl font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-900 transition-all tracking-widest uppercase text-xs flex items-center justify-center gap-2"
                >
                  KIRIM BUKTI VIA WHATSAPP 📲
                </button>
              </div>

              {/* LANGKAH 2 */}
              <div className="bg-[#050b14] p-6 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                  Aktivasi Sistem
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Masukkan 10 digit Token Aktivasi dari Admin untuk membuka akses PRO pada akun Anda.
                </p>
                
                <form onSubmit={handleActivateToken} className="flex gap-2">
                  <input 
                    type="text" required placeholder="Masukkan Token..."
                    value={tokenInput} onChange={(e) => setTokenInput(e.target.value)}
                    className="flex-1 p-3.5 bg-[#0a1120] border border-slate-700 rounded-xl text-white font-mono uppercase tracking-widest focus:border-amber-400 focus:outline-none text-sm"
                  />
                  <button 
                    type="submit" disabled={loading || !tokenInput}
                    className="px-6 py-3.5 rounded-xl font-black text-slate-900 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all tracking-widest uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "CEK..." : "AKTIVASI 🔓"}
                  </button>
                </form>
              </div>

              <div className="mt-6 text-center">
                <Link href="/dashboard" className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors uppercase font-bold tracking-widest">
                  ← Batal & Kembali ke Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}