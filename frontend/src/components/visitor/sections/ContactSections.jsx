import { useState } from 'react';
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
        
        {/* En-tête percutant */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 rounded-full px-4 py-1.5 mb-4">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">
              Contactez-nous
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
            Parlons de votre projet
          </h2>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            Une question ? Un projet ? Écrivez-nous, nous vous répondrons dans les meilleurs délais.
          </p>
          <div className="w-20 h-0.5 bg-green-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* FORMULAIRE - Design épuré */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <HiOutlineChat className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">Envoyez-nous un message</h3>
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
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet <span className='text-red-500'>*</span></label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="votre@email.com"
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
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message <span className='text-red-500'>*</span></label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none"
                  placeholder="Décrivez votre besoin ici..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full py-3.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {/* INFOS + MAPS - Design percutant */}
          <div className="space-y-6">
            {/* Cartes d'info */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                  <HiOutlinePhone className="w-6 h-6 text-green-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Téléphone / WhatsApp</p>
                <p className="text-base font-semibold text-gray-800">+226 02 88 05 82</p>
                <p className="text-base font-semibold text-gray-800">+226 07 57 16 45</p>
                <div className="mt-3 flex items-center gap-2">
                  <FaWhatsapp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-400">Réponse sous 24h</span>
                </div>
              </div>
              
              <div className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                  <HiOutlineMail className="w-6 h-6 text-green-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</p>
                <p className="text-base font-semibold text-gray-800">infos@pschool.pro</p>
                <p className="text-sm text-gray-400 mt-2">Nous répondons sous 48h</p>
              </div>
            </div>

            {/* Horaires */}
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <HiOutlineClock className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Horaires d'ouverture</p>
                <p className="text-sm text-gray-700">Lundi - Samedi : 9h00 - 17h00</p>
           
              </div>
            </div>

            {/* Carte Maps */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="flex items-start gap-3 p-5 border-b border-gray-100">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <HiOutlineLocationMarker className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Secteur 53, Ouaga 2000</p>
                  <p className="text-sm text-gray-500 mt-0.5">Boulevard Muammar Khadafi, Ouagadougou, Burkina Faso</p>
                </div>
              </div>
              
              <div className="h-64 w-full">
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

        </div>
      </div>
    </section>
  );
};

export default ContactSection;