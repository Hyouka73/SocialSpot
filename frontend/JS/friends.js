import { API_USER_URL } from '../config.js';

let allUsers = [];

async function loadUsers() {
    try {
        const response = await fetch(`${API_USER_URL}users`);
        if (!response.ok) throw new Error('Error al obtener usuarios');
        
        allUsers = await response.json();
        displayUsers(allUsers);
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        document.getElementById('friends-list').innerHTML = `
            <div class="error">Error al cargar los usuarios: ${error.message}</div>
        `;
    }
}

function displayUsers(users) {
    const friendsList = document.getElementById('friends-list');
    if (!users.length) {
        friendsList.innerHTML = '<div class="no-friends">No se encontraron usuarios</div>';
        return;
    }

    friendsList.innerHTML = users.map(user => `
        <div class="friend-card">
            <img src="${user.avatar || '../assets/images/user-placeholder.png'}" 
                 alt="${user.firstName}" 
                 class="friend-avatar">
            <div class="friend-info">
                <h3 class="friend-name">${user.firstName} ${user.lastName}</h3>
            </div>
            <button class="add-friend-btn" title="Añadir amigo">+</button>
        </div>
    `).join('');
}

// Implementar búsqueda de usuarios
function setupSearch() {
    const searchInput = document.getElementById('friends-search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = allUsers.filter(user => 
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        displayUsers(filteredUsers);
    });
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupSearch();
});
