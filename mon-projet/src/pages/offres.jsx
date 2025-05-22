import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

export default function Offre() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offresRes = await axios.get('http://192.168.90.20:5000/api/auth/offres');
        setOffres(offresRes.data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des offres');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFavoriClick = () => {
    toast.info('Vous devez vous connecter pour ajouter aux favoris');
    navigate('/connexion');
  };

  const handleOffreClick = (id) => {
    navigate(`/details/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#000041]"></div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#000041] mb-8">Trouvez le stage parfait pour booster votre carrière</h1>
        
        {offres.length > 0 ? (
          <div className="grid gap-6">
            {offres.map((offre) => (
              <div key={offre.id_offre} className="bg-white rounded-xl shadow-md p-6 relative hover:shadow-lg transition-shadow cursor-pointer">
                <div 
                  onClick={() => handleOffreClick(offre.id_offre)}
                  className="block"
                >
                  <h2 className="text-xl font-bold text-[#000041] mb-2">{offre.titre}</h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Entreprise:</span> {offre.entreprise_nom || 'Non spécifiée'}
                  </p>
                  <p className="text-[#ff7b00] mb-1">{offre.domaine}</p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Durée:</span> {offre.duree} mois
                  </p>
                </div>
                
                <button
                  onClick={handleFavoriClick}
                  className="absolute top-6 right-6"
                >
                  <Heart className="w-6 h-6 text-gray-400 hover:text-[#ff7b00]" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Aucune offre trouvée
          </div>
        )}
      </div>
    </div>
  );
}