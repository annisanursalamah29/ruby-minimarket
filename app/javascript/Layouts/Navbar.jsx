import React, { useState, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Navbar({ children }) {
  const { auth, url } = usePage();
  const [openDropdown, setOpenDropdown] = useState(null); // 'master' | 'inventory' | null
  const timeoutRef = useRef(null);

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const getLinkClass = (path) => {
    const isActive = url.startsWith(path);
    return `relative px-3 py-2 transition-all duration-200 text-sm font-medium ${
      isActive 
        ? "text-blue-600" 
        : "text-gray-500 hover:text-blue-600"
    }`;
  };

  const DropdownItem = ({ href, icon, label }) => (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-800">
            Mini<span className="text-blue-600">ERP</span>
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <Link href="/dashboard" className={getLinkClass("/dashboard")}>
            Dashboard
            {url.startsWith("/dashboard") && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />}
          </Link>

          {/* Master Data Dropdown */}
          <div className="relative" onMouseEnter={() => handleMouseEnter('master')} onMouseLeave={handleMouseLeave}>
            <button className={`flex items-center gap-1 ${getLinkClass("/master-data")}`}>
              Master Data
              <svg className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'master' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openDropdown === 'master' && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-150">
                <DropdownItem href="/master-data/categories" icon="📁" label="Kategori" />
                <DropdownItem href="/master-data/suppliers" icon="🚚" label="Supplier" />
                <DropdownItem href="/master-data/customers" icon="👥" label="Pelanggan" />
                <DropdownItem href="/master-data/warehouses" icon="🏭" label="Gudang" />
              </div>
            )}
          </div>

          {/* Inventory Dropdown */}
          <div className="relative" onMouseEnter={() => handleMouseEnter('inventory')} onMouseLeave={handleMouseLeave}>
            <button className={`flex items-center gap-1 ${getLinkClass("/produk") || getLinkClass("/pembelian") ? "text-blue-600" : "text-gray-500"}`}>
              <span className={getLinkClass("/produk")}>Inventory</span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'inventory' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openDropdown === 'inventory' && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-150">
                <DropdownItem href="/produk" icon="📦" label="Produk" />
                <DropdownItem href="/pembelian" icon="📥" label="Pembelian" />
                <DropdownItem href="/penyesuaian-stok" icon="⚖️" label="Penyesuaian Stok" />
              </div>
            )}
          </div>

          <Link href="/kasir" className={getLinkClass("/kasir")}>
            💰 Kasir
          </Link>
          <Link href="/riwayat" className={getLinkClass("/riwayat")}>
            📊 Laporan
          </Link>

          <div className="h-6 w-[1px] bg-gray-200 mx-2" />

          <Link
            href="/logout"
            method="delete"
            as="button"
            className="ml-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            Logout
          </Link>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}