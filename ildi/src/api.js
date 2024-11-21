import axios from 'axios';

const API_URL = 'http://localhost:3001/api/empresas';

// Función para obtener todas las empresas
export const obtenerEmpresas = async (seccion = '') => {
  const response = await fetch(`/api/empresas${seccion ? `?seccion=${seccion}` : ''}`);
  if (!response.ok) {
    throw new Error('Error al obtener empresas');
  }
  return await response.json();
};

// Función para agregar una nueva empresa
export const agregarEmpresa = async (empresa) => {
  try {
    await axios.post(API_URL, empresa);
  } catch (error) {
    console.error('Error al agregar empresa:', error);
  }
};
