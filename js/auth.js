// ============================================
// HOGARCITY - AUTH.JS
// ============================================

// ===== CREDENCIALES =====
const CREDENTIALS = {
    EMPLEADO_PIN: '1234',
    ADMIN_PASSWORD: 'hogarcity01'
};

// ===== CLAVES DE STORAGE =====
const STORAGE_KEYS = {
    USER: 'hogarcity_user',
    TURNO: 'hogarcity_turno'
};

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

function isAuthenticated() {
    return localStorage.getItem(STORAGE_KEYS.USER) !== null;
}

function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
}

function loginEmpleado(nombre, jornada, pin) {
    if (pin !== CREDENTIALS.EMPLEADO_PIN) {
        return { success: false, error: 'PIN incorrecto' };
    }

    if (!nombre || nombre.trim() === '') {
        return { success: false, error: 'Ingresa tu nombre' };
    }

    if (!jornada) {
        return { success: false, error: 'Selecciona una jornada' };
    }

    const userData = {
        id: `emp_${Date.now()}`,
        nombre: nombre.trim(),
        rol: 'empleado',
        jornada: jornada,
        fechaIngreso: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

    const turno = {
        empleado: userData.id,
        empleadoNombre: userData.nombre,
        jornada: jornada,
        fechaInicio: new Date().toISOString(),
        horaInicio: new Date().toLocaleTimeString('es-CO', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        }),
        estado: 'abierto'
    };
    localStorage.setItem(STORAGE_KEYS.TURNO, JSON.stringify(turno));

    return { success: true, user: userData };
}

function loginAdmin(password) {
    if (password !== CREDENTIALS.ADMIN_PASSWORD) {
        return { success: false, error: 'Contraseña incorrecta' };
    }

    const userData = {
        id: 'admin',
        nombre: 'Administrador',
        rol: 'admin',
        fechaIngreso: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return { success: true, user: userData };
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TURNO);
    window.location.href = 'index.html';
}

function redirectToDashboard(user) {
    if (user.rol === 'admin') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'dashboard.html';
    }
}