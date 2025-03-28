import { placeTypes } from '../data/users.js';

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../auth/login.html';
        return;
    }

    // Populate place types
    const placeTypesContainer = document.getElementById('place-types');
    placeTypes.forEach(type => {
        const div = document.createElement('div');
        div.innerHTML = `
            <label>
                <input type="checkbox" name="placeTypes" value="${type}">
                ${type}
            </label>
        `;
        placeTypesContainer.appendChild(div);
    });

    // Handle form submission
    document.getElementById('preferences-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const selectedPlaces = Array.from(document.querySelectorAll('input[name="placeTypes"]:checked'))
            .map(cb => cb.value);

        const preferences = {
            favoritePlaceTypes: selectedPlaces,
            budget: document.getElementById('budget').value,
            weather: document.getElementById('weather').value,
            frequency: document.getElementById('frequency').value,
            schedule: Array.from(document.getElementById('schedule').selectedOptions)
                .map(option => option.value),
            notifications: document.getElementById('notifications').checked
        };

        // Update user preferences
        currentUser.preferences = preferences;
        
        // Update in localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Redirect to main
        window.location.href = '../app/main.html';
    });
});
