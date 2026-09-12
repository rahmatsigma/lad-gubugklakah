'use client';

import { useState } from 'react';
import ImageSlider from './imageslider';

type BeritaItem = {
  id: number;
  created_at: string;
  judul: string;
  konten: string;
  image_url: string;
};

export default function ArticleCard({ item }: { item: BeritaItem }) {
  const [expanded, setExpanded] = useState(false);
  const maxPreviewWords = 50;

  const paragraphs = item.konten
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const previewText = paragraphs.join(' ');
  const previewWords = previewText.split(/\s+/).filter(Boolean);

  const isLong = previewWords.length > maxPreviewWords || item.konten.length > 500;
  const visibleParagraphs = expanded
    ? paragraphs
    : previewWords.length > maxPreviewWords
      ? [`${previewWords.slice(0, maxPreviewWords).join(' ')}...`]
      : paragraphs.length > 0
        ? paragraphs.slice(0, 2)
        : [];

  const imageUrls = item.image_url ? item.image_url.split(',').filter(Boolean) : [];

  return (
    <div
      className={`flex w-full flex-col gap-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        expanded ? 'md:flex-col' : 'md:flex-row md:items-start'
      }`}
    >
      <div
        className={`w-full flex-1 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          expanded ? 'order-2 md:translate-y-2' : 'order-1 md:translate-y-0'
        }`}
      >
        <div className="mb-3 inline-block rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-bold text-ladGold">
          {new Date(item.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        <h3 className="text-2xl font-bold leading-tight text-white md:text-3xl">{item.judul}</h3>

        <div className="mt-4">
          <div
            className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              expanded ? 'max-h-[2000px] translate-y-0 opacity-100' : 'max-h-[160px] translate-y-4 opacity-90'
            }`}
          >
            <div className="space-y-4 text-justify text-gray-400 leading-relaxed">
              {visibleParagraphs.map((paragraph, idx) => (
                <p key={`${item.id}-${idx}`}>{paragraph}</p>
              ))}
            </div>
          </div>

          {isLong && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-ladGold/50 bg-ladGold/10 px-5 py-2.5 text-sm font-semibold text-ladGold transition-all duration-300 hover:scale-[1.01] hover:bg-ladGold/20"
                aria-expanded={expanded}
              >
                {expanded ? 'Tampilkan sedikit' : 'Baca selengkapnya'}
                <span
                  className={`inline-block transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                >
                  ▾
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {imageUrls.length > 0 && (
        <div
          className={`w-full flex-shrink-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            expanded ? 'order-1 md:-translate-y-3 md:scale-[1.02]' : 'order-2 md:w-5/12 md:translate-y-0 md:scale-100'
          }`}
        >
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
            <ImageSlider imageUrls={imageUrls} />
          </div>
        </div>
      )}
    </div>
  );
}
