// Importar las URLs desde config.js
import { API_USER_URL, API_COMMENTS_URL, API_PLACES_URL } from '/frontend/config.js';

let userLikes = new Set();
let currentUser = null;

async function fetchCurrentUser() {
  try {
    const userId = localStorage.getItem('currentUser');
    if (!userId) {
      throw new Error('No se encontró un usuario autenticado en localStorage');
    }
    const response = await fetch(`${API_USER_URL}users/${userId}`); // Usar API_USER_URL
    if (!response.ok) throw new Error('Error al obtener el usuario autenticado');
    currentUser = await response.json();
    if (currentUser.avatar) {
      currentUser.avatar = `/${currentUser.avatar.replace(/\\/g, '/')}`;
      console.log(`Ruta ajustada del avatar para el usuario autenticado: ${currentUser.avatar}`);
    }
    console.log('Usuario autenticado:', currentUser);
    userLikes = new Set();
  } catch (error) {
    console.error('Error al cargar el usuario autenticado:', error);
    alert('No se pudo cargar el usuario autenticado. Redirigiendo al login.');
    window.location.href = '/frontend/auth/login.html';
    return;
  }
}

async function fetchPlacesAndComments() {
  try {
    const placesResponse = await fetch(API_PLACES_URL); // Usar API_PLACES_URL
    if (!placesResponse.ok) throw new Error(`Error en /api/places: ${placesResponse.statusText}`);
    let places = await placesResponse.json();
    console.log('Lugares obtenidos:', places);

    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    if (placeId) {
      places = places.filter(place => place._id === placeId);
      if (places.length === 0) {
        console.error(`No se encontró un lugar con el ID ${placeId}`);
        alert('Lugar no encontrado. Redirigiendo a la página principal.');
        window.location.href = '/frontend/app/main.html';
        return;
      }
    } else {
      console.error('No se proporcionó un ID de lugar en la URL');
      alert('No se especificó un lugar. Redirigiendo a la página principal.');
      window.location.href = '/frontend/app/main.html';
      return;
    }

    const placesWithComments = await Promise.all(
      places.map(async (place) => {
        try {
          const commentsResponse = await fetch(`${API_COMMENTS_URL}?placeId=${place._id}`); // Usar API_COMMENTS_URL
          if (!commentsResponse.ok) throw new Error(`Error en /api/comments para ${place._id}: ${commentsResponse.statusText}`);
          let comments = await commentsResponse.json();
          console.log(`Comentarios para ${place.name} (placeId: ${place._id}):`, comments);

          comments = await Promise.all(
            comments.map(async (comment) => {
              try {
                if (!comment.userId || typeof comment.userId !== 'string' || !/^[0-9a-fA-F]{24}$/.test(comment.userId)) {
                  console.warn(`userId inválido en comentario ${comment._id}: ${comment.userId}`);
                  return {
                    ...comment,
                    user: { firstName: 'Usuario', lastName: 'Desconocido', avatar: '/frontend/assets/images/user-placeholder.png' }
                  };
                }
                const userResponse = await fetch(`${API_USER_URL}users/${comment.userId}`); // Usar API_USER_URL
                if (!userResponse.ok) {
                  throw new Error(`Error al obtener el usuario: ${userResponse.statusText}`);
                }
                const user = await userResponse.json();
                const userAvatar = user.avatar ? `/${user.avatar.replace(/\\/g, '/')}` : '/frontend/assets/images/user-placeholder.png';
                if (comment.likes && Array.isArray(comment.likes) && comment.likes.includes(currentUser._id)) {
                  userLikes.add(comment._id.toString());
                }
                return {
                  ...comment,
                  user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: userAvatar
                  }
                };
              } catch (error) {
                console.error(`Error al obtener usuario para comentario ${comment._id}:`, error);
                return {
                  ...comment,
                  user: { firstName: 'Usuario', lastName: 'Desconocido', avatar: '/frontend/assets/images/user-placeholder.png' }
                };
              }
            })
          );

          if (place.image) {
            place.image = `/${place.image.replace(/\\/g, '/')}`;
            console.log(`Ruta ajustada de la imagen para ${place.name}: ${place.image}`);
          } else {
            console.warn(`No se encontró imagen para ${place.name}, usando imagen por defecto.`);
            place.image = '/frontend/assets/images/default-place.jpg';
          }

          return { ...place, comments };
        } catch (error) {
          console.error(`Error al obtener comentarios para ${place.name}:`, error);
          return { ...place, comments: [] };
        }
      })
    );

    initializeMap(placesWithComments);
  } catch (error) {
    console.error('Error al cargar datos:', error);
    alert('Error al cargar el mapa. Redirigiendo a la página principal.');
    window.location.href = '/frontend/app/main.html';
  }
}

function initializeMap(places) {
  if (!places || places.length === 0) {
    console.error('No hay lugares para mostrar:', places);
    alert('No se encontraron lugares. Redirigiendo a la página principal.');
    window.location.href = '/frontend/app/main.html';
    return;
  }

  const place = places[0];
  const map = L.map('map').setView([place.coordinates.latitude, place.coordinates.longitude], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map);

  let selectedPlace = null;
  let selectedRating = 0;

  places.forEach(place => {
    const markerIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          text-align: center;
          background-color: white;
          border: 2px solid black;
          border-radius: 5px;
          padding: 2px 5px;
          white-space: nowrap;
          position: relative;
          top: -40px;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
        ">
          <span style="
            color: black;
            font-size: 12px;
            font-weight: bold;
          ">${place.name}</span>
        </div>
        <img src="${place.image || '/frontend/assets/icons/green-marker.png'}" style="width: 38px; height: 38px; position: relative; top: -10px; object-fit: cover;" alt="${place.name}" onerror="this.src='/frontend/assets/icons/green-marker.png'; console.error('Error al cargar imagen para ${place.name}: ${place.image}');">
      `,
      iconSize: [100, 50],
      iconAnchor: [50, 50],
    });

    const marker = L.marker([place.coordinates.latitude, place.coordinates.longitude], {
      icon: markerIcon
    }).addTo(map);

    marker.on('click', () => {
      selectedPlace = place;
      document.getElementById('location-name').textContent = place.name;
      document.getElementById('location-address').textContent = `Dirección: ${place.address || 'No disponible'}`;
      const locationImage = document.getElementById('location-image');
      locationImage.src = place.image || '/frontend/assets/images/default-place.jpg';
      locationImage.alt = place.name;
      locationImage.classList.remove('hidden');
      document.getElementById('location-info').classList.remove('hidden');
      document.getElementById('comments-section').classList.remove('hidden');
      document.getElementById('comments-list').classList.remove('hidden');
      document.getElementById('add-comment-section').classList.add('hidden');
      document.getElementById('toggle-comments').src = '/frontend/assets/images/down-arrow.png';
      displayComments(place.comments);

      document.querySelector('.details-container').classList.add('visible');
    });

    marker.fire('click');
  });

  function displayComments(comments) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    
    const locationImage = document.getElementById('location-image');
    const commentsTitle = document.getElementById('comments-title');
    locationImage.classList.add('hidden');
    commentsTitle.classList.add('hidden');

    if (!comments || comments.length === 0) {
      commentsList.innerHTML = '<p>No hay comentarios disponibles.</p>';
      return;
    }

    comments.forEach(comment => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';
      const userName = comment.userId === currentUser._id
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : `${comment.user.firstName} ${comment.user.lastName}`;
      const userAvatar = comment.userId === currentUser._id
        ? (currentUser.avatar || '/frontend/assets/images/user-placeholder.png')
        : comment.user.avatar;
      const hasLiked = userLikes.has(comment._id.toString());
      commentDiv.innerHTML = `
        <img src="${userAvatar}" alt="${userName}" class="user-avatar">
        <div class="comment-content">
          <p class="comment-user">${userName}</p>
          <p class="comment-text">${comment.text}</p>
          <div class="comment-likes">
            <img src="${hasLiked ? '/frontend/assets/images/corazon (1).png' : '/frontend/assets/images/corazon.png'}" 
                 alt="Like" 
                 class="like-icon" 
                 data-comment-id="${comment._id}" 
                 style="cursor: pointer; width: 20px; height: 20px;">
            <span class="likes-count">${comment.likes && Array.isArray(comment.likes) ? comment.likes.length : 0}</span>
          </div>
        </div>
      `;
      commentsList.appendChild(commentDiv);
    });

    setupLikeEvents();
  }

  function setupLikeEvents() {
    document.querySelectorAll('.like-icon').forEach(icon => {
      const newIcon = icon.cloneNode(true);
      icon.parentNode.replaceChild(newIcon, icon);
    });

    document.querySelectorAll('.like-icon').forEach(icon => {
      icon.addEventListener('click', async (e) => {
        const commentId = e.target.dataset.commentId;
        console.log(`Intentando dar/quitar like al comentario ${commentId} por el usuario ${currentUser._id}`);
        try {
          const response = await fetch(`${API_COMMENTS_URL}/${commentId}/like`, { // Usar API_COMMENTS_URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser._id })
          });
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al manejar el like: ${errorText}`);
          }
          const updatedComment = await response.json();
          console.log('Comentario actualizado después del like:', updatedComment);
          if (userLikes.has(commentId)) {
            userLikes.delete(commentId);
            e.target.src = '/frontend/assets/images/corazon.png';
          } else {
            userLikes.add(commentId);
            e.target.src = '/frontend/assets/images/corazon (1).png';
          }
          e.target.nextElementSibling.textContent = updatedComment.likes.length;
          selectedPlace.comments = selectedPlace.comments.map(comment => 
            comment._id === commentId ? { ...comment, likes: updatedComment.likes } : comment
          );
        } catch (error) {
          console.error('Error al manejar el like:', error);
          alert('Error al manejar el like. Por favor, intenta de nuevo.');
        }
      });
    });
  }

  document.getElementById('toggle-comments').addEventListener('click', () => {
    const commentsTitle = document.getElementById('comments-title');
    const commentsList = document.getElementById('comments-list');
    const addCommentSection = document.getElementById('add-comment-section');
    const toggleArrow = document.getElementById('toggle-comments');
    const locationImage = document.getElementById('location-image');

    if (addCommentSection.classList.contains('hidden')) {
      addCommentSection.classList.remove('hidden');
      commentsTitle.classList.add('hidden');
      commentsList.classList.add('hidden');
      toggleArrow.src = '/frontend/assets/images/arrow-up.png';
      locationImage.classList.add('hidden');
    } else {
      addCommentSection.classList.add('hidden');
      commentsTitle.classList.add('hidden');
      commentsList.classList.remove('hidden');
      toggleArrow.src = '/frontend/assets/images/down-arrow.png';
      locationImage.classList.add('hidden');
    }
  });

  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', (e) => {
      selectedRating = e.target.dataset.value;
      document.querySelectorAll('.star').forEach(s => {
        s.classList.remove('selected');
        if (s.dataset.value <= selectedRating) s.classList.add('selected');
      });
    });
  });

  document.getElementById('submit-comment').addEventListener('click', async () => {
    const commentText = document.getElementById('comment-input').value;
    if (commentText.trim() && selectedPlace && selectedRating > 0) {
      if (!currentUser._id) {
        alert('Por favor, inicia sesión para agregar un comentario.');
        window.location.href = '/frontend/auth/login.html';
        return;
      }
      try {
        const newComment = {
          text: commentText,
          userId: currentUser._id,
          placeId: selectedPlace._id,
          rating: parseInt(selectedRating)
        };
        console.log('Enviando comentario:', newComment);

        const response = await fetch(API_COMMENTS_URL, { // Usar API_COMMENTS_URL
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newComment)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al guardar el comentario: ${errorText}`);
        }

        const savedComment = await response.json();
        console.log('Comentario guardado:', savedComment);
        savedComment.user = {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          avatar: currentUser.avatar
        };
        selectedPlace.comments.push(savedComment);
        document.getElementById('comment-input').value = '';
        selectedRating = 0;
        document.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
        displayComments(selectedPlace.comments);
        document.getElementById('add-comment-section').classList.add('hidden');
        document.getElementById('toggle-comments').src = '/frontend/assets/images/down-arrow.png';
      } catch (error) {
        console.error('Error al enviar el comentario:', error);
        alert('Error al enviar el comentario. Por favor, intenta de nuevo.');
      }
    } else {
      alert('Por favor, escribe un comentario y selecciona una calificación.');
    }
  });

  window.shareLocation = function() {
    if (selectedPlace) {
      const shareUrl = `${window.location.href}?place=${selectedPlace._id}`;
      navigator.clipboard.writeText(shareUrl).then(() => alert('Enlace copiado al portapapeles.'));
    } else {
      alert('Selecciona un lugar primero.');
    }
  };
}

fetchCurrentUser().then(() => {
  if (currentUser) {
    fetchPlacesAndComments();
  }
});