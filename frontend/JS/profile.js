// JS/profile.js

// Función para obtener datos del usuario autenticado
async function loadUserData() {
  try {
    const userId = localStorage.getItem('currentUser');
    const token  = localStorage.getItem('token');
    if (!userId || !token) throw new Error('Usuario no autenticado');

    const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Error al obtener datos del usuario');

    return await response.json();
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    return null;
  }
}

// Función para mostrar los datos del usuario en el perfil
async function displayUserData() {
  const userData = await loadUserData();
  if (!userData) return;

  // Elementos del DOM
  const nameEl  = document.getElementById('username');
  const imgEl   = document.getElementById('profile-img');
  const descEl  = document.getElementById('description');
  const levelEl = document.getElementById('user-level');

  // 1) Nombre: prioridad según datos disponibles
  let displayName = '';
  if (userData.fullName) {
    displayName = userData.fullName;
  } else if (userData.username) {
    displayName = userData.username;
  } else if (userData.firstName && userData.lastName) {
    displayName = `${userData.firstName} ${userData.lastName}`;
  } else if (userData.email) {
    displayName = userData.email.split('@')[0];
  } else {
    displayName = `Usuario #${localStorage.getItem('currentUser').slice(0,4)}`;
  }
  nameEl.textContent = displayName;

  // 2) Avatar
  const rawAvatar   = userData.avatar || userData.photoURL || '';
  const cleanAvatar = rawAvatar.replace(/\\/g, '/');
  if (cleanAvatar) {
    imgEl.src = cleanAvatar.startsWith('/') ? cleanAvatar : `/${cleanAvatar}`;
  }

  // 3) Descripción
  if (descEl && userData.description) {
    descEl.textContent = userData.description;
  }

  // 4) Nivel
  if (levelEl && userData.level != null) {
    levelEl.textContent = `🌟 Nivel ${userData.level}`;
  }
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', displayUserData);
