import axios from 'axios';

const API_URL = 'http://localhost:3001/api/empresas';
const API_BUSQUEDA_URL = 'http://localhost:3001/api/busqueda';  // Nueva URL para búsqueda

// Función para obtener empresas con filtrado opcional por sección y fecha
export const obtenerEmpresas = async (seccion = '', fecha = '') => {
  try {
    const queryParams = new URLSearchParams();
    if (seccion) queryParams.append('seccion', seccion); // Agrega sección al query
    if (fecha) queryParams.append('fecha', fecha);       // Agrega fecha al query

    const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    throw new Error('Error al obtener empresas');
  }
};

// Nueva función para realizar búsqueda con filtros
export const buscarEmpresas = async  (fecha = '', tipo = '', nombre_empresa = '',cve = '') => {
  try {
    const queryParams = new URLSearchParams();
    if (fecha) queryParams.append('fecha_consulta', fecha);
    if (tipo) queryParams.append('tipo', tipo);
    if (nombre_empresa) queryParams.append('nombre_empresa', nombre_empresa);
    if (cve) queryParams.append('CVE',cve);

    const response = await axios.get(`${API_BUSQUEDA_URL}?${queryParams.toString()}`);
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
    throw new Error('Error al realizar la búsqueda');
  }
};
