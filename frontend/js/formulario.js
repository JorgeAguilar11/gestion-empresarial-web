// ============================================
// LÓGICA DE FORMULARIO
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await cargarTipificaciones();
    
    const form = document.getElementById('accionForm');
    form.addEventListener('submit', handleSubmit);
});

/**
 * Cargar tipificaciones en el select
 */
async function cargarTipificaciones() {
    const select = document.getElementById('tipificacion');
    
    try {
        const tipificaciones = await TipificacionesAPI.getAll();
        
        // Limpiar opciones existentes (excepto la primera)
        select.innerHTML = '<option value="">Seleccione una tipificación</option>';
        
        // Agrupar por categoría
        const porCategoria = tipificaciones.reduce((acc, tip) => {
            if (!acc[tip.categoria]) {
                acc[tip.categoria] = [];
            }
            acc[tip.categoria].push(tip);
            return acc;
        }, {});
        
        // Agregar opciones agrupadas
        Object.keys(porCategoria).forEach(categoria => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = categoria;
            
            porCategoria[categoria].forEach(tip => {
                const option = document.createElement('option');
                option.value = tip.id;
                option.textContent = `${tip.codigo} - ${tip.descripcion}`;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        });
        
    } catch (error) {
        console.error('Error al cargar tipificaciones:', error);
        showError('Error al cargar las tipificaciones');
    }
}

/**
 * Manejar envío del formulario
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    const submitButton = document.getElementById('submitButton');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Obtener datos del formulario
    const formData = new FormData(e.target);
    
    const accionData = {
        tipificacion_id: parseInt(formData.get('tipificacion_id')),
        descripcion: formData.get('descripcion'),
        estado: formData.get('estado'),
        datos_json: {
            prioridad: formData.get('prioridad') || null,
            area: formData.get('area') || null,
            comentarios: formData.get('comentarios') || null
        }
    };
    
    // Validación
    if (!accionData.tipificacion_id) {
        showError('Por favor seleccione una tipificación');
        return;
    }
    
    if (!accionData.descripcion || accionData.descripcion.trim() === '') {
        showError('Por favor ingrese una descripción');
        return;
    }
    
    // Deshabilitar botón
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';
    hideMessages();
    
    try {
        const response = await AccionesAPI.create(accionData);
        
        showSuccess('✅ Acción registrada exitosamente');
        
        // Limpiar formulario
        e.target.reset();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error al guardar acción:', error);
        showError(error.message || 'Error al guardar la acción');
        
        // Rehabilitar botón
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar Acción';
    }
}

/**
 * Mostrar mensaje de error
 */
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Scroll al mensaje
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Mostrar mensaje de éxito
 */
function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    
    // Scroll al mensaje
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Ocultar mensajes
 */
function hideMessages() {
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
}
