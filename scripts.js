document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    // Usuarios ficticios
    if (user === "jefe" && pass === "1234") {
        showContent("jefe");
    } else if (user === "usuario" && pass === "abcd") {
        showContent("general");
    } else {
        document.getElementById("login-error").style.display = "block";
    }
});

function showContent(role) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("content-section").style.display = "block";

    if (role === "jefe") {
        document.getElementById("tabla-jefe").style.display = "block";
    } else {
        document.getElementById("tabla-jefe").style.display = "none";
    }
}

function logout() {
    location.reload();
}
