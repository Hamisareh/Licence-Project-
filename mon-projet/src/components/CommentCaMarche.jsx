import React from 'react';

const étapes = [
  {
    numero: 1,
    titre: 'Inscription & Profil',
    description: 'Les étudiants et entreprises créent leur compte et complètent leur profil.',
  },
  {
    numero: 2,
    titre: 'Candidature aux Stages',
    description: 'Les étudiants postulent aux offres après avoir complété leur profil.',
  },
  {
    numero: 3,
    titre: 'Validation & Suivi du Stage',
    description: 'Les offres sont validées et un suivi est assuré tout au long du stage.',
  },
  {
    numero: 4,
    titre: 'Rapport & Certification',
    description: 'Un rapport est généré à la fin, avec possibilité de certification.',
  },
];

const CommentCaMarche = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {étapes.map((étape) => (
          <div
            key={étape.numero}
            className="bg-white shadow-md rounded-xl border-l-4 border-blue-900 p-6 relative"
          >
            <div className="absolute -top-5 -left-5 bg-blue-900 text-white w-10 h-10 flex items-center justify-center font-bold rounded-full shadow-lg">
              {étape.numero}
            </div>
            <h3 className="text-xl font-semibold mb-2">{étape.titre}</h3>
            <p className="text-gray-600">{étape.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentCaMarche;
