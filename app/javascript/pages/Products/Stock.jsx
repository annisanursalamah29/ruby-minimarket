import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Navbar from "../../Layouts/Navbar";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import Pagination from "../../Layouts/Pagination";

export default function Stock({
  products,
  categories,
  filters,
  lowStockCount,
}) {
  const barcodeRef = useRef(null); // Tambahkan ini
  const [search, setSearch] = useState(filters.barcode || "");
  const [editingId, setEditingId] = useState(null);
  const [values, setValues] = useState({
    barcode: "",
    name: "",
    stock: "",
    price: "",
    category_id: categories?.[0]?.id || "",
  });

  const isFirstRender = useRef(true);
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });

  // Debounced Search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!filters.barcode && search === "") return;
    }
    const delayDebounceFn = setTimeout(() => {
      const query = { ...filters, barcode: search };
      if (!search) delete query.barcode;
      router.get("/produk", query, {
        preserveState: true,
        replace: true,
        preserveScroll: true,
      });
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const resetForm = () => {
    setEditingId(null);
    setValues({
      barcode: "",
      name: "",
      stock: "",
      price: "",
      category_id: categories?.[0]?.id || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isDuplicate = products.data.some(
    (p) => p.barcode === values.barcode && p.id !== editingId,
  );

  if (isDuplicate) {
    // 1. Munculkan peringatan
    Swal.fire({
      icon: "warning",
      title: "Duplicate Barcode",
      text: "Barcode already exists!",
      returnFocus: false 
    }).then(() => {
      // Fokus dijalankan HANYA setelah user menekan OK
      if (barcodeRef.current) {
        barcodeRef.current.focus();
      }
    });
    
    return; // Berhenti di sini
  }

    const options = {
      onSuccess: () => {
        resetForm();
        Toast.fire({ icon: "success", title: editingId ? "Updated" : "Added" });
      },
    };

    if (editingId)
      router.put(`/produk/${editingId}`, { product: values }, options);
    else router.post("/produk", { product: values }, options);
  };

  const handleDelete = (id) => {
    // Tambahkan pengecekan jika ID yang dihapus sedang dalam proses edit
    if (editingId === id) {
      return Swal.fire({
        icon: "info",
        title: "Data Sedang Diedit",
        text: "Selesaikan atau batalkan proses edit sebelum menghapus data ini.",
        confirmButtonColor: "#3085d6",
      });
    }

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/produk/${id}`, {
          onSuccess: () => Toast.fire({ icon: "success", title: "Berhasil dihapus" }),
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Navbar>
          {lowStockCount > 0 && (
            <div className="mb-6 p-4 bg-red-600 text-white rounded-xl animate-bounce">
              🚨 Attention: {lowStockCount} items are running low!
            </div>
          )}

          <header className="mb-8 flex flex-col md:flex-row justify-between gap-4">
            <h1 className="text-2xl font-black">📦 PRODUCT STOCK</h1>
            <input
              type="text"
              placeholder="Search barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 p-2.5 bg-white border rounded-xl"
            />
          </header>

          <ProductForm
            values={values}
            setValues={setValues}
            onSubmit={handleSubmit}
            editingId={editingId}
            onReset={resetForm}
            categories={categories}
            barcodeRef={barcodeRef}
          />

          <ProductTable
            products={products.data}
            onEdit={(p) => {
              setEditingId(p.id);
              setValues(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => barcodeRef.current?.focus(), 100);
            }}
            onDelete={handleDelete}
            editingId={editingId}
          />

          <Pagination
            meta={products} // Mengirim objek pagination lengkap
            label="produk"  // Label kustom untuk teks ringkasan
            onPageChange={(page) =>
              router.get(
                "/produk",
                { ...filters, page },
                { preserveState: true, preserveScroll: true }
              )
            }
          />
        </Navbar>
      </div>
    </div>
  );
}
