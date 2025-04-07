const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose'); // Agregar para validar ObjectId

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('firstName lastName avatar');
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const user = await User.findById(req.params.id).select('firstName lastName avatar');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;