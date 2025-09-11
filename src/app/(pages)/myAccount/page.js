"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuthStore } from "@/app/store/authStore";
import { updateUserInfo } from "@/app/actions/userActions";
import { useRouter } from "next/navigation";
import UpdatePasswordModal from "@/app/modals/UpdatePasswordModal";
import { LogOut } from "lucide-react";

export default function AccountPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
  });

  const [loading, setLoading] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const { user, setUser, logout, initAuth } = useAuthStore();
  const router = useRouter();

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    user.lastName = form.lastName;
    user.firstName = form.firstName;

    const res = await updateUserInfo(user.id, user);
    if(res.data){
      toast.success(res.message);
      setUser(res.data);
    }else{
      toast.error(res.message);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenPasswordModal(false);
      alert("Mot de passe modifié ✅");
    }, 1500);
  };

  useEffect(() => {
    initAuth(router);
  }, []);

  useEffect(() => {
    if(user){
      setForm({firstName: user.firstName, lastName: user.lastName});
    }
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Titre */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Mon compte</h1>
        <Button onClick={() => logout(router)} type="button" className="mb-10 bg-red-900 hover:bg-red-700 text-white mt-10 cursor-pointer"
        >
          Se déconnecter
        </Button>
      </div>

      {/* Informations personnelles */}
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nom
              </label>
              <Input
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Prénoms
              </label>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                placeholder="Votre prénom"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white mt-10 cursor-pointer"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Mot de passe */}
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Pour modifier votre mot de passe, cliquez sur le bouton ci-dessous.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => setOpenPasswordModal(true)}
            className="border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
          >
            Modifier le mot de passe
          </Button>
        </CardFooter>
      </Card>

      {/* Modal changement mot de passe */}
      <UpdatePasswordModal open={openPasswordModal} setOpen={setOpenPasswordModal} userId={user?.id} action={() => logout(router)}/>
    </div>
  );
}
