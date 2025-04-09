const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "Restaurantes",
      "Bares",
      "Cafeterías",
      "Parques",
      "Museos",
      "Cines",
      "Teatros",
      "Centros Comerciales",
      "Gimnasios",
      "Librerías"
    ]
  },
  name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  category: String,
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  image: String,
  description: String,
  priceRange: String,
  schedule: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String,
  },
  specificDetails: {
    menu: [
      {
        item: String,
        price: Number,
        category: String,
      },
    ],
    promotions: [
      {
        description: String,
        validUntil: String,
      },
    ],
    restrictions: {
      minorsAllowed: Boolean,
      petsAllowed: Boolean,
      dressCode: String,
      bicyclesAllowed: Boolean,
      alcoholAllowed: Boolean,
    },
    entryPoints: [
      {
        name: String,
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
    ],
    facilities: [String],
  },
  contact: {
    phone: String,
    website: String,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('Place', placeSchema);