import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from './components/ScrollReveal';
import SiteHeader from './components/SiteHeader';
import { supabase } from '../src/lib/supabase';

type BeritaItem = {
  id: number;
  created_at: string;
  judul: string;
  konten: string;
};

// 1. Fungsi getBerita sekarang dibatasi hanya mengambil 3 data terbaru
async function getBerita() {
  const { data: berita, error } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3); // <-- Tambahan limit 3 di sini

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
      <section className="page-hero relative isolate overflow-hidden">
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

        <SiteHeader />

        <div className="page-hero-inner relative z-10 container mx-auto px-4 text-center">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-center">
            <div className="mb-5 inline-flex items-center rounded-full border border-ladGold/30 bg-black/20 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-ladGold/90 backdrop-blur-sm md:text-xs">
              Lembaga Adat Desa
            </div>

            <div className="max-w-6xl rounded-[28px] border border-white/5 bg-black/10 px-3 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-[2px] md:px-6 md:py-6">
              <h2 className="mb-4 text-3xl font-bold leading-[0.95] tracking-[-0.04em] text-ladGold drop-shadow-lg sm:text-4xl md:text-7xl">
                Menjaga Tradisi, <span className="text-white">Membangun Desa</span>
              </h2>

              <p className="mx-auto max-w-4xl text-base leading-relaxed text-gray-200 sm:text-lg md:text-2xl">
                Selamat datang di portal resmi Lembaga Adat Desa Gubugklakah. Pusat informasi kegiatan, pelestarian budaya, dan kearifan lokal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal className="content-shell container mx-auto px-4 py-16">
        <div className="rounded-t-3xl border-t border-ladGold/20 bg-black/30 px-4 py-8 md:px-6 md:py-10">
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

          {berita.length > 0 && (
            <div className="mt-10 flex justify-center">
              <Link 
                href="/article" 
                className="inline-block bg-ladGold text-black font-bold px-8 py-3 rounded-full hover:bg-ladGoldDark transition duration-300"
              >
                Lihat Semua Berita
              </Link>
            </div>
          )}
        </div>
      </ScrollReveal>

      <footer className="bg-zinc-950 py-8 border-t border-ladGoldDark/20 text-center">
        <p className="text-gray-500">
          © {new Date().getFullYear()} Lembaga Adat Desa Gubugklakah. All rights reserved.
        </p>
      </footer>
    </main>
  );
}