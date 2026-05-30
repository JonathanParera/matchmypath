"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [trendsData, setTrendsData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  
  // STATE OTORISASI & KUOTA
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState("");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState(""); // State baru untuk menyimpan email spesifik

  const [usageCount, setUsageCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false); 
  const maxFreeLimit = 3; 
  const router = useRouter();

  useEffect(() => {
    // Mengecek sesi saat refresh halaman
    const session = localStorage.getItem('matchUserSession');
    const storedName = localStorage.getItem('matchUserName');
    const storedEmail = localStorage.getItem('matchUserEmail');
    
    if (session === 'active' && storedEmail) {
      setIsLoggedIn(true);
      if (storedName) setUserName(storedName);
      setUserEmail(storedEmail);

      // Ambil kuota dan status khusus untuk EMAIL ini
      const savedUsage = localStorage.getItem(`ahpUsageCount_${storedEmail}`);
      if (savedUsage) setUsageCount(parseInt(savedUsage, 10));

      const premiumStatus = localStorage.getItem(`ahpIsPremium_${storedEmail}`) === 'true';
      setIsPremium(premiumStatus);
    }

    const savedHistory = localStorage.getItem('ahpHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    fetch('/api/trends')
      .then(res => res.json())
      .then(data => setTrendsData(data))
      .catch(() => console.log("no API"));
  }, []);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      const endpoint = isLoginMode ? '/api/login' : '/api/register';
      const payload = isLoginMode ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const loggedEmail = data.user.email || email;
        const loggedName = data.user.name || name || 'User';

        localStorage.setItem('matchUserSession', 'active');
        localStorage.setItem('matchUserName', loggedName);
        localStorage.setItem('matchUserEmail', loggedEmail); // Simpan email ke memori
        
        setUserName(loggedName);
        setUserEmail(loggedEmail);
        setIsLoggedIn(true);

        // Langsung cek kuota dan status untuk akun yang baru login ini
        const savedUsage = localStorage.getItem(`ahpUsageCount_${loggedEmail}`);
        setUsageCount(savedUsage ? parseInt(savedUsage, 10) : 0);

        const premiumStatus = localStorage.getItem(`ahpIsPremium_${loggedEmail}`) === 'true';
        setIsPremium(premiumStatus);
      } else {
        setAuthError(data.message || "Otorisasi gagal.");
      }
    } catch (err) {
      setAuthError("Gagal terhubung ke database server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPremium && usageCount >= maxFreeLimit) {
      alert("🔒 Batas Kuota Uji Coba Gratis Habis!\nSilakan lakukan aktivasi pada menu 'UPGRADE PRO'.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      modal: Number(formData.get("modal")),
      skill: String(formData.get("skill")),
      waktu: Number(formData.get("waktu")),
    };

    try {
      const res = await fetch('/api/ahp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResults(data);

      const top3Names = data.slice(0, 3).map((job: any) => job.name);
      const newHistoryItem = { id: Date.now(), tanggal: new Date().toLocaleString('id-ID'), modalInput: payload.modal, skillInput: payload.skill, top3: top3Names };
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('ahpHistory', JSON.stringify(updatedHistory));

      // Menambah kuota khusus untuk email ini jika bukan premium
      if (!isPremium) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem(`ahpUsageCount_${userEmail}`, newCount.toString());
      }
    } catch (err) {
      alert("Gagal menghitung AHP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] font-sans text-slate-300 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1.5px, transparent 1.5px), radial-gradient(#8b5cf6 1.5px, transparent 1.5px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      {!isLoggedIn ? (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="absolute top-6 left-6">
            <Link href="/" className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 bg-[#0a1120]/80 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-full shadow-lg">
              ← Kembali ke Beranda
            </Link>
          </div>

          <div className="w-full max-w-md bg-[#0a1120]/80 backdrop-blur-xl p-10 rounded-3xl border border-cyan-500/20 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto bg-[#050b14] border border-cyan-500/30 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-[0_0_20px_rgba(34,211,238,0.2)]">🔒</div>
              <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">{isLoginMode ? "Otorisasi Masuk" : "Registrasi Akun"}</h2>
              <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold">Client Secure Gateway</p>
            </div>

            {authError && (
              <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold rounded-xl text-center">{authError}</div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              {!isLoginMode && (
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                  <input name="name" type="text" required placeholder="Cth: John Doe" className="w-full p-3.5 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1.5">Email Akses</label>
                <input name="email" type="email" required placeholder="akun@email.com" className="w-full p-3.5 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1.5">Kata Sandi</label>
                <input name="password" type="password" required placeholder="••••••••" className="w-full p-3.5 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" />
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 mt-2 rounded-xl font-black text-slate-900 bg-gradient-to-r from-cyan-400 to-violet-500 hover:scale-[1.02] transition-all tracking-widest uppercase text-xs shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                {loading ? "MEMPROSES..." : (isLoginMode ? "MASUK SISTEM ⚡" : "DAFTARKAN AKUN ⚡")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => {setIsLoginMode(!isLoginMode); setAuthError("");}} className="text-[11px] text-slate-500 hover:text-cyan-400 transition-colors">
                {isLoginMode ? "Belum memiliki akses? Daftar di sini." : "Sudah memiliki akun? Masuk di sini."}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <nav className="relative z-50 bg-[#0a1120]/80 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_4px_30px_rgba(34,211,238,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <span className="text-xl">🔮</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">MatchMyPath</span>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">👤 Halo, {userName}</span>
              </div>
            </div>
            
            <div className="flex gap-2 bg-[#050b14] p-1.5 rounded-full border border-cyan-500/20 shadow-inner">
              <button onClick={() => setActiveTab("dashboard")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "dashboard" ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "text-slate-400 hover:text-white"}`}>Analisis AHP</button>
              <button onClick={() => setActiveTab("tren")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "tren" ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "text-slate-400 hover:text-white"}`}>Tren Market</button>
              <button onClick={() => setActiveTab("riwayat")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "riwayat" ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "text-slate-400 hover:text-white"}`}>Riwayat</button>
            </div>

            <div className="flex items-center gap-4">
              {!isPremium && (
                <Link href="/pricing" className="text-xs font-extrabold text-slate-900 bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 rounded-full shadow-md shadow-amber-500/20">
                  👑 UPGRADE PRO
                </Link>
              )}
              <Link href="/" className="text-xs font-bold text-slate-300 hover:text-cyan-400 bg-[#050b14] px-5 py-2 rounded-full border border-slate-800 hover:border-cyan-500/30 transition-all uppercase tracking-widest">
                Beranda
              </Link>
            </div>
          </nav>

          <main className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 pt-8">
            <div className={activeTab === "dashboard" ? "block animate-fade-in" : "hidden"}>
              <div className="mb-8 border-l-4 border-cyan-400 pl-4">
                <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Sistem Keputusan AHP</h2>
                <p className="text-cyan-500/70 text-sm tracking-widest uppercase font-bold">Algoritma Sinkronisasi Profil</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 bg-[#0a1120]/80 backdrop-blur-md p-6 rounded-3xl border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.05)] h-fit relative">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">Parameter</h3>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${isPremium ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : (usageCount >= maxFreeLimit ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20')}`}>
                      {isPremium ? "👑 PRO UNLIMITED" : `FREE: ${usageCount}/${maxFreeLimit}`}
                    </span>
                  </div>
                  
                  <form onSubmit={handleSimulate} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Modal Tersedia (Rp)</label>
                      <input name="modal" type="number" defaultValue="0" required disabled={!isPremium && usageCount >= maxFreeLimit} className="w-full p-4 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all shadow-inner disabled:opacity-30" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Keahlian Dominan</label>
                      <select name="skill" disabled={!isPremium && usageCount >= maxFreeLimit} className="w-full p-4 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none shadow-inner disabled:opacity-30">
                        <option value="Visual">Visual / Desain</option>
                        <option value="Teknis">Teknis / IT</option>
                        <option value="Menulis">Menulis / Copywriting</option>
                        <option value="Bicara">Bicara / Komunikasi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Waktu Luang (Menit/Hari)</label>
                      <input name="waktu" type="number" defaultValue="120" required disabled={!isPremium && usageCount >= maxFreeLimit} className="w-full p-4 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all shadow-inner disabled:opacity-30" />
                    </div>
                    
                    <button type="submit" disabled={loading} className={`w-full mt-6 py-4 rounded-xl font-extrabold text-white tracking-widest uppercase transition-all ${!isPremium && usageCount >= maxFreeLimit ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-[1.02]'}`}>
                      {loading ? "MEMPROSES..." : (!isPremium && usageCount >= maxFreeLimit ? "AKSES TERKUNCI 🔒" : "KALKULASI AHP ⚡")}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-8">
                  {results.length === 0 && !loading && (
                    <div className="bg-[#0a1120]/50 border border-cyan-500/20 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full">
                      <div className="w-20 h-20 mb-6 rounded-2xl bg-[#050b14] border border-slate-800 flex items-center justify-center"><span className="text-4xl animate-bounce">🔮</span></div>
                      <h4 className="text-xl font-bold text-white tracking-wide">{!isPremium && usageCount >= maxFreeLimit ? "Kuota Gratis Habis" : "Menunggu Parameter"}</h4>
                      <p className="text-slate-500 text-sm mt-2">{!isPremium && usageCount >= maxFreeLimit ? "Silakan klik menu 'UPGRADE PRO'." : "Kalkulasi algoritma AHP akan ditampilkan di sini."}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.map((job) => (
                      <div key={job.id} className="bg-[#0a1120]/80 backdrop-blur-md p-6 rounded-3xl border border-cyan-500/20 relative">
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-violet-600 text-white px-4 py-2 rounded-bl-2xl font-black text-sm">{job.matchScore}% KECOCOKAN</div>
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full uppercase tracking-wider border border-cyan-400/20">{job.category}</span>
                        <h4 className="text-xl font-bold text-white mt-5 mb-2">{job.name}</h4>
                        <div className="w-full bg-[#050b14] rounded-full h-1.5 mb-4 mt-6 border border-slate-800">
                          <div className="bg-gradient-to-r from-violet-500 to-cyan-400 h-1.5 rounded-full" style={{width: `${job.matchScore}%`}}></div>
                        </div>
                        <h5 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-3 mt-5">Saran Eksekusi:</h5>
                        <p className="text-sm text-slate-400 bg-[#050b14] p-4 rounded-xl border border-slate-800">{job.steps}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={activeTab === "tren" ? "block animate-fade-in" : "hidden"}>
               <div className="text-cyan-400 animate-pulse font-bold bg-[#0a1120]/80 p-6 rounded-xl w-fit border border-cyan-500/20">Data Tren Pasar...</div>
            </div>

            <div className={activeTab === "riwayat" ? "block animate-fade-in" : "hidden"}>
               <div className="text-slate-500">Log Riwayat Analisis...</div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}