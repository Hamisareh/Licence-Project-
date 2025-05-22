import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

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

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offreRes = await axios.get(`http://192.168.90.20:5000/api/auth/offres/${id}`);
        setOffre(offreRes.data);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des détails de l\'offre');
        navigate('/offres');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleApplyPress = () => {
    toast.info('Vous devez vous connecter pour postuler à cette offre');
    navigate('/connexion');
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
          onClick={() => navigate('/offres')}
          className="ml-4 text-blue-600 hover:text-blue-800"
        >
          Retour aux offres
        </button>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/offres')} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="text-[#000041] w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-[#000041]">
            Détails de l'offre
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
        </div>

        <div className="sticky bottom-6 mt-6">
          <button
            onClick={handleApplyPress}
            className="w-full bg-[#000041] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#000041]/90 transition-colors shadow-lg"
          >
            Postuler à cette offre
          </button>
        </div>
      </div>
    </div>
  );
}