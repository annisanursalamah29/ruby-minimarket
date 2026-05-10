import React from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Navbar from "../../Layouts/Navbar";

export default function StockAdjustments() {
  // Ambil data langsung dari props yang dikirim Rails
  const { adjustments, products, warehouses, flash } = usePage().props;

  // Gunakan useForm Inertia untuk handling form yang lebih clean
  const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
    product_id: "",
    warehouse_id: "",
    adjustment_type: "addition",
    quantity: 0,
    reason: "",
    note: ""
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    post('/penyesuaian-stok', {
      onSuccess: () => {
        Toast.fire({
          icon: "success",
          title: "Penyesuaian stok berhasil dibuat"
        });
        reset(); // Reset form otomatis
      },
      onError: (err) => {
        const firstError = Object.values(err)[0];
        Toast.fire({
          icon: "error",
          title: firstError || "Terjadi kesalahan"
        });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data penyesuaian stok akan dihapus permanen",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/penyesuaian-stok/${id}`, {
          onSuccess: () => {
            Toast.fire({
              icon: "success",
              title: "Penyesuaian stok berhasil dihapus"
            });
          }
        });
      }
    });
  };

  const getAdjustmentTypeBadge = (type) => {
    const typeConfig = {
      addition: { color: 'bg-green-100 text-green-800', label: 'Penambahan', icon: '+' },
      removal: { color: 'bg-red-100 text-red-800', label: 'Pengurangan', icon: '-' },
      correction: { color: 'bg-blue-100 text-blue-800', label: 'Koreksi', icon: '±' }
    };
    const config = typeConfig[type] || typeConfig.addition;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const selectedProduct = products.find(p => p.id === parseInt(data.product_id));

  return (
    <Navbar>
      <div className="max-w-7xl mx-auto px-4 py-6 bg-slate-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Penyesuaian Stok</h1>
          <p className="text-slate-600">Kelola penyesuaian stok barang untuk koreksi inventaris</p>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Buat Penyesuaian Stok</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Produk</label>
              <select
                value={data.product_id}
                onChange={(e) => setData('product_id', e.target.value)}
                className={`mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors.product_id ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Pilih Produk</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stok: {product.stock})
                  </option>
                ))}
              </select>
              {errors.product_id && <div className="text-red-500 text-xs mt-1">{errors.product_id}</div>}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gudang</label>
              <select
                value={data.warehouse_id}
                onChange={(e) => setData('warehouse_id', e.target.value)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Gudang (Opsional)</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tipe Penyesuaian</label>
              <select
                value={data.adjustment_type}
                onChange={(e) => setData('adjustment_type', e.target.value)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="addition">Penambahan (+)</option>
                <option value="removal">Pengurangan (-)</option>
                <option value="correction">Koreksi (±)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Jumlah</label>
              <input
                type="number"
                value={data.quantity}
                onChange={(e) => setData('quantity', parseInt(e.target.value) || 0)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
              {selectedProduct && (
                <div className="mt-1 text-xs text-slate-500">
                  Stok saat ini: {selectedProduct.stock} → 
                  {data.adjustment_type === 'removal' 
                    ? selectedProduct.stock - data.quantity 
                    : selectedProduct.stock + data.quantity
                  }
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Alasan</label>
              <select
                value={data.reason}
                onChange={(e) => setData('reason', e.target.value)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Alasan</option>
                <option value="stock_opname">Stock Opname</option>
                <option value="damaged">Rusak</option>
                <option value="expired">Kadaluarsa</option>
                <option value="theft">Pencurian</option>
                <option value="correction">Koreksi Data</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Catatan</label>
              <textarea
                value={data.note}
                onChange={(e) => setData('note', e.target.value)}
                className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Catatan tambahan untuk penyesuaian stok"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={processing}
                className={`flex-1 py-2.5 rounded-lg text-white font-bold shadow-md transition-all active:scale-95 bg-blue-600 hover:bg-blue-700 ${
                  processing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {processing ? 'Menyimpan...' : 'Buat Penyesuaian'}
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Riwayat Penyesuaian Stok</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Produk</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tipe</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Alasan</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {adjustments.map((adjustment) => (
                  <tr key={adjustment.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {new Date(adjustment.created_at).toLocaleDateString('id-ID')}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(adjustment.created_at).toLocaleTimeString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{adjustment.product?.name}</div>
                      {adjustment.warehouse && (
                        <div className="text-xs text-slate-500">{adjustment.warehouse.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getAdjustmentTypeBadge(adjustment.adjustment_type)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {adjustment.adjustment_type === 'removal' ? '-' : '+'}{Math.abs(adjustment.quantity)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 text-capitalize">
                        {adjustment.reason.replace('_', ' ')}
                      </div>
                      {adjustment.note && (
                        <div className="text-xs text-slate-500 max-w-xs truncate">{adjustment.note}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(adjustment.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {adjustments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      Belum ada data penyesuaian stok
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