"use client";

import { create } from "zustand";
import { getUserByToken } from "../actions/userActions";
import { Role } from "@prisma/client";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  expiredDate: null,

  //set User
  setUser: (user) => {
    set({user : user})
  },

  // login
  login: (userData, token, expiredDate, router) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expiredDate", expiredDate.toISOString());
    set({ user: userData, token, expiredDate });
    if (router){
      if(userData.role === Role.ADMIN)  router.push("/admin");
      else router.push("/familyTree");
    }
  },

  // logout
  logout: (router) => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiredDate");
    set({ user: null, token: null, expiredDate: null });
    if (router) router.push("/auth");
  },

  // Charger au démarrage
  initAuth: async (router) => {
    const token = localStorage.getItem("token");
    const expiredDateStr = localStorage.getItem("expiredDate");
    console.log("token : ", token);
    console.log("exipred date : ", expiredDateStr);
    const { logout } = useAuthStore.getState();

    if (token && expiredDateStr) {
      try {
        const expired = new Date(expiredDateStr);
        if(expired.getTime() > Date.now()){
            const user = await getUserByToken(token);
            if (user) {
                set({ user: user, token });
            } else {
                logout(router);
            }
        }else{
            logout(router);
        }
        
      } catch (err) {
        console.error("Erreur initAuth", err);
        logout(router);
      }
    }else{
        logout(router);
    }
  },
}));
