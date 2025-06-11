import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  imageUrl: string;
  imageAlt: string;
  header: ReactNode;
  children: ReactNode;
}

export default function AuthLayout({ imageUrl, imageAlt, header, children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden font-inter bg-white">
      {/* Kolom Gambar (Kiri) - Tidak ada perubahan */}
      <div className="hidden md:block md:w-1/2 lg:w-[55%] h-full relative">
        <Link href="/" className="absolute top-6 left-6 z-10" aria-label="Back to Home">
          <div className="h-11 w-11 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-all duration-300">
            <span className="text-2xl font-sans leading-none mb-1">&#8592;</span>
          </div>
        </Link>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* === PERUBAHAN UTAMA ADA DI SINI === */}
      {/* Kolom Form (Kanan) - Sekarang menjadi satu area scroll */}
      <div className="w-full md:w-1/2 lg:w-[45%] h-full overflow-y-auto">
        {/* Kontainer untuk padding dan centering */}
        <div className="w-full max-w-md mx-auto px-6 sm:px-10 py-10 md:py-12">
          
          {/* Header dan Children sekarang digabung dalam satu aliran */}
          {header}
          
          {/* Beri jarak antara header dan konten utama */}
          <div className="mt-8">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}