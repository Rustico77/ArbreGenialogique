"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera } from "lucide-react"; // Icône
import { GENDERS, STATUS } from "../utils/listConst";
import { toast } from "sonner";
import { createPerson, updatePerson } from "../actions/personActions";


export default function CreatePersonModal({ open, setOpen, projectId, personCount, person, action }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    image: null,
    gender: "",
    birthDate: null,
    birthPlace: "",
    status: "",
    statusDate: "",
    profession: "",
    biography: "",
    projectId: "",
    positionX: 0,
    positionY: 0,

  });

  const resetForm = (projectId) => {
    setImageFile(null);
    setForm({
      ...form,
      firstName: "",
      lastName: "",
      image: null,
      gender: "",
      birthDate: null,
      birthPlace: "",
      status: "",
      projectId : projectId,
      statusDate: null,
      profession: "",
      biography: "",
      positionX: 0,
      positionY: 0,
    });
  }

  const initForm = () => {
    setOpen(false);
    setForm({
      firstName: "",
      lastName: "",
      image: null,
      gender: "",
      birthDate: null,
      birthPlace: "",
      status: "",
      statusDate: null,
      profession: "",
      biography: "",
      projectId: "",
      positionX: 0,
      positionY: 0,
    });
  }

  const [imageFile, setImageFile] = useState();

  const fileInputRef = useRef(null);

  const fillForm = (person) => {
    setImageFile(null);
    setForm({
      firstName: person.firstName,
      lastName: person.lastName,
      image: person.image,
      gender: person.gender,
      birthDate: person.birthDate.toISOString().split("T")[0],
      birthPlace: person.birthPlace,
      status: person.status,
      statusDate: person.statusDate?.toISOString().split("T")[0],
      profession: person.profession,
      biography: person.biography,
      projectId: person.projectId,
      positionX: person.positionX,
      positionY: person.positionY,
    });
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleUpload = async () => {
    if(imageFile){
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      
      if(res.ok){
        const data = await res.json();
        console.log("image url : ", data.url);
        await handleCreatePerson(data.url);
      }else{
        
      }
    }else{
      await handleCreatePerson();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.gender || !form.birthDate || !form.status) {
      toast.error("Veuillez remplir tous les champs obligatoires !");
      return;
    }
    await handleUpload();
    // setOpen(false);
  };

  const handleCreatePerson = async (image) => {
      form.birthDate = new Date(form.birthDate);
      form.statusDate = form.statusDate !== "" ? new Date(form.statusDate) : null;

      if(image){
        form.image = image;
      }

      console.log("person : ", form);
  
      var res = null;

      if(person){
        res = await updatePerson(person.id, form);
      }else{
        form.positionY = 1 * personCount * 10;
        res = await createPerson(form);
      }
  
      if(res){
        if(res.data){
          toast.success(res.message);
          initForm();
          action();
        }else{
          toast.error(res.message);
        }
      }
    };

    useEffect(() => {
        if (open) {
          if (projectId) {
            if(person){
              fillForm(person);
            }else{
              resetForm(projectId);
            }
          }
        }
        }, [projectId, open, personCount, person]); 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-lg rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {person === null ? "Créer une personne" : "Modifier une personne"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto p-2">
          {/* Image Avatar */}
          <div className="flex justify-center">
            <div
              className="relative w-28 h-28 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => fileInputRef.current.click()}
            >
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) :
              form.image !== null ? (
                <img
                  src={form.image}
                  alt="image"
                  className="w-full h-full object-cover"
                />
              ) 
              : (
                <div className="flex flex-col items-center text-gray-500">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-xs">Ajouter</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>
          </div>

          {/* Nom & Prénom */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Nom *</Label>
              <Input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Ex: Dupont"
                required
              />
            </div>
            <div className="flex-1">
              <Label>Prénom *</Label>
              <Input
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Ex: Jean"
                required
              />
            </div>
          </div>

          {/* Genre */}
          <div>
            <Label>Genre *</Label>
            <Select value={form.gender} onValueChange={(value) => handleChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez le genre" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date de naissance */}
          <div>
            <Label>Date de naissance *</Label>
            <Input
              type="date"
              value={form.birthDate ?? ""}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              required
            />
          </div>

          {/* Lieu de naissance */}
          <div>
            <Label>Lieu de naissance</Label>
            <Input
              value={form.birthPlace}
              onChange={(e) => handleChange("birthPlace", e.target.value)}
              placeholder="Ex: Lomé"
            />
          </div>

          {/* Statut */}
          <div>
            <Label>Statut *</Label>
            <Select value={form.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez le statut" />
              </SelectTrigger>
              <SelectContent>
                {STATUS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date du statut */}
          <div>
            <Label>Date du type de statut</Label>
            <Input
              type="date"
              value={form.statusDate || ""}
              onChange={(e) => handleChange("statusDate", e.target.value)}
            />
          </div>

          {/* Profession */}
          <div>
            <Label>Profession</Label>
            <Input
              value={form.profession}
              onChange={(e) => handleChange("profession", e.target.value)}
              placeholder="Ex: Développeur"
            />
          </div>

          {/* Biographie */}
          <div>
            <Label>Biographie</Label>
            <Textarea
              value={form.biography}
              onChange={(e) => handleChange("biography", e.target.value)}
              placeholder="Parlez un peu de vous..."
              rows={3}
            />
          </div>

          {/* Footer */}
          <DialogFooter className="flex justify-end space-x-3">
            <Button className="cursor-pointer" type="button" variant="outline" onClick={() => initForm()}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              {person === null ? "Créer" : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
