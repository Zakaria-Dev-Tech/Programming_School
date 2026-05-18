import { useState, useEffect } from 'react';
import { 
  HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, 
  HiOutlinePhone, HiOutlineUserCircle, HiOutlineEyeOff, HiOutlineEye 
} from 'react-icons/hi';
import api from '../../../services/api'; 
import toast from 'react-hot-toast';

const MonProfile = () => {
  const [formData, setFormData] = useState({
    id: null, nom: '', email: '', username: '', telephone: '',
    password: '', password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get('/user');
        const user = response.data || response;

        if (user && user.id) {
          setFormData({
            id: user.id,
            nom: user.nom || user.name || '',
            email: user.email || '',
            username: user.username || '',
            telephone: user.telephone || '',
            password: '',
            password_confirmation: ''
          });
        }
      } catch (err) {
        toast.error("Session expirée ou erreur de serveur");
      } finally {
        setFetching(false);
      }
    };
    getProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom?.trim()) newErrors.nom = 'Nom requis';
    if (!formData.email?.includes('@')) newErrors.email = "Email invalide";
    if (formData.password && formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';
    if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = 'Divergence de mots de passe';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return toast.error("Veuillez corriger les erreurs");
    }

    setLoading(true);
    try {
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
        delete dataToUpdate.password_confirmation;
      }
      await api.put(`/users/${formData.id}`, dataToUpdate); 
      toast.success('Profil mis à jour !');
      setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      toast.error("Échec de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin h-6 w-6 border-b-2 border-emerald-500 rounded-full"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Mon profil</h1>
        <p className="text-slate-400 text-xs mt-1 font-medium">Gérez vos informations personnelles</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex justify-center mb-10">
            <div className="relative group">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <HiOutlineUserCircle className="h-14 w-14" />
              </div>
              
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-wider">Nom complet</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text" name="nom" value={formData.nom} onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.nom ? 'border-red-300' : 'border-transparent'} rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-wider">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.email ? 'border-red-300' : 'border-transparent'} rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-wider">Identifiant</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text" name="username" value={formData.username} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>

            {/* Champ Téléphone  */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-wider">Téléphone</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="tel" name="telephone" value={formData.telephone} onChange={handleChange}
                  placeholder="+226 -- -- -- --"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-50">
             <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-wider">Nouveau mot de passe</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Laisser vide pour garder"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1 tracking-wider">Confirmation</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'} name="password_confirmation" value={formData.password_confirmation} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-xs transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit" disabled={loading}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-100 disabled:opacity-50"
            >
              {loading ? 'Traitement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default MonProfile;