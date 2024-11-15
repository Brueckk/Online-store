// client/js/register.js
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado de recargar la página
    
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
        console.log("Enviando datos de registro:", { username, password });  // <-- Mensaje de depuración
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        // Verifica si la respuesta fue exitosa
        if (response.ok) {
            document.getElementById("responseMessage").textContent = data.message;
            document.getElementById("responseMessage").style.color = "green";
            
            // Redirige al usuario al login si el registro fue exitoso
            setTimeout(() => window.location.href = "/login", 2000);
        } else {
            // Muestra el mensaje de error si hubo un problema en el registro
            document.getElementById("responseMessage").textContent = data.message;
            document.getElementById("responseMessage").style.color = "red";
        }
    } catch (error) {
        // Manejo de errores de red o de conexión con el servidor
        document.getElementById("responseMessage").textContent = "Error de conexión con el servidor";
        document.getElementById("responseMessage").style.color = "red";
    }
});
