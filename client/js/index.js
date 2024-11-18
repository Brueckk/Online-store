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
            // Ocultar secciones de cliente y carrito
            clientSection.style.display = 'none';
            cartButton.style.display = 'none';
        } else if (userRole === 'client') {
            // Mostrar secciones de cliente
            adminSection.style.display = 'none';
        }
    } catch (error) {
        console.error('Error al decodificar el token:', error);
    }

    // Redirigir al carrito
    cartButton.addEventListener('click', () => {
        window.location.href = '/static/cart.html';
    });

    try {
        // Obtener el rol del usuario desde el token almacenado
        const token = localStorage.getItem('token');
        let userRole = null;
    
        if (token) {
            const decoded = jwt_decode(token);
            userRole = decoded.role; // Obtenemos el rol del usuario
        }
    
        // Cargar lista de productos
        const response = await fetch('/api/products/list');
        const data = await response.json();
    
        if (response.ok) {
            const products = data.products;
    
            if (products.length === 0) {
                productList.innerHTML = '<p>No hay productos disponibles.</p>';
            } else {
                const emojis = ["🚗", "🚙", "🚕", "🚓", "🚑", "🚒", "🚌", "🚚", "🚜", "🏎️", "🚛", "🚐", "🚎"];
                // Generar el HTML para cada producto
                products.forEach((product) => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.dataset.id = product.id; // Asegúrate de que el ID del producto esté disponible
    
                    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

                    // Botón "Agregar al Carrito" solo para clientes
                    const addToCartButton = userRole === 'client' 
                        ? `<button class="add-to-cart-button">Agregar al Carrito</button>` 
                        : '';
    
                    productCard.innerHTML = `
                        <div class="product-image">
                            ${randomEmoji}
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

        // Evento para manejar clic en "Agregar al Carrito"
        productList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('add-to-cart-button')) {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.id;
                const username = localStorage.getItem('username'); // Suponiendo que el usuario está autenticado

                if (!username) {
                    alert('Debes iniciar sesión como cliente para agregar productos al carrito.');
                    return;
                }

                try {
                    const response = await fetch('/api/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username,
                            productId,
                            quantity: 1, // Por defecto, se agrega una unidad
                        }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert('Producto agregado al carrito correctamente.');
                    } else {
                        alert(`Error: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Error al agregar producto al carrito:', error);
                    alert('Error al conectar con el servidor.');
                }
            }
        });

        // Lógica del botón para agregar productos (solo para administradores)
        addProductButton.addEventListener('click', () => {
            const formHtml = `
                <div class="add-product-form-container">
                    <h3>Agregar Nuevo Producto</h3>
                    <form id="addProductForm">
                        <input type="text" id="productName" placeholder="Nombre del producto" required>
                        <textarea id="productDescription" placeholder="Descripción" required></textarea>
                        <input type="number" id="productPrice" placeholder="Precio" required>
                        <input type="number" id="productQuantity" placeholder="Cantidad disponible" required>
                        <div class="button-container">
                            <button type="submit" class="button-primary">Agregar</button>
                            <button type="button" class="button-secondary" id="backButton">Atrás</button>
                        </div>
                    </form>
                    <p id="addProductMessage"></p>
                </div>
            `;

            // Mostrar el formulario de agregar producto
            document.body.insertAdjacentHTML('beforeend', formHtml);

            const addProductForm = document.getElementById('addProductForm');
            const addProductMessage = document.getElementById('addProductMessage');
            const backButton = document.getElementById('backButton');

            // Lógica para el botón "Atrás"
            backButton.addEventListener('click', () => {
                // Redirigir a la lista de productos
                document.querySelector('.add-product-form-container').remove();
            });

            // Lógica para enviar el formulario de agregar producto
            addProductForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Obtener datos del formulario
                const name = document.getElementById('productName').value;
                const description = document.getElementById('productDescription').value;
                const price = parseFloat(document.getElementById('productPrice').value);
                const quantity = parseInt(document.getElementById('productQuantity').value, 10);

                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('/api/products/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ name, description, price, quantity }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        addProductMessage.textContent = 'Producto agregado exitosamente.';
                        addProductMessage.style.color = 'green';

                        // Agregar el producto a la lista de productos
                        const productCard = document.createElement('div');
                        productCard.classList.add('product-card');
                        productCard.innerHTML = `
                            <h3 class="product-name">${name}</h3>
                            <p class="product-description">${description}</p>
                            <p class="product-price">Precio: $${price.toFixed(2)}</p>
                            <p class="product-quantity">Disponibles: ${quantity}</p>
                        `;
                        productList.appendChild(productCard);

                        // Limpiar y cerrar el formulario
                        setTimeout(() => {
                            document.querySelector('.add-product-form-container').remove();
                        }, 2000);
                    } else {
                        addProductMessage.textContent = result.message;
                        addProductMessage.style.color = 'red';
                    }
                } catch (error) {
                    addProductMessage.textContent = 'Error al agregar el producto.';
                    addProductMessage.style.color = 'red';
                }
            });
        });
    } catch (error) {
        productList.innerHTML = '<p>Error al conectar con el servidor.</p>';
    }
});
