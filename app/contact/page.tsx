import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../src/lib/supabase';

// Menu Navigasi
const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Sejarah Desa', href: '/history' },
  { label: 'Kepengurusan', href: '/management' },
  { label: 'Galeri', href: '/galery' },
  { label: 'Artikel', href: '/article' },
  { label: 'Kontak', href: '/contact' },
];

// Fungsi untuk mengambil data kontak dari Supabase
async function getKontak() {
  const { data, error } = await supabase
    .from('info_desa')
    .select('*')
    .eq('kategori', 'kontak')
    .single();

  if (error) {
    console.error('Error fetching kontak:', error);
    return null;
  }
  return data;
}

export default async function ContactPage() {
  // Memanggil data dari database
  const kontak = await getKontak();

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
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-ladGold">Informasi</p>
          <h2 className="max-w-2xl text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
            Kontak Kami
          </h2>
        </div>
      </section>

      {/* KONTEN KONTAK (DARI DATABASE) */}
      <section className="container mx-auto max-w-3xl px-4 py-20">
        {kontak && kontak.konten ? (
          <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-lg shadow-2xl">
            <h3 className="text-2xl font-bold text-ladGold mb-6 border-b border-zinc-800 pb-4">
              Lembaga Adat Desa Gubugklakah
            </h3>
            <div className="text-gray-300 leading-relaxed space-y-4 text-lg">
              {/* Memecah teks berdasarkan enter/baris baru agar paragrafnya rapi */}
              {kontak.konten.split('\n').map((paragraph: string, idx: number) => (
                paragraph.trim() !== '' && <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-20">Data kontak belum tersedia.</p>
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