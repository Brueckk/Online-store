const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const cartsFilePath = path.join(__dirname, '../models/carts.json');
const productsFilePath = path.join(__dirname, '../models/products.json');
const invoicesFilePath = path.join(__dirname, '../models/invoices.json');

// Función para manejar la lectura de archivos JSON
function readFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([])); // Crear archivo vacío si no existe
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error(`Error al leer el archivo ${filePath}:`, error);
        return [];
    }
}

// Función para manejar la escritura en archivos JSON
function writeFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error al escribir en el archivo ${filePath}:`, error);
    }
}

// Ruta para generar una factura
router.post('/createInvoice', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'El nombre de usuario es obligatorio.' });
    }

    const carts = readFile(cartsFilePath);
    const products = readFile(productsFilePath);
    const invoices = readFile(invoicesFilePath);

    const userCart = carts.find(cart => cart.username === username);

    if (!userCart || userCart.products.length === 0) {
        return res.status(400).json({ message: 'El carrito está vacío o no existe.' });
    }

    const invoiceItems = userCart.products
        .map(cartItem => {
            const productDetails = products.find(p => p.id == cartItem.productId);
            if (!productDetails) return null; // Ignorar productos inexistentes
            return {
                name: productDetails.name,
                price: productDetails.price,
                quantity: cartItem.quantity,
                total: productDetails.price * cartItem.quantity,
            };
        })
        .filter(item => item !== null);

    const total = invoiceItems.reduce((sum, item) => sum + item.total, 0);

    const newInvoice = {
        id: invoices.length + 1,
        username,
        items: invoiceItems,
        total,
        createdAt: new Date(),
    };

    invoices.push(newInvoice);
    writeFile(invoicesFilePath, invoices);

    // Vaciar el carrito del usuario
    const userCartIndex = carts.findIndex(cart => cart.username === username);
    if (userCartIndex !== -1) {
        carts[userCartIndex].products = []; // Vaciar el carrito
        writeFile(cartsFilePath, carts); // Guardar cambios en carts.json
    }

    res.status(201).json({ message: 'Factura creada exitosamente.', invoice: newInvoice });
});

module.exports = router;
