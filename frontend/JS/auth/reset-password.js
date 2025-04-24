import { API_USER_URL } from '../../config.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reset-password-form');
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    document.getElementById('reset-token').value = token;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch(`${API_USER_URL}auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al restablecer contraseña');
            }

            alert('Contraseña actualizada correctamente');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al procesar la solicitud');
        }
    });
});