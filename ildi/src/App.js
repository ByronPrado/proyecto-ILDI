import React, { useEffect, useState } from 'react';
import { obtenerEmpresas, buscarEmpresas } from './api';

const App = () => {
  const [empresas, setEmpresas] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('CONSTITUCIÓN');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [nombreEmpresaFiltro, setNombreEmpresaFiltro] = useState('');
  const [cveFiltro, setCveFiltro] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerEmpresas(seccionSeleccionada);
        setEmpresas(data);
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };
    fetchData();
  }, [seccionSeleccionada]);

  const formatearFecha = (fecha) => {
    if(fecha != ''){
      const [año, mes, día] = fecha.split('-');
      return `${día}-${mes}-${año}`;
    }
    else{
      return fecha
    }
    
  };

  const handleFiltrarPorFecha = async () => {
    const fechaFormateada = formatearFecha(fechaFiltro);
    try {
      const empresasFiltradas = await obtenerEmpresas(seccionSeleccionada, fechaFormateada);
      setEmpresas(empresasFiltradas);
    } catch (error) {
      console.error('Error al filtrar empresas:', error);
    }
  };

  const handleBusqueda = async () => {
    const fechaFormateada = formatearFecha(fechaFiltro);
    console.log('Datos enviados:', {
      fechaFormateada,
      tipoFiltro,
      nombreEmpresaFiltro,
      cveFiltro,
    });
    try {
      const empresasBuscadas = await buscarEmpresas(
        fechaFormateada,
        tipoFiltro,
        nombreEmpresaFiltro,
        cveFiltro
      );
      console.log('Datos recibidos:', empresasBuscadas);
      setEmpresas(empresasBuscadas);
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    }
  };

  const handleMostrarTodas = async () => {
    try {
      if (seccionSeleccionada === 'BUSCAR EMPRESA') {
        const data = await obtenerEmpresas('', fechaFiltro);
        setEmpresas(data);
      } else {
        const data = await obtenerEmpresas(seccionSeleccionada);
        setEmpresas(data);
      }
    } catch (error) {
      console.error('Error al mostrar todas las empresas:', error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          width: 'auto',
          minWidth:'200px',
          backgroundColor: '#f4f4f4',
          padding: '20px',
          borderRight: '1px solid #ddd',
          overflowY:'auto',
        }}
      >
        <h2>Secciones</h2>
        <ul style={{listStyle: 'none', padding: 10 }}>
          
          {['CONSTITUCIÓN', 'MODIFICACIÓN', 'DISOLUCIÓN', 'MIGRACIÓN', 'BUSCAR EMPRESA'].map(
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

      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Empresas - {seccionSeleccionada}</h1>
        <div style={{ marginBottom: '20px' }}>
          <label>
            Filtrar por fecha:
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
          <button onClick={handleFiltrarPorFecha} style={{ marginLeft: '10px' }}>
            Filtrar
          </button>
          <button onClick={handleMostrarTodas} style={{ marginLeft: '10px' }}>
            Mostrar Todas
          </button>
        </div>

        {/* Sección de Búsqueda Avanzada */}
        {seccionSeleccionada === 'BUSCAR EMPRESA' && (
          <div style={{ marginBottom: '20px', flex: true }}>
            <label>
              Buscar por nombre de empresa:
              <input
                type="text"
                value={nombreEmpresaFiltro}
                onChange={(e) => setNombreEmpresaFiltro(e.target.value)}
                style={{ marginLeft: '10px' }}
              />
            </label>
            <label style={{ marginLeft: '10px' }}>
              Tipo de empresa:
              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                style={{ marginLeft: '10px' }}
              >
                <option value="">Seleccionar tipo</option>
                <option value="Sociedades Anónimas">S.A.</option>
                <option value="Sociedades de Responsabilidad Limitada">S.R.L.</option>
                <option value="Empresas Individuales de Responsabilidad Limitada">I.R.L.</option>
                <option value="Sociedades por Acciones">S.P.A</option>
              </select>
            </label>
            <label style={{ marginLeft: '10px', flex: true }}>
              CVE:
              <input
                type="string"
                value={cveFiltro}
                onChange={(e) => setCveFiltro(e.target.value)}
                style={{ marginLeft: '10px' }}
              />
            </label>
            <button onClick={handleBusqueda} style={{ marginLeft: '10px' }}>
              Buscar
            </button>
          </div>
        )}

        {/* Mostrar empresas */}
        <ul>
          {empresas.map((empresa, index) => (
            <li
              key={index}
              style={{
                listStyleType: 'none',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  fontWeight: seccionSeleccionada === 'BUSCAR EMPRESA' ? 'bold' : 'normal',
                  fontSize: '1.2em',
                }}
              >
                {empresa.nombre_empresa}
              </div>
              {seccionSeleccionada === 'BUSCAR EMPRESA' && (
                <>
                  <div>
                    {Object.entries(empresa).map(
                      ([key, value]) =>
                        key !== 'nombre_empresa' &&
                        key !== '_id' && (
                          <p key={key} style={{ margin: '5px 0' }}>
                            <strong>{key.replace(/_/g, ' ')}:</strong> {value}
                          </p>
                        )
                    )}
                  </div>
                  <hr style={{ margin: '10px 0', border: '1px solid #ccc' }} />
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
