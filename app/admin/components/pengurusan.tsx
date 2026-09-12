"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../src/lib/supabase";

type PengurusItem = { id: number; nama: string; jabatan: string; image_url: string; };

export default function PengurusAdmin() {
  const [pengurus, setPengurus] = useState<PengurusItem[]>([]);
  const [form, setForm] = useState({ nama: "", jabatan: "", image_url: "" });
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetchPengurus(); }, []);

  const fetchPengurus = async () => {
    const { data } = await supabase.from("pengurus").select("*").order("id", { ascending: false });
    if (data) setPengurus(data as PengurusItem[]);
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    let imageUrl = form.image_url;

    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("pengurus_images").upload(fileName, file);
      if (!error) {
        const { data } = supabase.storage.from("pengurus_images").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }
    }

    if (editId) {
      await supabase.from("pengurus").update({ nama: form.nama, jabatan: form.jabatan, image_url: imageUrl }).eq("id", editId);
      alert("Berhasil Diedit!");
    } else {
      if (!imageUrl) { alert("Foto wajib diisi!"); setIsLoading(false); return; }
      await supabase.from("pengurus").insert([{ nama: form.nama, jabatan: form.jabatan, image_url: imageUrl }]);
      alert("Berhasil Ditambahkan!");
    }

    setForm({ nama: "", jabatan: "", image_url: "" }); setFile(null); setEditId(null);
    const fileInput = document.getElementById("filePengurus") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    fetchPengurus(); setIsLoading(false);
  };

  const hapus = async (item: PengurusItem) => {
    if (!confirm("Hapus pengurus?")) return;
    await supabase.from("pengurus").delete().eq("id", item.id);
    const fileName = item.image_url.split('/pengurus_images/')[1];
    if (fileName) await supabase.storage.from("pengurus_images").remove([fileName]);
    fetchPengurus();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-ladGold pl-4">Kelola Pengurus</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-6 rounded border border-zinc-800 h-fit">
          <h3 className="font-bold text-ladGold mb-4">{editId ? "Edit Pengurus" : "Tambah Pengurus"}</h3>
          <form onSubmit={simpan}>
            <input type="text" required placeholder="Nama Lengkap" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} className="w-full bg-black border border-zinc-700 p-3 rounded mb-4 focus:border-ladGold outline-none" />
            <input type="text" required placeholder="Jabatan" value={form.jabatan} onChange={(e) => setForm({...form, jabatan: e.target.value})} className="w-full bg-black border border-zinc-700 p-3 rounded mb-4 focus:border-ladGold outline-none" />
            <label className="block text-sm text-gray-400 mb-2">{editId ? "Ganti Foto (Opsional)" : "Upload Foto"}</label>
            <input id="filePengurus" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full bg-black border border-zinc-700 text-white p-2 rounded mb-4" />
            <div className="flex gap-2">
              <button type="submit" disabled={isLoading} className="flex-1 bg-ladGold text-black py-3 rounded font-bold hover:bg-ladGoldDark transition">{editId ? "Simpan Perubahan" : "Tambahkan"}</button>
              {editId && <button type="button" onClick={() => {setEditId(null); setForm({nama:'', jabatan:'', image_url:''})}} className="bg-zinc-700 text-white px-4 rounded hover:bg-zinc-600 transition">Batal</button>}
            </div>
          </form>
        </div>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {pengurus.map((item) => (
            <div key={item.id} className="bg-zinc-900 p-4 rounded border border-zinc-800 flex justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <img src={item.image_url} alt={item.nama} className="w-12 h-12 rounded-full object-cover border border-ladGold/50" />
                <div><h4 className="font-bold text-ladGold">{item.nama}</h4><p className="text-sm text-gray-300">{item.jabatan}</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => {setForm({nama: item.nama, jabatan: item.jabatan, image_url: item.image_url}); setEditId(item.id); setFile(null);}} className="bg-blue-900 text-white text-sm px-3 py-1 rounded hover:bg-blue-800">Edit</button>
                <button onClick={() => hapus(item)} className="bg-red-900 text-white text-sm px-3 py-1 rounded hover:bg-red-800">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}