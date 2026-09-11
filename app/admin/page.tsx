"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../src/lib/supabase";

type BeritaItem = {
  id: number;
  created_at: string;
  judul: string;
  konten: string;
};

export default function AdminPage() {
  // State untuk Login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false); // STATE BARU UNTUK HIDE/SHOW PASSWORD

  // State untuk Data
  const [berita, setBerita] = useState<BeritaItem[]>([]);
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi Login Sederhana
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "gubugklakah123") {
      setIsLoggedIn(true);
      fetchBerita();
    } else {
      setErrorMsg("Password salah, Bang!");
    }
  };

  // Fungsi Mengambil Data Berita
  const fetchBerita = async () => {
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBerita(data as BeritaItem[]);
    }
  };

  // Fungsi Menambah Berita
  const handleTambahBerita = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase
      .from("berita")
      .insert([{ judul: judul, konten: konten }]);

    if (error) {
      alert("Gagal menambah berita!");
    } else {
      alert("Berita berhasil ditambahkan!");
      setJudul("");
      setKonten("");
      fetchBerita(); 
    }
    setIsLoading(false);
  };

  // Fungsi Menghapus Berita
  const handleHapusBerita = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin menghapus berita ini?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("berita").delete().eq("id", id);

    if (error) {
      alert("Gagal menghapus berita!");
    } else {
      fetchBerita(); 
    }
  };

  // ================= TAMPILAN LOGIN =================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-ladBlack flex items-center justify-center p-4">
        <form 
          onSubmit={handleLogin} 
          className="bg-zinc-900 p-8 rounded-lg border border-ladGold/30 w-full max-w-md shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-ladGold mb-6 text-center">Login Admin LAD</h2>
          
          <div className="relative mb-4">
            <input
              // Tipe input berubah dinamis berdasarkan state showPassword
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-700 text-white p-3 pr-12 rounded focus:outline-none focus:border-ladGold"
            />
            {/* Tombol Mata (Hide/Show) */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ladGold transition focus:outline-none"
            >
              {showPassword ? (
                // Ikon Mata Terbuka
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                // Ikon Mata Tertutup (Tercoret)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          </div>
          
          {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
          
          <button 
            type="submit"
            className="w-full bg-ladGold text-black font-bold py-3 rounded hover:bg-ladGoldDark transition"
          >
            Masuk
          </button>
        </form>
      </div>
    );
  }

  // ================= TAMPILAN DASHBOARD ADMIN =================
  return (
    <div className="min-h-screen bg-ladBlack text-white p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-4">
          <h1 className="text-3xl font-bold text-ladGold">Dashboard Admin</h1>
          <button 
            onClick={() => {
              setIsLoggedIn(false);
              setPassword(""); // Reset password saat logout
            }}
            className="bg-red-900/50 text-red-500 px-4 py-2 rounded hover:bg-red-900 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Kolom Kiri: Form Tambah Berita */}
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-6">Tambah Kegiatan Baru</h2>
            <form onSubmit={handleTambahBerita}>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2 text-sm">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:outline-none focus:border-ladGold"
                  placeholder="Contoh: Kerja Bakti Desa..."
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 mb-2 text-sm">Konten / Isi</label>
                <textarea
                  required
                  rows={5}
                  value={konten}
                  onChange={(e) => setKonten(e.target.value)}
                  className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:outline-none focus:border-ladGold"
                  placeholder="Tulis detail kegiatan di sini..."
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-ladGold text-black font-bold py-3 rounded hover:bg-ladGoldDark transition disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Publikasikan Berita"}
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Daftar Berita untuk Dihapus */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Kelola Berita</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {berita.map((item) => (
                <div key={item.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-ladGold line-clamp-1">{item.judul}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleHapusBerita(item.id)}
                    className="text-sm bg-red-950 text-red-500 px-3 py-1 rounded border border-red-900 hover:bg-red-900 hover:text-white transition whitespace-nowrap"
                  >
                    Hapus
                  </button>
                </div>
              ))}
              {berita.length === 0 && (
                <p className="text-gray-500 italic">Belum ada berita tersimpan.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}