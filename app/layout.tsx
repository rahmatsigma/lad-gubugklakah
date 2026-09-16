import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lembaga Adat Desa Gubugklakah",
  description: "Portal Resmi Lembaga Adat Desa Gubugklakah, Poncokusumo, Malang. Menjaga tradisi, pelestarian budaya, sejarah, dan kearifan lokal Tengger.",
  keywords: "lad gubugklakah, lembaga adat desa gubugklakah, gubugklakah, sejarah gubugklakah, budaya tengger, poncokusumo malang",
  authors: [{ name: "LAD Gubugklakah" }],
  openGraph: {
    title: "Lembaga Adat Desa Gubugklakah",
    description: "Pusat informasi kegiatan, pelestarian budaya, dan kearifan lokal Desa Gubugklakah.",
    url: "https://lad-gubugklakah.vercel.app",
    siteName: "Lembaga Adat Desa Gubugklakah",
    images: [
      {
        url: "/Logo LAD 3D.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Paste kode verifikasi Google di sini */}
        <meta name="google-site-verification" content="lOiCtnSprI_8rZZv2U2yFZ9BOJ5_eLMwUoY4DtKgyQ0" />
      </head>
      <body>{children}</body>
    </html>
  );
}