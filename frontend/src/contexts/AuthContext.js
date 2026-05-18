import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configuration de la baseURL modifiée avec l'adresse du cloud Render
const api = axios.create({
  baseURL: 'https://pschool-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Vérification de la session au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/me');
          
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // 2. Fonction de Connexion Classique
  const login = async (identifier, password) => {
    try {
      const response = await api.post('/login', {
        email: identifier, 
        password: password
      });

      const { token, user: userData } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData)); 
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat()[0] 
        : error.response?.data?.message || 'Erreur de connexion';
      throw new Error(message);
    }
  };

  // 3. Fonction d'Inscription
  const register = async (formData) => {
    try {
      const response = await api.post('/register', formData);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat()[0] 
        : error.response?.data?.message || "Erreur lors de l'inscription";
      throw new Error(message);
    }
  };

  // 4. Connexion via QR Code (Badge)
  const loginWithToken = async (token) => {
    try {
      // Appel au backend avec le token du badge
      const response = await api.post('/auth/login-badge', { token });
      
      // Extraction des données
      const { user: userData, access_token } = response.data;

      if (access_token) {
        // Stockage local
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Configuration immédiate d'Axios
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Mise à jour de l'état global
        setUser(userData);
        
        return { success: true, role: userData.role };
      }
    } catch (error) {
      console.error("Erreur de connexion par badge", error.response?.data || error.message);
      return { success: false };
    }
  };

  // 5. Fonction de Déconnexion
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error("Erreur lors de la déconnexion ", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loginWithToken, 
      loading, 
      isAuthenticated: !!user 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  }
  return context;
};