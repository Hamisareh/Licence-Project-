import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Briefcase } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../api/config';  // Remonte deux niveaux

const InscriptionEntreprise = () => {
  const navigate = useNavigate();

  // Champs entreprise
  const [adr, setAdr] = useState('');
  const [tel, setTel] = useState('');
  const [secteur, setSecteur] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleSubmit = async () => {
    setErreur('');
    setLoading(true);
  
    try {
      const infos = JSON.parse(localStorage.getItem('infosGenerales'));
      if (!infos) {
        throw new Error('Session expirée. Veuillez recommencer.');
      }
  
      // Envoi COMPLET des données
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        ...infos, // infos de l'étape 1
        adr,
        tel,
        secteur
      });
  
      localStorage.removeItem('infosGenerales');
      navigate('/connexion', { state: { success: 'Inscription réussie!' } });
      
    } catch (err) {
      setErreur(err.response?.data?.error || err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/assets/a (3).jpg')" }}
    >
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-md w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold text-center underline mb-6">
          Inscription - Entreprise
        </h2>

        {erreur && <div className="text-red-300 text-sm mb-4 text-center">{erreur}</div>}

        <div className="space-y-4">
          <div className="flex items-center bg-white text-black px-4 py-2 rounded-md">
            <MapPin className="mr-2" />
            <input
              type="text"
              placeholder="Adresse"
              className="bg-transparent w-full focus:outline-none"
              value={adr}
              onChange={(e) => setAdr(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-white text-black px-4 py-2 rounded-md">
            <Phone className="mr-2" />
            <input
              type="text"
              placeholder="Numéro"
              className="bg-transparent w-full focus:outline-none"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-white text-black px-4 py-2 rounded-md">
            <Briefcase className="mr-2" />
            <input
              type="text"
              placeholder="Secteur"
              className="bg-transparent w-full focus:outline-none"
              value={secteur}
              onChange={(e) => setSecteur(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-orange-700 text-white py-2 rounded-md hover:bg-orange-800 transition disabled:opacity-50"
        >
          {loading ? 'Envoi...' : 'Valider'}
        </button>

        <p
          onClick={() => navigate('/inscription')}
          className="mt-4 text-sm text-center underline cursor-pointer hover:text-orange-300"
        >
          Retour à l'étape précédente
        </p>
      </div>
    </div>
  );
};

export default InscriptionEntreprise;
