import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Trash2, Edit } from 'lucide-react';

const GestionChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChef, setEditingChef] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
  nom: '',
  prenom: '',
  email: '',
  departement: '',
  universite: 'UMBB' // Valeur par défaut
});

  useEffect(() => {
    const fetchChefs = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/auth/admin/chefs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setChefs(res.data.chefs);
  } catch (err) {
    toast.error('Erreur lors du chargement des chefs');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

    fetchChefs();
  }, []);

  const handleCreateChef = async (e) => {
    e.preventDefault();
    try {
     const token = localStorage.getItem('token');
await axios.post('http://localhost:5000/api/auth/admin/create-chef', formData, {
  headers: { Authorization: `Bearer ${token}` }
});
      toast.success('Chef créé avec succès');
      setShowModal(false);
      // Recharger la liste
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la création');
      console.error(err);
    }
  };

const handleEditChef = (chef) => {
  setEditingChef(chef);
  setFormData({
    nom: chef.nom,
    prenom: chef.prenom,
    email: chef.email,
    oldEmail: chef.email, 
    departement: chef.departement,
    universite: chef.universite
  });
  setEditModal(true);
};

const handleUpdateChef = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/auth/admin/chefs/${editingChef.id}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Chef modifié avec succès');
    setEditModal(false);
    // Recharger la liste
    const res = await axios.get('http://localhost:5000/api/auth/admin/chefs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setChefs(res.data.chefs);
  } catch (err) {
    toast.error(err.response?.data?.error || 'Erreur lors de la modification');
    console.error(err);
  }
};

  if (loading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#000041]">Gestion des Chefs de Département</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#000041] text-white px-4 py-2 rounded-lg hover:bg-[#000041]/90 transition"
        >
          <Plus size={18} /> Ajouter un chef
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Prénom</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Département</th>
              <th className="py-3 px-4 text-left">Université</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chefs.map((chef) => (
              <tr key={chef.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{chef.nom}</td>
                <td className="py-3 px-4">{chef.prenom}</td>
                <td className="py-3 px-4">{chef.email}</td>
                <td className="py-3 px-4">{chef.departement}</td>
                <td className="py-3 px-4">{chef.universite}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button 
                      onClick={() => handleEditChef(chef)}
                      className="text-blue-500 hover:text-blue-700"
                  >
                  <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ajouter un chef de département</h2>
            <form onSubmit={handleCreateChef}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Département</label>
                  <input
                    type="text"
                    value={formData.departement}
                    onChange={(e) => setFormData({...formData, departement: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Université</label>
                  <input
                    type="text"
                    value={formData.universite}
                    onChange={(e) => setFormData({...formData, universite: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#000041] text-white rounded-lg"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* Modal d'édition */}
{editModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Modifier le chef de département</h2>
      <form onSubmit={handleUpdateChef}>
        <div className="space-y-4">
          {/* Champs modifiables */}
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
<div>
  <label className="block text-sm font-medium mb-1">Email</label>
  <input
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({...formData, email: e.target.value})}
    className="w-full border rounded-lg px-3 py-2"
    required
  />
  {formData.email !== formData.oldEmail && (
    <p className="text-sm text-yellow-600 mt-1">
      Un nouveau mot de passe sera envoyé à cette adresse
    </p>
  )}
</div>

          {/* Champs non modifiables (affichage seulement) */}
          <div>
            <label className="block text-sm font-medium mb-1">Département</label>
            <input
              type="text"
              value={formData.departement}
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Université</label>
            <input
              type="text"
              value={formData.universite}
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              readOnly
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setEditModal(false)}
            className="px-4 py-2 border rounded-lg"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#000041] text-white rounded-lg"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default GestionChefs;