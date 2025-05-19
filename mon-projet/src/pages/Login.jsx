import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mdps, setMdps] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, mdps });

      const { token, role } = res.data;

      // Stocker le token JWT localement
      localStorage.setItem('token', token);

      // Rediriger selon le rôle
      switch (role) {
        case 'etudiant':
          navigate('/etudiant');
          break;
        case 'entreprise':
          navigate('entreprise');
          break;
        case 'chef_dept':
          navigate('/chef');
          break;
        case 'admin':
          navigate('admin');
          break;
        default:
          navigate('/');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur de connexion");
    }
  };

  return (
    <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg w-full max-w-md text-white">
      <h2 className="text-2xl font-bold underline text-center mb-6">Connexion</h2>

      {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-sm mb-2">Email</label>
          <div className="flex items-center border border-white rounded-md px-3 py-2 bg-white bg-opacity-10 focus-within:ring-2 focus-within:ring-orange-500">
            <Mail className="w-4 h-4 mr-2" />
            <input
              type="email"
              placeholder="Entrez votre email"
              className="bg-transparent outline-none w-full text-white placeholder-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2">Mot de passe</label>
          <div className="flex items-center border border-white rounded-md px-3 py-2 bg-white bg-opacity-10 focus-within:ring-2 focus-within:ring-orange-500">
            <Lock className="w-4 h-4 mr-2" />
            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              className="bg-transparent outline-none w-full text-white placeholder-white"
              value={mdps}
              onChange={(e) => setMdps(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="w-full bg-orange-700 hover:bg-orange-800 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            Connexion
          </button>
        </div>
      </form>

      <p className="text-sm text-center mt-4">
        <Link to="/mot-de-passe-oublie" className="underline text-white hover:text-orange-300">
          Mot de passe oublié ?
        </Link>
      </p>

      <p className="text-sm text-center mt-6">
        Pas encore inscrit ?{' '}
        <Link to="/inscription" className="underline text-white hover:text-orange-300">
          Inscrivez-vous
        </Link>
      </p>
    </div>
  );
};

export default Login;