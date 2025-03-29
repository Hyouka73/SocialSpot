const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // Nombre(s)
  lastName: { type: String, required: true },  // Apellidos
  sex: { type: String, enum: ['masculino', 'femenino', 'otro'], required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'default.jpg' },
  notifications: { type: Boolean, default: false },
  darkMode: { type: Boolean, default: false }, // Para modo oscuro
  reviewCount: { type: Number, default: 0 },
  preferences: {
    favoritePlaceTypes: [String], // Ejemplo: ["restaurantes", "parques"]
    priceRange: String,           // Ejemplo: "bajo", "medio", "alto"
    frequency: String,            // Ejemplo: "2 veces", "4 veces"
    interests: [String],          // Ejemplo: ["comida internacional", "naturaleza"]
    preferredTime: String,        // Ejemplo: "mañana", "tarde", "noche"
    travelDistance: Number,       // En kilómetros
    language: { type: String, default: 'español' },
  },
  medals: [
    {
      name: String,              // Ejemplo: "Crítico Gourmet"
      progress: Number,          // Progreso (porcentaje)
      total: Number,             // Total necesario para obtener la medalla
      earnedAt: Date,            // Fecha en que se obtuvo
    },
  ],
  visitedPlaces: [
    {
      placeId: String,
      visitedAt: Date,
    },
  ],
  friends: [
    {
      userId: String,
      addedAt: Date,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);