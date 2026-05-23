import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/dashboard/common/AdminLayout';

// Import de la nouvelle vue contenant les chiffres et les cartes
import AdminVueGenerale from '../../components/dashboard/admin/AdminVueGenerale';

import GestionUtilisateurs from '../../components/dashboard/admin/GestionUtilisateurs';
import GestionFormations from '../../components/dashboard/admin/GestionFormations';
import GestionServices from '../../components/dashboard/admin/GestionServices';
import GestionInscriptions from '../../components/dashboard/admin/GestionInscriptions';
import GestionPaiements from '../../components/dashboard/admin/GestionPaiements';
import GestionLogs from '../../components/dashboard/admin/GestionLogs';
import GestionMessages from '../../components/dashboard/admin/GestionMessages';
import MonProfil from '../../components/dashboard/admin/MonProfil';
import GestionInscriptionsSession from '../../components/dashboard/admin/GestionInscriptionsSession';
const AdminDashboard = () => {
  return (
    <AdminLayout title="Tableau de bord">
      <Routes>
        {/* La route principale affiche désormais uniquement le composant de statistiques */}
        <Route path="/" element={<AdminVueGenerale />} />
        
        <Route path="utilisateurs" element={<GestionUtilisateurs />} />
        <Route path="formations" element={<GestionFormations />} />
        <Route path="services" element={<GestionServices />} />
        <Route path="inscriptions" element={<GestionInscriptions/>}/>
        <Route path="paiements" element={<GestionPaiements />} />
        <Route path="logs" element={<GestionLogs />} />
        <Route path="inscriptions-session" element={<GestionInscriptionsSession />} />
        <Route path="messages" element={<GestionMessages />} />
        <Route path="profil" element={<MonProfil />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;