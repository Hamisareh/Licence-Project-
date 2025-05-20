import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, Phone, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ApplyFormModal from './ApplyFormModal';

export default function Offresdetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const api_URL = 'http://192.168.219.93:5000/api/auth';
  const fileInputRef = useRef(null);

  const { from, etat } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offreRes, userRes] = await Promise.all([
          axios.get(`${api_URL}/offres/${id}`),
          fetchUserData()
        ]);
        
        if (offreRes.data) {
          setOffre(offreRes.data);
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des détails de l\'offre');
        navigate('/error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${api_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      return null;
    }
  };

  const selectFile = async () => {
    try {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } catch (err) {
      toast.error('Impossible de sélectionner le fichier');
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Type de fichier non supporté. Veuillez sélectionner un PDF ou DOCX');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 5MB)');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('rapport', file);
      formData.append('stageId', id);

      const response = await axios.post(`${api_URL}/rapport`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Rapport envoyé avec succès!');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error(error.response?.data?.message || 'Échec de l\'envoi du rapport');
    } finally {
      setUploading(false);
    }
  };

  const handleApplyPress = async () => {
    try {
      const user = await fetchUserData();
      if (!user) {
        toast.error('Vous devez être connecté pour postuler');
        return;
      }
      
      if (user.role !== 'etudiant') {
        toast.error('Seuls les étudiants peuvent postuler');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.get(`${api_URL}/candidatures/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.enStage) {
        toast.error('Vous êtes déjà en stage, vous ne pouvez pas postuler');
        return;
      }

      setShowApplyModal(true);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Échec de la vérification');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#000041]"></div>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Offre non trouvée</p>
        <button 
          onClick={() => navigate(-1)}
          className="ml-4 text-blue-600 hover:text-blue-800"
        >
          Retour
        </button>
      </div>
    );
  }

  const showApplyButton = from !== 'mes-stages' && from !== 'mes-candidatures';
  const showUploadButton = from === 'mes-stages' && etat === 'en cours';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Input file caché */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx"
        className="hidden"
      />
      
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="text-[#000041] w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-[#000041]">
          Détails {from === 'mes-stages' ? 'du stage' : 'de l\'offre'}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-[#000041]">{offre.titre}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="bg-[#ff7b00] bg-opacity-20 text-[#ff7b00] px-3 py-1 rounded-full text-sm font-medium">
            {offre.domaine}
          </span>
          {offre.entreprise_adr && (
            <span className="text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {offre.entreprise_adr}
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <InfoItem icon={<Clock />} label="Durée" value={`${offre.duree} mois`} />
          <InfoItem 
            icon={<Calendar />} 
            label="Période" 
            value={`${new Date(offre.date_debut).toLocaleDateString()} - ${new Date(offre.date_fin).toLocaleDateString()}`} 
          />
          <InfoItem icon={<Tag />} label="Entreprise" value={offre.entreprise_nom || 'Non spécifiée'} />
        </div>

        <Section title="Description" content={offre.descr} />
        <Section title="Missions" content={offre.missions} />
        <Section title="Compétences requises" content={offre.competencesRequises} />

        {offre.entreprise_email && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-[#000041] mb-4">Contact</h3>
            <ContactItem 
              icon={<Mail />} 
              type="email" 
              value={offre.entreprise_email} 
            />
            {offre.entreprise_tel && (
              <ContactItem 
                icon={<Phone />} 
                type="tel" 
                value={offre.entreprise_tel} 
              />
            )}
          </div>
        )}

        {showUploadButton && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-[#000041] mb-4">Envoyer un rapport</h3>
            <div className="space-y-4">
              <button
                onClick={selectFile}
                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between transition-colors"
              >
                <span className="truncate max-w-xs">
                  {file ? file.name : 'Sélectionner un fichier (PDF/DOCX)'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>
              
              {file && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={uploadFile}
                    disabled={uploading}
                    className={`flex-1 p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 flex items-center justify-center transition-colors ${
                      uploading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : 'Envoyer le rapport'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showApplyButton && (
        <div className="sticky bottom-6 mt-6">
          <button
            onClick={handleApplyPress}
            className="w-full bg-[#000041] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#000041]/90 transition-colors shadow-lg"
          >
            Postuler à cette offre
          </button>
        </div>
      )}

      {showApplyModal && (
        <ApplyFormModal
          offre={offre}
          userData={userData}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            toast.success('Candidature envoyée avec succès!');
            navigate('/etudiant/mes-candidatures');
          }}
        />
      )}
    </div>
  );
}

// Composants internes
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center">
      <div className="bg-[#000041] bg-opacity-10 p-2 rounded-lg mr-3">
        {React.cloneElement(icon, { className: "text-[#000041] w-5 h-5" })}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, content }) {
  if (!content) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#000041] mb-2">{title}</h3>
      <p className="text-gray-700 whitespace-pre-line">{content}</p>
    </div>
  );
}

function ContactItem({ icon, type, value }) {
  const linkProps = {
    email: { href: `mailto:${value}` },
    tel: { href: `tel:${value}` }
  };

  return (
    <div className="flex items-center mb-2">
      {React.cloneElement(icon, { className: "text-[#ff7b00] w-5 h-5 mr-2" })}
      <a {...linkProps[type]} className="text-gray-700 hover:text-[#000041]">
        {value}
      </a>
    </div>
  );
}