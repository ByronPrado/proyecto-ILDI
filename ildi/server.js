const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas URI
//const DB_URI = 'mongodb+srv://byronprado:hkIcDsLwt6zzvOPW@cluster0.ysq2i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_URI = 'mongodb+srv://byronprado:hkIcDsLwt6zzvOPW@cluster0.ysq2i.mongodb.net/InformaticaLegal?retryWrites=true&w=majority&appName=Cluster0';
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usa el servicio de correo (por ejemplo, Gmail)
  auth: {
    user: 'ildiprueba356@gmail.com', // Reemplaza con tu correo
    pass: 'Prueba2024', // Usa una contraseña de aplicación (no la contraseña normal)
  },
});
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
    const { seccion,fecha_consulta, tipo, nombre_empresa, CVE} = req.query;

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

// Endpoint para enviar correos electrónicos
app.post('/api/enviar-alerta', async (req, res) => {
  const { email, notario, capitalMinimo } = req.body; // Recibe filtros desde el frontend

  try {
    // Construir el objeto de filtros dinámicos
    const filtros = {};
    if (notario) filtros.notario = notario; // Filtrar por nombre del notario
    if (capitalMinimo) filtros.capital = { $gte: parseFloat(capitalMinimo) }; // Capital mayor o igual al especificado

    // Consultar MongoDB con los filtros
    const empresasFiltradas = await Empresa.find(filtros);

    if (empresasFiltradas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron empresas con los criterios especificados' });
    }

    // Crear el cuerpo del correo
    const contenidoCorreo = empresasFiltradas
      .map(
        (empresa) =>
          `- Nombre Empresa: ${empresa.nombre_empresa}\n  Notario: ${empresa.notario}\n  Capital: ${empresa.capital}\n`
      )
      .join('\n');

    // Configurar transporte nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Cambia según el proveedor
      auth: {
        user: 'ildiprueba356@gmail.com',
        pass: 'tu-contraseña-app', // Contraseña de aplicación de Gmail
      },
    });

    // Configurar detalles del correo
    const mailOptions = {
      from: 'ildiprueba356@gmail.com',
      to: email,
      subject: 'Empresas Filtradas - Alerta ILDI',
      text: `Hola,

Se han encontrado las siguientes empresas con los filtros aplicados:

${contenidoCorreo}

Gracias por usar nuestros servicios.
      `,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar la alerta:', error);
    res.status(500).json({ error: 'Error al enviar la alerta' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
