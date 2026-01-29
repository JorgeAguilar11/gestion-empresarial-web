// ============================================
// SERVIDOR PRINCIPAL
// ============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tipificacionesRoutes = require('./routes/tipificaciones');
const accionesRoutes = require('./routes/acciones');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES
// ============================================

// CORS - Permitir peticiones desde el frontend
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));

// Parser de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging simple
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============================================
// RUTAS
// ============================================

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API de Sistema de Gestión Empresarial',
        version: '1.0.0',
        status: 'running'
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tipificaciones', tipificacionesRoutes);
app.use('/api/acciones', accionesRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.path
    });
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const startServer = async () => {
    // Verificar conexión a base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.error('⚠️  Servidor iniciado sin conexión a base de datos');
    }
    
    app.listen(PORT, () => {
        console.log('');
        console.log('════════════════════════════════════════════');
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
        console.log('════════════════════════════════════════════');
        console.log('');
    });
};

startServer();
