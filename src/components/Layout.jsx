import { Outlet } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-base font-semibold text-emerald-700 sm:text-lg">
            MediPrice Cameroon
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  )
}