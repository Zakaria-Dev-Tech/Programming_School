import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Loading from './components/common/Loading';
import Navbar from './components/common/Navbar';
import Footer from './components/common/footer';
import Accueil from './components/visitor/Vitrine';
import Login from './pages/Login';
import Register from './pages/Register';
import AutoLogin from './pages/AutoLogin';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ApprenantDashboard from './pages/dashboard/ApprenantDashboard';
import FormateurDashboard from './pages/dashboard/FormateurDashboard';
import ParentDashboard from './pages/dashboard/ParentDashboard';
import SuiviEnfant from './components/dashboard/parent/SuiviEnfant';
import CoursePlayer from './pages/CoursePlayer';
import ElearningPage from './pages/ElearningPage';
import AproposPage from './pages/AproposPage';
import ServicesPage from './pages/ServicesPages';
import FormationSessionsPage from './pages/FormationSessionsPage';
import InscriptionFormation from './pages/InscriptionFormation';
import InscriptionSessionPage from './pages/InscriptionSessionPage';
import InscriptionSessionAdultePage from './pages/InscriptionAdultePage';
import EvenementsPage from './pages/EvenementsPage';
import Galerie from './pages/Galerie';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/a-propos" element={<AproposPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/formationSessions" element={<FormationSessionsPage />} />
          <Route path="/elearning" element={<ElearningPage />} />
         <Route path="/evenements" element={<EvenementsPage />} />
        <Route path="/galerie" element={<Galerie />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un temps de chargement minimum (optionnel)
    // Tu peux aussi attendre que toutes les ressources soient chargées
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 secondes - ajuste selon tes besoins

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Écran de chargement */}
      {loading && <Loading onLoadingComplete={() => setLoading(false)} />}
      
      {/* Contenu principal */}
      <div className={loading ? 'hidden' : 'block'}>
        <Router>
          <Toaster position="top-right" reverseOrder={false} />
          <AuthProvider>
            <Routes>
              {/* Pages sans Navbar */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login/auto" element={<AutoLogin />} />
              {/* Dashboard (sans Navbar) */}
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/apprenant/*" element={<ApprenantDashboard />} />
              <Route path="/formateur/*" element={<FormateurDashboard />} />
              <Route path="/parent/*" element={<ParentDashboard />} />
              <Route path="/parent/suivi-enfant/:enfantId" element={<SuiviEnfant />} />
              <Route 
                path="/inscription/:formationId" 
                element={<PrivateRoute><InscriptionFormation /></PrivateRoute>} 
              />
              <Route path="/inscription-session/:formationId" element={<InscriptionSessionPage />} />
              <Route path="/inscription-session-adulte/:formationId" element={<InscriptionSessionAdultePage />} />
              <Route path="/apprenant/formation/:id" element={<CoursePlayer />} />
              {/* Pages publiques avec Navbar */}
              <Route path="/*" element={<PublicLayout />} />

              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </>
  );
}

export default App;