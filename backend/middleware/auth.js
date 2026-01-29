// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para verificar token JWT
 * Protege rutas que requieren autenticación
 */
const verifyToken = (req, res, next) => {
    // Obtener token del header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({
            error: 'Acceso denegado',
            message: 'No se proporcionó token de autenticación'
        });
    }
    
    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agregar información del usuario al request
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email
        };
        
        next();
    } catch (error) {
        console.error('Error al verificar token:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado',
                message: 'Por favor inicie sesión nuevamente'
            });
        }
        
        return res.status(403).json({
            error: 'Token inválido',
            message: 'El token proporcionado no es válido'
        });
    }
};

/**
 * Middleware opcional para agregar información del usuario si existe token
 * No bloquea si no hay token
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                id: decoded.id,
                username: decoded.username,
                email: decoded.email
            };
        } catch (error) {
            // Si hay error, simplemente no agregamos el usuario
            console.log('Token inválido o expirado en optionalAuth');
        }
    }
    
    next();
};

module.exports = {
    verifyToken,
    optionalAuth
};
