import { useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineBookOpen, HiOutlineCreditCard } from 'react-icons/hi';
import api from '../../../services/api'; 
import Statistiques from './Statistiques';

const AdminVueGenerale = () => {
  // 1. Initialisation de l'état avec toutes les propriétés indispensables aux graphiques
  const [realStats, setRealStats] = useState({
   
    totalFormations: 0,
    totalRevenus: 0,
    totalAdultes: 0,
    totalEnfants: 0,
    donneesEvolution: [],
    donneesFormations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/stats');
 

        if (response) {
          // 2. On passe directement l'objet complet reçu de Laravel
          setRealStats({
           
            totalFormations: response.totalFormations || 0,
            totalRevenus: response.totalRevenus || 0,
            totalAdultes: response.totalAdultes || 0,
            totalEnfants: response.totalEnfants || 0,
            donneesEvolution: response.donneesEvolution || [],
            donneesFormations: response.donneesFormations || []
          });
        }
      } catch (error) {
        console.error("Erreur API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="p-12 text-center text-gray-400 italic">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
      Chargement des statistiques de P.School...
    </div>
  );

  return (
    <>
      <div className="p-1">
        <h2 className="text-2xl font-bold text-blue-600">Bienvenue sur votre espace d'administration</h2>
        <p className="text-gray-600 mt-2">
          Gérez la plateforme <span className='font-bold text-black'>P.School</span> depuis ce tableau de bord.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Carte 1 : Apprenants */}
          

          {/* Carte 2 : Formations */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase">Total formations</p>
                <p className="text-3xl font-extrabold text-gray-800 mt-1">{realStats.totalFormations}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <HiOutlineBookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Carte 3 : Chiffre d'affaires */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-emerald-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase">Chiffre d'affaires</p>
                <p className="text-3xl font-extrabold text-gray-800 mt-1">
                  {new Intl.NumberFormat('fr-FR').format(realStats.totalRevenus)} FCFA
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Uniquement les apprenant ayant payé leur frais de fromation</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <HiOutlineCreditCard className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

       
      </div>

      
      <Statistiques data={realStats} />
    </>
  );
};

export default AdminVueGenerale;