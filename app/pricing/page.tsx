"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PricingPayment() {
  const [loading, setLoading] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const waNumber = "6281234567890"; // Ganti dengan nomor WhatsApp kamu
  const waMessage = "Halo Admin MatchMyPath, saya sudah transfer Rp 49.000 untuk langganan PRO. Berikut bukti transfer saya, mohon minta Kode Aktivasinya ya:";
  const SECRET_TOKEN = "MATCHPRO26";

  useEffect(() => {
    // Mengecek email yang sedang login
    const email = localStorage.getItem('matchUserEmail');
    if (email) setUserEmail(email);
    
    // Jika belum login, tendang balik ke dashboard untuk login dulu
    const session = localStorage.getItem('matchUserSession');
    if (session !== 'active') {
      router.push("/dashboard");
    }
  }, [router]);

  const handleManualConfirmation = () => {
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  const handleActivateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tembak API Validasi Token ke Database
      const res = await fetch('/api/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: tokenInput.toUpperCase(), 
          email: userEmail 
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // SIMPAN STATUS PRO KHUSUS UNTUK EMAIL INI SAJA
        localStorage.setItem(`ahpIsPremium_${userEmail}`, 'true');
        alert(`🎉 AKTIVASI BERHASIL!\n\n${data.message}`);
        router.push("/dashboard"); 
      } else {
        alert(`❌ AKTIVASI GAGAL!\n\n${data.message}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem saat memverifikasi token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col justify-center items-center font-sans text-slate-300 p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1.5px, transparent 1.5px), radial-gradient(#8b5cf6 1.5px, transparent 1.5px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="w-full max-w-4xl bg-[#0a1120]/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-cyan-500/20 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-cyan-500 shadow-[0_0_15px_#10b981]"></div>

        <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-800 pb-8 md:pb-0 md:pr-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-extrabold px-2.5 py-1 rounded-md border border-amber-500/20 uppercase">Upgrade Status</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-1 rounded-full border border-emerald-500/20">👤 {userEmail}</span>
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

        <div className="md:col-span-7 flex flex-col justify-between">
          <div className="mb-8">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
              Kirim Bukti Transfer
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Setelah transfer, klik tombol di bawah untuk mengirimkan resi via WhatsApp. Admin akan memberikan Anda <strong className="text-white">Token Aktivasi</strong>.
            </p>
            <button 
              onClick={handleManualConfirmation}
              className="w-full py-3.5 rounded-xl font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-900 transition-all tracking-widest uppercase text-xs flex items-center justify-center gap-2"
            >
              KIRIM BUKTI VIA WHATSAPP 📲
            </button>
          </div>

          <div className="bg-[#050b14] p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
              Aktivasi Sistem
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Masukkan 10 digit Token Aktivasi dari Admin untuk akun <strong>{userEmail}</strong>.
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
    </div>
  );
}