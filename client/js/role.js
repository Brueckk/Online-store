// client/js/index.js
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const decodedToken = jwt_decode(token); // Usa jwt_decode directamente
            const userRole = decodedToken.role;

            console.log("Rol del usuario:", userRole);

            if (userRole === "admin") {
                document.getElementById("adminSection").style.display = "block";
            } else if (userRole === "client") {
                document.getElementById("clientSection").style.display = "block";
            } else {
                console.error("Rol desconocido:", userRole);
            }
        } catch (error) {
            console.error("Error al decodificar el token", error);
            window.location.href = "/login";
        }
    } else {
        window.location.href = "/login";
    }
});
