// Mostrar tabla automáticamente en cada pantalla de aerolínea
document.addEventListener('DOMContentLoaded', () => {
	const tablaDiv = document.getElementById('tabla-asientos');
	if (tablaDiv) {
		let nombre;
		if (document.querySelector('h1')) {
			const h1 = document.querySelector('h1').textContent.trim();
			if (h1 === 'Binter') nombre = 'Binter';
			else if (h1 === 'Ryaner') nombre = 'Ryaner';
			else if (h1 === 'CanaryFly') nombre = 'CanaryFly';
		}
		if (nombre && modelos[nombre]) {
			let avion = modelos[nombre];
				mostrarTablaEnIndex(avion);
		}
	}
});
	// Esta función solo se usa en el index
	function mostrarTablaEnIndex(avion) {
	    let html = `<h3>${avion.nombre}</h3>`;
	    html += '<table class="tabla-asientos">';
	    html += '<tr><th>Fila/Col</th>';
	    for (let c = 0; c < avion.columnas; c++) html += `<th>${c + 1}</th>`;
	    html += '</tr>';
	    for (let f = 0; f < avion.filas; f++) {
	        html += `<tr><th>${f + 1}</th>`;
	        for (let c = 0; c < avion.columnas; c++) {
	            let categoria = f === 0 ? 'business' : (f < Math.ceil(avion.filas/2) ? 'economica' : 'lowcost');
	            let libre = avion.asientos[f][c];
	            let color = libre ? 'green' : 'red';
	            html += `<td class="${categoria}">${avion.preciosCategorias[categoria]}€<br><span style="color:${color}">${libre ? 'Libre' : 'Ocupado'}</span></td>`;
	        }
	        html += '</tr>';
	    }
	    html += '</table>';
	    const contenedor = document.createElement('div');
	    contenedor.className = 'tabla-container';
	    contenedor.innerHTML = html;
	    document.querySelector('.main-container').appendChild(contenedor);
	}
// Definición de la clase Avion
class Avion {
	constructor(nombre, filas, columnas, precioBase, preciosCategorias) {
		this.nombre = nombre;
		this.filas = filas;
		this.columnas = columnas;
		this.precioBase = precioBase;
		this.preciosCategorias = preciosCategorias; // { business, economica, lowcost }
		this.asientos = Array.from({ length: filas }, () => Array(columnas).fill(true)); // true = libre
	}

	reservar(fila, columna) {
		if (this.asientos[fila][columna]) {
			this.asientos[fila][columna] = false;
			return true;
		}
		return false;
	}

	liberar(fila, columna) {
		if (!this.asientos[fila][columna]) {
			this.asientos[fila][columna] = true;
			return true;
		}
		return false;
	}
}

// Instancias de cada compañía
const modelos = {
	Binter: new Avion('Binter', 6, 4, 100, { business: 200, economica: 120, lowcost: 80 }),
	Ryaner: new Avion('Ryaner', 8, 6, 80, { business: 160, economica: 100, lowcost: 60 }),
	CanaryFly: new Avion('CanaryFly', 5, 4, 90, { business: 180, economica: 110, lowcost: 70 })
};

// Mostrar tabla de asientos en el index al elegir una compañía
function mostrarTabla(avion) {
	let html = `<h3>${avion.nombre}</h3>`;
	html += '<table class="tabla-asientos">';
	html += '<tr><th>Fila/Col</th>';
	for (let c = 0; c < avion.columnas; c++) html += `<th>${c + 1}</th>`;
	html += '</tr>';
	for (let f = 0; f < avion.filas; f++) {
		html += `<tr><th>${f + 1}</th>`;
		for (let c = 0; c < avion.columnas; c++) {
			let categoria = f === 0 ? 'business' : (f < Math.ceil(avion.filas/2) ? 'economica' : 'lowcost');
			let libre = avion.asientos[f][c];
			let color = libre ? 'green' : 'red';
			html += `<td class="${categoria}">${avion.preciosCategorias[categoria]}€<br><span style="color:${color}">${libre ? 'Libre' : 'Ocupado'}</span></td>`;
		}
		html += '</tr>';
	}
	html += '</table>';
	const contenedor = document.createElement('div');
	contenedor.className = 'tabla-container';
	contenedor.innerHTML = html;
	document.querySelector('.main-container').appendChild(contenedor);
}

// Solo mostrar la tabla en el index si hay botones
document.addEventListener('DOMContentLoaded', () => {
	const tablaDiv = document.getElementById('tabla-asientos');
	if (tablaDiv) {
		let nombre;
		if (document.querySelector('h1')) {
			const h1 = document.querySelector('h1').textContent.trim();
			if (h1 === 'Binter') nombre = 'Binter';
			else if (h1 === 'Ryaner') nombre = 'Ryaner';
			else if (h1 === 'CanaryFly') nombre = 'CanaryFly';
		}
		if (nombre && modelos[nombre]) {
			let avion = modelos[nombre];
			let html = `<h3>${avion.nombre}</h3>`;
			html += '<table class="tabla-asientos">';
			html += '<tr><th>Fila/Col</th>';
			for (let c = 0; c < avion.columnas; c++) html += `<th>${c + 1}</th>`;
			html += '</tr>';
			for (let f = 0; f < avion.filas; f++) {
				html += `<tr><th>${f + 1}</th>`;
				for (let c = 0; c < avion.columnas; c++) {
					let categoria = f === 0 ? 'business' : (f < Math.ceil(avion.filas/2) ? 'economica' : 'lowcost');
					let libre = avion.asientos[f][c];
					let color = libre ? 'green' : 'red';
					html += `<td class="${categoria}">${avion.preciosCategorias[categoria]}€<br><span style="color:${color}">${libre ? 'Libre' : 'Ocupado'}</span></td>`;
				}
				html += '</tr>';
			}
			html += '</table>';
			const contenedor = document.createElement('div');
			contenedor.className = 'tabla-container';
			contenedor.innerHTML = html;
			document.querySelector('.main-container').appendChild(contenedor);
		}
	} else if (document.querySelector('.botones')) {
		// Solo en el index, permitir mostrar tabla al hacer click en los botones
		document.querySelectorAll('.botonAvion').forEach(boton => {
			boton.addEventListener('click', function(e) {
				e.preventDefault();
				document.querySelectorAll('.tabla-container').forEach(el => el.remove());
				const nombre = this.classList.contains('binter') ? 'Binter'
					: this.classList.contains('ryaner') ? 'Ryaner'
					: 'CanaryFly';
				mostrarTablaEnIndex(modelos[nombre]);
			});
		});
	}
});
