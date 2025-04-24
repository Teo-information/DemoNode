const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const vendedorRoutes = require('./routes/vendedores'); // Import vendor routes
const database = require('./config/database'); // Import database connection (optional, but good for clarity)

const app = express();

// --- Middleware Configuration ---
// Body-parser to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- View Engine Configuration (Handlebars) ---
app.engine('handlebars', hbs.engine({
    defaultLayout: 'main', // Set the default layout file
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials') // If you use partials
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// --- Routes ---
// Use the vendor routes
app.use('/vendedores', vendedorRoutes);

// Optional: A root route that redirects to the vendor list
app.get('/', (req, res) => {
    res.redirect('/vendedores');
});

// --- Error Handling (Basic) ---
// This is a simple catch-all for 404 errors
app.use((req, res, next) => {
    res.status(404).send("Sorry, couldn't find that!");
});

// You could add more sophisticated error handling middleware here
// For example, using the errorHandler.js file if you develop it.
/*
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);
*/


// --- Server Start ---
const PORT = process.env.PORT || 3000; // Use port 3000 or a port from environment variables
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Optional: Test database connection on server start
    // database.testConnection(); // Make sure testConnection is accessible or call it here
});

// Optional: You might want to handle graceful shutdown later
// process.on('SIGINT', () => {
//     console.log('Shutting down server...');
//     pool.end(); // Close database pool connections
//     process.exit();
// });