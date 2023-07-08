// Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");
const presupuestoInput = document.querySelector("#presupuesto-input");

// Eventos
eventListeners();

function eventListeners() {
  document.addEventListener("DOMContentLoaded", cargarPagina);
  formulario.addEventListener("submit", agregarGasto);
  document
    .querySelector("#borrar-formulario")
    .addEventListener("click", limpiarPresupuesto);
  document
    .querySelector("#preguntar")
    .addEventListener("click", preguntarPresupuesto);
}

// Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  restarGasto(gasto) {
    this.restante += gasto.cantidad;
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
  }
}

let presupuesto;

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    const presupuestoFormateado = presupuesto.toLocaleString("es-CL");
    const restanteFormateado = restante.toLocaleString("es-CL");

    document.querySelector("#total").textContent = presupuestoFormateado;
    document.querySelector("#restante").textContent = restanteFormateado;
  }

  actualizarTotalGastos(total) {
    document.querySelector("#total-gastos").textContent =
      total.toLocaleString("es-CL");
  }

  agregarGastoListado(gastos) {
    this.limpiarHtml();

    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;
      const nuevoGasto = document.createElement("tr");
      nuevoGasto.className = "tabla-gastos";
      nuevoGasto.dataset.id = id;

      const cantidadFormateada = cantidad.toLocaleString("es-CL");

      nuevoGasto.innerHTML = `
        <td class="centrado-izquierda"\></span>${nombre}</td>
        <td class="centrado"\></span>${cantidadFormateada}</td>
        <td class="centrado"><button class='btn btn-danger borrar-gasto'><i class='bi bi-trash3-fill'></i></button></td>
      `;

      const btnBorrar = nuevoGasto.querySelector(".borrar-gasto");
      btnBorrar.addEventListener("click", () => {
        this.eliminarGasto(id);
      });

      gastoListado.appendChild(nuevoGasto);
    });

    const totalGastos = gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.actualizarTotalGastos(totalGastos);
  }

  limpiarHtml() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent =
      restante.toLocaleString("es-CL");
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector(".restante");

    const presupuestoFormateado = presupuesto.toLocaleString("es-CL");
    const restanteFormateado = restante.toLocaleString("es-CL");

    document.querySelector("#total").textContent = presupuestoFormateado;
    document.querySelector("#restante").textContent = restanteFormateado;
  }

  eliminarGasto(id) {
    presupuesto.eliminarGasto(id);

    const { gastos, restante } = presupuesto;
    this.agregarGastoListado(gastos);

    this.actualizarRestante(restante);
    this.comprobarPresupuesto(presupuesto);

    const totalGastos = gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.actualizarTotalGastos(totalGastos);
  }

  limpiarPresupuesto() {
    formulario.reset();
    document.querySelector("#total").textContent = "0";
    document.querySelector("#restante").textContent = "0";
    this.limpiarHtml();
    presupuestoInput.disabled = false;
    presupuesto = null;
  }
}

const ui = new UI();

function cargarPagina() {
  const respuestaElemento = document.getElementById("respuesta");
  const nombre = prompt("Por favor, ingresa tu nombre:");

  if (nombre) {
    respuestaElemento.textContent = nombre + ", crea tu presupuesto!";
  } else {
    respuestaElemento.textContent = "Invitado, crea tu presupuesto!";
  }
}

function preguntarPresupuesto() {
  const presupuestoUsuario = Number(presupuestoInput.value.trim());

  if (
    presupuestoUsuario === "" ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    ui.insertarPresupuesto({ presupuesto: 0, restante: 0 });
    return;
  }

  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
  presupuestoInput.disabled = true; // Deshabilitar el input del presupuesto
}

function agregarGasto(e) {
  e.preventDefault();

  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  if (nombre === "" && cantidad !== "") {
    // Solo el campo del nombre está vacío
    return;
  } else if (nombre === "" || cantidad === "") {
    // Ambos campos están vacíos
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    return;
  }

  const gasto = { nombre, cantidad, id: Date.now() };
  presupuesto.nuevoGasto(gasto);

  const { gastos, restante } = presupuesto;
  ui.agregarGastoListado(gastos);

  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);

  const totalGastos = gastos.reduce(
    (total, gasto) => total + gasto.cantidad,
    0
  );
  ui.actualizarTotalGastos(totalGastos);

  formulario.reset();
}

function limpiarPresupuesto() {
  formulario.reset();
  document.querySelector("#total").textContent = "0";
  document.querySelector("#total-gastos").textContent = "0";
  document.querySelector("#restante").textContent = "0";
  ui.limpiarHtml();
  presupuestoInput.disabled = false;
  presupuesto = null;
}
