import React from 'react';
import { Link, router } from '@inertiajs/react';
import Navbar from '../../Layouts/Navbar';

export default function History({ sales, filters }) {
  const {
    data,
    current_page,
    total_pages,
    prev_page,
    next_page,
    is_first_page,
    is_last_page,
    total_count,
  } = sales;

  // Page navigation function
  const handlePageChange = (page) => {
    if (!page) return;
    router.get(
      "/riwayat",
      { ...filters, page: page },
      {
        preserveState: true,
        preserveScroll: true,
      },
    );
  };

  const handleFilterChange = (e) => {
    router.get(
      "/riwayat",
      { month: e.target.value },
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  const formatIDR = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Navbar>
          {/* ... (Header remains the same) ... */}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length > 0 ? (
                    data.map((sale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-4 text-sm text-slate-600 font-mono">
                          {new Date(sale.created_at).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                          <span className="text-slate-400 ml-2">
                            {new Date(sale.created_at).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-medium text-slate-700">
                          {sale.sale_items ? sale.sale_items.length : 0}{" "}
                          Products
                        </td>
                        <td className="p-4 text-sm font-bold text-slate-900">
                          {formatIDR(sale.total_price)}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-3">
                          <Link
                            href={`/riwayat/${sale.id}`}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-xs font-bold transition-colors"
                          >
                            DETAILS
                          </Link>

                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Delete this transaction? Stock data will not be automatically restored.",
                                )
                              ) {
                                router.delete(`/riwayat/${sale.id}`);
                              }
                            }}
                            className="px-3 py-1 bg-red-50 text-red-500 rounded-md hover:bg-red-100 text-xs font-bold transition-colors"
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-12 text-center text-slate-400 italic"
                      >
                        No data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-800">{data.length}</span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">{total_count}</span>{" "}
                transactions
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(prev_page)}
                  disabled={is_first_page}
                  className={`px-4 py-2 rounded-lg border font-bold text-xs transition-all ${
                    is_first_page
                      ? "text-slate-300 border-slate-100"
                      : "text-blue-600 border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  PREVIOUS
                </button>

                <div className="flex items-center px-4 text-sm font-bold text-slate-600">
                  Page {current_page} of {total_pages}
                </div>

                <button
                  onClick={() => handlePageChange(next_page)}
                  disabled={is_last_page}
                  className={`px-4 py-2 rounded-lg border font-bold text-xs transition-all ${
                    is_last_page
                      ? "text-slate-300 border-slate-100"
                      : "text-blue-600 border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </Navbar>
      </div>
    </div>
  );
}