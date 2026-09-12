'use client';

import { useState } from 'react';

type SejarahItem = {
  id: number;
  judul: string;
  konten: string;
  image_url: string;
};

export default function HistoryEntry({ item, index }: { item: SejarahItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const maxPreviewWords = 50;

  const paragraphs = item.konten
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const fullText = paragraphs.join(' ');
  const words = fullText.split(/\s+/).filter(Boolean);
  const needsToggle = words.length > maxPreviewWords;
  const visibleText = expanded
    ? fullText
    : `${words.slice(0, maxPreviewWords).join(' ')}${needsToggle ? '...' : ''}`;

  return (
    <div
      className={`flex flex-col gap-6 transition-all duration-500 md:gap-8 ${
        expanded ? 'md:flex-col' : 'md:flex-row md:items-start'
      }`}
    >
      <div
        className={`order-2 w-full transition-all duration-500 ease-out ${
          expanded ? 'md:order-1 md:w-full' : 'md:w-5/12 md:flex-shrink-0'
        }`}
      >
        {item.image_url && (
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
            <img
              src={item.image_url}
              alt={item.judul}
              className={`w-full rounded-lg transition-all duration-500 ${
                expanded ? 'h-auto md:max-h-[420px]' : 'h-auto md:max-h-[300px]'
              }`}
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      <div
        className={`order-1 flex-1 space-y-4 transition-all duration-500 ${
          expanded ? 'md:order-2' : 'md:order-1'
        }`}
      >
        <h3 className="inline-block border-b border-ladGold/30 pb-3 text-2xl font-bold text-ladGold md:text-4xl">
          {item.judul}
        </h3>

        <div className="text-justify text-base leading-relaxed text-gray-300 md:text-lg">
          <p>{visibleText}</p>

          {needsToggle && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-ladGold/50 bg-ladGold/10 px-4 py-2 text-sm font-semibold text-ladGold transition hover:bg-ladGold/20"
            >
              {expanded ? 'Tampilkan sedikit' : 'Baca selengkapnya'}
              <span className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
