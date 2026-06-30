import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Tax Tracker
        </Link>
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/" className="hover:text-blue-600">
            Transactions
          </Link>
          <Link href="/summary" className="hover:text-blue-600">
            Annual Summary
          </Link>
          <Link href="/categories" className="hover:text-blue-600">
            Categories
          </Link>
        </nav>
      </div>
    </header>
  );
}
