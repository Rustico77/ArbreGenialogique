"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Delete } from "lucide-react";
import { deleteUser } from "../actions/userActions";
import { toast } from "sonner";

export default function ConfirmUserDeleteModal({
  open,
  setOpen,
  user,
  action,
}) {
  const [project, setProject] = useState();

  const handleDeleteUser = async () => {
    const res = await deleteUser(user.id);

    if (res.success) {
      action();
      toast.success("Utilisateur supprimé avec succès");
      setOpen(false);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    if (user) {
      setProject(user);
    }
  }, [user]);

  if (user) {
    return (
      <>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{"Supprimer l'utilisateur ?"}</AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer
              <div className="text-red-700 font-semibold">
                {user.lastName} {user.firstName} (@{user.userName}) ?{" "}
              </div>
              <div className="my-4">Cette action est irréversible.</div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                onClick={handleDeleteUser}
              >
                Oui, supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
}
