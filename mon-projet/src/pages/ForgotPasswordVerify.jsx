import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordVerify = () => {
  const email = localStorage.getItem('resetEmail') || '';
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas.');
    }

    try {
      await axios.post('http://localhost:5000/api/auth/verify-reset-code', { email, code });

      await axios.post('http://localhost:5000/api/auth/set-new-password', {
        email,
        newPassword,
      });

      setSuccess('Mot de passe réinitialisé. Redirection...');
      localStorage.removeItem('resetEmail');
      setTimeout(() => navigate('/connexion'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Erreur de vérification');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/a (3).jpg')" }}>
      <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-bold underline text-center mb-6">Vérification & Nouveau mot de passe</h2>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4 text-center">{success}</p>}

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Code reçu par email</label>
            <div className="flex items-center border border-white rounded-md px-3 py-2 bg-white bg-opacity-10">
              <Mail className="w-4 h-4 mr-2" />
              <input
                type="text"
                placeholder="Entrez le code"
                className="bg-transparent outline-none w-full text-white placeholder-white"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Nouveau mot de passe</label>
            <div className="flex items-center border border-white rounded-md px-3 py-2 bg-white bg-opacity-10">
              <Lock className="w-4 h-4 mr-2" />
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                className="bg-transparent outline-none w-full text-white placeholder-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2">Confirmer le mot de passe</label>
            <div className="flex items-center border border-white rounded-md px-3 py-2 bg-white bg-opacity-10">
              <Lock className="w-4 h-4 mr-2" />
              <input
                type="password"
                placeholder="Confirmer"
                className="bg-transparent outline-none w-full text-white placeholder-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-orange-700 hover:bg-orange-800 text-white font-semibold py-2 rounded-md transition duration-300">
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordVerify;
