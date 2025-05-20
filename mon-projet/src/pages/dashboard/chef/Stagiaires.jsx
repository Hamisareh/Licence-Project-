import React, { useState, useEffect } from "react";
import axios from "axios";
import OffreModal from "../../../components/OffreModal";

export default function Stagiaires() {
  const [stagiaires, setStagiaires] = useState([]);
  const [selectedStagiaire, setSelectedStagiaire] = useState(null);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

useEffect(() => {
  const fetchStagiaires = async () => {
    try {
      const response = await axios.get(
        "http://192.168.90.20:5000/api/auth/stagiaires/chef", 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      console.log("Réponse API:", response.data); // Debug
      
      if (response.data.success) {
        setStagiaires(response.data.data);
      } else {
        console.error("Erreur dans la réponse:", response.data.message);
      }
    } catch (error) {
      console.error("Erreur API:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
  };

  fetchStagiaires();
}, []);
  const openModalWithOffre = (stagiaire) => {
  setSelectedOffre({
    titre: stagiaire.titre,
    domaine: stagiaire.domaine,
    duree: stagiaire.duree,
    date_debut: stagiaire.date_debut,
    date_fin: stagiaire.date_fin,
    missions: stagiaire.missions,
    competencesRequises: stagiaire.competencesRequises,
    nom_entreprise: stagiaire.entreprise_nom || "Non spécifié",
    email_entreprise: stagiaire.entreprise_email || "Non spécifié",
    tel_entreprise: stagiaire.entreprise_tel || "Non spécifié",
    secteur_entreprise: stagiaire.entreprise_secteur || "Non spécifié",
    adr_entreprise: stagiaire.entreprise_adr || "Non spécifié"
  });
  setModalOpen(true);
};

// Mettre à jour la fonction handleShowDetails
const handleShowDetails = (stagiaire) => {
  setSelectedStagiaire({
    nom: stagiaire.nom,
    prenom: stagiaire.prenom,
    matricule: stagiaire.matricule,
    evaluation: stagiaire.evaluation,
    chemin_convention: stagiaire.chemin_convention,
    chemin_rapport: stagiaire.chemin_rapport
  });
};

  const getEtatStageStyle = (etat) => {
    switch (etat) {
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "terminé":
        return "bg-green-100 text-green-800";
      case "abandonné":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#000041]">👨‍🎓 Liste des Stagiaires</h1>
      
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-600 border-b">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Matricule</th>
              <th className="px-4 py-2">Titre de l'offre</th>
              <th className="px-4 py-2">État du stage</th>
              <th className="px-4 py-2">Rapport</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stagiaires.map((stagiaire, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{stagiaire.nom} {stagiaire.prenom}</td>
                <td className="px-4 py-2">{stagiaire.matricule}</td>
                <td
                  className="px-4 py-2 text-[#ff7b00] hover:underline cursor-pointer"
                  onClick={() => openModalWithOffre(stagiaire)}
                >
                  {stagiaire.titre}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getEtatStageStyle(stagiaire.etat_sta)}`}>
                    {stagiaire.etat_sta}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
  {stagiaire.chemin_rapport ? (
    <a
      href={`http://localhost:5000${stagiaire.chemin_rapport}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:text-blue-700"
    >
      📄
    </a>
  ) : (
    <span className="text-gray-400">Non disponible</span>
  )}
</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => setSelectedStagiaire(stagiaire)}
                    className="bg-[#000041] text-white px-3 py-1 rounded text-sm hover:bg-[#1a1a66]"
                  >
                    Voir plus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal détails stagiaire */}
     {selectedStagiaire && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
      <h3 className="text-2xl font-bold text-[#000041] mb-4">
        Détails de {selectedStagiaire.nom} {selectedStagiaire.prenom}
      </h3>
      
      <div className="space-y-6">
        {/* Section Évaluation */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg text-[#ff7b00] mb-3">
            Évaluation de l'entreprise
          </h4>
          
          {selectedStagiaire?.evaluation ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-medium">Comportement:</p>
                  <p className="font-semibold">
                    {selectedStagiaire.evaluation.note_comport || 'N/A'}/5
                  </p>
                </div>
                <div>
                  <p className="font-medium">Adaptabilité:</p>
                  <p className="font-semibold">
                    {selectedStagiaire.evaluation.note_adapt || 'N/A'}/5
                  </p>
                </div>
                <div>
                  <p className="font-medium">Travail d'équipe:</p>
                  <p className="font-semibold">
                    {selectedStagiaire.evaluation.note_esprit_equipe || 'N/A'}/5
                  </p>
                </div>
                <div>
                  <p className="font-medium">Qualité du travail:</p>
                  <p className="font-semibold">
                    {selectedStagiaire.evaluation.note_qual_trav || 'N/A'}/5
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Absences totales:</p>
                  <p>{selectedStagiaire.evaluation.nb_absences || 0}</p>
                </div>
                <div>
                  <p className="font-medium">Absences justifiées:</p>
                  <p>{selectedStagiaire.evaluation.nb_justification || 0}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="font-medium">Commentaire:</p>
                <p className="italic bg-white p-2 rounded border border-gray-200">
                  {selectedStagiaire.evaluation.commentaire || "Aucun commentaire"}
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucune évaluation disponible pour ce stagiaire
            </p>
          )}
        </div>

        {/* Section Documents */}
        <div>
          <h4 className="font-semibold text-lg text-[#ff7b00] mb-3">
            Documents
          </h4>
          <div className="flex space-x-4">
            <div className="flex-1 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">Convention de stage:</p>
              {selectedStagiaire.chemin_convention ? (
                <a
                  href={`http://localhost:5000${selectedStagiaire.chemin_convention}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center mt-1"
                >
                  <span className="mr-2">📄</span> Voir le document
                </a>
              ) : (
                <p className="text-gray-500">Non disponible</p>
              )}
            </div>
            <div className="flex-1 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">Rapport de stage:</p>
              {selectedStagiaire.chemin_rapport ? (
                <a
                  href={`http://localhost:5000${selectedStagiaire.chemin_rapport}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center mt-1"
                >
                  <span className="mr-2">📄</span> Voir le document
                </a>
              ) : (
                <p className="text-gray-500">Non disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setSelectedStagiaire(null)}
          className="px-4 py-2 bg-[#000041] text-white rounded-lg hover:bg-[#1a1a66] transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}
      {/* Modal détails offre */}
      <OffreModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        offre={selectedOffre}
      />
    </div>
  );
}