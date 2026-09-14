import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../../src/lib/supabase';

type ArtikelItem = {
  id: number;
  created_at: string;
  judul: string;
  konten: string;
};

function getPreviewText(text: string, maxWords = 38) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(' ')}...`;
}

async function getArtikel() {
  const { data, error } = await supabase
    .from('artikel')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching artikel:', error);
    return [] as ArtikelItem[];
  }

  return data as ArtikelItem[];
}

export default async function ArtikelPage() {
  const artikelData = await getArtikel();

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
              Artikel
            </p>
            <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-5xl">
              Tulisan dan gagasan lembaga adat
            </h2>
          </div>
        </div>
      </section>

      <ScrollReveal className="content-shell relative bg-[#050505] py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="rounded-[28px] border border-ladGold/80 bg-[#050505] px-4 py-5 shadow-[0_0_0_1px_rgba(212,175,55,0.18)] md:px-6 md:py-7">
            {artikelData.length > 0 ? (
              <div className="space-y-6">
                {artikelData.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[20px] border border-ladGold/70 bg-[#090909] p-5 transition duration-300 hover:border-ladGold hover:shadow-[0_12px_30px_rgba(212,175,55,0.12)] md:p-8"
                  >
                    <div className="mb-5 inline-flex items-center rounded-full border border-ladGold/80 bg-[#d4af37]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-ladGold md:text-[11px]">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>

                    <h3 className="mb-5 text-3xl font-black leading-tight tracking-[-0.03em] text-white md:text-5xl">
                      {item.judul}
                    </h3>

                    <p className="max-w-4xl text-justify text-base leading-relaxed text-gray-300 md:text-[1.08rem]">
                      {getPreviewText(item.konten)}
                    </p>

                    <div className="mt-6 flex flex-col gap-4 border-t border-ladGold/20 pt-4 md:flex-row md:items-center md:justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gray-400 md:text-xs">
                        Jurnal Lembaga Adat Desa
                      </span>

                      <Link
                        href={`/artikel/${item.id}`}
                        className="inline-flex items-center justify-center rounded-full border border-ladGold/70 bg-ladGold/10 px-5 py-2.5 text-sm font-semibold text-ladGold transition hover:bg-ladGold hover:text-black"
                      >
                        Baca selengkapnya
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="py-20 text-center text-gray-400">Belum ada artikel yang dipublikasikan.</p>
            )}
          </div>
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