import React from "react";

// Tambahkan prop editingId di sini
export default function ProductTable({ products, onEdit, onDelete, editingId }) {
  const getCategoryStyle = (id) => {
    const colors = [
      "bg-blue-100 text-blue-700 border-blue-200",
      "bg-purple-100 text-purple-700 border-purple-200",
      "bg-emerald-100 text-emerald-700 border-emerald-200",
      "bg-amber-100 text-amber-700 border-amber-200",
      "bg-pink-100 text-pink-700 border-pink-200",
      "bg-indigo-100 text-indigo-700 border-indigo-200",
      "bg-cyan-100 text-cyan-700 border-cyan-200",
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800 text-white text-xs uppercase tracking-widest">
              <th className="py-4 px-6">Barcode</th>
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6 text-center">Stock</th>
              <th className="py-4 px-6 text-right">Price</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-slate-400">{p.barcode}</td>
                  <td className="py-4 px-6 font-bold text-slate-700">{p.name}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getCategoryStyle(p.category_id)}`}>
                      {p.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {p.stock <= 10 ? (
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-red-100 text-red-600 rounded-lg font-black text-sm border border-red-200 animate-pulse">
                        ⚠️ {p.stock}
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-600">{p.stock}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-slate-800">
                    Rp{Number(p.price).toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => onEdit(p)} 
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase"
                      >
                        Edit
                      </button>
                      
                      {/* LOGIKA PENCEGAHAN: Tombol Delete didisable dan tampilan disesuaikan saat editingId cocok */}
                      <button 
                        onClick={() => onDelete(p.id)} 
                        disabled={editingId === p.id}
                        className={`font-bold text-xs uppercase transition-colors ${
                          editingId === p.id 
                            ? "text-slate-300 cursor-not-allowed" 
                            : "text-red-500 hover:text-red-700"
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center py-20 text-slate-400">No data available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}