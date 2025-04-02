// Importa la URL base desde config.js (asegúrate de crear este archivo)
import { API_USER_URL } from '../config.js'; // Asegúrate de que el archivo config.js exista y tenga la exportación correcta

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements (mantengo esta parte igual)
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const backBtn = document.getElementById('back-btn');
    const frontBtn = document.getElementById('front-btn');

    // Show register form y show login form (mantengo estas funciones igual)
    function showRegister() {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'flex';
        history.pushState({}, '', '/frontend/auth/register.html'); // Ajusta la ruta
    }

    function showLogin() {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
        history.pushState({}, '', '/frontend/auth/login.html'); // Ajusta la ruta
    }

    // Event listeners para switching forms (mantengo igual)
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showRegister();
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLogin();
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLogin();
        });
    }

    if (frontBtn) {
        frontBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showRegister();
        });
    }

    // Handle login submission con API
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_USER_URL}login`, { // Asegúrate de que la URL sea correcta
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    const errorText = await response.text(); // Lee el texto de la respuesta
                    throw new Error(errorText || 'Error al iniciar sesión');
                }

                const data = await response.json(); // Intenta parsear la respuesta como JSON

                // Guardar el token y userId en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', data.userId);
                window.location.href = '../app/main.html';

            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                alert(error.message || 'Error al iniciar sesión');
            }
        });
    }

    // Handle register submission con API
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const lastname = document.getElementById('register-lastname').value;
            const phone = document.getElementById('register-phone').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const sex = document.getElementById('register-sexo').value; // Nuevo campo

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            try {
                const response = await fetch(`${API_USER_URL}register`, { // Asegúrate de que la URL sea correcta
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: name,
                        lastName: lastname,
                        phone,
                        email,
                        password,
                        sex // Incluye el nuevo campo
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text(); // Lee el texto de la respuesta
                    throw new Error(errorText || 'Error al registrarse');
                }

                const data = await response.json(); // Intenta parsear la respuesta como JSON

                // Guardar el token en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', data.userId || data.token);
                window.location.href = '../app/preferences.html';

            } catch (error) {
                console.error('Error al registrarse:', error);
                alert(error.message || 'Error al registrarse');
            }
        });
    }

    // Mantengo el resto del código igual
    window.addEventListener('load', function() {
        if (window.location.pathname.endsWith('register.html')) { // Ajusta la ruta
            showRegister();
        } else {
            showLogin();
        }
    });

    window.addEventListener('popstate', function() {
        if (window.location.pathname.endsWith('register.html')) { // Ajusta la ruta
            showRegister();
        } else {
            showLogin();
        }
    });
});