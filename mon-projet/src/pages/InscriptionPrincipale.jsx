import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Users } from 'lucide-react';
import { API_URL } from '../../api/config';

const InscriptionPrincipale = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mdps: '',
    role: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const { nom, prenom, email, mdps, role } = formData;
  
    if (!nom || !prenom || !email || !mdps || !role) {
      return setError('Veuillez remplir tous les champs.');
    }
  
    // Stockage des données générales ET récupération des données spécifiques si elles existent
    const etudiantData = localStorage.getItem('etudiantData');
    const entrepriseData = localStorage.getItem('entrepriseData');
    
    localStorage.setItem('infosGenerales', JSON.stringify({ 
      nom, 
      prenom, 
      email, 
      mdps, 
      role,
      etudiantData: etudiantData ? JSON.parse(etudiantData) : null,
      entrepriseData: entrepriseData ? JSON.parse(entrepriseData) : null
    }));
  
    // Redirection selon le rôle
    if (role === 'entreprise') {
      navigate('/inscription/entreprise');
    } else if (role === 'etudiant') {
      navigate('/inscription/etudiant');
    }
  };

  return (
    <div className="h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/assets/imagehero.jpg')" }}>
      <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg w-full max-w-md text-white">
        <h2 className="text-3xl font-bold underline text-center mb-6 text-white">Inscription</h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <InputWithIcon
              icon={<User />}
              placeholder="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
            />
            <InputWithIcon
              icon={<User />}
              placeholder="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
            />
          </div>
          <InputWithIcon
            icon={<Mail />}
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
          />
          <InputWithIcon
            icon={<Lock />}
            placeholder="Mot de passe"
            name="mdps"
            value={formData.mdps}
            onChange={handleChange}
            type="password"
          />
          <div className="flex items-center bg-white bg-opacity-80 rounded-md p-2 text-black">
            <div className="mr-2"><Users /></div>
            <select
              name="role"
              className="w-full p-2 rounded-md bg-white bg-opacity-80 focus:outline-none"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Sélectionnez un rôle</option>
              <option value="etudiant">Étudiant</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>

          {error && <p className="text-red-300 text-sm text-center">{error}</p>}

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md"
            >
              Annuler
            </button>
            <button
              onClick={handleNext}
              className="w-full bg-orange-700 hover:bg-orange-800 text-white py-2 rounded-md"
            >
              Suivant
            </button>
          </div>
        </div>

        <div className="text-center text-sm mt-4">
          <p>
            Déjà inscrit ?{' '}
            <a href="/connexion" className="underline text-white hover:text-orange-300">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputWithIcon = ({ icon, ...props }) => (
  <div className="flex items-center bg-white bg-opacity-80 rounded-md p-2 text-black">
    <div className="mr-2">{icon}</div>
    <input {...props} className="bg-transparent outline-none w-full" />
  </div>
);

export default InscriptionPrincipale;