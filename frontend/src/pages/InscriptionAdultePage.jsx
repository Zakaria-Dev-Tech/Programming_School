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
    session_choisie: '',
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
    
    // Nettoyer les données avant envoi
    const dataToSend = {
      type_inscription: formData.type_inscription,
      parent_nom: formData.parent_nom,
      parent_prenom: formData.parent_prenom,
      parent_adresse: formData.parent_adresse,
      parent_telephone: formData.parent_telephone,
      parent_zone: formData.parent_zone,
      apprenant_email: formData.apprenant_email,
      session_choisie: formData.session_choisie,
      format: formData.format,
      source: formData.source || null
    };
    
    try {
      await api.post(`/formations/${formationId}/inscription-session`, dataToSend);
      toast.success("Votre inscription a été enregistrée avec succès !");
      setTimeout(() => {
        navigate('/formations-sessions');
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Inscription formation adulte
          </h1>
          <p className="text-green-600 font-semibold">{formation?.titre}</p>
          <p className="text-gray-500 text-sm mt-2">Veuillez remplir tous les champs obligatoires (*)</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Section Apprenant */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations de l'apprenant</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Votre prénom"
                />
              </div>
              
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Ex: 70 12 34 56"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parent_adresse"
                  required
                  value={formData.parent_adresse}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
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
          
          {/* Section Session et Format */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Choix de la session et du format</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['Juin-juillet', 'Juillet-août', 'Août-septembre'].map((session) => (
                    <label key={session} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="session_choisie"
                        value={session}
                        required
                        checked={formData.session_choisie === session}
                        onChange={handleChange}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">{session}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="format"
                      value="presentiel"
                      required
                      checked={formData.format === 'presentiel'}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Cours en présentiel</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="format"
                      value="en_ligne"
                      required
                      checked={formData.format === 'en_ligne'}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Cours en ligne</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section Source */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Comment avez-vous connu P.School ?</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              {['Proche ou connaissance', 'Réseaux sociaux', 'Médias'].map((source) => (
                <label key={source} className="flex items-center gap-2 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="source"
                    value={source}
                    checked={formData.source === source}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">{source}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Envoi en cours...' : 'Envoyer ma pré-inscription'}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Après soumission, nous vous contacterons sous 48h pour finaliser votre inscription.
          </p>
        </form>
        
        {/* Lien retour */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/formationSessions')}
            className="text-gray-500 hover:text-green-600 text-sm transition-colors"
          >
            ← Retour aux sessions programmées
          </button>
        </div>
      </div>
    </div>
  );
};

export default InscriptionAdultePage;