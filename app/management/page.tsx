import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import SiteHeader from '../components/SiteHeader';
import { supabase } from '../../src/lib/supabase';

// 1. Buat tipe data TypeScript untuk Pengurus
type PengurusItem = {
  id: number;
  nama: string;
  jabatan: string;
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

// 2. Fungsi untuk mengambil data pengurus dari Supabase
async function getPengurus() {
  const { data, error } = await supabase
    .from('pengurus')
    .select('*')
    .order('id', { ascending: true }); // Bisa diganti false jika ingin yang terbaru di atas

  if (error) {
    console.error('Error fetching pengurus:', error);
    return [];
  }
  return data as PengurusItem[];
}

export default async function ManagementPage() {
  // 3. Panggil data pengurus
  const pengurus = await getPengurus();

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
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_38%)]" />

        <SiteHeader />

        <div className="page-hero-inner relative z-10 container mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-3xl rounded-[24px] border border-white/10 bg-black/25 p-4 text-center shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm md:p-8 md:text-left">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-ladGold sm:text-xs">
              Kepengurusan
            </p>
            <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-5xl">
              Struktur organisasi dan pengurus
            </h2>
          </div>
        </div>
      </section>

      <ScrollReveal className="content-shell container mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-t-3xl border-t border-ladGold/20 bg-black/30 px-4 py-8 md:px-6 md:py-10">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {pengurus.length > 0 ? (
              pengurus.map((item) => (
                <div 
                  key={item.id} 
                  className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden group hover:border-ladGold/50 transition duration-300"
                >
                  <div className="relative w-full h-72 md:h-80 overflow-hidden bg-black/50">
                    <img
                      src={item.image_url}
                      alt={`Foto ${item.nama}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-6 text-center border-t border-ladGold/20">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ladGold">
                      {item.jabatan}
                    </p>
                    <h3 className="text-xl font-bold text-white">
                      {item.nama}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center py-10">
                Data kepengurusan belum ditambahkan.
              </p>
            )}
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}