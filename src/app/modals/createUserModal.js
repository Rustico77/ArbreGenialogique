"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { createProject, updateProject } from "../actions/projectActions";
import { toast } from "sonner";
import Loading from "../../../components/Loading";
import { useAuthStore } from "../store/authStore";
import { UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createUser } from "../actions/userActions";

export default function CreateUserModal({ open, setOpen, action, user, setUser }) {
  ///Const
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState();

  ///Functions
  const initForm = () => {
    setOpen(false);
    setForm({
      firstName: "dqslk",
      lastName: "",
      userName: "",
      role: "USER",
      readOnly: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleCreateUser();
  };

  const handleCreateUser = async () => {
    setLoading(true);
    ///Create
    if (!user) {
      const res = await createUser({
        firstName: form.firstName,
        lastName: form.lastName,
        userName: form.userName,
        role: form.role,
        readOnly: form.readOnly,
        password: "password",
      });
      setLoading(false);

      if (!res.data) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        initForm();
        action();
      }
    }
    ///Update
    else {
      //   const res = await updateProject(project.id, form);
      //   setLoading(false);
      //   if (!res.isSuccess) {
      //     toast.error(res.message);
      //   } else {
      //     toast.success(res.message);
      //     initForm();
      //     action();
      //   }
    }
  };

  useEffect(() => {
    if (open) {
      if (user) {
        setForm({
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          role: user.role,
          readOnly: user.readOnly,
        });
      } else {
        setForm({
          firstName: "",
          lastName: "",
          userName: "",
          role: "USER",
          readOnly: false,
        });
      }
    }
  }, [user, open]);

  ///View
  return (
    <div>
      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setUser(null)} className="cursor-pointer">
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Il pourra se connecter immédiatement
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{"Nom d'utilisateur"}</Label>
              <Input
                name="userName"
                value={form.userName}
                onChange={(e) =>
                  setForm({ ...form, userName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select
                name="role"
                value={form.role}
                onValueChange={(value) => setForm({ ...form, role: value })}
                defaultValue="USER"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Utilisateur</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                name="readOnly"
                onCheckedChange={(checked) =>
                  setForm({ ...form, readOnly: checked })
                }
                checked={form ? form.readOnly : false}
                id="readOnly"
              />
              <Label htmlFor="readOnly">Lecture seule</Label>
            </div>
            <div className="flex justify-end gap-3">
              <Button className="cursor-pointer" type="submit">
                {" "}
                {user ? "Mettre à jour" : "Créer"}{" "}
              </Button>
              <button
                onClick={() => initForm()}
                className="cursor-pointer border-1 rounded-lg bg-red-800 text-white p-1 px-3 text-sm"
                type="button"
              >
                {" "}
                Annuler{" "}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
