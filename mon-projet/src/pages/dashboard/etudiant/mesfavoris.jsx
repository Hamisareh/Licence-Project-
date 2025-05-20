import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MesFavoris = () => {
  const navigate = useNavigate();
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const api_URL = 'http://192.168.219.93:5000/api/auth';

  const fetchFavoris = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${api_URL}/favoris`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setFavoris(response.data);
      }
    } catch (err) {
      toast.error('Impossible de charger les favoris');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavori = async (offreId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${api_URL}/favoris/toggle`,
        { offre_fav: offreId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.action === 'removed') {
        setFavoris(favoris.filter(o => o.id_offre !== offreId));
        toast.success('Offre retirée des favoris');
      } else {
        toast.success('Offre ajoutée aux favoris');
      }
    } catch (err) {
      toast.error('Action impossible');
      console.error(err);
    }
  };

  const handlePress = (offreId) => {
    navigate(`/etudiant/offresdetails/${offreId}`);
  };

  useEffect(() => {
    fetchFavoris();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#000041]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 ">
      {/* En-tête */}
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-[#000041]">Mes favoris</h1>
      </div>

      {/* Liste des favoris */}
      {favoris.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Heart className="w-12 h-12 text-gray-300" strokeWidth={1} />
          <p className="mt-4 text-gray-500 text-lg">Aucun favori enregistré</p>
          <button
            onClick={() => navigate('/etudiant/listedoffres')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Parcourir les offres
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {favoris.map((item) => (
            <div 
              key={item.id_offre} 
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
            >
              <div 
                className="cursor-pointer"
                onClick={() => handlePress(item.id_offre)}
              >
                <h3 className="text-lg font-bold text-[#000041]">{item.titre}</h3>
                <p className="text-[#ff7b00] text-sm mt-1">{item.entreprise_nom}</p>
                <p className="text-gray-600 text-sm mt-1">
                  {item.domaine} • {item.duree} mois
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavori(item.id_offre);
                }}
                className="absolute top-4 right-4 p-2 text-[#ff7b00] hover:text-[#ff7b00]/80"
              >
                <Heart 
                  className="w-5 h-5" 
                  fill="#ff7b00" 
                  stroke="#ff7b00"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesFavoris;