const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// Servir el dashboard principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Rutas de registro e inicio de sesión
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/register.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/login.html'));
});

// Archivos estáticos
app.use('/static', express.static(path.join(__dirname, '../client')));

// Importar rutas
const authRoutes = require('./routes/Auth');
const productRoutes = require('./routes/Products');
const cartRoutes = require('./routes/Cart');
const ordersRoutes = require('./routes/Orders');

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
