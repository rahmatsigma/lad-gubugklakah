"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../src/lib/supabase";

type ArtikelItem = { id: number; created_at: string; judul: string; konten: string; };

export default function ArtikelAdmin() {
  const [artikel, setArtikel] = useState<ArtikelItem[]>([]);
  const [form, setForm] = useState({ judul: "", konten: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetchArtikel(); }, []);

  const fetchArtikel = async () => {
    const { data } = await supabase.from("artikel").select("*").order("created_at", { ascending: false });
    if (data) setArtikel(data as ArtikelItem[]);
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);

    if (editId) {
      await supabase.from("artikel").update(form).eq("id", editId);
      alert("Artikel Berhasil Diedit!");
    } else {
      await supabase.from("artikel").insert([form]);
      alert("Artikel Baru Ditambahkan!");
    }

    setForm({ judul: "", konten: "" }); setEditId(null);
    fetchArtikel(); setIsLoading(false); 
  };

  const hapus = async (id: number) => {
    if (!confirm("Hapus artikel ini?")) return;
    await supabase.from("artikel").delete().eq("id", id);
    fetchArtikel();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-ladGold pl-4">Kelola Artikel (Teks)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-zinc-900 p-6 rounded border border-zinc-800 h-fit">
          <h3 className="font-bold text-ladGold mb-4">{editId ? "Edit Artikel" : "Tulis Artikel Baru"}</h3>
          <form onSubmit={simpan}>
            <input type="text" required placeholder="Judul Artikel" value={form.judul} onChange={(e) => setForm({...form, judul: e.target.value})} className="w-full bg-black border border-zinc-700 text-white p-3 rounded mb-4 focus:border-ladGold outline-none" />
            <textarea required rows={10} placeholder="Isi Teks Artikel..." value={form.konten} onChange={(e) => setForm({...form, konten: e.target.value})} className="w-full bg-black border border-zinc-700 text-white p-3 rounded mb-6 focus:border-ladGold outline-none" />
            <div className="flex gap-2">
              <button type="submit" disabled={isLoading} className="flex-1 bg-ladGold text-black py-3 rounded font-bold hover:bg-ladGoldDark transition">{isLoading ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Publikasikan")}</button>
              {editId && <button type="button" onClick={() => {setEditId(null); setForm({judul:'', konten:''});}} className="bg-zinc-700 text-white px-4 rounded hover:bg-zinc-600 transition">Batal</button>}
            </div>
          </form>
        </div>

        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
          {artikel.map((item) => (
            <div key={item.id} className="bg-zinc-900 p-5 rounded border border-zinc-800 flex flex-col">
              <h4 className="font-bold text-ladGold text-lg mb-1">{item.judul}</h4>
              <p className="text-xs text-gray-500 mb-3">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
              <p className="text-sm text-gray-300 line-clamp-3 mb-4">{item.konten}</p>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => {setForm({judul: item.judul, konten: item.konten}); setEditId(item.id);}} className="bg-blue-900 text-white text-xs px-4 py-2 rounded hover:bg-blue-800">Edit</button>
                <button onClick={() => hapus(item.id)} className="bg-red-900 text-white text-xs px-4 py-2 rounded hover:bg-red-800">Hapus</button>
              </div>
            </div>
          ))}
          {artikel.length === 0 && <p className="text-gray-500 italic text-center py-10">Belum ada artikel.</p>}
        </div>

      </div>
    </div>
  );
}