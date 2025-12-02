// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/app/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@prisma/client";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const links = [
    { name: "Tableau de bord", href: "/" },
    { name: "Gestion de projets", href: "/project" },
    { name: "Arbre généalogique", href: "/familyTree" },
    { name: "Compte", href: "/myAccount" },
    { name: "Deconnexion", href: "/auth" },
  ];

  if (user && user.role === Role.USER) {
    return (
      <nav className="bg-gray-200 rounded-4xl">
        <div className="max-w-8xl mx-10 py-3 mt-5 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
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

          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer transition-all hover:scale-105 active:scale-95">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <User className="rounded-full border-2 border-blue-600 size-10 p-1 bg-white text-blue-600 shadow-md" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                      {user != null ? `${user.lastName} ${user.firstName}` : ""}
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60 p-4">
                <div className="flex flex-col space-y-3">
                  {links.map((link) => (
                    <Link
                      onClick={() => link.name === "Deconnexion" && logout()}
                      key={link.name}
                      href={link.href}
                      className={`text-[15px] font-medium ${
                        pathname === link.href
                          ? "text-[#002A67] border-b-2 border-[#002A67] pb-1"
                          : "text-gray-600 hover:text-gray-900"
                      } ${
                        link.name === "Deconnexion"
                          ? "cursor-pointer text-red-700 font-semibold flex justify-center mt-5 border-1 p-1 border-red-400 rounded-2xl bg-red-200"
                          : ""
                      }`}
                    >
                      {link.name !== "Compte" ? (
                        link.name
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Image
                            src="/icons/profilIcon.png"
                            alt="profil"
                            height={30}
                            width={30}
                          />
                          <h2>Profil</h2>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Button Menu Mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t shadow-md">
            <div className="flex flex-col space-y-3 px-6 py-4">
              {links.map((link) => (
                <Link
                  onClick={() => link.name === "Deconnexion" && logout()}
                  key={link.name}
                  href={link.href}
                  className={`text-[15px] font-medium ${
                    pathname === link.href
                      ? "text-[#002A67] border-b-2 border-[#002A67] pb-1"
                      : "text-gray-600 hover:text-gray-900"
                  } ${
                    link.name === "Deconnexion"
                      ? "cursor-pointer text-red-700 font-semibold flex justify-center mt-5 border-1 p-1 border-red-400 rounded-2xl bg-red-200"
                      : ""
                  }`}
                >
                  {link.name !== "Compte" ? (
                    link.name
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/icons/profilIcon.png"
                        alt="profil"
                        height={30}
                        width={30}
                      />
                      <h2>Profil</h2>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    );
  }
};

export default Navbar;
