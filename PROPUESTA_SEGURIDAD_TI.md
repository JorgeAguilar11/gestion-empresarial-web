# 🔒 Propuesta de Implementación - Sistema de Gestión Empresarial
## Documento para Seguridad de la Información

**Fecha:** 30 de enero de 2026  
**Versión:** 1.0  
**Tipo:** Sistema Web Interno - Intranet

---

## 📋 RESUMEN EJECUTIVO

Sistema web de gestión interna para registro de acciones, tipificaciones y reportes empresariales. Diseñado para operar **exclusivamente en red interna (intranet)** sin exposición a internet público.

### Propósito
- Centralizar registro de acciones y formularios
- Gestionar tipificaciones y categorías de datos
- Generar estadísticas y reportes en tiempo real
- Mejorar trazabilidad de operaciones internas

---

## 🏗️ ARQUITECTURA TÉCNICA

### Componente 1: Frontend (Cliente)
- **Tecnología:** HTML5, CSS3, JavaScript Vanilla
- **Puerto:** 8080 (configurable)
- **Comunicación:** HTTP/HTTPS con Backend vía API REST
- **Almacenamiento local:** JWT en localStorage del navegador

### Componente 2: Backend (Servidor)
- **Tecnología:** Node.js + Express.js
- **Puerto:** 3000 (configurable)
- **Funciones:** 
  - API REST
  - Autenticación JWT
  - Validación de datos
  - Lógica de negocio

### Componente 3: Base de Datos
- **Motor:** MySQL 5.7+
- **Puerto:** 3306 (estándar)
- **Datos almacenados:**
  - Usuarios y credenciales (contraseñas hasheadas)
  - Acciones/formularios
  - Tipificaciones
  - Logs de auditoría

### Diagrama de Arquitectura
```
┌─────────────────────────────────────────┐
│   NAVEGADORES (Usuarios Internos)      │
│   Chrome, Firefox, Safari, Edge         │
└─────────────┬───────────────────────────┘
              │ HTTP/HTTPS
              │ Puerto 8080
┌─────────────▼───────────────────────────┐
│   SERVIDOR WEB - FRONTEND               │
│   (Python HTTP Server / Apache / Nginx) │
└─────────────┬───────────────────────────┘
              │ API REST + JWT
              │ Puerto 3000
┌─────────────▼───────────────────────────┐
│   SERVIDOR APLICACIÓN - BACKEND         │
│   Node.js + Express                     │
│   • Autenticación JWT                   │
│   • Validación de datos                 │
│   • Lógica de negocio                   │
└─────────────┬───────────────────────────┘
              │ SQL Queries
              │ Puerto 3306
┌─────────────▼───────────────────────────┐
│   SERVIDOR BASE DE DATOS                │
│   MySQL                                 │
│   • Usuarios y credenciales             │
│   • Datos de negocio                    │
│   • Logs de auditoría                   │
└─────────────────────────────────────────┘
```

---

## 🔐 CARACTERÍSTICAS DE SEGURIDAD IMPLEMENTADAS

### 1. Autenticación
- ✅ **JWT (JSON Web Tokens)** para sesiones
- ✅ **Bcrypt** para hash de contraseñas (factor de costo: 10)
- ✅ Tokens con expiración configurable
- ✅ Validación de credenciales en cada petición

### 2. Autorización
- ✅ Middleware de autorización en todas las rutas protegidas
- ✅ Verificación de token en cada petición API
- ✅ Control de acceso basado en roles (preparado para expandir)

### 3. Protección de Datos
- ✅ **Contraseñas NUNCA almacenadas en texto plano**
- ✅ Hash unidireccional con salt automático (bcrypt)
- ✅ Validación de entrada de datos (express-validator)
- ✅ Sanitización de datos antes de queries SQL

### 4. Prevención de Ataques
- ✅ **CORS configurado** para prevenir peticiones no autorizadas
- ✅ **Prepared Statements** en SQL (prevención de SQL Injection)
- ✅ Validación de tipos de datos en todas las entradas
- ✅ Headers de seguridad HTTP configurables

### 5. Auditoría
- ✅ Logs de acceso en consola del servidor
- ✅ Registro de operaciones en base de datos
- 🔄 Preparado para agregar logs detallados de auditoría

---

## 📊 DATOS MANEJADOS

### Información de Usuarios
- Nombre completo
- Correo electrónico (usuario)
- Contraseña (hasheada con bcrypt)
- Rol
- Departamento

### Información de Negocio
- Formularios/Acciones con campos personalizables
- Tipificaciones y categorías
- Estadísticas calculadas
- Metadatos (fechas de creación, usuario creador)

### NO se almacena:
- ❌ Información bancaria
- ❌ Números de tarjetas
- ❌ Datos médicos
- ❌ Información sensible regulada

---

## 🌐 MODELO DE DESPLIEGUE PROPUESTO

### Opción 1: Servidor Único (Recomendado para Inicio)
```
┌─────────────────────────────────────────┐
│   Servidor Interno (1 máquina)         │
│   • Backend (puerto 3000)               │
│   • Frontend (puerto 8080)              │
│   • MySQL (puerto 3306)                 │
│   IP: 192.168.X.X (red interna)         │
└─────────────────────────────────────────┘
         ↑
         │ Acceso vía navegador
         │
┌────────────────────────────────────────┐
│  Usuarios internos en la red           │
│  http://192.168.X.X:8080               │
└────────────────────────────────────────┘
```

### Opción 2: Arquitectura Distribuida (Producción)
```
┌───────────────────┐
│  Servidor Web     │  Frontend
│  Apache/Nginx     │
└─────────┬─────────┘
          │
┌─────────▼─────────┐
│  Servidor App     │  Backend (Node.js)
│  Node.js          │
└─────────┬─────────┘
          │
┌─────────▼─────────┐
│  Servidor BD      │  MySQL
│  MySQL            │
└───────────────────┘
```

---

## ⚠️ RIESGOS Y MITIGACIONES

### Riesgo 1: Acceso No Autorizado
**Mitigación:**
- Sistema solo accesible en red interna
- Firewall configurado para bloquear acceso externo
- Autenticación obligatoria con JWT
- Sesiones con tiempo de expiración

### Riesgo 2: Inyección SQL
**Mitigación:**
- Uso de prepared statements en todas las queries
- Librería mysql2 con protección integrada
- Validación de entrada de datos

### Riesgo 3: Fuga de Información
**Mitigación:**
- Contraseñas hasheadas (nunca en texto plano)
- Tokens JWT con expiración
- Sin logging de información sensible
- Control de acceso por roles

### Riesgo 4: Disponibilidad
**Mitigación:**
- Sistema puede operar sin internet
- Base de datos local/interna
- Respaldo de base de datos (recomendado implementar)
- Logs para diagnóstico de problemas

---

## 📋 REQUERIMIENTOS DE INFRAESTRUCTURA

### Hardware (Servidor)
- **CPU:** 2 cores mínimo (4 recomendado)
- **RAM:** 4 GB mínimo (8 GB recomendado)
- **Disco:** 20 GB (incluye SO, aplicación y BD)
- **Red:** Conexión a red interna, NO requiere internet

### Software
- **Sistema Operativo:** Linux (Ubuntu/CentOS), Windows Server, o macOS
- **Node.js:** v16 o superior
- **MySQL:** v5.7 o superior
- **Servidor Web:** Python HTTP Server / Apache / Nginx

### Red
- **Puerto 3000:** Backend API (interno)
- **Puerto 8080:** Frontend Web (acceso usuarios)
- **Puerto 3306:** MySQL (interno, no exponer)
- **Firewall:** Bloquear acceso desde internet público

---

## ✅ VENTAJAS DE SEGURIDAD

1. **Aislamiento:** Sistema opera completamente offline, sin exposición a internet
2. **Control Total:** Infraestructura y datos bajo control de la organización
3. **Sin Terceros:** No depende de servicios cloud externos
4. **Auditable:** Código fuente disponible para revisión interna
5. **Escalable:** Fácil agregar capas adicionales de seguridad
6. **Económico:** Sin costos de servicios externos o licencias

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: Pruebas (2 semanas)
- Instalación en servidor de desarrollo
- Pruebas de seguridad básicas
- Revisión de código por TI
- Validación de funcionalidad

### Fase 2: Piloto (1 mes)
- Despliegue para grupo reducido de usuarios
- Monitoreo de logs y rendimiento
- Recolección de feedback
- Ajustes de seguridad necesarios

### Fase 3: Producción
- Migración a servidor de producción
- Configuración de respaldos automáticos
- Capacitación a usuarios
- Documentación final
- Plan de mantenimiento

---

## 📞 INFORMACIÓN DE CONTACTO

**Responsable del Proyecto:** [Tu Nombre]  
**Departamento:** [Tu Departamento]  
**Correo:** [Tu Email]  
**Extensión:** [Tu Extensión]

---

## 📎 ANEXOS

### Anexo A: Dependencias de Software
```json
Backend:
- express: Framework web
- mysql2: Cliente MySQL con prepared statements
- bcryptjs: Hashing de contraseñas
- jsonwebtoken: Autenticación JWT
- cors: Control de acceso CORS
- express-validator: Validación de datos
- dotenv: Gestión de configuración
```

### Anexo B: Variables de Entorno (.env)
```bash
# Base de datos
DB_HOST=localhost
DB_USER=usuario_db
DB_PASSWORD=contraseña_segura
DB_NAME=nombre_base_datos

# JWT
JWT_SECRET=clave_secreta_compleja_aleatoria
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=production
```

### Anexo C: Checklist de Seguridad Pre-Producción
- [ ] Contraseñas fuertes configuradas
- [ ] JWT_SECRET aleatorio y seguro
- [ ] Firewall configurado
- [ ] Puertos internos no expuestos a internet
- [ ] HTTPS configurado (certificado SSL)
- [ ] Respaldos de base de datos automatizados
- [ ] Plan de recuperación ante desastres
- [ ] Logs de auditoría activados
- [ ] Usuarios de prueba eliminados
- [ ] Documentación completa entregada

---

## 📝 CONCLUSIÓN

El sistema propuesto cumple con estándares de seguridad para aplicaciones web internas, implementando las mejores prácticas de la industria. Su arquitectura modular permite agregar capas adicionales de seguridad según las políticas de la organización.

**Recomendación:** Aprobar para fase de pruebas con revisión de seguridad antes de producción.

---

**Documento preparado para evaluación por:**
- Departamento de Seguridad de la Información
- Área de Infraestructura TI
- Gestión de Riesgos
