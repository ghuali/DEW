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
