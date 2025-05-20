import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EvaluationCard = ({ evalData }) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-[#000041]">{evalData.nom_entreprise}</h3>
      <span className="text-sm text-gray-500">
        Soumis le : {new Date(evalData.date_soumission).toLocaleDateString()}
      </span>
    </div>
    
    <h4 className="text-lg text-[#ff7b00] mb-4">{evalData.titre_offre}</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
      <div>
        <span className="font-medium text-[#000041]">Comportement : </span>
        <span className="font-bold text-[#ff7b00]">{evalData.note_comport}/20</span>
      </div>
      <div>
        <span className="font-medium text-[#000041]">Adaptabilité : </span>
        <span className="font-bold text-[#ff7b00]">{evalData.note_adapt}/20</span>
      </div>
      <div>
        <span className="font-medium text-[#000041]">Travail d'équipe : </span>
        <span className="font-bold text-[#ff7b00]">{evalData.note_esprit_equipe}/20</span>
      </div>
      <div>
        <span className="font-medium text-[#000041]">Qualité du travail : </span>
        <span className="font-bold text-[#ff7b00]">{evalData.note_qual_trav}/20</span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 gap-4 mb-4">
      <div>
        <span className="font-medium text-[#000041]">Absences : </span>
        <span className="text-[#000041]">{evalData.nb_absences}</span>
      </div>
      <div>
        <span className="font-medium text-[#000041]">Justifiées : </span>
        <span className="text-[#000041]">{evalData.nb_justification}</span>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h5 className="font-semibold text-[#000041] mb-2">Commentaire :</h5>
      <p className="text-gray-700 italic">{evalData.commentaire}</p>
    </div>
  </div>
);

const EvaluationPage = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const api_URL = 'http://192.168.219.93:5000/api/auth';

  const fetchEvaluations = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${api_URL}/etudiant/evaluations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setEvaluations(response.data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des évaluations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchEvaluations();
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#000041]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-[#000041]">Évaluations de stage</h1>

      </div>

      {/* Liste des évaluations */}
      {evaluations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">Aucune évaluation disponible</p>
          <button
            onClick={onRefresh}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Actualiser
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {evaluations.map((item) => (
            <EvaluationCard 
              key={`${item.evaluateur}-${item.id_offre}`} 
              evalData={item} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EvaluationPage;