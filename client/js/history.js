document.addEventListener('DOMContentLoaded', async () => {
    const historyList = document.getElementById('history-list');
    const backButton = document.getElementById('backButton');

    // Obtener el historial de compras
    try {
        const token = localStorage.getItem('token'); // Obtener token del usuario
        if (!token) {
            historyList.innerHTML = '<p>Debes iniciar sesión para ver tu historial de compras.</p>';
            return;
        }

        const response = await fetch('/api/orders/history', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            const purchases = data.history;

            if (purchases.length === 0) {
                historyList.innerHTML = '<p>No tienes compras registradas.</p>';
            } else {
                purchases.forEach(purchase => {
                    const purchaseItem = document.createElement('div');
                    purchaseItem.classList.add('history-item');
                    purchaseItem.innerHTML = `
                        <h3>Factura ID: ${purchase.id}</h3>
                        <p><strong>Fecha:</strong> ${new Date(purchase.createdAt).toLocaleString()}</p>
                        <p><strong>Total:</strong> $${purchase.total.toLocaleString()}</p>
                        <h4>Productos:</h4>
                        <ul>
                            ${purchase.items.map(item => `<li>${item.name} (Cantidad: ${item.quantity}) - $${item.total}</li>`).join('')}
                        </ul>
                    `;
                    historyList.appendChild(purchaseItem);
                });
            }
        } else {
            historyList.innerHTML = `<p>Error al cargar el historial: ${data.message}</p>`;
        }
    } catch (error) {
        console.error('Error al cargar el historial:', error);
        historyList.innerHTML = '<p>Error al conectar con el servidor.</p>';
    }

    // Botón "Atrás"
    backButton.addEventListener('click', () => {
        window.location.href = '/client/index.html'; // Redirige a la página principal
    });
});
