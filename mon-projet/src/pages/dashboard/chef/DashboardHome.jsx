import React, { useState, useEffect } from "react";
import { GraduationCap, Users, Clock, CheckCircle, XCircle, PlayCircle, AlertCircle, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import axios from "axios";

const COLORS = {
  l1: "#4f46e5",
  l2: "#0ea5e9",
  l3: "#10b981",
  m1: "#facc15",
  m2: "#f97316",
  en_attente: "#f59e0b",
  accepte: "#10b981",
  refuse: "#ef4444",
  en_cours: "#3b82f6",
  abandonne: "#ef4444",
  termine: "#10b981"
};

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://192.168.90.20:5000/api/auth/chef/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data.data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg">
        Impossible de charger les statistiques
      </div>
    );
  }

  // Préparer les données pour les graphiques
  const niveauxData = stats.niveaux.map(niv => ({
    ...niv,
    color: COLORS[niv.key.toLowerCase()] || COLORS.l1
  }));

  const candidaturesData = [
    { etat: "En attente", count: stats.candidatures.find(c => c.etat === "en attente")?.count || 0, icon: <Clock />, color: COLORS.en_attente },
    { etat: "Acceptées", count: stats.candidatures.find(c => c.etat === "accepte")?.count || 0, icon: <CheckCircle />, color: COLORS.accepte },
    { etat: "Refusées", count: stats.candidatures.find(c => c.etat === "refuse")?.count || 0, icon: <XCircle />, color: COLORS.refuse }
  ];

  const stagesData = [
    { etat: "En cours", count: stats.stages.find(s => s.etat === "en cours")?.count || 0, icon: <PlayCircle />, color: COLORS.en_cours },
    { etat: "Abandonnés", count: stats.stages.find(s => s.etat === "abandonne")?.count || 0, icon: <AlertCircle />, color: COLORS.abandonne },
    { etat: "Terminés", count: stats.stages.find(s => s.etat === "termine")?.count || 0, icon: <Flag />, color: COLORS.termine }
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-[#000041] mb-8">
        Statistiques – Département {stats.chef.departement}
      </h2>
      <p className="text-gray-600 mb-6">Bonjour {stats.chef.prenom} {stats.chef.nom}</p>

      {/* Cartes par niveau */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {niveauxData.map((niv, i) => (
          <motion.div
            key={niv.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{niv.label}</p>
                <h3 className="text-3xl font-bold" style={{ color: niv.color }}>
                  {niv.value}
                </h3>
              </div>
              <GraduationCap size={32} color={niv.color} />
            </div>
          </motion.div>
        ))}

        {/* Carte total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#000041] text-white p-6 rounded-2xl shadow-lg sm:col-span-2 lg:col-span-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-300 mb-1">Total des étudiants</p>
              <h3 className="text-4xl font-bold">{stats.totalEtudiants}</h3>
            </div>
            <Users size={36} />
          </div>
        </motion.div>
      </div>

      {/* Graphique Doughnut - Niveaux */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 text-[#000041]">Répartition par niveau</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={niveauxData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={5}
              label
            >
              {niveauxData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Graphiques Barres - Candidatures et Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-[#000041]">Statut des candidatures</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={candidaturesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="etat" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8">
                {candidaturesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-[#000041]">Statut des stages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stagesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="etat" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d">
                {stagesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}