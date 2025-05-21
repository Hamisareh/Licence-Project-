import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, Briefcase, Building, CheckCircle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C', '#D0ED57'];

// Données mockées étendues
const mockStats = {
  universite: "UMBB",
  departements: [
    { 
      departement: "Informatique", 
      etudiants: 120, 
      candidatures: 85, 
      stagiaires: 45,
      stages_termines: 28
    },
    { 
      departement: "Mathématiques", 
      etudiants: 80, 
      candidatures: 50, 
      stagiaires: 25,
      stages_termines: 15
    },
    { 
      departement: "Physique", 
      etudiants: 65, 
      candidatures: 40, 
      stagiaires: 20,
      stages_termines: 12
    },
    { 
      departement: "Chimie", 
      etudiants: 55, 
      candidatures: 35, 
      stagiaires: 15,
      stages_termines: 8
    },
    { 
      departement: "Biologie", 
      etudiants: 70, 
      candidatures: 45, 
      stagiaires: 22,
      stages_termines: 14
    },
  ],
  totaux: {
    total_etudiants: 390,
    total_candidatures: 255,
    total_stagiaires: 127,
    total_entreprises: 78,
    total_stages_termines: 77
  }
};

export default function StatistiquesAdmin() {
  const [stats] = useState(mockStats);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#000041] mb-6">
        Statistiques - Université {stats.universite}
      </h1>

      {/* Cartes récapitulatives - Version étendue */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <Users className="text-blue-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Étudiants</p>
              <p className="text-2xl font-bold">{stats.totaux.total_etudiants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <FileText className="text-green-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Candidatures</p>
              <p className="text-2xl font-bold">{stats.totaux.total_candidatures}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <Briefcase className="text-orange-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Stagiaires</p>
              <p className="text-2xl font-bold">{stats.totaux.total_stagiaires}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <Building className="text-purple-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Entreprises</p>
              <p className="text-2xl font-bold">{stats.totaux.total_entreprises}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-teal-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Stages terminés</p>
              <p className="text-2xl font-bold">{stats.totaux.total_stages_termines}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique des départements avec nouvelles données */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#000041]">
          Répartition par département
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.departements}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="departement" 
                angle={-45} 
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="etudiants" fill="#0088FE" name="Étudiants" />
              <Bar dataKey="candidatures" fill="#00C49F" name="Candidatures" />
              <Bar dataKey="stagiaires" fill="#FFBB28" name="Stagiaires actuels" />
              <Bar dataKey="stages_termines" fill="#FF8042" name="Stages terminés" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Nouveau graphique - Stages terminés par département */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#000041]">
          Stages terminés par département
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.departements}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="departement" 
                angle={-45} 
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stages_termines" fill="#8884d8" name="Stages terminés" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Camembert des départements */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#000041]">
          Étudiants par département
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.departements}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="etudiants"
                nameKey="departement"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.departements.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}