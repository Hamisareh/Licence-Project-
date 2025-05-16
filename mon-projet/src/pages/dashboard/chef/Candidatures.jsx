import React, { useState } from "react";
import { FileText, Search } from "lucide-react";

const Candidatures = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Données fictives juste pour la démo UI
  const candidatures = [
    {
      id: 1,
      nomEtudiant: "Sara Boulahya",
      offre: "Développeur Web Frontend",
      etat: "En attente",
      convention: true,
      valide: false,
    },
    {
      id: 2,
      nomEtudiant: "Yassir Dahmani",
      offre: "Assistant RH",
      etat: "Acceptée",
      convention: true,
      valide: true,
    },
    {
      id: 3,
      nomEtudiant: "Nesrine Kherbouche",
      offre: "Stage Marketing",
      etat: "Refusée",
      convention: false,
      valide: false,
    },
  ];

  // Filtrage simple
  const filtered = candidatures.filter((item) =>
    item.nomEtudiant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#000041] mb-6">Candidatures</h2>

      {/* Barre de recherche */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#ff7b00]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg overflow-hidden shadow">
          <thead className="bg-[#000041] text-white text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Étudiant</th>
              <th className="px-4 py-3 text-left">Offre</th>
              <th className="px-4 py-3 text-left">État</th>
              <th className="px-4 py-3 text-center">Convention</th>
              <th className="px-4 py-3 text-center">Validée</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white text-sm">
            {filtered.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{c.nomEtudiant}</td>
                <td className="px-4 py-3">{c.offre}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.etat === "Acceptée"
                        ? "bg-green-100 text-green-600"
                        : c.etat === "Refusée"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {c.etat}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {c.convention ? "📄" : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {c.valide ? "✅" : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-[#ff7b00] hover:underline flex items-center gap-1 mx-auto">
                    <FileText size={16} />
                    Détails
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Aucune candidature trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Candidatures;
