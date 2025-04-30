module.exports = (db) => ({
  // Obtener todos los comentarios de un lugar
  findByPlaceId: async (placeId) => {
    try {
      const response = await db.find({
        selector: { placeId },
        fields: ['_id', 'text', 'userId', 'placeId', 'rating', 'likes', 'date'],
      });
      return response.docs;
    } catch (err) {
      throw new Error(`Error al buscar comentarios: ${err.message}`);
    }
  },

  // Crear un nuevo comentario
  create: async (commentData) => {
    try {
      const doc = {
        ...commentData,
        date: new Date().toISOString(),
        likes: [],
      };
      const response = await db.insert(doc);
      return { ...doc, _id: response.id, _rev: response.rev };
    } catch (err) {
      throw new Error(`Error al crear comentario: ${err.message}`);
    }
  },

  // Alternar like/unlike
  toggleLike: async (commentId, userId) => {
    try {
      const doc = await db.get(commentId);
      const likes = doc.likes || [];
      const likeIndex = likes.indexOf(userId);

      if (likeIndex === -1) {
        likes.push(userId);
      } else {
        likes.splice(likeIndex, 1);
      }

      const updatedDoc = { ...doc, likes };
      const response = await db.insert(updatedDoc);
      return { ...updatedDoc, _rev: response.rev };
    } catch (err) {
      throw new Error(`Error al actualizar likes: ${err.message}`);
    }
  },

  // Eliminar comentario
  delete: async (commentId) => {
    try {
      const doc = await db.get(commentId);
      const response = await db.destroy(commentId, doc._rev);
      return response;
    } catch (err) {
      throw new Error(`Error al eliminar comentario: ${err.message}`);
    }
  }
});