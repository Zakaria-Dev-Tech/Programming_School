import React, { useState, useEffect } from 'react';
import { 
  HiOutlineTrash, 
  HiPlus, 
  HiX, 
  HiOutlineShieldCheck,
  HiOutlineAcademicCap,
  HiOutlineChartBar
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

const MesEnfants = () => {
  const navigate = useNavigate();
  
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableFormations, setAvailableFormations] = useState([]);
  const [successData, setSuccessData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    prenom: '', nom: '', age: '', niveau_etude: '',
    nom_ecole: '', localite_ecole: '', formations_interet: []
  });

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await api.get('/enfants');
      setChildren(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erreur de chargement des profils");
    } finally {
      setLoading(false);
    }
  };

  const fetchFormationsEnfants = async () => {
    try {
      const data = await api.get('/formations?cible=enfant');
      setAvailableFormations(data);
    } catch (error) {
      console.error("Impossible de charger les formations");
    }
  };

  useEffect(() => { 
    fetchChildren();
    fetchFormationsEnfants();
  }, []);

  const handleCheckboxChange = (formationTitle) => {
    setFormData(prev => ({
      ...prev,
      formations_interet: prev.formations_interet.includes(formationTitle)
        ? prev.formations_interet.filter(f => f !== formationTitle)
        : [...prev.formations_interet, formationTitle]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.formations_interet.length === 0) return toast.error("Veuillez choisir une formation");

    setIsSubmitting(true);
    try {
      const response = await api.post('/enfants', formData);
      
      const credentials = response.credentials || response.data?.credentials;
      
      if (credentials) {
        setSuccessData(response.credentials ? response : response.data);
        toast.success("Enfant inscrit avec succès !");
      } else {
        toast.success("Enfant inscrit !");
      }
      
      setIsModalOpen(false);
      setFormData({ 
        prenom: '', nom: '', age: '', niveau_etude: '', 
        nom_ecole: '', localite_ecole: '', formations_interet: [] 
      });
      fetchChildren();
      
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data);
      toast.error(error.response?.data?.message || "Erreur d'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Supprimer ce profil ?")) return;
    try {
      await api.delete(`/enfants/${id}`);
      toast.success("Profil supprimé");
      fetchChildren();
    } catch (error) { 
      toast.error("Action impossible"); 
    }
  };

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin h-8 w-8 border-b-2 border-emerald-500 rounded-full"></div>
    </div>
  );

  return (
    <div className="p-6  min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Mes enfants</h2>
          <p className="text-xs text-slate-400 mt-0.5">Gérez les accès et suivez la progression</p>
        </div>
        <button 
          onClick={() => { setSuccessData(null); setIsModalOpen(true); }} 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <HiPlus className="w-4 h-4" /> Nouvel élève
        </button>
      </div>

      {/* Badge Succès */}
      {successData && successData.credentials && (
        <div className="mb-10 p-6 bg-white rounded-3xl border border-emerald-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="bg-emerald-50 p-2 rounded-xl">
            <QRCodeSVG 
              value={`${window.location.origin}/login/auto?token=${successData.credentials?.access_token || ''}`} 
              size={80} 
            />
          </div>
          <div className="flex-1">
            <h4 className="text-emerald-700 font-semibold text-sm flex items-center gap-2">
              <HiOutlineShieldCheck className="w-4 h-4" /> Accès généré avec succès
            </h4>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="text-xs">
                <span className="text-slate-400">Identifiant :</span> 
                <span className="font-medium text-slate-700 ml-1">{successData.credentials?.username}</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-400">Mot de passe :</span> 
                <span className="font-medium text-slate-700 ml-1">pschool2026</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Ces identifiants permettent à l'enfant de se connecter à son espace personnel
            </p>
          </div>
          <button 
            onClick={() => window.print()} 
            className="text-xs font-semibold text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors border border-emerald-100"
          >
            Imprimer le badge
          </button>
        </div>
      )}

      {/* Tableau des enfants */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Apprenant</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Âge</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {children.length > 0 ? (
              children.map((child) => (
                <tr key={child.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm uppercase">
                        {child.nom ? child.nom[0] : '?'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{child.nom}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {child.nom_ecole || 'Établissement'} • {child.niveau_etude}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs text-center font-medium">{child.age} ans</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/parent/suivi-enfant/${child.id}`)} 
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold text-[10px] uppercase hover:bg-blue-100 transition-all"
                      >
                        <HiOutlineChartBar className="w-3.5 h-3.5" /> Progression
                      </button>
                      <button 
                        onClick={() => handleDelete(child.id)} 
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-slate-400 text-sm">
                  Aucun enfant inscrit. Cliquez sur "Nouvel élève" pour commencer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal d'inscription */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">Inscription Élève</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1">Prénom</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm transition-all" 
                    value={formData.prenom} 
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1">Nom</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm transition-all" 
                    value={formData.nom} 
                    onChange={(e) => setFormData({...formData, nom: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1">Âge</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full p-3 bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm transition-all" 
                    value={formData.age} 
                    onChange={(e) => setFormData({...formData, age: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1">Niveau d'étude</label>
                  <select 
                    required 
                    className="w-full p-3 bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-xl outline-none text-sm" 
                    value={formData.niveau_etude} 
                    onChange={(e) => setFormData({...formData, niveau_etude: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Primaire">Primaire</option>
                    <option value="Collège">Collège</option>
                    <option value="Lycée">Lycée</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1">Établissement</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Nom de l'école" 
                    className="w-full p-3 bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-xl outline-none text-sm" 
                    value={formData.nom_ecole} 
                    onChange={(e) => setFormData({...formData, nom_ecole: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1">Ville / Quartier</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Localité" 
                    className="w-full p-3 bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-xl outline-none text-sm" 
                    value={formData.localite_ecole} 
                    onChange={(e) => setFormData({...formData, localite_ecole: e.target.value})} 
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-50 space-y-3">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                  <HiOutlineAcademicCap className="w-4 h-4"/> Formations d'intérêt
                </p>
                <div className="grid grid-cols-1 gap-2 max-h-28 overflow-y-auto pr-1">
                  {availableFormations.map((f) => (
                    <label key={f.id} className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-slate-100 cursor-pointer hover:border-emerald-200 transition-all text-xs">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-0" 
                        checked={formData.formations_interet.includes(f.titre)} 
                        onChange={() => handleCheckboxChange(f.titre)} 
                      />
                      <span className="font-medium text-slate-600">{f.titre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50 mt-2"
              >
                {isSubmitting ? "Enregistrement..." : "Confirmer l'inscription"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesEnfants;