import React from "react";
import ReceiptContent from "./ReceiptContent";

export default function Receipt({ sale }) {
  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    window.location.href = "/riwayat";
  };

  return (
    <div className="receipt-wrapper py-6">
      {/* Tombol Kontrol (Hanya muncul di layar, hilang saat diprint) */}
      <div className="no-print flex gap-2 mb-6 justify-center">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Print Receipt
        </button>
        <button
          onClick={handleClose}
          className="bg-gray-500 text-white px-6 py-2 rounded shadow hover:bg-gray-600 transition"
        >
          Back to History
        </button>
      </div>

      {/* Konten Struk */}
      <ReceiptContent sale={sale} />

      {/* Print-specific CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .no-print { display: none !important; }
              body { background: white; }
              .receipt-wrapper { padding: 0; }
              body * { visibility: hidden; }
              .receipt-container, .receipt-container * { visibility: visible; }
              .receipt-container { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                border: none;
              }
            }
          `,
        }}
      />
    </div>
  );
}