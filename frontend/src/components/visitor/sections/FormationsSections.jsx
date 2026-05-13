import { useState, useEffect } from 'react';
import { 
  HiOutlineClock,  HiOutlineBookOpen, HiArrowRight, 
   HiX 
} from 'react-icons/hi';
import { FaUserPlus, FaBookOpen, FaCreditCard, FaAward } from 'react-icons/fa';
import api from '../../../services/api'; 
import { useNavigate } from 'react-router-dom';

const steps = [
  { num: "01", title: "Créez votre compte", desc: "Inscrivez-vous gratuitement en quelques minutes", icon: <FaUserPlus /> },
  { num: "02", title: "Choisissez une formation", desc: "Parcourez notre catalogue et accédez aux modules gratuits", icon: <FaBookOpen /> },
  { num: "03", title: "Payez & Apprenez", desc: "Accédez à l'intégralité des cours après paiement sécurisé", icon: <FaCreditCard /> },
  { num: "04", title: "Obtenez votre certificat", desc: "Complétez tous les modules et recevez votre certification", icon: <FaAward /> },
];

const FormationsSection = () => {
  const navigate = useNavigate();
  const [formations, setFormations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState('Tous');
  const [formationSelectionnee, setFormationSelectionnee] = useState(null);

  useEffect(() => {
    const getFormations = async () => {
      try {
        const data = await api.get('/formations');
        setFormations(data);
      } catch (error) {
        console.error("Erreur chargement formations:", error);
      } finally {
        setChargement(false);
      }
    };
    getFormations();
  }, []);

  const categories = ['Tous', ...new Set(formations.map(f => f.categorie).filter(Boolean))];
  
  const filteredFormations = filtre === 'Tous' 
    ? formations 
    : formations.filter(f => f.categorie === filtre);

  return (
    <section id="formations" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5">
        
        <div className="mb-12 text-center">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">Nos formations</span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            Développez vos compétences
          </h2>
          <div className="w-16 h-0.5 bg-green-600 mx-auto mt-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Des programmes conçus pour répondre aux exigences réelles du marché technologique.
            Inscrivez vos enfants pour leur offrir un avenir meilleur.
          </p>
        </div>
        
        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltre(cat)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filtre === cat 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {chargement ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Chargement du catalogue...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFormations.map((formation) => (
              <div 
                key={formation.id} 
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={formation.image} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    alt={formation.titre}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-md">
                      {formation.public_cible}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-amber-600 text-xs font-semibold uppercase tracking-wide">
                    {formation.categorie}
                  </span>
                  
                  <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2 line-clamp-1">
                    {formation.titre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {formation.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <HiOutlineBookOpen className="w-3.5 h-3.5" /> 
                      <span>{formation.nb_modules || 0} modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiOutlineClock className="w-3.5 h-3.5" /> 
                      <span>{formation.duree}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => setFormationSelectionnee(formation)}
                      className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
                    >
                      Voir détails
                    </button>
                    
                    <button 
                      onClick={() => navigate(`/inscription/${formation.id}`)} 
                      className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-800 text-white hover:bg-green-600 transition-colors"
                    >
                      <HiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section des étapes */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-10">
            Comment ça fonctionne ?
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">{step.icon}</span>
                </div>
                <div className="text-2xl font-bold text-gray-300 mb-1">{step.num}</div>
                <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/formations')}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Voir toutes les formations
          </button>
        </div>
      </div>

      {/* Modal de détails */}
      {formationSelectionnee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setFormationSelectionnee(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors z-10"
            >
              <HiX className="w-5 h-5" />
            </button>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/5 h-48 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={formationSelectionnee.image} 
                    alt={formationSelectionnee.titre} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full md:w-3/5">
                  <span className="text-amber-600 text-xs font-semibold uppercase tracking-wide">
                    {formationSelectionnee.categorie}
                  </span>
                  <h2 className="text-xl font-bold text-gray-800 mt-1 mb-3">
                    {formationSelectionnee.titre}
                  </h2>
                  <div className="bg-gray-50 px-4 py-3 rounded-md border border-gray-200 mb-4">
                    <p className="text-xs text-gray-500 uppercase mb-1">Frais de formation</p>
                    <div className="text-2xl font-bold text-gray-800">
                      {Number(formationSelectionnee.prix).toLocaleString()} <span className="text-sm text-green-600">FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">À propos de cette formation</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {formationSelectionnee.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase">Durée totale</p>
                    <p className="font-semibold text-gray-800">{formationSelectionnee.duree}</p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase">Contenu</p>
                    <p className="font-semibold text-gray-800">{formationSelectionnee.nb_modules} modules</p>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/inscription/${formationSelectionnee.id}`)} 
                  className="w-full py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  S'inscrire maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FormationsSection;