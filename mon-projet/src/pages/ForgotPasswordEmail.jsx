import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5000/api/auth/send-reset-code', { email });
      localStorage.setItem('resetEmail', email); // Stocke pour l'étape suivante
      setSuccess('Code envoyé ! Redirection...');
      setTimeout(() => navigate('/verification-code'), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Erreur lors de l’envoi');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/a (3).jpg')" }}>
      <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg w-full max-w-md text-white">
        <h2 className="text-2xl font-bold underline text-center mb-6">Réinitialisation</h2>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4 text-center">{success}</p>}

        <form onSubmit={handleSendCode}>
          <div className="mb-6">
            <label className="block text-sm mb-2">Email</label>
            <div className="flex items-center border border-white rounded-md px-3 py-2 bg-white bg-opacity-10">
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

          <button type="submit" className="w-full bg-orange-700 hover:bg-orange-800 text-white font-semibold py-2 rounded-md transition duration-300">
            Envoyer le code
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
