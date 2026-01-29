# 🏢 Sistema de Gestión Interna Empresarial [![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/) [![MySQL](https://img.shields.io/badge/MySQL-5.7+-blue.svg)](https://www.mysql.com/) > Sistema web para gestión de formularios, tipificaciones y reportes empresariales. Arquitectura de 3 capas con autenticación JWT, API REST y base de datos relacional. **Uso interno / Desarrollo / Pruebas** --- ## 📋 Descripción Aplicación web empresarial para **entornos internos y de prueba** que permite: ✅ **Autenticación segura** de usuarios con JWT y bcrypt ✅ **Dashboard** con estadísticas calculadas desde la base de datos ✅ **Gestión de acciones** con formularios dinámicos ✅ **Tipificaciones predefinidas** para categorización de datos ✅ **API REST** configurable y lista para pruebas internas ✅ **Base de datos relacional** optimizada con índices ✅ **Frontend responsive** moderno sin dependencias de frameworks --- ## 🚀 Inicio Rápido
bash
# 1. Configurar base de datos
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seeds.sql

# 2. Configurar backend
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de MySQL
npm start

# 3. Iniciar frontend (en otra terminal)
npx serve frontend -p 8080

# 4. Abrir en navegador
open http://localhost:8080/login.html
**Usuario de prueba:** admin / password123 📖 **Documentación completa:** Ver [GUIA_NAVEGADOR.md](GUIA_NAVEGADOR.md) --- ## 🏗️ Arquitectura ### **Stack Tecnológico** | Capa | Tecnología | Descripción | |------|------------|-------------| | **Frontend** | HTML5 + CSS3 + Vanilla JS | Interfaz responsive sin dependencias | | **Backend** | Node.js + Express | API REST con autenticación JWT | | **Base de Datos** | MySQL 5.7+ | Modelo relacional con 4 tablas | | **Seguridad** | bcrypt + JWT + CORS | Autenticación stateless | ### **Estructura del Proyecto**
Proyecto_Captura_HMTL/
│
├── 📄 README.md                    # Este archivo
├── 📘 ARQUITECTURA.md              # Documentación técnica detallada
├── 📗 GUIA_INICIO.md               # Guía de instalación y configuración
├── 📙 GUIA_NAVEGADOR.md            # Guía práctica de uso
├── 🚫 .gitignore                   # Archivos ignorados por Git
│
├── 🗄️  database/                   # Scripts de Base de Datos
│   ├── schema.sql                  # ✅ Tablas, vistas, índices
│   └── seeds.sql                   # ✅ Datos iniciales de prueba
│
├── ⚙️  backend/                    # Servidor Node.js + Express
│   ├── package.json                # ✅ Dependencias
│   ├── .env.example                # ✅ Variables de entorno
│   ├── server.js                   # ✅ Punto de entrada
│   ├── config/
│   │   └── database.js             # ✅ Pool de conexiones MySQL
│   ├── middleware/
│   │   └── auth.js                 # ✅ Verificación JWT
│   └── routes/
│       ├── auth.js                 # ✅ POST /api/auth/login, /register
│       ├── users.js                # ✅ GET /api/users/me, /estadisticas
│       ├── tipificaciones.js       # ✅ GET /api/tipificaciones
│       └── acciones.js             # ✅ CRUD /api/acciones
│
└── 🎨 frontend/                    # Interfaz Web
    ├── login.html                  # ✅ Página de autenticación
    ├── dashboard.html              # ✅ Panel principal
    ├── formulario.html             # ✅ Captura de acciones
    ├── css/
    │   └── styles.css              # ✅ Diseño responsive completo
    └── js/
        ├── config.js               # ✅ Configuración de API
        ├── auth.js                 # ✅ Manejo de sesión
        ├── api.js                  # ✅ Cliente HTTP
        ├── login.js                # ✅ Lógica de login
        ├── dashboard.js            # ✅ Lógica del dashboard
        └── formulario.js           # ✅ Lógica de formularios
--- ## 🗄️ Modelo de Base de Datos ### **Diagrama Entidad-Relación**
┌─────────────┐       1:N        ┌─────────────┐       N:1        ┌─────────────────┐
│  usuarios   │──────────────────│  acciones   │──────────────────│ tipificaciones  │
├─────────────┤                  ├─────────────┤                  ├─────────────────┤
│ id (PK)     │                  │ id (PK)     │                  │ id (PK)         │
│ username    │                  │ usuario_id  │                  │ categoria       │
│ password    │                  │ tipif_id    │                  │ codigo          │
│ nombre      │                  │ descripcion │                  │ descripcion     │
│ email       │                  │ datos_json  │                  │ orden           │
│ activo      │                  │ estado      │                  │ activo          │
└─────────────┘                  └─────────────┘                  └─────────────────┘
### **Tablas Implementadas** | Tabla | Registros | Descripción | |-------|-----------|-------------| | usuarios | 4 usuarios de prueba | Gestión de acceso al sistema | | tipificaciones | 16 categorías | Catálogo de clasificaciones | | acciones | 4 ejemplos | Registro de formularios enviados | | sesiones | - | Tabla opcional para tracking de sesiones *(no implementada actualmente)* | **Vistas SQL:** - reporte_acciones_usuario - Reporte consolidado con JOINs - estadisticas_generales - Métricas agregadas del sistema 📖 **Modelo completo:** Ver [database/schema.sql](database/schema.sql) --- ## 🔄 Flujo de Información ### **1. Autenticación (Login)**
Usuario → login.html → POST /api/auth/login → Backend valida credenciales
                                            ↓
                                     Consulta BD (usuarios)
                                            ↓
                                   bcrypt.compare(password)
                                            ↓
                                    jwt.sign() → Token
                                            ↓
                              Frontend guarda en localStorage
                                            ↓
                                 Redirect → dashboard.html
### **2. Captura de Datos (Formulario)**
Usuario → formulario.html → Selecciona tipificación → Completa campos
                                            ↓
                         POST /api/acciones + Bearer Token
                                            ↓
                    Backend verifica JWT → Extrae usuario_id
                                            ↓
                           INSERT INTO acciones (datos)
                                            ↓
                              Respuesta JSON → Frontend
                                            ↓
                           Mensaje éxito → Redirect dashboard
### **3. Dashboard (Visualización)**
dashboard.html → GET /api/users/me/estadisticas + Bearer Token
                                            ↓
                        Backend ejecuta queries agregados
                                            ↓
              SELECT COUNT(*) ... GROUP BY estado (SQL)
                                            ↓
          Frontend renderiza tarjetas con estadísticas calculadas
📖 **Flujos detallados:** Ver [ARQUITECTURA.md](ARQUITECTURA.md) --- ## 🔐 Seguridad Implementada | Característica | Implementación | Estado | |----------------|----------------|--------| | **Hash de contraseñas** | bcrypt (10 rounds) | ✅ Implementado | | **Autenticación** | JWT con expiración 24h | ✅ Implementado | | **Validación de datos** | express-validator | ✅ Implementado | | **SQL Injection** | Prepared statements | ✅ Protegido | | **CORS** | Whitelist de orígenes | ✅ Configurado | | **Variables sensibles** | Archivo .env | ✅ Implementado | **Ejemplo de contraseña hasheada:**
Input:  "password123"
Output: "$2b$10$YQ7Y5qKq8Q5Y5Y5Y5Y5Y5OeKKZOxKZOxKZOx..."
--- ## 📡 API REST Endpoints ### **Autenticación**
http
POST   /api/auth/login       # Iniciar sesión
POST   /api/auth/register    # Registrar usuario nuevo
### **Usuarios**
http
GET    /api/users/me              # Datos del usuario actual
GET    /api/users/me/estadisticas # Estadísticas y últimas acciones
### **Tipificaciones**
http
GET    /api/tipificaciones           # Listar todas
GET    /api/tipificaciones/categorias # Agrupadas por categoría
GET    /api/tipificaciones/:id        # Obtener una específica
### **Acciones (CRUD completo)**
http
GET    /api/acciones      # Listar con filtros (?estado=pendiente)
POST   /api/acciones      # Crear nueva
GET    /api/acciones/:id  # Obtener una específica
PUT    /api/acciones/:id  # Actualizar
DELETE /api/acciones/:id  # Eliminar
**Todas las rutas (excepto /auth) requieren header:**
http
Authorization: Bearer <JWT_TOKEN>
📖 **Pruebas con cURL:** Ver [GUIA_INICIO.md](GUIA_INICIO.md#-pruebas-con-api) --- ## 📊 Consultas SQL Útiles
sql
-- Acciones por usuario
SELECT u.nombre, COUNT(a.id) as total
FROM usuarios u
LEFT JOIN acciones a ON u.id = a.usuario_id
GROUP BY u.id;

-- Tipificaciones más usadas
SELECT t.descripcion, COUNT(a.id) as usos
FROM tipificaciones t
LEFT JOIN acciones a ON t.id = a.tipificacion_id
GROUP BY t.id
ORDER BY usos DESC;

-- Acciones pendientes por categoría
SELECT t.categoria, COUNT(a.id) as pendientes
FROM acciones a
INNER JOIN tipificaciones t ON a.tipificacion_id = t.id
WHERE a.estado = 'pendiente'
GROUP BY t.categoria;

-- Usar vista predefinida
SELECT * FROM reporte_acciones_usuario
WHERE estado = 'completado'
ORDER BY fecha_creacion DESC;
--- ## 🎓 Documentación Completa | Documento | Contenido | |-----------|-----------| | 📘 [ARQUITECTURA.md](ARQUITECTURA.md) | Diseño técnico, patrones, diagramas de flujo detallados | | 📗 [GUIA_INICIO.md](GUIA_INICIO.md) | Instalación, configuración, estructura de archivos | | 📙 [GUIA_NAVEGADOR.md](GUIA_NAVEGADOR.md) | Uso práctico paso a paso en el navegador | --- ## ⚙️ Configuración ### **Variables de Entorno (backend/.env)**
env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=gestion_empresarial

# JWT
JWT_SECRET=cambiar_en_produccion_por_algo_muy_seguro
JWT_EXPIRES_IN=24h

# CORS
ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
--- ## 🧪 Testing y Pruebas ### **Verificación Rápida**
bash
# Backend funcionando
curl http://localhost:3000

# Login de prueba
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Usuarios en BD
mysql -u root -p gestion_empresarial -e "SELECT username, nombre FROM usuarios;"
### **Usuarios de Prueba** | Username | Password | Rol | |----------|----------|-----| | admin | password123 | Administrador | | juan.perez | password123 | Usuario estándar | | maria.garcia | password123 | Usuario estándar | | carlos.lopez | password123 | Usuario estándar | --- ## 🛠️ Resolución de Problemas ### ❌ Error: "Cannot connect to database"
bash
# Verificar MySQL
brew services list | grep mysql
brew services start mysql

# Verificar credenciales en backend/.env
### ❌ Error: "Port 3000 already in use"
bash
# Ver qué usa el puerto
lsof -i :3000

# Cambiar puerto en backend/.env
PORT=3001
### ❌ Error: CORS en navegador - Verificar que backend esté en puerto 3000 - Verificar que frontend esté en puerto 8080 - Revisar ALLOWED_ORIGINS en .env 📖 **Más soluciones:** Ver [GUIA_NAVEGADOR.md](GUIA_NAVEGADOR.md#-solución-de-problemas) --- ## 🎯 Estado del Proyecto | Característica | Estado | |----------------|--------| | ✅ Base de datos con modelo relacional | **Completado** | | ✅ Backend API REST con Express | **Completado** | | ✅ Autenticación JWT + bcrypt | **Completado** | | ✅ Frontend responsive | **Completado** | | ✅ CRUD de acciones | **Completado** | | ✅ Dashboard con estadísticas calculadas | **Completado** | | ✅ Formularios dinámicos | **Completado** | | ✅ Documentación completa | **Completado** | | ⬜ Módulo de reportes PDF | *Planificado* | | ⬜ Panel de administración | *Planificado* | | ⬜ Notificaciones en tiempo real | *Planificado* | --- ## 📄 Licencia Este proyecto es de **uso interno empresarial**. No está diseñado ni probado para ambientes de producción pública. Código proporcionado "tal cual" sin garantías. --- ## 👥 Contribución Para agregar funcionalidades: 1. Crear rama: git checkout -b feature/nueva-funcionalidad 2. Implementar cambios 3. Probar localmente 4. Commit: git commit -am 'Agrega nueva funcionalidad' 5. Push: git push origin feature/nueva-funcionalidad --- ## 📞 Soporte Para dudas o problemas: 1. Revisar [GUIA_NAVEGADOR.md](GUIA_NAVEGADOR.md) 2. Verificar logs del backend en terminal 3. Abrir consola del navegador (F12) 4. Consultar [ARQUITECTURA.md](ARQUITECTURA.md) --- **Desarrollado con Node.js, Express y MySQL** | **Enero 2026**