import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tax Tracker",
  description: "Income and expense tracker for LHDN e-B filing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
