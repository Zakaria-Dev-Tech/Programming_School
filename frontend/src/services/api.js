const API_URL = "https://pschool-backend.onrender.com/api";

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const isFormData = options.body instanceof FormData;
        
        const headers = {
            'Accept': 'application/json',
            ...options.headers,
        };
        
        if (!isFormData && options.body && options.body !== null) {
            headers['Content-Type'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                throw new Error('Non authentifié');
            }

            // Vérifier si la réponse a du contenu
            const text = await response.text();
            
            // Si la réponse est vide, retourner null
            if (!text) {
                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }
                return null;
            }
            
            // Essayer de parser le JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Erreur parsing JSON:', text);
                throw new Error('Réponse serveur invalide');
            }
            
            if (!response.ok) {
                const error = new Error(data.message || data.error || 'Erreur serveur');
                error.response = { data, status: response.status };
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data)
        });
    },

    put(endpoint, data) {
        const isFormData = data instanceof FormData;
        
        if (isFormData) {
            const formDataWithMethod = new FormData();
            for (let [key, value] of data.entries()) {
                formDataWithMethod.append(key, value);
            }
            formDataWithMethod.append('_method', 'PUT');
            
            return this.request(endpoint, {
                method: 'POST',
                body: formDataWithMethod
            });
        }
        
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    login(identifier, password) {
        return this.post('/login', { identifier, password });
    },

    register(userData) {
        return this.post('/register', userData);
    },

    getUser() {
        return this.get('/user');
    },

    logout() {
        return this.post('/logout');
    }
};

export default api;