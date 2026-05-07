import React from "react";

export default function ProductForm({ values, setValues, onSubmit, editingId, onReset, categories }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Barcode</label>
          <input
            type="text"
            value={values.barcode}
            onChange={(e) => setValues({ ...values, barcode: e.target.value })}
            className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="md:col-span-3">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Product Name</label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category</label>
          <select
            value={values.category_id}
            onChange={(e) => setValues({ ...values, category_id: e.target.value })}
            className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none"
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Stock</label>
          <input
            type="number"
            value={values.stock}
            onChange={(e) => setValues({ ...values, stock: e.target.value })}
            className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price (Rp)</label>
          <input
            type="number"
            value={values.price}
            onChange={(e) => setValues({ ...values, price: e.target.value })}
            className="mt-1 w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 outline-none"
            required
          />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            className={`flex-1 py-2.5 rounded-lg text-white font-bold shadow-md transition-all active:scale-95 ${
              editingId ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Update" : "Save"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-2.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
            >
              ×
            </button>
          )}
        </div>
      </form>
    </div>
  );
}