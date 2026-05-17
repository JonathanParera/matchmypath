"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminManagement() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  
  // State baru untuk menampung data yang sedang diedit
  const [currentJob, setCurrentJob] = useState<any>(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Gagal load data", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Fungsi untuk membuka form Edit
  const handleEditClick = (job: any) => {
    setCurrentJob(job); // Simpan data pekerjaan yang mau diedit
    setShowModal(true);
  };

  // Fungsi untuk membuka form Tambah Baru
  const handleAddClick = () => {
    setCurrentJob(null); // Kosongkan form
    setShowModal(true);
  };

  // Fungsi Submit (Menangani Tambah & Edit)
  const handleSubmitData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload: any = {
      name: formData.get("name"),
      category: formData.get("category"),
      minCapital: formData.get("minCapital"),
      timePerDay: formData.get("timePerDay"),
      requiredSkill: formData.get("requiredSkill"),
      steps: formData.get("steps")
    };

    try {
      let res;
      if (currentJob) {
        // JIKA SEDANG EDIT: Gunakan method PUT dan tambahkan ID
        payload.id = currentJob.id;
        res = await fetch('/api/jobs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // JIKA TAMBAH BARU: Gunakan method POST
        res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(currentJob ? "Data berhasil diperbarui!" : "Entitas baru berhasil ditambahkan!");
        setShowModal(false);
        fetchJobs(); 
      } else {
        alert("Gagal memproses data. Cek terminal.");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("PERINGATAN: Entitas akan dihapus permanen dari sistem. Lanjutkan?")) {
      try {
        const res = await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchJobs();
        }
      } catch (err) {
        alert("Gagal menghapus entitas");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] font-sans text-slate-300 relative overflow-hidden">
      
      {/* BACKGROUND CYBER */}
      <div className="absolute inset-0 z-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1.5px, transparent 1.5px), radial-gradient(#8b5cf6 1.5px, transparent 1.5px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>

      {/* NAVBAR MELAYANG ADMIN */}
      <nav className="relative z-50 bg-[#0a1120]/80 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4 flex justify-between items-center shadow-[0_4px_30px_rgba(34,211,238,0.05)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-lg font-bold text-white tracking-widest">MatchMyPath <span className="text-cyan-500 font-light">| Control Room</span></h1>
        </div>
        <Link href="/admin" className="text-xs font-bold px-5 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full transition-all border border-rose-500/20 shadow-lg">
          Tutup Sesi
        </Link>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-l-4 border-cyan-400 pl-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Database Alternatif</h2>
            <p className="text-cyan-500/70 text-xs tracking-widest uppercase font-bold">Sinkronisasi Real-time Sistem AHP</p>
          </div>
          <button 
            onClick={handleAddClick}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-all flex items-center gap-2 text-sm tracking-widest uppercase"
          >
            <span>+</span> Injeksi Entitas Baru
          </button>
        </div>

        {/* TABEL DATA CYBER */}
        <div className="bg-[#0a1120]/80 backdrop-blur-md rounded-3xl border border-cyan-500/20 overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#050b14] text-xs uppercase font-extrabold text-cyan-500 tracking-widest border-b border-cyan-500/20">
                <tr>
                  <th className="px-6 py-5">Nama Entitas</th>
                  <th className="px-6 py-5">Kategori</th>
                  <th className="px-6 py-5">Keahlian</th>
                  <th className="px-6 py-5">Modal Min.</th>
                  <th className="px-6 py-5">Waktu (Mnt)</th>
                  <th className="px-6 py-5 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {jobs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-cyan-500 animate-pulse font-bold tracking-widest">MENGHUBUNGKAN KE SERVER...</td></tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-bold text-white group-hover:text-cyan-400 transition-colors">{job.name}</td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full uppercase tracking-wider">{job.category}</span></td>
                      <td className="px-6 py-4 text-slate-400">{job.requiredSkill}</td>
                      <td className="px-6 py-4 text-slate-300 font-medium">Rp {job.minCapital.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-slate-300 font-medium">{job.timePerDay}</td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        {/* TOMBOL EDIT BARU */}
                        <button onClick={() => handleEditClick(job)} className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-lg border border-cyan-500/20 text-xs font-bold transition-colors shadow-sm">
                          Modifikasi
                        </button>
                        <button onClick={() => handleDelete(job.id)} className="px-4 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-500/20 text-xs font-bold transition-colors shadow-sm">
                          Terminasi
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL POPUP FORM CYBER */}
      {showModal && (
        <div className="fixed inset-0 bg-[#050b14]/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a1120] border border-cyan-500/30 p-8 rounded-3xl w-full max-w-xl shadow-[0_0_50px_rgba(34,211,238,0.15)] relative max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-cyan-400"></div>
            
            <h3 className="text-xl font-extrabold text-white mb-6 tracking-tight flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> 
               {/* Judul berubah otomatis */}
               {currentJob ? "Panel Modifikasi Data" : "Panel Injeksi Data"}
            </h3>
            
            {/* key={currentJob?.id} penting agar form me-reset nilai defaultValue-nya saat ganti data */}
            <form key={currentJob ? currentJob.id : 'new'} onSubmit={handleSubmitData} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Nama Entitas (Pekerjaan)</label>
                  <input name="name" type="text" required defaultValue={currentJob?.name || ""} className="w-full p-3.5 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none shadow-inner text-sm" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Klasifikasi Kategori</label>
                  <input name="category" type="text" required defaultValue={currentJob?.category || ""} className="w-full p-3.5 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none shadow-inner text-sm" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Syarat Keahlian</label>
                  <select name="requiredSkill" defaultValue={currentJob?.requiredSkill || "Visual"} className="w-full p-3.5 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none shadow-inner text-sm">
                    <option value="Visual">Visual / Desain</option>
                    <option value="Teknis">Teknis / IT</option>
                    <option value="Menulis">Menulis / Copywriting</option>
                    <option value="Bicara">Bicara / Ekstrovert</option>
                    <option value="Umum">Umum / Administratif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Minimum Modal (Rp)</label>
                  <input name="minCapital" type="number" required defaultValue={currentJob?.minCapital || 0} className="w-full p-3.5 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none shadow-inner text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Durasi Harian (Menit)</label>
                  <input name="timePerDay" type="number" required defaultValue={currentJob?.timePerDay || 120} className="w-full p-3.5 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none shadow-inner text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Protokol Eksekusi (Langkah)</label>
                <textarea name="steps" required rows={3} defaultValue={currentJob?.steps || ""} className="w-full p-3.5 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-cyan-400 focus:outline-none shadow-inner text-sm leading-relaxed"></textarea>
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 rounded-xl font-bold text-slate-400 bg-[#050b14] hover:bg-slate-800 transition-all border border-slate-800 text-sm tracking-widest uppercase">Batalkan</button>
                <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-600 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] text-sm tracking-widest uppercase">
                  {loading ? "MENYIMPAN..." : (currentJob ? "SIMPAN PERUBAHAN ⚡" : "INJEKSI DATA ⚡")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}