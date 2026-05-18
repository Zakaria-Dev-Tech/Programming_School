import { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlineBookOpen, HiOutlinePhotograph, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineTag, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const ModaleFormation = ({ isOpen, onClose, onSave, formationAModifier, formateurs, categoriesExistantes }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    duree: '',
    nb_modules: '',
    categorie: '',
    public_cible: 'Adulte',
    statut: 'actif', 
    formateur_id: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nouvelleCategorie, setNouvelleCategorie] = useState(false);
  const [nouvelleCategorieValue, setNouvelleCategorieValue] = useState('');

  useEffect(() => {
    if (formationAModifier && isOpen) {
      setFormData({
        titre: formationAModifier.titre || '',
        description: formationAModifier.description || '',
        prix: formationAModifier.prix || '',
        duree: formationAModifier.duree || '',
        nb_modules: formationAModifier.nb_modules || '',
        categorie: formationAModifier.categorie || '',
        public_cible: formationAModifier.public_cible || 'Adulte',
        statut: formationAModifier.statut || 'actif',
        formateur_id: formationAModifier.formateur_id || ''
      });
      setPreviewUrl(formationAModifier.image); 
      setImageFile(null); 
      setNouvelleCategorie(false);
    } else if (isOpen) {
      setFormData({
        titre: '', description: '', prix: '', duree: '',
        nb_modules: '', categorie: '', public_cible: 'Adulte',
        statut: 'actif', formateur_id: ''
      });
      setImageFile(null);
      setPreviewUrl(null);
    }
  }, [formationAModifier, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('description', formData.description);
    data.append('prix', formData.prix);
    data.append('duree', formData.duree);
    data.append('nb_modules', formData.nb_modules);
    data.append('categorie', formData.categorie);
    data.append('public_cible', formData.public_cible);
    data.append('statut', formData.statut); // Envoi du statut à l'API
    
    if (formData.formateur_id) {
      data.append('formateur_id', formData.formateur_id);
    }

    if (imageFile instanceof File) {
      data.append('image', imageFile);
    }

    if (formationAModifier && formationAModifier.id) {
      data.append('_method', 'PUT');
    }

    try {
      await onSave(data, !!formationAModifier);
      onClose();
    } catch (error) {
      console.error("Erreur soumission formulaire:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {formationAModifier ? 'Modifier la formation' : 'Nouvelle Formation'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition">
            <HiOutlineX className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Section Statut - Ajoutée en haut pour visibilité immédiate */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {formData.statut === 'actif' ? (
                <HiOutlineEye className="text-green-600 h-5 w-5" />
              ) : (
                <HiOutlineEyeOff className="text-slate-400 h-5 w-5" />
              )}
              <span className="text-sm font-bold text-gray-700">Visibilité</span>
            </div>
            <select 
              value={formData.statut}
              onChange={(e) => setFormData({...formData, statut: e.target.value})}
              className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg outline-none cursor-pointer transition-colors ${
                formData.statut === 'actif' ? '' : ''
              }`}
            >
              <option value="actif">Actif </option>
              <option value="inactif">Inactif </option>
            </select>
          </div>

          {/* Section Image */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Visuel</label>
            {previewUrl && (
              <div className="relative h-40 w-full rounded-xl border overflow-hidden bg-gray-100 shadow-inner">
                <img src={previewUrl} className="w-full h-full object-cover" alt="Aperçu" />
              </div>
            )}
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center text-center px-4">
                <HiOutlinePhotograph className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-[10px] text-gray-500 font-bold uppercase">
                  {imageFile ? imageFile.name : "Changer l'image"}
                </p>
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required={!formationAModifier && !imageFile} />
            </label>
          </div>

          {/* Titre */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Titre de la formation *</label>
            <div className="relative">
              <HiOutlineBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="text" required 
                value={formData.titre}
                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                placeholder="Ex: Developpement Web Fullstack"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description détaillée *</label>
            <textarea 
              required 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              rows="3"
            />
          </div>

          {/* Prix, Durée et Modules */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Prix (FCFA)</label>
              <div className="relative">
                <HiOutlineCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="number" required 
                  value={formData.prix}
                  onChange={(e) => setFormData({...formData, prix: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Durée</label>
              <div className="relative">
                <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="text" required 
                  value={formData.duree}
                  onChange={(e) => setFormData({...formData, duree: e.target.value})}
                  placeholder="Ex: 3 mois"
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Nombre de modules */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nombre de modules</label>
            <input 
              type="number" required 
              value={formData.nb_modules}
              onChange={(e) => setFormData({...formData, nb_modules: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Catégorie</label>
            {!nouvelleCategorie ? (
              <select
                required
                value={formData.categorie}
                onChange={(e) => {
                  if (e.target.value === 'nouvelle') setNouvelleCategorie(true);
                  else setFormData({...formData, categorie: e.target.value});
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none bg-white"
              >
                <option value="">Sélectionner</option>
                {categoriesExistantes.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="nouvelle" className="text-green-600 font-bold">+ Nouvelle catégorie</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text" required autoFocus
                  value={nouvelleCategorieValue}
                  onChange={(e) => {
                    setNouvelleCategorieValue(e.target.value);
                    setFormData({...formData, categorie: e.target.value});
                  }}
                  className="flex-1 px-3 py-2 border border-green-500 rounded-lg outline-none"
                />
                <button type="button" onClick={() => setNouvelleCategorie(false)} className="text-[10px] uppercase font-black text-gray-400">Annuler</button>
              </div>
            )}
          </div>

          {/* Public et Formateur */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Public Cible</label>
              <select 
                value={formData.public_cible}
                onChange={(e) => setFormData({...formData, public_cible: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none bg-white"
              >
                <option value="Adulte">Adulte</option>
                <option value="Enfant">Enfant</option>
                <option value="Tous">Tous</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Formateur</label>
              <select 
                required 
                value={formData.formateur_id}
                onChange={(e) => setFormData({...formData, formateur_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none bg-white font-medium"
              >
                <option value="">Choisir</option>
                {formateurs.map(f => (
                  <option key={f.id} value={f.id}>{f.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Boutons Actions */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition">Annuler</button>
            <button 
              type="submit" 
              disabled={loading}
              className={`flex-1 py-3 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Traitement...' : (formationAModifier ? 'Sauvegarder' : 'Créer la formation')}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default ModaleFormation;