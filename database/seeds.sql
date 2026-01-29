-- ============================================
-- DATOS INICIALES PARA PRUEBAS
-- ============================================

-- ============================================
-- USUARIOS DE PRUEBA
-- Contraseña para todos: "password123"
-- Hash generado con bcrypt (10 rounds)
-- ============================================
INSERT INTO usuarios (username, password_hash, nombre, email) VALUES
('admin', '$2b$10$YQ7Y5qKq8Q5Y5Y5Y5Y5Y5OeKKZOxKZOxKZOxKZOxKZOxKZOxKZOx', 'Administrador Sistema', 'admin@empresa.com'),
('juan.perez', '$2b$10$YQ7Y5qKq8Q5Y5Y5Y5Y5Y5OeKKZOxKZOxKZOxKZOxKZOxKZOxKZOx', 'Juan Pérez', 'juan.perez@empresa.com'),
('maria.garcia', '$2b$10$YQ7Y5qKq8Q5Y5Y5Y5Y5Y5OeKKZOxKZOxKZOxKZOxKZOxKZOxKZOx', 'María García', 'maria.garcia@empresa.com'),
('carlos.lopez', '$2b$10$YQ7Y5qKq8Q5Y5Y5Y5Y5Y5OeKKZOxKZOxKZOxKZOxKZOxKZOxKZOx', 'Carlos López', 'carlos.lopez@empresa.com');

-- ============================================
-- TIPIFICACIONES
-- Catálogo de clasificaciones predefinidas
-- ============================================

-- Categoría: Solicitudes
INSERT INTO tipificaciones (categoria, codigo, descripcion, orden) VALUES
('Solicitudes', 'SOL-001', 'Solicitud de vacaciones', 1),
('Solicitudes', 'SOL-002', 'Solicitud de permiso', 2),
('Solicitudes', 'SOL-003', 'Solicitud de capacitación', 3),
('Solicitudes', 'SOL-004', 'Solicitud de materiales', 4),
('Solicitudes', 'SOL-005', 'Solicitud de soporte técnico', 5);

-- Categoría: Incidencias
INSERT INTO tipificaciones (categoria, codigo, descripcion, orden) VALUES
('Incidencias', 'INC-001', 'Problema técnico', 10),
('Incidencias', 'INC-002', 'Error en sistema', 11),
('Incidencias', 'INC-003', 'Acceso denegado', 12),
('Incidencias', 'INC-004', 'Falla de red', 13);

-- Categoría: Reportes
INSERT INTO tipificaciones (categoria, codigo, descripcion, orden) VALUES
('Reportes', 'REP-001', 'Reporte semanal', 20),
('Reportes', 'REP-002', 'Reporte mensual', 21),
('Reportes', 'REP-003', 'Reporte de actividades', 22);

-- Categoría: Consultas
INSERT INTO tipificaciones (categoria, codigo, descripcion, orden) VALUES
('Consultas', 'CON-001', 'Consulta general', 30),
('Consultas', 'CON-002', 'Consulta de procedimientos', 31),
('Consultas', 'CON-003', 'Consulta de políticas', 32);

-- ============================================
-- ACCIONES DE EJEMPLO
-- ============================================
INSERT INTO acciones (usuario_id, tipificacion_id, descripcion, datos_json, estado) VALUES
(
    2, 
    1, 
    'Solicitud de vacaciones del 1 al 15 de febrero',
    JSON_OBJECT(
        'fecha_inicio', '2026-02-01',
        'fecha_fin', '2026-02-15',
        'dias_solicitados', 15,
        'motivo', 'Vacaciones familiares'
    ),
    'pendiente'
),
(
    2, 
    6, 
    'Problema con acceso al servidor de archivos',
    JSON_OBJECT(
        'prioridad', 'alta',
        'area_afectada', 'Servidor de archivos',
        'detalles', 'No puedo acceder desde hace 2 horas'
    ),
    'en_proceso'
),
(
    3, 
    10, 
    'Reporte semanal de actividades',
    JSON_OBJECT(
        'semana', '4',
        'mes', 'enero',
        'horas_trabajadas', 40,
        'proyectos_completados', 3
    ),
    'completado'
),
(
    4, 
    4, 
    'Solicitud de papelería para el departamento',
    JSON_OBJECT(
        'items', JSON_ARRAY('Hojas', 'Bolígrafos', 'Carpetas'),
        'cantidad_estimada', 'Para 2 meses',
        'urgencia', 'media'
    ),
    'pendiente'
);

-- ============================================
-- CONSULTAS DE VERIFICACIÓN
-- ============================================

-- Ver todos los usuarios
-- SELECT * FROM usuarios;

-- Ver todas las tipificaciones agrupadas por categoría
-- SELECT categoria, COUNT(*) as total FROM tipificaciones GROUP BY categoria;

-- Ver acciones con información completa
-- SELECT * FROM reporte_acciones_usuario;

-- Ver estadísticas generales
-- SELECT * FROM estadisticas_generales;
