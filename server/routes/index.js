document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const productList = document.getElementById('product-list');
    const cartButton = document.getElementById('cartButton');
    const clientSection = document.getElementById('clientSection');
    const adminSection = document.getElementById('adminSection');

    if (!token) {
        alert('No has iniciado sesión.');
        window.location.href = '/login';
        return;
    }

    try {
        const decoded = jwt_decode(token);
        const userRole = decoded.role;

        if (userRole === 'admin') {
            clientSection.style.display = 'none';
            cartButton.style.display = 'none';
        } else if (userRole === 'client') {
            adminSection.style.display = 'none';
        }
    } catch (error) {
        console.error('Error al decodificar el token:', error);
    }

    cartButton.addEventListener('click', () => {
        window.location.href = '/client/cart.html';
    });

    function getConsistentEmoji(productId) {
        const emojis = ["🚗", "🚙", "🚕", "🚓", "🚑", "🚒", "🚌", "🚚", "🚜", "🏎️", "🚛", "🚐", "🚎"];
        return emojis[productId % emojis.length];
    }

    async function loadProducts() {
        try {
            const token = localStorage.getItem('token');
            const decoded = jwt_decode(token);
            const userRole = decoded.role;

            const response = await fetch('/api/products/list');
            const data = await response.json();

            if (response.ok) {
                const products = data.products;
                productList.innerHTML = '';

                if (products.length === 0) {
                    productList.innerHTML = '<p>No hay productos disponibles.</p>';
                } else {
                    products.forEach((product) => {
                        const productCard = document.createElement('div');
                        productCard.classList.add('product-card');
                        productCard.dataset.id = product.id;

                        const consistentEmoji = getConsistentEmoji(product.id);

                        const addToCartButton = userRole === 'client' 
                            ? `<button class="add-to-cart-button" ${product.quantity === 0 ? 'disabled' : ''}>Agregar al Carrito</button>` 
                            : '';

                        productCard.innerHTML = `
                            <div class="product-image">
                                ${consistentEmoji}
                            </div>
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-description">${product.description}</p>
                            <p class="product-price">Precio: $${product.price.toFixed(2)}</p>
                            <p class="product-quantity">Disponibles: ${product.quantity}</p>
                            ${addToCartButton}
                        `;

                        productList.appendChild(productCard);
                    });
                }
            } else {
                productList.innerHTML = `<p>Error al cargar productos: ${data.message}</p>`;
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            productList.innerHTML = '<p>Error al conectar con el servidor.</p>';
        }
    }

    await loadProducts();

    productList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart-button')) {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.id;
            const username = localStorage.getItem('username');

            if (!username) {
                alert('Debes iniciar sesión como cliente para agregar productos al carrito.');
                return;
            }

            const token = localStorage.getItem('token');

            if (!token) {
                alert('Falta el token de autorización. Por favor, inicia sesión nuevamente.');
                return;
            }

            try {
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        username,
                        productId,
                        quantity: 1,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Producto agregado al carrito correctamente.');
                    await loadProducts(); // Recargar productos para actualizar cantidades
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
                alert('Error al conectar con el servidor.');
            }
        }
    });

    const addProductButton = document.getElementById('addProductButton');
    if (addProductButton) {
        addProductButton.addEventListener('click', () => {
            window.location.href = '/client/addProduct.html';
        });
    }
});

