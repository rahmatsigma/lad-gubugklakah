"use client";

import { useState, useRef } from "react";

export default function ImageSlider({ imageUrls }: { imageUrls: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk mendeteksi posisi geseran (swipe/scroll)
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      // Membulatkan hasil bagi untuk tahu kita sedang di foto ke-berapa
      const currentIndex = Math.round(scrollLeft / width);
      setActiveIndex(currentIndex);
    }
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
      
      {/* Container Foto */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {imageUrls.map((url, idx) => (
          <div key={idx} className="min-w-full snap-center flex-shrink-0">
            <img
              src={url.trim()}
              alt={`Foto Dokumentasi ${idx + 1}`}
              className="w-full h-[250px] md:h-[300px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Indikator Titik-Titik (Dots) ala Instagram */}
      {imageUrls.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {imageUrls.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "bg-ladGold w-4" : "bg-white/50 w-1.5"
              }`}
            />
          ))}
        </div>
      )}

    </div>
  );
}