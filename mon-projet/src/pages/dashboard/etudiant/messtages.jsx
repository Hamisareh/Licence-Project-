import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const Messtages = () => {
  const navigate = useNavigate();
  const [etatFiltre, setEtatFiltre] = useState('');
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api_URL = 'http://192.168.219.93:5000/api/auth';

  const fetchStages = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await axios.get(`${api_URL}/etudiant/stages`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStages(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || 'Impossible de charger les stages');
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const filteredStages = stages.filter((stage) => {
    const matchEtat = etatFiltre ? stage.etat === etatFiltre : true;
    return matchEtat;
  });

  const getEtatColor = (etat) => {
    switch(etat) {
      case 'en cours': return 'bg-green-100 text-green-800';
      case 'terminé': return 'bg-gray-100 text-gray-800';
      case 'abandonné': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handlePress = (item) => {
    navigate(`/etudiant/offresdetails/${item.id}`, { 
      state: { 
        from: 'mes-stages',
        etat: item.etat
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Erreur: {error}</p>
          <button 
            onClick={fetchStages}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 ">
      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['', 'en cours', 'terminé', 'abandonné'].map((etat) => (
          <button
            key={etat}
            className={`px-4 py-2 rounded-full border border-gray-300 text-sm font-medium ${
              etat === etatFiltre 
                ? 'bg-secondary text-white border-secondary' 
                : 'bg-white text-secondary hover:bg-gray-50 border-secondary'
            }`}
            onClick={() => setEtatFiltre(etat)}
          >
            {etat === '' ? 'Tous' : etat}
          </button>
        ))}
      </div>

      {/* Liste des stages */}
      {filteredStages.length > 0 ? (
        <div className="space-y-4">
          {filteredStages.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handlePress(item)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-secondary">{item.titre}</h3>
              </div>
              <p className="text-gray-600 text-sm mt-1">Entreprise: {item.entreprise}</p>
              <p className="text-orange-500 text-sm mt-1">{item.domaine}</p>
              <p className="text-gray-700 text-sm mt-1">Période: {item.details?.periode}</p>
              <span 
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getEtatColor(item.etat)}`}
              >
                {item.etat.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-lg">Aucun stage trouvé</p>
          <button
            onClick={fetchStages}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Actualiser
          </button>
        </div>
      )}
    </div>
  );
};

export default Messtages;