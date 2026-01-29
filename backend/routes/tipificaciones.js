// ============================================
// RUTAS DE TIPIFICACIONES
// ============================================

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// ============================================
// GET /api/tipificaciones
// Obtener todas las tipificaciones activas
// ============================================
router.get('/', async (req, res) => {
    try {
        const [tipificaciones] = await pool.query(
            'SELECT id, categoria, codigo, descripcion FROM tipificaciones WHERE activo = TRUE ORDER BY categoria, orden, descripcion'
        );
        
        res.json(tipificaciones);
        
    } catch (error) {
        console.error('Error al obtener tipificaciones:', error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
});

// ============================================
// GET /api/tipificaciones/categorias
// Obtener tipificaciones agrupadas por categoría
// ============================================
router.get('/categorias', async (req, res) => {
    try {
        const [tipificaciones] = await pool.query(
            'SELECT id, categoria, codigo, descripcion FROM tipificaciones WHERE activo = TRUE ORDER BY categoria, orden, descripcion'
        );
        
        // Agrupar por categoría
        const agrupadas = tipificaciones.reduce((acc, tip) => {
            if (!acc[tip.categoria]) {
                acc[tip.categoria] = [];
            }
            acc[tip.categoria].push({
                id: tip.id,
                codigo: tip.codigo,
                descripcion: tip.descripcion
            });
            return acc;
        }, {});
        
        res.json(agrupadas);
        
    } catch (error) {
        console.error('Error al obtener tipificaciones por categoría:', error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
});

// ============================================
// GET /api/tipificaciones/:id
// Obtener una tipificación específica
// ============================================
router.get('/:id', async (req, res) => {
    try {
        const [tipificaciones] = await pool.query(
            'SELECT id, categoria, codigo, descripcion FROM tipificaciones WHERE id = ? AND activo = TRUE',
            [req.params.id]
        );
        
        if (tipificaciones.length === 0) {
            return res.status(404).json({
                error: 'Tipificación no encontrada'
            });
        }
        
        res.json(tipificaciones[0]);
        
    } catch (error) {
        console.error('Error al obtener tipificación:', error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
});

module.exports = router;
