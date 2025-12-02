"use client";

import { useAuthStore } from "@/app/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// app/admin/layout.js
export default function AdminLayout({ children }) {
  const { logout, initAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initAuth(router);
  }, []);

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer transition-all hover:scale-105 active:scale-95">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-800 font-semibold">Admin</span>
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60 p-4">
                <div className="flex flex-col space-y-3">
                  {/* Profil */}
                  <Link
                    href={"/admin/account"}
                    className={`text-[15px] font-medium cursor-pointer hover:bg-gray-100 p-1 rounded-lg`}
                  >
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/icons/profilIcon.png"
                        alt="profil"
                        height={30}
                        width={30}
                      />
                      <h2>Profil</h2>
                    </div>
                  </Link>

                  <Link
                    onClick={() => logout()}
                    href={"/auth"}
                    className={`text-[15px] cursor-pointer text-red-700 font-semibold flex justify-center mt-2 border-1 p-1 border-red-400 rounded-2xl bg-red-200`}
                  >
                    <div className="flex items-center space-x-2">
                      <h2>Deconnexion</h2>
                    </div>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
