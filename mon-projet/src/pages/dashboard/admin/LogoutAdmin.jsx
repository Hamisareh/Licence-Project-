import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from 'react-toastify';

function LogoutAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      const result = await Swal.fire({
        title: 'Déconnexion',
        text: "Voulez-vous vraiment vous déconnecter ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        reverseButtons: true,
        width: 380,
        padding: '1.5rem',
        background: '#fff',
        color: '#000',
        confirmButtonColor: '#ff7b00',
        cancelButtonColor: '#ccc',
        customClass: {
          popup: 'rounded-xl shadow',
          title: 'text-lg font-semibold',
          confirmButton: 'text-sm px-4 py-2',
          cancelButton: 'text-sm px-4 py-2',
        },
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await axios.post('http://192.168.90.20:5000/api/auth/logout', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          localStorage.removeItem('token');
          toast.success('Déconnecté avec succès');
          navigate('/');
        } catch (error) {
          console.error('Erreur logout :', error);
          toast.error('Erreur de déconnexion');
        }
      } else {
        navigate(-1);
      }
    };

    logout();
  }, [navigate]);

  return null;
}

export default LogoutAdmin;