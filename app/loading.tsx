export default function Loading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-neutral-200 rounded" />
      <div className="h-16 bg-neutral-100 rounded-lg border border-neutral-200" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="h-20 bg-neutral-100 rounded-lg border border-neutral-200" />
        <div className="h-20 bg-neutral-100 rounded-lg border border-neutral-200" />
        <div className="h-20 bg-neutral-100 rounded-lg border border-neutral-200" />
      </div>
      <div className="h-64 bg-neutral-100 rounded-lg border border-neutral-200" />
    </main>
  );
}
