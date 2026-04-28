import React, { useState, useEffect, useRef } from 'react'
import { router } from '@inertiajs/react'
import Navbar from '../../Layouts/Navbar'

export default function Cashier({ products }) {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cashReceived, setCashReceived] = useState("");

  const [pendingProduct, setPendingProduct] = useState(null);
  const [quantityInput, setQuantityInput] = useState(1);

  // State for receipt
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const searchRef = useRef(null);
  const qtyRef = useRef(null);

  // 1. Product Search
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = products.filter(
        (p) =>
          p.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  // 2. Select Product
  const selectProduct = (product) => {
    if (product.stock <= 0) return alert("Out of Stock!");
    setPendingProduct(product);
    setQuantityInput(1);
    setSearchTerm("");
    setSearchResults([]);
    setTimeout(() => qtyRef.current?.focus(), 50);
  };

  // 3. Add to Cart
  const addToCart = (e) => {
    e.preventDefault();
    const qty = parseInt(quantityInput);
    if (isNaN(qty) || qty <= 0) return alert("Invalid quantity!");
    if (qty > pendingProduct.stock) return alert("Insufficient stock!");

    const existing = cart.find((item) => item.product_id === pendingProduct.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product_id === pendingProduct.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        { ...pendingProduct, product_id: pendingProduct.id, quantity: qty },
      ]);
    }

    setPendingProduct(null);
    setQuantityInput(1);
    searchRef.current.focus();
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.product_id !== id));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const numericCashReceived = Number(cashReceived) || 0;
  const change = numericCashReceived - totalPrice;

  // 4. Print & Reset Functions
  const handlePrint = () => {
    window.print();
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setLastTransaction(null);
    setCashReceived("");
    searchRef.current?.focus();
  };

  const checkout = () => {
    if (cart.length === 0) return alert("Cart is empty!");

    // Save data for receipt before resetting cart
    const transactionData = {
      items: [...cart],
      total: totalPrice,
      cash: numericCashReceived,
      change: change,
      date: new Date().toLocaleString("en-US"), // Changed locale to en-US
    };

    router.post(
      "/sales",
      { total_price: totalPrice, items: cart },
      {
        onSuccess: () => {
          setLastTransaction(transactionData);
          setShowReceipt(true);
          setCart([]);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
      <Navbar>
        {/* PRINT SPECIFIC CSS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
        @media print {
          .no-print { display: none !important; }

          body * { visibility: hidden; }

          #receipt-print, #receipt-print * { 
            visibility: visible;
          }

          #receipt-print {
            position: absolute;
            width: 100%;
            left: 0;
            top: 0;
        }
      `,
          }}
        />

        {/* RECEIPT MODAL */}
        {showReceipt && lastTransaction && (
          <div
            id="receipt-print"
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <div className="bg-white text-slate-900 w-full max-w-sm p-6 rounded-lg shadow-2xl overflow-hidden">
              <div className="font-mono text-sm">
                <div className="text-center mb-4 border-b border-dashed border-slate-300 pb-2">
                  <h2 className="font-bold text-lg uppercase">AFUN STORE</h2>
                  <p className="text-xs">123 Sample Street Address</p>
                  <p className="text-[10px]">{lastTransaction.date}</p>
                </div>

                <div className="space-y-1 mb-4 border-b border-dashed border-slate-300 pb-2">
                  {lastTransaction.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <div className="flex-1">
                        <div>{item.name}</div>
                        <div className="text-[10px]">
                          {item.quantity} x {item.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        {(item.quantity * item.price).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>TOTAL</span>
                    <span>Rp {lastTransaction.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CASH</span>
                    <span>Rp {lastTransaction.cash.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1">
                    <span>CHANGE</span>
                    <span>Rp {lastTransaction.change.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center mt-6 text-[10px] uppercase">
                  *** Thank You ***
                </div>
              </div>

              <div className="no-print mt-6 flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-blue-600 text-white py-2 rounded font-bold text-sm"
                >
                  PRINT RECEIPT
                </button>
                <button
                  onClick={closeReceipt}
                  className="flex-1 bg-slate-200 text-slate-800 py-2 rounded font-bold text-sm"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QUANTITY MODAL */}
        {pendingProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e293b] border border-blue-500 w-full max-w-md p-8 rounded-2xl shadow-2xl scale-100 animate-in zoom-in duration-150">
              <h3 className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-2">
                Confirm Item
              </h3>
              <h2 className="text-2xl font-bold mb-1 text-white">
                {pendingProduct.name}
              </h2>
              <p className="text-slate-400 text-sm mb-6 font-mono">
                Unit Price: Rp {pendingProduct.price.toLocaleString()}
              </p>

              <form onSubmit={addToCart}>
                <div className="mb-6">
                  <label className="block text-slate-500 text-[10px] uppercase font-bold mb-2 text-center">
                    Quantity
                  </label>
                  <input
                    ref={qtyRef}
                    type="number"
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-blue-600 rounded-xl px-4 py-5 text-4xl font-black text-center text-white outline-none focus:ring-4 focus:ring-blue-500/20"
                  />
                  <div className="text-center mt-4 text-slate-300 text-lg">
                    Subtotal:{" "}
                    <span className="text-emerald-400 font-bold">
                      Rp{" "}
                      {(
                        pendingProduct.price * (parseInt(quantityInput) || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPendingProduct(null)}
                    className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg transition-all uppercase tracking-widest"
                  >
                    OK (Enter)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MAIN VIEW */}
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-6 py-4 text-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-700"
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
                        <div className="text-xs text-slate-500 group-hover:text-blue-100">
                          {p.barcode}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400 group-hover:text-white">
                          Rp {p.price.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500 group-hover:text-blue-100 font-bold uppercase tracking-tighter">
                          Stock: {p.stock}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 flex-grow flex flex-col overflow-hidden shadow-xl">
              <div className="grid grid-cols-12 p-4 border-b border-slate-700 bg-slate-800/50 text-[10px] font-black text-slate-500 tracking-widest uppercase">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>
              <div className="h-[420px] overflow-y-auto custom-scrollbar">
                {cart.length === 0 && (
                  <div className="h-full flex items-center justify-center text-slate-600 italic text-sm">
                    Shopping Cart is Empty
                  </div>
                )}
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 items-center p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-all"
                  >
                    <div className="col-span-5 flex gap-3 items-center">
                      <span className="text-slate-600 font-mono text-[10px]">
                        {index + 1}
                      </span>
                      <div className="font-bold text-white truncate">
                        {item.name}
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-slate-400 font-medium">
                      Rp {item.price.toLocaleString()}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20 font-bold font-mono">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="col-span-2 text-right font-black text-white">
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-slate-700 hover:text-red-500 transition-colors p-1 text-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CHECKOUT */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50 shadow-xl flex flex-col">
              <div>
                <div className="mb-6 p-6 bg-slate-900/80 rounded-2xl border border-blue-500/30 ring-1 ring-blue-500/20">
                  <span className="text-[10px] text-blue-400 block mb-2 uppercase font-black tracking-widest">
                    Total Amount
                  </span>
                  <div className="text-5xl font-black text-white tracking-tighter leading-none">
                    <span className="text-lg mr-2 text-slate-600 font-medium italic">
                      Rp
                    </span>
                    {totalPrice.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest pl-1">
                      Cash Received
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-2xl font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 mb-4">
                    <span className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">
                      Change
                    </span>
                    <div
                      className={`text-3xl font-mono font-black ${change < 0 ? "text-red-900" : "text-emerald-500"}`}
                    >
                      Rp {change > 0 ? change.toLocaleString() : 0}
                    </div>
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
          </div>
        </div>
      </Navbar>
    </div>
  );
}