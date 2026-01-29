-- ============================================
-- SISTEMA DE GESTIÓN INTERNA EMPRESARIAL
-- Script de Creación de Base de Datos
-- ============================================

-- Crear base de datos (descomentar si es necesario)
-- CREATE DATABASE gestion_empresarial;
-- USE gestion_empresarial;

-- ============================================
-- TABLA: usuarios
-- Almacena información de los usuarios del sistema
-- ============================================
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: tipificaciones
-- Catálogo de tipificaciones para clasificar acciones
-- ============================================
CREATE TABLE tipificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(50) NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_codigo (codigo),
    UNIQUE KEY unique_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: acciones
-- Registra cada formulario/acción enviado por usuarios
-- ============================================
CREATE TABLE acciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipificacion_id INT NOT NULL,
    descripcion TEXT,
    datos_json JSON,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    CONSTRAINT fk_acciones_usuario 
        FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_acciones_tipificacion 
        FOREIGN KEY (tipificacion_id) 
        REFERENCES tipificaciones(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    -- Índices para mejorar rendimiento
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_tipificacion_id (tipificacion_id),
    INDEX idx_fecha_creacion (fecha_creacion),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: sesiones (opcional, para manejar tokens)
-- ============================================
CREATE TABLE sesiones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT fk_sesiones_usuario 
        FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_token (token(255)),
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_fecha_expiracion (fecha_expiracion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VISTA: reporte_acciones_usuario
-- Vista para facilitar consultas de reportes
-- ============================================
CREATE VIEW reporte_acciones_usuario AS
SELECT 
    a.id AS accion_id,
    u.id AS usuario_id,
    u.username,
    u.nombre AS nombre_usuario,
    t.categoria,
    t.codigo AS codigo_tipificacion,
    t.descripcion AS tipificacion,
    a.descripcion AS detalle,
    a.estado,
    a.fecha_creacion
FROM acciones a
INNER JOIN usuarios u ON a.usuario_id = u.id
INNER JOIN tipificaciones t ON a.tipificacion_id = t.id
WHERE u.activo = TRUE;

-- ============================================
-- VISTA: estadisticas_generales
-- Vista con estadísticas resumidas
-- ============================================
CREATE VIEW estadisticas_generales AS
SELECT 
    COUNT(DISTINCT u.id) as total_usuarios,
    COUNT(DISTINCT t.id) as total_tipificaciones,
    COUNT(a.id) as total_acciones,
    COUNT(CASE WHEN a.estado = 'completado' THEN 1 END) as acciones_completadas,
    COUNT(CASE WHEN a.estado = 'pendiente' THEN 1 END) as acciones_pendientes
FROM usuarios u
CROSS JOIN tipificaciones t
LEFT JOIN acciones a ON 1=1;
