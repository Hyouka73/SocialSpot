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
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Get users from local storage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Store logged in user
                localStorage.setItem('currentUser', JSON.stringify(user));
                // Redirect to main page
                window.location.href = '../main.html';
            } else {
                alert('Credenciales incorrectas');
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

            // Validate password match
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            // Create user object
            const user = {
                name,
                lastname,
                phone,
                email,
                password,
                created: new Date().toISOString()
            };

            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                alert('El correo ya está registrado');
                return;
            }

            // Add new user
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Registro exitoso');
            showLogin();
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