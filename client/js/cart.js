document.addEventListener('DOMContentLoaded', async () => {
    const cartList = document.getElementById('cart-list');
    const backButton = document.getElementById('backButton');
    const checkoutButton = document.getElementById('checkoutButton');
    const resultDiv = document.getElementById('result'); // Mostrar el resultado de la compra

    // Cargar productos del carrito
    try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(atob(token.split('.')[1])); // Decodificar payload del JWT
        const username = user.username;

        if (!token) {
            cartList.innerHTML = '<p>Debes iniciar sesión para ver tu carrito.</p>';
            return;
        }

        const response = await fetch('/api/cart/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
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
                        <p>Total: $${(product.price * product.quantity).toFixed(2)}</p>
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

    // Manejar clic en "Realizar Compra"
    checkoutButton.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(atob(token.split('.')[1]));
            const username = user.username;

            const response = await fetch('/api/orders/createInvoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username }), // Usar el nombre de usuario dinámico
            });

            const data = await response.json();

            if (response.ok) {
                // Crear el diseño visual de la factura
                const invoice = data.invoice;
                resultDiv.innerHTML = `
                    <h3>Factura Generada</h3>
                    <p><strong>ID de la factura:</strong> ${invoice.id}</p>
                    <p><strong>Usuario:</strong> ${invoice.username}</p>
                    <p><strong>Fecha:</strong> ${new Date(invoice.createdAt).toLocaleString()}</p>
                    <h4>Detalles de los productos:</h4>
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items
                                .map(
                                    (item) => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.quantity}</td>
                                        <td>$${item.price.toLocaleString()}</td>
                                        <td>$${item.total.toLocaleString()}</td>
                                    </tr>
                                `
                                )
                                .join('')}
                        </tbody>
                    </table>
                    <h4><strong>Total de la Factura:</strong> $${invoice.total.toLocaleString()}</h4>
                `;
                cartList.innerHTML = '<p>Tu carrito está vacío.</p>'; // Vaciar el carrito en la interfaz
            } else {
                resultDiv.textContent = `Error al realizar la compra: ${data.message}`;
            }
        } catch (error) {
            console.error('Error al realizar la compra:', error);
            resultDiv.textContent = 'Error al conectar con el servidor.';
        }
    });

    // Manejar clic en "Atrás"
    backButton.addEventListener('click', () => {
        window.location.href = '/client/index.html'; // Redirige a la página principal
    });
});
