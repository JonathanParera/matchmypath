"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("pekerjaan");
  
  // ================= STATE TOKEN =================
  const [tokens, setTokens] = useState<any[]>([]);
  const [loadingToken, setLoadingToken] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newTokenCode, setNewTokenCode] = useState("");

  // ================= STATE PEKERJAAN =================
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJob, setLoadingJob] = useState(false);
  
  // State untuk Pop-up Form Pekerjaan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [jobForm, setJobForm] = useState({
    name: "",
    category: "Visual",
    minCapital: 0,
    timePerDay: 60,
    requiredSkill: "Desain",
    steps: ""
  });

  useEffect(() => {
    fetchTokens();
    fetchJobs();
  }, []);

  // ================= FUNGSI API TOKEN =================
  const fetchTokens = async () => {
    try {
      const res = await fetch('/api/tokens');
      const data = await res.json();
      if (data.success) setTokens(data.tokens);
    } catch (error) {
      console.error("Gagal mengambil data token", error);
    }
  };

  const generateRandomCode = () => {
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    setNewTokenCode(`PRO-${randomStr}`);
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingToken(true);
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: newTokenCode, targetEmail: newEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Token berhasil dibuat!");
        setNewEmail("");
        setNewTokenCode("");
        fetchTokens();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Gagal menghubungi server.");
    } finally {
      setLoadingToken(false);
    }
  };

  // ================= FUNGSI API PEKERJAAN (CRUD) =================
  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success || Array.isArray(data)) {
        setJobs(data.data || data); 
      }
    } catch (error) {
      console.error("Gagal mengambil data pekerjaan", error);
    }
  };

  const handleOpenModal = (job: any = null) => {
    if (job) {
      setEditingJobId(job.id);
      setJobForm({
        name: job.name,
        category: job.category,
        minCapital: job.minCapital,
        timePerDay: job.timePerDay,
        requiredSkill: job.requiredSkill,
        steps: job.steps
      });
    } else {
      setEditingJobId(null);
      setJobForm({ name: "", category: "Visual", minCapital: 0, timePerDay: 60, requiredSkill: "", steps: "" });
    }
    setIsModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingJob(true);
    try {
      // Jika ada editingJobId, gunakan PUT (Update). Jika tidak, POST (Create)
      const method = editingJobId ? 'PUT' : 'POST';
      const payload = editingJobId ? { ...jobForm, id: editingJobId } : jobForm;

      const res = await fetch('/api/jobs', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(editingJobId ? "Data berhasil diubah!" : "Data berhasil ditambahkan!");
        setIsModalOpen(false);
        fetchJobs(); // Refresh tabel
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (error) {
      alert("Terjadi kesalahan server.");
    } finally {
      setLoadingJob(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pekerjaan ini?")) return;
    
    try {
      const res = await fetch('/api/jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        alert("Data dihapus!");
        fetchJobs();
      }
    } catch (error) {
      alert("Gagal menghapus data.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] font-sans text-slate-300 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1.5px, transparent 1.5px), radial-gradient(#8b5cf6 1.5px, transparent 1.5px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
      
      <nav className="relative z-40 bg-[#0a1120]/90 backdrop-blur-xl border-b border-rose-500/20 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-xl">🛡️</div>
          <div className="flex flex-col">
            <span className="font-black tracking-widest text-lg text-white">CONTROL ROOM</span>
            <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest">Sistem Administrator Pusat</span>
          </div>
        </div>
        <Link href="/admin" className="text-xs font-bold text-slate-400 hover:text-rose-400 border border-slate-700 px-4 py-2 rounded-full transition-all uppercase">Keluar Sesi</Link>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
        
        <div className="flex gap-2 mb-8 bg-[#0a1120]/80 p-2 rounded-2xl border border-slate-800 w-fit backdrop-blur-md">
          <button onClick={() => setActiveTab("pekerjaan")} className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "pekerjaan" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50" : "text-slate-500 hover:text-slate-300"}`}>Kelola Pekerjaan</button>
          <button onClick={() => setActiveTab("token")} className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "token" ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" : "text-slate-500 hover:text-slate-300"}`}>Kelola Token PRO</button>
        </div>

        {/* TAB 1: KELOLA PEKERJAAN */}
        <div className={activeTab === "pekerjaan" ? "block animate-fade-in" : "hidden"}>
          <div className="bg-[#0a1120]/80 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 bg-[#050b14]/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Database Side Hustle</h3>
              <button onClick={() => handleOpenModal()} className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-900 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                + Tambah Data
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-[#050b14] text-[10px] uppercase tracking-widest text-cyan-500 font-bold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Nama Pekerjaan</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Modal Min.</th>
                    <th className="px-6 py-4">Keahlian</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {jobs.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Belum ada data pekerjaan.</td></tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">{job.name}</td>
                        <td className="px-6 py-4"><span className="bg-slate-800 px-2 py-1 rounded text-[10px] uppercase tracking-wider">{job.category}</span></td>
                        <td className="px-6 py-4">Rp {job.minCapital?.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">{job.requiredSkill}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleOpenModal(job)} className="text-amber-400 hover:text-amber-300 text-xs font-bold mr-3">Edit</button>
                          <button onClick={() => handleDeleteJob(job.id)} className="text-rose-400 hover:text-rose-300 text-xs font-bold">Hapus</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TAB 2: KELOLA TOKEN PRO (Sama seperti sebelumnya) */}
        <div className={activeTab === "token" ? "block animate-fade-in" : "hidden"}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 h-fit bg-[#0a1120]/80 backdrop-blur-md p-6 rounded-3xl border border-amber-500/20 relative">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Cetak Token Baru</h3>
              <form onSubmit={handleCreateToken} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Email Target</label>
                  <input type="email" required placeholder="budi@gmail.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full p-3.5 bg-[#050b14] border border-slate-800 rounded-xl text-white focus:border-amber-400 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Kode Token Rahasia</label>
                  <div className="flex gap-2">
                    <input type="text" required placeholder="PRO-XXXXX" value={newTokenCode} onChange={(e) => setNewTokenCode(e.target.value)} className="w-full p-3.5 bg-[#050b14] border border-slate-800 rounded-xl text-white font-mono uppercase focus:border-amber-400 focus:outline-none text-sm" />
                    <button type="button" onClick={generateRandomCode} className="px-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl font-bold">🎲</button>
                  </div>
                </div>
                <button type="submit" disabled={loadingToken} className="w-full py-4 mt-4 rounded-xl font-black text-slate-900 bg-gradient-to-r from-amber-400 to-orange-500 uppercase text-xs">
                  {loadingToken ? "MENYIMPAN..." : "CETAK TOKEN ⚡"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-[#0a1120]/80 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800 bg-[#050b14]/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Database Token</h3>
                <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-bold">{tokens.length} Total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-[#050b14] text-[10px] uppercase text-cyan-500 font-bold border-b border-slate-800">
                    <tr><th className="px-6 py-4">Kode Token</th><th className="px-6 py-4">Email Target</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Tgl Dibuat</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {tokens.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">Belum ada token.</td></tr>
                    ) : (
                      tokens.map((token) => (
                        <tr key={token.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 font-mono font-bold text-white">{token.code}</td>
                          <td className="px-6 py-4">{token.targetEmail}</td>
                          <td className="px-6 py-4">
                            {token.isUsed ? <span className="bg-rose-500/10 text-rose-400 px-2 py-1 rounded text-[10px] font-bold uppercase">Hangus</span> : <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold uppercase">Aktif</span>}
                          </td>
                          <td className="px-6 py-4 text-right text-xs">{new Date(token.createdAt).toLocaleDateString('id-ID')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= MODAL / POP-UP FORM PEKERJAAN ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0a1120] border border-cyan-500/30 rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">{editingJobId ? "Edit Data Pekerjaan" : "Tambah Pekerjaan Baru"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-rose-400 font-bold text-xl">&times;</button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Nama Pekerjaan</label>
                  <input type="text" required value={jobForm.name} onChange={(e) => setJobForm({...jobForm, name: e.target.value})} className="w-full p-3 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" placeholder="Cth: Penulis Lepas" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Kategori</label>
                  <select value={jobForm.category} onChange={(e) => setJobForm({...jobForm, category: e.target.value})} className="w-full p-3 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm">
                    <option value="Visual">Visual</option>
                    <option value="Teknis">Teknis</option>
                    <option value="Menulis">Menulis</option>
                    <option value="Bicara">Bicara</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Modal Minimum (Rp)</label>
                  <input type="number" required value={jobForm.minCapital} onChange={(e) => setJobForm({...jobForm, minCapital: Number(e.target.value)})} className="w-full p-3 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Waktu per Hari (Menit)</label>
                  <input type="number" required value={jobForm.timePerDay} onChange={(e) => setJobForm({...jobForm, timePerDay: Number(e.target.value)})} className="w-full p-3 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Keahlian Spesifik</label>
                <input type="text" required value={jobForm.requiredSkill} onChange={(e) => setJobForm({...jobForm, requiredSkill: e.target.value})} className="w-full p-3 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" placeholder="Cth: Copywriting, SEO" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Saran Eksekusi (Langkah)</label>
                <textarea required value={jobForm.steps} onChange={(e) => setJobForm({...jobForm, steps: e.target.value})} rows={3} className="w-full p-3 bg-[#050b14] border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" placeholder="Masukkan instruksi cara memulai pekerjaan ini..."></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors text-xs uppercase">Batal</button>
                <button type="submit" disabled={loadingJob} className="flex-1 py-3 rounded-xl font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors text-xs uppercase shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  {loadingJob ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}