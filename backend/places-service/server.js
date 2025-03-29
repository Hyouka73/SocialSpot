const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const placesRoutes = require('./routes/places');

dotenv.config();
const app = express();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/places', placesRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Places Service corriendo en puerto ${PORT}`));