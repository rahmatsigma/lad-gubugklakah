import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '../../../src/lib/supabase';

type ArtikelItem = {
  id: number;
  created_at: string;
  judul: string;
  konten: string;
};

async function getArtikelById(id: string) {
  const { data, error } = await supabase
    .from('artikel')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error) {
    console.error('Error fetching artikel detail:', error);
    return null;
  }

  return data as ArtikelItem | null;
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArtikelById(id);

  if (!article) {
    notFound();
  }

  const paragraphs = article.konten
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-ladBlack text-white">
      <div className="mx-auto max-w-4xl px-4 py-20 md:px-6 md:py-24">
        <Link
          href="/artikel"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ladGold transition hover:text-yellow-300"
        >
          ← Kembali ke artikel
        </Link>

        <div className="mb-8 border-b border-ladGold/20 pb-6">
          <div className="mb-4 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ladGold">
            {new Date(article.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
            {article.judul}
          </h1>
        </div>

        <article className="rounded-[28px] border border-zinc-800 bg-zinc-950/80 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.18)] md:p-8">
          <div className="space-y-6 text-base leading-relaxed text-gray-200 md:text-lg">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>{article.konten}</p>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
