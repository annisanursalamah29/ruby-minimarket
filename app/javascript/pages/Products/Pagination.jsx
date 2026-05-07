import React from "react";

export default function Pagination({ products, onPageChange }) {
  return (
    <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
      <div className="text-sm text-slate-500">
        Showing <span className="font-bold text-slate-800">{products.data.length}</span> of{" "}
        <span className="font-bold text-slate-800">{products.total_count}</span> products
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(products.prev_page)}
          disabled={products.is_first_page}
          className={`px-4 py-2 rounded-lg border font-bold text-xs ${
            products.is_first_page ? "text-slate-300 border-slate-100" : "text-blue-600 border-blue-200 hover:bg-blue-50"
          }`}
        >PREVIOUS</button>
        <div className="flex items-center px-4 text-sm font-bold text-slate-600">
          Page {products.current_page} of {products.total_pages}
        </div>
        <button
          onClick={() => onPageChange(products.next_page)}
          disabled={products.is_last_page}
          className={`px-4 py-2 rounded-lg border font-bold text-xs ${
            products.is_last_page ? "text-slate-300 border-slate-100" : "text-blue-600 border-blue-200 hover:bg-blue-50"
          }`}
        >NEXT</button>
      </div>
    </div>
  );
}