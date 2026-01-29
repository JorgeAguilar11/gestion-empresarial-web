// ============================================
// CONFIGURACIÓN DE BASE DE DATOS
// ============================================

const mysql = require('mysql2');
require('dotenv').config();

// Crear pool de conexiones (más eficiente que conexiones individuales)
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gestion_empresarial',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Convertir a promesas para usar async/await
const promisePool = pool.promise();

// Probar conexión
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Conexión a base de datos exitosa');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
        return false;
    }
};

module.exports = {
    pool: promisePool,
    testConnection
};
