// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace

  // Determine status code (default to 500 Internal Server Error)
  const status = err.status || 500;

  // Render the error view
  res.status(status).render('vendedores/error', {
      mensaje: err.message || 'Ocurrió un error inesperado.'
      // You could pass more error details here for debugging (in development)
      // error: process.env.NODE_ENV === 'development' ? err : {}
  });
};