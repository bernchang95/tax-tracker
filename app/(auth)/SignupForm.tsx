"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signUp } from "@/app/(auth)/actions";

export default function SignupForm({ serverError }: { serverError?: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(serverError ?? null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tax Tracker</h1>
        <p className="text-sm text-neutral-500 mt-1">Create your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input"
          />
          <span className="text-xs text-neutral-400">Minimum 8 characters</span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-neutral-500 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
