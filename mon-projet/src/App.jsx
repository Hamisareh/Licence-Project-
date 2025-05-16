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
import LogoutChef from "./pages/dashboard/chef/LogoutChef";

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
          <Route path="/chef" element={<DashboardHome />} />
          <Route path="/chef/candidatures" element={<Candidatures />} />
          <Route path="/chef/stagiaires" element={<Stagiaires />} />
          <Route path="profil" element={<ProfilChef />} />
          <Route path="modifier-mot-de-passe" element={<ChangePasswordChef />} />
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
