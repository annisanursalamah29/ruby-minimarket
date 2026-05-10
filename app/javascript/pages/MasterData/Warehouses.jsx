import React, { useState, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Navbar from "../../Layouts/Navbar";

export default function Warehouses() {
  const { warehouses } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(""); 
  const [values, setValues] = useState({
    name: "",
    location: "",
    description: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ref untuk fokus otomatis ke input nama saat edit
  const nameInputRef = useRef(null);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });

  // --- LOGIKA FILTER & URUTKAN (A-Z) ---
  const filteredAndSortedWarehouses = (warehouses || [])
    .filter((wh) => 
      wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (wh.location && wh.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const url = editingId ? `/gudang/${editingId}` : '/gudang';
    const method = editingId ? 'put' : 'post';

    router[method](url, { warehouse: values }, {
      onSuccess: () => {
        Toast.fire({
          icon: "success",
          title: editingId ? "Gudang berhasil diperbarui" : "Gudang berhasil ditambahkan"
        });
        resetForm();
      },
      onError: (errors) => {
        const errorMessages = Object.values(errors).join(', ');
        Toast.fire({
          icon: "error",
          title: errorMessages || "Terjadi kesalahan validasi"
        });
      },
      onFinish: () => setLoading(false),
    });
  };

  const handleEdit = (warehouse) => {
    setValues({
      name: warehouse.name,
      location: warehouse.location || "",
      description: warehouse.description || ""
    });
    setEditingId(warehouse.id);
    
    // Smooth scroll ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Fokus otomatis ke input nama
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const handleDelete = async (id) => {
    // Mencegah hapus data yang sedang diedit
    if (editingId === id) return;

    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data gudang akan dihapus permanen",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      router.delete(`/gudang/${id}`, {
        onSuccess: () => {
          Toast.fire({
            icon: "success",
            title: "Gudang berhasil dihapus"
          });
        },
        onError: () => {
          Toast.fire({ icon: "error", title: "Gagal menghapus data" });
        }
      });
    }
  };

  const resetForm = () => {
    setValues({ name: "", location: "", description: "" });
    setEditingId(null);
  };

  return (
    <Navbar>
      <div className="max-w-7xl mx-auto px-4 py-6 bg-slate-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manajemen Gudang</h1>
          <p className="text-slate-600 italic">Kelola lokasi gudang dan informasi penyimpanan minimarket</p>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {editingId ? '📝 Edit Gudang' : '➕ Tambah Gudang Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Gudang</label>
              <input
                ref={nameInputRef}
                type="text"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Lokasi / Area</label>
              <input
                type="text"
                value={values.location}
                onChange={(e) => setValues({ ...values, location: e.target.value })}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Lantai 1, Blok A"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Deskripsi</label>
              <textarea
                value={values.description}
                onChange={(e) => setValues({ ...values, description: e.target.value })}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Kapasitas atau catatan khusus gudang..."
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-xl text-white font-bold shadow-md transition-all active:scale-95 ${
                  editingId ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? '...' : (editingId ? "Update Data" : "Simpan Gudang")}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 font-semibold"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-slate-800">Daftar Gudang</h2>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-10 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Nama Gudang</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAndSortedWarehouses.map((warehouse) => (
                  <tr key={warehouse.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{warehouse.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{warehouse.location || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500 truncate max-w-[250px]">
                        {warehouse.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(warehouse)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(warehouse.id)}
                          disabled={editingId === warehouse.id}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            editingId === warehouse.id
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAndSortedWarehouses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">
                      {searchTerm ? `Hasil "${searchTerm}" tidak ditemukan` : "Belum ada data gudang"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Navbar>
  );
}