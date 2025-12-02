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

export default function ConfirmProjectDeleteModal({ open, setOpen, _project, action }) {
    const [project, setProject] = useState();

    useEffect(() => {
      if (_project) {
        setProject(_project);
      }
    }, [_project]);

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suppression de projet</AlertDialogTitle>
            <AlertDialogDescription>
              Ce projet contient{" "}
                  <span className="font-bold text-red-500">
                    {project?._count.persons || 0}
                  </span>{" "}
                  personne(s). <br />
                  Si vous supprimez ce projet, ces personnes seront également
                  supprimées. Voulez-vous continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={action}
            >
              Oui, supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
