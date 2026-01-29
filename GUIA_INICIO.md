# 🚀 Guía de Inicio Rápido

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐              │
│  │ login.   │  │dashboard.│  │ formulario.  │              │
│  │  html    │→ │   html   │→ │    html      │              │
│  └──────────┘  └──────────┘  └──────────────┘              │
│         │             │               │                      │
│         └─────────────┴───────────────┘                      │
│                       │                                      │
│              ┌────────▼────────┐                            │
│              │  JavaScript     │                            │
│              │  (API Client)   │                            │
│              └────────┬────────┘                            │
└───────────────────────┼──────────────────────────────────────┘
                        │ HTTP/JSON + JWT
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                         BACKEND                              │
│              ┌─────────────────┐                            │
│              │   Express API   │                            │
│              └────────┬────────┘                            │
│                       │                                      │
│   ┌──────────────────┼──────────────────┐                  │
│   │                  │                   │                  │
│   ▼                  ▼                   ▼                  │
│ ┌──────┐      ┌──────────┐      ┌──────────┐              │
│ │Auth  │      │Business  │      │Data      │              │
│ │Routes│      │Logic     │      │Models    │              │
│ └──────┘      └──────────┘      └──────────┘              │
│   │                  │                   │                  │
│   └──────────────────┼───────────────────┘                  │
│                      │                                      │
│              ┌───────▼────────┐                            │
│              │  Middleware    │                            │
│              │  - Auth JWT    │                            │
│              │  - Validation  │                            │
│              └───────┬────────┘                            │
└──────────────────────┼──────────────────────────────────────┘
                       │ SQL Queries
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   BASE DE DATOS                             │
│              ┌──────────────────┐                           │
│              │  MySQL/PostgreSQL│                           │
│              └─────────┬────────┘                           │
│                        │                                     │
│    ┌───────────────────┼───────────────────┐               │
│    ▼                   ▼                   ▼               │
│ ┌────────┐      ┌──────────────┐   ┌─────────┐            │
│ │usuarios│      │tipificaciones│   │acciones │            │
│ └────────┘      └──────────────┘   └─────────┘            │
│     │                   │                 │                │
│     └───────────────────┴─────────────────┘                │
│            Relaciones (Foreign Keys)                        │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Datos: Ejemplo de Login

```
1. Usuario ingresa credenciales en login.html
                    │
                    ▼
2. JavaScript captura el formulario
                    │
                    ▼
3. POST /api/auth/login
   {username: "admin", password: "pass123"}
                    │
                    ▼
4. Backend recibe petición en routes/auth.js
                    │
                    ▼
5. Consulta BD: SELECT * FROM usuarios WHERE username=?
                    │
                    ▼
6. Validación con bcrypt.compare(password, hash)
                    │
                    ▼
7. Genera JWT token
                    │
                    ▼
8. Respuesta JSON:
   {token: "eyJ...", user: {...}}
                    │
                    ▼
9. Frontend guarda token en localStorage
                    │
                    ▼
10. Redirección a dashboard.html
```

## Flujo de Datos: Guardar Acción

```
1. Usuario completa formulario.html
                    │
                    ▼
2. Selecciona tipificación + escribe descripción
                    │
                    ▼
3. POST /api/acciones
   Headers: Authorization: Bearer <token>
   Body: {
     tipificacion_id: 1,
     descripcion: "...",
     datos_json: {...}
   }
                    │
                    ▼
4. Middleware verifyToken() valida JWT
                    │
                    ▼
5. Backend extrae usuario_id del token
                    │
                    ▼
6. INSERT INTO acciones (usuario_id, tipificacion_id...)
                    │
                    ▼
7. Respuesta: {message: "OK", accion: {...}}
                    │
                    ▼
8. Frontend muestra mensaje de éxito
                    │
                    ▼
9. Redirección al dashboard
```

## 📦 Pasos de Instalación

### 1️⃣ Preparar Base de Datos

```bash
# Acceder a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE gestion_empresarial;

# Seleccionar base de datos
USE gestion_empresarial;

# Ejecutar scripts
SOURCE /ruta/a/database/schema.sql;
SOURCE /ruta/a/database/seeds.sql;

# Verificar
SHOW TABLES;
SELECT * FROM usuarios;
```

### 2️⃣ Configurar Backend

```bash
# Navegar a carpeta backend
cd backend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales
nano .env  # o usar VS Code
```

**Configuración .env:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=gestion_empresarial
JWT_SECRET=cambiar_por_algo_muy_seguro_123456
```

```bash
# Iniciar servidor
npm start

# Deberías ver:
# ✅ Conexión a base de datos exitosa
# 🚀 Servidor corriendo en http://localhost:3000
```

### 3️⃣ Iniciar Frontend

```bash
# Opción 1: Abrir directamente (puede tener problemas de CORS)
open frontend/login.html

# Opción 2: Usar servidor local (RECOMENDADO)
# Instalar serve globalmente
npm install -g serve

# Iniciar desde la raíz del proyecto
serve frontend -p 8080

# Abrir en navegador:
# http://localhost:8080/login.html
```

### 4️⃣ Probar el Sistema

**Usuarios de prueba:**
- **Usuario:** `admin` | **Contraseña:** `password123`
- **Usuario:** `juan.perez` | **Contraseña:** `password123`

## 🧪 Pruebas con API

### Usando cURL:

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Copiar el token de la respuesta

# 2. Obtener mis datos
curl http://localhost:3000/api/auth/login/users/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# 3. Obtener tipificaciones
curl http://localhost:3000/api/tipificaciones \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# 4. Crear acción
curl -X POST http://localhost:3000/api/acciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "tipificacion_id": 1,
    "descripcion": "Solicitud de vacaciones",
    "estado": "pendiente"
  }'
```

## 📂 Estructura de Archivos

```
Proyecto_Captura_HMTL/
│
├── README.md                    # Documentación principal
├── .gitignore                   # Archivos ignorados
│
├── database/                    # Scripts de base de datos
│   ├── schema.sql              # Estructura de tablas
│   └── seeds.sql               # Datos iniciales
│
├── backend/                     # Servidor Node.js
│   ├── package.json            # Dependencias
│   ├── .env.example            # Configuración ejemplo
│   ├── server.js               # Punto de entrada
│   ├── config/
│   │   └── database.js         # Configuración BD
│   ├── middleware/
│   │   └── auth.js             # Autenticación JWT
│   └── routes/
│       ├── auth.js             # Login/Register
│       ├── users.js            # Usuarios
│       ├── tipificaciones.js   # Catálogos
│       └── acciones.js         # CRUD acciones
│
└── frontend/                    # Interfaz web
    ├── login.html
    ├── dashboard.html
    ├── formulario.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── config.js           # Configuración API
        ├── auth.js             # Manejo de sesión
        ├── api.js              # Cliente API
        ├── login.js            # Lógica login
        ├── dashboard.js        # Lógica dashboard
        └── formulario.js       # Lógica formularios
```

## 🔐 Seguridad Implementada

✅ **Contraseñas hasheadas** con bcrypt (10 rounds)  
✅ **Autenticación JWT** con expiración  
✅ **Validación de datos** con express-validator  
✅ **Protección SQL injection** con prepared statements  
✅ **CORS configurado** para dominios permitidos  
✅ **Tokens en localStorage** (mejor que cookies para apps internas)  

## 📊 Ejemplos de Consultas SQL

```sql
-- Ver acciones de un usuario específico
SELECT 
    a.descripcion,
    t.categoria,
    t.descripcion AS tipificacion,
    a.estado,
    a.fecha_creacion
FROM acciones a
INNER JOIN tipificaciones t ON a.tipificacion_id = t.id
WHERE a.usuario_id = 2
ORDER BY a.fecha_creacion DESC;

-- Reporte de acciones por estado
SELECT 
    estado,
    COUNT(*) as cantidad
FROM acciones
GROUP BY estado;

-- Tipificaciones más usadas
SELECT 
    t.descripcion,
    COUNT(a.id) as total_usos
FROM tipificaciones t
LEFT JOIN acciones a ON t.id = a.tipificacion_id
GROUP BY t.id
ORDER BY total_usos DESC;
```

## 🎯 Próximas Mejoras

- [ ] Panel de administración
- [ ] Reportes en PDF
- [ ] Filtros avanzados
- [ ] Notificaciones en tiempo real
- [ ] Roles y permisos
- [ ] Auditoría de cambios
- [ ] Exportar datos a Excel
