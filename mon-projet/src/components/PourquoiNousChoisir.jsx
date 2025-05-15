import React from 'react';

const raisons = [
  {
    img: '/assets/suivie.png',
    titre: 'Suivie des stages',
    description: 'Un suivi régulier de chaque étape du stage pour assurer votre réussite.',
  },
  {
    img: '/assets/communication.png',
    titre: 'Communication centralisée',
    description: 'Une messagerie intégrée pour échanger facilement avec les entreprises.',
  },
  {
    img: '/assets/temp.png',
    titre: 'Processus accéléré',
    description: 'Des démarches simplifiées pour gagner du temps et rester concentré sur l’essentiel.',
  },
];

const PourquoiNousChoisir = () => {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Partie gauche - Image */}
      <div className="md:w-1/2 w-full">
        <img
          src="/assets/equipe.jpg"
          alt="Équipe"
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out transform hover:scale-105"
        />
      </div>

      {/* Partie droite - Contenu */}
      <div className="md:w-1/2 w-full bg-orange-700 text-white p-8 flex flex-col justify-center">
        <h2 className="text-3xl font-bold  mb-8 text-center animate-fadeInUp">
          POURQUOI NOUS CHOISIR ?
        </h2>

        <div className="space-y-6">
          {raisons.map((raison, index) => (
            <div
            key={index}
            className="flex items-start bg-white text-black p-4 rounded-xl shadow-lg hover:scale-105 transition-all duration-500 ease-in-out opacity-0 animate-fadeInUp"
          >
          
              <img
                src={raison.img}
                alt={raison.titre}
                className="w-12 h-12 mr-4 object-contain shrink-0"
              />
              <div>
                <h3 className="font-semibold text-lg mb-1">{raison.titre}</h3>
                <p className="text-sm">{raison.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PourquoiNousChoisir;
