import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '/api/config';
import { toast } from 'react-toastify';
import { Loader2, Save, UserCircle, Mail, University } from 'lucide-react';

const ProfilAdmin = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    universite: '', // Seul champ spécifique nécessaire
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setFormData({
          nom: res.data.user.nom,
          prenom: res.data.user.prenom,
          email: res.data.user.email,
          universite: res.data.user.universite || '', // Récupère uniquement l'université
        });
      } catch (err) {
        toast.error("Erreur lors du chargement du profil");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/api/auth/me`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Échec de la mise à jour");
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || "Erreur lors de la mise à jour");
  } finally {
    setSaving(false);
  }
};
  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold text-[#000041] mb-6">Profil Administrateur</h1>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-gray-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Champ Nom */}
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#000041]"
                required
              />
            </div>

            {/* Champ Prénom */}
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#000041]"
                required
              />
            </div>

            {/* Champ Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#000041]"
                required
              />
            </div>

            {/* Champ Université seulement */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <University size={16} /> Université
              </label>
              <input
                type="text"
                name="universite"
                value={formData.universite}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#000041]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#000041] text-white px-4 py-2 rounded-lg hover:bg-[#000041]/90 transition"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Sauvegarder
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilAdmin;