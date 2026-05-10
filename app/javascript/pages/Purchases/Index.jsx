import React, { useState, useRef } from "react";
import { usePage, useForm, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import Navbar from "../../Layouts/Navbar";

export default function Purchases() {
  const { purchases, suppliers, warehouses, products } = usePage().props;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // State untuk melacak data yang sedang diedit
  const documentNumberRef = useRef(null);
  const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    supplier_id: "",
    warehouse_id: "",
    order_date: new Date().toISOString().split('T')[0],
    document_number: "",
    notes: "",
    purchase_items_attributes: [] // Pastikan ini sesuai dengan nama yang diizinkan di controller (purchase_items_attributes)
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });

  const addPurchaseItem = () => {
    setData('purchase_items_attributes', [
      ...data.purchase_items_attributes, 
      { product_id: "", quantity: 1, price: 0 }
    ]);
  };

  const updatePurchaseItem = (index, field, value) => {
    const updatedItems = [...data.purchase_items_attributes];
    updatedItems[index][field] = value;
    setData('purchase_items_attributes', updatedItems);
  };

  const removePurchaseItem = (index) => {
    setData('purchase_items_attributes', data.purchase_items_attributes.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return data.purchase_items_attributes.reduce((total, item) => {
      return total + (parseFloat(item.price || 0) * parseInt(item.quantity || 0));
    }, 0);
  };

  // Fungsi Reset Form diselaraskan dengan Customer
  const resetForm = () => {
    reset();
    clearErrors();
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Pastikan data yang dikirim dibungkus dalam objek 'purchase'
    // Dan item menggunakan key 'purchase_items_attributes'
    const payload = {
      purchase: {
        supplier_id: data.supplier_id,
        warehouse_id: data.warehouse_id,
        order_date: data.order_date,
        document_number: data.document_number,
        notes: data.notes,
        // Total price akan dihitung ulang oleh model (callback before_validation)
        // tapi tetap dikirim untuk formalitas param
        purchase_items_attributes: data.purchase_items_attributes 
      }
    };

    const options = {
      // PENTING: Gunakan key 'data' agar Inertia mengirim payload sebagai body request
      data: payload, 
      onSuccess: () => {
        Toast.fire({ icon: "success", title: editingId ? "Pembelian diperbarui" : "Pembelian berhasil dicatat" });
        resetForm();
      },
      onError: (err) => {
        if (err.document_number) {
          Toast.fire({ icon: "error", title: "Nomor dokumen sudah terdaftar!" });
          documentNumberRef.current?.focus();
        }
      }
    };

    if (editingId) {
      // Jika update, Rails butuh id setiap item di dalam purchase_items_attributes 
      // agar tidak membuat item baru melainkan mengupdate yang lama
      patch(`/pembelian/${editingId}`, options);
    } else {
      post('/pembelian', options);
    }
  };


  const handleEdit = (purchase) => {
    clearErrors();
    
    // Ambil data items dari key 'purchase_items' (sesuai include di controller)
    const items = purchase.purchase_items || [];

    setData({
      supplier_id: purchase.supplier_id || "",
      warehouse_id: purchase.warehouse_id || "",
      order_date: purchase.order_date || "",
      document_number: purchase.document_number || "",
      notes: purchase.notes || "",
      // Map ke purchase_items_attributes agar bisa diterima oleh 'permit' di Rails
      purchase_items_attributes: items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }))
    });

    setEditingId(purchase.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => documentNumberRef.current?.focus(), 100);
  };

  // Fungsi Handle Delete (Dengan konfirmasi SweetAlert)
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
        destroy(`/pembelian/${id}`, {
          onSuccess: () => Toast.fire({ icon: "success", title: "Pembelian berhasil dihapus" }),
          onError: () => Toast.fire({ icon: "error", title: "Gagal menghapus data" })
        });
      }
    };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      ordered: { color: 'bg-blue-100 text-blue-800', label: 'Ordered' },
      received: { color: 'bg-green-100 text-green-800', label: 'Received' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  return (
    <Navbar>
      <div className="max-w-7xl mx-auto px-4 py-6 bg-slate-50 min-h-screen">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Manajemen Pembelian</h1>
            <p className="text-slate-600">Kelola purchase order dan penerimaan barang</p>
          </div>
          <button
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${showForm ? 'bg-slate-500' : 'bg-blue-600'}`}
          >
            {showForm ? 'Batal' : '+ Purchase Order Baru'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 transition-all">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              {editingId ? '📝 Edit Purchase Order' : '➕ Tambah Purchase Order Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">No. Dokumen</label>
                  <input
                    ref={documentNumberRef}
                    type="text"
                    value={data.document_number}
                    onChange={(e) => setData('document_number', e.target.value)}
                    className={`mt-1 w-full border rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 ${
                      errors.document_number ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'
                    }`}
                    placeholder="Contoh: PO-2024001"
                  />
                  {errors.document_number && <p className="text-red-500 text-xs mt-1 ml-1">{errors.document_number}</p>}
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Supplier</label>
                  <select
                    value={data.supplier_id}
                    onChange={(e) => setData('supplier_id', e.target.value)}
                    className="mt-1 w-full border-slate-200 border rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Supplier</option>
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gudang Penerimaan</label>
                  <select
                    value={data.warehouse_id}
                    onChange={(e) => setData('warehouse_id', e.target.value)}
                    className="mt-1 w-full border-slate-200 border rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Gudang</option>
                    {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tanggal Order</label>
                  <input
                    type="date"
                    value={data.order_date}
                    onChange={(e) => setData('order_date', e.target.value)}
                    className="mt-1 w-full border-slate-200 border rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-700">Daftar Barang</h3>
                  <button type="button" onClick={addPurchaseItem} className="text-sm bg-green-600 text-white px-3 py-1 rounded shadow-sm hover:bg-green-700">
                    + Tambah Item
                  </button>
                </div>
                {data.purchase_items_attributes.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100 items-end">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400">Produk</label>
                      <select
                        value={item.product_id}
                        onChange={(e) => updatePurchaseItem(index, 'product_id', e.target.value)}
                        className="w-full border-slate-200 border rounded p-2 text-sm"
                        required
                      >
                        <option value="">Pilih Produk</option>
                        {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="text-[10px] font-bold text-slate-400">Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updatePurchaseItem(index, 'quantity', e.target.value)}
                        className="w-full border-slate-200 border rounded p-2 text-sm"
                        min="1"
                      />
                    </div>
                    <div className="w-32">
                      <label className="text-[10px] font-bold text-slate-400">Harga Satuan</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updatePurchaseItem(index, 'price', e.target.value)}
                        className="w-full border-slate-200 border rounded p-2 text-sm"
                      />
                    </div>
                    <button type="button" onClick={() => removePurchaseItem(index)} className="bg-red-50 text-red-500 p-2 rounded hover:bg-red-100">
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center">
                <span className="font-bold text-blue-900">Total Estimasi</span>
                <span className="text-xl font-black text-blue-700">Rp {calculateTotal().toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={processing || data.purchase_items_attributes.length === 0}
                className={`w-full py-3 rounded-xl text-white font-bold shadow-md transition-all active:scale-95 ${
                  editingId ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"
                } ${processing ? 'opacity-50' : ''}`}
              >
                {processing ? 'Menyimpan...' : (editingId ? "Update Purchase Order" : "Simpan Purchase Order")}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-6 py-4 text-center w-16">No</th>
                <th className="px-6 py-4">Dokumen</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.map((purchase, index) => (
                <tr key={purchase.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-center text-slate-400">{index + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{purchase.document_number}</td>
                  <td className="px-6 py-4">{purchase.supplier?.name}</td>
                  <td className="px-6 py-4 font-semibold">Rp {parseFloat(purchase.total_price).toLocaleString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(purchase.status)}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/pembelian/${purchase.id}`} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 font-semibold">
                      Detail
                    </Link>
                    <button 
                      onClick={() => handleEdit(purchase)} 
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(purchase.id)} 
                      disabled={editingId === purchase.id}
                      className={`px-3 py-1 rounded-md text-sm ${
                          editingId === purchase.id ? 'bg-gray-100 text-gray-400' : 'bg-red-100 text-red-700 hover:bg-red-200'
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
    </Navbar>
  );
}