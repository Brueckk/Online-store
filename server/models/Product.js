const fs = require('fs');
const path = require('path');

// Ruta donde se almacenarán los productos
const productsFilePath = path.join(__dirname, 'products.json');

// Función para leer los productos
function readProducts() {
    if (!fs.existsSync(productsFilePath)) return [];
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
}

// Función para escribir productos
function writeProducts(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// Exporta las funciones para usarlas en Products.js
module.exports = { readProducts, writeProducts };
