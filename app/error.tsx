"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
        Something went wrong: {error.message}
      </div>
      <button
        onClick={reset}
        className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </main>
  );
}
