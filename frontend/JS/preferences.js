// Importa la URL base desde config.js
import { API_USER_URL } from '../config.js';

// Add JWT decode function at the top
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error decoding token:', e);
        return null;
    }
}

// Datos para los checkboxes
const placeTypes = [
    'Restaurantes', 'Cafeterías', 'Bares', 'Parques', 
    'Museos', 'Cines', 'Centros comerciales', 'Playas',
    'Montañas', 'Gimnasios', 'Bibliotecas', 'Teatros'
];

const interests = [
    'Comida internacional', 'Cocina local', 'Cócteles', 'Naturaleza',
    'Arte y cultura', 'Deportes', 'Música en vivo', 'Eventos sociales',
    'Tecnología', 'Libros', 'Cine independiente', 'Moda'
];

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '../auth/login.html';
            return;
        }

        // Extract userId from token instead of localStorage
        const decodedToken = parseJwt(token);
        const userId = decodedToken?.id;
        
        if (!userId) {
            console.error('Invalid token: could not extract user ID');
            window.location.href = '../auth/login.html';
            return;
        }

        // Mostrar loader
        document.getElementById('loading-spinner').style.display = 'flex';

        // Cargar datos del usuario (si existen)
        let userData = null;
        try {
            userData = await loadUserData(userId, token);
        } catch (error) {
            console.log('Iniciando con preferencias por defecto');
            userData = {
                preferences: {
                    priceRange: 'medio',
                    frequency: '1-2 veces por semana',
                    preferredTime: 'afternoon',
                    favoritePlaceTypes: [],
                    interests: []
                },
                notifications: true,
                darkMode: false
            };
        }

        // Inicializar multi-select para lugares
        initMultiSelect('place-types', placeTypes, userData?.preferences?.favoritePlaceTypes || []);
        
        // Inicializar multi-select para intereses
        initMultiSelect('interests', interests, userData?.preferences?.interests || []);
        
        // Configurar valores por defecto o cargados
        const defaultPrice = userData?.preferences?.priceRange || 'medio';
        const priceValue = defaultPrice === 'bajo' ? 1 : defaultPrice === 'alto' ? 3 : 2;
        document.getElementById('price-range').value = priceValue;
        updatePriceLabel(priceValue);
        
        // Configurar frecuencia
        const defaultFrequency = userData?.preferences?.frequency || '1-2 veces por semana';
        const freqValue = defaultFrequency.includes('1-2') ? '1' : 
                        defaultFrequency.includes('3-4') ? '2' : '3';
        document.querySelector(`input[name="frequency"][value="${freqValue}"]`).checked = true;
        
        // Configurar horario preferido
        document.getElementById('preferred-time').value = 
            userData?.preferences?.preferredTime || 'afternoon';
        
        // Configurar notificaciones y modo oscuro (valores por defecto true)
        document.getElementById('notifications').checked = 
            userData?.notifications !== undefined ? userData.notifications : true;
        document.getElementById('dark-mode').checked = 
            userData?.darkMode !== undefined ? userData.darkMode : false;
        applyDarkMode(document.getElementById('dark-mode').checked);

        // Ocultar loader
        document.getElementById('loading-spinner').style.display = 'none';
        
        // Manejar cambios en el rango de precio
        document.getElementById('price-range').addEventListener('input', function() {
            updatePriceLabel(this.value);
        });

        // Manejar envío del formulario
        document.getElementById('preferences-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Mostrar loader
            const submitButton = document.querySelector('.save-button');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            submitButton.disabled = true;
            
            try {
                // Recoger datos del formulario
                const selectedPlaces = getSelectedOptions('place-types');
                const selectedInterests = getSelectedOptions('interests');
                
                const priceRangeValue = document.getElementById('price-range').value;
                const priceRange = priceRangeValue === '1' ? 'bajo' : 
                                  priceRangeValue === '2' ? 'medio' : 'alto';
                
                const frequencyValue = document.querySelector('input[name="frequency"]:checked').value;
                const frequency = frequencyValue === '1' ? '1-2 veces por semana' : 
                                frequencyValue === '2' ? '3-4 veces por semana' : '5+ veces por semana';
                
                const preferences = {
                    favoritePlaceTypes: selectedPlaces,
                    interests: selectedInterests,
                    priceRange: priceRange,
                    frequency: frequency,
                    preferredTime: document.getElementById('preferred-time').value,
                    travelDistance: 10
                };
                
                const settings = {
                    notifications: document.getElementById('notifications').checked,
                    darkMode: document.getElementById('dark-mode').checked
                };
                
                // Determinar si es creación o actualización
                const method = userData ? 'PUT' : 'POST';
                const endpoint = userData ? 'preferences' : 'create-preferences';
                
                // Guardar/actualizar preferencias
                const response = await savePreferences(
                    userId, 
                    token, 
                    { preferences, ...settings },
                    method,
                    endpoint
                );
                
                if (response) {
                    showAlert('¡Preferencias guardadas con éxito!', 'success');
                    
                    setTimeout(() => {
                        window.location.href = '../app/main.html';
                    }, 1500);
                }
            } catch (error) {
                console.error('Error al guardar preferencias:', error);
                showAlert('Error al guardar preferencias. Inténtalo de nuevo.', 'error');
            } finally {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
        
    } catch (error) {
        console.error('Error inicial:', error);
        showAlert('Error al cargar la página. Inténtalo de nuevo.', 'error');
        document.getElementById('loading-spinner').style.display = 'none';
    }
});

// Función para inicializar multi-select
function initMultiSelect(containerId, items, selectedItems) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="multi-select">
            <div class="selected-options"></div>
            <div class="dropdown-arrow"><i class="fas fa-chevron-down"></i></div>
            <div class="options-container">
                ${items.map(item => `
                    <label class="option-item">
                        <input type="checkbox" value="${item}" 
                            ${selectedItems.includes(item) ? 'checked' : ''}>
                        <span>${item}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    // Configurar eventos para el multi-select
    const multiSelect = container.querySelector('.multi-select');
    const selectedOptions = container.querySelector('.selected-options');
    const optionsContainer = container.querySelector('.options-container');
    const arrow = container.querySelector('.dropdown-arrow');
    
    // Actualizar visualización de seleccionados
    function updateSelectedDisplay() {
        const checked = Array.from(container.querySelectorAll('input:checked'));
        if (checked.length === 0) {
            selectedOptions.innerHTML = '<span class="placeholder">Selecciona opciones...</span>';
        } else {
            selectedOptions.innerHTML = checked.map(cb => `
                <span class="selected-tag">${cb.value}</span>
            `).join('');
        }
    }
    
    // Toggle dropdown
    arrow.addEventListener('click', () => {
        optionsContainer.style.display = optionsContainer.style.display === 'block' ? 'none' : 'block';
        arrow.querySelector('i').classList.toggle('fa-chevron-up');
        arrow.querySelector('i').classList.toggle('fa-chevron-down');
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!multiSelect.contains(e.target)) {
            optionsContainer.style.display = 'none';
            arrow.querySelector('i').classList.remove('fa-chevron-up');
            arrow.querySelector('i').classList.add('fa-chevron-down');
        }
    });
    
    // Actualizar al cambiar selección
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedDisplay);
    });
    
    // Mostrar selección inicial
    updateSelectedDisplay();
}

// Función para obtener opciones seleccionadas
function getSelectedOptions(containerId) {
    return Array.from(document.querySelectorAll(`#${containerId} input:checked`))
        .map(cb => cb.value);
}

// Función para actualizar la etiqueta del rango de precio
function updatePriceLabel(value) {
    const labels = document.querySelectorAll('.price-label');
    labels.forEach(label => {
        const labelValue = label.getAttribute('data-value');
        if (labelValue === value) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
}

// Función para aplicar modo oscuro
function applyDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
}

// Función para cargar datos del usuario desde la API
async function loadUserData(userId, token) {
    try {
        const response = await fetch(`${API_USER_URL}profile/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'No se encontraron preferencias previas');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error loading user data:', error);
        throw error;
    }
}

// Función para guardar preferencias
async function savePreferences(userId, token, data, method = 'PUT', endpoint = 'preferences') {
    try {
        console.log('Saving preferences for user:', userId); // Debug log
        const response = await fetch(`${API_USER_URL}${endpoint}/${userId}`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.msg || responseData.error || 'Error al guardar preferencias');
        }
        
        return responseData;
    } catch (error) {
        console.error('Error en savePreferences:', error);
        throw error;
    }
}

// Función para mostrar alertas
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    const alertId = 'alert-' + Date.now();
    
    const alert = document.createElement('div');
    alert.id = alertId;
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button class="close-alert" onclick="document.getElementById('${alertId}').remove()">&times;</button>
    `;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => alert.classList.add('show'), 10);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
    return container;
}

// Añadir estilos para el multi-select
const multiSelectStyles = document.createElement('style');
multiSelectStyles.textContent = `
.multi-select {
    position: relative;
    width: 100%;
    margin-top: 1rem;
    border: 1px solid var(--input-border);
    border-radius: var(--border-radius);
    background: #fff;
    cursor: pointer;
}

.selected-options {
    padding: 0.75rem;
    min-height: 44px;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
}

.placeholder {
    color: var(--dark-grey);
    font-style: italic;
}

.selected-tag {
    background: var(--secondary-color);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.85rem;
}

.dropdown-arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--dark-grey);
}

.options-container {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid var(--input-border);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    z-index: 10;
    box-shadow: var(--box-shadow);
}

.option-item {
    display: block;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--light-grey);
}

.option-item:hover {
    background: var(--bg-color);
}

.option-item input {
    margin-right: 0.75rem;
}

.dark-mode .multi-select,
.dark-mode .options-container {
    background: #2d2d2d;
    color: #f0f0f0;
    border-color: #444;
}

.dark-mode .option-item:hover {
    background: #3d3d3d;
}
`;
document.head.appendChild(multiSelectStyles);

// Agregar spinner de carga al DOM
const spinner = document.createElement('div');
spinner.id = 'loading-spinner';
spinner.innerHTML = '<div class="spinner"></div>';
document.body.appendChild(spinner);