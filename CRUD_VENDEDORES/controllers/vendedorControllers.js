const pool = require('../config/database'); // Import the promise pool

// 1. Listar vendedores (sp_selven)FUNCIONA
exports.listarVendedores = async (req, res) => {
    try {
        // Use await with pool.query
        const [results] = await pool.query('CALL sp_selven()');
        // results will be an array where the first element is the result set(s)
        res.render('vendedores/listar', { vendedores: results[0] });
    } catch (err) {
        console.error("Error al listar vendedores:", err);
        // Assuming you have an error view
        res.render('vendedores/error', { mensaje: 'Error al listar vendedores', error: err });
        // Or if using the error middleware: next(err);
    }
};

// 2. Buscar vendedor por ID o nombre (sp_busven)FUNCIONA
exports.buscarVendedor = async (req, res) => {
    const { id_ven, nom_ven } = req.body;

    // Intentar convertir id_ven a entero si existe, de lo contrario usar null
    const idVendedor = id_ven ? parseInt(id_ven, 10) : null;
    const nombreVendedor = nom_ven || null;

    try {
        // Use await with pool.query
        const [results] = await pool.query('CALL sp_busven(?, ?)', [idVendedor, nombreVendedor]);
         // results will be an array where the first element is the result set(s)
        res.render('vendedores/listar', { vendedores: results[0] });
    } catch (err) {
        console.error("Error al buscar vendedor:", err);
         // Assuming you have an error view
        res.render('vendedores/error', { mensaje: 'Error al buscar vendedor', error: err });
        // Or if using the error middleware: next(err);
    }
};

// 3. Insertar vendedor (sp_ingven)FUNCIONA
exports.crearVendedor = async (req, res) => {
    const { nom_ven, ape_ven, id_dis, cel_ven } = req.body;
    try {
        // Use await with pool.query
        await pool.query('CALL sp_ingven(?, ?, ?, ?)', [nom_ven, ape_ven, id_dis, cel_ven]);
        res.redirect('/vendedores'); // Redirect after successful insertion
    } catch (err) {
        console.error("Error al crear vendedor:", err);
        // Assuming you have an error view
        res.render('vendedores/error', { mensaje: 'Error al crear vendedor', error: err });
         // Or if using the error middleware: next(err);
    }
};

// 4. Modificar vendedor (sp_modven)
exports.editarVendedor = async (req, res) => {
    // Assuming the form submits id_ven in the body
    const { id_ven, nom_ven, ape_ven, id_dis, cel_ven } = req.body;
     try {
        // Use await with pool.query
        await pool.query('CALL sp_modven(?, ?, ?, ?, ?)', [id_ven, nom_ven, ape_ven, id_dis, cel_ven]);
        res.redirect('/vendedores'); // Redirect after successful update
    } catch (err) {
        console.error("Error al modificar vendedor:", err);
        // Assuming you have an error view
        res.render('vendedores/error', { mensaje: 'Error al modificar vendedor', error: err });
         // Or if using the error middleware: next(err);
    }
};

// 5. Eliminar vendedor (sp_delven)
exports.eliminarVendedor = async (req, res) => {
    const { id_ven } = req.params; // Get ID from URL parameter
     try {
        // Use await with pool.query
        await pool.query('CALL sp_delven(?)', [id_ven]);
        res.redirect('/vendedores'); // Redirect after successful deletion
    } catch (err) {
        console.error("Error al eliminar vendedor:", err);
        // Assuming you have an error view
        res.render('vendedores/error', { mensaje: 'Error al eliminar vendedor', error: err });
         // Or if using the error middleware: next(err);
    }
};