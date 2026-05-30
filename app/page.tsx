import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050b14] relative overflow-x-hidden font-sans text-slate-200">
      
      {/* BACKGROUND DIGITAL CYBER */}
      <div className="fixed inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1.5px, transparent 1.5px), radial-gradient(#8b5cf6 1.5px, transparent 1.5px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* TOP NAVBAR MELAYANG */}
      <nav className="fixed top-0 w-full p-4 md:p-6 flex justify-between items-center z-50 border-b border-cyan-500/20 bg-[#0a1120]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(34,211,238,0.05)]">
        
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full px-2">
          {/* Logo Digital Abstrak & Judul */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-widest text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
                MatchMyPath
              </span>
            </div>
          </div>

          {/* MENU KANAN: LOGIN, REGISTER, & TUTORIAL */}
          <div className="flex items-center gap-4 md:gap-6">
            <a href="#panduan" className="text-[10px] md:text-xs font-bold text-slate-300 hover:text-cyan-400 transition-colors hidden md:block uppercase tracking-widest">
              Tutorial
            </a>
            
            {/* TOMBOL MASUK (SIGN IN) */}
            <Link href="/dashboard" className="text-[10px] md:text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-widest">
              Masuk
            </Link>
            
            {/* TOMBOL DAFTAR (SIGN UP) */}
            <Link 
              href="/dashboard"
              className="text-[10px] md:text-xs font-extrabold text-slate-900 bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 px-5 py-2 md:py-2.5 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2 hover:scale-105 uppercase tracking-widest"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative flex flex-col justify-center items-center text-center z-10 px-6 pt-40 pb-32 min-h-screen">
        
        {/* Badge Tech */}
        <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-[#0a1120]/80 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold tracking-widest uppercase shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          AHP Decision Engine Online
        </div>
        
        {/* Main Headline */}
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
          Sistem Navigasi <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 filter drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            Side Hustle Digital
          </span>
        </h2>
        
        {/* Sub-headline */}
        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Kalkulasi secara presisi keselarasan antara modal, waktu, dan keahlian Anda menggunakan arsitektur algoritma <span className="text-cyan-400 font-bold">Analytical Hierarchy Process (AHP)</span>.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link href="/dashboard" className="relative inline-flex group">
            <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
            <button className="relative inline-flex items-center justify-center px-10 py-4 text-base font-extrabold text-white transition-all duration-200 bg-[#050b14] font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 border border-slate-800 tracking-wider">
              MULAI ANALISIS SISTEM 🚀
            </button>
          </Link>

          <a href="#panduan" className="px-10 py-4 rounded-full font-bold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all text-base tracking-wider">
            LIHAT TUTORIAL ⬇️
          </a>
        </div>
      </main>

      {/* TUTORIAL SECTION */}
      <section id="panduan" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-cyan-500/20 bg-[#050b14]/50 backdrop-blur-sm">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-extrabold text-white tracking-tight mb-4">Protokol Penggunaan Sistem</h3>
          <p className="text-slate-400 max-w-xl mx-auto">Hanya butuh 3 langkah sederhana bagi algoritma MatchMyPath untuk menemukan karir sampingan terbaik Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-[#0a1120]/80 p-8 rounded-3xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all shadow-[0_0_30px_rgba(34,211,238,0.05)] text-center group">
            <div className="w-16 h-16 mx-auto bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-2xl font-black text-cyan-400 mb-6 group-hover:scale-110 transition-transform">1</div>
            <h4 className="text-xl font-bold text-white mb-3">Registrasi & Input</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Buat akun secara gratis, lalu masukkan batasan realistis Anda: Ketersediaan Modal, Waktu Luang, dan Skill Dominan.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0a1120]/80 p-8 rounded-3xl border border-violet-500/20 hover:border-violet-400/50 transition-all shadow-[0_0_30px_rgba(139,92,246,0.05)] text-center group">
            <div className="w-16 h-16 mx-auto bg-violet-500/10 border border-violet-500/30 rounded-2xl flex items-center justify-center text-2xl font-black text-violet-400 mb-6 group-hover:scale-110 transition-transform">2</div>
            <h4 className="text-xl font-bold text-white mb-3">Kalkulasi Matriks AHP</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Sistem akan secara otomatis melakukan pembobotan hierarki keputusan berdasarkan database puluhan alternatif pekerjaan yang tersedia.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0a1120]/80 p-8 rounded-3xl border border-blue-500/20 hover:border-blue-400/50 transition-all shadow-[0_0_30px_rgba(59,130,246,0.05)] text-center group">
            <div className="w-16 h-16 mx-auto bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-2xl font-black text-blue-400 mb-6 group-hover:scale-110 transition-transform">3</div>
            <h4 className="text-xl font-bold text-white mb-3">Rekomendasi Utama</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Anda akan mendapatkan Top 3 hasil persentase kecocokan (Match Score), lengkap dengan panduan eksekusi langkah pertama.</p>
          </div>
        </div>
      </section>

    </div>
  );
}