"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../src/lib/supabase";

// Tambahan 'keterangan' pada tipe data
type GaleriItem = { 
  id: number; 
  created_at: string; 
  judul: string; 
  keterangan: string; 
  image_url: string; 
};

export default function GaleriAdmin() {
  const [galeri, setGaleri] = useState<GaleriItem[]>([]);
  
  // State form diubah untuk menampung judul dan keterangan
  const [form, setForm] = useState({ judul: "", keterangan: "", image_url: "" });
  const [file, setFile] = useState<File | null>(null);
  
  // State untuk mode edit
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetchGaleri(); }, []);

  const fetchGaleri = async () => {
    const { data } = await supabase.from("galeri").select("*").order("created_at", { ascending: false });
    if (data) setGaleri(data as GaleriItem[]);
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);

    let imageUrl = form.image_url;

    // Jika admin mengupload foto baru
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("galeri_images").upload(fileName, file);
      
      if (uploadError) {
        alert("Gagal mengupload gambar!"); 
        setIsLoading(false); 
        return;
      }
      
      const { data } = supabase.storage.from("galeri_images").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // Jika mode edit
    if (editId) {
      await supabase.from("galeri").update({
        judul: form.judul,
        keterangan: form.keterangan,
        image_url: imageUrl
      }).eq("id", editId);
      alert("Galeri berhasil diedit!");
    } 
    // Jika nambah data baru
    else {
      if (!imageUrl) {
        alert("Foto wajib diupload untuk galeri baru!");
        setIsLoading(false);
        return;
      }
      await supabase.from("galeri").insert([{ 
        judul: form.judul, 
        keterangan: form.keterangan, 
        image_url: imageUrl    
      }]);
      alert("Foto baru berhasil ditambahkan ke Galeri!");
    }

    // Reset Form
    setForm({ judul: "", keterangan: "", image_url: "" }); 
    setFile(null); 
    setEditId(null);
    const fileInput = document.getElementById("fileGaleri") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    
    fetchGaleri(); 
    setIsLoading(false);
  };

  const hapus = async (item: GaleriItem) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    await supabase.from("galeri").delete().eq("id", item.id);
    const fileName = item.image_url.split('/galeri_images/')[1];
    if (fileName) await supabase.storage.from("galeri_images").remove([fileName]);
    fetchGaleri();
  };

  const klikEdit = (item: GaleriItem) => {
    setForm({ 
      judul: item.judul, 
      keterangan: item.keterangan || "", 
      image_url: item.image_url 
    });
    setEditId(item.id);
    setFile(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-ladGold pl-4">Kelola Galeri Foto</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* KOLOM KIRI: FORM */}
        <div className="bg-zinc-900 p-6 rounded border border-zinc-800 h-fit">
          <h3 className="font-bold text-ladGold mb-4">{editId ? "Edit Galeri Foto" : "Upload Foto Baru"}</h3>
          <form onSubmit={simpan}>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Judul Kegiatan</label>
              <input type="text" required placeholder="Contoh: Upacara Bersih Desa" value={form.judul} onChange={(e) => setForm({...form, judul: e.target.value})} className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:border-ladGold outline-none" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Keterangan Kegiatan</label>
              <textarea rows={3} required placeholder="Tuliskan deskripsi singkat kegiatan..." value={form.keterangan} onChange={(e) => setForm({...form, keterangan: e.target.value})} className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:border-ladGold outline-none" />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">{editId ? "Ganti Foto (Opsional)" : "Upload Foto Kegiatan"}</label>
              <input id="fileGaleri" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full bg-black border border-zinc-700 text-white p-2 rounded file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-bold file:bg-ladGold file:text-black hover:file:bg-ladGoldDark" />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={isLoading} className="flex-1 bg-ladGold text-black py-3 rounded font-bold hover:bg-ladGoldDark transition">
                {isLoading ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Upload ke Galeri")}
              </button>
              {editId && (
                <button type="button" onClick={() => {setEditId(null); setForm({judul:'', keterangan:'', image_url:''});}} className="bg-zinc-700 text-white px-4 rounded hover:bg-zinc-600 transition">Batal</button>
              )}
            </div>

          </form>
        </div>

        {/* KOLOM KANAN: DAFTAR GALERI */}
        <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {galeri.map((item) => (
            <div key={item.id} className="bg-zinc-900 rounded border border-zinc-800 overflow-hidden flex flex-col">
              <img src={item.image_url} alt={item.judul} className="w-full h-32 object-cover" />
              <div className="p-3 flex-1 flex flex-col">
                <p className="text-sm font-bold text-ladGold truncate">{item.judul}</p>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1 mb-3 flex-1">{item.keterangan}</p>
                
                <div className="flex gap-2 mt-auto">
                  <button onClick={() => klikEdit(item)} className="flex-1 bg-blue-900 text-white text-xs px-2 py-1.5 rounded hover:bg-blue-800 transition">Edit</button>
                  <button onClick={() => hapus(item)} className="flex-1 bg-red-900 text-white text-xs px-2 py-1.5 rounded hover:bg-red-800 transition">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}