import React from 'react';
import { router } from '@inertiajs/react';
import Navbar from '../../../Layouts/Navbar';
import HistoryTable from './HistoryTable';

export default function History({ sales, filters }) {
  
  const handleFilterChange = (e) => {
    router.get(
      "/riwayat",
      { month: e.target.value },
      { preserveState: true, replace: true }
    );
  };

  return (
        <Navbar>
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
          {/* Anda bisa memindahkan bagian Header/Filter ke komponen terpisah juga jika perlu */}
          <div className="mb-6">
             <select 
               onChange={handleFilterChange} 
               value={filters?.month || ""}
               className="rounded-lg border-slate-200 text-sm"
             >
               <option value="">All Months</option>
               {/* Opsi bulan bisa di-map di sini */}
             </select>
          </div>

          <HistoryTable sales={sales} filters={filters} />
      </div>
    </div>
     </Navbar>
    
  );
}