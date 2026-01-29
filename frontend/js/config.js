// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

const API_CONFIG = {
    // URL base del backend
    BASE_URL: 'http://localhost:3000/api',
    
    // Endpoints
    ENDPOINTS: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        USER_ME: '/users/me',
        USER_STATS: '/users/me/estadisticas',
        TIPIFICACIONES: '/tipificaciones',
        TIPIFICACIONES_CATEGORIAS: '/tipificaciones/categorias',
        ACCIONES: '/acciones'
    },
    
    // Configuración de timeouts
    TIMEOUT: 10000,
    
    // Claves de localStorage
    STORAGE_KEYS: {
        TOKEN: 'auth_token',
        USER: 'user_data'
    }
};

// Exportar configuración
window.API_CONFIG = API_CONFIG;
