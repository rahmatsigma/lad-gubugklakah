import Image from 'next/image';
// 1. FIX: Menggunakan jalur langsung ke folder src
import { supabase } from '../src/lib/supabase';

// 2. FIX: Membuat Tipe Data TypeScript untuk berita
type BeritaItem = {
  id: number;
  created_at: string;
  judul: string;
  konten: string;
};

async function getBerita() {
  const { data: berita, error } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }
  return berita as BeritaItem[];
}

export default async function Home() {
  const berita = await getBerita();

  return (
    <main className="min-h-screen bg-ladBlack text-white font-sans">
      
      {/* Navbar / Header */}
      <header className="border-b border-ladGoldDark/30 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image 
              src="/Logo LAD bg hitam.jpg.jpeg" 
              alt="Logo Lembaga Adat Desa Gubugklakah" 
              width={60} 
              height={60}
              className="rounded-full object-cover"
            />
            <h1 className="text-xl font-bold text-ladGold uppercase tracking-wider">
              LAD Gubugklakah
            </h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#" className="hover:text-ladGold transition">Beranda</a>
            <a href="#" className="hover:text-ladGold transition">Profil</a>
            <a href="#" className="hover:text-ladGold transition">Kegiatan</a>
            <a href="#" className="hover:text-ladGold transition">Kontak</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="mb-8 p-4 bg-black/50 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.2)]">
          <Image 
            src="/Logo LAD 3D.png" 
            alt="Lembaga Adat Desa Gubugklakah 3D" 
            width={250} 
            height={250}
            className="rounded-full"
          />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-ladGold mb-4 drop-shadow-lg">
          Menjaga Tradisi, Membangun Desa
        </h2>
        <p className="text-gray-400 max-w-2xl text-lg mb-8">
          Selamat datang di portal resmi Lembaga Adat Desa Gubugklakah. Pusat informasi kegiatan, pelestarian budaya, dan kearifan lokal.
        </p>
        <button className="bg-ladGold text-black px-8 py-3 rounded-full font-bold hover:bg-ladGoldDark transition">
          Jelajahi Program Kami
        </button>
      </section>

      {/* Section Berita dari Supabase */}
      <section className="container mx-auto py-16 px-4">
        <h3 className="text-3xl font-bold text-ladGold border-l-4 border-ladGold pl-4 mb-8">
          Kabar & Kegiatan Desa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {berita.length > 0 ? (
            // FIX: Menambahkan tipe data BeritaItem ke parameter item
            berita.map((item: BeritaItem) => (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg hover:border-ladGold/50 transition">
                <h4 className="text-xl font-bold text-white mb-2">{item.judul}</h4>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(item.created_at).toLocaleDateString('id-ID')}
                </p>
                <p className="text-gray-300 line-clamp-3">
                  {item.konten}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada berita yang dipublikasikan.</p>
          )}
        </div>
      </section>

      <footer className="bg-zinc-950 py-8 border-t border-ladGoldDark/20 text-center">
        <p className="text-gray-500">
          © {new Date().getFullYear()} Lembaga Adat Desa Gubugklakah. All rights reserved.
        </p>
      </footer>

    </main>
  );
}