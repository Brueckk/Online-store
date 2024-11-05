// server/models/Product.js
const fs = require('fs');
const path = './data/products.json';

class Product {
  static getAllProducts() {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  static addProduct(newProduct) {
    const products = Product.getAllProducts();
    products.push(newProduct);
    fs.writeFileSync(path, JSON.stringify(products));
  }
}
module.exports = Product;
