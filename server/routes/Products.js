// server/routes/products.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.post('/', (req, res) => {
  const newProduct = req.body;
  Product.addProduct(newProduct);
  res.status(201).json({ message: 'Product added' });
});

router.get('/', (req, res) => {
  res.json(Product.getAllProducts());
});

module.exports = router;
