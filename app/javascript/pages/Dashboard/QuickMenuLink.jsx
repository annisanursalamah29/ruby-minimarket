import React from 'react';
import { Link } from '@inertiajs/react';

export default function QuickMenuLink({ href, title, icon, color }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center p-6 border rounded-xl transition ${color}`}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm font-bold text-gray-600">{title}</span>
    </Link>
  );
}