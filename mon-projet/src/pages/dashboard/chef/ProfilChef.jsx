import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '/api/config';
import { toast } from 'react-toastify';
import { Loader2, Save } from 'lucide-react';

const ProfilChef = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    universite: '',
    departement: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Récupérer les infos utilisateur
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data.user);
      } catch (err) {
        toast.error("❌ Échec de la récupération du profil");
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
      await axios.put(`${API_URL}/api/auth/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Profil mis à jour avec succès");
    } catch (err) {
      toast.error("❌ Erreur lors de la mise à jour");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold text-[#000041] mb-6">Mon Profil</h1>
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-600" /></div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Université</label>
              <input
                type="text"
                name="universite"
                value={formData.universite || ''}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Département</label>
              <input
                type="text"
                name="departement"
                value={formData.departement || ''}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                <Loader2 className="animate-spin h-5 w-5" /> Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" /> Enregistrer les modifications
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilChef;
