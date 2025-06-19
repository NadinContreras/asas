
// funciones.js (versión final compatible)

window.onload = function () {
  buscar();
  marcarContratosVencidos();
};

function buscar() {
  var input = document.getElementById("buscador").value.toLowerCase();
  var filas = document.getElementById("tablaContratos").getElementsByTagName("tr");
  var count = 0;
  for (var i = 1; i < filas.length; i++) {
    var textoFila = filas[i].innerText.toLowerCase();
    if (textoFila.includes(input)) {
      filas[i].style.display = "";
      count++;
    } else {
      filas[i].style.display = "none";
    }
  }
  actualizarContador(count);
}

function restablecerBusqueda() {
  document.getElementById("buscador").value = "";
  buscar();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function agregarContrato() {
  alert("Función para agregar contrato en desarrollo");
}

function importarCSV() {
  alert("Función para importar CSV en desarrollo");
}

function exportarExcel() {
  alert("Haz clic en aceptar para ver la tabla en Excel: ");
  window.open("https://docs.google.com/spreadsheets/d/19xin3e6SJGwof33acfDwl9gDxW_x55LG/edit?usp=sharing&ouid=105713254063128352099&rtpof=true&sd=true", "_blank");
}

function toggleTabla() {
  var tabla = document.getElementById("tablaContratos");
  var boton = document.getElementById("botonTabla");
  if (tabla.style.display === "none") {
    tabla.style.display = "table";
    boton.innerText = "Ocultar lista";
    buscar();
  } else {
    tabla.style.display = "none";
    boton.innerText = "Mostrar lista";
    actualizarContador(0);
  }
}

let ordenAscendente = true;
function ordenarPorNumero() {
  var tabla = document.getElementById("tablaContratos");
  var filas = Array.from(tabla.rows).slice(1);
  filas.sort(function(a, b) {
    var valA = parseInt(a.cells[0].innerText);
    var valB = parseInt(b.cells[0].innerText);
    return ordenAscendente ? valA - valB : valB - valA;
  });
  filas.forEach(fila => tabla.appendChild(fila));
  ordenAscendente = !ordenAscendente;
}

function actualizarContador(valor) {
  var texto = valor === 0 ? "No hay contratos visibles" : "Mostrando " + valor + " contratos";
  var contador = document.getElementById("contador");
  if (contador) contador.innerText = texto;
}

function marcarContratosVencidos() {
  const tabla = document.getElementById("tablaContratos");
  if (!tabla) return;

  const filas = tabla.getElementsByTagName("tr");
  const hoy = new Date();

  for (let i = 1; i < filas.length; i++) {
    const celdaFinal = filas[i].cells[11];
    if (!celdaFinal) continue;

    const fechaTexto = celdaFinal.innerText.trim().split(" ")[0];
    const partes = fechaTexto.split("-");
    let fechaContrato;

    if (partes.length === 3) {
      if (parseInt(partes[0]) > 31) {
        fechaContrato = new Date(fechaTexto);
      } else {
        const [dia, mes, año] = partes;
        fechaContrato = new Date(`${año}-${mes}-${dia}`);
      }

      const diferenciaMs = fechaContrato - hoy;
      const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

      if (fechaContrato < hoy) {
        celdaFinal.style.backgroundColor = "#ffcccc";
        celdaFinal.style.fontWeight = "bold";
        celdaFinal.innerText = fechaTexto + " (VENCIDO)";
      } else if (diasRestantes <= 10) {
        celdaFinal.style.backgroundColor = "#fff3cd";
        celdaFinal.style.fontWeight = "bold";
        celdaFinal.innerText = fechaTexto + ` (faltan ${diasRestantes} días)`;
      }
    }
  }
}

function cambiarAnio() {
  const anio = document.getElementById('anio-select').value;
  const contenedor = document.getElementById('contenedor-tabla');
  const subtitulo = document.querySelector('.subtitle');

  subtitulo.textContent = `Contratación ${anio}`;

  fetch(`contratos_${anio}.html`)
    .then(res => res.text())
    .then(html => {
      contenedor.innerHTML = html;

      setTimeout(() => {
        // Ejecutamos funciones necesarias si existen
        if (typeof contarFilas === "function") contarFilas();
        if (typeof aplicarColoresFechas === "function") aplicarColoresFechas();
        if (typeof ocultarFilasPorFecha === "function") ocultarFilasPorFecha();
        buscar();
        marcarContratosVencidos();
      }, 100);
    })
    .catch(err => {
      contenedor.innerHTML = `<p style="color:red;">Error al cargar contratos ${anio}</p>`;
      console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  cambiarAnio(); // carga por defecto 2025
});

function abrirObservacion(texto) {
  document.getElementById("texto-observacion").innerText = texto;
  document.getElementById("modal-observacion").style.display = "flex";
}

function cerrarObservacion() {
  document.getElementById("modal-observacion").style.display = "none";
}
