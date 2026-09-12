import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import SiteHeader from '../components/SiteHeader';
import { supabase } from '../../src/lib/supabase';

// Tipe data Galeri
type GaleriItem = {
  id: number;
  created_at: string;
  judul: string;
  keterangan: string;
  image_url: string;
};

// Menu Navigasi
const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Sejarah Desa', href: '/history' },
  { label: 'Kepengurusan', href: '/management' },
  { label: 'Galeri', href: '/galery' },
  { label: 'Berita', href: '/article' },
  { label: 'Kontak', href: '/contact' },
];

// Fungsi untuk mengambil data galeri dari Supabase
async function getGaleri() {
  const { data, error } = await supabase
    .from('galeri')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching galeri:', error);
    return [];
  }
  return data as GaleriItem[];
}

export default async function GaleryPage() {
  const galeriData = await getGaleri();

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
              Galeri
            </p>
            <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-5xl">
              Dokumentasi kegiatan dan budaya
            </h2>
            <div className="mt-5 max-w-3xl rounded-lg border border-white/10 bg-black/30 p-4 backdrop-blur-md md:mt-8 md:p-6">
              <p className="text-sm text-gray-300 md:text-base">
                Jelajahi momen-momen penting dan keseharian masyarakat Desa Gubugklakah melalui galeri visual kami. Dari upacara adat hingga gotong royong warga, setiap foto menyimpan cerita bermakna.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal className="content-shell container mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-t-3xl border-t border-ladGold/20 bg-black/30 px-4 py-8 md:px-6 md:py-10">
          {galeriData.length > 0 ? (
            <div className="space-y-24">
              {galeriData.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`flex flex-col gap-10 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                >
                  <div className="flex-1 space-y-4 w-full">
                    <div className="inline-block bg-zinc-900 border border-zinc-800 text-ladGold text-xs font-bold px-3 py-1 rounded-full mb-2">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                      {item.judul}
                    </h3>
                    <div className="text-gray-400 leading-relaxed text-justify space-y-4 mt-4 text-lg">
                      {item.keterangan.split('\n').map((paragraph, idx) => (
                        paragraph.trim() !== '' && <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {item.image_url && (
                    <div className="w-full md:w-6/12 flex-shrink-0 group">
                      <div className="relative p-2 bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt={item.judul} 
                          className="w-full h-[300px] md:h-[400px] rounded object-cover shadow-2xl group-hover:scale-105 transition duration-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-20">Belum ada foto yang diunggah ke galeri.</p>
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