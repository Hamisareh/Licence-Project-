import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '/api/config';
import { toast } from 'react-toastify';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileEtudiant = () => {
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

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    universite: '',
    specialite: '',
    niveau: '',
    departement: '',
    matricule: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

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
          universite: res.data.user.universite || '',
          specialite: res.data.user.specialite || '',
          niveau: res.data.user.niveau || '',
          departement: res.data.user.departement || '',
          matricule: res.data.user.matricule || ''
        });
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
      <div className="flex items-center gap-4 mb-6">
    
        <h1 className="text-2xl font-bold text-[#000041]">Mes informations</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-gray-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-lg font-semibold text-[#000041] mb-4 pb-2 border-b border-gray-200">
              Informations Personnelles
            </h2>
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
                <label className="text-sm font-medium">Matricule</label>
                <input
                  type="text"
                  name="matricule"
                  value={formData.matricule || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-lg font-semibold text-[#000041] mb-4 pb-2 border-b border-gray-200">
              Informations Académiques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <select
                  name="departement"
                  value={formData.departement || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="">Sélectionnez un département</option>
                  {departements.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Spécialité</label>
                <input
                  type="text"
                  name="specialite"
                  value={formData.specialite || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Niveau</label>
                <select
                  name="niveau"
                  value={formData.niveau || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="">Sélectionnez un niveau</option>
                  {niveaux.map((niv) => (
                    <option key={niv} value={niv}>{niv}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-[#000041] text-white px-4 py-3 rounded-lg hover:bg-[#000041]/90 transition w-full"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" /> Sauvegarde en cours...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" /> Mettre à jour le profil
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileEtudiant;