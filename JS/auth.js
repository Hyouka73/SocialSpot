document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const backBtn = document.getElementById('back-btn');
    const frontBtn = document.getElementById('front-btn');

    // Show register form
    function showRegister() {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'flex';
        history.pushState({}, '', '/register');
    }

    // Show login form
    function showLogin() {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
        history.pushState({}, '', '/login');
    }

    // Event listeners for switching forms
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
    // Handle login submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const usersModule = await import('../data/users.js');
                const users = usersModule.default;
                
                // Find user by email and password
                const userId = Object.keys(users).find(id => 
                    users[id].email === email && users[id].password === password
                );

                if (userId) {
                    // Store just the user ID as currentUser
                    localStorage.setItem('currentUser', userId);
                    window.location.href = '../main.html';
                } else {
                    alert('Credenciales incorrectas');
                }
            } catch (error) {
                console.error('Error al cargar los datos de usuarios:', error);
                alert('Error al iniciar sesión');
            }
        });
    }

    // Handle register submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const lastname = document.getElementById('register-lastname').value;
            const phone = document.getElementById('register-phone').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            const user = {
                id: `user${Date.now()}`,
                name,
                lastname,
                phone,
                email,
                password,
                created: new Date().toISOString(),
                preferences: null,
                avatar: 'default-avatar.jpg',
                reviewCount: 0
            };

            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (users.some(u => u.email === email)) {
                alert('El correo ya está registrado');
                return;
            }

            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            window.location.href = '../app/preferences.html';
        });
    }

    // Change between forms based on URL on page load
    window.addEventListener('load', function() {
        if (window.location.pathname === '/register') {
            showRegister();
        } else {
            showLogin();
        }
    });

    // Handle browser back button
    window.addEventListener('popstate', function() {
        if (window.location.pathname === '/register') {
            showRegister();
        } else {
            showLogin();
        }
    });
});