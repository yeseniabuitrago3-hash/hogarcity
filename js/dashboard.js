// ============================================
// HOGARCITY - DASHBOARD.JS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 HogarCity - Dashboard');

    // ===== VERIFICAR SESIÓN =====
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // ===== CARGAR DATOS DEL USUARIO =====
    loadUserData(user);
    
    // ===== INICIAR TEMPORIZADOR =====
    startTimer();

    // ===== EVENTOS =====
    setupEventListeners();
});

// ============================================
// FUNCIONES
// ============================================

function loadUserData(user) {
    // Actualizar nombre en el header
    const userName = document.getElementById('userName');
    const userGreeting = document.getElementById('userGreeting');
    const avatarLetter = document.getElementById('avatarLetter');
    
    if (userName) userName.textContent = user.nombre || 'Empleado';
    if (userGreeting) userGreeting.textContent = (user.nombre || 'Empleado').split(' ')[0];
    
    // Iniciales para el avatar
    if (avatarLetter) {
        const nombre = user.nombre || 'Empleado';
        const iniciales = nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        avatarLetter.textContent = iniciales || 'EM';
    }

    // Cargar datos del turno
    const turno = JSON.parse(localStorage.getItem('hogarcity_turno'));
    if (turno) {
        const shiftDetail = document.getElementById('shiftDetail');
        if (shiftDetail) {
            const jornadaMap = { 'mañana': 'Mañana', 'tarde': 'Tarde' };
            const jornadaLabel = jornadaMap[turno.jornada] || turno.jornada;
            shiftDetail.textContent = `Jornada: ${jornadaLabel} • Ingreso: ${turno.horaInicio || '08:30 AM'}`;
        }
    }
}

function startTimer() {
    const turno = JSON.parse(localStorage.getItem('hogarcity_turno'));
    if (!turno) return;

    const startTime = new Date(turno.fechaInicio);
    const timerElement = document.getElementById('shiftTimer');
    if (!timerElement) return;

    setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000);
        
        if (diff < 0) {
            timerElement.textContent = '00:00:00';
            return;
        }
        
        const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const seconds = String(diff % 60).padStart(2, '0');
        
        timerElement.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

function setupEventListeners() {
    // ===== HAMBURGER (Mobile) =====
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (hamburgerBtn && sidebar) {
        hamburgerBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });

        // Cerrar sidebar al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    // ===== CERRAR SESIÓN =====
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Seguro que quieres cerrar sesión?')) {
                logout();
            }
        });
    }
}