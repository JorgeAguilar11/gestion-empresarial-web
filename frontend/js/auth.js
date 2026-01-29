// ============================================
// UTILIDADES DE AUTENTICACIÓN
// ============================================

/**
 * Guardar token en localStorage
 */
function saveToken(token) {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, token);
}

/**
 * Obtener token de localStorage
 */
function getToken() {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
}

/**
 * Eliminar token de localStorage
 */
function removeToken() {
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
}

/**
 * Guardar datos del usuario
 */
function saveUser(user) {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
}

/**
 * Obtener datos del usuario
 */
function getUser() {
    const userData = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
}

/**
 * Verificar si el usuario está autenticado
 */
function isAuthenticated() {
    return getToken() !== null;
}

/**
 * Redireccionar según estado de autenticación
 */
function checkAuth() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!isAuthenticated() && currentPage !== 'login.html') {
        window.location.href = 'login.html';
        return false;
    }
    
    if (isAuthenticated() && currentPage === 'login.html') {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

/**
 * Cerrar sesión
 */
function logout() {
    removeToken();
    window.location.href = 'login.html';
}

/**
 * Actualizar nombre de usuario en el header
 */
function updateUserName() {
    const user = getUser();
    if (user) {
        const userNameElements = document.querySelectorAll('#userName, #userNameDisplay');
        userNameElements.forEach(el => {
            if (el) el.textContent = user.nombre || user.username;
        });
    }
}

// Ejecutar al cargar la página
if (checkAuth()) {
    updateUserName();
}
