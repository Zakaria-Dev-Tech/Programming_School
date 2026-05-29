import { useState, useEffect } from 'react';
import { FaWhatsapp, FaArrowRight, FaEnvelope  } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import api from '../services/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceSelectionne, setServiceSelectionne] = useState(null);

 
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get('/services');
        setServices(Array.isArray(data) ? data.filter(s => s.statut === 'actif') : []);
      } catch (err) {
        console.error("Erreur chargement services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=Service+P.School';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/storage/${imagePath.replace('storage/', '')}`;
  };

  const getColorClass = (color) => {
    const colors = { blue: 'bg-blue-500', green: 'bg-cyan-500', orange: 'bg-orange-500', purple: 'bg-purple-500' };
    return colors[color] || 'bg-gray-500';
  };

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="services" className="py-16 pt-32 pb-16 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* En-tête avec titre sur toute la largeur */}
        <div className="mb-12">
          <div className="relative flex items-center justify-center">
            
            <span className="inline-flex items-center gap-2 px-6 py-2 mx-4  text-blue-900 font-semibold text-4xl uppercase tracking-wide ">
        
              Nos prestations
           
            </span>
            
          </div>
          <h2 className="text-3xl font-bold text-gray-500 text-center mt-6">Services professionnels</h2>
      
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img src={getImageUrl(service.image)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={service.titre} />
                  <div className={`absolute top-0 left-0 w-1 h-full ${getColorClass(service.color)}`}></div>
                </div>
                <div className="p-5">
               
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.titre}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">{service.description}</p>
                  <button onClick={() => setServiceSelectionne(service)} className="text-blue-900 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                    En savoir plus <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Service - AGRANDIE */}
        {serviceSelectionne && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden relative animate-fade-in-up">
              
              {/* Header avec bouton fermeture */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                 
                  <h2 className="text-2xl font-bold text-gray-900">{serviceSelectionne.titre}</h2>
                </div>
                <button 
                  onClick={() => setServiceSelectionne(null)} 
                  className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>
              
              {/* Contenu principal */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Image agrandie */}
                  <div className="w-full md:w-2/5">
                    <div className="sticky top-0 rounded-xl overflow-hidden bg-gray-100 shadow-md">
                      <img 
                        src={getImageUrl(serviceSelectionne.image)} 
                        className="w-full h-auto object-cover" 
                        alt={serviceSelectionne.titre} 
                      />
                    </div>
                  </div>
                  
                  {/* Description détaillée */}
                  <div className="w-full md:w-3/5">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-600 text-base leading-relaxed">
                        {serviceSelectionne.description}
                      </p>
                    </div>
                    
                    {/* Informations supplémentaires */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Pourquoi choisir ce service ?</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-900 rounded-full"></span>
                          Expertise reconnue au Burkina Faso
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-900 rounded-full"></span>
                          Équipe de professionnels certifiés
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-900 rounded-full"></span>
                          Support et accompagnement personnalisé
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer avec boutons d'action */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="grid sm:grid-cols-2 gap-4">
                  <a 
                    href={`https://wa.me/22607571645?text=${encodeURIComponent(serviceSelectionne.whatsapp_message || 'Bonjour, je souhaite échanger sur : ' + serviceSelectionne.titre)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    <FaWhatsapp className="text-lg" /> 
                    <span>Contacter via WhatsApp</span>
                  </a>
                  <button 
                  onClick={() => { 
                    setServiceSelectionne(null);
                    // Rediriger vers la page d'accueil avec l'ancre #contact
                    window.location.href = '/';
                  }} 
                  className="flex items-center justify-center gap-2 py-3 bg-blue-900 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-colors"
                >
                  <FaEnvelope className="text-base" /> 
                  <span>Demander un devis</span>
                </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Réponse sous 24h garantie
                </p>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesPage;