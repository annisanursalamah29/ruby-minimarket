import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import Navbar from '../../../Layouts/Navbar';
import ProductSearch from './ProductSearch';
import CartTable from './CartTable';
import CheckoutPanel from './CheckoutPanel';
import consumer from '../../../channels/consumer'; // Pastikan path ini benar
// Anda juga bisa memisahkan ReceiptModal dan QtyModal jika ingin lebih modular

export default function Cashier({ products: initialProducts }) {
  // Gunakan state lokal untuk produk agar bisa diupdate real-time
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cashReceived, setCashReceived] = useState("");
  const [pendingProduct, setPendingProduct] = useState(null);
  const [quantityInput, setQuantityInput] = useState(1);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const searchRef = useRef(null);
  const qtyRef = useRef(null);

  useEffect(() => {
    // Berlangganan ke InventoryChannel
    const subscription = consumer.subscriptions.create("InventoryChannel", {
      received(data) {
        // data berisi { product_id: x, new_stock: y } dari SalesController
        setProducts(currentProducts => 
          currentProducts.map(p => 
            p.id === data.product_id ? { ...p, stock: data.new_stock } : p
          )
        );
        console.log(`Stok produk ${data.product_id} diperbarui menjadi ${data.new_stock}`);
      }
    });

    // Cleanup subscription saat komponen unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Pastikan useEffect untuk filter menggunakan state 'products' yang baru
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = products.filter(p => 
        p.barcode.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  const selectProduct = (product) => {
    if (product.stock <= 0) return alert("Out of Stock!");
    setPendingProduct(product);
    setQuantityInput(1);
    setSearchTerm("");
    setTimeout(() => qtyRef.current?.focus(), 50);
  };

  const addToCart = (e) => {
    e.preventDefault();
    const qty = parseInt(quantityInput);
    if (qty > pendingProduct.stock) return alert("Insufficient stock!");

    const existing = cart.find(item => item.product_id === pendingProduct.id);
    if (existing) {
      setCart(cart.map(item => item.product_id === pendingProduct.id 
        ? { ...item, quantity: item.quantity + qty } : item));
    } else {
      setCart([...cart, { ...pendingProduct, product_id: pendingProduct.id, quantity: qty }]);
    }
    setPendingProduct(null);
    searchRef.current.focus();
  };

  const checkout = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    router.post("/sales", { total_price: total, items: cart }, {
      onSuccess: () => {
        setLastTransaction({ 
          items: [...cart], 
          total, 
          cash: Number(cashReceived), 
          date: new Date().toLocaleString() 
        });
        setCart([]); 
        setCashReceived("");
        setSearchTerm("");

        setShowReceipt(true);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8">
      <Navbar>
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <ProductSearch 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              searchResults={searchResults} 
              selectProduct={selectProduct}
              searchRef={searchRef}
            />
            <CartTable 
              cart={cart} 
              removeFromCart={(id) => setCart(cart.filter(i => i.product_id !== id))} 
            />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <CheckoutPanel 
              totalPrice={cart.reduce((s, i) => s + i.price * i.quantity, 0)}
              cashReceived={cashReceived}
              setCashReceived={setCashReceived}
              checkout={checkout}
            />
          </div>
        </div>
      </Navbar>

      {/* Modal Input Quantity */}
      {pendingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Input Quantity</h3>
            <p className="text-slate-400 text-sm mb-4">{pendingProduct.name}</p>
            
            <form onSubmit={addToCart}>
              <input
                ref={qtyRef}
                type="number"
                min="1"
                max={pendingProduct.stock}
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPendingProduct(null)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors font-bold"
                >
                  Add to Cart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Struk (Receipt) */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white text-slate-900 p-8 rounded-lg w-full max-w-sm font-mono shadow-2xl">
            <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
              <h2 className="text-2xl font-black">STRUK PEMBAYARAN</h2>
              <p className="text-xs">{lastTransaction.date}</p>
            </div>
            
            <div className="space-y-2 mb-4">
              {lastTransaction.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t-2 border-dashed border-slate-300 pt-4 space-y-1">
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>Rp {lastTransaction.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TUNAI</span>
                <span>Rp {lastTransaction.cash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>KEMBALI</span>
                <span>Rp {(lastTransaction.cash - lastTransaction.total).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceipt(false)}
              className="w-full mt-8 bg-slate-900 text-white py-3 rounded-md font-bold hover:bg-slate-800 transition-colors"
            >
              TUTUP & SELESAI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}