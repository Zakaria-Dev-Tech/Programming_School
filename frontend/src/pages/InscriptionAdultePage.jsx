import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const InscriptionAdultePage = () => {
  const { formationId } = useParams();
  const navigate = useNavigate();
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type_inscription: 'adulte',
    parent_nom: '',
    parent_prenom: '',
    parent_adresse: '',
    parent_telephone: '',
    parent_zone: '',
    apprenant_email: '',
    format: '',
    source: ''
  });

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const data = await api.get(`/formations/${formationId}`);
        setFormation(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Formation non trouvée");
      } finally {
        setLoading(false);
      }
    };
    fetchFormation();
  }, [formationId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const dataToSend = {
      type_inscription: formData.type_inscription,
      parent_nom: formData.parent_nom,
      parent_prenom: formData.parent_prenom,
      parent_adresse: formData.parent_adresse,
      parent_telephone: formData.parent_telephone,
      parent_zone: formData.parent_zone,
      apprenant_email: formData.apprenant_email,
      format: formData.format,
      source: formData.source || null
    };
    
    try {
      await api.post(`/formations/${formationId}/inscription-session`, dataToSend);
      toast.success("Votre inscription a été enregistrée avec succès !");
      setTimeout(() => {
        navigate('/formationSessions');
      }, 2000);
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.values(errors).forEach(err => toast.error(err[0]));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-green-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-5">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1  rounded-full mb-3">
            <span className="inline-flex items-center gap-2 px-6 py-2 mx-4 rounded-full text-green-600 font-semibold text-2xl uppercase tracking-wide "> Formulaire d'inscription pour adulte  </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Formation : {formation?.titre}
          </h1>
          <p className="text-gray-500 text-sm">
            Veuillez remplir tous les champs obligatoires (*)
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          
          {/* Section Apprenant */}
          <div className="mb-6">
            <h2 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Informations personnelles
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parent_nom"
                    required
                    value={formData.parent_nom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parent_prenom"
                    required
                    value={formData.parent_prenom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                    placeholder="Votre prénom"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="parent_telephone"
                    required
                    value={formData.parent_telephone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                    placeholder="70 12 34 56"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="apprenant_email"
                    required
                    value={formData.apprenant_email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parent_adresse"
                  required
                  value={formData.parent_adresse}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                  placeholder="Votre adresse complète"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de formation <span className="text-red-500">*</span>
                </label>
                <select
                  name="parent_zone"
                  required
                  value={formData.parent_zone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition bg-white"
                >
                  <option value="">Sélectionnez un lieu</option>
                  <option value="Ouaga 2000">Ouaga 2000</option>
                  <option value="Tampouy">Tampouy</option>
                  <option value="Saaba">Saaba</option>
                  <option value="Bobo dioulasso">Bobo Dioulasso</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Section Format */}
          <div className="mb-6">
            <h2 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Choix du format
            </h2>
            
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="format"
                  value="presentiel"
                  required
                  checked={formData.format === 'presentiel'}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Cours en présentiel</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="format"
                  value="en_ligne"
                  required
                  checked={formData.format === 'en_ligne'}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700"> Cours en ligne</span>
              </label>
            </div>
          </div>
          
          {/* Section Source */}
          <div className="mb-8">
            <h2 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Comment nous avez-vous connu ?
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['Proche ou connaissance', 'Réseaux sociaux', 'Médias'].map((source) => (
                <label key={source} className="flex items-center gap-2 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="source"
                    value={source}
                    checked={formData.source === source}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-600">{source}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Envoi en cours...' : 'Envoyer ma pré-inscription'}
          </button>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            Après soumission, nous vous contacterons sous 48h pour finaliser votre inscription.
          </p>
        </form>
        
        {/* Lien retour */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/formationSessions')}
            className="text-gray-400 hover:text-green-600 text-sm transition"
          >
            ← Retour aux sessions programmées
          </button>
        </div>
      </div>
    </div>
  );
};

export default InscriptionAdultePage;