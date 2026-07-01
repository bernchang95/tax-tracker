export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-neutral-50">
      {children}
    </main>
  );
}
