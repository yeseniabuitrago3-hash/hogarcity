// ============================================
// HOGARCITY - APP.JS (VERSIÓN CORREGIDA)
// ============================================

// ===== VARIABLES GLOBALES =====
let currentProfile = 'empleado';
let loginForm, btnEmpleado, btnAdmin, nombreGroup, jornadaGroup;
let nombreInput, jornadaSelect, pinInput, togglePinBtn;
let loginError, errorMessage, btnLoginText, pinLabel, pinHint;
let currentDateTime, pinDotsContainer;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 HogarCity v1.0 - Iniciando...');

    // Verificar sesión activa
    const user = getCurrentUser();
    if (user) {
        // Si hay sesión, preguntar si quiere continuar
        const continuar = confirm(
            `👋 ¡Hola ${user.nombre || 'Usuario'}!\n\n` +
            `Tienes una sesión activa desde: ${new Date(user.fechaIngreso).toLocaleString()}\n` +
            `Rol: ${user.rol === 'admin' ? 'Administrador' : 'Empleado'}\n\n` +
            `¿Quieres continuar con esta sesión?`
        );
        
        if (continuar) {
            // Redirigir según el rol
            if (user.rol === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
            return;
        } else {
            // Cerrar sesión
            logout();
            // Recargar para mostrar login limpio
            window.location.reload();
            return;
        }
    }

    // Si no hay sesión, iniciar el login
    initLogin();
});

// ============================================
// FUNCIÓN PRINCIPAL DEL LOGIN
// ============================================

function initLogin() {
    console.log('🔐 Inicializando login...');

    // ===== OBTENER ELEMENTOS DEL DOM =====
    loginForm = document.getElementById('loginForm');
    btnEmpleado = document.getElementById('btnEmpleado');
    btnAdmin = document.getElementById('btnAdmin');
    nombreGroup = document.getElementById('nombreGroup');
    jornadaGroup = document.getElementById('jornadaGroup');
    nombreInput = document.getElementById('nombreInput');
    jornadaSelect = document.getElementById('jornadaSelect');
    pinInput = document.getElementById('pinInput');
    togglePinBtn = document.getElementById('togglePin');
    loginError = document.getElementById('loginError');
    errorMessage = document.getElementById('errorMessage');
    btnLoginText = document.getElementById('btnLoginText');
    pinLabel = document.getElementById('pinLabel');
    pinHint = document.getElementById('pinHint');
    currentDateTime = document.getElementById('currentDateTime');
    pinDotsContainer = document.getElementById('pinDots');

    // ===== VERIFICAR QUE EXISTAN LOS ELEMENTOS =====
    if (!loginForm) {
        console.error('❌ No se encontró el formulario de login');
        return;
    }

    // ===== FUNCIONES INTERNAS =====

    function updateDateTime() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        if (currentDateTime) {
            currentDateTime.textContent = now.toLocaleDateString('es-CO', options);
        }
    }

    function updatePinDots(value) {
        const dots = document.querySelectorAll('.pin-dots .dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('filled', index < value.length);
            dot.classList.remove('error');
        });
    }

    function setProfile(profile) {
        currentProfile = profile;
        
        if (btnEmpleado) btnEmpleado.classList.toggle('active', profile === 'empleado');
        if (btnAdmin) btnAdmin.classList.toggle('active', profile === 'admin');

        if (profile === 'empleado') {
            // Mostrar campos de empleado
            if (nombreGroup) nombreGroup.classList.remove('hidden');
            if (jornadaGroup) jornadaGroup.classList.remove('hidden');
            if (pinDotsContainer) pinDotsContainer.style.display = 'flex';
            
            // Cambiar etiquetas
            if (pinLabel) pinLabel.textContent = 'PIN DE ACCESO';
            if (pinHint) pinHint.textContent = '4 DÍGITOS';
            if (pinInput) {
                pinInput.maxLength = 4;
                pinInput.placeholder = '• • • •';
                pinInput.type = 'password';
                pinInput.value = '';
            }
            if (btnLoginText) btnLoginText.textContent = 'Registrar Turno →';
            if (togglePinBtn) togglePinBtn.innerHTML = '<i class="fas fa-eye"></i>';
            
            // Resetear errores
            if (pinInput) pinInput.classList.remove('error', 'success');
            updatePinDots('');
            
        } else {
            // Admin - ocultar campos de empleado
            if (nombreGroup) nombreGroup.classList.add('hidden');
            if (jornadaGroup) jornadaGroup.classList.add('hidden');
            if (pinDotsContainer) pinDotsContainer.style.display = 'none';
            
            // Cambiar etiquetas
            if (pinLabel) pinLabel.textContent = 'CONTRASEÑA ADMIN';
            if (pinHint) pinHint.textContent = '';
            if (pinInput) {
                pinInput.maxLength = 20;
                pinInput.placeholder = '••••••••••••';
                pinInput.type = 'password';
                pinInput.value = '';
            }
            if (btnLoginText) btnLoginText.textContent = 'Acceder como Admin';
            if (togglePinBtn) togglePinBtn.innerHTML = '<i class="fas fa-eye"></i>';
            
            // Resetear errores
            if (pinInput) pinInput.classList.remove('error', 'success');
        }

        // Ocultar error
        if (loginError) loginError.style.display = 'none';
    }

    function showError(message) {
        if (errorMessage) errorMessage.textContent = message;
        if (loginError) loginError.style.display = 'flex';
        if (pinInput) pinInput.classList.add('error');
        
        const dots = document.querySelectorAll('.pin-dots .dot');
        dots.forEach(d => d.classList.add('error'));
        
        setTimeout(() => {
            if (loginError) loginError.style.display = 'none';
            if (pinInput) pinInput.classList.remove('error');
            dots.forEach(d => d.classList.remove('error'));
        }, 4000);
    }

    // ===== FUNCIÓN PRINCIPAL: handleLogin =====
    function handleLogin(e) {
        e.preventDefault();
        console.log('📝 Intentando login...');

        const pin = pinInput ? pinInput.value.trim() : '';

        if (currentProfile === 'empleado') {
            // ===== LOGIN EMPLEADO =====
            const nombre = nombreInput ? nombreInput.value.trim() : '';
            const jornada = jornadaSelect ? jornadaSelect.value : '';

            if (!nombre) {
                showError('Ingresa tu nombre');
                if (nombreInput) nombreInput.focus();
                return;
            }
            if (!jornada) {
                showError('Selecciona una jornada');
                if (jornadaSelect) jornadaSelect.focus();
                return;
            }
            if (pin.length !== 4) {
                showError('El PIN debe tener 4 dígitos');
                if (pinInput) {
                    pinInput.value = '';
                    updatePinDots('');
                    pinInput.focus();
                }
                return;
            }

            // Validar credenciales
            const result = loginEmpleado(nombre, jornada, pin);
            console.log('Resultado login empleado:', result);

            if (!result.success) {
                showError(result.error);
                if (pinInput) {
                    pinInput.value = '';
                    updatePinDots('');
                    pinInput.focus();
                }
                return;
            }

            // ✅ REDIRIGIR AL DASHBOARD
            console.log('✅ Redirigiendo a dashboard.html');
            window.location.href = 'dashboard.html';

        } else {
            // ===== LOGIN ADMIN =====
            if (!pin) {
                showError('Ingresa la contraseña');
                if (pinInput) pinInput.focus();
                return;
            }

            const result = loginAdmin(pin);
            console.log('Resultado login admin:', result);

            if (!result.success) {
                showError(result.error);
                if (pinInput) {
                    pinInput.value = '';
                    pinInput.focus();
                }
                return;
            }

            // ✅ REDIRIGIR A ADMIN
            console.log('✅ Redirigiendo a admin.html');
            window.location.href = 'admin.html';
        }
    }

    // ===== ASIGNAR EVENT LISTENERS =====

    // Selector de perfil
    if (btnEmpleado) {
        btnEmpleado.addEventListener('click', function() {
            console.log('🔄 Cambiando a perfil Empleado');
            setProfile('empleado');
        });
    }
    
    if (btnAdmin) {
        btnAdmin.addEventListener('click', function() {
            console.log('🔄 Cambiando a perfil Administrador');
            setProfile('admin');
        });
    }

    // Input del PIN
    if (pinInput) {
        pinInput.addEventListener('input', function() {
            if (currentProfile === 'empleado') {
                this.value = this.value.replace(/\D/g, '');
                if (this.value.length > 4) {
                    this.value = this.value.slice(0, 4);
                }
                updatePinDots(this.value);
            }
            
            if (loginError) loginError.style.display = 'none';
            this.classList.remove('error', 'success');
        });
    }

    // Toggle mostrar/ocultar PIN
    if (togglePinBtn) {
        togglePinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (!pinInput) return;
            const type = pinInput.getAttribute('type') === 'password' ? 'text' : 'password';
            pinInput.setAttribute('type', type);
            
            if (type === 'password') {
                this.innerHTML = '<i class="fas fa-eye"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            }
        });
    }

    // Submit del formulario
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Event listener de submit asignado');
    }

    // Enter para navegar entre campos
    if (nombreInput) {
        nombreInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (currentProfile === 'empleado') {
                    if (!this.value.trim()) {
                        this.focus();
                    } else if (jornadaSelect && !jornadaSelect.value) {
                        jornadaSelect.focus();
                    } else if (pinInput) {
                        pinInput.focus();
                    }
                }
            }
        });
    }

    if (jornadaSelect) {
        jornadaSelect.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (currentProfile === 'empleado') {
                    if (!this.value) {
                        this.focus();
                    } else if (pinInput) {
                        pinInput.focus();
                    }
                }
            }
        });
    }

    if (pinInput) {
        pinInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (loginForm) {
                    loginForm.dispatchEvent(new Event('submit'));
                }
            }
        });
    }

    // ===== INICIALIZAR =====
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setProfile('empleado');
    
    console.log('✅ Login inicializado correctamente');
}