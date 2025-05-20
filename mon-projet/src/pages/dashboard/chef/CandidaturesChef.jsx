// Assurez-vous d'avoir ces imports
import { useState, useEffect } from "react";
import axios from "axios";
import OffreModal from "../../../components/OffreModal";
import ShowConventionModal from "../../../components/showConventionModal";

const CandidaturesChef = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
 const [showConventionModal, setShowConventionModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  // Fonction pour charger les candidatures
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://192.168.219.93:5000/api/auth/candidatures/chef",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCandidatures(res.data.data || []);
    } catch (error) {
      console.error("Erreur chargement candidatures:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fonction pour ouvrir la modal d'offre
const openModalWithOffre = (candidature) => {
  const offreFormatee = {
    ...candidature,
    // Infos entreprise
    nom_entreprise: candidature.entreprise_nom || "Non spécifié",
    email_entreprise: candidature.entreprise_email || "Non spécifié",
    secteur_entreprise: candidature.entreprise_secteur || "Non spécifié",
    tel_entreprise: candidature.entreprise_tel || "Non spécifié",
    adr_entreprise: candidature.entreprise_adr || "Non spécifié",
    
    // Infos offre
    titre: candidature.titre,
    domaine: candidature.domaine,
    duree: candidature.duree || "Non spécifiée",
    date_debut: candidature.date_debut,
    date_fin: candidature.date_fin,
    missions: candidature.missions,
    descr: candidature.descr,
    competencesRequises: candidature.competencesRequises
  };
  
  setSelectedOffre(offreFormatee);
  setModalOpen(true);
};

  // Fonction pour uploader la convention
 const handleUploadConvention = async (file) => {
  try {
    const formData = new FormData();
    formData.append("convention", file);
    formData.append("candidatId", selectedCandidate.candidat.toString());
    formData.append("offreId", selectedCandidate.offre.toString());

    const response = await axios.post(
      "http://192.168.219.93:5000/api/auth/conventions/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000
      }
    );

    if (response.data.success) {
      alert("Convention envoyée avec succès !");
      await fetchData();
      setShowConventionModal(false);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Erreur:", error.response?.data || error);
    alert(`Erreur: ${error.response?.data?.message || error.message}`);
  }
}; 
return( 
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#000041]">📥 Candidatures des étudiants</h1>
      
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-600 border-b">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Matricule</th>
              <th className="px-4 py-2">Titre de l'offre</th>
              <th className="px-4 py-2">État</th>
              <th className="px-4 py-2">Convention</th>
            </tr>
          </thead>
          <tbody>
            {candidatures.map((candidature, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{candidature.nom} {candidature.prenom}</td>
                <td className="px-4 py-2">{candidature.matricule}</td>
                <td
                  className="px-4 py-2 text-[#ff7b00] hover:underline cursor-pointer"
                  onClick={() => openModalWithOffre(candidature)}
                >
                  {candidature.titre}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    candidature.etat_cand === 'accepté' ? 'bg-green-100 text-green-800' :
                    candidature.etat_cand === 'refusé' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {candidature.etat_cand}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {/* Afficher l'icône PDF seulement si le stage n'a pas encore de convention */}
                  {!candidature.etat_sta && (
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidature);
                        setShowConventionModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-xl"
                      title="Uploader une convention"
                    >
                      📄
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal pour les détails de l'offre */}
      <OffreModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        offre={selectedOffre}
      />

      {/* Modal pour uploader la convention */}
      <ShowConventionModal
  isOpen={showConventionModal} // ← utilisez la variable d'état renommée
  onClose={() => setShowConventionModal(false)}
  onUpload={handleUploadConvention}
/>
    </div>
  );
};

export default CandidaturesChef;