require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/SocialSpot?directConnection=true', {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Conexión establecida');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Colecciones existentes:', collections.map(c => c.name));
    
    // Verifica acceso a las colecciones necesarias
    const neededCollections = ['users', 'places', 'comments'];
    neededCollections.forEach(col => {
      console.log(`${col.padEnd(8)}:`, collections.some(c => c.name === col) ? '✅' : '❌');
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();