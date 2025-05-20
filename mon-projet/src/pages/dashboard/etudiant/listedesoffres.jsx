import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Listedesoffres() {
  const [offres, setOffres] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [offresRes, favorisRes] = await Promise.all([
        axios.get('http://192.168.219.93:5000/api/auth/offres'),
        axios.get('http://192.168.219.93:5000/api/auth/favoris', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setOffres(offresRes.data);
      setFavoris(favorisRes.data.map(f => f.id_offre));
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavori = async (offre) => {
    try {
      const token = localStorage.getItem('token');
      const isFavori = favoris.includes(offre.id_offre);
      
      const response = await axios.post(
        'http://192.168.219.93:5000/api/auth/favoris/toggle',
        { offre_fav: offre.id_offre },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.action === 'added') {
        setFavoris([...favoris, offre.id_offre]);
        toast.success('Offre ajoutée aux favoris');
      } else {
        setFavoris(favoris.filter(id => id !== offre.id_offre));
        toast.success('Offre retirée des favoris');
      }
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#000041]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {offres.length > 0 ? (
        <div className="grid gap-6">
          {offres.map((offre) => (
            <div key={offre.id_offre} className="bg-white rounded-xl shadow-md p-6 relative">
              <Link 
                to={`/etudiant/offresdetails/${offre.id_offre}`}
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
              </Link>
              
              <button
                onClick={() => toggleFavori(offre)}
                className="absolute top-6 right-6"
              >
                <Heart
                  className={`w-6 h-6 ${favoris.includes(offre.id_offre) ? 'text-[#ff7b00] fill-[#ff7b00]' : 'text-gray-400'}`}
                />
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
  );
}