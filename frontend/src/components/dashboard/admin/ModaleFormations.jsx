import { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlineBookOpen, HiOutlinePhotograph, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const ModaleFormation = ({ isOpen, onClose, onSave, formationAModifier, formateurs, categoriesExistantes }) => {
    const [formData, setFormData] = useState({
        titre: '', description: '', prix: '', duree: '',
        nb_modules: '', categorie: '', public_cible: 'Adulte',
        statut: 'actif', formateur_id: ''
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
            // Afficher l'image seulement si c'est un lien Cloudinary valide
            setPreviewUrl(formationAModifier.image?.startsWith('http') ? formationAModifier.image : null);
            setImageFile(null);
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
        // On remplit le FormData dynamiquement
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        // Si une nouvelle image a été choisie
        if (imageFile instanceof File) {
            data.append('image', imageFile);
        }

        // Simuler PUT pour Laravel si on modifie
        if (formationAModifier?.id) {
            data.append('_method', 'PUT');
        }

        try {
            await onSave(data, !!formationAModifier, formationAModifier?.id);
            onClose();
        } catch (error) {
            alert("Erreur serveur : Vérifiez que l'image n'est pas trop lourde ou que le token est valide.");
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
                    {/* Statut */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {formData.statut === 'actif' ? <HiOutlineEye className="text-green-600 h-5 w-5" /> : <HiOutlineEyeOff className="text-slate-400 h-5 w-5" />}
                            <span className="text-sm font-bold text-gray-700">Visibilité</span>
                        </div>
                        <select 
                            value={formData.statut}
                            onChange={(e) => setFormData({...formData, statut: e.target.value})}
                            className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg outline-none cursor-pointer"
                        >
                            <option value="actif">Actif</option>
                            <option value="inactif">Inactif</option>
                        </select>
                    </div>

                    {/* Image */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Image de couverture</label>
                        {previewUrl && (
                            <div className="relative h-40 w-full rounded-xl border overflow-hidden bg-gray-100">
                                <img src={previewUrl} className="w-full h-full object-cover" alt="Aperçu" />
                            </div>
                        )}
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <HiOutlinePhotograph className="w-6 h-6 text-gray-400 mb-1" />
                                <p className="text-[10px] text-gray-500 font-bold uppercase">
                                    {imageFile ? imageFile.name : (formationAModifier ? "Changer l'image" : "Choisir une image *")}
                                </p>
                            </div>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required={!formationAModifier} />
                        </label>
                    </div>

                    {/* Titre */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Titre *</label>
                        <div className="relative">
                            <HiOutlineBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input 
                                type="text" required value={formData.titre}
                                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Description *</label>
                        <textarea 
                            required value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            rows="3"
                        />
                    </div>

                    {/* Prix et Durée */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Prix (FCFA)</label>
                            <div className="relative">
                                <HiOutlineCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input 
                                    type="number" required value={formData.prix}
                                    onChange={(e) => setFormData({...formData, prix: e.target.value})}
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Durée</label>
                            <div className="relative">
                                <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input 
                                    type="text" required value={formData.duree}
                                    onChange={(e) => setFormData({...formData, duree: e.target.value})}
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Formateur */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Formateur *</label>
                        <select 
                            required value={formData.formateur_id}
                            onChange={(e) => setFormData({...formData, formateur_id: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg outline-none bg-white"
                        >
                            <option value="">Choisir</option>
                            {formateurs.map(f => (
                                <option key={f.id} value={f.id}>{f.nom}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                        <button type="button" onClick={onClose} className="flex-1 py-3 border rounded-xl text-xs font-black uppercase">Annuler</button>
                        <button 
                            type="submit" disabled={loading}
                            className="flex-1 py-3 bg-green-600 text-white rounded-xl text-xs font-black uppercase shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Traitement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModaleFormation;