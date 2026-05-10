import React from 'react';
import { Link, router } from '@inertiajs/react';
import { formatIDR, formatDate } from './format';
import Swal from 'sweetalert2';

export default function HistoryTable({ sales, filters }) {
  const { data, current_page, total_pages, prev_page, next_page, is_first_page, is_last_page, total_count } = sales;

  const handlePageChange = (page) => {
    if (!page) return;
    router.get("/riwayat", { ...filters, page }, { preserveState: true, preserveScroll: true });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Transaksi?',
      text: "Data stok tidak akan dikembalikan secara otomatis!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // warna merah tailwind (red-500)
      cancelButtonColor: '#64748b',  // warna slate tailwind (slate-500)
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true // Menaruh tombol 'Batal' di kiri
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/riwayat/${id}`, {
          onSuccess: () => {
            Swal.fire({
              title: 'Terhapus!',
              text: 'Transaksi berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date & Time</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Items</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Total Price</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? data.map((sale) => {
              const { date, time } = formatDate(sale.created_at);
              return (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-slate-600 font-mono">
                    {date} <span className="text-slate-400 ml-2">{time}</span>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {sale.sale_items?.length || 0} Products
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-900">{formatIDR(sale.total_price)}</td>
                  <td className="p-4 text-right flex justify-end gap-3">
                    <Link href={`/riwayat/${sale.id}`} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-xs font-bold">
                      DETAILS
                    </Link>
                    <button onClick={() => handleDelete(sale.id)} className="px-3 py-1 bg-red-50 text-red-500 rounded-md hover:bg-red-100 text-xs font-bold">
                      DELETE
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan="4" className="p-12 text-center text-slate-400 italic">No data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Showing <span className="font-bold text-slate-800">{data.length}</span> of <span className="font-bold text-slate-800">{total_count}</span>
        </div>
        <div className="flex gap-2">
          <PaginationButton onClick={() => handlePageChange(prev_page)} disabled={is_first_page}>PREVIOUS</PaginationButton>
          <div className="flex items-center px-4 text-sm font-bold text-slate-600">Page {current_page} of {total_pages}</div>
          <PaginationButton onClick={() => handlePageChange(next_page)} disabled={is_last_page}>NEXT</PaginationButton>
        </div>
      </div>
    </div>
  );
}

// Small internal helper for cleaner buttons
const PaginationButton = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg border font-bold text-xs transition-all ${
      disabled ? "text-slate-300 border-slate-100" : "text-blue-600 border-blue-200 hover:bg-blue-50"
    }`}
  >
    {children}
  </button>
);