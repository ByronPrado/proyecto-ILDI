import React, { useEffect, useState } from 'react';
import { obtenerEmpresas, agregarEmpresa } from './api';

const App = () => {
  const [empresas, setEmpresas] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('CONSTITUCIÓN');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerEmpresas(seccionSeleccionada);
        console.log('datos obtenidos',data);
        setEmpresas(data);
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };
    fetchData();
  }, [seccionSeleccionada]);

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
    const data = await obtenerEmpresas(seccionSeleccionada);
    setEmpresas(data);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Panel Izquierdo */}
      <div
        style={{
          width: '20%',
          backgroundColor: '#f4f4f4',
          padding: '20px',
          borderRight: '1px solid #ddd',
        }}
      >
        <h2>Secciones</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {['CONSTITUCIÓN', 'MODIFICACIÓN', 'DISOLUCIÓN', 'MIGRACIÓN'].map(
            (seccion) => (
              <li
                key={seccion}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  backgroundColor:
                    seccionSeleccionada === seccion ? '#ddd' : 'transparent',
                }}
                onClick={() => setSeccionSeleccionada(seccion)}
              >
                {seccion}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Panel Derecho */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Empresas - {seccionSeleccionada}</h1>
        <ul>
          {empresas.map((empresa, index) => (
            <li key={index}>{empresa.nombre_empresa}</li>
          ))}
        </ul>
        <button onClick={handleAgregarEmpresa}>Agregar Empresa</button>
      </div>
    </div>
  );
};

export default App;
