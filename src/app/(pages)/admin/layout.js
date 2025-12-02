import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import Link from "next/link";

// app/admin/layout.js
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link
              href="/admin"
              className="flex items-center text-xl font-bold text-gray-800"
            >
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              Arbre Génialogique
            </Link>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-blue-800 font-semibold">Admin</span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
