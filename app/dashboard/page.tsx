"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [trendsData, setTrendsData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Load Riwayat & Tren
    const saved = localStorage.getItem('ahpHistory');
    if (saved) setHistory(JSON.parse(saved));
    fetch('/api/trends').then(res => res.json()).then(data => setTrendsData(data)).catch(()=>console.log("no API"));
  }, []);

  const handleSimulate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    } catch (err) {
      alert("Gagal menghitung AHP.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = (id: number) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('ahpHistory', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#050b14] font-sans text-slate-300 relative overflow-hidden">
      
      {/* BACKGROUND DIGITAL CYBER (Pola Titik & Glowing) */}
      <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1.5px, transparent 1.5px), radial-gradient(#8b5cf6 1.5px, transparent 1.5px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* TOP NAVBAR */}
      <nav className="relative z-50 bg-[#0a1120]/80 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_4px_30px_rgba(34,211,238,0.05)]">
        
        {/* Logo Digital Abstrak & Judul */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-extrabold tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
            MatchMyPath
          </span>
        </div>
        
        {/* Menu Tengah */}
        <div className="flex gap-2 bg-[#050b14] p-1.5 rounded-full border border-cyan-500/20 shadow-inner">
          <button onClick={() => setActiveTab("dashboard")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "dashboard" ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "text-slate-400 hover:text-white"}`}>Analisis AHP</button>
          <button onClick={() => setActiveTab("tren")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "tren" ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "text-slate-400 hover:text-white"}`}>Tren Market</button>
          <button onClick={() => setActiveTab("riwayat")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "riwayat" ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "text-slate-400 hover:text-white"}`}>Riwayat</button>
        </div>

        {/* Tombol Kanan */}
        <div>
          <Link href="/" className="text-xs font-bold text-slate-300 hover:text-rose-400 bg-[#050b14] hover:bg-rose-500/10 px-5 py-2.5 rounded-full border border-rose-500/20 hover:border-rose-500/50 transition-all shadow-lg">
            Keluar Akses
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 pt-8">
        
        {/* TAMPILAN DASHBOARD AHP */}
        <div className={activeTab === "dashboard" ? "block animate-fade-in" : "hidden"}>
          <div className="mb-8 border-l-4 border-cyan-400 pl-4">
            <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Sistem Keputusan AHP</h2>
            <p className="text-cyan-500/70 text-sm tracking-widest uppercase font-bold">Algoritma Sinkronisasi Profil</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Kiri */}
            <div className="lg:col-span-4 bg-[#0a1120]/80 backdrop-blur-md p-6 rounded-3xl border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.05)] h-fit relative">
              <div className="absolute top-0 right-10 w-20 h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Parameter Kriteria
              </h3>
              
              <form onSubmit={handleSimulate} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Modal Tersedia (Rp)</label>
                  <input name="modal" type="number" defaultValue="0" required className="w-full p-4 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Keahlian Dominan</label>
                  <select name="skill" className="w-full p-4 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none shadow-inner">
                    <option value="Visual">Visual / Desain</option>
                    <option value="Teknis">Teknis / IT</option>
                    <option value="Menulis">Menulis / Copywriting</option>
                    <option value="Bicara">Bicara / Komunikasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Waktu Luang (Menit/Hari)</label>
                  <input name="waktu" type="number" defaultValue="120" required className="w-full p-4 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all shadow-inner" />
                </div>
                <button type="submit" disabled={loading} className="w-full mt-6 py-4 rounded-xl font-extrabold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] tracking-widest">
                  {loading ? "MEMPROSES MATRIKS..." : "KALKULASI AHP ⚡"}
                </button>
              </form>
            </div>

            {/* Hasil Kanan */}
            <div className="lg:col-span-8">
              {results.length === 0 && !loading && (
                <div className="bg-[#0a1120]/50 border border-cyan-500/20 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full backdrop-blur-sm">
                  <div className="w-20 h-20 mb-6 rounded-2xl bg-[#050b14] border border-slate-800 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                    <span className="text-4xl animate-bounce">🔮</span>
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-wide">Menunggu Input Parameter</h4>
                  <p className="text-slate-500 text-sm mt-2">Kalkulasi algoritma AHP akan ditampilkan di antarmuka ini.</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((job) => (
                  <div key={job.id} className="bg-[#0a1120]/80 backdrop-blur-md p-6 rounded-3xl border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-400/50 transition-all shadow-xl">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-violet-600 text-white px-4 py-2 rounded-bl-2xl font-black text-sm shadow-lg">
                      {job.matchScore}% KECOCOKAN
                    </div>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full uppercase tracking-wider border border-cyan-400/20">{job.category}</span>
                    <h4 className="text-xl font-bold text-white mt-5 mb-2">{job.name}</h4>
                    
                    <div className="w-full bg-[#050b14] rounded-full h-1.5 mb-4 mt-6 border border-slate-800">
                      <div className="bg-gradient-to-r from-violet-500 to-cyan-400 h-1.5 rounded-full shadow-[0_0_10px_#22d3ee]" style={{width: `${job.matchScore}%`}}></div>
                    </div>
                    
                    <h5 className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-3 mt-5">Saran Eksekusi:</h5>
                    <p className="text-sm text-slate-400 leading-relaxed bg-[#050b14] p-4 rounded-xl border border-slate-800">
                      {job.steps}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TAMPILAN TREN */}
        <div className={activeTab === "tren" ? "block animate-fade-in" : "hidden"}>
          <div className="mb-8 border-l-4 border-violet-500 pl-4">
            <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Statistik Pasar (API)</h2>
            <p className="text-violet-400/70 text-sm tracking-widest uppercase font-bold">Live Data Streaming</p>
          </div>
          {!trendsData ? (
             <div className="text-cyan-400 animate-pulse font-bold bg-[#0a1120]/80 p-6 rounded-xl w-fit border border-cyan-500/20">Membaca Stream Data...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {trendsData.topSkills.map((sk: any, i: number) => (
                <div key={i} className="bg-[#0a1120]/80 backdrop-blur-md p-6 rounded-2xl border-t-4 border-slate-800 shadow-xl" style={{borderTopColor: sk.status === 'Turun' ? '#f43f5e' : '#22d3ee'}}>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sk.category}</span>
                  <h4 className="text-base font-bold text-white mt-1 mb-2 truncate">{sk.name}</h4>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800/50">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${sk.status === 'Turun' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>{sk.status}</span>
                    <span className={`text-xl font-black ${sk.status === 'Turun' ? 'text-rose-500' : 'text-cyan-400'}`}>{sk.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TAMPILAN RIWAYAT */}
        <div className={activeTab === "riwayat" ? "block animate-fade-in" : "hidden"}>
          <div className="mb-8 border-l-4 border-slate-400 pl-4">
            <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Riwayat Analisis</h2>
            <p className="text-slate-500 text-sm tracking-widest uppercase font-bold">Log Data Tersimpan</p>
          </div>
          {history.length === 0 ? (
            <div className="bg-[#0a1120]/50 p-10 rounded-3xl border border-dashed border-slate-700 text-center text-slate-500">Log database lokal kosong.</div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="bg-[#0a1120]/80 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-cyan-500/30 transition-all">
                  <div>
                    <div className="text-[10px] bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded w-fit mb-3 border border-cyan-500/20 font-bold tracking-wider">{item.tanggal}</div>
                    <div className="text-sm font-bold text-white mb-3 bg-[#050b14] px-3 py-1.5 rounded-lg border border-slate-800 w-fit">Modal: Rp {item.modalInput.toLocaleString('id-ID')} | Skill: {item.skillInput}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Rekomendasi Utama:</span>
                      {item.top3.map((job: string, idx: number) => (
                        <span key={idx} className="text-[10px] bg-violet-500/10 text-violet-300 px-2 py-1 rounded border border-violet-500/20">{idx+1}. {job}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteHistory(item.id)} className="px-5 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all border border-rose-500/20">Hapus Log</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}