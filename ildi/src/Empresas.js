import React, { useState, useEffect } from 'react';
import { guardarEmpresa, obtenerEmpresas } from './api';

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [nuevaEmpresa, setNuevaEmpresa] = useState({
    seccion: '',
    tipo: '',
    nombre_empresa: '',
    enlace_pdf: '',
    notario: '',
    CVE: '',
    capital: '',
  });

  // Cargar empresas al montar el componente
  useEffect(() => {
    const cargarEmpresas = async () => {
      try {
        const datos = await obtenerEmpresas();
        setEmpresas(datos);
      } catch (error) {
        console.error('Error al cargar las empresas:', error);
      }
    };
    cargarEmpresas();
  }, []);

  // Manejar cambios en los inputs del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevaEmpresa({ ...nuevaEmpresa, [name]: value });
  };

  // Guardar una nueva empresa
  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const nueva = await guardarEmpresa(nuevaEmpresa);
      setEmpresas([...empresas, nueva]);
      setNuevaEmpresa({
        seccion: '',
        tipo: '',
        nombre_empresa: '',
        enlace_pdf: '',
        notario: '',
        CVE: '',
        capital: '',
      });
    } catch (error) {
      console.error('Error al guardar la empresa:', error);
    }
  };

  return (
    <div>
      <h1>Empresas</h1>
      <form onSubmit={manejarEnvio}>
        <input
          type="text"
          name="seccion"
          placeholder="Sección"
          value={nuevaEmpresa.seccion}
          onChange={manejarCambio}
        />
        <input
          type="text"
          name="tipo"
          placeholder="Tipo"
          value={nuevaEmpresa.tipo}
          onChange={manejarCambio}
        />
        <input
          type="text"
          name="nombre_empresa"
          placeholder="Nombre Empresa"
          value={nuevaEmpresa.nombre_empresa}
          onChange={manejarCambio}
        />
        <input
          type="text"
          name="enlace_pdf"
          placeholder="Enlace PDF"
          value={nuevaEmpresa.enlace_pdf}
          onChange={manejarCambio}
        />
        <input
          type="text"
          name="notario"
          placeholder="Notario"
          value={nuevaEmpresa.notario}
          onChange={manejarCambio}
        />
        <input
          type="text"
          name="CVE"
          placeholder="CVE"
          value={nuevaEmpresa.CVE}
          onChange={manejarCambio}
        />
        <input
          type="text"
          name="capital"
          placeholder="Capital"
          value={nuevaEmpresa.capital}
          onChange={manejarCambio}
        />
        <button type="submit">Guardar Empresa</button>
      </form>

      <ul>
        {empresas.map((empresa, index) => (
          <li key={index}>
            <h3>{empresa.nombre_empresa}</h3>
            <p>Sección: {empresa.seccion}</p>
            <p>Tipo: {empresa.tipo}</p>
            <p>Notario: {empresa.notario}</p>
            <p>CVE: {empresa.CVE}</p>
            <p>Capital: {empresa.capital}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Empresas;
