const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Rutas de los archivos JSON
const cartsFilePath = path.join(__dirname, '../models/carts.json');
const productsFilePath = path.join(__dirname, '../models/products.json');

// Función para leer archivos JSON
function readFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([])); // Crear archivo vacío si no existe
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        return data ? JSON.parse(data) : []; // Retornar un array vacío si el archivo está vacío
    } catch (error) {
        console.error(`Error al leer el archivo ${filePath}:`, error);
        return [];
    }
}

// Función para escribir en archivos JSON
function writeFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error al escribir en el archivo ${filePath}:`, error);
    }
}

// Ruta para agregar un producto al carrito
router.post('/add', (req, res) => {
    const { username, productId, quantity } = req.body;

    if (!username || !productId || !quantity) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const carts = readFile(cartsFilePath);
    let userCart = carts.find(cart => cart.username === username);

    // Si no existe el carrito del usuario, crear uno nuevo
    if (!userCart) {
        userCart = { username, products: [] };
        carts.push(userCart);
    }

    // Verificar si el producto ya está en el carrito
    const productInCart = userCart.products.find(product => product.productId === productId);

    if (productInCart) {
        // Si el producto ya existe, actualizamos la cantidad
        productInCart.quantity += quantity;
    } else {
        // Si no existe, lo agregamos al carrito
        userCart.products.push({ productId, quantity });
    }

    writeFile(cartsFilePath, carts);

    res.status(201).json({ message: 'Producto agregado al carrito correctamente' });
});

// Ruta para listar los productos del carrito con detalles completos
router.post('/list', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Nombre de usuario requerido' });
    }

    const carts = readFile(cartsFilePath);
    const products = readFile(productsFilePath); // Leer los productos originales

    // Buscar el carrito del usuario
    const userCart = carts.find(cart => cart.username === username);

    if (!userCart || userCart.products.length === 0) {
        return res.status(200).json({ products: [] });
    }

    // Enriquecer los productos del carrito con los detalles del producto original
    const enrichedProducts = userCart.products.map(cartItem => {
        const productDetails = products.find(product => product.id === parseInt(cartItem.productId, 10)); // Asegurarse de que el tipo sea consistente
        if (productDetails) {
            return {
                name: productDetails.name,
                price: productDetails.price,
                quantity: cartItem.quantity,
                total: (productDetails.price * cartItem.quantity).toFixed(2), // Calcular el precio total
            };
        } else {
            console.warn(`Producto no encontrado: productId=${cartItem.productId}`);
            return {
                name: 'Producto no encontrado',
                price: 0,
                quantity: cartItem.quantity,
                total: '0.00',
            };
        }
    });

    res.status(200).json({ products: enrichedProducts });
});


module.exports = router;
