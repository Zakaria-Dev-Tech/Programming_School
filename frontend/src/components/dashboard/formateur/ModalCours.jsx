import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { HiOutlineX, HiOutlineUpload, HiOutlineDocumentText } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ModalCours = ({ isOpen, onClose, formationId, onRefresh, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    ordre: 1,
    statut: 'actif',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        titre: initialData.titre || '',
        description: initialData.description || '',
        ordre: initialData.ordre || 1,
        statut: initialData.statut || 'actif',
      });
    } else {
      setFormData({ titre: '', description: '', ordre: 1, statut: 'actif' });
      setFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!initialData && !file) return toast.error("Veuillez sélectionner un fichier (Vidéo ou PDF)");

    setLoading(true);
    const data = new FormData();
    data.append('formation_id', formationId);
    data.append('titre', formData.titre);
    data.append('description', formData.description);
    data.append('ordre', formData.ordre);
    data.append('statut', formData.statut);
    
    if (file) data.append('fichier', file);

    try {
      if (initialData) {
        data.append('_method', 'PUT'); 
        await api.post(`/cours/${initialData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success("Chapitre mis à jour !");
      } else {
        await api.post('/cours', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success("Chapitre ajouté !");
      }
      onRefresh(); 
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Modifier le chapitre' : 'Nouveau Contenu'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition">
            <HiOutlineX className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Titre du chapitre</label>
            <input 
              type="text" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all" 
              value={formData.titre} 
              onChange={(e) => setFormData({...formData, titre: e.target.value})} 
            />
          </div>

          {/* Fichier */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              {initialData ? "Changer le support (Optionnel)" : "Support (Vidéo ou PDF)"}
            </label>
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
              <input type="file" id="file-upload" className="hidden" accept=".mp4,.pdf" onChange={(e) => setFile(e.target.files[0])} />
              {file ? (
                <div className="text-center">
                   <HiOutlineDocumentText className="w-8 h-8 text-blue-500 mx-auto" />
                   <p className="text-xs font-bold text-blue-600 mt-2">{file.name}</p>
                </div>
              ) : (
                <HiOutlineUpload className="w-8 h-8 text-slate-300" />
              )}
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none h-20 resize-none transition-all"
              placeholder="Résumé du cours..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

        
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Ordre</label>
              <input 
                type="number" 
                min="1"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all" 
                value={formData.ordre} 
                onChange={(e) => setFormData({...formData, ordre: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Statut</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white transition-all" 
                value={formData.statut} 
                onChange={(e) => setFormData({...formData, statut: e.target.value})}
              >
                <option value="actif">Public</option>
                <option value="inactif">Brouillon</option>
              </select>
            </div>
          </div>

          {/* Bouton Validation */}
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
              loading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-100'
            }`}
          >
            {loading ? "Enregistrement..." : (initialData ? 'Mettre à jour le cours' : 'Enregistrer le cours')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalCours;