const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorControllers');

// GET /vendedores - List all vendors
router.get('/', vendedorController.listarVendedores);

// GET /vendedores/crear - Show form to create a new vendor
// We need a route to display the form. The controller function will likely just render the 'crear' view.
router.get('/crear', (req, res) => {
    // You might need to fetch districts to populate a dropdown in the form
    // If so, add a controller function for this or fetch them here.
    res.render('vendedores/crear');
});


// POST /vendedores/crear - Handle form submission for creating a vendor
router.post('/crear', vendedorController.crearVendedor);

// Note: For editing and deleting, we need routes that include the vendor ID.
// We'll add routes to show the edit form and handle the update/delete actions.

// GET /vendedores/editar/:id - Show form to edit a vendor
// This requires fetching the specific vendor's data
router.get('/editar/:id', (req, res) => {
    const vendedorId = req.params.id;
    // You need a controller function or inline logic here
    // to fetch the vendor by ID using sp_busven and render the 'editar' view with the data.

    // Example (assuming you add a getVendedorById function in controller or handle it here):
    const pool = require('../config/database'); // Re-import pool if handling inline
    pool.query('CALL sp_busven(?, NULL)', [vendedorId], (err, results) => {
        if (err) {
            console.error(err);
            return res.render('vendedores/error', { mensaje: 'Error al cargar datos del vendedor para edición' });
        }
        if (results[0].length === 0) {
            return res.render('vendedores/error', { mensaje: 'Vendedor no encontrado' });
        }
        // Assuming sp_busven returns an array, take the first result
        const vendedor = results[0][0];
         // You might also need to fetch districts here for a dropdown
        res.render('vendedores/editar', { vendedor: vendedor });
    });
});


// POST /vendedores/editar - Handle form submission for updating a vendor
// The form will likely submit the ID as a hidden input or part of the body
router.post('/editar', vendedorController.editarVendedor);


// POST /vendedores/buscar - Handle form submission for searching
// The controller already handles rendering the list view with search results
router.post('/buscar', vendedorController.buscarVendedor);


// POST /vendedores/eliminar/:id - Handle deletion of a vendor
// Although DELETE is an HTTP method, POST is often used for simple forms or links
router.post('/eliminar/:id', vendedorController.eliminarVendedor);


module.exports = router;