const express = require('express');
const router = express.Router();

module.exports = (db) => {
  const Comment = require('../models/comment')(db);

  // Obtener comentarios de un lugar
  router.get('/', async (req, res) => {
    const { placeId } = req.query;
    if (!placeId) return res.status(400).json({ error: 'Se requiere placeId' });

    try {
      const comments = await Comment.findByPlaceId(placeId);
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Crear comentario
  router.post('/', async (req, res) => {
    const { text, userId, placeId, rating } = req.body;
    if (!text || !userId || !placeId || !rating) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
      const newComment = await Comment.create({ text, userId, placeId, rating });
      res.status(201).json(newComment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Like/Unlike
  router.post('/:commentId/like', async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Se requiere userId' });

    try {
      const updatedComment = await Comment.toggleLike(commentId, userId);
      res.json(updatedComment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Eliminar comentario
  router.delete('/:commentId', async (req, res) => {
    const { commentId } = req.params;
    try {
      await Comment.delete(commentId);
      res.json({ message: 'Comentario eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};