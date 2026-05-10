import React from 'react'
import { useForm } from '@inertiajs/react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  })

  function handleSubmit(e) {
    e.preventDefault()
    post('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🏪 Minimarket Login
          </h1>
          <p className="text-gray-500 mt-2">
            Please login to your admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@minimarket.com"
              required
            />
            {errors.email && (
              <div className="text-red-500 text-xs mt-1">{errors.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-bold transition ${processing ? "opacity-50" : "hover:bg-blue-700"}`}
          >
            {processing ? "AUTHENTICATING..." : "LOGIN"}
          </button>

          {/* Credential info section */}
          <div className="text-center text-xs text-gray-400 mt-4 bg-gray-50 p-2 rounded">
            <p>
              Username: <strong>admin@minimarket.com</strong>
            </p>
            <p>
              Password: <strong>admin123</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}