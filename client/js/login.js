document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById("responseMessage").textContent = "Inicio de sesión exitoso";
            document.getElementById("responseMessage").style.color = "green";
            
            // Guardar el token, username y role en localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", username); // Guarda el nombre de usuario
            localStorage.setItem("role", data.role); // Supone que el backend envía el rol en el login
            
            // Redirigir a la página principal
            setTimeout(() => window.location.href = "/client/index.html", 2000);
        } else {
            document.getElementById("responseMessage").textContent = data.message;
            document.getElementById("responseMessage").style.color = "red";
        }
    } catch (error) {
        document.getElementById("responseMessage").textContent = "Error de conexión con el servidor";
        document.getElementById("responseMessage").style.color = "red";
    }
});
