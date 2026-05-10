import React from "react";

export default function Pagination({ meta, onPageChange, label = "data" }) {
  // Sembunyikan jika tidak ada data atau hanya 1 halaman
  if (!meta || meta.total_pages <= 1) return null;

  return (
    <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
      <div className="text-sm text-slate-500">
        Showing <span className="font-bold text-slate-800">{meta.data?.length || 0}</span> of{" "}
        <span className="font-bold text-slate-800">{meta.total_count}</span> {label}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(meta.prev_page)}
          disabled={meta.is_first_page}
          className={`px-4 py-2 rounded-lg border font-bold text-xs ${
            meta.is_first_page ? "text-slate-300 border-slate-100" : "text-blue-600 border-blue-200 hover:bg-blue-50"
          }`}
        >PREVIOUS</button>
        <div className="flex items-center px-4 text-sm font-bold text-slate-600">
          Page {meta.current_page} of {meta.total_pages}
        </div>
        <button
          onClick={() => onPageChange(meta.next_page)}
          disabled={meta.is_last_page}
          className={`px-4 py-2 rounded-lg border font-bold text-xs ${
            meta.is_last_page ? "text-slate-300 border-slate-100" : "text-blue-600 border-blue-200 hover:bg-blue-50"
          }`}
        >NEXT</button>
      </div>
    </div>
  );
}