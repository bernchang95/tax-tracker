"use client";

import { useTransition } from "react";
import { signOut } from "@/app/(auth)/actions";

export default function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      className="text-sm text-neutral-500 hover:text-neutral-800 hover:underline disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
