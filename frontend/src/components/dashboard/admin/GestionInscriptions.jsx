import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineEye, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationSuppression from './ConfirmationSuppression';
import api from '../../../services/api';

const GestionInscriptions = () => {
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [inscriptions, setInscriptions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modalDetailsOuverte, setModalDetailsOuverte] = useState(false);
  const [inscriptionSelectionnee, setInscriptionSelectionnee] = useState(null);
  const [suppressionOuverte, setSuppressionOuverte] = useState(false);
  const [inscriptionASupprimer, setInscriptionASupprimer] = useState(null);

  // Charger les inscriptions depuis l'API
  const fetchInscriptions = async () => {
    try {
      setChargement(true);
      const data = await api.get('/inscriptions');
      console.log('Données reçues:', data); // Pour debug
      setInscriptions(data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      toast.error("Erreur de chargement des inscriptions");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    fetchInscriptions();
  }, []);

  // Valider une inscription
  const handleValider = async (id) => {
    try {
      await api.put(`/inscriptions/${id}/valider`);
      toast.success("Inscription validée avec succès");
      fetchInscriptions();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la validation");
    }
  };

  // Annuler une inscription
  const handleAnnuler = async (id) => {
    try {
      await api.put(`/inscriptions/${id}/annuler`);
      toast.success("Inscription annulée");
      fetchInscriptions();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'annulation");
    }
  };

  // Voir les détails
  const handleVoirDetails = (inscription) => {
    setInscriptionSelectionnee(inscription);
    setModalDetailsOuverte(true);
  };

  // Supprimer une inscription
  const handleSupprimerClick = (inscription) => {
    setInscriptionASupprimer(inscription);
    setSuppressionOuverte(true);
  };

  const handleSupprimerConfirmer = async () => {
    try {
      await api.delete(`/inscriptions/${inscriptionASupprimer.id}`);
      toast.success("Inscription supprimée");
      setSuppressionOuverte(false);
      fetchInscriptions();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Filtrer les inscriptions
  const inscriptionsFiltrees = inscriptions.filter(ins => {
    const matchRecherche = ins.apprenant_nom?.toLowerCase().includes(recherche.toLowerCase()) ||
                           ins.formation_titre?.toLowerCase().includes(recherche.toLowerCase());
    const matchStatut = filtreStatut === 'tous' || ins.statut === filtreStatut;
    return matchRecherche && matchStatut;
  });

  // Couleurs des badges du Dossier
  const getStatutColor = (statut) => {
    switch(statut) {
      case 'confirmee': return 'bg-green-100 text-green-700';
      case 'en_attente': return 'bg-orange-100 text-orange-700';
      case 'annulee': return 'bg-red-100 text-red-700';
      case 'terminee': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutLabel = (statut) => {
    switch(statut) {
      case 'confirmee': return 'Confirmée';
      case 'en_attente': return 'En attente';
      case 'annulee': return 'Annulée';
      case 'terminee': return 'Terminée';
      default: return statut;
    }
  };

  // NOUVEAU : Gestion dynamique des couleurs de la colonne CinetPay
  const getPaiementColor = (statutPaiement) => {
    switch(statutPaiement) {
      case 'paye': return 'bg-green-100 text-green-700';
      case 'essai': return 'bg-blue-100 text-blue-700';
      case 'en_attente': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // NOUVEAU : Gestion dynamique des libellés financiers
  const getPaiementLabel = (statutPaiement) => {
    switch(statutPaiement) {
      case 'paye': return 'Payé (CinetPay)';
      case 'essai': return 'Essai Gratuit';
      case 'en_attente': return 'En attente';
      default: return statutPaiement || 'Essai Gratuit';
    }
  };

  // Formater la date
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // Formater le prix
  const formatPrix = (prix) => {
    if (!prix) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA';
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Inscriptions</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerez toutes les inscriptions aux formations
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {inscriptionsFiltrees.length} inscription(s)
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par apprenant ou formation..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="tous">Tous les statuts</option>
          <option value="confirmee">Confirmées</option>
          <option value="en_attente">En attente</option>
          <option value="annulee">Annulées</option>
          <option value="terminee">Terminées</option>
        </select>
      </div>

      {/* Tableau des inscriptions */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {chargement ? (
          <div className="p-12 text-center text-gray-400 italic">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            Chargement des inscriptions...
          </div>
        ) : inscriptionsFiltrees.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">Aucune inscription trouvée</p>
            <p className="text-sm mt-1">Aucune inscription ne correspond à vos critères</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-gray-600 text-sm font-semibold">
                <tr>
                  <th className="p-4">Apprenant</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Formation</th>
                  <th className="p-4">Date d'inscription</th>
                  <th className="p-4">Montant</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Paiement</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inscriptionsFiltrees.map((ins) => (
                  <tr key={ins.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{ins.apprenant_nom || 'Inconnu'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ins.apprenant_type === 'enfant' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {ins.apprenant_type === 'enfant' ? ' Enfant' : ' Adulte'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{ins.formation_titre || 'Formation supprimée'}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{formatDate(ins.date_inscription)}</td>
                    <td className="p-4">
                      <span className="font-semibold text-green-600">{formatPrix(ins.montant)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(ins.statut)}`}>
                        {getStatutLabel(ins.statut)}
                      </span>
                    </td>
                    {/* MODIFIÉ : Utilisation directe du vrai champ statut_paiement de Laravel */}
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaiementColor(ins.statut_paiement)}`}>
                        {getPaiementLabel(ins.statut_paiement)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleVoirDetails(ins)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Voir détails"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                        {ins.statut === 'en_attente' && (
                          <>
                            <button 
                              onClick={() => handleValider(ins.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Valider"
                            >
                              <HiOutlineCheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleAnnuler(ins.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Annuler"
                            >
                              <HiOutlineXCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleSupprimerClick(ins)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modale des détails */}
      {modalDetailsOuverte && inscriptionSelectionnee && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalDetailsOuverte(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
              
              {/* En-tête de la Modale */}
              <div className="flex items-center justify-between p-6 border-b bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Détails Inscription</h2>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Référence #{inscriptionSelectionnee.id}</p>
                </div>
                <button 
                  onClick={() => setModalDetailsOuverte(false)} 
                  className="p-2 rounded-xl bg-white border shadow-sm hover:text-red-500 transition-colors"
                >
                  <HiOutlineX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                
                {/* Section Apprenant & Formation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Apprenant</label>
                    <p className="font-bold text-slate-900 text-lg leading-tight uppercase">{inscriptionSelectionnee.apprenant_nom}</p>
                  </div>
                  <div className="text-right">
                    <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Type</label>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        inscriptionSelectionnee.apprenant_type === 'enfant' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {inscriptionSelectionnee.apprenant_type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BLOC SPÉCIFIQUE ENFANT */}
                {inscriptionSelectionnee.apprenant_type === 'enfant' && (
                  <div className="bg-blue-50/50 rounded-[1.5rem] border border-blue-100 p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] text-blue-500 uppercase font-black tracking-widest">Âge de l'élève</label>
                        <p className="font-bold text-slate-800">{inscriptionSelectionnee.apprenant_age || '--'} ans</p>
                      </div>
                      <div className="text-right">
                        <label className="text-[9px] text-blue-500 uppercase font-black tracking-widest">Niveau d'études</label>
                        <p className="font-bold text-slate-800">{inscriptionSelectionnee.apprenant_niveau || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-blue-100/50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] text-blue-500 uppercase font-black tracking-widest">Établissement</label>
                          <p className="font-bold text-slate-800 text-sm leading-tight">
                            {inscriptionSelectionnee.apprenant_nom_ecole || 'Non renseigné'}
                          </p>
                        </div>
                        <div className="text-right">
                          <label className="text-[9px] text-blue-500 uppercase font-black tracking-widest">Localité</label>
                          <p className="font-bold text-slate-800 text-sm">
                            {inscriptionSelectionnee.apprenant_localite_ecole || 'Non précisée'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-blue-200/50">
                      <div className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-blue-100">
                        <div>
                          <label className="text-[9px] text-orange-600 uppercase font-black tracking-widest">Parent Responsable</label>
                          <p className="font-black text-slate-900 uppercase text-xs mt-0.5">
                            {inscriptionSelectionnee.parent_nom || "N/A"}
                          </p>
                        </div>
                        <div className="h-8 w-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-black">P</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Détails Formation & Finance */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">Formation choisie</span>
                    <span className="text-sm font-bold text-slate-900">{inscriptionSelectionnee.formation_titre}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">Date d'inscription</span>
                    <span className="text-sm font-bold text-slate-900">{formatDate(inscriptionSelectionnee.date_inscription)}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">Montant total</span>
                    <span className="text-lg font-black text-green-600">{formatPrix(inscriptionSelectionnee.montant)}</span>
                  </div>

                  {/* AJOUTÉ : Statut financier CinetPay dans la modale de détails */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">Statut du paiement</span>
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${getPaiementColor(inscriptionSelectionnee.statut_paiement)}`}>
                      {getPaiementLabel(inscriptionSelectionnee.statut_paiement)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-gray-500 font-medium">État du dossier</span>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatutColor(inscriptionSelectionnee.statut)}`}>
                      {getStatutLabel(inscriptionSelectionnee.statut)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pied de Modale */}
              <div className="p-6 bg-gray-50 flex gap-3">
                <button
                  onClick={() => setModalDetailsOuverte(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition"
                >
                  Fermer
                </button>
                {inscriptionSelectionnee.statut === 'en_attente' && (
                  <button
                    onClick={() => { handleValider(inscriptionSelectionnee.id); setModalDetailsOuverte(false); }}
                    className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition shadow-lg shadow-slate-200"
                  >
                    Valider maintenant
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale de confirmation de suppression */}
      <ConfirmationSuppression 
        isOpen={suppressionOuverte}
        onClose={() => setSuppressionOuverte(false)}
        onConfirm={handleSupprimerConfirmer}
        formationTitre={inscriptionASupprimer?.formation_titre}
        type="cet apprenant"
      />
    </div>
  );
};

export default GestionInscriptions;