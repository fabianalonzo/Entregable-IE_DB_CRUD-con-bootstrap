const express = require('express');
require('dotenv').config(); // <-- ¡IMPORTANTE!

// Actualización para desplegar el FRONT-END
const cors = require('cors'); // Permisos sobre el contenido a desplegar
const path = require('path'); // Express servir el frontend

// Rutas
const docenteRoutes = require('./routes/docenteRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const subCategoriaRoutes = require('./routes/subCategoriaRoutes');
const cursoRoutes = require('./routes/cursoRoutes');

const app = express();
const PORT = process.env.PORT || 3000; // Puerto de la App

// Permisos CORS
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// Servir los documentos HTML, CSS, JS
app.use(express.static(path.join(__dirname, 'public')));

// http://localhost:3000 -> public/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Comunicación en formato JSON
app.use(express.json());

// Registrar rutas
app.use('/api/docente', docenteRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/subcategoria', subCategoriaRoutes);
app.use('/api/curso', cursoRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en: http://localhost:${PORT}`);
});
