import { NextResponse } from 'next/server'

export async function GET() {
  // Simulasi data tren yang biasanya didapat dari web scraping / API eksternal
  const marketData = {
    lastUpdated: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
    topSkills: [
      { name: "AI Prompt Engineering", growth: "+125%", status: "Hot", category: "Teknis" },
      { name: "UGC (User Generated Content)", growth: "+85%", status: "Naik", category: "Kreatif" },
      { name: "TikTok Affiliate", growth: "+60%", status: "Naik", category: "Marketing" },
      { name: "Data Entry Basic", growth: "-20%", status: "Turun", category: "Admin" },
    ],
    insights: [
      {
        title: "Era Automasi AI",
        desc: "Pekerjaan repetitif seperti Data Entry mulai menurun, digantikan oleh permintaan tinggi untuk orang yang bisa menggunakan AI (ChatGPT, Midjourney)."
      },
      {
        title: "Pergeseran Kreator Konten",
        desc: "Brand lebih menyukai kreator skala kecil (Micro-influencer) atau UGC Creator dibandingkan influencer besar karena lebih otentik dan murah."
      }
    ]
  }

  // Beri jeda 1 detik seolah-olah mengambil data dari server luar
  await new Promise(resolve => setTimeout(resolve, 1000))

  return NextResponse.json(marketData)
}