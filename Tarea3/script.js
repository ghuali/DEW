/********************************************
 * JUEGO DE ROMPECABEZAS DESLIZANTE 3x3
 * Autor: Tu nombre
 * Descripción: Juego de puzzle con tiempo, movimientos y guardado de partida
 ********************************************/

// ============================
// VARIABLES GLOBALES Y OBJETO PRINCIPAL
// ============================

// Objeto principal del juego
const ROMPECABEZAS = {
    IMAGENES: [
        "ishmael_part_1_1.jpg", "ishmael_part_1_2.jpg", "ishmael_part_1_3.jpg",
        "ishmael_part_2_1.jpg", "ishmael_part_2_2.jpg", "ishmael_part_2_3.jpg",
        "ishmael_part_3_1.jpg", "ishmael_part_3_2.jpg"
    ],
    CELDAS: [],             // Referencias a las celdas <td>
    POSICIONES: [],         // Orden actual de las piezas
    VACIA: 9,               // ID de la celda vacía
    MOVIMIENTOS: 0,         // Contador de movimientos
    TIEMPO: null,           // Objeto tiempo
    JUGANDO: false          // Estado del juego
};

// Relaciones de vecindad (no diagonales)
const VECINOS = {
    1: [2, 4],
    2: [1, 3, 5],
    3: [2, 6],
    4: [1, 5, 7],
    5: [2, 4, 6, 8],
    6: [3, 5, 9],
    7: [4, 8],
    8: [5, 7, 9],
    9: [6, 8]
};

// ============================
// OBJETO TIEMPO
// ============================

const TIEMPO = {
    segundos: 0,
    minutos: 0,
    intervalo: null,

    iniciar() {
        this.intervalo = setInterval(() => {
            this.segundos++;
            if (this.segundos === 60) {
                this.segundos = 0;
                this.minutos++;
            }
            mostrarTiempo();
        }, 1000);
    },

    detener() {
        clearInterval(this.intervalo);
    },

    reiniciar() {
        this.segundos = 0;
        this.minutos = 0;
        clearInterval(this.intervalo);
        mostrarTiempo();
    }
};

// ============================
// INICIALIZACIÓN
// ============================

document.addEventListener("DOMContentLoaded", () => {
    ROMPECABEZAS.CELDAS = Array.from(document.querySelectorAll("td"));
    document.querySelector("button").addEventListener("click", iniciarJuego);

    // Cargar partida guardada si existe
    cargarPartida();
});

// ============================
// FUNCIONES PRINCIPALES
// ============================

// Inicia el juego mezclando piezas y reiniciando tiempo/movimientos
function iniciarJuego() {
    ROMPECABEZAS.POSICIONES = mezclar(ROMPECABEZAS.IMAGENES);
    ROMPECABEZAS.POSICIONES.push("blanca.jpg"); // Último hueco vacío
    ROMPECABEZAS.MOVIMIENTOS = 0;
    ROMPECABEZAS.JUGANDO = true;

    TIEMPO.reiniciar();
    TIEMPO.iniciar();

    mostrarPuzzle();
    mostrarMovimientos();
    mostrarMensaje("Juego iniciado. ¡Buena suerte!");
}

// Muestra las imágenes según el orden actual
function mostrarPuzzle() {
    ROMPECABEZAS.CELDAS.forEach((celda, index) => {
        const img = celda.querySelector("img");
        img.src = ROMPECABEZAS.POSICIONES[index];
    });
}

// Baraja las piezas aleatoriamente
function mezclar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

// Maneja clics en las celdas
function cambiar(tdElement) {
    if (!ROMPECABEZAS.JUGANDO) return;

    const idCelda = parseInt(tdElement.id);
    const idBlanca = ROMPECABEZAS.POSICIONES.indexOf("blanca.jpg") + 1;

    // Solo mover si son vecinas
    if (VECINOS[idBlanca].includes(idCelda)) {
        intercambiar(idCelda, idBlanca);
        ROMPECABEZAS.MOVIMIENTOS++;
        mostrarMovimientos();

        guardarPartida();

        if (verificarVictoria()) {
            terminarJuego();
        }
    }
}

// Intercambia posiciones en el array y en el DOM
function intercambiar(id1, id2) {
    [ROMPECABEZAS.POSICIONES[id1 - 1], ROMPECABEZAS.POSICIONES[id2 - 1]] =
        [ROMPECABEZAS.POSICIONES[id2 - 1], ROMPECABEZAS.POSICIONES[id1 - 1]];

    mostrarPuzzle();
}

// ============================
// COMPROBACIÓN DE VICTORIA
// ============================

function verificarVictoria() {
    for (let i = 0; i < ROMPECABEZAS.IMAGENES.length; i++) {
        if (ROMPECABEZAS.POSICIONES[i] !== ROMPECABEZAS.IMAGENES[i]) {
            return false;
        }
    }
    return true;
}

// ============================
// FINALIZAR JUEGO
// ============================

function terminarJuego() {
    ROMPECABEZAS.JUGANDO = false;
    TIEMPO.detener();
    mostrarMensaje(`¡Completado en ${ROMPECABEZAS.MOVIMIENTOS} movimientos y ${TIEMPO.minutos}m ${TIEMPO.segundos}s!`);

    // Guardar récord
    const mejorTiempo = localStorage.getItem("mejor_tiempo");
    const tiempoActual = TIEMPO.minutos * 60 + TIEMPO.segundos;

    if (!mejorTiempo || tiempoActual < mejorTiempo) {
        localStorage.setItem("mejor_tiempo", tiempoActual);
        mostrarMensaje("¡Nuevo récord!");
    }

    localStorage.removeItem("partida_guardada");
}

// ============================
// GUARDAR Y CARGAR PARTIDA
// ============================

function guardarPartida() {
    const estado = {
        posiciones: ROMPECABEZAS.POSICIONES,
        movimientos: ROMPECABEZAS.MOVIMIENTOS,
        tiempo: { minutos: TIEMPO.minutos, segundos: TIEMPO.segundos }
    };
    localStorage.setItem("partida_guardada", JSON.stringify(estado));
}

function cargarPartida() {
    const guardado = localStorage.getItem("partida_guardada");
    if (guardado) {
        const datos = JSON.parse(guardado);
        ROMPECABEZAS.POSICIONES = datos.posiciones;
        ROMPECABEZAS.MOVIMIENTOS = datos.movimientos;
        TIEMPO.minutos = datos.tiempo.minutos;
        TIEMPO.segundos = datos.tiempo.segundos;
        mostrarPuzzle();
        mostrarMovimientos();
        mostrarTiempo();
        mostrarMensaje("Partida cargada. Presiona INICIAR para continuar.");
    } else {
        // Mostrar puzzle inicial ordenado
        ROMPECABEZAS.POSICIONES = [...ROMPECABEZAS.IMAGENES, "blanca.jpg"];
        mostrarPuzzle();
    }
}

// ============================
// FUNCIONES DE INTERFAZ
// ============================

function mostrarMovimientos() {
    let span = document.getElementById("movimientos");
    if (!span) {
        span = document.createElement("div");
        span.id = "movimientos";
        document.body.appendChild(span);
    }
    span.textContent = `Movimientos: ${ROMPECABEZAS.MOVIMIENTOS}`;
}

function mostrarTiempo() {
    let span = document.getElementById("tiempo");
    if (!span) {
        span = document.createElement("div");
        span.id = "tiempo";
        document.body.appendChild(span);
    }
    span.textContent = `Tiempo: ${TIEMPO.minutos.toString().padStart(2, "0")}:${TIEMPO.segundos.toString().padStart(2, "0")}`;
}

function mostrarMensaje(texto) {
    let msg = document.getElementById("mensaje");
    if (!msg) {
        msg = document.createElement("div");
        msg.id = "mensaje";
        document.body.appendChild(msg);
    }
    msg.textContent = texto;
}
