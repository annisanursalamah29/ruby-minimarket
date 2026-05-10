import React, { useRef, useState } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Navbar from "../../Layouts/Navbar";

export default function Suppliers() {
  const phoneInputRef = useRef(null);
  
  // Data 'suppliers' otomatis ter-update oleh Inertia saat ada perubahan di server
  const { suppliers } = usePage().props;
  
  const [editingId, setEditingId] = useState(null);

  // Menggunakan helper useForm dari Inertia
  const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    contact_person: "",
    terms: ""
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Penanganan duplikat tetap di sisi client sebelum dikirim
    const isDuplicatePhone = suppliers.some(
      (s) => 
        s.phone && 
        data.phone && 
        s.phone.replace(/\D/g, "") === data.phone.replace(/\D/g, "") && 
        s.id !== editingId
    );

    if (isDuplicatePhone) {
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
        phoneInputRef.current.select();
      }
      Toast.fire({
        icon: "error",
        title: "Nomor telepon sudah terdaftar!"
      });
      return;
    }

    if (editingId) {
      // Update data via Inertia
      put(`/supplier/${editingId}`, {
        onSuccess: () => {
          Toast.fire({ icon: "success", title: "Berhasil diperbarui" });
          resetForm();
        },
        onError: () => {
          Toast.fire({ icon: "error", title: "Gagal memperbarui data" });
        }
      });
    } else {
      // Simpan data baru via Inertia
      post('/supplier', {
        onSuccess: () => {
          Toast.fire({ icon: "success", title: "Berhasil ditambah" });
          resetForm();
        },
        onError: () => {
          Toast.fire({ icon: "error", title: "Gagal menyimpan data" });
        }
      });
    }
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier.id);
    // Mengisi data form menggunakan setData
    setData({
      name: supplier.name,
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      contact_person: supplier.contact_person || "",
      terms: supplier.terms || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (editingId === id) return;

    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data supplier akan dihapus permanen",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      // Menggunakan router.delete untuk aksi penghapusan
      router.delete(`/supplier/${id}`, {
        onSuccess: () => {
          Toast.fire({ icon: "success", title: "Supplier berhasil dihapus" });
        },
        onError: () => {
          Toast.fire({ icon: "error", title: "Gagal menghapus data" });
        }
      });
    }
  };

  const resetForm = () => {
    reset(); // Menghapus isi form ke nilai awal
    setEditingId(null);
    clearErrors();
  };

  return (
    <Navbar>
      <div className="max-w-7xl mx-auto px-4 py-6 bg-slate-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manajemen Supplier</h1>
          <p className="text-slate-600">Kelola data supplier dan informasi kontak</p>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {editingId ? 'Edit Supplier' : 'Tambah Supplier Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Supplier</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className={`mt-1 w-full border rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className={`mt-1 w-full border rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="email@supplier.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telepon</label>
              <input
                ref={phoneInputRef}
                type="text"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="081xxxxxxx"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact Person</label>
              <input
                type="text"
                value={data.contact_person}
                onChange={(e) => setData("contact_person", e.target.value)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Alamat</label>
              <textarea
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Syarat Pembayaran</label>
              <textarea
                value={data.terms}
                onChange={(e) => setData("terms", e.target.value)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Contoh: Pembayaran 30 hari setelah invoice"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={processing}
                className={`flex-1 py-2.5 rounded-lg text-white font-bold shadow-md transition-all active:scale-95 ${
                  editingId ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"
                } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {processing ? 'Memproses...' : (editingId ? "Update Supplier" : "Simpan Supplier")}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Daftar Supplier</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Nama Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Kontak & Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Contact Person</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Syarat Pembayaran</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{supplier.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        {supplier.email && <div className="text-sm text-blue-600">{supplier.email}</div>}
                        {supplier.phone && <div className="text-sm text-slate-500">{supplier.phone}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {supplier.contact_person || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 max-w-xs truncate" title={supplier.address}>
                          {supplier.address || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-orange-600 italic font-medium">
                          {supplier.terms || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(supplier)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(supplier.id)}
                            disabled={editingId === supplier.id}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              editingId === supplier.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <span className="text-lg">Belum ada data supplier</span>
                        <p className="text-sm">Silakan tambah supplier melalui form di atas.</p>
                      </div>
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