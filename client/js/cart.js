document.addEventListener('DOMContentLoaded', async () => {
    const cartList = document.getElementById('cart-list');
    const backButton = document.getElementById('backButton');

    // Cargar productos del carrito
    try {
        const username = localStorage.getItem('username'); // Identificar al usuario actual
        if (!username) {
            cartList.innerHTML = '<p>Debes iniciar sesión para ver tu carrito.</p>';
            return;
        }

        const response = await fetch('/api/cart/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();

        if (response.ok) {
            const products = data.products;

            if (products.length === 0) {
                cartList.innerHTML = '<p>Tu carrito está vacío.</p>';
            } else {
                products.forEach((product) => {
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');

                    cartItem.innerHTML = `
                        <h3>${product.name}</h3>
                        <p>Cantidad: ${product.quantity}</p>
                        <p>Precio: $${(product.price * product.quantity).toFixed(2)}</p>
                    `;

                    cartList.appendChild(cartItem);
                });
            }
        } else {
            cartList.innerHTML = `<p>Error al cargar el carrito: ${data.message}</p>`;
        }
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        cartList.innerHTML = '<p>Error al conectar con el servidor.</p>';
    }

    // Regresar a la página principal
    backButton.addEventListener('click', () => {
        window.location.href = '/static/index.html';
    });
});
