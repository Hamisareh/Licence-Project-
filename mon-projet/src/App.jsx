import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Login from './pages/Login';
import InscriptionPrincipale from './pages/InscriptionPrincipale';
import InscriptionEtudiant from './components/InscriptionEtudiant';
import InscriptionChefDepartement from './components/InscriptionChefDepartement';
import InscriptionEntreprise from './components/InscriptionEntreprise';
import ForgotPasswordEmail from './pages/ForgotPasswordEmail';
import ForgotPasswordVerify from './pages/ForgotPasswordVerify';


function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة الاستقبال */}
        <Route path="/" element={<Accueil />} />

        {/* صفحة تسجيل الدخول */}
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

      <Route path="/mot-de-passe-oublie" element={<ForgotPasswordEmail />} />
      <Route path="/verification-code" element={<ForgotPasswordVerify />} />



        {/* صفحة الاختيار بين أدوار التسجيل */}
        <Route path="/inscription" element={<InscriptionPrincipale />} />

        {/* صفحات التسجيل حسب الدور (يمكن تفعيلها لاحقاً) */}
       <Route path="/inscription/etudiant" element={<InscriptionEtudiant />} />
          <Route path="/inscription/chef-departement" element={<InscriptionChefDepartement />} />
        <Route path="/inscription/entreprise" element={<InscriptionEntreprise />} /> 
      </Routes>
    </Router>
  );
}

export default App;
