// app/projects/page.tsx
"use client";

import { useState } from "react";
import { createUser } from "../../actions/userActions";
import { deleteProject, getAllProject, updateProject } from "../../actions/projectActions";
import CreateProjectModal from "../../modals/createProjectModal";
import { useEffect } from 'react';
import Loading from "../../../../components/Loading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import ConfirmDeleteModal from "@/app/modals/confirmDeleteModal";


export default function ProjectPage() {
  ///Const
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, initAuth } = useAuthStore();
  
  

  ///Functions
  const GetAllProject = async () => {
    const res = await getAllProject(user.id);
    setProjects(res.data || []);
    setLoading(false);
  };

  const handleConfirmDelete = (project) => {
    if(project._count.persons > 0){
      setCurrentProject(project);
      setOpenConfirmModal(true);
    }else{
      handleDeleteProject(project.id);
    }
  }

  const handleDeleteProject = async (id) => {
        setLoading(true);
        const res = await deleteProject(id);
        setLoading(false);

        if(!res.isSuccess){
            toast.error(res.message);
        }else{
            toast.success(res.message);
            GetAllProject();          
        }
    };

    const handleUpdateProject = async (id) => {
        setLoading(true);
        const res = await updateProject(id);
        setLoading(false);

        if(!res.isSuccess){
            toast.error(res.message);
        }else{
            toast.success(res.message);
            GetAllProject();
        }
    };

  useEffect(() =>  {
    initAuth(router);
  }, []);

  useEffect(() => {
  if (user) {
    GetAllProject();
  }
}, [user]);

  /// View
  if(loading){
    return(<Loading title="Chargement des projets"/>);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-bold">Mes projets</h1>
        <CreateProjectModal open={openModal} setOpen={setOpenModal} action={GetAllProject} project={currentProject} setProject={setCurrentProject}/>
      </div>

      {/* Liste des projets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.length === 0 ?(
          <div className="flex items-center justify-center h-64 md:w-150 lg:w-300 mt-40">
            <p className="text-white lg:text-4xl md:text-2xl text-lg-center font-medium">
              Aucun projet disponible. Cliquez sur "+ Nouveau projet" pour en ajouter un
            </p>
          </div>
        ) : 
        projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white shadow-md rounded-xl border hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{project.name}</h2>
            <p className="text-sm text-gray-600">{project.description}</p>
            <p className="text-xs text-gray-400 mt-2">mise à jour le {new Date(project.updatedAt).toLocaleString()}</p>

            {/* Actions */}
            <div className="flex justify-between mt-4">
              <ConfirmDeleteModal
                open={openConfirmModal} 
                setOpen={setOpenConfirmModal}
                _project={currentProject}
                action={() => handleDeleteProject(currentProject.id)}
              />
              <button onClick={() => {setOpenModal(true), setCurrentProject(project)}} className="text-blue-500 hover:underline text-sm cursor-pointer">Éditer</button>
              <button onClick={() => handleConfirmDelete(project)} className="text-red-500 hover:underline text-sm cursor-pointer">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
