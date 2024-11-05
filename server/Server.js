// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// Importar rutas
const authRoutes = require('./routes/Auth');
const productRoutes = require('./routes/Products');
const orderRoutes = require('./routes/orders');

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
