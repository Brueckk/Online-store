// client/js/main.js
async function loadProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = products.map(product => `
      <div>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Price: ${product.price}</p>
      </div>
    `).join('');
  }
  