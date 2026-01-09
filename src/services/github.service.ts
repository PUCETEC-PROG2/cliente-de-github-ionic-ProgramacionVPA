import axios from 'axios';

// LEER EL TOKEN DESDE LA VARIABLE DE ENTORNO OCULTA
// (Vite usa import.meta.env para acceder a las variables que empiezan con VITE_)
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
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  // GET Repositorios
  getRepos: async () => {
    try {
      const response = await client.get('/user/repos?sort=updated&per_page=10');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo repositorios:', error);
      throw error;
    }
  },

  // POST Crear Repositorio
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
      console.error('Error creando repo:', error);
      throw error;
    }
  }
};