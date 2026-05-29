import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Ajout de useLocation
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { login: loginUser } = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const result = await loginUser(identifier, password);
      if (result.success) {
       
    // Remplace ton bloc roleRoutes par celui-ci
const roleRoutes = {
  admin: '/admin',
  parent: '/parent',
  apprenant: '/apprenant',
  formateur: '/formateur' // Assure-toi que c'est bien 'formateur' (sans faute)
};

// Récupère le type d'utilisateur (vérifie si c'est 'type' ou 'role' dans ton API)
const userType = result.data.user.type; 

const defaultTarget = roleRoutes[userType] || '/'; // Retour à l'accueil si inconnu
const target = location.state?.from?.pathname || defaultTarget;

navigate(target, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md mx-4">
        
        {/* Dégradé décoratif en haut */}
        <div className="h-2 bg-gradient-to-r from-blue-600 to-green-500"></div>
        
        {/* Logo et titre */}
        <div className="px-8 pt-8 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/assets/logo.png" 
              alt="Programming School Logo" 
              className="h-28 w-auto" // Taille légèrement réduite pour un meilleur rendu
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Connexion
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Connectez-vous à votre compte
          </p>
        </div>
        
        {/* Formulaire */}
        <form className="px-8 pb-8 mt-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
          
          {/* Champ Email ou Nom d'utilisateur */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email ou nom d'utilisateur
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                placeholder="Email ou nom d'utilisateur"
                autoComplete="off"
                required
              />
            </div>
          </div>
          
          {/* Champ Mot de passe */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                placeholder="********"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <HiOutlineEyeOff className="h-5 w-5" />
                ) : (
                  <HiOutlineEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-green-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
            </label>
           <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
            Mot de passe oublié ?
          </Link>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 hover:shadow-lg active:scale-95'
            }`}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-400 uppercase">ou</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>
          
          {/* Lien vers inscription */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-semibold text-green-600 hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Login;