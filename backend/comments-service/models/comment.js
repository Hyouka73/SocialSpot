const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  placeId: { type: String, required: true }, // Cambiado de restaurantId a placeId
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: [{ type: String }], // Cambiado de Number a Array de userIds
});

module.exports = mongoose.model('Comment', commentSchema);