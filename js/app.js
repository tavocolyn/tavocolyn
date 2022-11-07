const formulario = document.getElementById("agregar-gasto");
const txtNombreGasto = document.getElementById("gasto");
const txtCantidad = document.getElementById("cantidad");
const lblPresupuestoTotal = document.getElementById("total");
const lblRestante = document.getElementById("restante");
const listadoGastos = document.querySelector("#gastos ul");

//---------------------EVENTOS
document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
formulario.addEventListener("submit", agregarGasto);

//-------------------FUNCIONES
function preguntarPresupuesto() {
    const presupuestoUsuario = 999; //prompt("¿Cuál es tu presupuesto anual?");
    if (isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }
    //SI EL PRESUPUESTO ES VALIDO
    gastoSemanal = new GastoSemanal(presupuestoUsuario);
    ui.insertarValoresIniciales();
}

function agregarGasto(e) {
    e.preventDefault();
    if (!validar()) {
        return;
    }
    const gasto = txtNombreGasto.value;
    const cantidad = Number(txtCantidad.value);
    const gastoIndividual = new GastoIndividual(gasto, cantidad);

    gastoSemanal.ingresarGasto(gastoIndividual);
    gastoSemanal.descontarGasto(cantidad);
    gastoSemanal.imprimirGastos();
    ui.imprimirAlerta("Gasto agregado correctamente");

    ui.actualizarRestante();
    ui.agregarlistadoGastos();
    ui.comprobarCantidadRestante();

    formulario.reset();
}

//----------------------Funcion validar
function validar() {
    if (txtNombreGasto.value === "" || txtCantidad.value === "") {
        ui.imprimirAlerta("Ambos Campos Son Obligatorios", "error");
        return false;
    }
    if (Number(txtCantidad.value) <= 0 || isNaN(txtCantidad.value)) {
        ui.imprimirAlerta("Cantidad No Valida", "error");
        return false;
    }
    return true;
}
//---------------------------------CLASES
class GastoSemanal {
    constructor(presupuestoInicial) {
        this.presupuestoTotal = Number(presupuestoInicial);
        this.restante = Number(presupuestoInicial);
        this.gastos = [];
    }
    obtenerPresupuestoTotal() {
        return this.presupuestoTotal;
    }
    obtenerRestante() {
        return this.restante;
    }
    descontarGasto(cantidad) {
        this.restante -= cantidad;
    }
    ingresarGasto(gasto) {
        this.gastos.push(gasto);
    }
    imprimirGastos() {
        console.clear();
        this.gastos.forEach(function(gasto) {
            console.log(
                `Nombre del gasto: ${gasto.obtenerGastoNombre()}, cantidad: ${gasto.obtenerGastoCantidad()}`
            );
        });
    }
    obtenerListaGastos() {
        return this.gastos;
    }
}
class GastoIndividual {
    constructor(nombre, cantidad) {
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
    obtenerGastoNombre() {
        return this.nombre;
    }
    obtenerGastoCantidad() {
        return this.cantidad;
    }
}
class UI {
    insertarValoresIniciales() {
        lblPresupuestoTotal.innerText = gastoSemanal.obtenerPresupuestoTotal();
        lblRestante.innerText = gastoSemanal.obtenerRestante();
    }
    actualizarRestante() {
        lblRestante.innerText = gastoSemanal.obtenerRestante();
    }
    agregarlistadoGastos() {
        this.limpiarlistadoGastos();
        const gastos = gastoSemanal.obtenerListaGastos();
        gastos.forEach((gasto, indice) => {
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className =
                "list-group-item d-flex justify-content-between align-items-center";

            nuevoGasto.dataset.id = indice.toString();
            nuevoGasto.innerHTML = `
            ${gasto.obtenerGastoNombre()}
            <span>$ ${gasto.obtenerGastoCantidad()}</span>
        `;
            listadoGastos.appendChild(nuevoGasto);
        });
    }
    limpiarlistadoGastos() {
        while (listadoGastos.firstChild) {
            listadoGastos.removeChild(listadoGastos.firstChild);
        }
    }

    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        if (tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }
        divMensaje.textContent = mensaje;
        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    comprobarCantidadRestante() {
        const restanteDiv = document.querySelector(".restante");
        //comprobar que se haya gastado mas de un 75%
        if (
            gastoSemanal.obtenerPresupuestoTotal() / 4 >
            gastoSemanal.obtenerRestante()
        ) {
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        } else if (
            gastoSemanal.obtenerPresupuestoTotal() / 2 >
            gastoSemanal.obtenerRestante()
        ) {
            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add("alert-warning");
        }

        //Si el presupuesto restante es  0 o menor
        if (gastoSemanal.obtenerRestante() <= 0) {
            ui.imprimirAlerta("El presupuesto se ha agotado", "error");
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// INSTANCIAR UI
const ui = new UI();
// CREAR  VALORES GLOBAL PARA PRESUPUESTO
let gastoSemanal;