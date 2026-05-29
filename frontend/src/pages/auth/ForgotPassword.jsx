import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail, HiArrowLeft } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/forgot-password', { email });
      setSubmitted(true);
      toast.success('Un lien de réinitialisation a été envoyé à votre adresse email.');
    } catch (error) {
      const message = error.response?.data?.message || 'Une erreur est survenue';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-5">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-green-500"></div>
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="/assets/logo.png" 
                alt="Programming School Logo" 
                className="h-28 w-auto"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiMail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email envoyé !</h2>
            <p className="text-gray-500 mb-6">
              Nous vous avons envoyé un lien de réinitialisation à l'adresse <br />
              <span className="font-semibold text-gray-700">{email}</span>
            </p>
            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-5">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Dégradé décoratif en haut */}
        <div className="h-2 bg-gradient-to-r from-blue-600 to-green-500"></div>
        
        {/* Logo et titre */}
        <div className="px-8 pt-8 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/assets/logo.png" 
              alt="Programming School Logo" 
              className="h-28 w-auto"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Mot de passe oublié ?</h1>
          <p className="text-gray-500 text-sm mt-2">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 mt-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>

          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-gray-500 hover:text-green-600 inline-flex items-center gap-1 transition">
              <HiArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;