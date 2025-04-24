// Middleware para capturar y manejar errores
module.exports = (err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);
    
    res.status(err.statusCode || 500).render('error', {
      mensaje: err.message || 'Ocurrió un error en el servidor',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  };