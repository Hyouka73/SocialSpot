const express = require('express');
const Place = require('../models/place');
const router = express.Router();

// Listar todos los lugares
router.get('/', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un lugar por ID
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate('comments');
    if (!place) return res.status(404).json({ msg: 'Lugar no encontrado' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filtrar lugares (por categoría, precio, horario, etc.)
router.get('/filter', async (req, res) => {
  const { category, priceRange, openNow, latitude, longitude, maxDistance } = req.query;
  try {
    let query = {};

    if (category) query.category = category;
    if (priceRange) query.priceRange = priceRange;

    // Filtrar por lugares abiertos ahora
    if (openNow === 'true') {
      const now = new Date();
      const day = now.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
      const currentTime = now.toTimeString().slice(0, 5); // Ejemplo: "14:30"
      query[`schedule.${day}`] = { $exists: true };
      // Esto es una simplificación; necesitarías lógica adicional para comparar el horario
    }

    // Filtrar por distancia (cerca de mí)
    if (latitude && longitude && maxDistance) {
      query.coordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(maxDistance) * 1000, // Convertir a metros
        },
      };
    }

    const places = await Place.find(query);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;