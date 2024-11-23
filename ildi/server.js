const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas URI
//const DB_URI = 'mongodb+srv://byronprado:hkIcDsLwt6zzvOPW@cluster0.ysq2i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_URI = 'mongodb+srv://byronprado:hkIcDsLwt6zzvOPW@cluster0.ysq2i.mongodb.net/InformaticaLegal?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((error) => console.error('Error al conectar a MongoDB Atlas:', error));

// Definición del esquema y modelo de datos
const empresaSchema = new mongoose.Schema({
  seccion: String,
  tipo: String,
  nombre_empresa: String,
  enlace_pdf: String,
  notario: String,
  CVE: String,
  capital: String,
});
const Empresa = mongoose.model('Empresa', empresaSchema,'Empresas');

// Endpoints de la API
app.get('/', (req, res) => {
  res.send('API de Backend para el proyecto ildi');
});

app.get('/api/empresas', async (req, res) => {
  try {
    const { seccion, fecha } = req.query;
    const filtros = {};

    if (seccion) filtros.seccion = seccion;
    if (fecha) filtros.fecha_consulta = fecha; // Filtrar por fecha (asegúrate de usar el formato correcto)

    const empresas = await Empresa.find(filtros); // Ajusta según tu modelo o base de datos
    res.json(empresas);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({ error: 'Error al obtener empresas' });
  }
});

app.get('/api/busqueda', async (req, res) => {
  try {
    const { seccion, fecha: fecha_consulta, tipo, nombre_empresa, CVE} = req.query;

    // Construir el objeto de filtros de acuerdo con los parámetros recibidos
    const filtros = {};

    if (seccion) filtros.seccion = seccion;
    if (fecha_consulta) filtros.fecha_consulta = fecha_consulta; // Asegúrate de que el atributo sea correcto
    if (tipo) filtros.tipo = tipo; // Filtrar por tipo de empresa
    if (nombre_empresa) filtros.nombre_empresa = { $regex: nombre_empresa, $options: 'i' }; // Búsqueda por nombre (insensible a mayúsculas/minúsculas)
    if (CVE) filtros.CVE = CVE;
    console.log('Filtros aplicados:', filtros); // Depuración de filtros
    // Buscar empresas que coincidan con los filtros
    const empresas = await Empresa.find(filtros);

    res.json(empresas); // Enviar las empresas que cumplen con los filtros
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
    res.status(500).json({ error: 'Error al realizar la búsqueda' });
  }
});



// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
