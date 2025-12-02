// app/admin/page.js
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  UserPlus,
  Users,
  FolderTree,
  UserCheck,
  Trash2,
  Edit,
  Book,
  BookAlert,
  BookCheck,
  BookDashed,
  BookHeadphones,
} from "lucide-react";
import { getAllUser } from "@/app/actions/userActions";
import { Role } from "@prisma/client";
import { getAllProject } from "@/app/actions/projectActions";
import CreateUserModal from "@/app/modals/createUserModal";
import ConfirmUserDeleteModal from "@/app/modals/confirmUserDeleteModal";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  // Stats
  const stats = {
    totalUsers: users.length || "...",
    admins: loadingData
      ? "..."
      : users.filter((user) => user.role === Role.ADMIN).length.toString(),
    users: loadingData
      ? "..."
      : users.filter((user) => user.role === Role.USER).length.toString(),
    totalProjects: loadingData ? "..." : projects.length || "0",
    totalPersons: loadingData
      ? "..."
      : projects.reduce((sum, project) => {
          sum + (project._count?.persons || 0);
        }, 0),
    readOnlyUsers: loadingData
      ? "..."
      : users.filter((user) => user.readOnly).length.toString(),
  };

  // Créer un utilisateur (simulation)
  const handleCreateUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      id: String(Date.now()),
      userName: formData.get("userName"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      role: formData.get("role") || "USER",
      readOnly: formData.get("readOnly") === "on",
      projectsCount: 0,
    };

    setUsers([newUser, ...users]);
    setIsDialogOpen(false);
  };

  // Toggle lecture seule
  const toggleReadOnly = (id) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, readOnly: !u.readOnly } : u))
    );
  };

  // Supprimer un utilisateur (simulation)
  const deleteUser = (id) => {
    if (confirm("Supprimer cet utilisateur ?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const initUserData = async () => {
    const usersData = await getAllUser();
    setUsers(usersData);
  };

  const initData = async () => {
    setLoadingData(true);

    // users
    await initUserData();

    // projects
    const projectsData = await getAllProject();
    setProjects(projectsData);

    setLoadingData(false);
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Tableau de bord Administrateur
      </h2>

      {/* === Statistiques === */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.admins} admin{stats.admins > 1 && "s"} • {stats.users}{" "}
              utilisateur{stats.users > 1 && "s"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projets créés</CardTitle>
            <FolderTree className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.totalProjects}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Personnes</CardTitle>
            <UserCheck className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalPersons}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lecture seule</CardTitle>
            <Book className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.readOnlyUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* === Gestion utilisateurs === */}
      <Card>
        <CardHeader>
          <div className="md:flex md:space-y-0 space-y-4 justify-between items-center">
            <div>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Créer, modifier ou supprimer des comptes
              </CardDescription>
            </div>

            <CreateUserModal
              open={isDialogOpen}
              setOpen={setIsDialogOpen}
              action={() => initUserData()}
              user={currentUser}
              setUser={setCurrentUser}
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Lecture seule</TableHead>
                <TableHead>Projets</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                    <p className="text-sm text-muted-foreground">
                      @{user.userName}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.role === "ADMIN" ? "bg-blue-900" : "bg-blue-700"
                      }
                    >
                      {user.role === "ADMIN" ? "Admin" : "Utilisateur"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.readOnly}
                      onCheckedChange={() => toggleReadOnly(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.projectsCount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                      onClick={() => {setIsDialogOpen(true), setCurrentUser(user)}}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 cursor-pointer"
                      onClick={() => {
                        setCurrentUser(user);
                        setConfirmDelete(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirm Delete Modal */}
      <ConfirmUserDeleteModal
        open={confirmDelete}
        setOpen={setConfirmDelete}
        user={currentUser}
        action={initUserData}
      />
    </>
  );
}
