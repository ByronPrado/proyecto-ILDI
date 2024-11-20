import axios from 'axios';

const API_URL = 'http://localhost:3001/api/empresas';

// Función para obtener todas las empresas
export const obtenerEmpresas = async () => {
  try {
    const respuesta = await axios.get(API_URL);
    return respuesta.data;
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    return [];
  }
};

// Función para agregar una nueva empresa
export const agregarEmpresa = async (empresa) => {
  try {
    await axios.post(API_URL, empresa);
  } catch (error) {
    console.error('Error al agregar empresa:', error);
  }
};
