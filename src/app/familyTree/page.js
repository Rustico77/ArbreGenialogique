"use client";

import { getAllProjectById } from "@/app/actions/projectActions";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";
import Loading from "../../../components/Loading";
import { Button } from "@/components/ui/button";
import CreatePersonModal from "@/app/modals/CreatePersonneModal";
import {
  createPerson,
  deletePerson,
  getAllPersonByProject,
  getAllRelation,
  getSinglePerson,
  updatePersonPosition,
  updateRelation,
} from "@/app/actions/personActions";
import { toast } from "sonner";
import { RelationshipType, Role } from "@prisma/client";
import { RELATIONTYPE } from "@/app/utils/listConst";
import CustomNode from "@/app/utils/nodeCustom";
import { Plus, Save } from "lucide-react";

const nodeTypes = {
  customNode: CustomNode,
};

// Exemple de personnes
const initialNodes = [
  {
    id: "1",
    position: { x: 250, y: 0 },
    data: { label: "👤 Jean Dupont" },
  },
  {
    id: "2",
    position: { x: 100, y: 150 },
    data: { label: "👤 Marie Dupont" },
  },
  {
    id: "3",
    position: { x: 400, y: 150 },
    data: { label: "👤 Paul Dupont" },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", label: "Parent" },
  { id: "e1-3", source: "1", target: "3", label: "Parent" },
];

export default function FamilyTree() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [projects, setProjects] = useState([]);
  const { user, initAuth, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projectSelected, setProjectSelected] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, node: null });
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [currentEdge, setCurrentEdge] = useState(null);
  const [currentPerson, setCurrentPerson] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState();

  const onConnect = useCallback(
    (connection) => {
      // edge avec un label par défaut
      const newEdge = {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        label: RELATIONTYPE[0],
      };

      setEdges((eds) => addEdge(newEdge, eds));

      // Ouvrir le modal pour personnaliser
      setCurrentEdge(newEdge);
      setSelectedLabel(RELATIONTYPE[0]);
      setLabelModalOpen(true);
    },
    [setEdges]
  );

  // ouvrir le menu au clic sur un node
  const onNodeClick = useCallback(
    (event, node) => {
      // console.log("Click node ");
      event.stopPropagation(); // éviter de fermer directement
      if (user && !user.readOnly) {
        setMenu({ visible: true, x: event.clientX, y: event.clientY, node });
      }
    },
    [user]
  );

  const onNodesDelete = async () => {
    const res = await deletePerson(menu.node.id);

    if (res.isSuccess) {
      setNodes((nds) => nds.filter((n) => n.id !== menu.node.id));
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== menu.node.id && e.target !== menu.node.id
        )
      );
      setMenu({ ...menu, visible: false });
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleUpdatePerson = async () => {
    const res = await getSinglePerson(menu.node.id);
    if (res) {
      setCurrentPerson(res);
      setOpenModal(true);
    }
  };

  const handleEdgeDelete = () => {
    setEdges((edge) => edge.filter((n) => n.id !== currentEdge.id));
    setLabelModalOpen(false);
  };

  const onEdgeClick = (event, edge) => {
    event.stopPropagation();
    if (user && !user.readOnly) {
      setCurrentEdge(edge);
      setSelectedLabel(edge.label);
      setLabelModalOpen(true);
    }
  };

  // Confirmer le label choisi
  const handleConfirm = () => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === currentEdge.id ? { ...edge, label: selectedLabel } : edge
      )
    );
    setLabelModalOpen(false);
  };

  const onProjectSelected = (project) => {
    setProjectSelected(project);
    GetAllPerson(project.id);
    GetAllRelation(project.id);
  };

  const handleSaveModif = async () => {
    setLoading(true);
    var isDone = true;
    // Person Position update
    nodes.forEach(async (node) => {
      const res = await updatePersonPosition(
        node.id,
        node.position.x,
        node.position.y
      );
      if (!res.isSuccess) {
        isDone = false;
      }
    });

    // Relation update
    const res = await updateRelation(
      projectSelected.id,
      edges.map((edge) => ({
        projectId: projectSelected.id,
        parentId: edge.source,
        childId: edge.target,
        relationshipType: edge.label,
      }))
    );

    if (isDone && res.isSuccess) {
      toast.success("Sauvegarde effectuée.");
      GetAllPerson(projectSelected.id);
      GetAllRelation(projectSelected.id);
    } else {
      toast.error("Sauvegarde échouée.");
    }

    setLoading(false);
  };

  const GetAllProject = async () => {
    const res = await getAllProjectById(user.id);
    setProjects(res.data);
    if (res.data.length > 0) {
      setProjectSelected(res.data[0]);
      GetAllPerson(res.data[0].id);
      GetAllRelation(res.data[0].id);
    }
    setLoading(false);
  };

  const GetAllPerson = async (projectId) => {
    setNodes([]);
    const res = await getAllPersonByProject(projectId);
    if (res.data.length > 0) {
      const nodes = res.data.map((p, index) => ({
        id: p.id,
        type: "customNode",
        position: { x: p.positionX + index, y: p.positionY },
        data: {
          label: `${p.lastName} ${p.firstName}`,
          image: p.image,
          gender: p.gender,
        },
      }));

      setNodes(nodes);
    }
    setLoading(false);
  };

  const GetAllRelation = async (projectId) => {
    setEdges([]);
    const res = await getAllRelation(projectId);
    if (res.length > 0) {
      const edges = res.map((r) => ({
        id: r.id,
        source: r.parentId,
        target: r.childId,
        label: r.relationshipType,
      }));

      setEdges(edges);
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth(router);
  }, []);

  useEffect(() => {
    if (user && user.role === Role.USER) {
      GetAllProject();
    } else if (user && user.role === Role.ADMIN) {
      logout(router);
    }
  }, [user]);

  // fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = () => {
      if (menu.visible) {
        setMenu({ ...menu, visible: false });
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menu]);

  /// View
  if (loading) {
    return <Loading title="Chargement" />;
  }

  return (
    <div className="flex flex-col h-[85vh]">
      {/* Modal */}
      <CreatePersonModal
        open={openModal}
        setOpen={setOpenModal}
        projectId={projectSelected?.id}
        personCount={nodes.length}
        person={currentPerson}
        action={() => GetAllPerson(projectSelected?.id)}
      />

      <div className="md:flex items-center justify-between">
        {/* header */}
        <div className="h-fit py-5 px-10">
          {projects.length === 0 ? (
            <p className="flex justify-center text-white text-center">
              Pas de projet disponible ! Veuillez en créer pour définir son
              arbre
            </p>
          ) : (
            <div className="flex space-x-10 overflow-x-auto py-2">
              {projects.map((project) => (
                <Button
                  key={project.id}
                  onClick={() => onProjectSelected(project)}
                  className={`p-7 shadow-md rounded-xl border hover:shadow-lg hover:text-white transition cursor-pointer
              ${
                project.id === projectSelected.id
                  ? "bg-primary text-white"
                  : "bg-white text-black"
              }`}
                >
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                </Button>
              ))}
            </div>
          )}
        </div>

        {projects.length > 0 && user && !user.readOnly ? (
          <div className="flex items-center justify-center space-x-5 mx-2">
            {/* Ajouter une personne */}
            <Button
              onClick={() => {
                setOpenModal(true), setCurrentPerson(null);
              }}
              className="bg-red-800 p-2 cursor-pointer hover:bg-red-700"
            >
              <Plus /> Ajouter
            </Button>

            {/* Enrégistrement */}
            <Button
              onClick={() => handleSaveModif()}
              className="bg-green-800 p-2 cursor-pointer hover:bg-green-700"
            >
              <Save /> Enrégistrer
            </Button>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      {/* Schema */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        panOnScroll={true}
        panOnDrag={true} // nécessaire pour mobiles
        zoomOnPinch={true} // zoom tactile
        zoomOnScroll={false}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        deleteKeyCode={null}
      >
        {/* Mini map pour voir la vue globale */}
        <MiniMap />
        {/* Contrôles pour zoom/pan */}
        <Controls />
        {/* Fond quadrillé */}
        {/* <Background gap={16} color="#aaa" /> */}
      </ReactFlow>

      {/* Menu contextuel */}
      {menu.visible && (
        <div
          style={{
            position: "absolute",
            top: menu.y,
            left: menu.x,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "12px",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            minWidth: "160px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* header avec bouton croix */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "8px",
            }}
          >
            <button
              onClick={() => setMenu({ ...menu, visible: false })}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#6b7280",
              }}
            >
              ✕
            </button>
          </div>

          {/* Nom du node */}
          <p
            style={{
              fontWeight: "600",
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            {menu.node.data.label}
          </p>

          {/* Boutons */}
          <button
            onClick={() => handleUpdatePerson()}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "6px",
              border: "none",
              borderRadius: "6px",
              background: "#3b82f6",
              color: "white",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2563eb")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#3b82f6")}
          >
            Détails
          </button>

          <button
            onClick={onNodesDelete}
            style={{
              width: "100%",
              padding: "8px",
              border: "none",
              borderRadius: "6px",
              background: "#ef4444",
              color: "white",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#dc2626")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#ef4444")}
          >
            Supprimer
          </button>
        </div>
      )}

      {/* Modal de changement de label edge */}
      {labelModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setLabelModalOpen(false)} // clic dehors ferme le modal
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "12px" }}>Choisir un type de lien</h3>
            <select
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value)}
              className="w-full p-2 mb-5 rounded-md border border-gray-300"
            >
              {RELATIONTYPE.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              {/* Annuler */}
              <button
                onClick={() => setLabelModalOpen(false)}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "#f3f4f6",
                }}
              >
                Annuler
              </button>

              {/* Supprimer */}
              <button
                onClick={handleEdgeDelete}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "#FF0000",
                  color: "white",
                }}
              >
                Supprimer
              </button>

              {/* Confirmer */}
              <button
                onClick={handleConfirm}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "#3b82f6",
                  color: "white",
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
