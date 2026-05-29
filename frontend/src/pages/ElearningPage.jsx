import { useState, useEffect } from 'react';
import { 
  HiOutlineClock, HiOutlineBookOpen, HiArrowRight, 
  HiX 
} from 'react-icons/hi';
import { FaUserPlus, FaBookOpen, FaCreditCard, FaAward } from 'react-icons/fa';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom';

const steps = [
  { num: "01", title: "Créez votre compte", desc: "Inscrivez-vous gratuitement en quelques minutes", icon: <FaUserPlus /> },
  { num: "02", title: "Choisissez une formation", desc: "Parcourez notre catalogue et accédez aux modules gratuits", icon: <FaBookOpen /> },
  { num: "03", title: "Payez & Apprenez", desc: "Accédez à l'intégralité des cours après paiement sécurisé", icon: <FaCreditCard /> },
  { num: "04", title: "Obtenez votre certificat", desc: "Complétez tous les modules et recevez votre certification", icon: <FaAward /> },
];

const ElearningPage = () => {
  const navigate = useNavigate();
  const [formations, setFormations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState('Tous');
  const [formationSelectionnee, setFormationSelectionnee] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const getFormations = async () => {
      try {
        const data = await api.get('/formations?mode=vitrine&mode_formation=elearning');
        setFormations(data || []);
      } catch (error) {
        console.error("Erreur chargement formations:", error);
      } finally {
        setChargement(false);
      }
    };
    getFormations();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=P.School';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/storage/${imagePath.replace('storage/', '')}`;
  };

  const categories = ['Tous', ...new Set(formations.map(f => f.categorie).filter(Boolean))];
  const filteredFormations = filtre === 'Tous' 
    ? formations 
    : formations.filter(f => f.categorie === filtre);

  return (
    <section className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* En-tête avec titre sur toute la largeur */}
        <div className=" pt-24 mb-12">
          <div className="relative flex items-center justify-center">
           
            <span className="inline-flex items-center gap-2 px-6 py-2 mx-4 rounded-full text-cyan-600 font-semibold text-4xl uppercase tracking-wide ">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
              E-learning
           
            </span>
        
          </div>
          <h2 className="text-3xl font-bold text-gray-800 text-center mt-6">
            Cours en ligne & Certifications
          </h2>
        
        </div>
        
        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltre(cat)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filtre === cat 
                ? 'bg-cyan-600 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {chargement ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-cyan-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Chargement du catalogue...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredFormations.map((formation) => (
              <div 
                key={formation.id} 
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={getImageUrl(formation.image)} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    alt={formation.titre}
                  />
                </div>

                <div className="p-4">
                  <span className="text-cyan-600 text-xs font-semibold uppercase tracking-wide">
                    {formation.categorie || 'Général'}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2 line-clamp-1">
                    {formation.titre}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <HiOutlineBookOpen className="w-3.5 h-3.5" /> 
                      <span>{formation.nb_modules || 0} modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiOutlineClock className="w-3.5 h-3.5" /> 
                      <span>{formation.duree || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => setFormationSelectionnee(formation)}
                      className="text-cyan-600 text-sm font-medium hover:text-cyan-700"
                    >
                      Détails
                    </button>
                    <button 
                      onClick={() => navigate(`/inscription/${formation.id}`)} 
                      className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-800 text-white hover:bg-cyan-600 transition-colors"
                    >
                      <HiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Comment ça fonctionne */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-10">Comment ça fonctionne ?</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-cyan-600 text-xl">{step.icon}</span>
                </div>
                <div className="text-2xl font-bold text-gray-300 mb-1">{step.num}</div>
                <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Détails */}
      {formationSelectionnee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6">
            <button 
              onClick={() => setFormationSelectionnee(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 z-10"
            >
              <HiX className="w-5 h-5" />
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-2/5 h-48 rounded-md overflow-hidden bg-gray-100">
                <img src={getImageUrl(formationSelectionnee.image)} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="w-full md:w-3/5">
                <span className="text-amber-600 text-xs font-semibold uppercase">{formationSelectionnee.categorie}</span>
                <h2 className="text-xl font-bold text-gray-800 mt-1 mb-3">{formationSelectionnee.titre}</h2>
                <div className="bg-gray-50 px-4 py-3 rounded-md border border-gray-200">
                   <p className="text-xs text-gray-500 uppercase mb-1">Frais de formation</p>
                   <div className="text-2xl font-bold text-gray-800">
                     {Number(formationSelectionnee.prix || 0).toLocaleString()} <span className="text-sm text-cyan-600">FCFA</span>
                   </div>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed">{formationSelectionnee.description}</p>
              <button 
                onClick={() => navigate(`/inscription/${formationSelectionnee.id}`)} 
                className="w-full py-3 bg-cyan-600 text-white rounded-md font-medium hover:bg-cyan-700"
              >
                Commencez gratuitement
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ElearningPage;