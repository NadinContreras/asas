
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
        celdaFinal.innerText = fechaTexto + " (Concluido)";
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

  subtitulo.textContent = `Mostrando contratación del año ${anio}`;

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
        actualizarTiempoEnTabla();  // ⬅️ Aquí agregas la llamada
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


//Funcion exportar excel
function exportarExcel() {
  const tabla = document.querySelector("table");
  const filas = Array.from(tabla.querySelectorAll("tr"));

  const columnasDeseadas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // índices de las columnas relevantes

  const datos = filas.map(fila => {
    const celdas = Array.from(fila.querySelectorAll("th, td"));
    return columnasDeseadas.map(i => celdas[i]?.innerText || "");
  });

  const hoja = XLSX.utils.aoa_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Contratos");

  XLSX.writeFile(libro, "Contratos_Alcaldia_2025.xlsx");
}



function calcularTiempoTrabajado(inicioStr, finStr) {
  const inicio = new Date(inicioStr);
  const fin = new Date(finStr);
  const hoy = new Date();

  let fechaFinal = fin < hoy ? fin : hoy;

  const diffMs = fechaFinal - inicio;
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const años = Math.floor(diffDias / 365);
  const meses = Math.floor((diffDias % 365) / 30);
  const dias = diffDias % 30;

  let texto = '';
  if (años > 0) texto += `${años} año${años > 1 ? 's' : ''}, `;
  if (meses > 0 || años > 0) texto += `${meses} mes${meses !== 1 ? 'es' : ''}, `;
  texto += `${dias} día${dias !== 1 ? 's' : ''}`;

  return texto;
}

function actualizarTiempoEnTabla() {
  const tabla = document.getElementById('tablaContratos');
  if (!tabla) return;

  const filas = tabla.getElementsByTagName('tr');

  for (let i = 1; i < filas.length; i++) {
    const celdas = filas[i].getElementsByTagName('td');
    if (celdas.length >= 12) {
      const fechaInicio = celdas[10].textContent.trim();
      const fechaFinal = celdas[11].textContent.trim();

      const tiempo = calcularTiempoTrabajado(fechaInicio, fechaFinal);

      if (celdas.length === 13) {
        const nuevaCelda = filas[i].insertCell(-1);
        nuevaCelda.textContent = tiempo;
      } else {
        celdas[13].textContent = tiempo;
      }
    }
  }
}


