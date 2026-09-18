"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../src/lib/supabase";

type SosmedItem = { id: number; platform: string; url: string; };

export default function SosmedAdmin() {
  const [sosmed, setSosmed] = useState<SosmedItem[]>([]);
  const [form, setForm] = useState({ platform: "instagram", url: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fetchSosmed = useCallback(async () => {
    const { data } = await supabase.from("sosmed").select("*").order("id", { ascending: true });
    if (data) setSosmed(data as SosmedItem[]);
  }, []);

  useEffect(() => { fetchSosmed(); }, [fetchSosmed]);

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    await supabase.from("sosmed").insert([{ platform: form.platform, url: form.url }]);
    alert("Sosial media berhasil ditambahkan!");
    setForm({ ...form, url: "" });
    fetchSosmed(); setIsLoading(false);
  };

  const hapus = async (id: number, platform: string) => {
    if (!confirm(`Hapus link ${platform}?`)) return;
    await supabase.from("sosmed").delete().eq("id", id);
    fetchSosmed();
  };

  const isWhatsapp = form.platform === "whatsapp";

  // Ekstrak nomor dari URL wa.me jika sudah ada formatnya
  const waNumber = isWhatsapp && form.url.startsWith("https://wa.me/")
    ? form.url.replace("https://wa.me/", "")
    : form.url;

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ platform: e.target.value, url: "" });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isWhatsapp) {
      // Hanya izinkan angka dan tanda + di depan
      const cleaned = e.target.value.replace(/[^0-9+]/g, "");
      setForm({ ...form, url: "https://wa.me/" + cleaned });
    } else {
      setForm({ ...form, url: e.target.value });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-ladGold pl-4">Kelola Sosial Media</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FORM TAMBAH SOSMED */}
        <div className="bg-zinc-900 p-6 rounded border border-zinc-800 h-fit">
          <h3 className="font-bold text-ladGold mb-4">Tambah Tautan Sosmed</h3>
          <form onSubmit={simpan}>
            <label className="block text-sm text-gray-400 mb-2">Pilih Platform</label>
            <select 
              value={form.platform} 
              onChange={handlePlatformChange}
              className="w-full bg-black border border-zinc-700 p-3 rounded mb-4 focus:border-ladGold outline-none text-white"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            
            {isWhatsapp ? (
              /* INPUT KHUSUS WHATSAPP */
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Nomor WhatsApp
                  <span className="ml-2 text-xs text-ladGold/70">(format internasional, contoh: 628123456789)</span>
                </label>
                <div className="flex items-center rounded border border-zinc-700 bg-black focus-within:border-ladGold overflow-hidden">
                  {/* PREFIX DIKUNCI */}
                  <span className="px-3 py-3 text-sm text-ladGold bg-zinc-800 border-r border-zinc-700 whitespace-nowrap select-none font-mono">
                    https://wa.me/
                  </span>
                  {/* INPUT ANGKA SAJA */}
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="628123456789"
                    value={waNumber}
                    onChange={handleUrlChange}
                    className="flex-1 bg-transparent p-3 text-white outline-none font-mono"
                  />
                </div>
                {waNumber && (
                  <p className="mt-2 text-xs text-green-500">
                    ✓ Link tersimpan: <span className="font-mono">https://wa.me/{waNumber}</span>
                  </p>
                )}
              </div>
            ) : (
              /* INPUT NORMAL UNTUK PLATFORM LAIN */
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">URL / Link Profil</label>
                <input 
                  type="url"
                  required
                  placeholder={
                    form.platform === "instagram" ? "https://instagram.com/username" :
                    form.platform === "tiktok" ? "https://tiktok.com/@username" :
                    form.platform === "youtube" ? "https://youtube.com/@channel" :
                    form.platform === "facebook" ? "https://facebook.com/page" :
                    "https://..."
                  }
                  value={form.url}
                  onChange={handleUrlChange}
                  className="w-full bg-black border border-zinc-700 p-3 rounded focus:border-ladGold outline-none text-white"
                />
              </div>
            )}
            
            <button type="submit" disabled={isLoading} className="w-full bg-ladGold text-black py-3 rounded font-bold hover:bg-ladGoldDark transition">
              {isLoading ? "Menyimpan..." : "Tambahkan Sosmed"}
            </button>
          </form>
        </div>

        {/* DAFTAR SOSMED */}
        <div className="space-y-4">
          {sosmed.map((item) => (
            <div key={item.id} className="bg-zinc-900 p-4 rounded border border-zinc-800 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white uppercase">{item.platform}</h4>
                <p className="text-sm text-gray-400 line-clamp-1">{item.url}</p>
              </div>
              <button onClick={() => hapus(item.id, item.platform)} className="bg-red-900 text-white text-xs px-3 py-1.5 rounded hover:bg-red-800 ml-4 flex-shrink-0">
                Hapus
              </button>
            </div>
          ))}
          {sosmed.length === 0 && <p className="text-gray-500 italic">Belum ada sosial media.</p>}
        </div>

      </div>
    </div>
  );
}