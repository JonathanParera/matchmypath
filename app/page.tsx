import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050b14] relative overflow-hidden flex flex-col justify-center items-center font-sans text-slate-200">
      
      {/* BACKGROUND DIGITAL CYBER (Pola Titik & Glowing) */}
      <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1.5px, transparent 1.5px), radial-gradient(#8b5cf6 1.5px, transparent 1.5px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* TOP NAVBAR MELAYANG */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-50 border-b border-cyan-500/20 bg-[#0a1120]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(34,211,238,0.05)]">
        
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
        
        {/* Tombol Admin */}
        <Link href="/admin" className="text-sm font-bold text-cyan-400 hover:text-white transition-colors bg-[#050b14] border border-cyan-500/30 hover:border-cyan-400 px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          Admin Portal 🔒
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="text-center z-10 px-6 max-w-4xl pt-20">
        
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
        
        {/* Call to Action Button */}
        <Link href="/dashboard" className="relative inline-flex group">
          <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
          <button className="relative inline-flex items-center justify-center px-10 py-5 text-lg font-extrabold text-white transition-all duration-200 bg-[#050b14] font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 border border-slate-800">
            Mulai Analisis Sistem 🚀
          </button>
        </Link>
        
      </main>

    </div>
  );
}