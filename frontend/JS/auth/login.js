import { API_USER_URL } from '../../config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Formulario interceptado"); // Verificación
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_USER_URL}auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) throw new Error(await response.text());
                
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', data.userId);
                window.location.href = '../app/main.html';
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Error al iniciar sesión');
            }
        });
    }
});