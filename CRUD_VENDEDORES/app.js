const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

// Rutas
const indexRoutes = require('./routes/index');
const vendedoresRoutes = require('./routes/vendedores');

// Inicializar app
const app = express();

// Configurar motor de plantillas
app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    año: () => new Date().getFullYear()
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware personalizado para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    mensaje: 'Ocurrió un error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Configurar rutas
app.use('/', indexRoutes);
app.use('/vendedores', vendedoresRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).render('error', { mensaje: 'Página no encontrada' });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});