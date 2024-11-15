// client/js/login.js
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
            
            // Guardar el token en localStorage y redirigir a la página principal
            localStorage.setItem("token", data.token);
            setTimeout(() => window.location.href = "/static/index.html", 2000);
        } else {
            document.getElementById("responseMessage").textContent = data.message;
            document.getElementById("responseMessage").style.color = "red";
        }
    } catch (error) {
        document.getElementById("responseMessage").textContent = "Error de conexión con el servidor";
        document.getElementById("responseMessage").style.color = "red";
    }
});
