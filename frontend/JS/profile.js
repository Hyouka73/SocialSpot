// JS/profile.js

// Simular ID del usuario (idealmente viene del login o auth token)
const userId = '67f45df94b6ccd2dbdc96a1f'; // Reemplazalo por uno real o usa localStorage.getItem('userId')

async function cargarPerfil() {
  try {
    const response = await fetch(`http://localhost:3001/api/users/${userId}`);
    if (!response.ok) throw new Error('Error al obtener usuario');

    const user = await response.json();

    // Asignar datos al DOM
    document.getElementById('username').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('profile-img').src = user.avatar || '../assets/perfiles/carlos.jpg';
    document.getElementById('description').textContent = user.description || 'Sin descripción';
    document.getElementById('user-level').textContent = `🌟 Nivel ${user.level || 30}`;

    // Si tenés medallas, lugares, amigos, podés seguir así:
    // cargarMedallas(user.medals);
    // cargarLugares(user.places);
    // cargarAmigos(user.friends);

  } catch (error) {
    console.error('Error al cargar el perfil:', error.message);
  }
}

cargarPerfil();
