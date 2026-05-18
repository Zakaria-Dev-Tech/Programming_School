import { Routes, Route } from 'react-router-dom';
import ParentLayout from '../../components/dashboard/common/ParentLayout';
import MesEnfants from '../../components/dashboard/parent/MesEnfants';
import ProfilParent from '../../components/dashboard/parent/ProfilParent';
import ParentPaiements from '../../components/dashboard/parent/ParentPaiements';
const ParentDashboard = () => {
  console.log("Dashboard Parent chargé avec Layout"); // Pour vérifier dans la console F12

  return (
    <ParentLayout title="Espace Parent">
      <Routes>
  {/* UTILISE 'index' POUR LA PAGE PAR DÉFAUT */}
  <Route index element={<MesEnfants />} /> 
  
  {/* ENLÈVE LE SLASH DEVANT 'profil' */}
  {/* 'profil' (sans /) veut dire : /parent/profil */}
  <Route path="profil" element={<ProfilParent />} /> 
  
  {/* PAREIL ICI */}
  <Route path="paiements" element={<ParentPaiements />} />
</Routes>
    </ParentLayout>
  );
};

export default ParentDashboard;