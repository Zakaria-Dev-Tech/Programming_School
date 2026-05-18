import { useState, useEffect } from 'react';
import { HiOutlineCreditCard, HiCheckCircle, HiLockClosed } from 'react-icons/hi';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const ParentPaiements = () => {
  const [fraisFormations, setFraisFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les inscriptions des enfants du parent
  const fetchPaiementsEnfants = async () => {
    try {
      setLoading(true);
      // On appelle une route Laravel qui récupère les inscriptions de TOUS les enfants de ce parent
      const res = await api.get('/parent/enfants/inscriptions');
      setFraisFormations(res);
    } catch (err) {
      console.error("Erreur de chargement des paiements", err);
      toast.error("Impossible de récupérer les frais de scolarité.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaiementsEnfants();
  }, []);

  // Fonction pour payer la formation d'un enfant (Simulation Full-Stack)
  const handlePayerFormation = async (inscriptionId, enfantNom, formationTitre) => {
    try {
      toast.loading(`Ouverture du guichet CinetPay pour ${enfantNom}...`);

      // On appelle notre API de simulation Laravel (en lui passant l'ID de l'inscription)
      const res = await api.post('/payment/simulate-parent', {
        inscription_id: inscriptionId
      });

      toast.dismiss();

      if (res.status === 'success') {
        toast.success(`Félicitations ! La formation de ${enfantNom} est entièrement débloquée.`);
        fetchPaiementsEnfants(); // Recharger le tableau
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Erreur lors du traitement du paiement.");
    }
  };

  if (loading) return (
    <div className="p-6 text-center text-gray-400">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
      Chargement de la situation financière...
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Frais de formation & Paiements</h1>
        <p className="text-gray-500 text-sm mt-1">
          Suivez les statuts financiers et débloquez les cours complets de vos enfants.
        </p>
      </div>

      {fraisFormations.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
          <HiOutlineCreditCard className="text-4xl mx-auto text-gray-300 mb-2" />
          <p>Aucun frais de formation enregistré pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider border-b">
                <tr>
                  <th className="p-4 border-b">Enfant</th>
                  <th className="p-4 border-b">Formation</th>
                  <th className="p-4 border-b">Tarif</th>
                  <th className="p-4 border-b">Statut Accès</th>
                  <th className="p-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {fraisFormations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{item.enfant_nom}</td>
                    <td className="p-4 text-gray-600">{item.formation_titre}</td>
                    <td className="p-4 font-bold text-gray-800">
                      {Number(item.montant).toLocaleString()} FCFA
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.statut_paiement === 'paye' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {item.statut_paiement === 'paye' ? '✓ Complet Débloqué' : ' Essai Gratuit'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {item.statut_paiement === 'paye' ? (
                        <span className="text-xs text-green-600 font-medium inline-flex items-center gap-1">
                          <HiCheckCircle className="text-lg" /> Payé
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePayerFormation(item.id, item.enfant_nom, item.formation_titre)}
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-xs transition shadow-sm"
                        >
                          <HiLockClosed />
                          Régler par Mobile Money
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentPaiements;