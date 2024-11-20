const API_URL = '/api/empresas';

export const obtenerEmpresas = async () => {
  const respuesta = await fetch(API_URL);
  return await respuesta.json();
};

export const agregarEmpresa = async (empresa) => {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empresa),
  });
  return await respuesta.json();
};
