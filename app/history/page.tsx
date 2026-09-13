import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import SiteHeader from '../components/SiteHeader';
import { supabase } from '../../src/lib/supabase';

type SejarahItem = {
  id: number;
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

async function getSejarah() {
  // Mengambil seluruh data sejarah dan mengurutkannya dari ID terkecil (Bab Pertama) ke terbesar
  const { data, error } = await supabase
    .from('sejarah')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching sejarah:', error);
    return [];
  }
  return data as SejarahItem[];
}

import HistoryEntry from './HistoryEntry';

export default async function HistoryPage() {
  const sejarahData = await getSejarah();

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
              Sejarah Desa
            </p>
            <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-5xl">
              Jejak budaya dan kearifan lokal
            </h2>
          </div>
        </div>
      </section>

      <ScrollReveal className="content-shell container mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-t-3xl border-t border-ladGold/20 bg-black/30 px-4 py-8 md:px-6 md:py-10">
          {sejarahData.length > 0 ? (
            <div className="space-y-20">
              {sejarahData.map((item, index) => (
                <HistoryEntry key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-20">Belum ada data sejarah yang ditambahkan.</p>
          )}
        </div>
      </ScrollReveal>
    </main>
  );
}