const locations = [
  {
    id: 1,
    type: "restaurant",
    name: "La Parrilla Mexicana",
    rating: 4.5,
    category: "Mexican",
    address: "Av. Principal 123",
    coordinates: {
      latitude: 19.4326,
      longitude: -99.1332,
    },
    image: "restaurant1.jpg",
    description: "Auténtica comida mexicana con el mejor ambiente",
    priceRange: "$$",
    schedule: {
      monday: "12:00-22:00",
      tuesday: "12:00-22:00",
      wednesday: "12:00-22:00",
      thursday: "12:00-23:00",
      friday: "12:00-00:00",
      saturday: "12:00-00:00",
      sunday: "12:00-20:00",
    },
    specificDetails: {
      menu: [
        {
          item: "Tacos al pastor",
          price: 50,
          category: "main",
        },
        {
          item: "Margarita",
          price: 80,
          category: "drinks",
        },
      ],
      promotions: [
        {
          description: "2x1 en tacos los miércoles",
          validUntil: "2025-12-31",
        },
      ],
      restrictions: {
        minorsAllowed: true,
        petsAllowed: false,
        dressCode: "casual",
      },
    },
    contact: {
      phone: "+52 55 1234 5678",
      website: "www.laparrillamexicana.com",
    },
    comments: [1, 2, 3],
  },
  {
    id: 2,
    type: "park",
    name: "Parque Central",
    rating: 4.3,
    category: "Nature",
    address: "Av. Verde 101",
    coordinates: {
      latitude: 19.4400,
      longitude: -99.1300,
    },
    image: "park1.jpg",
    description: "Un parque amplio con áreas verdes y juegos infantiles",
    priceRange: "$",
    schedule: {
      "monday-sunday": "06:00-20:00",
    },
    specificDetails: {
      entryPoints: [
        {
          name: "Entrada Norte",
          coordinates: {
            latitude: 19.4420,
            longitude: -99.1305,
          },
        },
        {
          name: "Entrada Sur",
          coordinates: {
            latitude: 19.4380,
            longitude: -99.1295,
          },
        },
      ],
      facilities: ["juegos infantiles", "bancas", "áreas para picnic"],
      restrictions: {
        petsAllowed: true,
        bicyclesAllowed: true,
        alcoholAllowed: false,
      },
    },
    contact: {
      phone: "+52 55 9876 5432",
      website: null,
    },
    comments: [11, 12],
  },
  {
    id: 3,
    type: "restaurant",
    name: "Sushi Master",
    rating: 4.8,
    category: "Japanese",
    address: "Calle Sakura 456",
    coordinates: {
      latitude: 19.4265,
      longitude: -99.1401,
    },
    image: "restaurant2.jpg",
    description: "El mejor sushi de la ciudad",
    priceRange: "$$$",
    schedule: {
      monday: "13:00-21:00",
      tuesday: "13:00-21:00",
      wednesday: "13:00-21:00",
      thursday: "13:00-22:00",
      friday: "13:00-23:00",
      saturday: "13:00-23:00",
      sunday: "closed",
    },
    specificDetails: {
      menu: [
        {
          item: "Sushi combo",
          price: 200,
          category: "main",
        },
        {
          item: "Sake",
          price: 120,
          category: "drinks",
        },
      ],
      promotions: [
        {
          description: "10% descuento en pedidos en línea",
          validUntil: "2025-06-30",
        },
      ],
      restrictions: {
        minorsAllowed: true,
        petsAllowed: true,
        dressCode: "semi-formal",
      },
    },
    contact: {
      phone: "+52 55 8765 4321",
      website: "www.sushimaster.com",
    },
    comments: [4, 5, 9],
  },
];

export default locations;