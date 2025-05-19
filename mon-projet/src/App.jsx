import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages publiques
import Accueil from './pages/Accueil';
import Login from './pages/Login';
import InscriptionPrincipale from './pages/InscriptionPrincipale';
import InscriptionEtudiant from './components/InscriptionEtudiant';
import InscriptionChefDepartement from './components/InscriptionChefDepartement';
import InscriptionEntreprise from './components/InscriptionEntreprise';
import ForgotPasswordEmail from './pages/ForgotPasswordEmail';
import ForgotPasswordVerify from './pages/ForgotPasswordVerify';

// Dashboard Chef
import DashboardChefLayout from "./pages/dashboard/chef/DashboardChefLayout";
import DashboardHome from "./pages/dashboard/chef/DashboardHome";
import Candidatures from  "./pages/dashboard/chef/Candidatures";
import Stagiaires from "./pages/dashboard/chef/Stagiaires";
import ProfilChef from "./pages/dashboard/chef/ProfilChef";
import ChangePasswordChef from "./pages/dashboard/chef/ChangePasswordChef";



// Dashboard etudiant
import DashboardEtudiantLayout from "./pages/dashboard/etudiant/DashboardEtudiantLayout";
import Listedesoffres from "./pages/dashboard/etudiant/listedesoffres";
import Mescandidatures from  "./pages/dashboard/etudiant/mescandidatures";
import Messtages from "./pages/dashboard/etudiant/messtages";
import Mesfavoris from "./pages/dashboard/etudiant/mesfavoris";
import Mesevaluations from "./pages/dashboard/etudiant/mesevaluations";
import Offresdetails from "./pages/dashboard/etudiant/offresdetails";
import Aide from "./pages/dashboard/etudiant/aide";
import Applyformeetudiant from "./pages/dashboard/etudiant/ApplyFormModal";
import ProfileEtudiant from "./pages/dashboard/etudiant/profiletudiant";
import ChangePasswordEtudiant from "./pages/dashboard/etudiant/ChangePasswordEtudiant";

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Accueil />} />

        {/* Page de connexion */}
        <Route
          path="/connexion"
          element={
            <div
              className="text-black h-screen flex justify-center items-center bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/imagehero.jpg')" }}
            >
              <Login />
            </div>
          }
        />

        {/* Mot de passe oublié */}
        <Route path="/mot-de-passe-oublie" element={<ForgotPasswordEmail />} />
        <Route path="/verification-code" element={<ForgotPasswordVerify />} />

        {/* Espace Chef */}
        <Route path="/chef" element={<DashboardChefLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="candidatures" element={<Candidatures />} />
          <Route path="stagiaires" element={<Stagiaires />} />
          <Route path="profil" element={<ProfilChef />} />
          <Route path="modifier-mot-de-passe" element={<ChangePasswordChef />} />
        </Route>

          {/* Espace etudiant */}
       <Route path="/etudiant" element={<DashboardEtudiantLayout />}>
  <Route index element={<Listedesoffres />} /> {/* Ajoutez cette ligne */}
  <Route path="listedoffres" element={<Listedesoffres />} />
  <Route path="offresdetails/:id" element={<Offresdetails />} />
     <Route path="mescandidatures" element={<Mescandidatures />} />
  <Route path="messtages" element={<Messtages />} />
  <Route path="mesfavoris" element={<Mesfavoris />} />
  <Route path="mesevaluations" element={<Mesevaluations />} />
  <Route path="aide" element={<Aide />} />
  <Route path="applyformeetudiant" element={<Applyformeetudiant />} />
  <Route path="profiletudiant" element={<ProfileEtudiant />} />
  <Route path="modifier-mot-de-passe" element={<ChangePasswordEtudiant />} />
</Route>


        {/* Inscriptions */}
        <Route path="/inscription" element={<InscriptionPrincipale />} />
        <Route path="/inscription/etudiant" element={<InscriptionEtudiant />} />
        <Route path="/inscription/chef-departement" element={<InscriptionChefDepartement />} />
        <Route path="/inscription/entreprise" element={<InscriptionEntreprise />} />

      </Routes>
    </Router>
  );
}

export default App;
