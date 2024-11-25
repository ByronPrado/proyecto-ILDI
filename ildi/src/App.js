import React, { useEffect, useState } from 'react'; 
import { obtenerEmpresas, buscarEmpresas } from './api';

const App = () => {
  const [empresas, setEmpresas] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('BUSCAR EMPRESA');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [nombreEmpresaFiltro, setNombreEmpresaFiltro] = useState('');
  const [cveFiltro, setCveFiltro] = useState('');
  const [nombreNotario, setNombreNotario] = useState('');
  const [capitalInicial, setCapitalInicial] = useState('');
  const [CorreoAlert, setCorreoAlert] = useState('');
  const esCorreoValido = (correo) => /\S+@\S+\.\S+/.test(correo);

  // Establece la fecha actual por defecto
  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0]; // Obtiene la fecha de hoy en formato YYYY-MM-DD
    setFechaFiltro(hoy); // Establece la fecha de hoy en el filtro
  }, []);

  // Obtiene las empresas cada vez que se cambie la sección seleccionada
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Aplica el filtro de fecha al obtener las empresas
        const fechaFormateada = formatearFecha(fechaFiltro);
        const data = await obtenerEmpresas(seccionSeleccionada, fechaFormateada);
        setEmpresas(data);
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };
    fetchData();
  }, [seccionSeleccionada, fechaFiltro]);  // Este useEffect depende de la fechaFiltro y seccionSeleccionada

  const formatearFecha = (fecha) => {
    if (fecha !== '') {
      const [año, mes, día] = fecha.split('-');
      return `${día}-${mes}-${año}`;
    } else {
      return fecha;
    }
  };
  const enviarAlerta = async (correo, notario, capital) => {
    // Aquí deberías integrar con la lógica de tu API o backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (correo && notario && capital) {
          resolve('Correo enviado');
        } else {
          reject('Error al enviar el correo');
        }
      }, 1000);
    });
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
    try {
      const empresasBuscadas = await buscarEmpresas(
        fechaFormateada,
        tipoFiltro,
        nombreEmpresaFiltro,
        cveFiltro
      );
      setEmpresas(empresasBuscadas);
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    }
  };
  const handleEnviarAlerta = async () => {
    if (!CorreoAlert) {
      alert('Por favor, ingresa un correo.');
      return;
    }

    if (!esCorreoValido(CorreoAlert)) {
      alert('Por favor, ingresa un correo válido.');
      return;
    }

    if (!nombreNotario && !capitalInicial) {
      alert('Por favor, ingresa al menos un criterio de filtro (notario o capital inicial).');
      return;
    }

    console.log('Enviando alerta con los siguientes datos:', {
      CorreoAlert,
      nombreNotario,
      capitalInicial,
    });

    try {
      const data = await enviarAlerta(CorreoAlert, nombreNotario, capitalInicial);
      alert('Correo enviado exitosamente.');
    } catch (error) {
      console.error('Error al enviar correo:', error);
      alert('Hubo un error al enviar el correo.');
    }
  };

  const handleMostrarTodas = async () => {
    try {
      const fechaFormateada = formatearFecha(fechaFiltro);
      const data = await obtenerEmpresas(seccionSeleccionada, fechaFormateada);
      setEmpresas(data);
    } catch (error) {
      console.error('Error al mostrar todas las empresas:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Banner Header */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#007BFF',
          color: '#fff',
          textAlign: 'center',
          padding: '10px 0',
          fontSize: '1.5em',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        Empresas y Cooperativas Diario Oficial
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Panel de Navegación */}
        <div
          style={{
            width: 'auto',
            minWidth: '200px',
            backgroundColor: '#f4f4f4',
            padding: '20px',
            borderRight: '1px solid #ddd',
            overflowY: 'auto',
          }}
        >
          {/* Servicios */}
          <h2>Servicios</h2>
          <ul style={{ listStyle: 'none', padding: 10 }}>
            {['BUSCAR EMPRESA', 'SUSCRIPCIÓN CONSULTA'].map((seccion) => (
              <li
                key={seccion}
                style={{
                  fontWeight: 'bold',
                  padding: '10px',
                  cursor: 'pointer',
                  backgroundColor: seccionSeleccionada === seccion ? '#ddd' : 'transparent',
                }}
                onClick={() => setSeccionSeleccionada(seccion)}
              >
                {seccion}
              </li>
            ))}
          </ul>
          
          {/* Tramites */}
          <h2>Trámites</h2>
          <ul style={{ listStyle: 'none', padding: 10 }}>
            {['CONSTITUCIÓN', 'MODIFICACIÓN', 'DISOLUCIÓN', 'MIGRACIÓN'].map((seccion) => (
              <li
                key={seccion}
                style={{
                  fontWeight: 'bold',
                  padding: '10px',
                  cursor: 'pointer',
                  backgroundColor: seccionSeleccionada === seccion ? '#ddd' : 'transparent',
                }}
                onClick={() => setSeccionSeleccionada(seccion)}
              >
                {seccion}
              </li>
            ))}
          </ul>

          
        </div>

        {/* Contenido Principal */}
        <div style={{ flex: 1, padding: '20px' }}>
          <h1>{seccionSeleccionada}</h1>
          {seccionSeleccionada !== 'BUSCAR EMPRESA' && seccionSeleccionada !== 'SUSCRIPCIÓN CONSULTA'&& (
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
              <div style={{ margin: '10px 0', fontSize: '1.2em' }}>
                <strong>{empresas.length}</strong> coincidencias encontradas.
              </div>
            </div>
          )}

          {/* Sección de Búsqueda EMPRESA */}
          {seccionSeleccionada === 'BUSCAR EMPRESA' && (
            <div style={{ marginBottom: '20px' }}>
              <h2>Ingresa tus datos</h2>
              <label>
                Nombre de empresa:
                <input
                  type="text"
                  value={nombreEmpresaFiltro}
                  onChange={(e) => setNombreEmpresaFiltro(e.target.value)}
                  style={{ marginLeft: '10px' }}
                />
              </label>
              <label style={{marginLeft: '10px'}}>
                Filtrar por fecha:
                <input
                  type="date"
                  value={fechaFiltro}
                  onChange={(e) => setFechaFiltro(e.target.value)}
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
              <label style={{ marginLeft: '10px' }}>
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
              <div style={{ margin: '10px 0', fontSize: '1.2em' }}>
                <strong>{empresas.length}</strong> coincidencias encontradas.
              </div>
            </div>
          )}

          {seccionSeleccionada === 'SUSCRIPCIÓN CONSULTA' && (
                  <div style={{ marginBottom: '20px' }}>
                    <h2>Enterate de lo que deseas.</h2>
                    <p>Recibe un correo con la informacion que necesitas, por ejemplo los tramites generados por un notario especifico
                      o datos de empresas con un capital inicial mayor a 1.000.000.000 (mil millones)!  </p>
                    <h3>Paso 1: Rellena el formulario con los datos de interés: </h3>
                    <label style={{marginLeft: '10px'}}>
                      Nombre Notario/a:
                      <input
                        type="text"
                        value={nombreNotario}
                        onChange={(e) => setNombreNotario(e.target.value)}
                        style={{ marginLeft: '10px' }}
                      />
                    </label>
                    <label style={{marginLeft: '10px'}}>
                      Capital inicial:
                      <input
                        type="text"
                        value={capitalInicial}
                        onChange={(e) => setCapitalInicial(e.target.value)}
                        style={{ marginLeft: '10px' }}
                      />
                    </label>

                    <h3>Paso 2: Ingresa tu correo:</h3>

                    <label style={{marginLeft: '10px'}}>
                      Correo:
                      <input
                        type="email"
                        value={CorreoAlert}
                        onChange={(e) => setCorreoAlert(e.target.value)}
                        style={{ marginLeft: '10px' }}
                      />
                    </label>
                    <button style={{ marginLeft: '10px'}} onClick={() => handleEnviarAlerta}>
                      Enviar 
                    </button>
                  </div>)}
         {/* Mostrar empresas */}
                <ul>

                  {empresas.map((empresa, index) => (
                    <li
                      key={index}
                      style={{
                        listStyleType: 'none',
                        marginBottom: '20px',
                        padding: '10px',
                        border: '1px solid #ddd', // Borde sutil para cada empresa
                        borderRadius: '8px', // Bordes redondeados
                        backgroundColor: '#f9f9f9', // Fondo gris claro
                        transition: 'background-color 0.3s', // Transición suave para hover
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e0f7fa'; // Cambiar el fondo al pasar el cursor
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9f9f9'; // Restaurar fondo original
                      }}
                    >
                      <div
                        style={{
                          fontWeight: seccionSeleccionada === 'BUSCAR EMPRESA' ? 'bold' : 'normal',
                          fontSize: '1.4em', // Tamaño de fuente más grande
                          color: '#007BFF', // Color llamativo para el nombre de la empresa
                          marginBottom: '10px', // Espaciado debajo del nombre
                          cursor: 'pointer', // Cursor de tipo "mano" al pasar sobre el nombre
                        }}
                      >
                        {empresa.nombre_empresa}
                      </div>
                      {seccionSeleccionada === 'BUSCAR EMPRESA' && (
                        <>
                          <div>
                            {Object.entries(empresa).map(([key, value]) => {
                              if (key === 'enlace_pdf') {
                                // Si el key es 'enlace_pdf', mostramos un enlace clickeable
                                return (
                                  <p key={key} style={{ margin: '5px 0' }}>
                                    <strong>{key.replace(/_/g, ' ')}:</strong> <a href={value} target="_blank" rel="noopener noreferrer">verPDF</a>
                                  </p>
                                );
                              } else if (key !== 'nombre_empresa' && key !== '_id') {
                                // Para los demás keys, mostramos el valor
                                return (
                                  <p key={key} style={{ margin: '5px 0' }}>
                                    <strong>{key.replace(/_/g, ' ')}:</strong> {value}
                                  </p>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

        </div>
      </div>
    </div>
  );
};

export default App;
