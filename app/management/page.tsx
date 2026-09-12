import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../src/lib/supabase'; // Pastikan jalurnya benar

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
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_38%)]" />

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
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-ladGold">Kepengurusan</p>
          <h2 className="max-w-2xl text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
            Struktur organisasi dan pengurus
          </h2>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          
          {/* 4. Menampilkan data dari Supabase */}
          {pengurus.length > 0 ? (
            pengurus.map((item) => (
              <div 
                key={item.id} 
                className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden group hover:border-ladGold/50 transition duration-300"
              >
                {/* Bagian Foto */}
                <div className="relative w-full h-72 md:h-80 overflow-hidden bg-black/50">
                  <img
                    src={item.image_url}
                    alt={`Foto ${item.nama}`}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                
                {/* Bagian Teks (Nama & Jabatan) */}
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
      </section>
    </main>
  );
}