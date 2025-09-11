"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { createProject, updateProject } from "../actions/projectActions";
import { toast } from "sonner";
import Loading from "../../../components/Loading";
import { useAuthStore } from "../store/authStore";

export default function CreateProjectModal({open, setOpen, action, project, setProject}){
    ///Const
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", userId: "",});
    const { user } = useAuthStore();

    ///Functions
    const initForm = () => {
        setOpen(false);
        setForm({ ...form, name: "", description: "" });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        await handleCreateProject();
    };

    const handleCreateProject = async () => {
        setLoading(true);
        ///Create
        if(!project){
            const res = await createProject(form);
            setLoading(false);

            if(!res.data){
                toast.error(res.message);
            }else{
                toast.success(res.message);
                setOpen(false);
                setForm({ ...form, name: "", description: "" });
                action();
            }
        }
        ///Update
        else{
            const res = await updateProject(project.id, form);
            setLoading(false);

            if(!res.isSuccess){
                toast.error(res.message);
            }else{
                toast.success(res.message);
                initForm();
                action();
            }
        }
        
    };

    useEffect(() => {
    if (open) {
        if (project) {
        setForm({
            name: project.name,
            description: project.description,
            userId: user.id,
        });
        } else {
        setForm({
            name: "",
            description: "",
            userId: user.id,
        });
        }
    }
    }, [project, open]); 
      
    ///View
    return (
        <div>
            {/* Button */}
            <button onClick={() => {setOpen(true), setProject(null)}} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary cursor-pointer">
                + Nouveau projet
            </button>

            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen} onClose={() => {}}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-md rounded-2xl shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">
                        {form.name == "" ? "Créer un projet" : "Mettre à jour le projet"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* Champ nom */}
                    <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nom du projet
                    </label>
                    <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ex: Projet 1"
                        required
                    />
                    </div>

                    {/* Champ description */}
                    <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Description
                    </label>
                    <Textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Description du projet..."
                        rows={3}
                    />
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex justify-end space-x-3 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={initForm}
                    >
                        Annuler
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                        {loading ? "Chargement ..." : project == null ? "Créer" : "Modifier"}
                    </Button>
                    </DialogFooter>
                </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}