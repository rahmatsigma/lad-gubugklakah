"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../src/lib/supabase";

type BeritaItem = { id: number; created_at: string; judul: string; konten: string; image_url: string; };

export default function BeritaAdmin() {
  const [berita, setBerita] = useState<BeritaItem[]>([]);
  const [form, setForm] = useState({ judul: "", konten: "", image_url: "" });
  const [files, setFiles] = useState<File[]>([]);
  
  // State untuk menampung URL foto yang sudah ada (saat mode edit)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetchBerita(); }, []);

  const fetchBerita = async () => {
    const { data } = await supabase.from("berita").select("*").order("created_at", { ascending: false });
    if (data) setBerita(data as BeritaItem[]);
  };

  // --- FUNGSI SIMPAN/UPDATE ---
  const simpan = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    
    // Kita mulai dengan foto-foto yang sudah ada (tidak dihapus)
    let finalImageUrls: string[] = [...existingImages];

    // Jika admin mengupload foto BARU
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const currentFile = files[i];
        const fileExt = currentFile.name.split('.').pop();
        const fileName = `berita-${Date.now()}-${i}.${fileExt}`;
        
        const { error } = await supabase.storage.from("berita_images").upload(fileName, currentFile);
        if (!error) {
          const { data } = supabase.storage.from("berita_images").getPublicUrl(fileName);
          finalImageUrls.push(data.publicUrl); // Tambahkan foto baru ke daftar
        }
      }
    }

    // Gabungkan kembali menjadi satu string dipisah koma
    const finalImageUrlString = finalImageUrls.join(',');

    if (editId) {
      await supabase.from("berita").update({ judul: form.judul, konten: form.konten, image_url: finalImageUrlString }).eq("id", editId);
      alert("Berita Berhasil Diedit!");
    } else {
      await supabase.from("berita").insert([{ judul: form.judul, konten: form.konten, image_url: finalImageUrlString }]);
      alert("Berita Baru Ditambahkan!");
    }

    resetForm();
    fetchBerita(); setIsLoading(false); 
  };

  // --- FUNGSI KLIK EDIT ---
  const klikEdit = (item: BeritaItem) => {
    setForm({ judul: item.judul, konten: item.konten, image_url: item.image_url || "" }); 
    setEditId(item.id); 
    
    // Pecah URL foto menjadi array untuk ditampilkan sebagai preview
    if (item.image_url) {
      setExistingImages(item.image_url.split(',').filter(url => url.trim() !== ''));
    } else {
      setExistingImages([]);
    }
    
    setFiles([]); // Kosongkan file upload baru
  };

  // --- FUNGSI HAPUS 1 FOTO SECARA SPESIFIK SAAT MODE EDIT ---
  const hapusSatuFoto = async (urlHapus: string) => {
    if (!confirm("Hapus foto ini dari artikel?")) return;
    
    // 1. Hapus dari State tampilan (agar langsung hilang dari layar)
    const newExistingImages = existingImages.filter(url => url !== urlHapus);
    setExistingImages(newExistingImages);

    // 2. Hapus file aslinya dari Storage Supabase
    const fileName = urlHapus.split('/berita_images/')[1];
    if (fileName) {
      await supabase.storage.from("berita_images").remove([fileName]);
    }
    
    // 3. Update Database (Simpan sisa URL foto yang masih ada)
    if (editId) {
      const updatedUrlString = newExistingImages.join(',');
      await supabase.from("berita").update({ image_url: updatedUrlString }).eq("id", editId);
      setForm({...form, image_url: updatedUrlString});
      fetchBerita(); // Refresh daftar utama
    }
  };

  // --- FUNGSI HAPUS SELURUH BERITA ---
  const hapusBerita = async (item: BeritaItem) => {
    if (!confirm("Hapus berita ini sepenuhnya?")) return;
    
    // 1. Hapus SEMUA foto di storage
    if (item.image_url) {
      const urls = item.image_url.split(',').filter(url => url.trim() !== '');
      const fileNames = urls.map(url => url.split('/berita_images/')[1]).filter(Boolean);
      if (fileNames.length > 0) {
        await supabase.storage.from("berita_images").remove(fileNames);
      }
    }
    
    // 2. Hapus dari Database
    await supabase.from("berita").delete().eq("id", item.id);
    if(editId === item.id) resetForm(); // Jika yang dihapus sedang diedit, tutup formnya
    fetchBerita();
  };

  // --- FUNGSI RESET FORM ---
  const resetForm = () => {
    setEditId(null); 
    setForm({judul:'', konten:'', image_url: ''}); 
    setFiles([]);
    setExistingImages([]);
    const fileInput = document.getElementById("fileBerita") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-ladGold pl-4">Kelola Berita</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* KOLOM KIRI: FORM & PREVIEW FOTO */}
        <div className="bg-zinc-900 p-6 rounded border border-zinc-800 h-fit">
          <h3 className="font-bold text-ladGold mb-4">{editId ? "Edit Berita" : "Tulis Berita Baru"}</h3>
          
          <form onSubmit={simpan}>
            <input type="text" required placeholder="Judul Berita" value={form.judul} onChange={(e) => setForm({...form, judul: e.target.value})} className="w-full bg-black border border-zinc-700 text-white p-3 rounded mb-4 focus:border-ladGold outline-none" />
            <textarea required rows={5} placeholder="Isi Konten Berita" value={form.konten} onChange={(e) => setForm({...form, konten: e.target.value})} className="w-full bg-black border border-zinc-700 text-white p-3 rounded mb-4 focus:border-ladGold outline-none" />
            
            {/* TAMPILAN PREVIEW FOTO JIKA ADA (HANYA SAAT MODE EDIT) */}
            {editId && existingImages.length > 0 && (
              <div className="mb-6 p-4 bg-black/50 border border-zinc-700 rounded">
                <p className="text-sm text-gray-400 mb-3 font-bold">Foto Tersimpan Saat Ini:</p>
                <div className="grid grid-cols-3 gap-3">
                  {existingImages.map((url, idx) => (
                    <div key={idx} className="relative group rounded overflow-hidden border border-zinc-700 aspect-square">
                      <img src={url} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                      {/* Tombol Hapus Spesifik 1 Foto */}
                      <button 
                        type="button" 
                        onClick={() => hapusSatuFoto(url)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-800 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow"
                        title="Hapus foto ini"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="block text-sm text-gray-400 mb-2">{editId ? "Tambahkan Foto Baru (Bisa pilih banyak)" : "Upload Foto Artikel (Bisa pilih banyak)"}</label>
            <input 
              id="fileBerita" 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={(e) => { if (e.target.files) setFiles(Array.from(e.target.files)); }} 
              className="w-full bg-black border border-zinc-700 text-white p-2 rounded mb-6 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-ladGold file:text-black hover:file:bg-ladGoldDark" 
            />

            <div className="flex gap-2">
              <button type="submit" disabled={isLoading} className="flex-1 bg-ladGold text-black py-3 rounded font-bold hover:bg-ladGoldDark transition">{isLoading ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Publikasikan")}</button>
              {editId && <button type="button" onClick={resetForm} className="bg-zinc-700 text-white px-4 rounded hover:bg-zinc-600 transition">Batal</button>}
            </div>
          </form>
        </div>

        {/* KOLOM KANAN: DAFTAR BERITA */}
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
          {berita.map((item) => {
            const urls = item.image_url ? item.image_url.split(',').filter(url => url.trim() !== '') : [];
            const firstImage = urls.length > 0 ? urls[0] : null;
            const totalImages = urls.length;
            
            return (
              <div key={item.id} className="bg-zinc-900 p-4 rounded border border-zinc-800 flex flex-col sm:flex-row gap-4">
                
                {/* Thumbnail Gambar Utama & Label Jumlah Foto */}
                {firstImage ? (
                  <div className="relative w-full sm:w-28 h-28 flex-shrink-0">
                    <img src={firstImage} alt={item.judul} className="w-full h-full object-cover rounded border border-zinc-700" />
                    {totalImages > 1 && (
                      <div className="absolute bottom-1 right-1 bg-black/80 text-ladGold text-[10px] font-bold px-2 py-0.5 rounded">
                        +{totalImages - 1} foto
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full sm:w-28 h-28 flex-shrink-0 bg-black border border-zinc-800 rounded flex items-center justify-center text-[10px] text-gray-600 text-center px-2">Tanpa Foto</div>
                )}

                <div className="flex-1 flex flex-col">
                  <h4 className="font-bold line-clamp-1 text-ladGold text-lg">{item.judul}</h4>
                  <p className="text-xs text-gray-500 mb-2">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-3 flex-1">{item.konten}</p>
                  
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => klikEdit(item)} className="bg-blue-900 text-white text-xs px-4 py-1.5 rounded hover:bg-blue-800">Edit</button>
                    <button onClick={() => hapusBerita(item)} className="bg-red-900 text-white text-xs px-4 py-1.5 rounded hover:bg-red-800">Hapus Semua</button>
                  </div>
                </div>

              </div>
            );
          })}
          {berita.length === 0 && <p className="text-gray-500 italic text-center py-10">Belum ada berita.</p>}
        </div>

      </div>
    </div>
  );
}