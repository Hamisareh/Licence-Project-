import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const LogoutChef = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        localStorage.removeItem('token');
        toast.success('Déconnexion réussie');
        navigate('/connexion');
      } catch (err) {
        toast.error('Erreur lors de la déconnexion');
        navigate('/chef');
      }
    };
    
    logout();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-64">
      <p>Déconnexion en cours...</p>
    </div>
  );
};

export default LogoutChef;