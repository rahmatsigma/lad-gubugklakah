import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../src/lib/supabase';
// Panggil komponen slider yang baru dibuat
import ImageSlider from './imageslider';

type BeritaItem = {
  id: number;
  created_at: string;
  judul: string;
  konten: string;
  image_url: string;
};

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Sejarah Desa', href: '/history' },
  { label: 'Kepengurusan', href: '/management' },
  { label: 'Galeri', href: '/galery' },
  { label: 'Berita', href: '/article' },
  { label: 'Kontak', href: '/contact' },
];

async function getBeritaLengkap() {
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching berita:', error);
    return [];
  }
  return data as BeritaItem[];
}

export default async function ArticlePage() {
  const beritaData = await getBeritaLengkap();

  return (
    <main className="min-h-screen bg-ladBlack text-white font-sans">
      {/* HERO SECTION */}
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
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),_transparent_40%)]" />

        <header className="relative z-20 border-b border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo LAD 3D.png"
                alt="Logo Lembaga Adat Desa Gubugklakah"
                width={46}
                height={46}
                className="rounded-full object-cover"
              />
              <h1 className="text-base font-bold uppercase tracking-wider text-ladGold md:text-xl">LAD Gubugklakah</h1>
            </div>

            <nav className="hidden items-center gap-5 text-sm text-white/90 md:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-ladGold">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <div className="relative z-10 container mx-auto max-w-5xl px-4 pb-14 pt-16 text-left md:pt-20">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-ladGold">Artikel</p>
          <h2 className="max-w-2xl text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
            Kisah, edukasi, dan inspirasi desa
          </h2>
          <div className="mt-8 max-w-3xl bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-lg">
            <p className="text-gray-300 mb-4">
              Artikel ini menjadi wadah untuk menyampaikan gagasan, pengalaman, serta informasi yang memperkuat pelestarian budaya dan semangat gotong royong.
            </p>
            <p className="text-gray-300">
              Melalui tulisan dan dokumentasi, masyarakat dapat belajar tentang tradisi, sejarah, dan inovasi yang menjaga Desa Gubugklakah tetap relevan dan maju.
            </p>
          </div>
        </div>
      </section>

      {/* KONTEN ARTIKEL SELANG-SELING */}
      <section className="container mx-auto max-w-5xl px-4 py-20">
        {beritaData.length > 0 ? (
          <div className="space-y-24">
            {beritaData.map((item, index) => {
              const imageUrls = item.image_url ? item.image_url.split(',') : [];

              return (
                <div 
                  key={item.id} 
                  className={`flex flex-col gap-10 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                >
                  
                  {/* BAGIAN TEKS ARTIKEL */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="inline-block bg-zinc-900 border border-zinc-800 text-ladGold text-xs font-bold px-3 py-1 rounded-full mb-2">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                      {item.judul}
                    </h3>
                    <div className="text-gray-400 leading-relaxed text-justify space-y-4 mt-4">
                      {item.konten.split('\n').map((paragraph, idx) => (
                        paragraph.trim() !== '' && <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* BAGIAN FOTO ARTIKEL (MEMANGGIL KOMPONEN SLIDER) */}
                  {imageUrls.length > 0 && (
                    <div className="w-full md:w-5/12 flex-shrink-0">
                      <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                        {/* Ini memanggil file ImageSlider.tsx yang baru kita buat */}
                        <ImageSlider imageUrls={imageUrls} />
                      </div>
                    </div>
                  )}
                  
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-20">Belum ada artikel yang dipublikasikan.</p>
        )}
      </section>

      <footer className="bg-zinc-950 py-8 border-t border-ladGoldDark/20 text-center mt-10">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Lembaga Adat Desa Gubugklakah. All rights reserved.
        </p>
      </footer>
    </main>
  );
}