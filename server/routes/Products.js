const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Archivo JSON donde se almacenan los productos
const productsFilePath = path.join(__dirname, '../models/products.json');

// Función para leer productos del archivo JSON
function readProducts() {
    try {
        if (!fs.existsSync(productsFilePath)) {
            fs.writeFileSync(productsFilePath, JSON.stringify([]));
        }
        const data = fs.readFileSync(productsFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo products.json:', error);
        return [];
    }
}

// Función para escribir productos al archivo JSON
function writeProducts(products) {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Error al escribir en el archivo products.json:', error);
    }
}

// Ruta para agregar un nuevo producto
router.post('/add', (req, res) => {
    const { name, description, price, quantity } = req.body;

    // Validar que todos los campos están presentes
    if (!name || !description || !price || !quantity) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const products = readProducts();
    const newProduct = { id: Date.now(), name, description, price, quantity };
    products.push(newProduct);
    writeProducts(products);

    res.status(201).json({ message: 'Producto agregado exitosamente', product: newProduct });
});

// Ruta para obtener todos los productos
router.get('/list', (req, res) => {
    const products = readProducts();
    res.status(200).json({ products });
});

module.exports = router;
