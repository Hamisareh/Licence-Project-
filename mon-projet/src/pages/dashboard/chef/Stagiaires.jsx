import React, { useState } from "react";

const stagiairesData = [
  {
    id: 1,
    nom: "Ahmed Ben Ali",
    domaine: "Informatique",
    etatStage: "En cours",
    evaluation: "Très bon stagiaire, ponctuel et motivé.",
    absences: 2,
    retards: 1,
    conventionPdf: "#",
    rapportPdf: "#",
  },
  {
    id: 2,
    nom: "Sofia Merabet",
    domaine: "Marketing",
    etatStage: "Terminé",
    evaluation: "Bonne intégration, mais manque un peu de rigueur.",
    absences: 0,
    retards: 0,
    conventionPdf: "#",
    rapportPdf: "#",
  },
  {
    id: 3,
    nom: "Karim Haddad",
    domaine: "Finance",
    etatStage: "Abandonné",
    evaluation: "Stage abandonné pour raisons personnelles.",
    absences: 5,
    retards: 3,
    conventionPdf: "#",
    rapportPdf: "#",
  },
];

export default function Stagiaires() {
  const [selectedStagiaire, setSelectedStagiaire] = useState(null);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Liste des Stagiaires</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-[#000041] text-white">
            <tr>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Domaine</th>
              <th className="px-6 py-3 text-left">État du stage</th>
              <th className="px-6 py-3 text-center">Convention</th>
              <th className="px-6 py-3 text-center">Rapport</th>
              <th className="px-6 py-3 text-center">Voir plus</th>
            </tr>
          </thead>

          <tbody>
            {stagiairesData.map((stagiaire) => (
              <tr
                key={stagiaire.id}
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              >
                <td className="px-6 py-4">{stagiaire.nom}</td>
                <td className="px-6 py-4">{stagiaire.domaine}</td>
                <td className="px-6 py-4">{stagiaire.etatStage}</td>
                <td className="px-6 py-4 text-center">
                  <a
                    href={stagiaire.conventionPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff7b00] hover:underline"
                  >
                    PDF
                  </a>
                </td>
                <td className="px-6 py-4 text-center">
                  <a
                    href={stagiaire.rapportPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff7b00] hover:underline"
                  >
                    PDF
                  </a>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setSelectedStagiaire(stagiaire)}
                    className="bg-[#000041] hover:bg-[#ff7b00] text-white px-3 py-1 rounded-md text-sm font-medium transition"
                  >
                    Voir plus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedStagiaire && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedStagiaire(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold mb-4 text-[#000041]">
              Détails de {selectedStagiaire.nom}
            </h3>
            <p className="mb-2">
              <strong>Évaluation entreprise :</strong> {selectedStagiaire.evaluation}
            </p>
            <p className="mb-2">
              <strong>Absences :</strong> {selectedStagiaire.absences}
            </p>
            <p className="mb-4">
              <strong>Retards :</strong> {selectedStagiaire.retards}
            </p>

            <button
              onClick={() => setSelectedStagiaire(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-[#ff7b00] font-bold text-xl"
              aria-label="Fermer"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
