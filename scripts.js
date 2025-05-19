document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;


    // Usuarios ficticios
    if (user === "barnaby" && pass === "78382055") {
        showContent("barnaby");
    } else if (user === "nadin" && pass === "1003525827") {
        showContent("nadin");
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

    // ver contraseña

function togglePasswordVisibility(icon) {
  const passwordInput = document.getElementById("password");
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
}