// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/providers/query-provider";
import Sidebar from "@/components/sidebar/sidebar";
import { ToastProvider } from "@/components/ui/toast"; // This is the Context Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Product Management",
  description: "Product management system with CRUD operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ToastProvider> {/* This is the wrapper, not individual toast */}
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}