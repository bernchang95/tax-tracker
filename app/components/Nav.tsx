import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/app/components/SignOutButton";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        {user && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-400 hidden sm:inline truncate max-w-[200px]">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        )}
      </div>
    </header>
  );
}
