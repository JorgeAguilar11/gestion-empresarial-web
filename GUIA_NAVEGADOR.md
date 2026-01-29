# 🌐 Guía Práctica: Cómo Usar el Sistema en tu Navegador

## 📋 Prerrequisitos

Antes de comenzar, necesitas tener instalado:

### 1. **Node.js** (para el backend)
```bash
# Verificar si ya lo tienes
node --version  # Debe mostrar v16 o superior
npm --version   # Debe mostrar v8 o superior
```

Si no lo tienes: Descarga desde https://nodejs.org/ (versión LTS)

### 2. **MySQL** (para la base de datos)
```bash
# Verificar si ya lo tienes
mysql --version  # Debe mostrar MySQL 5.7 o superior
```

Si no lo tienes en macOS:
```bash
# Opción 1: Con Homebrew
brew install mysql
brew services start mysql

# Opción 2: Descargar desde https://dev.mysql.com/downloads/mysql/
```

### 3. **Navegador Web Moderno**
- Chrome, Firefox, Safari o Edge (cualquiera actualizado)

---

## 🚀 PASO A PASO: Instalación Completa

### **PASO 1: Configurar la Base de Datos** 📊

#### 1.1 Iniciar MySQL
```bash
# En macOS con Homebrew
brew services start mysql

# O iniciar manualmente
mysql.server start
```

#### 1.2 Acceder a MySQL
```bash
# Conectarse (te pedirá contraseña si la configuraste)
mysql -u root -p

# Si es primera vez y no tiene contraseña
mysql -u root
```

#### 1.3 Crear la Base de Datos
Una vez dentro de MySQL, ejecuta:
```sql
-- Crear base de datos
CREATE DATABASE gestion_empresarial;

-- Verificar que se creó
SHOW DATABASES;

-- Salir
exit;
```

#### 1.4 Cargar las Tablas
Desde tu terminal (fuera de MySQL):
```bash
# Ir a tu proyecto
cd /Users/jorgeaguilar/Proyecto_Captura_HMTL

# Cargar esquema (estructura de tablas)
mysql -u root -p gestion_empresarial < database/schema.sql

# Cargar datos de prueba
mysql -u root -p gestion_empresarial < database/seeds.sql
```

#### 1.5 Verificar que funcionó
```bash
mysql -u root -p gestion_empresarial -e "SELECT * FROM usuarios;"
```

Deberías ver 4 usuarios (admin, juan.perez, maria.garcia, carlos.lopez)

---

### **PASO 2: Configurar el Backend** ⚙️

#### 2.1 Instalar Dependencias
```bash
# Ir a carpeta backend
cd /Users/jorgeaguilar/Proyecto_Captura_HMTL/backend

# Instalar paquetes de Node.js (tomará 1-2 minutos)
npm install
```

Verás que se crea una carpeta `node_modules` con todas las dependencias.

#### 2.2 Crear Archivo de Configuración
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar con tu editor favorito
nano .env
# O
code .env  # Si usas VS Code
```

**Contenido del archivo .env:**
```env
PORT=3000
NODE_ENV=development

# IMPORTANTE: Pon tu contraseña de MySQL aquí
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA_MYSQL_AQUI
DB_NAME=gestion_empresarial

# Puedes dejar esto como está
JWT_SECRET=mi_secreto_super_seguro_cambiar_en_produccion_12345
JWT_EXPIRES_IN=24h

ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

**⚠️ IMPORTANTE:** Reemplaza `TU_CONTRASEÑA_MYSQL_AQUI` con tu contraseña real de MySQL.

#### 2.3 Probar el Backend
```bash
# Asegúrate de estar en la carpeta backend
cd /Users/jorgeaguilar/Proyecto_Captura_HMTL/backend

# Iniciar el servidor
npm start
```

**Deberías ver:**
```
════════════════════════════════════════════
🚀 Servidor corriendo en http://localhost:3000
📝 Entorno: development
════════════════════════════════════════════
✅ Conexión a base de datos exitosa
```

Si ves esto, ¡el backend está funcionando! ✅

**Probar en tu navegador:**
1. Abre tu navegador
2. Ve a: http://localhost:3000
3. Deberías ver: `{"message":"API de Sistema de Gestión Empresarial"...}`

**NO CIERRES ESTA TERMINAL** - Déjala corriendo.

---

### **PASO 3: Iniciar el Frontend** 🎨

#### 3.1 Abrir NUEVA Terminal
Necesitas una segunda terminal (deja la primera corriendo con el backend).

```bash
# Ir a la raíz del proyecto
cd /Users/jorgeaguilar/Proyecto_Captura_HMTL

# Instalar 'serve' globalmente (solo una vez)
npm install -g serve

# Iniciar servidor web para el frontend
serve frontend -p 8080
```

**Deberías ver:**
```
   ┌───────────────────────────────────┐
   │                                   │
   │   Serving!                        │
   │                                   │
   │   Local:  http://localhost:8080   │
   │                                   │
   └───────────────────────────────────┘
```

**Alternativa sin instalar nada:**
```bash
# En la carpeta del proyecto
cd /Users/jorgeaguilar/Proyecto_Captura_HMTL/frontend

# Python 3 (viene con macOS)
python3 -m http.server 8080
```

---

## 🎯 PASO 4: Usar el Sistema en tu Navegador

### 4.1 Abrir la Aplicación

**Abre tu navegador y ve a:**
```
http://localhost:8080/login.html
```

### 4.2 Iniciar Sesión

Usa uno de estos usuarios de prueba:

| Usuario       | Contraseña    |
|---------------|---------------|
| admin         | password123   |
| juan.perez    | password123   |
| maria.garcia  | password123   |
| carlos.lopez  | password123   |

### 4.3 Explorar el Sistema

Una vez que inicies sesión:

1. **Dashboard** - Verás:
   - Tus estadísticas (total de acciones, pendientes, completadas)
   - Últimas acciones registradas
   - Botones de acceso rápido

2. **Nueva Acción** - Click en "📝 Nueva Acción":
   - Selecciona una tipificación
   - Escribe una descripción
   - Agrega información adicional
   - Guarda

3. **Ver Mis Acciones** - Click en "📋 Ver Mis Acciones":
   - Lista todas tus acciones
   - Filtra por estado

---

## 🖥️ Resumen de URLs

Una vez todo esté corriendo:

| Servicio  | URL                           | ¿Qué hace?            |
|-----------|-------------------------------|-----------------------|
| Backend   | http://localhost:3000         | API REST (datos)      |
| Frontend  | http://localhost:8080         | Interfaz web          |
| Login     | http://localhost:8080/login.html | Página de acceso |
| Dashboard | http://localhost:8080/dashboard.html | Panel principal |

---

## 🔧 Comandos Rápidos

### Para INICIAR el sistema cada vez:

**Terminal 1 (Backend):**
```bash
cd /Users/jorgeaguilar/Proyecto_Captura_HMTL/backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd /Users/jorgeaguilar/Proyecto_Captura_HMTL
serve frontend -p 8080
```

**Luego abrir:** http://localhost:8080/login.html

### Para DETENER el sistema:
- Presiona `Ctrl + C` en cada terminal

---

## ❓ Solución de Problemas

### ❌ Error: "Cannot connect to database"

**Solución:**
```bash
# 1. Verificar que MySQL esté corriendo
brew services list | grep mysql
# O
ps aux | grep mysql

# 2. Iniciar MySQL si está detenido
brew services start mysql

# 3. Verificar conexión
mysql -u root -p -e "SELECT 1;"

# 4. Verificar que el archivo .env tenga la contraseña correcta
cat backend/.env | grep DB_PASSWORD
```

### ❌ Error: "Port 3000 already in use"

**Solución:**
```bash
# Ver qué está usando el puerto
lsof -i :3000

# Matar el proceso
kill -9 <PID>

# O cambiar el puerto en backend/.env
PORT=3001
```

### ❌ Error: "npm: command not found"

**Solución:**
```bash
# Instalar Node.js
brew install node

# O descargar desde: https://nodejs.org/
```

### ❌ Error: "CORS policy" en el navegador

**Solución:**
Verifica que ambos servidores estén corriendo (backend en 3000, frontend en 8080).

### ❌ No se cargan las tipificaciones

**Solución:**
```bash
# Recargar datos
mysql -u root -p gestion_empresarial < database/seeds.sql
```

### ❌ Token expirado / No autorizado

**Solución:**
Simplemente cierra sesión y vuelve a iniciar sesión.

---

## 📱 Acceso desde Otros Dispositivos

Si quieres acceder desde otro dispositivo en tu red local:

```bash
# 1. Obtener tu IP local
ifconfig | grep "inet " | grep -v 127.0.0.1

# Ejemplo: 192.168.1.100

# 2. Agregar tu IP al backend/.env
ALLOWED_ORIGINS=http://localhost:8080,http://192.168.1.100:8080

# 3. Desde otro dispositivo, abrir:
http://192.168.1.100:8080/login.html
```

---

## 🎓 Siguientes Pasos

Una vez que tengas todo funcionando:

1. **Explora los datos:**
   ```bash
   mysql -u root -p gestion_empresarial
   ```
   ```sql
   SELECT * FROM reporte_acciones_usuario;
   SELECT * FROM estadisticas_generales;
   ```

2. **Modifica tipificaciones:**
   - Edita `database/seeds.sql`
   - Recarga: `mysql -u root -p gestion_empresarial < database/seeds.sql`

3. **Personaliza el frontend:**
   - Edita `frontend/css/styles.css` para cambiar colores
   - Modifica `frontend/js/config.js` para cambiar configuración

4. **Agrega nuevos usuarios:**
   - Ve a http://localhost:3000 (API)
   - Usa el endpoint POST /api/auth/register

---

## 📞 Verificación Final

Ejecuta este checklist:

```bash
# ✅ MySQL corriendo
mysql -u root -p -e "SELECT COUNT(*) FROM gestion_empresarial.usuarios;"

# ✅ Backend corriendo
curl http://localhost:3000

# ✅ Frontend corriendo
curl http://localhost:8080

# ✅ Login funcional
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

Si todos responden correctamente, ¡estás listo! 🎉

---

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona:

1. **Revisa los logs** en la terminal donde corre el backend
2. **Abre la consola del navegador** (F12 o Cmd+Option+I)
3. **Verifica los archivos .env**
4. **Asegúrate de que ambos servidores estén corriendo**

---

**¡Listo para usar tu sistema de gestión empresarial!** 🚀
