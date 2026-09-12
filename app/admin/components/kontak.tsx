"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../src/lib/supabase";

export default function KontakAdmin() {
  const [konten, setKonten] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetchKontak(); }, []);

  const fetchKontak = async () => {
    const { data } = await supabase.from("info_desa").select("*").eq("kategori", "kontak").single();
    if (data) setKonten(data.konten);
  };

  const simpan = async () => {
    setIsLoading(true);
    // Kontak tidak pakai image_url sesuai permintaan
    await supabase.from("info_desa").upsert({ kategori: "kontak", konten: konten });
    alert("Kontak berhasil diperbarui!"); fetchKontak(); setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-ladGold pl-4">Halaman Kontak</h1>
      <div className="bg-zinc-900 p-6 rounded border border-zinc-800 max-w-3xl">
        <h3 className="font-bold text-ladGold mb-4">Ubah Info Kontak (Murni Teks)</h3>
        <textarea rows={6} value={konten} onChange={(e) => setKonten(e.target.value)} className="w-full bg-black border border-zinc-700 p-3 rounded mb-4 focus:border-ladGold outline-none" placeholder="Alamat lengkap, Email, No WhatsApp..." />
        <button onClick={simpan} disabled={isLoading} className="w-full bg-ladGold text-black py-3 rounded font-bold hover:bg-ladGoldDark transition">{isLoading ? "Menyimpan..." : "Simpan Info Kontak"}</button>
      </div>
    </div>
  );
}