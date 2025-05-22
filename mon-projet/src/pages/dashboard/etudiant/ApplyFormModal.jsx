import React, { useState, useEffect } from 'react';
import { FileText, X, Send } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ApplyFormModal({ offre, userData, onClose }) {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    niveau: '',
    departement: '',
    specialite: '',
    universite: '',
    email: '',
    cv: null,
  });
  const [loading, setLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    if (userData) {
      setFormData({
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        email: userData.email || '',
        universite: userData.universite || '',
        specialite: userData.specialite || '',
        niveau: userData.niveau || '',
        departement: userData.departement || '',
        matricule: userData.matricule || '',
        cv: null
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, cv: file });
    } else {
      toast.error('Veuillez sélectionner un fichier PDF');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cv) {
      toast.error('Veuillez sélectionner un CV');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== 'cv') formPayload.append(key, value);
      });

      formPayload.append('cv', formData.cv);
      formPayload.append('offre_id', offre.id_offre);

      const response = await axios.post('http://192.168.90.20:5000/api/auth/candidatures', formPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      toast.success('Votre candidature a été envoyée avec succès !');
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Échec de l\'envoi de la candidature');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#000041]">
              Postuler chez <span className="text-[#ff7b00]">{offre.entreprise_nom}</span>
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">{offre.titre}</p>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                   disabled 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#000041] focus:border-[#000041]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                   disabled 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#000041] focus:border-[#000041]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                   
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#000041] focus:border-[#000041]"
                  required
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
                <input
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleChange}
                   disabled 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#000041] focus:border-[#000041]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Université</label>
                <input
                  type="text"
                  name="universite"
                  value={formData.universite}
                  onChange={handleChange}
                   disabled 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#000041] focus:border-[#000041]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                <input
                  type="text"
                  name="departement"
                  value={formData.departement}
                  onChange={handleChange}
                   disabled 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#000041] focus:border-[#000041]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                <input
                  type="text"
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleChange}
                   disabled 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#000041] focus:border-[#000041]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <input
                  type="text"
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                   disabled 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#000041] focus:border-[#000041]"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CV (format PDF uniquement)
              </label>
              
              <div className="flex items-center">
                <label
                  htmlFor="cv-upload"
                  className="flex items-center justify-center px-4 py-2 border border-[#ff7b00] text-[#ff7b00] rounded-lg cursor-pointer hover:bg-[#ff7b00]/10 transition-colors"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  {formData.cv ? formData.cv.name : 'Sélectionner un fichier'}
                </label>
                <input
                  key={fileInputKey}
                  id="cv-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {formData.cv && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, cv: null });
                      setFileInputKey(Date.now());
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#000041] text-white py-3 px-6 rounded-lg font-bold hover:bg-[#000041]/90 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer ma candidature
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}