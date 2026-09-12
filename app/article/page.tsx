import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import SiteHeader from '../components/SiteHeader';
import { supabase } from '../../src/lib/supabase';
import ArticleCard from './ArticleCard';

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
          <div className="mx-auto max-w-4xl rounded-[24px] border border-white/10 bg-black/25 p-4 text-center shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm md:p-8 md:text-left">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-ladGold sm:text-xs">
              Artikel
            </p>
            <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-5xl">
              Kisah, edukasi, dan inspirasi desa
            </h2>
            <div className="mt-5 max-w-3xl rounded-lg border border-white/10 bg-black/30 p-4 backdrop-blur-md md:mt-8 md:p-6">
              <p className="mb-3 text-sm text-gray-300 md:text-base">
                Artikel ini menjadi wadah untuk menyampaikan gagasan, pengalaman, serta informasi yang memperkuat pelestarian budaya dan semangat gotong royong.
              </p>
              <p className="text-sm text-gray-300 md:text-base">
                Melalui tulisan dan dokumentasi, masyarakat dapat belajar tentang tradisi, sejarah, dan inovasi yang menjaga Desa Gubugklakah tetap relevan dan maju.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal className="content-shell container mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-t-3xl border-t border-ladGold/20 bg-black/30 px-4 py-8 md:px-6 md:py-10">
          {beritaData.length > 0 ? (
            <div className="space-y-24">
              {beritaData.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 md:p-6"
                >
                  <ArticleCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-gray-400">Belum ada artikel yang dipublikasikan.</p>
          )}
        </div>
      </ScrollReveal>

      <footer className="mt-10 border-t border-ladGoldDark/20 bg-zinc-950 py-8 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Lembaga Adat Desa Gubugklakah. All rights reserved.
        </p>
      </footer>
    </main>
  );
}