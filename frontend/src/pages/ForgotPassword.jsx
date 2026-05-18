import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  Envoyer l'email
const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
       
        await api.request('/password/send-code', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
        setStep(2); 
    } catch (err) {
        console.error("Erreur complète:", err);
     
        alert(err.message || "L'email n'existe pas ou erreur serveur");
    } finally {
        setLoading(false);
    }
};

  
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/password/reset-with-code', {
        email, code, password, password_confirmation: passwordConfirm
      });
      alert("Succès ! Connectez-vous avec votre nouveau mot de passe.");
      navigate('/login');
    } catch (err) {
      alert("Code incorrect ou erreur de validation.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Récupération de compte</h2>

        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <p className="text-gray-600 mb-4 text-sm">Entrez votre email pour recevoir un code à 6 chiffres.</p>
            <input 
              type="email" required placeholder="votre@email.com"
              className="w-full p-3 border rounded-lg mb-4"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
              {loading ? 'Envoi...' : 'Envoyer le code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset}>
            <p className="text-gray-600 mb-4 text-sm">Email : <b>{email}</b></p>
            <input 
              type="text" required placeholder="Code à 6 chiffres"
              className="w-full p-3 border rounded-lg mb-4 text-center text-2xl tracking-widest"
              value={code} onChange={(e) => setCode(e.target.value)}
            />
            
            <div className="space-y-4">
              <input 
                type="password" required placeholder="Nouveau mot de passe"
                className="w-full p-3 border rounded-lg"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <input 
                type="password" required placeholder="Confirmer le mot de passe"
                className="w-full p-3 border rounded-lg"
                value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            <button className="w-full bg-green-600 text-white p-3 rounded-lg mt-6 hover:bg-green-700">
              {loading ? 'Réinitialisation...' : 'Changer le mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;