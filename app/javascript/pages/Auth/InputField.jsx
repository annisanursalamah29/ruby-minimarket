import React from 'react';

export default function InputField({ label, type, value, onChange, placeholder, error, required = true }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        required={required}
      />
      {error && (
        <div className="text-red-500 text-xs mt-1 animate-pulse">{error}</div>
      )}
    </div>
  );
}