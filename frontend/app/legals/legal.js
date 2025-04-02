document.addEventListener('DOMContentLoaded', function() {
    // Función para aplicar el modo oscuro
    function applyDarkMode(enabled) {
        const htmlElement = document.documentElement;
        htmlElement.classList.toggle('dark-mode', enabled);
    }

    // Cargar preferencia de modo oscuro
    const darkModeState = localStorage.getItem('darkMode') === 'enabled';
    applyDarkMode(darkModeState);

    // Escuchar eventos de otras pestañas
    window.addEventListener('darkModeChanged', function(e) {
        applyDarkMode(e.detail.enabled);
    });

    // Verificar cambios cada segundo (como respaldo)
    setInterval(() => {
        const currentState = localStorage.getItem('darkMode') === 'enabled';
        if (currentState !== document.documentElement.classList.contains('dark-mode')) {
            applyDarkMode(currentState);
        }
    }, 1000);
    // legals.js
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar modo oscuro si está activado
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});
});


