import { API_USER_URL } from '../config.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const backBtn = document.getElementById('back-btn');
    const frontBtn = document.getElementById('front-btn');

    function showRegister() {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'flex';
        history.pushState({}, '', '/frontend/auth/register.html');
    }

    function showLogin() {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
        history.pushState({}, '', '/frontend/auth/login.html');
    }

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

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_USER_URL}login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Error al iniciar sesión');
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', data.userId);
                window.location.href = '../app/main.html';
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                alert(error.message || 'Error al iniciar sesión');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const lastname = document.getElementById('register-lastname').value;
            const phone = document.getElementById('register-phone').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const sex = document.getElementById('register-sexo').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            try {
                const response = await fetch(`${API_USER_URL}register`, {
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
                        sex
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Error al registrarse');
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', data.userId); // Asegurarnos de usar data.userId
                window.location.href = '../app/preferences.html';
            } catch (error) {
                console.error('Error al registrarse:', error);
                alert(error.message || 'Error al registrarse');
            }
        });
    }

    window.addEventListener('load', function() {
        if (window.location.pathname.endsWith('register.html')) {
            showRegister();
        } else {
            showLogin();
        }
    });

    window.addEventListener('popstate', function() {
        if (window.location.pathname.endsWith('register.html')) {
            showRegister();
        } else {
            showLogin();
        }
    });
});