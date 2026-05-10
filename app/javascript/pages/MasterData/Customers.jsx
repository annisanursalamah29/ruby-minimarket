import React, { useState, useRef } from "react";
import { usePage, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import Navbar from "../../Layouts/Navbar";

export default function Customers() {
  const { customers } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(""); 
  const [editingId, setEditingId] = useState(null);

  const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    membership_number: ""
  });

  const membershipInputRef = useRef(null);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });

  const filteredAndSortedCustomers = customers
    .filter((cust) => 
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cust.phone && cust.phone.includes(searchTerm)) ||
      (cust.membership_number && cust.membership_number.includes(searchTerm))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSubmit = (e) => {
    e.preventDefault();

    const options = {
      onSuccess: () => {
        Toast.fire({ icon: "success", title: editingId ? "Data diperbarui" : "Data disimpan" });
        resetForm();
      },
      onError: (err) => {
        if (err.membership_number) {
          Toast.fire({ icon: "error", title: "Gagal: Nomor member sudah ada!" });
          membershipInputRef.current?.focus();
        }
      }
    };

    if (editingId) {
      patch(`/pelanggan/${editingId}`, options);
    } else {
      post('/pelanggan', options);
    }
  };

  const handleEdit = (customer) => {
    clearErrors();
    setData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      membership_number: customer.membership_number || ""
    });
    setEditingId(customer.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => membershipInputRef.current?.focus(), 100);
  };

  const handleDelete = async (id) => {
    if (editingId === id) return;

    const result = await Swal.fire({
      title: 'Hapus data pelanggan?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      destroy(`/pelanggan/${id}`, {
        onSuccess: () => Toast.fire({ icon: "success", title: "Berhasil dihapus" })
      });
    }
  };

  const resetForm = () => {
    reset();
    clearErrors();
    setEditingId(null);
  };

  return (
    <Navbar>
      <div className="max-w-7xl mx-auto px-4 py-6 bg-slate-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manajemen Pelanggan</h1>
          <p className="text-slate-600 italic">Kelola database pelanggan minimarket</p>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {editingId ? '📝 Edit Pelanggan' : '➕ Tambah Pelanggan Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Nama */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Pelanggan</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className={`mt-1 w-full border rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Input Telepon */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telepon</label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="081xxxxxxx"
              />
            </div>

            {/* Input Email */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className={`mt-1 w-full border rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="email@contoh.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Input Membership */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">No. Membership</label>
              <input
                ref={membershipInputRef}
                type="text"
                value={data.membership_number}
                onChange={(e) => setData("membership_number", e.target.value)}
                className={`mt-1 w-full border rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors.membership_number ? 'border-red-500 ring-1 ring-red-200' : 'border-slate-200'}`}
                placeholder="Contoh: MEM-001"
              />
              {errors.membership_number && (
                <p className="text-red-600 text-xs font-bold mt-1">⚠️ {errors.membership_number}</p>
              )}
            </div>

            {/* Input Alamat */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Alamat</label>
              <textarea
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={processing}
                className={`flex-1 py-3 rounded-xl text-white font-bold shadow-md transition-all active:scale-95 ${
                  editingId ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"
                } ${processing ? 'opacity-50' : ''}`}
              >
                {processing ? 'Memproses...' : (editingId ? "Update Data" : "Simpan Pelanggan")}
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

        {/* Tabel (Daftar Pelanggan) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Daftar Pelanggan</h2>
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Nama / Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Kontak</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Membership</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAndSortedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{customer.name}</div>
                      <div className="text-xs text-slate-400">{customer.address || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{customer.phone || '-'}</div>
                      <div className="text-xs text-slate-500">{customer.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">
                        {customer.membership_number || 'Non-Member'}
                      </span>
                    </td>
                    {/* Temukan bagian mapping tabel dan ubah tombol Hapus menjadi seperti ini */}
<td className="px-6 py-4 flex gap-2">
  <button 
    onClick={() => handleEdit(customer)} 
    className="text-blue-600 hover:underline text-sm font-bold"
  >
    Edit
  </button>
  
  <button 
    onClick={() => handleDelete(customer.id)} 
    disabled={editingId === customer.id} // Tombol mati jika ID sama dengan yang sedang diedit
    className={`text-sm font-bold ${
      editingId === customer.id 
        ? "text-slate-300 cursor-not-allowed" // Style saat disabled
        : "text-red-600 hover:underline"     // Style normal
    }`}
  >
    Hapus
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Navbar>
  );
}