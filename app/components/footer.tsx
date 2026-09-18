import Link from 'next/link';
import React from 'react';
import { supabase } from '../../src/lib/supabase';
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const iconMap: Record<string, React.ReactNode> = {
  instagram: <FaInstagram className="text-2xl hover:text-ladGold transition duration-300" />,
  tiktok: <FaTiktok className="text-2xl hover:text-ladGold transition duration-300" />,
  youtube: <FaYoutube className="text-2xl hover:text-ladGold transition duration-300" />,
  facebook: <FaFacebook className="text-2xl hover:text-ladGold transition duration-300" />,
  whatsapp: <FaWhatsapp className="text-2xl hover:text-ladGold transition duration-300" />,
};

// Fungsi ambil data sosmed dari Supabase
async function getSosmed() {
  const { data, error } = await supabase.from('sosmed').select('*');
  if (error) {
    console.error("Error fetching sosmed:", error);
    return [];
  }
  return data || [];
}

export default async function Footer() {
  const sosmedList = await getSosmed();

  return (
    <footer className="bg-zinc-950 py-8 border-t border-ladGoldDark/20 text-center mt-10">
      
      {/* Looping (Membangunkan Ikon dari Kamus) */}
      {sosmedList.length > 0 && (
        <div className="flex justify-center gap-6 mb-4">
          {sosmedList.map((item) => (
            <Link key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
              {iconMap[item.platform.toLowerCase()]}
            </Link>
          ))}
        </div>
      )}

      <p className="text-gray-500 text-sm">
        © {new Date().getFullYear()} Lembaga Adat Desa Gubugklakah.
      </p>
    </footer>
  );
}