// Script para actualizar las contraseñas de los usuarios
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function updatePasswords() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'gestion_empresarial'
    });

    console.log('✅ Conectado a la base de datos');

    // Usuarios con sus contraseñas
    const usuarios = [
        { username: 'admin', password: 'password123' },
        { username: 'juan.perez', password: 'password123' },
        { username: 'maria.garcia', password: 'password123' },
        { username: 'carlos.lopez', password: 'password123' }
    ];

    for (const usuario of usuarios) {
        const hash = await bcrypt.hash(usuario.password, 10);
        await connection.execute(
            'UPDATE usuarios SET password_hash = ? WHERE username = ?',
            [hash, usuario.username]
        );
        console.log(`✅ Contraseña actualizada para: ${usuario.username}`);
    }

    console.log('\n🎉 Todas las contraseñas han sido actualizadas');
    console.log('📝 Credenciales de prueba:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: password123');
    
    await connection.end();
}

updatePasswords().catch(console.error);
