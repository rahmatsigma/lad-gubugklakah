"use client";

import { useState } from "react";
import Link from "next/link";
// Import semua komponen yang sudah kita pisah
import BeritaAdmin from "./components/berita";
import PengurusAdmin from "./components/pengurusan";
import GaleriAdmin from "./components/galeri";
import SejarahAdmin from "./components/sejarah";
import KontakAdmin from "./components/kontak";
import ArtikelAdmin from "./components/artikel";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("berita");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    setIsLoggedIn(false);
    setPassword("");
    setShowLogoutConfirm(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "2025LAD-Gubugklakah") {
      setIsLoggedIn(true); setErrorMsg("");
    } else {
      setErrorMsg("Password salah, Bang!");
    }
  };

  // ================= TAMPILAN LOGIN =================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-ladBlack flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-lg border border-ladGold/30 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold text-ladGold mb-6 text-center">Login Admin LAD</h2>
          <div className="relative mb-4">
            <input type={showPassword ? "text" : "password"} placeholder="Masukkan Password..." value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-zinc-700 text-white p-3 pr-12 rounded focus:outline-none focus:border-ladGold" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ladGold transition">
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              )}
            </button>
          </div>
          {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
          <button type="submit" className="w-full bg-ladGold text-black font-bold py-3 rounded hover:bg-ladGoldDark transition">Masuk</button>

          <Link href="/" className="flex items-center justify-center gap-2 mt-4 w-full py-3 rounded border border-zinc-700 text-gray-400 hover:bg-zinc-800 hover:text-white transition text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </form>
      </div>
    );
  }

  // ================= TAMPILAN DASHBOARD =================
  return (
    <div className="min-h-screen flex bg-ladBlack text-white">
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col p-6 hidden md:flex">
        <h2 className="text-2xl font-bold text-ladGold mb-10 border-b border-zinc-800 pb-4">Panel Admin</h2>
        <nav className="flex flex-col gap-3 flex-1">
          <button onClick={() => setActiveTab("berita")} className={`text-left px-4 py-3 rounded transition ${activeTab === "berita" ? "bg-ladGold text-black font-bold" : "hover:bg-zinc-800 text-gray-300"}`}>Berita</button>
          <button onClick={() => setActiveTab("pengurus")} className={`text-left px-4 py-3 rounded transition ${activeTab === "pengurus" ? "bg-ladGold text-black font-bold" : "hover:bg-zinc-800 text-gray-300"}`}>Pengurus Lembaga</button>
          <button onClick={() => setActiveTab("galeri")} className={`text-left px-4 py-3 rounded transition ${activeTab === "galeri" ? "bg-ladGold text-black font-bold" : "hover:bg-zinc-800 text-gray-300"}`}>Galeri Kegiatan</button>
          <button onClick={() => setActiveTab("sejarah")} className={`text-left px-4 py-3 rounded transition ${activeTab === "sejarah" ? "bg-ladGold text-black font-bold" : "hover:bg-zinc-800 text-gray-300"}`}>Sejarah Desa</button>
          <button onClick={() => setActiveTab("kontak")} className={`text-left px-4 py-3 rounded transition ${activeTab === "kontak" ? "bg-ladGold text-black font-bold" : "hover:bg-zinc-800 text-gray-300"}`}>Info Kontak</button>
          <button onClick={() => setActiveTab("artikel")} className={`text-left px-4 py-3 rounded transition ${activeTab === "artikel" ? "bg-ladGold text-black font-bold" : "hover:bg-zinc-800 text-gray-300"}`}>Artikel </button>
        </nav>
        <button onClick={() => setShowLogoutConfirm(true)} className="mt-auto bg-red-950 text-red-500 py-3 rounded hover:bg-red-900 transition font-semibold">Logout</button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {/* Render Komponen Sesuai Tab yang Aktif */}
        {activeTab === "berita" && <BeritaAdmin />}
        {activeTab === "pengurus" && <PengurusAdmin />}
        {activeTab === "galeri" && <GaleriAdmin />}
        {activeTab === "sejarah" && <SejarahAdmin />}
        {activeTab === "kontak" && <KontakAdmin />}
        {activeTab === "artikel" && <ArtikelAdmin />}
      </main>
      {/* Modal Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center animate-in fade-in">
            {/* Ikon Peringatan */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-950 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Konfirmasi Logout</h3>
            <p className="text-gray-400 mb-6 text-sm">Apakah kamu yakin ingin keluar dari panel admin?</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-zinc-600 text-gray-300 hover:bg-zinc-800 transition font-medium"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-bold"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}