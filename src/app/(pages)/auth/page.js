"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { useAuthStore } from "@/app/store/authStore";
import { createUser, loginUser } from "@/app/actions/userActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const { user, login, logout, initAuth } = useAuthStore();
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const res = await loginUser({
      userName: pseudo,
      password: password,
    });

    if(res.data){
      const expiresInMs = 60 * 60 * 1000; // 1 heure
      const expiryDate = new Date(Date.now() + expiresInMs);
      toast.success(res.message);
      login(res.data.userName, res.data.token, expiryDate, router)
    }else{
      toast.error(res.message);
    }

    setTimeout(() => setLoading(false), 2000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await createUser({
      userName: pseudo,
      password: password,
      firstName: firstName,
      lastName: lastName
    });

    if(res.data){
      const expiresInMs = 60 * 60 * 1000; // 1 heure
      const expiryDate = new Date(Date.now() + expiresInMs);
      toast.success(res.message);
      login(res.data.userName, res.data.token, expiryDate, router)
    }else{
      toast.error(res.message);
    }

    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-center text-2xl font-bold text-gray-800">
            <Image src="/images/logo.png" alt="logo" width={50} height={50}/> Bienvenue 
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Pseudo</label>
                  <Input type="name" placeholder="Pseudo" required value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
                  <Input type="password" placeholder="********" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-secondary cursor-pointer text-white">
                  {loading ? "Chargement..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
                  <Input type="text" placeholder="Nom" required value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Prénoms</label>
                  <Input type="text" placeholder="Prénoms" required value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Pseudo</label>
                  <Input type="name" placeholder="Pseudo" required value={pseudo} onChange={(e) => setPseudo(e.target.value)}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
                  <Input type="password" placeholder="********" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-secondary cursor-pointer text-white">
                  {loading ? "Chargement..." : "S'inscrire"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
