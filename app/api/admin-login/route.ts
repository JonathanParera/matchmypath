import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body; 

    // Cek Kredensial Khusus Admin (Tidak mengecek ke database sama sekali)
    if (email === "admin@gmail.com" && password === "admin123") {
      return NextResponse.json({ 
        success: true, 
        message: "Otorisasi Admin Berhasil!",
        user: {
          name: "Super Admin",
          email: "admin@gmail.com",
          role: "ADMIN"
        }
      });
    } else {
      // Jika salah, tolak mentah-mentah
      return NextResponse.json({ 
        success: false, 
        message: "Akses Ditolak: Kredensial Admin Tidak Valid!" 
      }, { status: 401 });
    }

  } catch (error) {
    console.error("Error Admin Login:", error);
    return NextResponse.json({ success: false, message: "Gangguan server keamanan." }, { status: 500 });
  }
}