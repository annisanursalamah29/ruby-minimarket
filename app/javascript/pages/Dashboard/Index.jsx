import React from "react";
import { Link } from "@inertiajs/react";
import StatCard from "./StatCard"; // Sesuaikan path folder
import QuickMenuLink from "./QuickMenuLink"; // Sesuaikan path folder

export default function Index({ stats, chartData }) {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🏠 Minimarket Dashboard
          </h1>
          <Link
            href="/logout"
            method="delete"
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Logout
          </Link>
        </div>

        {/* STATISTICS CARD ROW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Today's Revenue"
            value={`Rp ${Number(stats.todaySales).toLocaleString()}`}
            color="bg-green-600"
            icon="💰"
          />
          <StatCard
            title="Today's Transactions"
            value={stats.todayTransactions}
            color="bg-blue-600"
            icon="🛒"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            color="bg-purple-600"
            icon="📦"
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStock}
            color="bg-red-600"
            icon="⚠️"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CHART SECTION */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">
              Sales Trend (Last 7 Days)
            </h3>
            <div className="space-y-4">
              {chartData.map((data, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-500">{data.date}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{
                        width: `${Math.min((data.total / 1000000) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm font-bold text-gray-700">
                    Rp {Number(data.total).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACCESS MENU */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickMenuLink
                href="/kasir"
                title="Open Cashier"
                icon="📠"
                color="hover:bg-blue-50"
              />
              <QuickMenuLink
                href="/produk"
                title="Manage Products"
                icon="🏷️"
                color="hover:bg-purple-50"
              />
              <QuickMenuLink
                href="/riwayat"
                title="Reports"
                icon="📋"
                color="hover:bg-green-50"
              />
              <QuickMenuLink
                href="/produk"
                title="Critical Stock"
                icon="🚨"
                color="hover:bg-red-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
