// ============================================
// LÓGICA DE LOGIN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginButton = document.getElementById('loginButton');
    
    loginForm.addEventListener('submit', handleLogin);
    
    async function handleLogin(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Validación básica
        if (!username || !password) {
            showError('Por favor complete todos los campos');
            return;
        }
        
        // Deshabilitar botón y mostrar loading
        loginButton.disabled = true;
        loginButton.textContent = 'Iniciando sesión...';
        hideError();
        
        try {
            // Realizar petición de login
            const response = await AuthAPI.login(username, password);
            
            // Guardar token y datos del usuario
            saveToken(response.token);
            saveUser(response.user);
            
            // Redireccionar al dashboard
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            showError(error.message || 'Error al iniciar sesión. Verifique sus credenciales.');
            
            // Rehabilitar botón
            loginButton.disabled = false;
            loginButton.textContent = 'Iniciar Sesión';
        }
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
});
