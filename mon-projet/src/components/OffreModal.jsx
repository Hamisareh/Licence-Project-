import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const formatDate = (dateString) => {
  if (!dateString) return "Non spécifiée";
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const OffreModal = ({ isOpen, onClose, offre }) => {
  if (!offre) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold text-[#000041] border-b pb-4">
 <h2 className="text-xl font-bold mb-2">{offre?.titre || "Chargement..."}</h2>
                </Dialog.Title>

                <div className="mt-6 space-y-6">
                {/* Section Entreprise */}
<div className="bg-gray-50 p-4 rounded-lg">
  <h4 className="font-semibold text-lg mb-3 text-[#ff7b00]">Entreprise</h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <p className="font-medium">Nom:</p>
      <p>{offre.nom_entreprise}</p>
    </div>
    <div>
      <p className="font-medium">Email:</p>
      <p>{offre.email_entreprise}</p>
    </div>
    <div>
      <p className="font-medium">Téléphone:</p>
      <p>{offre.tel_entreprise}</p>
    </div>
    <div>
      <p className="font-medium">Secteur:</p>
      <p>{offre.secteur_entreprise}</p>
    </div>
    {offre.adr_entreprise && (
      <div className="md:col-span-2">
        <p className="font-medium">Adresse:</p>
        <p>{offre.adr_entreprise}</p>
      </div>
    )}
  </div>
</div>
                  {/* Détails du stage */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-[#ff7b00]">Détails du stage</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">Domaine:</p>
                          <p>{offre.domaine || "Non spécifié"}</p>
                        </div>
                        <div>
                            <p className="font-medium">Durée:</p>
                            <p>{offre.duree || "Non spécifié"}</p>
                        </div>
                        <div>
                          <p className="font-medium">Période:</p>
                          <p>{formatDate(offre.date_debut)} au {formatDate(offre.date_fin)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Missions */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-[#ff7b00]">Missions</h4>
                      <div className="prose max-w-none">
                        {offre.missions ? (
                          <p className="whitespace-pre-line">{offre.missions}</p>
                        ) : (
                          <p className="text-gray-500">Aucune mission spécifiée</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compétences requises */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-[#ff7b00]">Compétences Requises</h4>
                    <div className="prose max-w-none">
                      {offre.competencesRequises ? (
                        <p className="whitespace-pre-line">{offre.competencesRequises}</p>
                      ) : (
                        <p className="text-gray-500">Aucune compétence spécifique requise</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {offre.descr && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-[#ff7b00]">Description</h4>
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{offre.descr}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[#000041] text-white rounded-lg hover:bg-[#1a1a66] transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OffreModal;
