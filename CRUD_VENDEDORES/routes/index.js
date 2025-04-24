const express = require('express');
const router = express.Router();

// Redirect the root URL to the vendors list
router.get('/', (req, res) => {
    res.redirect('/vendedores');
});

module.exports = router;