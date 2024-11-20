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
const DB_URI = 'mongodb+srv://byronprado:hkIcDsLwt6zzvOPW@cluster0.ysq2i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
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
const Empresa = mongoose.model('Empresa', empresaSchema);

// Endpoints de la API
app.get('/', (req, res) => {
  res.send('API de Backend para el proyecto ildi');
});

app.get('/api/empresas', async (req, res) => {
  try {
      const empresas = await Empresa.find(); // Obtiene todas las empresas de MongoDB
      res.json(empresas); // Envía los datos como JSON
  } catch (error) {
      console.error('Error al obtener las empresas:', error);
      res.status(500).send('Error al obtener las empresas');
  }
});

// Endpoint para agregar una nueva empresa
app.post('/api/empresas', async (req, res) => {
  try {
    const nuevaEmpresa = new Empresa(req.body);
    const empresaGuardada = await nuevaEmpresa.save();
    res.status(201).json(empresaGuardada);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la empresa' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});