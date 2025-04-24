const pool = require('../config/database');

class VendedorModel {
    // Obtener todos los vendedores con nombre de distrito
    static async obtenerTodos() {
        try {
            // Usamos una consulta SELECT directa con JOIN para incluir el nombre del distrito
            // porque sp_selven con filtro 'todos' no devuelve el nombre del distrito.
            const [vendedores] = await pool.query(`
                SELECT
                    v.id_ven,
                    v.nom_ven,
                    v.ape_ven,
                    v.cel_ven,
                    v.id_dis,
                    d.nom_dis  -- Seleccionamos el nombre del distrito
                FROM Vendedores v
                JOIN Distritos d ON v.id_dis = d.id_dis
            `);
            return vendedores;
        } catch (error) {
            console.error('Error al obtener vendedores:', error);
            throw error;
        }
    }
////////////////
    // Obtener un vendedor por ID con nombre de distrito usando procedimiento almacenado
    static async obtenerPorId(id) {
      try {
          // Llamamos al procedimiento almacenado sp_busven con el ID
          const [vendedor] = await pool.query('CALL sp_busven(?)', [id]);

          // *** NOTA: La forma en que se accede al resultado aquí es correcta
          // para un procedimiento que devuelve un conjunto de resultados simple.
          // Accede al primer conjunto de resultados ([0]) y a la primera fila ([0]).
          return vendedor[0][0];
      } catch (error) {
          // *** AQUÍ se captura el error señalado por el procedimiento almacenado ***
          console.error(`Error al obtener vendedor con ID ${id}:`, error);
          throw error; // Relanzamos el error para que lo maneje el controlador
      }
  }
//////////////
    // Crear un nuevo vendedor usando procedimiento almacenado
    static async crear(vendedor) {
        try {
            // *** MODIFICACIÓN AQUÍ: Pasamos los parámetros correctos a sp_ingven ***
            // El objeto 'vendedor' debe tener las propiedades: nom_ven, ape_ven, id_dis, cel_ven
            const [resultado] = await pool.query('CALL sp_ingven(?, ?, ?, ?)', [
                vendedor.nom_ven,
                vendedor.ape_ven,
                vendedor.id_dis,
                vendedor.cel_ven
            ]);
             // sp_ingven devuelve LAST_INSERT_ID()
            return resultado[0][0]; // Accedemos al resultado del procedimiento
        } catch (error) {
            console.error('Error al crear vendedor:', error);
            throw error;
        }
    }
///////////////
    // Actualizar un vendedor existente usando procedimiento almacenado
    static async actualizar(id, vendedor) {
        try {
            // *** MODIFICACIÓN AQUÍ: Pasamos los parámetros correctos a sp_modven ***
            // El objeto 'vendedor' debe tener las propiedades: nom_ven, ape_ven, id_dis, cel_ven
            const [resultado] = await pool.query('CALL sp_modven(?, ?, ?, ?, ?)', [
                id, // El ID del vendedor a actualizar
                vendedor.nom_ven,
                vendedor.ape_ven,
                vendedor.id_dis,
                vendedor.cel_ven
            ]);
             // sp_modven devuelve ROW_COUNT()
            return resultado[0][0]; // Accedemos al resultado del procedimiento
        } catch (error) {
            console.error(`Error al actualizar vendedor con ID ${id}:`, error);
            throw error;
        }
    }
////////////////////
    // Eliminar un vendedor usando procedimiento almacenado
    static async eliminar(id) {
      try {
          // Usando el procedimiento almacenado sp_delven
          const [resultado] = await pool.query('CALL sp_delven(?)', [id]);
          // sp_delven devuelve ROW_COUNT() como 'filas_eliminadas'

          // *** MODIFICACIÓN AQUÍ: Accedemos al resultado por el nombre de la columna ***
          // El resultado es un array de conjuntos de resultados.
          // El primer conjunto de resultados ([0]) contiene las filas de la sentencia SELECT.
          // La primera fila de ese conjunto es [0].
          // Esa fila es un objeto con la columna 'filas_eliminadas'.
          return resultado[0][0].filas_eliminadas;

      } catch (error) {
          // Captura el error señalado por el procedimiento si el vendedor no existe
          console.error(`Error al eliminar vendedor con ID ${id}:`, error);
          throw error; // Relanza el error
      }
  }
/////////////////////  
    // Buscar vendedores usando procedimiento almacenado sp_selven
    // Este método ahora necesita el término de búsqueda y el tipo de filtro
    static async buscar(termino, tipoFiltro = 'nombre') { // Añadimos un tipo de filtro por defecto
        try {
            // *** MODIFICACIÓN AQUÍ: Usamos el procedimiento almacenado sp_selven ***
            // sp_selven recibe p_filtro y p_tipo_filtro ('id', 'nombre', 'apellido', 'todos')
            const [vendedores] = await pool.query('CALL sp_selven(?, ?)', [termino, tipoFiltro]);

            // *** NOTA: sp_selven no incluye el nombre del distrito. Si lo necesitas,
            // deberás modificar el procedimiento almacenado sp_selven para que lo incluya en sus SELECTs. ***

            // sp_selven devuelve el resultado en el primer elemento del array
            return vendedores[0];
        } catch (error) {
            console.error(`Error al buscar vendedores con término "${termino}" y filtro "${tipoFiltro}":`, error);
            throw error;
        }
    }

    // Obtener todos los distritos (sin usar procedimiento almacenado)
    static async obtenerDistritos() {
        try {
            const [distritos] = await pool.query('SELECT id_dis, nom_dis FROM Distritos');
            return distritos;
        } catch (error) {
            console.error('Error al obtener distritos:', error);
            throw error;
        }
    }
}

module.exports = VendedorModel;