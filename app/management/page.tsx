import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Sejarah Desa', href: '/history' },
  { label: 'Kepengurusan', href: '/management' },
  { label: 'Galeri', href: '/galery' },
  { label: 'Artikel', href: '/article' },
  { label: 'Kontak', href: '/contact' },
];

export default function ManagementPage() {
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
                src="/Logo LAD bg hitam.jpg.jpeg"
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
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-ladGold">Kepengurusan</p>
          <h2 className="max-w-2xl text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
            Struktur organisasi dan pengurus
          </h2>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Ketua', 'Menyusun arah dan program adat desa'],
            ['Sekretaris', 'Mengelola administrasi dan dokumen lembaga'],
            ['Bendahara', 'Mengawasi keuangan dan kebutuhan kegiatan'],
          ].map(([jabatan, tugas]) => (
            <div key={jabatan} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-ladGold">{jabatan}</p>
              <p className="text-gray-300">{tugas}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
