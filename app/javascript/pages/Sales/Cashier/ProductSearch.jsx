import React from 'react';

export default function ProductSearch({ searchTerm, setSearchTerm, searchResults, selectProduct, searchRef }) {
  return (
    <div className="relative">
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50 shadow-xl">
        <label className="block text-blue-400 text-[10px] font-black uppercase mb-2 tracking-[0.2em]">
          Search Product
        </label>
        <input
          ref={searchRef}
          autoFocus
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-6 py-4 text-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Scan Barcode or Type Product Name..."
        />
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl z-40 max-h-60 overflow-y-auto">
          {searchResults.map((p) => (
            <div
              key={p.id}
              onClick={() => selectProduct(p)}
              className="p-4 hover:bg-blue-600 cursor-pointer border-b border-slate-700 last:border-0 flex justify-between items-center group transition-colors"
            >
              <div>
                <div className="font-bold text-white">{p.name}</div>
                <div className="text-xs text-slate-500 group-hover:text-blue-100">{p.barcode}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-400 group-hover:text-white">Rp {p.price.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 group-hover:text-blue-100 font-bold uppercase">Stock: {p.stock}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}