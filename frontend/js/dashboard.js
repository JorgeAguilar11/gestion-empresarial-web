// ============================================
// LÓGICA DE DASHBOARD
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await cargarEstadisticas();
    await cargarUltimasAcciones();
});

/**
 * Cargar estadísticas del usuario
 */
async function cargarEstadisticas() {
    try {
        const data = await UserAPI.getStats();
        
        const stats = data.estadisticas;
        
        document.getElementById('totalAcciones').textContent = stats.total_acciones || 0;
        document.getElementById('accionesPendientes').textContent = stats.pendientes || 0;
        document.getElementById('accionesEnProceso').textContent = stats.en_proceso || 0;
        document.getElementById('accionesCompletadas').textContent = stats.completadas || 0;
        
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

/**
 * Cargar últimas acciones del usuario
 */
async function cargarUltimasAcciones() {
    const container = document.getElementById('ultimasAcciones');
    
    try {
        const data = await UserAPI.getStats();
        const acciones = data.ultimasAcciones;
        
        if (acciones.length === 0) {
            container.innerHTML = '<p class="loading">No hay acciones registradas</p>';
            return;
        }
        
        container.innerHTML = acciones.map(accion => `
            <div class="accion-item">
                <div class="accion-header">
                    <span class="accion-tipificacion">${accion.tipificacion}</span>
                    <span class="accion-estado estado-${accion.estado}">
                        ${formatEstado(accion.estado)}
                    </span>
                </div>
                <p class="accion-descripcion">${accion.descripcion || 'Sin descripción'}</p>
                <p class="accion-fecha">📅 ${formatFecha(accion.fecha_creacion)}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error al cargar últimas acciones:', error);
        container.innerHTML = '<p class="loading">Error al cargar las acciones</p>';
    }
}

/**
 * Cargar todas las acciones
 */
async function cargarAcciones() {
    try {
        const acciones = await AccionesAPI.getAll({ limit: 100 });
        
        // Aquí puedes mostrar un modal o redirigir a otra página
        console.log('Acciones:', acciones);
        alert(`Tienes ${acciones.length} acciones registradas. Ver consola para más detalles.`);
        
    } catch (error) {
        console.error('Error al cargar acciones:', error);
        alert('Error al cargar las acciones');
    }
}

/**
 * Formatear estado
 */
function formatEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En Proceso',
        'completado': 'Completado'
    };
    return estados[estado] || estado;
}

/**
 * Formatear fecha
 */
function formatFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const opciones = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Exportar funciones
window.cargarAcciones = cargarAcciones;
