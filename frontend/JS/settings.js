

document.addEventListener('DOMContentLoaded', function() {
    // Función para aplicar el modo oscuro
    function applyDarkMode(enabled) {
        const htmlElement = document.documentElement;
        
        if (enabled) {
            htmlElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            localStorage.setItem('darkModeTimestamp', Date.now());
        } else {
            htmlElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            localStorage.setItem('darkModeTimestamp', Date.now());
        }
        
        // Disparar evento personalizado para otras pestañas
        const darkModeEvent = new CustomEvent('darkModeChanged', {
            detail: { enabled: enabled }
        });
        window.dispatchEvent(darkModeEvent);
    }

    // Elementos del DOM
    const darkModeSwitch = document.getElementById('dark-mode');
    const logoutBtn = document.getElementById('logout');
    const deactivateBtn = document.getElementById('deactivate-account');
    const deleteBtn = document.getElementById('delete-account');
    const changePassBtn = document.getElementById('change-password');
    const changeEmailBtn = document.getElementById('change-email');

    document.querySelector('.dark-mode-switch').addEventListener('change', function() {
        if(this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Comprobar al cargar la página
    if(localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.querySelector('.dark-mode-switch').checked = true;
    }

    // Escuchar eventos de otras pestañas
    window.addEventListener('darkModeChanged', function(e) {
        document.documentElement.classList.toggle('dark-mode', e.detail.enabled);
        if (darkModeSwitch) darkModeSwitch.checked = e.detail.enabled;
    });

    // Verificar cambios cada segundo (como respaldo)
    setInterval(() => {
        const currentState = localStorage.getItem('darkMode') === 'enabled';
        if (darkModeSwitch && currentState !== darkModeSwitch.checked) {
            applyDarkMode(currentState);
            darkModeSwitch.checked = currentState;
        }
    }, 1000);

    // Cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                localStorage.removeItem('token');
                window.location.href = '../auth/login.html';
            }
        });
    }

    // Desactivar cuenta
    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas desactivar tu cuenta? Podrás reactivarla más tarde.')) {
                // Lógica para desactivar cuenta
                alert('Tu cuenta ha sido desactivada. Serás redirigido al inicio.');
                localStorage.removeItem('token');
                window.location.href = '../auth/login.html';
            }
        });
    }

    // Eliminar cuenta
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Esta acción no se puede deshacer.')) {
                // Lógica para eliminar cuenta
                alert('Tu cuenta ha sido eliminada. Gracias por usar SocialSpot.');
                localStorage.removeItem('token');
                window.location.href = '../auth/login.html';
            }
        });
    }

    // Cambiar contraseña
    if (changePassBtn) {
        changePassBtn.addEventListener('click', function() {
            window.location.href = 'change-password.html';
        });
    }

    // Cambiar email
    if (changeEmailBtn) {
        changeEmailBtn.addEventListener('click', function() {
            window.location.href = 'change-email.html';
        });
    }
});

