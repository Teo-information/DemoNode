const express = require('express');
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
  res.render('index', { titulo: 'Sistema de Gestión de Vendedores' });
});

module.exports = router;