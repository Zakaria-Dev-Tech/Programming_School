import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaArrowRight, FaEnvelope, FaCode, FaRobot, FaCloud, FaShieldAlt, FaMobileAlt, FaDatabase } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceSelectionne, setServiceSelectionne] = useState(null);

  // Icônes par défaut pour chaque type de service
  const getServiceIcon = (titre) => {
    const titreLower = titre?.toLowerCase() || '';
    if (titreLower.includes('web') || titreLower.includes('site')) return <FaCode className="text-2xl" />;
    if (titreLower.includes('robot') || titreLower.includes('ia')) return <FaRobot className="text-2xl" />;
    if (titreLower.includes('cloud') || titreLower.includes('stockage')) return <FaCloud className="text-2xl" />;
    if (titreLower.includes('sécurité') || titreLower.includes('securite')) return <FaShieldAlt className="text-2xl" />;
    if (titreLower.includes('mobile') || titreLower.includes('app')) return <FaMobileAlt className="text-2xl" />;
    return <FaDatabase className="text-2xl" />;
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/services')
      .then(res => {
        const visiblesuniquement = res.data.filter(s => s.statut === 'actif');
        setServices(visiblesuniquement);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      orange: 'bg-orange-600',
      purple: 'bg-purple-600'
    };
    return colors[color] || 'bg-gray-600';
  };



  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">
            Nos prestations
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            Services professionnels
          </h2>
          <div className="w-16 h-0.5 bg-green-600 mx-auto mt-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Des solutions informatiques de pointe pour accompagner la transformation numérique de votre entreprise.
          </p>
        </div>

        {/* Grille des services */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Chargement des services...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={service.image} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    alt={service.titre}
                  />
                  <div className={`absolute top-3 left-3 w-8 h-0.5 ${getColorClass(service.color)}`}></div>
                </div>
                
                <div className="p-5">
                  <div className="text-green-600 mb-3">
                    {getServiceIcon(service.titre)}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {service.titre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  
                  <button 
                    onClick={() => setServiceSelectionne(service)}
                    className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors inline-flex items-center gap-1"
                  >
                    En savoir plus <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section appel à l'action */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-700 text-lg font-medium mb-6">
            Pour en savoir plus sur les différents services que P.school propose, laissez-nous un message.
          </p>
          <button 
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
          >
            Nous contacter
            <FaArrowRight className="text-sm" />
          </button>
        </div>

        {/* Modal de détails */}
        {serviceSelectionne && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              
              <button 
                onClick={() => setServiceSelectionne(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors z-10"
              >
                <HiX className="w-5 h-5" />
              </button>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-2/5 h-48 rounded-md overflow-hidden bg-gray-100">
                    <img 
                      src={serviceSelectionne.image} 
                      alt={serviceSelectionne.titre} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="w-full md:w-3/5">
                    <div className={`w-10 h-0.5 ${getColorClass(serviceSelectionne.color)} rounded-full mb-3`}></div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      {serviceSelectionne.titre}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {serviceSelectionne.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4 text-center">Contactez-nous pour ce service</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <a 
                      href={`https://wa.me/22607571645?text=${encodeURIComponent('Bonjour, je souhaite échanger sur : ' + serviceSelectionne.titre)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                    >
                      <FaWhatsapp className="text-lg" />
                      WhatsApp
                    </a>

                    <button 
                      onClick={() => {
                        setServiceSelectionne(null);
                        scrollToContact();
                      }}
                      className="flex items-center justify-center gap-2 py-3 bg-gray-700 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
                    >
                      <FaEnvelope className="text-base" />
                      Formulaire
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;