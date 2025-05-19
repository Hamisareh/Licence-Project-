import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '/api/config';
import { toast } from 'react-toastify';
import { LockKeyhole } from 'lucide-react';

const ChangePasswordChef = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `${API_URL}/api/auth/change-password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('✅ Mot de passe changé avec succès');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Erreur lors du changement de mot de passe";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <LockKeyhole className="text-[#000041]" size={26} />
          <h2 className="text-xl font-semibold text-[#000041]">Changer le mot de passe</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe actuel</label>
            <input
              type="password"
              name="currentPassword"
              required
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <input
              type="password"
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#000041] text-white font-medium py-2 rounded-xl hover:bg-[#000041]/90 transition"
          >
            {loading ? 'Changement en cours...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordChef;
