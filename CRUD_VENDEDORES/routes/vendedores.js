const express = require('express');
const router = express.Router();
const VendedorController = require('../controllers/vendedorControllers');

// Rutas para vendedores
router.get('/', VendedorController.listarVendedores);
router.get('/crear', VendedorController.mostrarFormularioCrear);
router.post('/crear', VendedorController.crearVendedor);
router.get('/editar/:id', VendedorController.mostrarFormularioEditar);
router.post('/editar/:id', VendedorController.actualizarVendedor);
router.get('/eliminar/:id', VendedorController.eliminarVendedor);
router.get('/buscar', VendedorController.buscarVendedores);

module.exports = router;