"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../src/lib/supabase";

type SejarahItem = { id: number; created_at: string; judul: string; konten: string; image_url: string; };

export default function SejarahAdmin() {
  const [sejarah, setSejarah] = useState<SejarahItem[]>([]);
  const [form, setForm] = useState({ judul: "", konten: "", image_url: "" });
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetchSejarah(); }, []);

  const fetchSejarah = async () => {
    // Diurutkan berdasarkan ID agar urutan bab sejarahnya sesuai saat pertama kali diinput
    const { data } = await supabase.from("sejarah").select("*").order("id", { ascending: true });
    if (data) setSejarah(data as SejarahItem[]);
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    let imageUrl = form.image_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `sejarah-${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from("info_images").upload(fileName, file);
      
      if (!error) {
        const { data } = supabase.storage.from("info_images").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      } else {
        alert("Gagal upload foto!"); setIsLoading(false); return;
      }
    }

    if (editId) {
      await supabase.from("sejarah").update({ judul: form.judul, konten: form.konten, image_url: imageUrl }).eq("id", editId);
      alert("Bagian sejarah berhasil diperbarui!");
    } else {
      await supabase.from("sejarah").insert([{ judul: form.judul, konten: form.konten, image_url: imageUrl }]);
      alert("Bagian sejarah baru ditambahkan!");
    }

    setForm({ judul: "", konten: "", image_url: "" }); setFile(null); setEditId(null);
    const fileInput = document.getElementById("fileSejarah") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    fetchSejarah(); setIsLoading(false);
  };

  const hapus = async (item: SejarahItem) => {
    if (!confirm(`Hapus bagian sejarah "${item.judul}"?`)) return;
    await supabase.from("sejarah").delete().eq("id", item.id);
    if (item.image_url) {
      const fileName = item.image_url.split('/info_images/')[1];
      if (fileName) await supabase.storage.from("info_images").remove([fileName]);
    }
    fetchSejarah();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-ladGold pl-4">Kelola Sejarah Desa</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* KOLOM FORM */}
        <div className="bg-zinc-900 p-6 rounded border border-zinc-800 h-fit">
          <h3 className="font-bold text-ladGold mb-4">{editId ? "Edit Bagian Sejarah" : "Tambah Bagian Sejarah"}</h3>
          <form onSubmit={simpan}>
            <input type="text" required placeholder="Judul Bab (cth: Prasasti Pabañolan)" value={form.judul} onChange={(e) => setForm({...form, judul: e.target.value})} className="w-full bg-black border border-zinc-700 p-3 rounded mb-4 focus:border-ladGold outline-none text-white" />
            <textarea rows={8} required placeholder="Isi teks sejarah..." value={form.konten} onChange={(e) => setForm({...form, konten: e.target.value})} className="w-full bg-black border border-zinc-700 p-3 rounded mb-4 focus:border-ladGold outline-none text-white" />
            
            <label className="block text-sm text-gray-400 mb-2">{editId ? "Ganti Foto (Opsional)" : "Upload Foto Pendukung (Opsional)"}</label>
            <input id="fileSejarah" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full bg-black border border-zinc-700 text-white p-2 rounded mb-6 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-ladGold file:text-black hover:file:bg-ladGoldDark" />
            
            <div className="flex gap-2">
              <button type="submit" disabled={isLoading} className="flex-1 bg-ladGold text-black py-3 rounded font-bold hover:bg-ladGoldDark transition">{isLoading ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Tambahkan Bagian")}</button>
              {editId && <button type="button" onClick={() => {setEditId(null); setForm({judul:'', konten:'', image_url:''}); setFile(null);}} className="bg-zinc-700 text-white px-4 rounded hover:bg-zinc-600 transition">Batal</button>}
            </div>
          </form>
        </div>

        {/* KOLOM DAFTAR SEJARAH */}
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
          {sejarah.map((item) => (
            <div key={item.id} className="bg-zinc-900 p-4 rounded border border-zinc-800 flex flex-col sm:flex-row gap-4">
              {item.image_url ? (
                <img src={item.image_url} alt={item.judul} className="w-full sm:w-28 h-28 object-cover rounded border border-zinc-700" />
              ) : (
                <div className="w-full sm:w-28 h-28 bg-black border border-zinc-800 rounded flex items-center justify-center text-xs text-gray-600">Tanpa Foto</div>
              )}
              <div className="flex-1 flex flex-col">
                <h4 className="font-bold text-ladGold text-lg mb-1">{item.judul}</h4>
                <p className="text-sm text-gray-300 line-clamp-2 mb-3 flex-1">{item.konten}</p>
                <div className="flex gap-2 mt-auto">
                  <button onClick={() => {setForm({judul: item.judul, konten: item.konten, image_url: item.image_url || ""}); setEditId(item.id); setFile(null);}} className="bg-blue-900 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-800">Edit</button>
                  <button onClick={() => hapus(item)} className="bg-red-900 text-white text-xs px-3 py-1.5 rounded hover:bg-red-800">Hapus</button>
                </div>
              </div>
            </div>
          ))}
          {sejarah.length === 0 && <p className="text-gray-500 italic">Belum ada data sejarah.</p>}
        </div>

      </div>
    </div>
  );
}