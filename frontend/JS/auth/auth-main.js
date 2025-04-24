import { setupLogin } from './login.js';
import { setupRegister } from './register.js';
import { setupForgotPassword } from './forgot-password.js';

// Detecta qué página está activa y carga el módulo correspondiente
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('register.html')) {
        setupRegister();
    } 
    else if (path.includes('forgot-password.html')) {
        setupForgotPassword();
    }
    else {
        setupLogin(); // Página por defecto (login)
    }
});