import React, { useEffect, useState } from 'react';
import { obtenerEmpresas, agregarEmpresa } from './api';

const App = () => {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await obtenerEmpresas();
      setEmpresas(data);
    };
    fetchData();
  }, []);

  const handleAgregarEmpresa = async () => {
    const nuevaEmpresa = {
      seccion: 'CONSTITUCIÓN',
      tipo: 'Sociedad Anónima',
      nombre_empresa: 'Nueva Empresa S.A.',
      enlace_pdf: 'https://example.com/pdf',
      notario: 'Notario Ejemplo',
      CVE: '654321',
      capital: '1000000',
    };
    await agregarEmpresa(nuevaEmpresa);
    const data = await obtenerEmpresas();
    setEmpresas(data);
  };

  return (
    <div>
      <h1>Lista de Empresas</h1>
      <ul>
        {empresas.map((empresa, index) => (
          <li key={index}>{empresa.nombre_empresa}</li>
        ))}
      </ul>
      <button onClick={handleAgregarEmpresa}>Agregar Empresa</button>
    </div>
  );
};

export default App;
