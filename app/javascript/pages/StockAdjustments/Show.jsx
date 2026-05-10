import React from "react";
import { router } from "@inertiajs/react";
import Navbar from "../../Layouts/Navbar";

export default function Show({ adjustment }) {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Penyesuaian Stok #{adjustment.id}
            </h1>
            <p className="text-slate-600">Detail penyesuaian stok</p>
          </div>
          <button
            onClick={() => router.visit('/penyesuaian-stok')}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            ← Kembali
          </button>
        </div>

        {/* Adjustment Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Informasi Penyesuaian</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-600">Tanggal:</span>
                  <div className="font-medium">
                    {new Date(adjustment.created_at).toLocaleDateString('id-ID')} {new Date(adjustment.created_at).toLocaleTimeString('id-ID')}
                  </div>
                </div>
                <div>
                  <span className="text-slate-600">Tipe Penyesuaian:</span>
                  <div className="mt-1">{getAdjustmentTypeBadge(adjustment.adjustment_type)}</div>
                </div>
                <div>
                  <span className="text-slate-600">Jumlah:</span>
                  <div className="font-medium text-lg">
                    {adjustment.adjustment_type === 'removal' ? '-' : '+'}{Math.abs(adjustment.quantity)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-600">Alasan:</span>
                  <div className="font-medium">{adjustment.reason}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-md font-semibold text-slate-800 mb-4">Informasi Produk</h4>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="font-medium text-slate-900">{adjustment.product?.name}</div>
                <div className="text-sm text-slate-600">Barcode: {adjustment.product?.barcode}</div>
                {adjustment.warehouse && (
                  <div className="text-sm text-slate-600 mt-1">Gudang: {adjustment.warehouse.name}</div>
                )}
              </div>
            </div>

            {adjustment.note && (
              <div className="border-t border-slate-200 pt-6">
                <span className="text-slate-600">Catatan:</span>
                <p className="mt-2 text-slate-800 bg-slate-50 p-3 rounded-lg">{adjustment.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}