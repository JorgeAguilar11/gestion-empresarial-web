// ============================================
// RUTAS DE ACCIONES
// ============================================

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// ============================================
// GET /api/acciones
// Obtener todas las acciones del usuario autenticado
// ============================================
router.get('/', async (req, res) => {
    try {
        const { estado, desde, hasta, limit = 50 } = req.query;
        
        let query = `
            SELECT 
                a.id,
                a.descripcion,
                a.datos_json,
                a.estado,
                a.fecha_creacion,
                t.categoria,
                t.codigo,
                t.descripcion as tipificacion
            FROM acciones a
            INNER JOIN tipificaciones t ON a.tipificacion_id = t.id
            WHERE a.usuario_id = ?
        `;
        
        const params = [req.user.id];
        
        // Filtros opcionales
        if (estado) {
            query += ' AND a.estado = ?';
            params.push(estado);
        }
        
        if (desde) {
            query += ' AND a.fecha_creacion >= ?';
            params.push(desde);
        }
        
        if (hasta) {
            query += ' AND a.fecha_creacion <= ?';
            params.push(hasta);
        }
        
        query += ' ORDER BY a.fecha_creacion DESC LIMIT ?';
        params.push(parseInt(limit));
        
        const [acciones] = await pool.query(query, params);
        
        res.json(acciones);
        
    } catch (error) {
        console.error('Error al obtener acciones:', error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
});

// ============================================
// GET /api/acciones/:id
// Obtener una acción específica
// ============================================
router.get('/:id', async (req, res) => {
    try {
        const [acciones] = await pool.query(`
            SELECT 
                a.id,
                a.descripcion,
                a.datos_json,
                a.estado,
                a.fecha_creacion,
                a.fecha_modificacion,
                t.id as tipificacion_id,
                t.categoria,
                t.codigo,
                t.descripcion as tipificacion,
                u.username,
                u.nombre as usuario_nombre
            FROM acciones a
            INNER JOIN tipificaciones t ON a.tipificacion_id = t.id
            INNER JOIN usuarios u ON a.usuario_id = u.id
            WHERE a.id = ? AND a.usuario_id = ?
        `, [req.params.id, req.user.id]);
        
        if (acciones.length === 0) {
            return res.status(404).json({
                error: 'Acción no encontrada'
            });
        }
        
        res.json(acciones[0]);
        
    } catch (error) {
        console.error('Error al obtener acción:', error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
});

// ============================================
// POST /api/acciones
// Crear nueva acción
// ============================================
router.post('/', [
    body('tipificacion_id').isInt().withMessage('ID de tipificación inválido'),
    body('descripcion').optional().isString(),
    body('datos_json').optional().isObject(),
    body('estado').optional().isIn(['pendiente', 'en_proceso', 'completado']).withMessage('Estado inválido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { tipificacion_id, descripcion, datos_json, estado = 'pendiente' } = req.body;
    
    try {
        // Verificar que la tipificación existe
        const [tipificaciones] = await pool.query(
            'SELECT id FROM tipificaciones WHERE id = ? AND activo = TRUE',
            [tipificacion_id]
        );
        
        if (tipificaciones.length === 0) {
            return res.status(404).json({
                error: 'Tipificación no encontrada'
            });
        }
        
        // Insertar acción
        const [result] = await pool.query(
            'INSERT INTO acciones (usuario_id, tipificacion_id, descripcion, datos_json, estado) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, tipificacion_id, descripcion, JSON.stringify(datos_json), estado]
        );
        
        // Obtener la acción creada
        const [accionCreada] = await pool.query(`
            SELECT 
                a.id,
                a.descripcion,
                a.datos_json,
                a.estado,
                a.fecha_creacion,
                t.categoria,
                t.codigo,
                t.descripcion as tipificacion
            FROM acciones a
            INNER JOIN tipificaciones t ON a.tipificacion_id = t.id
            WHERE a.id = ?
        `, [result.insertId]);
        
        res.status(201).json({
            message: 'Acción creada exitosamente',
            accion: accionCreada[0]
        });
        
    } catch (error) {
        console.error('Error al crear acción:', error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
});

// ============================================
// PUT /api/acciones/:id
// Actualizar una acción existente
// ============================================
router.put('/:id', [
    body('descripcion').optional().isString(),
    body('datos_json').optional().isObject(),
    body('estado').optional().isIn(['pendiente', 'en_proceso', 'completado'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { descripcion, datos_json, estado } = req.body;
    
    try {
        // Verificar que la acción existe y pertenece al usuario
        const [acciones] = await pool.query(
            'SELECT id FROM acciones WHERE id = ? AND usuario_id = ?',
            [req.params.id, req.user.id]
        );
        
        if (acciones.length === 0) {
            return res.status(404).json({
                error: 'Acción no encontrada'
            });
        }
        
        // Construir query de actualización dinámicamente
        const updates = [];
        const params = [];
        
        if (descripcion !== undefined) {
            updates.push('descripcion = ?');
            params.push(descripcion);
        }
        
        if (datos_json !== undefined) {
            updates.push('datos_json = ?');
            params.push(JSON.stringify(datos_json));
        }
        
        if (estado !== undefined) {
            updates.push('estado = ?');
            params.push(estado);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({
                error: 'No se proporcionaron campos para actualizar'
            });
        }
        
        params.push(req.params.id);
        
        await pool.query(
            `UPDATE acciones SET ${updates.join(', ')} WHERE id = ?`,
            params
        );
        
        // Obtener acción actualizada
        const [accionActualizada] = await pool.query(`
            SELECT 
                a.id,
                a.descripcion,
                a.datos_json,
                a.estado,
                a.fecha_creacion,
                a.fecha_modificacion,
                t.categoria,
                t.codigo,
                t.descripcion as tipificacion
            FROM acciones a
            INNER JOIN tipificaciones t ON a.tipificacion_id = t.id
            WHERE a.id = ?
        `, [req.params.id]);
        
        res.json({
            message: 'Acción actualizada exitosamente',
            accion: accionActualizada[0]
        });
        
    } catch (error) {
        console.error('Error al actualizar acción:', error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
});

// ============================================
// DELETE /api/acciones/:id
// Eliminar una acción (solo si es del usuario)
// ============================================
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM acciones WHERE id = ? AND usuario_id = ?',
            [req.params.id, req.user.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Acción no encontrada'
            });
        }
        
        res.json({
            message: 'Acción eliminada exitosamente'
        });
        
    } catch (error) {
        console.error('Error al eliminar acción:', error);
        res.status(500).json({
            error: 'Error del servidor'
        });
    }
});

module.exports = router;
