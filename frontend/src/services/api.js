const API_URL = "https://pschool-backend.onrender.com/api";

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        // Détecter si on envoie un FormData
        const isFormData = options.body instanceof FormData;
        
        const headers = {
            'Accept': 'application/json',
            ...options.headers,
        };
        
       
        if (!isFormData) {
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
                return;
            }

            const data = await response.json();
            if (!response.ok) throw data;
            return data;
        } catch (error) {
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
        return this.request(endpoint, {
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    // Méthodes de compatibilité
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