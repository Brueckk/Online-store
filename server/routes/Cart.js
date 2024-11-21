const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'your_secure_jwt_secret_key';
const cartsFilePath = path.join(__dirname, '../models/carts.json');
const productsFilePath = path.join(__dirname, '../models/products.json');

function checkUserRole(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No tienes autorización' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.role !== 'client') { // Permite solo a clientes continuar
            return res.status(403).json({ message: 'El rol de administrador no tiene acceso al carrito' });
        }
        req.user = decoded; // Guarda el usuario autenticado para el siguiente middleware
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token inválido' });
    }
}


// Función para manejar la lectura de archivos JSON
function readFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([])); // Crear archivo vacío si no existe
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        return data ? JSON.parse(data) : [];
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

router.post('/add', checkUserRole, (req, res) => {
    const { productId, quantity } = req.body;
    const username = req.user.username; // Usuario autenticado

    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const carts = readFile(cartsFilePath);
    let userCart = carts.find(cart => cart.username === username);

    if (!userCart) {
        userCart = { username, products: [] };
        carts.push(userCart);
    }

    const productInCart = userCart.products.find(product => product.productId === productId);

    if (productInCart) {
        productInCart.quantity += quantity;
    } else {
        userCart.products.push({ productId, quantity });
    }

    writeFile(cartsFilePath, carts);
    res.status(201).json({ message: 'Producto agregado al carrito correctamente' });
});



// Ruta para listar los productos del carrito
router.post('/list', checkUserRole, (req, res) => {
    const username = req.user.username; // Usuario autenticado
    const carts = readFile(cartsFilePath);
    const products = readFile(productsFilePath);

    const userCart = carts.find(cart => cart.username === username);

    if (!userCart || userCart.products.length === 0) {
        return res.status(200).json({ products: [] });
    }

    const enrichedProducts = userCart.products.map(cartItem => {
        const productDetails = products.find(product => product.id === parseInt(cartItem.productId, 10));
        return {
            name: productDetails?.name || 'Producto no encontrado',
            price: productDetails?.price || 0,
            quantity: cartItem.quantity,
            total: productDetails ? (productDetails.price * cartItem.quantity).toFixed(2) : '0.00',
        };
    });

    res.status(200).json({ products: enrichedProducts });
});


module.exports = router;
