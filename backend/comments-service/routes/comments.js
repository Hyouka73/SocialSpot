const express = require('express');
const Comment = require('../models/comment');
const router = express.Router();

// Obtener comentarios de un lugar
router.get('/', async (req, res) => {
  const { placeId } = req.query;
  try {
    if (!placeId) {
      return res.status(400).json({ error: 'El placeId es requerido' });
    }
    const comments = await Comment.find({ placeId });
    res.json(comments);
  } catch (err) {
    console.error('Error al obtener comentarios:', err);
    res.status(500).json({ error: err.message });
  }
});

// Crear un comentario
router.post('/', async (req, res) => {
  const { text, userId, placeId, rating } = req.body;
  try {
    // Validar los campos requeridos
    if (!text || !userId || !placeId || !rating) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const comment = new Comment({ text, userId, placeId, rating, likes: [] });
    const savedComment = await comment.save();

    res.status(201).json(savedComment);
  } catch (err) {
    console.error('Error al crear comentario:', err);
    res.status(500).json({ error: err.message });
  }
});

// Alternar "like" o "unlike" en un comentario
router.post('/:commentId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const commentId = req.params.commentId;

    if (!userId) {
      return res.status(400).json({ error: 'El userId es requerido' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Asegurarse de que likes sea un array
    if (!Array.isArray(comment.likes)) {
      comment.likes = [];
    }

    const userIndex = comment.likes.indexOf(userId);
    if (userIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(userIndex, 1);
    }

    const updatedComment = await comment.save();
    res.json(updatedComment); // Devolver el comentario completo
  } catch (error) {
    console.error('Error al manejar el like:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}); 

module.exports = router;