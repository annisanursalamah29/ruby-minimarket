import React, { useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import Navbar from "../../Layouts/Navbar";
import Pagination from "../../Layouts/Pagination";

export default function Categories() {
  const { categories } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(""); 
  const [editingId, setEditingId] = useState(null);

  const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
    name: "",
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });

  const filteredAndSortedCategories = (categories || [])
    .filter((cat) => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi duplikat sederhana di sisi client (Opsional tapi bagus untuk UX)
    const isDuplicate = categories.some(
      (cat) => 
        cat.name.toLowerCase() === data.name.trim().toLowerCase() && 
        cat.id !== editingId
    );

    if (isDuplicate) {
      Toast.fire({
        icon: "warning",
        title: "Nama kategori sudah ada!"
      });
      return;
    }

    const options = {
      onSuccess: () => {
        Toast.fire({ icon: "success", title: editingId ? "Kategori diperbarui" : "Kategori ditambahkan" });
        resetForm();
      },
      // onError akan otomatis dipanggil jika Rails mengirim error validasi
      onError: () => {
        Toast.fire({ icon: "error", title: "Gagal menyimpan data" });
      }
    };

    if (editingId) {
      patch(`/kategori/${editingId}`, options);
    } else {
      post('/kategori', options);
    }
  };

  const handleEdit = (category) => {
    reset(); 
    setData("name", category.name);
    setEditingId(category.id);
  };

  const handleDelete = async (id) => {
    if (editingId === id) return;

    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data kategori akan dihapus permanen",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      // URL /kategori sesuai routes.rb
      destroy(`/kategori/${id}`, {
        onSuccess: () => Toast.fire({ icon: "success", title: "Kategori berhasil dihapus" }),
        onError: () => Toast.fire({ icon: "error", title: "Gagal menghapus data" })
      });
    }
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
  };

  return (
    <Navbar>
      <div className="max-w-4xl mx-auto px-4 py-6 bg-slate-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manajemen Kategori</h1>
          <p className="text-slate-600">Sistem pengelolaan kategori produk</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Kategori</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className={`mt-1 w-full border rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="Contoh: Pakaian, Makanan..."
                required
              />
              {/* Menampilkan pesan error duplikat tepat di bawah input */}
              {errors.name && <p className="text-red-500 text-xs mt-1 font-medium italic">{errors.name}</p>}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={processing}
                className={`px-6 py-2.5 rounded-lg text-white font-bold shadow-md transition-all active:scale-95 ${
                  editingId ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"
                } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {processing ? '...' : (editingId ? "Update" : "Simpan")}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Daftar Kategori</h2>
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Nama Kategori</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAndSortedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={editingId === category.id}
                        className={`px-3 py-1 rounded-md text-sm ${
                          editingId === category.id ? 'bg-gray-100 text-gray-400' : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
            meta={categories} // Mengirim objek pagination lengkap
            label="categories"  // Label kustom untuk teks ringkasan
            onPageChange={(page) =>
              router.get(
                "/kategori",
                { ...filters, page },
                { preserveState: true, preserveScroll: true }
              )
            }
          />
          </div>
        </div>
      </div>
    </Navbar>
  );
}