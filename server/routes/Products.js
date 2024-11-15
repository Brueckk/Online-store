const express = require('express');
const router = express.Router();
const { readProducts, writeProducts } = require('../models/Product');

// Ruta para obtener todos los productos
router.get('/', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// Ruta para agregar un nuevo producto
router.post('/add', (req, res) => {
    const products = readProducts();
    const newProduct = req.body;
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json({ message: 'Product added successfully' });
});

module.exports = router;
