const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, password, sex } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Usuario ya existe' });

    user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      sex,
      preferences: {},
      medals: [],
      visitedPlaces: [],
      friends: [],
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener perfil del usuario
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar preferencias
router.put('/preferences/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    user.preferences = req.body.preferences;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar amigo
router.post('/friends/:userId', async (req, res) => {
  const { friendId } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const friend = await User.findById(friendId);
    if (!friend) return res.status(404).json({ msg: 'Amigo no encontrado' });

    user.friends.push({ userId: friendId, addedAt: new Date() });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar ajustes (notificaciones, modo oscuro, etc.)
router.put('/settings/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    user.notifications = req.body.notifications ?? user.notifications;
    user.darkMode = req.body.darkMode ?? user.darkMode;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar cuenta
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json({ msg: 'Cuenta eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;