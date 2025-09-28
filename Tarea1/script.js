// ====================================
// ESCENA DE LA CALLE CON 5 SECCIONES
// ====================================
console.log("Iniciando generación de la calle...");

// =============================
// 1. CANTIDAD DE TIENDAS
// =============================
let cantidadTiendas = prompt("¿Cuántas tiendas quieres mostrar?");
if (isNaN(cantidadTiendas) || cantidadTiendas <= 0) {
  alert("Cantidad inválida, se mostrará 1 tienda.");
  cantidadTiendas = 1;
}
cantidadTiendas = parseInt(cantidadTiendas);
console.log("Cantidad de tiendas:", cantidadTiendas);

// =============================
// 2. NÚMERO INICIAL DE PORTAL
// =============================
let numeroInicial = prompt("Introduce el número inicial de portal:");
if (isNaN(numeroInicial) || numeroInicial.trim() === "") {
  alert("Número inválido, se usará el 1 por defecto.");
  numeroInicial = 1;
} else {
  numeroInicial = parseInt(numeroInicial);
}
console.log("Número inicial:", numeroInicial);

// =============================
// SECCIÓN 1 - CARTELES
// =============================
document.write('<div class="seccion carteles">');

let nombresTiendas = [];

for (let i = 0; i < cantidadTiendas; i++) {
  let nombreTienda = prompt(`Introduce el nombre de la tienda ${i + 1}:`);
  if (!nombreTienda || nombreTienda.trim() === "") {
    nombreTienda = "Tienda Genérica";
  }
  nombresTiendas.push(nombreTienda);

  // Generar el cartel con el nombre dentro
  document.write('<div class="cartel-con-texto" style="margin: 15px;">');
  document.write('<img src="cartel.jpg" alt="Cartel">');
  document.write(`<div class="texto-cartel">${nombreTienda}</div>`);
  document.write('</div>');

  console.log(`Tienda ${i + 1}: ${nombreTienda}`);
}
document.write('</div>');

// =============================
// SECCIÓN 2 - NÚMEROS
// =============================
document.write('<div class="seccion numeros">');

for (let i = 0; i < cantidadTiendas; i++) {
  let numeroTienda = numeroInicial + (i * 2); // Incrementa de 2 en 2
  document.write(`<div class="numero-tienda">${numeroTienda}</div>`);
  console.log(`Número de tienda ${i + 1}: ${numeroTienda}`);
}

document.write('</div>');

// =============================
// SECCIÓN 3 - IMÁGENES DE TIENDAS
// =============================
document.write('<div class="seccion escaparates">');

for (let i = 0; i < cantidadTiendas; i++) {
  document.write('<img src="tienda.jpg" alt="Tienda">');
}
document.write('</div>');

// =============================
// SECCIÓN 4 - RELOJ Y SEMÁFORO
// =============================
let hora = prompt("Introduce la hora actual (0-23):");
let min = prompt("Introduce los minutos actuales (0-60):");
if (isNaN(hora) || hora < 0 || hora > 23) {
  alert("Hora inválida, se usará 12.");
  hora = 12;
}
if (isNaN(min) || min < 0 || min > 60) {
  alert("minutos inválidos, se usará 00.");
  hora = 0;
}
console.log("Hora actual:", hora,":",min);

let colorSemaforo = prompt("Introduce el color del semáforo (red, green, yellow):").toLowerCase();
console.log("Color del semáforo ingresado:", colorSemaforo);

document.write('<div class="seccion reloj-semaforo">');
document.write(`<div class="hora">Hora: ${hora}:${min}</div>`);

switch (colorSemaforo) {
  case "red":
    document.write('<img src="semaforo_rojo.jpg" alt="Semáforo rojo">');
    break;
  case "green":
    document.write('<img src="semaforo_verde.jpg" alt="Semáforo verde">');
    break;
  case "yellow":
    document.write('<img src="semaforo_amarillo.jpg" alt="Semáforo amarillo">');
    break;
  default:
    alert("Color inválido, se mostrará rojo por defecto.");
    document.write('<img src="semaforo_rojo.jpg" alt="Semáforo rojo">');
}
document.write('</div>');

// =============================
// SECCIÓN 5 - COCHES
// =============================
let cantidadCoches = prompt("¿Cuántos coches quieres mostrar?");
if (isNaN(cantidadCoches) || cantidadCoches <= 0) {
  alert("Cantidad inválida, se mostrarán 2 coches.");
  cantidadCoches = 2;
}
console.log("Cantidad de coches:", cantidadCoches);

document.write('<div class="seccion coches">');

while (cantidadCoches > 0) {
  document.write('<img src="coche.jpg" alt="Coche">');
  cantidadCoches--;
}
document.write('</div>');

console.log("Escena generada correctamente.");
