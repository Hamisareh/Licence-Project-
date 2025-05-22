// src/pages/InscriptionChef.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building2 } from 'lucide-react';

const InscriptionChef = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/assets/a (3).jpg')" }}
    >
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-md w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold text-center underline mb-6">
          Inscription - Chef de Département
        </h2>

        <div className="space-y-4">
          <div className="flex items-center bg-white text-black px-4 py-2 rounded-md">
            <GraduationCap className="mr-2" />
            <input
              type="text"
              placeholder="Université"
              className="bg-transparent w-full focus:outline-none"
            />
          </div>
          <div className="flex items-center bg-white text-black px-4 py-2 rounded-md">
            <Building2 className="mr-2" />
            <input
              type="text"
              placeholder="Département"
              className="bg-transparent w-full focus:outline-none"
            />
          </div>
        </div>

        <button className="mt-6 w-full bg-orange-700 text-white py-2 rounded-md hover:bg-orange-800 transition">
          Valider
        </button>

        <p
          onClick={() => navigate('/inscription')}
          className="mt-4 text-sm text-center underline cursor-pointer hover:text-orange-300"
        >
          Retour à l'étape précédente
        </p>
      </div>
    </div>
  );
};

export default InscriptionChef;
