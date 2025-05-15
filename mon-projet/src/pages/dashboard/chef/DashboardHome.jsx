import React from 'react';

const DashboardHome = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bienvenue dans votre tableau de bord</h1>
      {/* Contenu du dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vos statistiques ici */}
      </div>
    </div>
  );
};

export default DashboardHome;