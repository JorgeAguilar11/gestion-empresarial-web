// ============================================
// RUTAS DE USUARIOS
// ============================================

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// ============================================
// GET /api/users/me
// Obtener información del usuario autenticado
// ============================================
router.get('/me', async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, username, nombre, email, fecha_creacion FROM usuarios WHERE id = ?',
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }
        
        res.json(users[0]);
        
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
});

// ============================================
// GET /api/users/me/estadisticas
// Obtener estadísticas del usuario autenticado
// ============================================
router.get('/me/estadisticas', async (req, res) => {
    try {
        // Contar acciones por estado
        const [estadisticas] = await pool.query(`
            SELECT 
                COUNT(*) as total_acciones,
                SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
                SUM(CASE WHEN estado = 'en_proceso' THEN 1 ELSE 0 END) as en_proceso,
                SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) as completadas
            FROM acciones 
            WHERE usuario_id = ?
        `, [req.user.id]);
        
        // Últimas acciones
        const [ultimasAcciones] = await pool.query(`
            SELECT 
                a.id,
                a.descripcion,
                a.estado,
                a.fecha_creacion,
                t.descripcion as tipificacion
            FROM acciones a
            INNER JOIN tipificaciones t ON a.tipificacion_id = t.id
            WHERE a.usuario_id = ?
            ORDER BY a.fecha_creacion DESC
            LIMIT 5
        `, [req.user.id]);
        
        res.json({
            estadisticas: estadisticas[0],
            ultimasAcciones
        });
        
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
});

module.exports = router;
