import { useState, useEffect } from 'react';
import { 
  HiOutlineXCircle,
  HiOutlineSearch, 
  HiOutlineEye, 
  HiOutlineCheckCircle, 
  HiOutlineRefresh, 
  HiOutlineDownload,
} from 'react-icons/hi';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const GestionPaiements = () => {
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreMode, setFiltreMode] = useState('tous');
  const [paiements, setPaiements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modalDetailsOuverte, setModalDetailsOuverte] = useState(false);
  const [paiementSelectionne, setPaiementSelectionne] = useState(null);

  // Charger les vraies données de l'API
  const fetchPaiements = async () => {
    try {
      setChargement(true);
      const data = await api.get('/admin/transactions');
      setPaiements(data);
    } catch (error) {
      console.error("Erreur de chargement des transactions:", error);
      toast.error("Erreur lors de la récupération des transactions");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    fetchPaiements();
  }, []);

  // Filtrer les paiements
  const paiementsFiltres = paiements.filter(p => {
    const matchRecherche = (p.apprenant?.toLowerCase().includes(recherche.toLowerCase()) || false) ||
                           (p.formation?.toLowerCase().includes(recherche.toLowerCase()) || false) ||
                           (p.transactionId?.toLowerCase().includes(recherche.toLowerCase()) || false);
    const matchStatut = filtreStatut === 'tous' || p.statut === filtreStatut;
    const matchMode = filtreMode === 'tous' || p.mode === filtreMode;
    return matchRecherche && matchStatut && matchMode;
  });

  // Calcul des statistiques dynamiques
  const totalMontant = paiementsFiltres.reduce((sum, p) => sum + Number(p.montant || 0), 0);
  const totalEnAttente = paiementsFiltres.filter(p => p.statut === 'en_attente').reduce((sum, p) => sum + Number(p.montant || 0), 0);
  const totalValide = paiementsFiltres.filter(p => p.statut === 'valide').reduce((sum, p) => sum + Number(p.montant || 0), 0);
  const totalRembourse = paiementsFiltres.filter(p => p.statut === 'rembourse').reduce((sum, p) => sum + Number(p.montant || 0), 0);

  // Couleurs des badges de statut
  const getStatutColor = (statut) => {
    switch(statut) {
      case 'valide': return 'bg-green-100 text-green-700';
      case 'en_attente': return 'bg-orange-100 text-orange-700';
      case 'essai': return 'bg-blue-100 text-blue-700';
      case 'echoue': return 'bg-red-100 text-red-700';
      case 'rembourse': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutLabel = (statut) => {
    switch(statut) {
      case 'valide': return 'Validé';
      case 'en_attente': return 'En attente';
      case 'essai': return 'Essai Gratuit';
      case 'echoue': return 'Échoué';
      case 'rembourse': return 'Remboursé';
      default: return statut;
    }
  };

  const getModeLabel = (mode) => {
    switch(mode) {
      case 'orange_money': return 'Orange Money';
      case 'wave': return 'Wave';
      case 'carte': return 'Carte bancaire';
      case 'moov_money': return 'Moov Money';
      case 'essai': return 'Aucun (Essai)';
      default: return mode;
    }
  };

  const getModeColor = (mode) => {
    switch(mode) {
      case 'orange_money': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'wave': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'carte': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'moov_money': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border';
    }
  };

  // Forcer la validation manuelle d'un paiement en suspens (Action Admin)
  const handleValider = async (id) => {
    try {
      toast.loading("Validation forcée de la transaction...");
      await api.put(`/inscriptions/${id}/valider-paiement-manuel`); // Route à créer si nécessaire
      toast.dismiss();
      toast.success("Paiement validé avec succès !");
      fetchPaiements();
    } catch (err) {
      toast.dismiss();
      toast.error("Erreur lors de la validation");
    }
  };

  // Enregistrer un remboursement
  const handleRembourser = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir marquer cette inscription comme remboursée ?')) {
      try {
        toast.loading("Mise à jour du remboursement...");
        await api.put(`/inscriptions/${id}/rembourser`); // Route optionnelle
        toast.dismiss();
        toast.success("Remboursement enregistré.");
        fetchPaiements();
      } catch (err) {
        toast.dismiss();
        toast.error("Erreur de traitement");
      }
    }
  };

  const handleVoirDetails = (paiement) => {
    setPaiementSelectionne(paiement);
    setModalDetailsOuverte(true);
  };

  // Exporter la situation comptable réelle en CSV
  const handleExporterCSV = () => {
    const headers = ['ID', 'Apprenant', 'Formation', 'Montant', 'Mode', 'Date', 'Statut', 'Transaction ID', 'Téléphone'];
    const rows = paiementsFiltres.map(p => [
      p.id,
      p.apprenant,
      p.formation,
      p.montant,
      getModeLabel(p.mode),
      p.date ? new Date(p.date).toLocaleString('fr-FR') : '-',
      getStatutLabel(p.statut),
      p.transactionId,
      p.telephone || ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `comptabilite_pschool_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR') + ' ' + new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Suivi des Flux Financiers</h1>
          <p className="text-gray-500 text-sm mt-1">
            Visualisez et gérez les encaissements CinetPay et les essais gratuits
          </p>
        </div>
        <button
          onClick={handleExporterCSV}
          className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg transition text-sm font-semibold"
        >
          <HiOutlineDownload className="h-5 w-5" />
          Exporter l'état financier
        </button>
      </div>

      {/* Statistiques Dynamiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Chiffre d'Affaires Global</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatPrix(totalMontant)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">En attente de paiement</p>
          <p className="text-2xl font-black text-orange-600 mt-1">{formatPrix(totalEnAttente)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Encaissé Securisé</p>
          <p className="text-2xl font-black text-green-600 mt-1">{formatPrix(totalValide)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Décaissements (Remboursé)</p>
          <p className="text-2xl font-black text-purple-600 mt-1">{formatPrix(totalRembourse)}</p>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Filtrer par apprenant, formation ou référence de reçu..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm bg-white font-medium text-gray-700"
        >
          <option value="tous">Tous les états financiers</option>
          <option value="valide">Validés (Payés)</option>
          <option value="essai">En mode Essai</option>
          <option value="en_attente">En attente</option>
          <option value="echoue">Échoués</option>
          <option value="rembourse">Remboursés</option>
        </select>
        <select
          value={filtreMode}
          onChange={(e) => setFiltreMode(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm bg-white font-medium text-gray-700"
        >
          <option value="tous">Tous les modes</option>
          <option value="orange_money">Orange Money</option>
          <option value="moov_money">Moov Money</option>
          <option value="wave">Wave</option>
          <option value="carte">Carte bancaire</option>
          <option value="essai">Sans paiement (Essai)</option>
        </select>
      </div>

      {/* Tableau ou loader */}
      {chargement ? (
        <div className="p-12 text-center text-gray-400 italic bg-white rounded-xl border">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
          Génération de l'état comptable en direct...
        </div>
      ) : paiementsFiltres.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-400 font-medium">
          Aucune écriture comptable ne correspond aux filtres appliqués.
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left border-collapse">
              <thead className="bg-gray-50 border-b text-gray-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID Ref</th>
                  <th className="px-6 py-4">Apprenant</th>
                  <th className="px-6 py-4">Formation</th>
                  <th className="px-6 py-4">Montant initial</th>
                  <th className="px-6 py-4">Mode d'encaissement</th>
                  <th className="px-6 py-4">Date écriture</th>
                  <th className="px-6 py-4">Statut Transaction</th>
                  <th className="text-center px-6 py-4">Ajustements</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-gray-700">
                {paiementsFiltres.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{p.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{p.apprenant}</td>
                    <td className="px-6 py-4 text-gray-600">{p.formation}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatPrix(p.montant)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getModeColor(p.mode)}`}>
                        {getModeLabel(p.mode)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(p.date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatutColor(p.statut)}`}>
                        {getStatutLabel(p.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleVoirDetails(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg transition"
                          title="Fiche détaillée"
                        >
                          <HiOutlineEye className="h-5 w-5" />
                        </button>
                        {p.statut === 'en_attente' && (
                          <button 
                            onClick={() => handleValider(p.id)}
                            className="p-2 text-green-600 hover:bg-green-50 border border-transparent hover:border-green-200 rounded-lg transition"
                            title="Forcer la validation financière"
                          >
                            <HiOutlineCheckCircle className="h-5 w-5" />
                          </button>
                        )}
                        {p.statut === 'valide' && (
                          <button 
                            onClick={() => handleRembourser(p.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-200 rounded-lg transition"
                            title="Marquer comme Remboursé"
                          >
                            <HiOutlineRefresh className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modale des détails */}
      {modalDetailsOuverte && paiementSelectionne && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalDetailsOuverte(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border">
              <div className="flex items-center justify-between p-6 border-b bg-gray-50">
                <div>
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Pièce Comptable</h2>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">ID #{paiementSelectionne.id}</p>
                </div>
                <button onClick={() => setModalDetailsOuverte(false)} className="p-2 bg-white border rounded-xl hover:text-red-500 transition shadow-sm">
                  <HiOutlineXCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-sm divide-y divide-gray-50">
                <div className="flex justify-between pt-1">
                  <span className="text-gray-400 font-medium">Nom de l'Apprenant</span>
                  <span className="font-bold text-gray-900">{paiementSelectionne.apprenant}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-gray-400 font-medium">Formation ciblée</span>
                  <span className="font-semibold text-gray-800">{paiementSelectionne.formation}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-gray-400 font-medium">Frais d'inscription</span>
                  <span className="font-black text-emerald-600 text-base">{formatPrix(paiementSelectionne.montant)}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-gray-400 font-medium">Passerelle de Paiement</span>
                  <span className="font-bold text-gray-800">{getModeLabel(paiementSelectionne.mode)}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-gray-400 font-medium">Date & Heure d'écriture</span>
                  <span className="font-medium text-gray-700 text-xs">{formatDate(paiementSelectionne.date)}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-gray-400 font-medium">État comptable</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatutColor(paiementSelectionne.statut)}`}>
                    {getStatutLabel(paiementSelectionne.statut)}
                  </span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-gray-400 font-medium">Référence CinetPay ID</span>
                  <span className="font-mono text-[11px] bg-slate-50 px-2 py-1 rounded border text-slate-600">{paiementSelectionne.transactionId}</span>
                </div>
                {paiementSelectionne.telephone && (
                  <div className="flex justify-between pt-3">
                    <span className="text-gray-400 font-medium">Contact Émetteur</span>
                    <span className="font-semibold text-gray-800">{paiementSelectionne.telephone}</span>
                  </div>
                )}
              </div>
              <div className="p-6 bg-gray-50">
                <button
                  onClick={() => setModalDetailsOuverte(false)}
                  className="w-full py-3 bg-white border-2 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition shadow-sm"
                >
                  Quitter la fiche
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPaiements;