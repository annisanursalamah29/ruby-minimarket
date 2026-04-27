import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Navbar from '../../Layouts/Navbar';

export default function Stock({ products, categories, filters, lowStockCount }) {
  const [search, setSearch] = useState(filters.barcode || "");
  const [values, setValues] = useState({
    barcode: "",
    name: "",
    stock: "",
    price: "",
    category_id: categories?.[0]?.id || ""
  });
  const [editingId, setEditingId] = useState(null);

  // 1. Color Mapping untuk Kategori
  // Fungsi ini memberikan warna berbeda berdasarkan ID kategori secara konsisten
  const getCategoryStyle = (id) => {
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-amber-100 text-amber-700 border-amber-200',
      'bg-pink-100 text-pink-700 border-pink-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200',
    ];
    // Menggunakan modulo agar jika kategori > 7, warna akan berulang
    return colors[id % colors.length];
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  // Tambahkan ref untuk memantau apakah ini render pertama kali
const isFirstRender = React.useRef(true);

useEffect(() => {
  // Jangan jalankan router.get pada render pertama jika search kosong
  if (isFirstRender.current) {
    isFirstRender.current = false;
    // Jika tidak ada filter barcode di URL, jangan lakukan apa-apa
    if (!filters.barcode && search === "") {
      return;
    }
  }

  const delayDebounceFn = setTimeout(() => {
    // Gunakan query object yang bersih
    const query = { ...filters, barcode: search };
    
    // Opsional: Hapus key barcode dari URL jika input kosong agar URL kembali bersih
    if (!search) delete query.barcode;

    router.get('/produk', query, { 
      preserveState: true, 
      replace: true,
      preserveScroll: true // Tambahan agar scroll tidak lompat saat mengetik
    });
  }, 300);

  return () => clearTimeout(delayDebounceFn);
}, [search]);

  const handleFilterCategory = (id) => {
    router.get('/produk', { ...filters, category_id: id }, { preserveState: true });
  };

  const resetForm = () => {
    setEditingId(null);
    setValues({ barcode: "", name: "", stock: "", price: "", category_id: categories?.[0]?.id || "" });
  };

  // Tambahkan fungsi navigasi halaman
  const handlePageChange = (page) => {
    if (!page) return;
    router.get('/produk', { ...filters, page: page }, { 
      preserveState: true, 
      preserveScroll: true 
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    const options = {
      onSuccess: () => { resetForm(); Toast.fire({ icon: 'success', title: editingId ? 'Data diperbarui' : 'Data ditambahkan' }); },
      onError: (errors) => {
        const errorMsg = errors.barcode ? `Barcode "${values.barcode}" ${errors.barcode}` : 'Periksa kembali form Anda.';
        Swal.fire({ icon: 'error', title: 'Gagal Menyimpan', text: errorMsg });
      }
    };
    editingId ? router.put(`/products/${editingId}`, { product: values }, options) : router.post('/products', { product: values }, options);
  }

  function handleDelete(id) {
    if (id === editingId) {
      Swal.fire({ icon: 'warning', title: 'Gagal', text: 'Selesaikan proses edit terlebih dahulu.' });
      return;
    }
    Swal.fire({
      title: 'Hapus Produk?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/products/${id}`, { onSuccess: () => Toast.fire({ icon: 'success', title: 'Produk dihapus' }) });
      }
    });
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setValues({ barcode: product.barcode, name: product.name, stock: product.stock, price: product.price, category_id: product.category_id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
        <div className="max-w-6xl mx-auto">
          <Navbar>
          
          {/* ALERT STOK KRITIS */}
          {lowStockCount > 0 && (
            <div className="mb-6 flex items-center p-4 bg-red-600 text-white rounded-xl shadow-lg animate-bounce">
            <span className="text-2xl mr-4">🚨</span>
            <p className="font-bold">Perhatian: {lowStockCount} Produk hampir habis!</p>
          </div>
          )}

          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">📦 STOCK PRODUK</h1>
            <div className="relative w-full md:w-80">
              <input type="text" placeholder="Scan barcode..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all shadow-sm" />
              <span className="absolute left-3 top-3 text-slate-400">🔍</span>
            </div>
          </header>

          {/* FORM SECTION */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Barcode</label>
                <input type="text" value={values.barcode} onChange={e => setValues({...values, barcode: e.target.value})} className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Barang</label>
                <input type="text" value={values.name} onChange={e => setValues({...values, name: e.target.value})} className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Kategori</label>
                <select value={values.category_id} onChange={e => setValues({...values, category_id: e.target.value})} className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none">
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Stok</label>
                <input type="number" value={values.stock} onChange={e => setValues({...values, stock: e.target.value})} className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Harga (Rp)</label>
                <input type="number" value={values.price} onChange={e => setValues({...values, price: e.target.value})} className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className={`flex-1 py-2.5 rounded-lg text-white font-bold shadow-md transition-all active:scale-95 ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {editingId ? 'Update' : 'Simpan'}
                </button>
                {editingId && <button type="button" onClick={resetForm} className="px-3 py-2.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300">×</button>}
              </div>
            </form>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800 text-white text-xs uppercase tracking-widest">
                    <th className="py-4 px-6">Barcode</th>
                    <th className="py-4 px-6">Produk</th>
                    <th className="py-4 px-6">Kategori</th>
                    <th className="py-4 px-6 text-center">Stok</th>
                    <th className="py-4 px-6 text-right">Harga</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
    {/* Perhatikan penggunaan products.data di bawah ini */}
    {products.data && products.data.length > 0 ? (
      products.data.map((p) => (
        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
          <td className="py-4 px-6 font-mono text-xs text-slate-400">{p.barcode}</td>
          <td className="py-4 px-6 font-bold text-slate-700">{p.name}</td>
          
          <td className="py-4 px-6">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getCategoryStyle(p.category_id)}`}>
              {p.category?.name || 'Uncategorized'}
            </span>
          </td>

          <td className="py-4 px-6 text-center">
            {p.stock <= 10 ? (
              <span className="inline-flex items-center justify-center px-3 py-1 bg-red-100 text-red-600 rounded-lg font-black text-sm border border-red-200 animate-pulse">
                ⚠️ {p.stock}
              </span>
            ) : (
              <span className="font-semibold text-slate-600">{p.stock}</span>
            )}
          </td>

          <td className="py-4 px-6 text-right font-bold text-slate-800">
            Rp{Number(p.price).toLocaleString('id-ID')}
          </td>
          <td className="py-4 px-6">
            <div className="flex justify-center gap-4">
              <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-tighter">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-tighter">Hapus</button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="text-center py-20 text-slate-400 font-medium">
          Data tidak tersedia.
        </td>
      </tr>
    )}
  </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}
          <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-bold text-slate-800">{products.data.length}</span> dari <span className="font-bold text-slate-800">{products.total_count}</span> produk
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(products.prev_page)}
                disabled={products.is_first_page}
                className={`px-4 py-2 rounded-lg border font-bold text-xs transition-all ${
                  products.is_first_page ? 'text-slate-300 border-slate-100' : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                }`}
              >
                SEBELUMNYA
              </button>
              
              <div className="flex items-center px-4 text-sm font-bold text-slate-600">
                Halaman {products.current_page} dari {products.total_pages}
              </div>

              <button
                onClick={() => handlePageChange(products.next_page)}
                disabled={products.is_last_page}
                className={`px-4 py-2 rounded-lg border font-bold text-xs transition-all ${
                  products.is_last_page ? 'text-slate-300 border-slate-100' : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                }`}
              >
                SELANJUTNYA
              </button>
            </div>
          </div>
          </Navbar>
        </div>
    </div>
  );
}