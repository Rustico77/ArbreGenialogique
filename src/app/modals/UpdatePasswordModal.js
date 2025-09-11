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
import { updateUserPassword } from "../actions/userActions";

export default function UpdatePasswordModal({open, setOpen, userId, action}){  
    ///Const
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ oldPassword: "", password: ""});

    ///Functions
    const initForm = () => {
        setOpen(false);
        setForm({ password: "", oldPassword: "" });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        await handleUpdatePassword();
    };

    const handleUpdatePassword = async () => {
        setLoading(true);
        const res = await updateUserPassword(userId, form);
        setLoading(false);

        if(!res.data){
            toast.error(res.message);
        }else{
            toast.success(res.message);
            initForm();
            action();
        }
        
    };
      
    ///View
    return (
        <div>
            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                    Modifier le mot de passe
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Ancien mot de passe
                    </label>
                    <Input 
                        type="password" 
                        placeholder="********" 
                        required 
                        value={form.oldPassword} 
                        onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nouveau mot de passe
                    </label>
                    <Input 
                        type="password" 
                        placeholder="********"
                        required 
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    </div>
                    <DialogFooter className="flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => initForm()}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading ? "Modification..." : "Confirmer"}
                    </Button>
                    </DialogFooter>
                </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}