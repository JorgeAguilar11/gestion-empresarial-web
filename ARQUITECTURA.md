# 📐 Arquitectura del Sistema

## Visión General

Este documento explica en detalle la arquitectura de la aplicación web empresarial, el flujo de información y las decisiones de diseño.

---

## 🏗️ Arquitectura en 3 Capas

### **Capa 1: Frontend (Presentación)**

**Responsabilidades:**
- Interfaz de usuario
- Captura de datos
- Validación en cliente
- Comunicación con API

**Tecnologías:**
- HTML5 (estructura semántica)
- CSS3 (estilos y diseño responsive)
- JavaScript Vanilla (sin frameworks, máxima portabilidad)

**Componentes:**
```
login.html          → Autenticación
dashboard.html      → Panel principal
formulario.html     → Captura de datos
```

**Módulos JavaScript:**
```javascript
config.js     → Configuración centralizada (URLs, endpoints)
auth.js       → Manejo de sesión y tokens
api.js        → Cliente HTTP para comunicación con backend
login.js      → Lógica específica de login
dashboard.js  → Lógica del panel principal
formulario.js → Lógica de formularios
```

---

### **Capa 2: Backend (Lógica de Negocio)**

**Responsabilidades:**
- Validación de datos
- Autenticación y autorización
- Lógica de negocio
- Comunicación con base de datos

**Tecnologías:**
- Node.js (runtime JavaScript)
- Express (framework web)
- JWT (autenticación sin estado)
- bcryptjs (hash de contraseñas)

**Arquitectura REST API:**
```
server.js                → Punto de entrada
config/database.js       → Pool de conexiones MySQL
middleware/auth.js       → Verificación de tokens JWT
routes/
  ├── auth.js           → POST /api/auth/login, /register
  ├── users.js          → GET /api/users/me, /estadisticas
  ├── tipificaciones.js → GET /api/tipificaciones
  └── acciones.js       → CRUD /api/acciones
```

**Flujo de una Petición:**
```
1. Cliente envía petición HTTP
         ↓
2. Middleware CORS verifica origen
         ↓
3. Middleware Auth verifica JWT
         ↓
4. Router determina controlador
         ↓
5. Controlador ejecuta lógica
         ↓
6. Consulta/modifica base de datos
         ↓
7. Responde con JSON
```

---

### **Capa 3: Base de Datos (Persistencia)**

**Responsabilidades:**
- Almacenamiento persistente
- Integridad referencial
- Consultas optimizadas

**Motor:** MySQL/PostgreSQL (compatible con ambos)

**Modelo Relacional:**

```sql
┌─────────────┐
│  usuarios   │
├─────────────┤
│ id (PK)     │
│ username    │
│ password    │
│ nombre      │
│ email       │
└──────┬──────┘
       │
       │ 1:N
       │
       ▼
┌─────────────┐      N:1    ┌─────────────────┐
│  acciones   │──────────────│ tipificaciones  │
├─────────────┤              ├─────────────────┤
│ id (PK)     │              │ id (PK)         │
│ usuario_id  │              │ categoria       │
│ tipif_id    │              │ codigo          │
│ descripcion │              │ descripcion     │
│ datos_json  │              └─────────────────┘
│ estado      │
│ fecha       │
└─────────────┘
```

**Relaciones:**
- `usuarios` → `acciones` (1:N): Un usuario puede tener muchas acciones
- `tipificaciones` → `acciones` (1:N): Una tipificación puede usarse en muchas acciones

**Índices:**
```sql
-- Para búsquedas rápidas por usuario
INDEX idx_usuario_id ON acciones(usuario_id)

-- Para filtrar por tipificación
INDEX idx_tipificacion_id ON acciones(tipificacion_id)

-- Para ordenar por fecha
INDEX idx_fecha_creacion ON acciones(fecha_creacion)
```

---

## 🔄 Flujos de Información Detallados

### **Flujo 1: Autenticación (Login)**

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│ Frontend │                │ Backend  │                │   BD     │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ 1. POST /api/auth/login   │                           │
     │ {username, password}      │                           │
     ├───────────────────────────>                           │
     │                           │                           │
     │                           │ 2. SELECT * FROM usuarios │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │ 3. Datos del usuario      │
     │                           │<──────────────────────────┤
     │                           │                           │
     │                           │ 4. bcrypt.compare()       │
     │                           │    (validar password)     │
     │                           │                           │
     │                           │ 5. jwt.sign()             │
     │                           │    (generar token)        │
     │                           │                           │
     │ 6. {token, user}          │                           │
     │<───────────────────────────                           │
     │                           │                           │
     │ 7. localStorage.setItem() │                           │
     │    (guardar token)        │                           │
     │                           │                           │
     │ 8. Redirect dashboard     │                           │
     │                           │                           │
```

**Código Backend (simplificado):**
```javascript
// 1. Buscar usuario
const [users] = await pool.query(
    'SELECT * FROM usuarios WHERE username = ?', 
    [username]
);

// 2. Validar contraseña
const valid = await bcrypt.compare(password, user.password_hash);

// 3. Generar token
const token = jwt.sign(
    { id: user.id, username: user.username }, 
    SECRET, 
    { expiresIn: '24h' }
);

// 4. Responder
res.json({ token, user });
```

**Código Frontend (simplificado):**
```javascript
// 1. Enviar petición
const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
});

// 2. Guardar token
const data = await response.json();
localStorage.setItem('token', data.token);

// 3. Redireccionar
window.location = 'dashboard.html';
```

---

### **Flujo 2: Crear Nueva Acción**

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│ Frontend │                │ Backend  │                │   BD     │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ 1. GET /api/tipificaciones│                           │
     ├───────────────────────────>                           │
     │                           │ SELECT * FROM tipif...    │
     │                           ├──────────────────────────>│
     │ 2. [lista tipificaciones] │<──────────────────────────┤
     │<───────────────────────────                           │
     │                           │                           │
     │ 3. Renderizar <select>    │                           │
     │                           │                           │
     │ 4. Usuario completa form  │                           │
     │                           │                           │
     │ 5. POST /api/acciones     │                           │
     │    Header: Bearer token   │                           │
     │    Body: {datos...}       │                           │
     ├───────────────────────────>                           │
     │                           │                           │
     │                           │ 6. jwt.verify(token)      │
     │                           │    → obtener usuario_id   │
     │                           │                           │
     │                           │ 7. INSERT INTO acciones   │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │ 8. Confirmación           │
     │ 9. {success, accion}      │<──────────────────────────┤
     │<───────────────────────────                           │
     │                           │                           │
     │ 10. Mostrar mensaje éxito │                           │
     │     Redirect dashboard    │                           │
     │                           │                           │
```

**Seguridad en este flujo:**
1. Token JWT en header (no puede ser modificado sin la clave)
2. `usuario_id` se extrae del token (no lo envía el cliente)
3. Validación de `tipificacion_id` existe
4. Prepared statements previenen SQL injection

---

## 🔐 Seguridad Implementada

### **1. Autenticación con JWT**

**¿Qué es JWT?**
JSON Web Token: un token firmado digitalmente que contiene información del usuario.

**Estructura:**
```
header.payload.signature
eyJhbGc...  .  eyJ1c2Vy...  .  SflKxwRJ...
```

**Ventajas:**
- ✅ Sin estado (stateless): no requiere sesiones en servidor
- ✅ Escalable: funciona en múltiples servidores
- ✅ Seguro: firmado con clave secreta

**Implementación:**
```javascript
// Crear token (backend)
const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);

// Verificar token (middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // Agregar datos al request
```

### **2. Hash de Contraseñas con bcrypt**

**Nunca guardamos contraseñas en texto plano.**

```javascript
// Al registrar usuario
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
// Guardar 'hash' en BD

// Al hacer login
const match = await bcrypt.compare(password, storedHash);
```

**Ejemplo:**
```
Password: "password123"
Hash: "$2b$10$YQ7Y5qKq8Q5Y5Y5Y5Y5Y5OeKKZOxKZOxKZOxKZ..."
```

### **3. Validación de Datos**

**Backend:**
```javascript
const { body, validationResult } = require('express-validator');

router.post('/acciones', [
    body('tipificacion_id').isInt(),
    body('descripcion').notEmpty().trim()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }
    // ...procesar
});
```

**Frontend:**
```javascript
// Validación HTML5
<input required type="email">

// Validación JavaScript
if (!form.checkValidity()) {
    alert('Complete todos los campos');
}
```

### **4. Protección SQL Injection**

**❌ MAL (vulnerable):**
```javascript
const query = `SELECT * FROM usuarios WHERE username = '${username}'`;
```

**✅ BIEN (seguro):**
```javascript
const [users] = await pool.query(
    'SELECT * FROM usuarios WHERE username = ?',
    [username]  // Prepared statement
);
```

---

## 📊 Modelo de Datos Detallado

### **Tabla: usuarios**

```sql
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,    -- Login
    password_hash VARCHAR(255) NOT NULL,     -- Bcrypt hash
    nombre VARCHAR(100) NOT NULL,            -- Nombre completo
    email VARCHAR(100) UNIQUE NOT NULL,      -- Contacto
    fecha_creacion TIMESTAMP DEFAULT NOW(),  -- Auditoría
    activo BOOLEAN DEFAULT TRUE              -- Soft delete
);
```

**Decisiones de diseño:**
- `username` y `email` son UNIQUE para evitar duplicados
- `password_hash` con VARCHAR(255) para bcrypt
- `activo` para desactivar sin eliminar (auditoría)

### **Tabla: tipificaciones**

```sql
CREATE TABLE tipificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(50) NOT NULL,          -- Agrupa tipificaciones
    codigo VARCHAR(20) NOT NULL UNIQUE,      -- Identificador corto
    descripcion VARCHAR(255) NOT NULL,       -- Descripción legible
    orden INT DEFAULT 0,                     -- Para ordenar en UI
    activo BOOLEAN DEFAULT TRUE
);
```

**Ejemplo de datos:**
```sql
INSERT INTO tipificaciones VALUES
(1, 'Solicitudes', 'SOL-001', 'Solicitud de vacaciones', 1, TRUE),
(2, 'Solicitudes', 'SOL-002', 'Solicitud de permiso', 2, TRUE),
(3, 'Incidencias', 'INC-001', 'Problema técnico', 10, TRUE);
```

### **Tabla: acciones**

```sql
CREATE TABLE acciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,                 -- FK a usuarios
    tipificacion_id INT NOT NULL,            -- FK a tipificaciones
    descripcion TEXT,                        -- Texto libre
    datos_json JSON,                         -- Campos adicionales flexibles
    estado VARCHAR(20) DEFAULT 'pendiente',  -- Estado del workflow
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (tipificacion_id) REFERENCES tipificaciones(id)
);
```

**Campo JSON (datos_json):**
```json
{
    "prioridad": "alta",
    "area": "Recursos Humanos",
    "comentarios": "Urgente",
    "fecha_inicio": "2026-02-01"
}
```

**Ventaja:** Flexibilidad sin alterar esquema de BD.

---

## 🎯 Patrones de Diseño Utilizados

### **1. MVC (Model-View-Controller)**

```
Model       → Base de datos (MySQL)
View        → Frontend (HTML/CSS/JS)
Controller  → Backend (Express routes)
```

### **2. REST API**

```
GET    /api/acciones      → Listar
POST   /api/acciones      → Crear
GET    /api/acciones/:id  → Obtener uno
PUT    /api/acciones/:id  → Actualizar
DELETE /api/acciones/:id  → Eliminar
```

### **3. Middleware Chain**

```javascript
router.post('/acciones',
    verifyToken,        // 1. Verificar JWT
    validateInput,      // 2. Validar datos
    handleAccion        // 3. Procesar
);
```

---

## 📈 Escalabilidad

**Estrategias implementadas:**

1. **Pool de conexiones:** Reutiliza conexiones a BD
2. **JWT stateless:** No requiere almacenar sesiones
3. **Índices en BD:** Búsquedas rápidas
4. **JSON para datos flexibles:** Evita ALTER TABLE constante

**Mejoras futuras:**
- Cache con Redis
- Load balancer (múltiples instancias de backend)
- CDN para archivos estáticos
- Paginación en listados

---

## 🧪 Testing (Próximas Implementaciones)

```javascript
// Ejemplo de test con Jest
describe('POST /api/auth/login', () => {
    test('Login exitoso con credenciales válidas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'password123' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
```

---

## 📚 Referencias Técnicas

- **Express.js:** https://expressjs.com/
- **JWT:** https://jwt.io/
- **bcrypt:** https://github.com/kelektiv/node.bcrypt.js
- **MySQL:** https://dev.mysql.com/doc/
- **REST API Best Practices:** https://restfulapi.net/

---

**Documento creado:** Enero 2026  
**Versión:** 1.0
