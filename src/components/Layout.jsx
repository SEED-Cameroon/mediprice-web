import { Outlet } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="border-b border-gray-200 px-6 py-4">
        <span className="text-lg font-semibold text-emerald-700">
          MediPrice Cameroon
        </span>
      </header>
      <main className="flex-1 px-6 py-8">{children ?? <Outlet />}</main>
    </div>
  )
}
