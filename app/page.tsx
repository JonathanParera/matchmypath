'use client'

import { useState, useEffect } from 'react'
import { 
  Rocket, LayoutDashboard, Search, History, Settings, Trash2, LogOut, CheckCircle2, BarChart3, UserCircle, Wallet, BrainCircuit, CalendarClock, TrendingUp
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // State Utama
  const [activeTab, setActiveTab] = useState('dashboard')
  const [formData, setFormData] = useState({ modal: 0 as number | string, waktu: 2, vibe: 'Introvert', skill: 'Umum', target: 'Menengah' })
  const [results, setResults] = useState<any[]>([])
  
  // State Search & History
  const [searchQuery, setSearchQuery] = useState('')
  const [historySearch, setHistorySearch] = useState('')
  const [historyData, setHistoryData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

// State untuk Tren Pasar
  const [trendsData, setTrendsData] = useState<any>(null)
  const [loadingTrends, setLoadingTrends] = useState(false)

  // Fungsi mengambil data tren
  const fetchTrends = async () => {
    setLoadingTrends(true)
    try {
      const res = await fetch('/api/trends')
      const data = await res.json()
      setTrendsData(data)
    } catch (e) {
      console.log("Gagal mengambil tren")
    } finally {
      setLoadingTrends(false)
    }
  }

  // Ambil data tren saat tab Tren Pasar diklik
  useEffect(() => {
    if (activeTab === 'trends' && !trendsData) {
      fetchTrends()
    }
  }, [activeTab])

  // State Pengaturan
  const [savedSettings, setSavedSettings] = useState(false)
  // State untuk melacak baris riwayat mana yang sedang di-klik/dibuka
  const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null)

  // Ganti useEffect lama dengan ini
  // Fungsi ambil riwayat dari DB
  const fetchHistoryFromDB = async () => {
    try {
      const res = await fetch('/api/history')
      const data = await res.json()
      if (Array.isArray(data)) setHistoryData(data)
    } catch (e) {
      console.error("Gagal ambil riwayat dari DB")
    }
  }

  // GABUNGAN PROTEKSI & LOAD DATA
  useEffect(() => {
    // 1. Kalau belum login, lempar ke halaman login
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    // 2. Kalau sudah login, ambil data riwayat dari database
    if (status === 'authenticated') {
      fetchHistoryFromDB()
    }
  }, [status, activeTab, router])
  
  const handleSubmit = async () => {
    setLoading(true)
    fetchHistoryFromDB()
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setResults(data)

      // Simpan ke History
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        topResult: data[0]?.name || 'Tidak ada hasil',
        score: data[0]?.finalScore || 0,
        config: formData
      }
      const updatedHistory = [newEntry, ...historyData].slice(0, 10) // Simpan max 10 riwayat
      setHistoryData(updatedHistory)
      localStorage.setItem('matchHistory', JSON.stringify(updatedHistory))
      
      setActiveTab('dashboard')
    } catch (e) {
      alert("Gagal terhubung ke server.")
    } finally {
      setLoading(false)
    }
  }

  // Fungsi Simpan Preferensi (Pengaturan)
  const handleSavePreferences = () => {
    localStorage.setItem('matchPrefs', JSON.stringify({ modal: formData.modal, skill: formData.skill }))
    setSavedSettings(true)
    setTimeout(() => setSavedSettings(false), 3000) // Notifikasi sukses hilang setelah 3 detik
  }

  const clearHistory = () => {
    if (confirm("Yakin ingin menghapus semua riwayat?")) {
      localStorage.removeItem('matchHistory')
      setHistoryData([])
    }
  }

  // Filter Hasil
  const filteredResults = results.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.category.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredHistory = historyData.filter(h => h.topResult.toLowerCase().includes(historySearch.toLowerCase()))

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] font-sans">
        <Rocket className="text-blue-600 animate-bounce mb-4" size={32} />
        <p className="font-black text-slate-400 tracking-widest uppercase text-xs">Memuat Dashboard...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <main suppressHydrationWarning className="min-h-screen bg-[#F1F5F9] flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8 sticky top-0 h-screen transition-all shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-100">
            <Rocket className="text-white" size={20} />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800 uppercase">MatchMyPath</span>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'trends', label: 'Tren Pasar', icon: TrendingUp },
            { id: 'history', label: 'Riwayat Tes', icon: History },
            { id: 'settings', label: 'Pengaturan', icon: Settings },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}

          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all mt-4 border border-transparent hover:border-rose-100"
          >
            <LogOut size={20} /> Keluar Akses
          </button>
        </nav>

        {/* PROFIL USER DI BAWAH SIDEBAR */}
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group hover:bg-black transition-colors cursor-pointer">
          <div className="relative z-10">
            <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">Login sebagai:</p>
            <p className="text-sm font-bold leading-relaxed mb-4 text-blue-300 truncate">
              {session?.user?.name || 'Memuat...'}
            </p>
            <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="bg-green-400 h-full w-full shadow-[0_0_10px_#4ade80]"></div>
            </div>
            <p className="text-[8px] font-bold text-slate-400 text-right mt-1 uppercase tracking-widest">Sistem Online</p>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <section className="flex-1 p-6 lg:p-10 overflow-y-auto">
        
        {/* HEADER BAR */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' ? 'Analisis Dashboard' : 
               activeTab === 'history' ? 'Riwayat Aktivitas' : 'Pengaturan Sistem'}
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Sistem Pendukung Keputusan Side Hustle</p>
          </div>
        </header>

        {/* ======================= TAB: DASHBOARD ======================= */}
        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-700">
            {/* INPUT PANEL */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-2 h-6 bg-blue-600 rounded-full" /> Konfigurasi Profil
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Wallet size={12}/> Modal Tersedia (Rp)</label>
                    <input type="number" value={formData.modal} onChange={(e) => setFormData({...formData, modal: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-sm transition-all" placeholder="Contoh: 1000000" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><BrainCircuit size={12}/> Skill Dominan</label>
                    <select value={formData.skill} onChange={(e) => setFormData({...formData, skill: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl outline-none font-bold text-sm cursor-pointer focus:bg-white focus:border-blue-500 transition-all">
                      <option value="Umum">Umum / Tanpa Skill Khusus</option>
                      <option value="Menulis">Menulis Artikel/Konten</option>
                      <option value="Visual">Desain / Video Editor</option>
                      <option value="Teknis">IT / Coding / Repair</option>
                      <option value="Bicara">Public Speaking / Live</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">🎯 Ekspektasi Hasil</label>
                    <select value={formData.target} onChange={(e) => setFormData({...formData, target: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl outline-none font-bold text-sm cursor-pointer focus:bg-white focus:border-blue-500 transition-all">
                      <option value="Kecil">Rp 500rb - 2jt (Sampingan)</option>
                      <option value="Menengah">Rp 2jt - 7jt (Menengah)</option>
                      <option value="Besar">Rp 10jt++ (Profesional)</option>
                    </select>
                  </div>

                  <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:bg-slate-300">
                    {loading ? 'CALCULATING AHP...' : 'PROSES ANALISIS 🚀'}
                  </button>
                </div>
              </div>
            </div>

            {/* RESULT PANEL */}
            <div className="col-span-12 lg:col-span-8">
              {filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredResults.map((hustle, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-blue-500 transition-all duration-300 group animate-in zoom-in-95">
                      <div className="flex justify-between items-start mb-6">
                        <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">{hustle.category}</span>
                        <div className="flex flex-col items-end">
                           <span className="text-blue-600 font-black text-xl">{hustle.finalScore}%</span>
                           <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">Match Score</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-black text-slate-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">{hustle.name}</h3>
                      
                      <div className="space-y-4 mb-8">
                         <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase">
                                <span>Kecocokan Kriteria</span>
                                <span>{hustle.finalScore}/100</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-1000 ease-out" style={{ width: `${hustle.finalScore}%` }} />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-3 pt-6 border-t border-slate-50">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Langkah Memulai:</p>
                         {hustle.steps.split(/\d+\.\s+/).filter((s:any)=>s.length>0).slice(0,2).map((s:any, j:any) => (
                           <div key={j} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-50 group-hover:bg-blue-50/50 transition-colors">
                             <CheckCircle2 size={14} className="text-blue-500 shrink-0"/>
                             <p className="text-slate-600 text-[11px] font-bold truncate">{s}</p>
                           </div>
                         ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center animate-in fade-in">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <BarChart3 size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Belum Ada Analisis</h3>
                  <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed">
                    Masukkan kriteria kamu di panel sebelah kiri untuk melihat rekomendasi sistem AHP.
                  </p>
                </div>
              )}
            </div>
          </div>
          
        // ======================= TAB: TREN PASAR =======================
        ) : activeTab === 'trends' ? (
          <div className="animate-in fade-in duration-500">
             <div className="bg-slate-900 rounded-[3rem] p-10 mb-8 text-white flex justify-between items-center relative overflow-hidden shadow-xl shadow-slate-200">
                <div className="relative z-10">
                   <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                     <TrendingUp className="text-blue-400"/> Live Market Insights
                   </h2>
                   <p className="text-slate-400 text-sm font-medium">Data diperbarui: {trendsData?.lastUpdated || 'Memuat...'}</p>
                </div>
                <div className="absolute right-0 top-0 opacity-10">
                   <BarChart3 size={150} />
                </div>
             </div>

             {loadingTrends ? (
                <div className="flex justify-center p-20"><Rocket className="animate-bounce text-blue-600" size={32}/></div>
             ) : trendsData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Top Skills Growth */}
                   <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">📈 Pergerakan Skill (Bulan Ini)</h3>
                      <div className="space-y-4">
                         {trendsData.topSkills.map((skill: any, i: number) => (
                           <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                              <div>
                                 <p className="font-bold text-slate-800">{skill.name}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase">{skill.category}</p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-black ${skill.status === 'Turun' ? 'bg-rose-100 text-rose-600' : 'bg-green-100 text-green-600'}`}>
                                 {skill.growth}
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Industry Insights */}
                   <div className="space-y-6">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2 px-2">💡 Analisis Industri</h3>
                      {trendsData.insights.map((insight: any, i: number) => (
                         <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm border-l-4 border-l-blue-500">
                            <h4 className="font-black text-slate-900 mb-2">{insight.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">{insight.desc}</p>
                         </div>
                      ))}
                   </div>
                </div>
             ) : null}
          </div>

        // ======================= TAB: HISTORY =======================
        ) : activeTab === 'history' ? (
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Data Riwayat Terakhir</h2>
              
              <div className="flex gap-3 w-full md:w-auto">
                 <div className="bg-slate-50 p-2 rounded-xl flex items-center px-4 gap-2 text-slate-400 focus-within:ring-2 focus-within:ring-blue-100 flex-1 md:flex-none">
                   <Search size={14} />
                   <input type="text" placeholder="Cari riwayat..." className="bg-transparent outline-none text-xs font-bold w-full md:w-32" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)}/>
                 </div>
                 <button onClick={clearHistory} className="flex items-center gap-2 text-rose-500 bg-rose-50 font-bold text-xs hover:bg-rose-100 px-4 py-2 rounded-xl transition-all">
                   <Trash2 size={14} /> BERSIHKAN
                 </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredHistory.length > 0 ? filteredHistory.map((h: any) => (
                <div key={h.id} className="group bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden">
                  
                  {/* Garis Indikator Kiri */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${expandedHistoryId === h.id ? 'bg-blue-600' : 'bg-slate-200 group-hover:bg-blue-400'}`}></div>

                  {/* Header / Baris yang bisa diklik */}
                  <div 
                    onClick={() => setExpandedHistoryId(expandedHistoryId === h.id ? null : h.id)}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 pl-8 cursor-pointer"
                  >
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CalendarClock size={12} className="text-slate-400" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.date}</p>
                      </div>
                      <p className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                        {h.topResult} <span className="text-xs font-bold text-slate-400 ml-2 hidden md:inline">(Klik untuk detail Top 3)</span>
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="flex flex-col items-end mr-4">
                         <span className="text-xs font-black text-blue-600">{h.score}%</span>
                         <span className="text-[8px] font-bold text-slate-400 uppercase">Match Score</span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-black bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 uppercase tracking-tighter">
                        <Wallet size={12}/> Rp {h.config.modal.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-black bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100 text-blue-600 uppercase tracking-tighter">
                        <BrainCircuit size={12}/> {h.config.skill}
                      </span>
                    </div>
                  </div>

                  {/* DROPDOWN KONTEN TOP 3 (Muncul kalau diklik) */}
                  {expandedHistoryId === h.id && h.top3 && h.top3.length > 0 && (
                    <div className="px-8 pb-6 animate-in slide-in-from-top-4 duration-300">
                       <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {h.top3.map((item: any, idx: number) => (
                             <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 relative shadow-sm">
                                <div className={`absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${idx === 0 ? 'bg-amber-400 shadow-md shadow-amber-200' : idx === 1 ? 'bg-slate-300' : 'bg-orange-300'}`}>
                                  #{idx + 1}
                                </div>
                                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1 mt-1">{item.category}</p>
                                <p className="font-bold text-sm text-slate-800 leading-tight mb-2">{item.name}</p>
                                <div className="flex justify-between items-end">
                                  <span className="text-xs font-black text-slate-600">{item.score}% Match</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest flex flex-col items-center">
                   <History size={48} className="mb-4 opacity-50" />
                   {historySearch ? 'Riwayat tidak ditemukan' : 'Belum ada riwayat tes'}
                </div>
              )}
            </div>
          </div>

        // ======================= TAB: SETTINGS =======================
        ) : (
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in zoom-in-95">
             <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-8">
               <div className="p-4 bg-slate-900 rounded-2xl text-white">
                  <Settings size={28} />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Pengaturan & Profil</h2>
                  <p className="text-slate-400 text-sm font-medium">Kelola preferensi akun {session?.user?.name || 'kamu'} di sini.</p>
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Panel Kiri: Info Akun */}
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <UserCircle size={16} className="text-blue-600"/> Informasi Akun
                   </h3>
                   <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200">
                         {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                         <p className="text-lg font-black text-slate-900">{session?.user?.name || 'User Aktif'}</p>
                         <p className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full mt-2 inline-block">Online & Terverifikasi</p>
                      </div>
                   </div>
                   <button className="w-full py-4 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:border-blue-500 hover:text-blue-600 transition-all uppercase tracking-widest">
                     Ubah Password (Segera)
                   </button>
                </div>

                {/* Panel Kanan: Preferensi Sistem */}
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <LayoutDashboard size={16} className="text-blue-600"/> Preferensi Default AHP
                   </h3>
                   <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
                     Simpan kriteria awalmu agar form tidak perlu diisi ulang setiap kali membuka aplikasi.
                   </p>
                   
                   <div className="space-y-4 mb-6">
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Modal Default (Rp)</label>
                          <input type="number" value={formData.modal} onChange={(e) => setFormData({...formData, modal: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full bg-white border border-slate-200 p-4 rounded-xl outline-none font-bold text-sm focus:border-blue-500 transition-colors" />
                      </div>
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Skill Default</label>
                          <select value={formData.skill} onChange={(e)=>setFormData({...formData, skill: e.target.value})} className="w-full bg-white border border-slate-200 p-4 rounded-xl outline-none font-bold text-sm focus:border-blue-500 transition-colors">
                              <option value="Umum">Umum</option>
                              <option value="Menulis">Menulis</option>
                              <option value="Visual">Visual</option>
                              <option value="Teknis">Teknis</option>
                              <option value="Bicara">Bicara</option>
                          </select>
                      </div>
                   </div>

                   <button onClick={handleSavePreferences} className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${savedSettings ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200'}`}>
                     {savedSettings ? '✓ TERSIMPAN' : 'SIMPAN PREFERENSI'}
                   </button>
                </div>

             </div>
          </div>
        )}
      </section>
    </main>
  )
}