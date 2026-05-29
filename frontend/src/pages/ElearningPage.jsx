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

const stepColors = [
  { bg: 'bg-blue-50', icon: 'text-blue-600', num: 'text-blue-100', border: 'border-blue-100' },
  { bg: 'bg-emerald-50', icon: 'text-emerald-600', num: 'text-emerald-100', border: 'border-emerald-100' },
  { bg: 'bg-amber-50', icon: 'text-amber-500', num: 'text-amber-100', border: 'border-amber-100' },
  { bg: 'bg-violet-50', icon: 'text-violet-600', num: 'text-violet-100', border: 'border-violet-100' },
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
    <section className="pt-24 pb-20 bg-slate-50 min-h-screen">

      {/* Hero header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 pt-16 pb-20 px-5 mb-12 relative overflow-hidden">
        {/* Déco cercles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5  text-white text-3xl font-semibold uppercase tracking-widest mb-5">
       
            E-learning
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Cours en ligne & Certifications
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto">
            Formez-vous à votre rythme avec des experts certifiés et obtenez des certificats reconnus.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5">

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltre(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                filtre === cat
                  ? 'bg-blue-900 text-white shadow-sm shadow-blue-200'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille formations */}
        {chargement ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Chargement du catalogue...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFormations.map((formation) => (
              <div
                key={formation.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(formation.image)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    alt={formation.titre}
                  />
                  {/* Badge catégorie sur l'image */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-blue-800 text-[11px] font-semibold rounded-full border border-blue-100">
                      {formation.categorie || 'Général'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-[15px] font-bold text-gray-800 mb-2 line-clamp-2 leading-snug">
                    {formation.titre}
                  </h3>

                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <HiOutlineBookOpen className="w-3.5 h-3.5 text-blue-900" />
                      <span>{formation.nb_modules || 0} modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiOutlineClock className="w-3.5 h-3.5 text-blue-900" />
                      <span>{formation.duree || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setFormationSelectionnee(formation)}
                      className="text-blue-900 text-sm font-medium hover:text-blue-800 transition-colors"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => navigate(`/inscription/${formation.id}`)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-800 text-white hover:bg-blue-900 transition-colors"
                    >
                      <HiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment ça fonctionne */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1  text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
              Processus
            </span>
            <h3 className="text-2xl font-bold text-gray-800">Comment ça fonctionne ?</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Ligne de connexion (desktop) */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-100 via-emerald-100 to-violet-100 z-0" />

            {steps.map((step, index) => {
              const color = stepColors[index];
              return (
                <div key={index} className="relative z-10 text-center">
                  <div className={`w-14 h-14 ${color.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 border ${color.border}`}>
                    <span className={`${color.icon} text-xl`}>{step.icon}</span>
                  </div>
                  <div className={`text-3xl font-black ${color.num} mb-1 leading-none`}>{step.num}</div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Détails */}
      {formationSelectionnee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6 shadow-2xl">
            <button
              onClick={() => setFormationSelectionnee(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors z-10"
            >
              <HiX className="w-4 h-4" />
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-2/5 h-48 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={getImageUrl(formationSelectionnee.image)}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <div className="w-full md:w-3/5">
                <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full uppercase mb-2">
                  {formationSelectionnee.categorie}
                </span>
                <h2 className="text-xl font-bold text-gray-800 mb-4 leading-snug">
                  {formationSelectionnee.titre}
                </h2>
                <div className="bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-400 uppercase font-semibold tracking-wide mb-1">Frais de formation</p>
                  <div className="text-2xl font-bold text-gray-800">
                    {Number(formationSelectionnee.prix || 0).toLocaleString()}
                    <span className="text-sm text-blue-600 ml-1">FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-gray-500 text-sm leading-relaxed">
                {formationSelectionnee.description}
              </p>
              <button
                onClick={() => navigate(`/inscription/${formationSelectionnee.id}`)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Commencez gratuitement
                <HiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ElearningPage;