// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/app/store/authStore";


const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useAuthStore();

  const links = [
    { name: "Tableau de bord", href: "/" },
    { name: "Gestion de projets", href: "/project" },
    { name: "Arbre généalogique", href: "/familyTree" },
    { name: "Compte", href: "/myAccount" },
  ];

  return (
    <nav className="bg-gray-200 rounded-4xl">
      <div className="max-w-8xl mx-10 py-3 mt-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center text-xl font-bold text-gray-800">
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
        <div className="hidden lg:flex space-x-48">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[15px] font-medium ${
                pathname === link.href
                  ? "text-[#002A67] border-b-2 border-[#002A67] pb-1"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {link.name !== "Compte" ? link.name : 
              <div className="flex items-center space-x-2">
                <Image src="/icons/profilIcon.png" alt="profil" height={30} width={30}/>
                <h2>{user != null ? `${user.lastName} ${user.firstName}` : ""}</h2>
              </div>
              }
            </Link>
          ))}
        </div>

        {/* Button Menu Mobile */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
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
                key={link.name}
                href={link.href}
                className={`text-[15px] font-medium ${
                pathname === link.href
                  ? "text-[#002A67] border-b-2 border-[#002A67]-500 pb-1"
                  : "text-gray-600 hover:text-gray-900"
              }`}
                onClick={() => setIsOpen(false)} // ferme le menu au clic
              >
                {link.name !== "Compte" ? link.name : 
                <div className="flex items-center space-x-2">
                  <Image src="/icons/profilIcon.png" alt="profil" height={30} width={30}/>
                  <h2>{user != null ? `${user.lastName} ${user.firstName}` : ""}</h2>
                </div>
              }
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
