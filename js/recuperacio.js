const formulario = document.getElementById("agregar-gasto");

const txtNombreGasto = document.getElementById("gasto");
const txtCantidad = document.getElementById("cantidad");

const lblPresupuestoTotal = document.getElementById("total");
const lblRestante = document.getElementById("restante");

const listadoGastos = document.querySelector("#gastos ul");

let presupuestoInicial = 1000;
let restante = presupuestoInicial;

lblPresupuestoTotal.innerText = presupuestoInicial;
lblRestante.innerText = restante;

formulario.addEventListener("submit", function(e) {
    e.preventDefault();
    const gasto = txtNombreGasto.value;
    const cantidad = Number(txtCantidad.value);
    console.log(gasto, cantidad);
    // realizar la operacion resta sobre la variable 
    //restante y mostrar el lblrestante
    restante = restante - cantidad;
    lblRestante.innerText = restante;

});