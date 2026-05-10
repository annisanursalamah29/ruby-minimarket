import React from "react";
import { router, Link } from "@inertiajs/react"; // Tambahkan Link untuk navigasi yang lebih mulus
import Navbar from "../../Layouts/Navbar";

export default function Show({ purchase }) {
  // Guard clause jika data belum dimuat
  if (!purchase) return null;

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
      {/* Container disamakan persis dengan Index.jsx: max-w-7xl dan bg-slate-50 */}
      <div className="max-w-7xl mx-auto px-4 py-6 bg-slate-50">
        
        {/* Header Section disamakan posisinya dengan Index */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Detail Purchase Order
            </h1>
            <p className="text-slate-600">
              No. Dokumen: <span className="font-bold text-slate-800">{purchase.document_number}</span>
            </p>
          </div>
          <Link
            href="/pembelian"
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
          >
            ← Kembali ke Daftar
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Informasi Utama */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-bold text-slate-700">Daftar Barang</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="px-6 py-4">Produk</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Harga Satuan</th>
                      <th className="px-6 py-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchase.purchase_items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-700">{item.product?.name}</div>
                          <div className="text-xs text-slate-400">{item.product?.barcode}</div>
                        </td>
                        <td className="px-6 py-4 text-center">{item.quantity}</td>
                        <td className="px-6 py-4 text-right">Rp {parseFloat(item.price).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-semibold">
                          Rp {(item.quantity * item.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-blue-50/50">
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-right font-bold text-blue-900">Total Keseluruhan</td>
                      <td className="px-6 py-4 text-right font-black text-blue-700 text-lg">
                        Rp {parseFloat(purchase.total_price).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {purchase.notes && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Catatan</h3>
                <p className="text-slate-700">{purchase.notes}</p>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Sidebar Informasi */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">Status & Tanggal</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Status Pesanan</label>
                  <div className="mt-1">{getStatusBadge(purchase.status)}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Tanggal Order</label>
                  <div className="text-sm font-semibold text-slate-700">
                    {new Date(purchase.order_date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">Supplier & Gudang</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Supplier</label>
                  <div className="text-sm font-bold text-blue-600">{purchase.supplier?.name}</div>
                  <div className="text-xs text-slate-500">{purchase.supplier?.email || 'No Email'}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Lokasi Penerimaan</label>
                  <div className="text-sm font-semibold text-slate-700">{purchase.warehouse?.name}</div>
                  <div className="text-xs text-slate-500">{purchase.warehouse?.location}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}