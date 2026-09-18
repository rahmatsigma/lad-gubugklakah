export const revalidate = 0;

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
  { label: 'Berita', href: '/berita' },
  { label: 'Artikel', href: '/artikel' },
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

function getJabatanRank(jabatan: string) {
  const normalized = jabatan.toLowerCase();

  if (normalized.includes('ketua')) return 1;
  if (normalized.includes('wakil')) return 2;
  if (normalized.includes('sekretaris')) return 3;
  if (normalized.includes('bendahara')) return 4;
  if (normalized.includes('pelaksana')) return 5;
  if (normalized.includes('anggota')) return 6;

  return 99;
}

export default async function ManagementPage() {
  // 3. Panggil data pengurus
  const pengurus = await getPengurus();
  const topLeadership = pengurus.filter((item) => {
    const normalized = item.jabatan.toLowerCase();
    return normalized.includes('ketua') || normalized.includes('wakil');
  });

  const managementMembers = pengurus.filter((item) => {
    const normalized = item.jabatan.toLowerCase();
    return !(
      normalized.includes('ketua') ||
      normalized.includes('wakil') ||
      normalized.includes('anggota') ||
      normalized.includes('pelaksana') ||
      normalized.includes('sekretaris') ||
      normalized.includes('bendahara')
    );
  });

  const otherMembers = pengurus.filter((item) => {
    const normalized = item.jabatan.toLowerCase();
    return !(
      normalized.includes('ketua') ||
      normalized.includes('wakil')
    );
  });

  const pengurusTerurut = [
    ...topLeadership.sort((a, b) => getJabatanRank(a.jabatan) - getJabatanRank(b.jabatan)),
    ...otherMembers.sort((a, b) => {
      const rankDiff = getJabatanRank(a.jabatan) - getJabatanRank(b.jabatan);
      if (rankDiff !== 0) return rankDiff;
      return a.nama.localeCompare(b.nama, 'id');
    }),
  ];

  const leadershipCount = topLeadership.length;
  const memberCount = otherMembers.length;

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
          {pengurusTerurut.length > 0 ? (
            <div className="space-y-8">
              {leadershipCount > 0 && (
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2">
                  {pengurusTerurut.slice(0, leadershipCount).map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition duration-300 hover:border-ladGold/50"
                    >
                      <div className="relative h-72 w-full overflow-hidden bg-black/50 md:h-80">
                        <img
                          src={item.image_url}
                          alt={`Foto ${item.nama}`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="border-t border-ladGold/20 p-6 text-center">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ladGold">
                          {item.jabatan}
                        </p>
                        <h3 className="text-xl font-bold text-white">{item.nama}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {memberCount > 0 && (
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                  {pengurusTerurut.slice(leadershipCount).map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition duration-300 hover:border-ladGold/50"
                    >
                      <div className="relative h-72 w-full overflow-hidden bg-black/50 md:h-80">
                        <img
                          src={item.image_url}
                          alt={`Foto ${item.nama}`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="border-t border-ladGold/20 p-6 text-center">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ladGold">
                          {item.jabatan}
                        </p>
                        <h3 className="text-xl font-bold text-white">{item.nama}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="py-10 text-center text-gray-400">Data kepengurusan belum ditambahkan.</p>
          )}
        </div>
      </ScrollReveal>
    </main>
  );
}