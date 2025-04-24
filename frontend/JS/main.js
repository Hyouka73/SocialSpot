import { API_PLACES_URL } from '../config.js';

document.addEventListener('DOMContentLoaded', async function() {
    const loadingSpinner = document.getElementById('loading-spinner');
    try {
        loadingSpinner.style.display = 'flex';

        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/frontend/auth/login.html';
            return;
        }

        // Cargar lugares desde la API
        const places = await fetchPlaces(token);

        // Agrupar lugares por tipo
        const placesByType = places.reduce((acc, place) => {
            if (!acc[place.type]) {
                acc[place.type] = [];
            }
            acc[place.type].push(place);
            return acc;
        }, {});

        // Renderizar secciones por cada tipo
        const container = document.getElementById('places-sections-container');
        Object.entries(placesByType).forEach(([type, placesOfType]) => {
            // Crear sección
            const section = document.createElement('section');
            section.className = 'places-section';
            section.innerHTML = `
                <h2>${type}</h2>
                <div class="places-container" id="${type.toLowerCase()}-container"></div>
            `;
            container.appendChild(section);

            // Renderizar lugares en la sección
            renderPlaces(placesOfType, `${type.toLowerCase()}-container`);
        });

        // Configurar búsqueda y filtros
        setupSearch(places);
        setupFilters(places);

    } catch (error) {
        console.error('Error al cargar la página principal:', error);
        showAlert('Error al cargar los lugares. Por favor, intenta de nuevo más tarde.', 'error');
    } finally {
        loadingSpinner.style.display = 'none';
    }
});

// Función para obtener lugares desde la API
async function fetchPlaces(token) {
    try {
        const response = await fetch(`${API_PLACES_URL}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener lugares');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener lugares:', error);
        throw error;
    }
}

// Función para renderizar lugares en un contenedor
function renderPlaces(places, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (places.length === 0) {
        container.innerHTML = '<p class="no-results">No se encontraron lugares</p>';
        return;
    }

    const template = document.getElementById('place-card-template');

    places.forEach(place => {
        const placeCard = template.content.cloneNode(true);
        placeCard.querySelector('.place-name').textContent = place.name;
        
        const starsContainer = placeCard.querySelector('.stars-container');
        renderStars(starsContainer, place.rating);

        // Configurar imagen con manejo de rutas
        const imgElement = placeCard.querySelector('.place-image img');
        if (place.image) {
            // Usar ruta absoluta para la imagen
            const imageName = place.image.split('\\').pop(); // Obtiene solo el nombre del archivo
            imgElement.src = `/frontend/assets/perfiles/${imageName}`;
            imgElement.onerror = function() {
                console.warn(`No se pudo cargar la imagen: ${place.image}`);
                this.src = '/frontend/assets/images/placeholder.jpg';
            };
        } else {
            imgElement.src = '/frontend/assets/images/placeholder.jpg';
        }
        imgElement.alt = place.name;

        // Añadir atributo data-type para los estilos
        const card = placeCard.querySelector('.place-card');
        card.setAttribute('data-type', place.type);
        
        // Añadir eventos táctiles y click
        card.addEventListener('touchstart', createRippleEffect);
        card.addEventListener('touchend', removeRippleEffect);
        card.addEventListener('click', () => {
            console.log(`Redirigiendo a map-detail.html con ID: ${place._id}`); // Depuración
            window.location.href = `/frontend/app/map-detail.html?id=${place._id}`; // Pasar el ID del lugar
        });
        
        container.appendChild(placeCard);
    });
}

// Añadir estas nuevas funciones
function createRippleEffect(event) {
    const card = event.currentTarget;
    const ripple = document.createElement('div');
    const rect = card.getBoundingClientRect();
    
    ripple.className = 'touch-ripple';
    ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
    ripple.style.left = event.touches[0].clientX - rect.left - ripple.offsetWidth / 2 + 'px';
    ripple.style.top = event.touches[0].clientY - rect.top - ripple.offsetHeight / 2 + 'px';
    
    card.appendChild(ripple);
    
    ripple.style.animation = 'ripple 0.6s linear';
}

function removeRippleEffect(event) {
    const ripples = event.currentTarget.getElementsByClassName('touch-ripple');
    Array.from(ripples).forEach(ripple => {
        ripple.addEventListener('animationend', () => ripple.remove());
    });
}

// Añadir este keyframe al inicio del documento
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Función para renderizar estrellas según rating
function renderStars(container, rating) {
    container.innerHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Añadir estrellas completas
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star star';
        container.appendChild(star);
    }

    // Añadir media estrella si corresponde
    if (hasHalfStar) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt star';
        container.appendChild(halfStar);
    }

    // Añadir estrellas vacías hasta completar 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        const emptyStar = document.createElement('i');
        emptyStar.className = 'far fa-star star';
        container.appendChild(emptyStar);
    }
}

// Función para configurar la búsqueda
function setupSearch(places) {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPlaces = places.filter(place => 
            place.name.toLowerCase().includes(searchTerm)
        );
        updateDisplayedPlaces(filteredPlaces);
    });
}

// Función para mostrar alertas
function showAlert(message, type) {
    alert(message);
}

function setupFilters(places) {
    const filterPills = document.querySelectorAll('.filter-pill');
    
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remover active de todos los pills
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filterType = pill.dataset.filter;
            const filteredPlaces = filterPlaces(places, filterType);
            updateDisplayedPlaces(filteredPlaces);
        });
    });
}

function filterPlaces(places, filterType) {
    switch (filterType) {
        case 'abierto':
            return filterOpenNow(places);
        case 'precio-bajo':
            return places.filter(place => place.priceRange === '$');
        case 'precio-medio':
            return places.filter(place => place.priceRange === '$$');
        case 'precio-alto':
            return places.filter(place => place.priceRange === '$$$');
        case 'mejor-valorados':
            return places.filter(place => place.rating >= 4.5);
        case 'mascotas':
            return places.filter(place => 
                place.specificDetails?.restrictions?.petsAllowed === true);
        case 'accesible':
            return places.filter(place => 
                place.specificDetails?.facilities?.includes('accesible'));
        case 'estacionamiento':
            return places.filter(place => 
                place.specificDetails?.facilities?.includes('estacionamiento'));
        case 'wifi':
            return places.filter(place => 
                place.specificDetails?.facilities?.includes('wifi'));
        default:
            return places;
    }
}

function filterOpenNow(places) {
    const now = new Date();
    const currentDay = now.toLocaleLowerCase('en-us', { weekday: 'long' });
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;

    return places.filter(place => {
        const schedule = place.schedule?.[currentDay];
        if (!schedule || schedule === 'Cerrado') return false;
        
        const [open, close] = schedule.split('-');
        return isTimeInRange(currentTime, open, close);
    });
}

function isTimeInRange(current, open, close) {
    const convertToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const currentMinutes = convertToMinutes(current);
    const openMinutes = convertToMinutes(open);
    let closeMinutes = convertToMinutes(close);

    // Manejar casos donde el cierre es después de medianoche
    if (closeMinutes < openMinutes) {
        closeMinutes += 24 * 60;
    }

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

function updateDisplayedPlaces(filteredPlaces) {
    // Agrupar lugares filtrados por tipo
    const placesByType = filteredPlaces.reduce((acc, place) => {
        if (!acc[place.type]) {
            acc[place.type] = [];
        }
        acc[place.type].push(place);
        return acc;
    }, {});

    // Actualizar cada sección
    const container = document.getElementById('places-sections-container');
    container.innerHTML = '';
    
    Object.entries(placesByType).forEach(([type, places]) => {
        if (places.length > 0) {
            const section = document.createElement('section');
            section.className = 'places-section';
            section.innerHTML = `
                <h2>${type}</h2>
                <div class="places-container" id="${type.toLowerCase()}-container"></div>
            `;
            container.appendChild(section);
            renderPlaces(places, `${type.toLowerCase()}-container`);
        }
    });
}