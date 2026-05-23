import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { HiOutlineEye, HiOutlineCheck, HiOutlineX, HiOutlineDownload, HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';

const GestionInscriptionsSession = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreType, setFiltreType] = useState('tous'); // NOUVEAU : filtre par type
  const [stats, setStats] = useState({ total: 0, en_attente: 0, confirmees: 0, annulees: 0, enfants: 0, adultes: 0 });
  const [inscriptionSelectionnee, setInscriptionSelectionnee] = useState(null);

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const fetchInscriptions = async () => {
    try {
      const response = await api.get('/inscriptions-session');
      
      // Vérification de la structure de la réponse
      let inscriptionsData = [];
      let statsData = { total: 0, en_attente: 0, confirmees: 0, annulees: 0, enfants: 0, adultes: 0 };
      
      if (response.data && Array.isArray(response.data)) {
        inscriptionsData = response.data;
        // Calculer les stats
        statsData = {
          total: inscriptionsData.length,
          en_attente: inscriptionsData.filter(i => i.statut === 'en_attente').length,
          confirmees: inscriptionsData.filter(i => i.statut === 'confirmee').length,
          annulees: inscriptionsData.filter(i => i.statut === 'annulee').length,
          enfants: inscriptionsData.filter(i => i.type_inscription === 'enfant').length,
          adultes: inscriptionsData.filter(i => i.type_inscription === 'adulte').length,
        };
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        inscriptionsData = response.data.data;
        statsData = response.data.stats || statsData;
      }
      
      setInscriptions(inscriptionsData);
      setStats(statsData);
    } catch (error) {
      toast.error("Erreur de chargement");
      setInscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async (id, statut) => {
    try {
      await api.put(`/inscriptions-session/${id}/statut`, { statut });
      toast.success(`Inscription ${statut === 'confirmee' ? 'confirmée' : 'annulée'}`);
      fetchInscriptions();
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };

  const deleteInscription = async (id) => {
    if (window.confirm('Supprimer cette inscription ?')) {
      try {
        await api.delete(`/inscriptions-session/${id}`);
        toast.success('Inscription supprimée');
        fetchInscriptions();
      } catch (error) {
        toast.error("Erreur de suppression");
      }
    }
  };
const exportCSV = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Utiliser fetch directement au lieu d'axios pour éviter les problèmes de parsing
    const response = await fetch('http://127.0.0.1:8000/api/inscriptions-session/export/csv', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/csv'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    // Récupérer le blob
    const blob = await response.blob();
    
    // Créer le lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inscriptions_session_${new Date().toISOString().slice(0, 19)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    toast.success('Export CSV réussi');
  } catch (error) {
    console.error("Erreur export:", error);
    toast.error("Erreur lors de l'export: " + error.message);
  }
};;

  // Filtrer les inscriptions avec vérification de sécurité
  const inscriptionsFiltrees = Array.isArray(inscriptions) && inscriptions.length > 0
    ? inscriptions.filter(i => {
        // Filtre par statut
        if (filtreStatut !== 'tous' && i.statut !== filtreStatut) return false;
        
        // NOUVEAU : Filtre par type (enfant/adulte)
        if (filtreType !== 'tous' && i.type_inscription !== filtreType) return false;
        
        // Filtre par recherche
        if (search) {
          const recherche = search.toLowerCase();
          return (
            (i.parent_nom?.toLowerCase().includes(recherche) || false) ||
            (i.parent_prenom?.toLowerCase().includes(recherche) || false) ||
            (i.eleve_nom?.toLowerCase().includes(recherche) || false) ||
            (i.eleve_prenom?.toLowerCase().includes(recherche) || false) ||
            (i.parent_telephone?.includes(recherche) || false) ||
            (i.apprenant_email?.toLowerCase().includes(recherche) || false)
          );
        }
        return true;
      })
    : [];

  const getStatutBadge = (statut) => {
    const classes = {
      en_attente: 'bg-yellow-100 text-yellow-800',
      confirmee: 'bg-green-100 text-green-800',
      annulee: 'bg-red-100 text-red-800'
    };
    const libelles = {
      en_attente: 'En attente',
      confirmee: 'Confirmée',
      annulee: 'Annulée'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[statut] || 'bg-gray-100 text-gray-800'}`}>
        {libelles[statut] || statut}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    if (type === 'enfant') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Enfant</span>;
    } else if (type === 'adulte') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Adulte</span>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inscriptions aux sessions</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les demandes d'inscription aux formations programmées</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          <HiOutlineDownload size={18} />
          Exporter CSV
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.en_attente}</div>
          <div className="text-sm text-gray-500">En attente</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{stats.confirmees}</div>
          <div className="text-sm text-gray-500">Confirmées</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">{stats.annulees}</div>
          <div className="text-sm text-gray-500">Annulées</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.enfants}</div>
          <div className="text-sm text-gray-500">Enfants</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.adultes}</div>
          <div className="text-sm text-gray-500">Adultes</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Filtre par statut */}
        <div className="flex gap-2">
          {['tous', 'en_attente', 'confirmee', 'annulee'].map((statut) => (
            <button
              key={statut}
              onClick={() => setFiltreStatut(statut)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filtreStatut === statut
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {statut === 'tous' ? 'Tous statuts' : 
               statut === 'en_attente' ? 'En attente' :
               statut === 'confirmee' ? 'Confirmées' : 'Annulées'}
            </button>
          ))}
        </div>
        
        {/* NOUVEAU : Filtre par type */}
        <div className="flex gap-2">
          <button
            onClick={() => setFiltreType('tous')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filtreType === 'tous'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous types
          </button>
          <button
            onClick={() => setFiltreType('enfant')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filtreType === 'enfant'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Enfants
          </button>
          <button
            onClick={() => setFiltreType('adulte')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filtreType === 'adulte'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Adultes
          </button>
        </div>
        
        {/* Recherche */}
        <div className="relative flex-1 max-w-sm">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, téléphone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Élève / Apprenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inscriptionsFiltrees.length > 0 ? (
                inscriptionsFiltrees.map((inscription) => (
                  <tr key={inscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">#{inscription.id}</td>
                    <td className="px-6 py-4">{getTypeBadge(inscription.type_inscription)}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {inscription.parent_prenom} {inscription.parent_nom}
                      </div>
                      <div className="text-xs text-gray-400">{inscription.parent_zone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {inscription.type_inscription === 'enfant' ? (
                        <>
                          <div className="text-sm text-gray-800">
                            {inscription.eleve_prenom} {inscription.eleve_nom}
                          </div>
                          <div className="text-xs text-gray-400">
                            {inscription.eleve_age} ans - {inscription.eleve_niveau_etude}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm text-gray-800">
                            {inscription.apprenant_email}
                          </div>
                          <div className="text-xs text-gray-400">
                            Format: {inscription.format === 'presentiel' ? 'Présentiel' : 'En ligne'}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{inscription.parent_telephone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{inscription.session_choisie}</td>
                    <td className="px-6 py-4">{getStatutBadge(inscription.statut)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(inscription.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setInscriptionSelectionnee(inscription)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Voir détails"
                        >
                          <HiOutlineEye size={18} />
                        </button>
                        {inscription.statut === 'en_attente' && (
                          <>
                            <button
                              onClick={() => updateStatut(inscription.id, 'confirmee')}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Confirmer"
                            >
                              <HiOutlineCheck size={18} />
                            </button>
                            <button
                              onClick={() => updateStatut(inscription.id, 'annulee')}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Annuler"
                            >
                              <HiOutlineX size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-400">
                    Aucune inscription trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détails */}
      {inscriptionSelectionnee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Détails de l'inscription</h2>
              <button
                onClick={() => setInscriptionSelectionnee(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Type d'inscription */}
              <div className="mb-4">
                {getTypeBadge(inscriptionSelectionnee.type_inscription)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Informations parent</h3>
                  <p className="text-sm"><span className="text-gray-500">Nom:</span> {inscriptionSelectionnee.parent_nom}</p>
                  <p className="text-sm"><span className="text-gray-500">Prénom:</span> {inscriptionSelectionnee.parent_prenom}</p>
                  <p className="text-sm"><span className="text-gray-500">Adresse:</span> {inscriptionSelectionnee.parent_adresse}</p>
                  <p className="text-sm"><span className="text-gray-500">Téléphone:</span> {inscriptionSelectionnee.parent_telephone}</p>
                  <p className="text-sm"><span className="text-gray-500">Zone:</span> {inscriptionSelectionnee.parent_zone}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    {inscriptionSelectionnee.type_inscription === 'enfant' ? 'Informations élève' : 'Informations apprenant'}
                  </h3>
                  {inscriptionSelectionnee.type_inscription === 'enfant' ? (
                    <>
                      <p className="text-sm"><span className="text-gray-500">Nom:</span> {inscriptionSelectionnee.eleve_nom}</p>
                      <p className="text-sm"><span className="text-gray-500">Prénom:</span> {inscriptionSelectionnee.eleve_prenom}</p>
                      <p className="text-sm"><span className="text-gray-500">Âge:</span> {inscriptionSelectionnee.eleve_age} ans</p>
                      <p className="text-sm"><span className="text-gray-500">Niveau:</span> {inscriptionSelectionnee.eleve_niveau_etude}</p>
                      <p className="text-sm"><span className="text-gray-500">Établissement:</span> {inscriptionSelectionnee.eleve_etablissement}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm"><span className="text-gray-500">Email:</span> {inscriptionSelectionnee.apprenant_email}</p>
                      <p className="text-sm"><span className="text-gray-500">Format:</span> {inscriptionSelectionnee.format === 'presentiel' ? 'Présentiel' : 'En ligne'}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm"><span className="text-gray-500">Session choisie:</span> {inscriptionSelectionnee.session_choisie}</p>
                <p className="text-sm"><span className="text-gray-500">Source:</span> {inscriptionSelectionnee.source || 'Non précisée'}</p>
                <p className="text-sm"><span className="text-gray-500">Statut:</span> {getStatutBadge(inscriptionSelectionnee.statut)}</p>
                <p className="text-sm"><span className="text-gray-500">Date d'inscription:</span> {new Date(inscriptionSelectionnee.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setInscriptionSelectionnee(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionInscriptionsSession;