import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../src/lib/supabase';

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
      <section className="relative overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/bg%20video.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Video latar belakang Desa Gubugklakah"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.20),_transparent_42%)]" />

        <header className="relative z-20 border-b border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo LAD bg hitam.jpg.jpeg"
                alt="Logo Lembaga Adat Desa Gubugklakah"
                width={46}
                height={46}
                className="rounded-full object-cover"
              />
              <h1 className="text-base font-bold uppercase tracking-wider text-ladGold md:text-xl">
                LAD Gubugklakah
              </h1>
            </div>

            <nav className="hidden items-center gap-5 text-sm text-white/90 md:flex">
              <Link href="/" className="transition hover:text-ladGold">Beranda</Link>
              <Link href="/history" className="transition hover:text-ladGold">Sejarah Desa</Link>
              <Link href="/management" className="transition hover:text-ladGold">Kepengurusan</Link>
              <Link href="/galery" className="transition hover:text-ladGold">Galeri</Link>
              <Link href="/article" className="transition hover:text-ladGold">Artikel</Link>
              <Link href="/contact" className="transition hover:text-ladGold">Kontak</Link>
            </nav>
          </div>
        </header>

        <div className="relative z-10 container mx-auto flex min-h-[480px] flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-ladGold/30 bg-black/20 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-ladGold/90 backdrop-blur-sm md:text-xs">
            Lembaga Adat Desa
          </div>

          <h2 className="mb-4 max-w-5xl text-3xl font-bold leading-tight text-ladGold drop-shadow-lg sm:text-4xl md:text-6xl">
            Menjaga Tradisi, <span className="text-white">Membangun Desa</span>
          </h2>

          <p className="max-w-3xl text-base text-gray-200 sm:text-lg md:text-xl">
            Selamat datang di portal resmi Lembaga Adat Desa Gubugklakah. Pusat informasi kegiatan, pelestarian budaya, dan kearifan lokal.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-16 px-4">
        <h3 className="text-3xl font-bold text-ladGold border-l-4 border-ladGold pl-4 mb-8">
          Kabar & Kegiatan Desa
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {berita.length > 0 ? (
            berita.map((item: BeritaItem) => (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg hover:border-ladGold/50 transition">
                <h4 className="text-xl font-bold text-white mb-2">{item.judul}</h4>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(item.created_at).toLocaleDateString('id-ID')}
                </p>
                <p className="text-gray-300 line-clamp-3">{item.konten}</p>
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