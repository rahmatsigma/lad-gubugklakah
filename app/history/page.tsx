import Image from 'next/image';
import Link from 'next/link';
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

export default async function HistoryPage() {
  const sejarahData = await getSejarah();

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
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-ladGold">Sejarah Desa</p>
          <h2 className="max-w-2xl text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
            Jejak budaya dan kearifan lokal
          </h2>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16">
        
        {sejarahData.length > 0 ? (
          <div className="space-y-20">
            {sejarahData.map((item, index) => (
              <div 
                key={item.id} 
                // Logika agar layoutnya selang-seling (kiri-kanan)
                className={`flex flex-col gap-10 items-start ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
              >
                
                {/* Bagian Teks */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-ladGold mb-4 border-b border-zinc-800 pb-4 inline-block">
                    {item.judul}
                  </h3>
                  <div className="text-gray-300 leading-relaxed text-justify space-y-4">
                    {item.konten.split('\n').map((paragraph, idx) => (
                      paragraph.trim() !== '' && <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Bagian Foto */}
                {item.image_url && (
                  <div className="w-full md:w-5/12 flex-shrink-0">
                    <div className="relative p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                      <img 
                        src={item.image_url} 
                        alt={item.judul} 
                        className="w-full rounded object-cover shadow-2xl"
                      />
                    </div>
                  </div>
                )}
                
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-20">Belum ada data sejarah yang ditambahkan.</p>
        )}

      </section>
    </main>
  );
}