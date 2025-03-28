const placeTypes = [
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
];

const users = {
  user123: {
    name: "Ana García",
    email: "ana.garcia@example.com",
    password: "ana1234",
    avatar: "avatar1.jpg",
    reviewCount: 2,
    preferences: {
      favoritePlaceTypes: ["restaurantes", "parques", "museos"],
      priceRange: "medio",
      interests: ["comida internacional", "naturaleza", "arte"],
      preferredTime: "tarde",
      travelDistance: 20,
      language: "español",
    },
  },
  user456: {
    name: "Carlos López",
    email: "carlos.lopez@example.com",
    password: "carlos2023",
    avatar: "avatar2.jpg",
    reviewCount: 2,
    preferences: {
      favoritePlaceTypes: ["bares", "cines", "centros comerciales"],
      priceRange: "alto",
      interests: ["cine", "vida nocturna", "compras"],
      preferredTime: "noche",
      travelDistance: 15,
      language: "español",
    },
  },
  user789: {
    name: "María Rodríguez",
    email: "maria.rodriguez@example.com",
    password: "maria789",
    avatar: "avatar3.jpg",
    reviewCount: 1,
    preferences: {
      favoritePlaceTypes: ["cafeterías", "librerías", "teatros"],
      priceRange: "bajo",
      interests: ["lectura", "teatro", "café"],
      preferredTime: "mañana",
      travelDistance: 10,
      language: "español",
    },
  },
  user234: {
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    password: "juan456",
    avatar: "avatar4.jpg",
    reviewCount: 1,
    preferences: {
      favoritePlaceTypes: ["gimnasios", "parques", "restaurantes"],
      priceRange: "medio",
      interests: ["deporte", "comida saludable", "aire libre"],
      preferredTime: "mañana",
      travelDistance: 25,
      language: "español",
    },
  },
  user567: {
    name: "Laura Torres",
    email: "laura.torres@example.com",
    password: "laura5678",
    avatar: "avatar5.jpg",
    reviewCount: 1,
    preferences: {
      favoritePlaceTypes: ["museos", "galerías", "restaurantes"],
      priceRange: "alto",
      interests: ["arte", "historia", "gastronomía"],
      preferredTime: "tarde",
      travelDistance: 30,
      language: "español",
    },
  },
};

export { users as default, placeTypes };