import React from "react";
import { GraduationCap, Users } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const niveaux = [
  { label: "Licence 1", key: "l1", value: 40, color: "#4f46e5" },
  { label: "Licence 2", key: "l2", value: 35, color: "#0ea5e9" },
  { label: "Licence 3", key: "l3", value: 28, color: "#10b981" },
  { label: "Master 1", key: "m1", value: 20, color: "#facc15" },
  { label: "Master 2", key: "m2", value: 15, color: "#f97316" },
];

const total = niveaux.reduce((sum, n) => sum + n.value, 0);

export default function DashboardHome() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-[#000041] mb-8">Statistiques des étudiants</h2>

      {/* Cartes par niveau */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {niveaux.map((niv, i) => (
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
              <h3 className="text-4xl font-bold">{total}</h3>
            </div>
            <Users size={36} />
          </div>
        </motion.div>
      </div>

      {/* Graphique Doughnut */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-[#000041]">Répartition graphique</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={niveaux}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={5}
              label
            >
              {niveaux.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
