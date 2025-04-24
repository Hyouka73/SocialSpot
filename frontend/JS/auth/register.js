import { API_USER_URL } from '../../config.js';


document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    
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
                const response = await fetch(`${API_USER_URL}auth/register`, {
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
                localStorage.setItem('currentUser', data.userId);
                window.location.href = '../app/preferences.html';
            } catch (error) {
                console.error('Error al registrarse:', error);
                alert(error.message || 'Error al registrarse');
            }
        });
    }
});