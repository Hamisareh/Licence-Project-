import React from 'react';
import { GraduationCap, Building2, School } from 'lucide-react'; // أيقونات

const QuiSommesNous = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-16">
      <h2 className="text-3xl font-bold text-center mb-4">Qui sommes nous ?</h2>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
        StageFlow est la plateforme qui relie étudiants, entreprises et établissements pour des stages réussis.
        Ensemble, faisons grandir les talents de demain.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Étudiants */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:scale-105 transition-transform duration-300">
          <GraduationCap className="mx-auto text-orange-700 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2">Étudiants</h3>
          <p className="text-gray-600 text-sm">
            Consultez les offres disponibles, postulez en quelques clics et suivez facilement vos candidatures.
          </p>
        </div>

        {/* Entreprise */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:scale-105 transition-transform duration-300">
          <Building2 className="mx-auto text-orange-700 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2">Entreprise</h3>
          <p className="text-gray-600 text-sm">
            Publiez vos offres de stage, gérez les candidatures et suivez l’avancement des stagiaires.
          </p>
        </div>

        {/* Établissements */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:scale-105 transition-transform duration-300">
          <School className="mx-auto text-orange-700 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2">Établissements</h3>
          <p className="text-gray-600 text-sm">
            Validez les conventions, suivez les stages en cours et communiquez avec tous les acteurs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuiSommesNous;
