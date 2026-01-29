// ============================================
// CLIENTE API
// ============================================

/**
 * Realizar petición a la API
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    // Agregar token si está disponible
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, config);
        
        // Si no está autenticado, redirigir a login
        if (response.status === 401) {
            removeToken();
            window.location.href = 'login.html';
            throw new Error('No autorizado');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Error en la petición');
        }
        
        return data;
    } catch (error) {
        console.error('Error en petición API:', error);
        throw error;
    }
}

/**
 * API de Autenticación
 */
const AuthAPI = {
    async login(username, password) {
        return apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },
    
    async register(userData) {
        return apiRequest(API_CONFIG.ENDPOINTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
};

/**
 * API de Usuarios
 */
const UserAPI = {
    async getMe() {
        return apiRequest(API_CONFIG.ENDPOINTS.USER_ME);
    },
    
    async getStats() {
        return apiRequest(API_CONFIG.ENDPOINTS.USER_STATS);
    }
};

/**
 * API de Tipificaciones
 */
const TipificacionesAPI = {
    async getAll() {
        return apiRequest(API_CONFIG.ENDPOINTS.TIPIFICACIONES);
    },
    
    async getByCategorias() {
        return apiRequest(API_CONFIG.ENDPOINTS.TIPIFICACIONES_CATEGORIAS);
    },
    
    async getById(id) {
        return apiRequest(`${API_CONFIG.ENDPOINTS.TIPIFICACIONES}/${id}`);
    }
};

/**
 * API de Acciones
 */
const AccionesAPI = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString 
            ? `${API_CONFIG.ENDPOINTS.ACCIONES}?${queryString}`
            : API_CONFIG.ENDPOINTS.ACCIONES;
        return apiRequest(endpoint);
    },
    
    async getById(id) {
        return apiRequest(`${API_CONFIG.ENDPOINTS.ACCIONES}/${id}`);
    },
    
    async create(accionData) {
        return apiRequest(API_CONFIG.ENDPOINTS.ACCIONES, {
            method: 'POST',
            body: JSON.stringify(accionData)
        });
    },
    
    async update(id, accionData) {
        return apiRequest(`${API_CONFIG.ENDPOINTS.ACCIONES}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(accionData)
        });
    },
    
    async delete(id) {
        return apiRequest(`${API_CONFIG.ENDPOINTS.ACCIONES}/${id}`, {
            method: 'DELETE'
        });
    }
};

// Exportar APIs
window.AuthAPI = AuthAPI;
window.UserAPI = UserAPI;
window.TipificacionesAPI = TipificacionesAPI;
window.AccionesAPI = AccionesAPI;
