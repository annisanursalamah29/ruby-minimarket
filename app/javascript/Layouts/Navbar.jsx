import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Navbar({ children }) {
  // Ambil data auth dan url saat ini dari usePage
  const { auth, url } = usePage();

  // Helper function untuk menentukan class styling
  const getLinkClass = (path) => {
    const isActive = url.startsWith(path);
    return isActive 
      ? "text-blue-600 font-bold border-b-2 border-blue-600" // Style saat aktif
      : "text-gray-600 hover:text-blue-600";               // Style biasa
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl text-blue-600">🛒 MiniMarket</div>
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className={getLinkClass('/dashboard')}>
            Dashboard
          </Link>
          <Link href="/produk" className={getLinkClass('/produk')}>
            Produk
          </Link>
          <Link href="/kasir" className={getLinkClass('/kasir')}>
            Kasir
          </Link>
          <Link href="/riwayat" className={getLinkClass('/riwayat')}>
            Laporan
          </Link>
          
          <Link 
            href="/logout" 
            method="delete" 
            as="button"
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
          >
            Logout
          </Link>
        </div>
      </nav>

      {/* KONTEN HALAMAN */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}