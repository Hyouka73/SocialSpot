const placeTypes = [
  {
    id: 'restaurant',
    name: 'Restaurante',
    icon: 'restaurant.png',
    description: 'Lugares para comer y beber',
    filters: ['cuisine', 'priceRange', 'rating']
  },
  {
    id: 'park',
    name: 'Parque',
    icon: 'park.png',
    description: 'Espacios verdes y áreas recreativas',
    filters: ['facilities', 'petsAllowed', 'rating']
  },
  {
    id: 'bar',
    name: 'Bar',
    icon: 'bar.png',
    description: 'Lugares para bebidas y entretenimiento',
    filters: ['priceRange', 'rating', 'musicType']
  },
  {
    id: 'museum',
    name: 'Museo',
    icon: 'museum.png',
    description: 'Espacios culturales y exhibiciones',
    filters: ['category', 'priceRange', 'rating']
  },
  {
    id: 'shopping',
    name: 'Centro Comercial',
    icon: 'shopping.png',
    description: 'Lugares para compras',
    filters: ['category', 'priceRange', 'rating']
  }
];

export default placeTypes;
