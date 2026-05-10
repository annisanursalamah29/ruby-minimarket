import React from "react";

export default function ReceiptContent({ sale }) {
  return (
    <div
      className="receipt-container p-4 bg-white mx-auto border"
      style={{ width: "80mm", fontFamily: "monospace" }}
    >
      {/* Header Toko */}
      <div className="text-center mb-4">
        <h2 className="font-bold text-lg">MY MINIMARKET</h2>
        <p className="text-xs">123 Sample St, Your City</p>
      </div>

      {/* Metadata Transaksi */}
      <div className="text-xs mb-2 border-b border-dashed pb-2">
        <p>No: TRX-{sale.id}</p>
        <p>Date: {new Date(sale.created_at).toLocaleString("id-ID")}</p>
      </div>

      {/* Tabel Item */}
      <table className="w-full text-xs mb-2">
        <thead>
          <tr className="border-b border-dashed">
            <th className="text-left py-1">Item</th>
            <th className="text-right py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.sale_items.map((item) => (
            <tr key={item.id}>
              <td className="py-1">
                {item.product.name} <br />
                {item.quantity} x {Number(item.price).toLocaleString()}
              </td>
              <td className="text-right align-bottom">
                {Number(item.quantity * item.price).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total & Footer */}
      <div className="border-t border-dashed pt-2 font-bold text-sm">
        <div className="flex justify-between">
          <span>TOTAL:</span>
          <span>Rp {Number(sale.total_price).toLocaleString()}</span>
        </div>
      </div>

      <div className="text-center mt-6 text-xs">
        <p>Thank You</p>
        <p>Please Come Again</p>
      </div>
    </div>
  );
}