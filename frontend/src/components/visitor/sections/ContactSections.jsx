import { useState, useEffect, useRef } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock, HiOutlineChat, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../../services/api'; 

const ContactSection = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const floatingImageRef = useRef(null);

  useEffect(() => {
    // Animation de l'image qui monte et descend
    if (floatingImageRef.current) {
      let direction = 1;
      let position = 0;
      const interval = setInterval(() => {
        position += direction * 0.5;
        if (position >= 20) direction = -1;
        if (position <= -20) direction = 1;
        if (floatingImageRef.current) {
          floatingImageRef.current.style.transform = `translateY(${position}px)`;
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error("Erreur envoi contact:", err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4">
            <span className="text-orange-600 font-semibold text-4xl uppercase tracking-wide">
              Contactez-nous
            </span>
          </div>
        </div>

        {/* Image à gauche + Formulaire à droite - Même hauteur */}
        <div className="grid lg:grid-cols-2 gap-10 mb-10 items-stretch">
          
          {/* IMAGE À GAUCHE - Pleine largeur */}
          <div 
            ref={floatingImageRef}
            className="hidden lg:block transition-all duration-100 ease-in-out overflow-hidden"
            style={{ transition: 'transform 0.1s linear' }}
          >
            <img 
              src="/assets/Contactez-Nous-removebg-preview.png" 
              alt="Contact illustration"
              className="w-full h-full object-cover min-h-[500px]"
            />
          </div>
          
          {/* FORMULAIRE À DROITE */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <HiOutlineChat className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-800">Envoyez-nous un message</h3>
            </div>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200">
                ✓ Message envoyé avec succès ! L'équipe P.School vous répondra très rapidement.
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
                ⚠ {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5 flex-1">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet <span className='text-red-500'>*</span></label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="Votre nom et prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className='text-red-500'>*</span></label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    placeholder="EX : nom@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone WhatsApp <span className='text-red-500'>*</span></label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="Ex : +226 XX XX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sujet <span className='text-red-500'>*</span></label>
                <input
                  type="text"
                  name="sujet"
                  required
                  value={formData.sujet}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message <span className='text-orange-500'>*</span></label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                  placeholder="Décrivez votre besoin ici..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full py-3.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    Envoyer le message
                    <HiOutlineArrowNarrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SECTION LOCALISATION - PLEINE LARGEUR */}
      <div className="w-full mt-16">
        {/* Titre de la section localisation */}
        <div className="text-center mb-8">
          
        
          <p className="text-gray-500 mt-2">
            Secteur 53, Ouaga 2000 - Boulevard Muammar Khadafi, Ouagadougou, Burkina Faso
          </p>
        </div>

          <div className="ml-2 md:ml-4 lg:ml-8 xl:ml-8 shadow-lg overflow-hidden rounded-2xl">
          <div className="w-full h-[450px]">
            <iframe 
              title="P.School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.894746110535!2d-1.5022534251700728!3d12.322870787936061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2ebd0c8acc045b%3A0x43f81f1a9af2130e!2sPROGRAMMING%20SCHOOL%20OUAGADOUGOU!5e0!3m2!1sfr!2sbf!4v1777542341593!5m2!1sfr!2sbf" 
              className="w-full h-full"
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;