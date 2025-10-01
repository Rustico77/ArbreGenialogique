"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { getAllProject } from "../actions/projectActions";
import { getAllPerson } from "../actions/personActions";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, initAuth } = useAuthStore();
  const router = useRouter();

  const fetchData = async (userId) => {
      setLoading(true);
      const projRes = await getAllProject(userId);
      setProjects(projRes.data || []);
      const persRes = await getAllPerson(userId);
      setPersons(persRes.data || []);
      setLoading(false);
    };

  useEffect(() => {
      initAuth(router);
    }, []);

  useEffect(() => {
    if(user){
      fetchData(user.id);
    }
  }, [user]);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-white text-2xl font-bold mb-6">Tableau de bord</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        {/* Projet créés */}
        <div onClick={() => router.push("/project")} className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition cursor-pointer">
          <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
          <div className="text-gray-500 mt-2">Projets créés</div>
        </div>

        {/* Personnes créées */}
        <div onClick={() => router.push("/familyTree")} className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition cursor-pointer">
          <div className="text-3xl font-bold text-green-600">{persons.length}</div>
          <div className="text-gray-500 mt-2">Personnes créées</div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre de personnes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  Chargement...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400">
                  Aucun projet trouvé
                </td>
              </tr>
            ) : (
              projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-gray-50 transition cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {proj.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {proj.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {proj._count.persons || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
