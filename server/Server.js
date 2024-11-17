// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const path = require('path');

app.use(bodyParser.json());

// Sirve el dashboard desde la carpeta "public" para la ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Configura la carpeta "client" para servir los archivos de registro e inicio de sesión
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/login.html'));
});

// Sirve los archivos estáticos de "client" para recursos específicos
app.use('/static', express.static(path.join(__dirname, '../client')));

// Importar rutas
const authRoutes = require('./routes/Auth');
const productRoutes = require('./routes/Products');
//const orderRoutes = require('./routes/Orders.js');
const cartRoutes = require('./routes/Cart');




// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
//app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenido a la Tienda en Línea');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
