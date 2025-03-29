const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Parsear JSON

// Rutas
app.use('/api/auth', authRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth Service corriendo en puerto ${PORT}`));