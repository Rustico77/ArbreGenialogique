
"use client";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";

export default function ClientNavbar() {
  const { user } = useAuthStore();

  if (!user) return null;
  return <Navbar />;
}
