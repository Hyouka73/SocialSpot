require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Place = require('./models/place');
const Comment = require('./models/comment');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      autoCreate: true,
      bufferCommands: false
    };

    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SocialSpot',
      options
    );
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
};

// Función mejorada para poblar la base de datos
const seedDB = async () => {
  let conn;
  try {
    conn = await connectDB();
    
    console.log('🔄 Creando colecciones si no existen...');
    await Promise.all([
      User.createCollection(),
      Place.createCollection(),
      Comment.createCollection()
    ]);

    console.log('🧹 Limpiando datos existentes...');
    await Promise.all([
      User.deleteMany({}),
      Place.deleteMany({}),
      Comment.deleteMany({})
    ]);

    console.log('🌱 Insertando usuarios...');
    const usersData = [
      {
        firstName: 'Ana',
        lastName: 'Gómez',
        sex: 'femenino',
        email: 'ana@example.com',
        phone: '5551234567',
        password: 'password123',
        avatar: 'frontend\\assets\\perfiles\\ana.jpg',
        notifications: true,
        darkMode: false,
        preferences: {
          favoritePlaceTypes: ['Restaurantes', 'Cafeterías'],
          priceRange: 'medio',
          frequency: '3 veces',
          interests: ['comida italiana', 'postres'],
          preferredTime: 'tarde',
          travelDistance: 5,
          language: 'español'
        }
      },
      {
        firstName: 'Carlos',
        lastName: 'Martínez',
        sex: 'masculino',
        email: 'carlos@example.com',
        phone: '5557654321',
        password: 'password123',
        avatar: 'frontend\\assets\\perfiles\\carlos.jpg',
        darkMode: true,
        preferences: {
          favoritePlaceTypes: ['Bares', 'Parques'],
          priceRange: 'alto',
          frequency: '1 vez',
          interests: ['coctelería', 'vida nocturna'],
          preferredTime: 'noche',
          travelDistance: 10,
          language: 'español'
        }
      },
      {
        firstName: 'Luisa',
        lastName: 'Fernández',
        sex: 'femenino',
        email: 'luisa@example.com',
        phone: '5559876543',
        password: 'password123',
        avatar: 'frontend\\assets\\perfiles\\luisa.jpg',
        notifications: true,
        darkMode: true,
        preferences: {
          favoritePlaceTypes: ['Museos', 'Librerías'],
          priceRange: 'bajo',
          frequency: '2 veces',
          interests: ['arte', 'lectura'],
          preferredTime: 'mañana',
          travelDistance: 3,
          language: 'español'
        }
      }
    ];
    const createdUsers = [];
    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(await user.save());
    }
    console.log(`${createdUsers.length} users created`);

    console.log('🌱 Insertando lugares...');
    const placesData = [
      // Restaurante italiano
      {
        type: 'Restaurantes',
        name: 'La Trattoria',
        rating: 4.5,
        category: 'Italiana',
        address: 'Calle Roma 123, Ciudad',
        coordinates: {
          latitude: 19.4326,
          longitude: -99.1332
        },
        image: 'frontend\\assets\\perfiles\\trattoria.jpg',
        description: 'Auténtica cocina italiana en un ambiente acogedor',
        priceRange: '$$',
        schedule: {
          monday: '12:00-22:00',
          tuesday: '12:00-22:00',
          wednesday: '12:00-22:00',
          thursday: '12:00-23:00',
          friday: '12:00-23:00',
          saturday: '12:00-23:00',
          sunday: '12:00-21:00'
        },
        specificDetails: {
          menu: [
            { item: 'Pasta Carbonara', price: 180, category: 'main' },
            { item: 'Tiramisú', price: 90, category: 'dessert' }
          ],
          restrictions: {
            minorsAllowed: true,
            petsAllowed: false,
            dressCode: 'casual',
            alcoholAllowed: true
          }
        }
      },
      // Parque central
      {
        type: 'Parques',
        name: 'Parque Central',
        rating: 4.8,
        category: 'Naturaleza',
        address: 'Av. Principal 456, Ciudad',
        coordinates: {
          latitude: 19.4366,
          longitude: -99.1352
        },
        image: 'frontend\\assets\\perfiles\\parque.jpg',
        description: 'Gran espacio verde con áreas de juegos y senderos',
        priceRange: '$',
        schedule: {
          monday: '06:00-20:00',
          tuesday: '06:00-20:00',
          wednesday: '06:00-20:00',
          thursday: '06:00-20:00',
          friday: '06:00-20:00',
          saturday: '06:00-20:00',
          sunday: '06:00-20:00'
        },
        specificDetails: {
          facilities: ['juegos infantiles', 'bancas', 'fuente'],
          restrictions: {
            petsAllowed: true,
            bicyclesAllowed: true
          }
        }
      },
      // Café boutique
      {
        type: 'Cafeterías',
        name: 'Café del Sol',
        rating: 4.7,
        category: 'Café de especialidad',
        address: 'Calle Flores 789, Ciudad',
        coordinates: {
          latitude: 19.4340,
          longitude: -99.1340
        },
        image: 'frontend\\assets\\perfiles\\cafe.jpg',
        description: 'Café artesanal con los mejores granos de la región',
        priceRange: '$$',
        schedule: {
          monday: '07:00-21:00',
          tuesday: '07:00-21:00',
          wednesday: '07:00-21:00',
          thursday: '07:00-22:00',
          friday: '07:00-22:00',
          saturday: '08:00-22:00',
          sunday: '08:00-20:00'
        },
        specificDetails: {
          menu: [
            { item: 'Latte', price: 45, category: 'bebida' },
            { item: 'Croissant', price: 35, category: 'panadería' }
          ]
        }
      },
      // Bar de vinos
      {
        type: 'Bares',
        name: 'Vinoteca 1920',
        rating: 4.3,
        category: 'Bar de vinos',
        address: 'Av. Juárez 1920, Ciudad',
        coordinates: {
          latitude: 19.4330,
          longitude: -99.1360
        },
        image: 'frontend\\assets\\perfiles\\vinoteca.jpg',
        description: 'Amplia selección de vinos nacionales e internacionales',
        priceRange: '$$$',
        schedule: {
          monday: '16:00-02:00',
          tuesday: '16:00-02:00',
          wednesday: '16:00-02:00',
          thursday: '16:00-02:00',
          friday: '16:00-03:00',
          saturday: '16:00-03:00',
          sunday: '16:00-00:00'
        },
        specificDetails: {
          restrictions: {
            minorsAllowed: false,
            petsAllowed: false,
            alcoholAllowed: true
          }
        }
      },
      // Museo de arte
      {
        type: 'Museos',
        name: 'Museo de Arte Moderno',
        rating: 4.6,
        category: 'Arte contemporáneo',
        address: 'Paseo de la Reforma 100, Ciudad',
        coordinates: {
          latitude: 19.4350,
          longitude: -99.1370
        },
        image: 'frontend\\assets\\perfiles\\museo.jpg',
        description: 'Exposiciones de arte moderno y contemporáneo',
        priceRange: '$$',
        schedule: {
          monday: 'Cerrado',
          tuesday: '10:00-18:00',
          wednesday: '10:00-18:00',
          thursday: '10:00-18:00',
          friday: '10:00-18:00',
          saturday: '10:00-18:00',
          sunday: '10:00-18:00'
        },
        specificDetails: {
          facilities: ['tienda', 'cafetería', 'audioguías']
        }
      },
      // Librería
      {
        type: 'Librerías',
        name: 'El Saber Infinito',
        rating: 4.9,
        category: 'Librería general',
        address: 'Calle Conocimiento 456, Ciudad',
        coordinates: {
          latitude: 19.4370,
          longitude: -99.1320
        },
        image: 'frontend\\assets\\perfiles\\libreria.jpg',
        description: 'Librería independiente con amplia selección de títulos',
        priceRange: '$$',
        schedule: {
          monday: '10:00-20:00',
          tuesday: '10:00-20:00',
          wednesday: '10:00-20:00',
          thursday: '10:00-20:00',
          friday: '10:00-20:00',
          saturday: '10:00-20:00',
          sunday: '11:00-18:00'
        },
        specificDetails: {
          facilities: ['área de lectura', 'cafetería']
        }
      }
    ];
    const createdPlaces = [];
    for (const placeData of placesData) {
      const place = new Place(placeData);
      createdPlaces.push(await place.save());
    }
    console.log(`${createdPlaces.length} places created`);

    console.log('🌱 Insertando comentarios...');
    const commentsData = [
      // Comentarios para La Trattoria (lugar 0)
      {
        userId: createdUsers[0]._id,
        placeId: createdPlaces[0]._id,
        rating: 5,
        text: 'Excelente comida y servicio. La pasta estaba perfecta!'
      },
      {
        userId: createdUsers[1]._id,
        placeId: createdPlaces[0]._id,
        rating: 4,
        text: 'Muy buen ambiente, aunque un poco caro para lo que es'
      },
      
      // Comentarios para Parque Central (lugar 1)
      {
        userId: createdUsers[2]._id,
        placeId: createdPlaces[1]._id,
        rating: 5,
        text: 'Hermoso parque para pasar la tarde con amigos'
      },
      {
        userId: createdUsers[0]._id,
        placeId: createdPlaces[1]._id,
        rating: 4,
        text: 'Muy bien mantenido, pero faltan más bancas'
      },
      
      // Comentarios para Café del Sol (lugar 2)
      {
        userId: createdUsers[1]._id,
        placeId: createdPlaces[2]._id,
        rating: 5,
        text: 'El mejor café de la ciudad, sin duda'
      },
      {
        userId: createdUsers[2]._id,
        placeId: createdPlaces[2]._id,
        rating: 4,
        text: 'Buen ambiente para trabajar, wifi estable'
      },
      
      // Comentarios para Vinoteca 1920 (lugar 3)
      {
        userId: createdUsers[0]._id,
        placeId: createdPlaces[3]._id,
        rating: 4,
        text: 'Gran selección de vinos, el sommelier muy conocedor'
      },
      {
        userId: createdUsers[1]._id,
        placeId: createdPlaces[3]._id,
        rating: 3,
        text: 'Buen lugar pero las porciones son pequeñas para el precio'
      },
      
      // Comentarios para Museo de Arte Moderno (lugar 4)
      {
        userId: createdUsers[2]._id,
        placeId: createdPlaces[4]._id,
        rating: 5,
        text: 'Exposiciones increíbles, vale cada peso la entrada'
      },
      {
        userId: createdUsers[0]._id,
        placeId: createdPlaces[4]._id,
        rating: 4,
        text: 'Muy buen museo, pero algunas salas estaban cerradas'
      },
      
      // Comentarios para El Saber Infinito (lugar 5)
      {
        userId: createdUsers[1]._id,
        placeId: createdPlaces[5]._id,
        rating: 5,
        text: 'Mi librería favorita, siempre encuentro algo interesante'
      },
      {
        userId: createdUsers[2]._id,
        placeId: createdPlaces[5]._id,
        rating: 5,
        text: 'El personal es muy amable y conocedor, excelente selección'
      }
    ];

    const createdComments = [];
    for (const commentData of commentsData) {
      const comment = new Comment(commentData);
      createdComments.push(await comment.save());
      
      // Actualizar el lugar con el comentario
      await Place.findByIdAndUpdate(commentData.placeId, {
        $push: { comments: comment._id }
      });
      
      // Actualizar el rating promedio del lugar
      const place = await Place.findById(commentData.placeId);
      const comments = await Comment.find({ placeId: commentData.placeId });
      const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
      place.rating = parseFloat(avgRating.toFixed(1));
      await place.save();
    }
    console.log(`${createdComments.length} comments created`);

    console.log('✨ Actualizando relaciones...');
    // Actualizar usuarios con lugares visitados y amigos
    // Ana visita La Trattoria y el Museo, amigos con Carlos y Luisa
    await User.findByIdAndUpdate(createdUsers[0]._id, {
      $push: {
        visitedPlaces: [
          { placeId: createdPlaces[0]._id, visitedAt: new Date() },
          { placeId: createdPlaces[4]._id, visitedAt: new Date() }
        ],
        friends: [
          { userId: createdUsers[1]._id, addedAt: new Date() },
          { userId: createdUsers[2]._id, addedAt: new Date() }
        ]
      },
      reviewCount: 3
    });

    // Carlos visita Vinoteca y el Parque, amigos con Ana
    await User.findByIdAndUpdate(createdUsers[1]._id, {
      $push: {
        visitedPlaces: [
          { placeId: createdPlaces[3]._id, visitedAt: new Date() },
          { placeId: createdPlaces[1]._id, visitedAt: new Date() }
        ],
        friends: [
          { userId: createdUsers[0]._id, addedAt: new Date() }
        ]
      },
      reviewCount: 3
    });

    // Luisa visita la Librería y el Café, amigos con Ana
    await User.findByIdAndUpdate(createdUsers[2]._id, {
      $push: {
        visitedPlaces: [
          { placeId: createdPlaces[5]._id, visitedAt: new Date() },
          { placeId: createdPlaces[2]._id, visitedAt: new Date() }
        ],
        friends: [
          { userId: createdUsers[0]._id, addedAt: new Date() }
        ]
      },
      reviewCount: 4
    });

    console.log('✔️ Seeding completado exitosamente!');
  } catch (err) {
    console.error('🔥 Error durante el seeding:', err);
  } finally {
    if (conn) {
      await mongoose.disconnect();
      console.log('🔌 Conexión cerrada');
    }
    process.exit(0);
  }
};

seedDB();