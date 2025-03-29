const express = require('express');
const Comment = require('../models/comment');
const router = express.Router();

// Obtener comentarios de un lugar
router.get('/', async (req, res) => {
  const { placeId } = req.query;
  try {
    const comments = await Comment.find({ placeId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un comentario
router.post('/', async (req, res) => {
  const { text, userId, placeId, rating } = req.body;
  try {
    const comment = new Comment({ text, userId, placeId, rating });
    await comment.save();

    // Actualizar el lugar con el nuevo comentario
    const Place = require('../models/Place'); // Asegúrate de que el modelo Place esté disponible
    await Place.findByIdAndUpdate(placeId, { $push: { comments: comment._id } });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dar "Me gusta" a un comentario
router.put('/like/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: 'Comentario no encontrado' });

    comment.likes += 1;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;