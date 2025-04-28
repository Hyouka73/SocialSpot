import { API_USER_URL } from '../../config.js';

document.addEventListener('DOMContentLoaded', () => {
    const forgotForm = document.getElementById('forgot-password-form');
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;

            try {
                const response = await fetch(`${API_USER_URL}auth/forgot-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Error al solicitar recuperación');
                }

                alert('Se ha enviado un correo con instrucciones para restablecer tu contraseña');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Error al procesar la solicitud');
            }
        });
    }
});