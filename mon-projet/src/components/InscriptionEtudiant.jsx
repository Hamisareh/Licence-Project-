import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, Building2, BookOpen, Layers3, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api/config';

const InscriptionEtudiant = () => {
  const navigate = useNavigate();

  const [universite, setUniversite] = useState('');
  const [departement, setDepartement] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [niveau, setNiveau] = useState('');
  const [matricule, setMatricule] = useState('');
  const [error, setError] = useState('');

  const departements = [
    'Informatique',
    'Mathematiques',
    'Physique',
    'Agronomie',
    'SNV',
    'Biologie',
    'STAPS',
    'Chimie'
  ];

  const niveaux = ['L1', 'L2', 'L3', 'M1', 'M2'];

  const handleSubmit = async () => {
    if (!universite || !departement || !specialite || !niveau || !matricule) {
      return setError('Veuillez remplir tous les champs.');
    }
  
    const infosGenerales = JSON.parse(localStorage.getItem('infosGenerales'));
    if (!infosGenerales) {
      return setError("Session expirée. Veuillez recommencer.");
    }
  
    try {
      // Envoi de TOUTES les données en une seule requête
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        ...infosGenerales, // nom, prenom, email, mdps
        universite,
        departement,
        specialite,
        niveau,
        matricule,
        role: 'etudiant' // Explicitement défini
      });
  
      localStorage.removeItem('infosGenerales');
      navigate('/connexion', { 
        state: { success: 'Inscription réussie!' }
      });
  
    } catch (err) {
      console.error("Erreur:", err.response?.data);
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/assets/a (3).jpg')" }}
    >
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-md w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold text-center underline mb-6">Inscription - Étudiant</h2>

        <div className="space-y-4">
           <Input icon={<Hash />} placeholder="Matricule" value={matricule} onChange={e => setMatricule(e.target.value)} />
          <Input icon={<GraduationCap />} placeholder="Université" value={universite} onChange={e => setUniversite(e.target.value)} />
          
          <div className="flex items-center bg-white text-black px-4 py-2 rounded-md">
            <div className="mr-2"><Building2 /></div>
            <select
              value={departement}
              onChange={e => setDepartement(e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            >
              <option value="">Département</option>
              {departements.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center bg-white text-black px-4 py-2 rounded-md">
            <div className="mr-2"><Layers3 /></div>
            <select
              value={niveau}
              onChange={e => setNiveau(e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            >
              <option value="">Niveau</option>
              {niveaux.map(niv => (
                <option key={niv} value={niv}>{niv}</option>
              ))}
            </select>
          </div>
 <Input icon={<BookOpen />} placeholder="Spécialité" value={specialite} onChange={e => setSpecialite(e.target.value)} />
         
        </div>

        {error && <p className="text-red-300 text-sm text-center mt-2">{error}</p>}

        <button onClick={handleSubmit} className="mt-6 w-full bg-orange-700 text-white py-2 rounded-md hover:bg-orange-800 transition">
          Valider
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

const Input = ({ icon, ...props }) => (
  <div className="flex items-center bg-white text-black px-4 py-2 rounded-md">
    <div className="mr-2">{icon}</div>
    <input {...props} className="bg-transparent w-full focus:outline-none" />
  </div>
);

export default InscriptionEtudiant;