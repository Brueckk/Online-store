const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const cartsFilePath = path.join(__dirname, '../models/carts.json');
const productsFilePath = path.join(__dirname, '../models/products.json');
const invoicesFilePath = path.join(__dirname, '../models/invoices.json');

// Function to read JSON files
function readFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
}

// Function to write JSON files
function writeFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
    }
}

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

    const invoiceItems = [];
    let total = 0;

    for (const cartItem of userCart.products) {
        const productIndex = products.findIndex(p => p.id == cartItem.productId);
        if (productIndex === -1) continue; // Skip if product not found

        const product = products[productIndex];
        if (product.quantity < cartItem.quantity) {
            return res.status(400).json({ message: `No hay suficiente stock de ${product.name}` });
        }

        // Update product quantity
        product.quantity -= cartItem.quantity; // Cambiado de product.quantity -= cartItem.quantity
        invoiceItems.push({
            name: product.name,
            price: product.price,
            quantity: cartItem.quantity,
            total: product.price * cartItem.quantity,
        });

        total += product.price * cartItem.quantity;

        // Remove product if out of stock
        if (product.quantity === 0) {
            products.splice(productIndex, 1);
        }
    }

    const newInvoice = {
        id: invoices.length + 1,
        username,
        items: invoiceItems,
        total,
        createdAt: new Date(),
    };

    invoices.push(newInvoice);
    writeFile(invoicesFilePath, invoices);
    writeFile(productsFilePath, products); // Update products file

    // Clear user's cart
    const userCartIndex = carts.findIndex(cart => cart.username === username);
    if (userCartIndex !== -1) {
        carts[userCartIndex].products = [];
        writeFile(cartsFilePath, carts);
    }

    res.status(201).json({ message: 'Factura creada exitosamente.', invoice: newInvoice });
});

module.exports = router;

