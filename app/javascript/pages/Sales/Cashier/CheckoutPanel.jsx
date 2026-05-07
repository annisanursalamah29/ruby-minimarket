import React from 'react';

export default function CheckoutPanel({ totalPrice, cashReceived, setCashReceived, checkout }) {
  const numericCashReceived = Number(cashReceived) || 0;
  const change = numericCashReceived - totalPrice;

  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50 shadow-xl">
      <div className="mb-6 p-6 bg-slate-900/80 rounded-2xl border border-blue-500/30 ring-1 ring-blue-500/20">
        <span className="text-[10px] text-blue-400 block mb-2 uppercase font-black tracking-widest">Total Amount</span>
        <div className="text-5xl font-black text-white tracking-tighter leading-none">
          <span className="text-lg mr-2 text-slate-600 font-medium italic">Rp</span>
          {totalPrice.toLocaleString()}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Cash Received</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">Rp</span>
            <input
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-2xl font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 mb-4">
          <span className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Change</span>
          <div className={`text-3xl font-mono font-black ${change < 0 ? "text-red-900" : "text-emerald-500"}`}>
            Rp {change > 0 ? change.toLocaleString() : 0}
          </div>
        </div>
      </div>

      <button
        onClick={checkout}
        disabled={totalPrice === 0 || numericCashReceived < totalPrice}
        className={`w-full py-5 rounded-2xl font-black text-xl mt-2 transition-all active:scale-[0.98] uppercase tracking-[0.2em] shadow-2xl ${
          totalPrice > 0 && numericCashReceived >= totalPrice
            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
            : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700 opacity-60"
        }`}
      >
        SAVE & PRINT
      </button>
    </div>
  );
}