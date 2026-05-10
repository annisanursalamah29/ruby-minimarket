import React from 'react';

export default function CartTable({ cart, removeFromCart }) {
  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 grow flex flex-col overflow-hidden shadow-xl">
      <div className="grid grid-cols-12 p-4 border-b border-slate-700 bg-slate-800/50 text-[10px] font-black text-slate-500 tracking-widest uppercase">
        <div className="col-span-5">Product</div>
        <div className="col-span-2 text-right">Unit Price</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-2 text-right">Total</div>
        <div className="col-span-1"></div>
      </div>
      <div className="h-105 overflow-y-auto custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 italic text-sm">Shopping Cart is Empty</div>
        ) : (
          cart.map((item, index) => (
            <div key={item.product_id} className="grid grid-cols-12 items-center p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-all">
              <div className="col-span-5 flex gap-3 items-center">
                <span className="text-slate-600 font-mono text-[10px]">{index + 1}</span>
                <div className="font-bold text-white truncate">{item.name}</div>
              </div>
              <div className="col-span-2 text-right text-slate-400 font-medium">Rp {item.price.toLocaleString()}</div>
              <div className="col-span-2 flex justify-center">
                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20 font-bold font-mono">
                  {item.quantity}
                </span>
              </div>
              <div className="col-span-2 text-right font-black text-white">Rp {(item.price * item.quantity).toLocaleString()}</div>
              <div className="col-span-1 text-right">
                <button onClick={() => removeFromCart(item.product_id)} className="text-slate-700 hover:text-red-500 p-1 text-lg">✕</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}