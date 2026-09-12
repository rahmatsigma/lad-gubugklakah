import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import SiteHeader from '../components/SiteHeader';
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
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),_transparent_40%)]" />

        <SiteHeader />

        <div className="page-hero-inner relative z-10 container mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-3xl rounded-[24px] border border-white/10 bg-black/25 p-4 text-center shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm md:p-8 md:text-left">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-ladGold sm:text-xs">
              Informasi
            </p>
            <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-5xl">
              Kontak Kami
            </h2>
          </div>
        </div>
      </section>

      <ScrollReveal className="content-shell container mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-t-3xl border-t border-ladGold/20 bg-black/30 px-4 py-8 md:px-6 md:py-10">
          {kontak && kontak.konten ? (
            <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold text-ladGold mb-6 border-b border-zinc-800 pb-4">
                Lembaga Adat Desa Gubugklakah
              </h3>
              <div className="text-gray-300 leading-relaxed space-y-4 text-lg">
                {kontak.konten.split('\n').map((paragraph: string, idx: number) => (
                  paragraph.trim() !== '' && <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-20">Data kontak belum tersedia.</p>
          )}
        </div>
      </ScrollReveal>

      <footer className="bg-zinc-950 py-8 border-t border-ladGoldDark/20 text-center mt-10">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Lembaga Adat Desa Gubugklakah. All rights reserved.
        </p>
      </footer>
    </main>
  );
}