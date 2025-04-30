const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const nano = require('nano')(process.env.COUCHDB_URI); // Conexión a CouchDB

const app = express();

// Configuración de CouchDB
const commentsDB = nano.db.use('comments');

(async () => {
  try {
    await nano.db.create('comments');
    console.log('✅ Base "comments" creada en CouchDB');
  } catch (err) {
    if (err.error === 'file_exists') {
      console.log('ℹ️ Base "comments" ya existe en CouchDB');
    } else {
      console.error('❌ Error en CouchDB:', err);
    }
  }
})();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const commentsRoutes = require('./routes/comments')(commentsDB);
app.use('/api/comments', commentsRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));