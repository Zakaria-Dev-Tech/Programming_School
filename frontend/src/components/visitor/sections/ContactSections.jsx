import { useState } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
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
      // Connexion réelle avec l'API Laravel
      await api.post('/contact', formData);
      
      setSubmitted(true);
      // Réinitialisation du formulaire après succès
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
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5">
        
        <div className="mb-12 text-center">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wide">Contactez-nous</span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            Parlons de votre projet
          </h2>
          <div className="w-16 h-0.5 bg-green-600 mx-auto mt-4"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Formulaire */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {submitted && (
              <div className="mb-5 p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200 shadow-sm">
                Message envoyé avec succès ! L'équipe P.School vous répondra très rapidement.
              </div>
            )}
            
            {error && (
              <div className="mb-5 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200 shadow-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet <span className='text-red-600'>*</span> </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    placeholder="Votre nom et prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className='text-red-600'>*</span></label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone Whatsapp <span className='text-red-600'>*</span></label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  placeholder="Ex : +226 XX XX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet <span className='text-red-600'>*</span></label>
                <input
                  type="text"
                  name="sujet"
                  required
                  value={formData.sujet}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className='text-red-600'>*</span></label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors resize-none"
                  placeholder="Décrivez votre besoin ici..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>

          {/* Infos + Maps */}
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-lg border border-gray-200">
                <HiOutlinePhone className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Téléphone</p>
                <p className="text-sm text-gray-800">+226 02 88 05 82</p>
                <p className="text-sm text-gray-800">+226 07 57 16 45</p>
              </div>
              <div className="p-5 bg-white rounded-lg border border-gray-200">
                <HiOutlineMail className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Email</p>
                <p className="text-sm text-gray-800">infos@pschool.pro</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-5 flex items-start gap-3 border-b border-gray-200">
                <HiOutlineLocationMarker className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Secteur 53, Ouaga 2000</p>
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