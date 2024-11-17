document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const description = e.target.description.value;
    let price = e.target.price.value;
    const quantity = e.target.quantity.value;

    // Eliminar puntos para convertir el precio a un formato limpio
    price = price.replace(/\./g, '');

    try {
        const response = await fetch('/api/products/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, price, quantity }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('responseMessage').textContent = data.message;
            document.getElementById('responseMessage').style.color = 'green';
            e.target.reset(); // Reinicia el formulario
        } else {
            document.getElementById('responseMessage').textContent = data.message;
            document.getElementById('responseMessage').style.color = 'red';
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent =
            'Error al conectar con el servidor.';
        document.getElementById('responseMessage').style.color = 'red';
    }
});

// Formatear el precio con separadores de miles mientras se escribe
document.getElementById('price').addEventListener('input', (e) => {
    let value = e.target.value;

    // Eliminar puntos existentes para evitar duplicados
    value = value.replace(/\./g, '');

    // Formatear el número con puntos como separadores de miles
    e.target.value = Number(value).toLocaleString('es-CO');
});
