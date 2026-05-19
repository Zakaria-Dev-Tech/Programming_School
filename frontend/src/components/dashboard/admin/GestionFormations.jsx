import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineBookOpen, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
// CORRECTION : Vérifie bien le nom du fichier (sans 's' si c'est ModaleFormation.jsx)
import ModaleFormations from './ModaleFormations'; 
import ConfirmationSuppression from './ConfirmationSuppression';
import Toast from '../../../components/Toast';
import api from '../../../services/api';

const GestionFormations = () => {
  const [recherche, setRecherche] = useState('');
  const [filtrePublic, setFiltrePublic] = useState('tous');
  const [formations, setFormations] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [formationSelectionnee, setFormationSelectionnee] = useState(null);
  const [suppressionOuverte, setSuppressionOuverte] = useState(false);
  const [formationASupprimer, setFormationASupprimer] = useState(null);
  const [categoriesListe, setCategoriesListe] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  const fetchFormations = async () => {
    try {
      setChargement(true);
      const response = await api.get('/formations');
      // On s'assure de récupérer data si ton instance axios ne le fait pas automatiquement
      setFormations(response.data || response); 
    } catch (error) {
      console.error("Erreur de chargement:", error);
      showToast("Erreur lors du chargement des formations", "error");
    } finally {
      setChargement(false);
    }
  };

  const fetchFormateurs = async () => {
    try {
      const response = await api.get('/formateurs');
      setFormateurs(response.data || response);
    } catch (error) {
      console.error("Erreur chargement formateurs:", error);
      setFormateurs([]);
    }
  };

  useEffect(() => {
    fetchFormations();
    fetchFormateurs();
  }, []);

  useEffect(() => {
    if (formations.length > 0) {
      const categories = [...new Set(formations.map(f => f.categorie).filter(Boolean))];
      setCategoriesListe(categories);
    }
  }, [formations]);

  const handleSave = async (formData, isEdit) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (isEdit && formationSelectionnee) {
        const id = formationSelectionnee.id;
        // On ajoute le spoofing de méthode pour Laravel
        formData.append('_method', 'PUT'); 
        await api.post(`/formations/${id}`, formData, config);
        showToast("Formation modifiée avec succès !");
      } else {
        await api.post('/formations', formData, config);
        showToast("Formation créée avec succès !");
      }
      
      await fetchFormations();
      setModaleOuverte(false);
    } catch (error) {
      console.error("Erreur save:", error);
      const msg = error.response?.data?.message || "Erreur lors de l'enregistrement";
      showToast(msg, "error");
    }
  };

  const handleSupprimerConfirmer = async () => {
    try {
      await api.delete(`/formations/${formationASupprimer.id}`);
      setSuppressionOuverte(false);
      await fetchFormations();
      showToast("Formation supprimée avec succès !");
    } catch (error) {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const formationsFiltrees = formations.filter(f => 
    f.titre?.toLowerCase().includes(recherche.toLowerCase()) && 
    (filtrePublic === 'tous' || f.public_cible?.toLowerCase() === filtrePublic.toLowerCase())
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight font-heading">Gestion des Formations</h1>
          <p className="text-gray-500 text-sm">Pilotez le catalogue de P.School</p>
        </div>
        <button 
          onClick={() => { setFormationSelectionnee(null); setModaleOuverte(true); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 font-bold"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Ajouter une formation
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher par titre..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white font-medium text-gray-600"
          value={filtrePublic}
          onChange={(e) => setFiltrePublic(e.target.value)}
        >
          <option value="tous">Tous les publics</option>
          <option value="adulte">Adultes</option>
          <option value="enfant">Enfants</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {chargement ? (
          <div className="p-12 text-center text-gray-400 italic animate-pulse">Chargement du catalogue...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b text-gray-600 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4">Formation</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4 text-center">Modules</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4 text-center">Statut</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {formationsFiltrees.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={f.image?.startsWith('http') ? f.image : 'https://via.placeholder.com/150'} 
                          className="w-12 h-12 object-cover rounded-lg border shadow-sm" 
                          alt="" 
                        />
                        <div>
                          <div className="font-bold text-gray-800 line-clamp-1">{f.titre}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{f.duree} • {f.public_cible}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md uppercase">{f.categorie}</span>
                    </td>
                    <td className="p-4 text-center text-sm font-black text-gray-700">{f.nb_modules}</td>
                    <td className="p-4 font-black text-green-600 text-sm whitespace-nowrap">
                        {f.prix?.toLocaleString()} <span className="text-[9px]">FCFA</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        f.statut === 'actif' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {f.statut === 'actif' ? <><HiOutlineEye /> Actif</> : <><HiOutlineEyeOff /> Inactif</>}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button 
                          onClick={() => { setFormationSelectionnee(f); setModaleOuverte(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => { setFormationASupprimer(f); setSuppressionOuverte(true); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {formationsFiltrees.length === 0 && (
              <div className="p-20 text-center text-gray-400">
                <HiOutlineBookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium text-sm">Aucun programme trouvé.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ModaleFormation 
        isOpen={modaleOuverte} 
        onClose={() => setModaleOuverte(false)} 
        onSave={handleSave} 
        formationAModifier={formationSelectionnee}
        formateurs={formateurs}
        categoriesExistantes={categoriesListe}
      />

      <ConfirmationSuppression 
        isOpen={suppressionOuverte} 
        onClose={() => setSuppressionOuverte(false)} 
        onConfirm={handleSupprimerConfirmer} 
        formationTitre={formationASupprimer?.titre} 
        type="la formation"
      />
    </div>
  );
};

export default GestionFormations;