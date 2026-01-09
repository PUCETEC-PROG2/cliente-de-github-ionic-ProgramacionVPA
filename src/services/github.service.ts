import axios from 'axios';

// Leemos el token seguro
const ACCESS_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; 

const client = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
});

export const githubService = {
  // GET Usuario
  getUser: async () => {
    try {
      const response = await client.get('/user');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET Repositorios
  getRepos: async () => {
    try {
      const response = await client.get('/user/repos?sort=updated&per_page=100'); // Traemos hasta 100
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST Crear
  createRepo: async (name: string, description: string, isPrivate: boolean) => {
    try {
      const data = {
        name: name,
        description: description,
        private: isPrivate,
        auto_init: true 
      };
      const response = await client.post('/user/repos', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE (Eliminar repositorio)
  deleteRepo: async (owner: string, repoName: string) => {
    try {
      // Para borrar, la URL es /repos/USUARIO/NOMBRE_REPO
      await client.delete(`/repos/${owner}/${repoName}`);
      return true;
    } catch (error) {
      console.error('Error eliminando:', error);
      throw error;
    }
  },

  //PATCH (Actualizar repositorio)
  updateRepo: async (owner: string, repoName: string, newDescription: string) => {
    try {
      const data = { description: newDescription };
      const response = await client.patch(`/repos/${owner}/${repoName}`, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando:', error);
      throw error;
    }
  }
};