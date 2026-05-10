import React from 'react';

export default function StatCard({ title, value, color, icon }) {
  return (
    <div className={`${color} p-6 rounded-2xl shadow-lg text-white relative overflow-hidden`}>
      <div className="text-4xl absolute -right-2 -bottom-2 opacity-20">{icon}</div>
      <div className="text-sm opacity-80 font-semibold mb-1 uppercase">{title}</div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}