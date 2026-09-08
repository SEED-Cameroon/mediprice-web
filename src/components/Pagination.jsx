export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2"
      aria-label="Services pagination"
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <span
        className="px-3 py-2 text-sm text-gray-600"
        aria-live="polite"
      >
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  )
}