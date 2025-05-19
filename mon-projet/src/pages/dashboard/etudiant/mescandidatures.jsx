import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const MesCandidatures = () => {
  const navigate = useNavigate();
  const [etatFiltre, setEtatFiltre] = useState('');
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api_URL = 'http://192.168.246.20:5000/api/auth';

  const fetchCandidatures = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await axios.get(`${api_URL}/candidatures`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Réponse API:', response.data); // Debug

      if (response.data.success) {
        setCandidatures(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || 'Impossible de charger les candidatures');
      setCandidatures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const annulerCandidature = async (idOffre) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${api_URL}/candidatures/${idOffre}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCandidatures(candidatures.filter(c => c.id !== idOffre));
      alert('Candidature annulée avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Échec de l\'annulation');
    }
  };

  const filteredCandidatures = candidatures.filter((c) => {
    const matchEtat = etatFiltre ? c.etat === etatFiltre : true;
    return matchEtat;
  });

  const handlePress = (item) => {
    navigate(`/etudiant/offresdetails/${item.id}`, { 
    state: { from: 'mescandidatures' } 
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
            onClick={fetchCandidatures}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['', 'en attente', 'accepte', 'refuse'].map((etat) => (
          <button
            key={etat}
            className={`px-4 py-2 rounded-full border border-gray-300 text-sm font-medium ${
              etat === etatFiltre 
                ? 'bg-secondary text-white border-secondary'
                : 'bg-white text-secondary hover:bg-gray-50 border-secondary'
            }`}
            onClick={() => setEtatFiltre(etat)}
          >
            {etat === '' 
              ? 'Tous' 
              : etat === 'en attente' 
                ? 'En attente' 
                : etat === 'accepte' 
                  ? 'Acceptée' 
                  : 'Refusée'}
          </button>
        ))}
      </div>

      {/* Liste des candidatures */}
      {filteredCandidatures.length > 0 ? (
        <div className="space-y-4">
          {filteredCandidatures.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handlePress(item)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-secondary">{item.titre}</h3>
                {item.etat === 'en attente' && (
                  <button 
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      annulerCandidature(item.id);
                    }}
                  >
                    <X size={18} color="#dc3545" />
                  </button>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1">Entreprise: {item.entreprise}</p>
              <p className="text-orange-500 text-sm mt-1">{item.details?.domaine}</p>
              <p className="text-gray-700 text-sm mt-1">Période: {item.details?.periode}</p>
              <span 
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  item.etat === 'en attente' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : item.etat === 'accepte' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {item.etat === 'en attente' 
                  ? 'En attente' 
                  : item.etat === 'accepte' 
                    ? 'Acceptée' 
                    : 'Refusée'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-lg">Aucune candidature trouvée</p>
          <button
            onClick={fetchCandidatures}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Actualiser
          </button>
        </div>
      )}
    </div>
  );
};

export default MesCandidatures;