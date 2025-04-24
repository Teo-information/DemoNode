const VendedorModel = require('../models/vendedor');
// ASUMO que tienes (o crearás) un modelo para manejar los distritos
// const DistritoModel = require('../models/distrito');

class VendedorController {
    // Mostrar todos los vendedores
    static async listarVendedores(req, res) {
        try {
            // Asumiendo que obtenerTodos también trae la información del distrito para mostr
            const vendedores = await VendedorModel.obtenerTodos();
            res.render('vendedores/listar', { vendedores });
        } catch (error) {
            console.error('Error en controlador al listar vendedores:', error);
            res.status(500).render('error', { mensaje: 'Error al obtener la lista de vendedores' });
        }
    }

    // Mostrar formulario para crear vendedor
    static async mostrarFormularioCrear(req, res) {
        try {
            // *** MODIFICACIÓN AQUÍ: Obtener la lista de distritos ***
            // Necesitas un método en tu modelo (VendedorModel o DistritoModel)
            // para obtener todos los distritos.
            const distritos = await VendedorModel.obtenerDistritos(); // O await DistritoModel.obtenerTodos();

            res.render('vendedores/crear', { distritos }); // Pasar los distritos a la vista
        } catch (error) {
            console.error('Error en controlador al mostrar formulario para crear:', error);
            res.status(500).render('error', { mensaje: 'Error al cargar el formulario de creación de vendedor' });
        }
    }

    // Procesar la creación de un vendedor
    static async crearVendedor(req, res) {
        try {
            // *** MODIFICACIÓN AQUÍ: Capturar apellido e id_distrito y mapear a columnas de la tabla ***
            const nuevoVendedor = {
                nom_ven: req.body.nombre, // Mapea 'nombre' del formulario a 'nom_ven'
                ape_ven: req.body.apellido, // Captura 'apellido' del formulario (NECESITA AGREGARSE AL FORMULARIO)
                id_dis: req.body.id_distrito, // Captura 'id_distrito' del formulario (NECESITA AGREGARSE AL FORMULARIO)
                cel_ven: req.body.telefono, // Mapea 'telefono' del formulario a 'cel_ven'
                // 'direccion' y 'email' se eliminan ya que no están en la tabla Vendedores
            };

            // *** Consideración sobre el error 'Data too long' ***
            // Aunque aquí capturamos el teléfono, el error indica que el VALOR específico
            // que se intenta insertar en la base de datos es el problema.
            // Asegúrate de que req.body.telefono no tenga más de 9 caracteres si mantienes CHAR(9),
            // o modifica la columna a VARCHAR(20) o más en la base de datos como sugerí antes.
            console.log("Datos del nuevo vendedor a enviar al modelo:", nuevoVendedor); // Opcional: para depurar

            await VendedorModel.crear(nuevoVendedor);
            res.redirect('/vendedores');
        } catch (error) {
            console.error('Error en controlador al crear vendedor:', error);
            // Puedes intentar pasar los datos que el usuario ingresó para que no los pierda en caso de error
            res.status(500).render('error', {
                mensaje: 'Error al crear el vendedor',
                // Opcional: pasar datos para rellenar el formulario en caso de error
                // datosAnteriores: req.body
            });
        }
    }

    // Mostrar formulario para editar vendedor
    static async mostrarFormularioEditar(req, res) {
        try {
            const id = req.params.id;
            // Asumiendo que obtenerPorId también trae la información del distrito si la necesitas
            const vendedor = await VendedorModel.obtenerPorId(id);

            if (!vendedor) {
                return res.status(404).render('error', { mensaje: 'Vendedor no encontrado' });
            }

            // *** MODIFICACIÓN AQUÍ: Obtener la lista de distritos también para el formulario de edición ***
            const distritos = await VendedorModel.obtenerDistritos(); // O await DistritoModel.obtenerTodos();


            res.render('vendedores/editar', { vendedor, distritos }); // Pasar distritos a la vista de edición
        } catch (error) {
            console.error('Error en controlador al mostrar formulario de edición:', error);
            res.status(500).render('error', { mensaje: 'Error al obtener datos del vendedor' });
        }
    }

    // Procesar la actualización de un vendedor
    static async actualizarVendedor(req, res) {
        try {
            const id = req.params.id;
            // *** MODIFICACIÓN AQUÍ: Capturar apellido e id_distrito y mapear a columnas de la tabla ***
            const datosActualizados = {
                nom_ven: req.body.nombre, // Mapea 'nombre' del formulario a 'nom_ven'
                ape_ven: req.body.apellido, // Captura 'apellido' del formulario (NECESITA AGREGARSE AL FORMULARIO)
                id_dis: req.body.id_distrito, // Captura 'id_distrito' del formulario (NECESITA AGREGARSE AL FORMULARIO)
                cel_ven: req.body.telefono, // Mapea 'telefono' del formulario a 'cel_ven'
                // 'direccion' y 'email' se eliminan ya que no están en la tabla Vendedores
            };

            await VendedorModel.actualizar(id, datosActualizados);
            res.redirect('/vendedores');
        } catch (error) {
            console.error('Error en controlador al actualizar vendedor:', error);
            res.status(500).render('error', { mensaje: 'Error al actualizar el vendedor' });
        }
    }

    // Eliminar un vendedor
    static async eliminarVendedor(req, res) {
        try {
            const id = req.params.id;
            await VendedorModel.eliminar(id);
            res.redirect('/vendedores');
        } catch (error) {
            console.error('Error en controlador al eliminar vendedor:', error);
            res.status(500).render('error', { mensaje: 'Error al eliminar el vendedor' });
        }
    }

    // Buscar vendedores
    static async buscarVendedores(req, res) {
        try {
            const termino = req.query.termino;
             // Asumiendo que el método buscar también considera el distrito si es relevante
            const vendedores = await VendedorModel.buscar(termino);
            res.render('vendedores/listar', { vendedores, termino });
        } catch (error) {
            console.error('Error en controlador al buscar vendedores:', error);
            res.status(500).render('error', { mensaje: 'Error al buscar vendedores' });
        }
    }
}

module.exports = VendedorController;