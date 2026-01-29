// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
require('dotenv').config();

// ============================================
// POST /api/auth/login
// Autenticar usuario y generar token
// ============================================
router.post('/login', [
    body('username').notEmpty().withMessage('El usuario es requerido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
], async (req, res) => {
    // Validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password } = req.body;
    
    try {
        // Buscar usuario en la base de datos
        const [users] = await pool.query(
            'SELECT id, username, password_hash, nombre, email, activo FROM usuarios WHERE username = ?',
            [username]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
                message: 'Usuario o contraseña incorrectos'
            });
        }
        
        const user = users[0];
        
        // Verificar si el usuario está activo
        if (!user.activo) {
            return res.status(403).json({
                error: 'Usuario inactivo',
                message: 'Su cuenta ha sido desactivada. Contacte al administrador.'
            });
        }
        
        // Comparar contraseña
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
                message: 'Usuario o contraseña incorrectos'
            });
        }
        
        // Generar JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
        
        // Responder con token y datos del usuario
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                nombre: user.nombre,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Ocurrió un error al procesar la solicitud'
        });
    }
});

// ============================================
// POST /api/auth/register
// Registrar nuevo usuario (opcional, puede requerir rol admin)
// ============================================
router.post('/register', [
    body('username').isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password, nombre, email } = req.body;
    
    try {
        // Verificar si el usuario ya existe
        const [existingUsers] = await pool.query(
            'SELECT id FROM usuarios WHERE username = ? OR email = ?',
            [username, email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(409).json({
                error: 'Usuario ya existe',
                message: 'El nombre de usuario o email ya están registrados'
            });
        }
        
        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // Insertar nuevo usuario
        const [result] = await pool.query(
            'INSERT INTO usuarios (username, password_hash, nombre, email) VALUES (?, ?, ?, ?)',
            [username, passwordHash, nombre, email]
        );
        
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: result.insertId,
                username,
                nombre,
                email
            }
        });
        
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Ocurrió un error al registrar el usuario'
        });
    }
});

module.exports = router;
