const { createApp } = Vue;

// 8.1) COMPONENTE usando Plantillas
const ListaProductos = {
    name: 'ListaProductos',
    data() {
        // 8.3) Datos
        return {
            productos: [],
            busqueda: '',
            precioMaximo: 50,
            ordenar: 'nombre'
        };
    },
    computed: {
        // 8.3) Propiedades calculadas
        productosFiltrados() {
            let resultado = [...this.productos];
            
            // Filtrar por búsqueda
            if (this.busqueda) {
                resultado = resultado.filter(p => 
                    p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
                );
            }
            
            // Filtrar por precio
            resultado = resultado.filter(p => parseFloat(p.precio) <= this.precioMaximo);
            
            // Ordenar
            if (this.ordenar === 'precio-asc') {
                resultado.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
            } else if (this.ordenar === 'precio-desc') {
                resultado.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
            } else {
                resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
            }
            
            return resultado;
        },
        totalProductos() {
            return this.productosFiltrados.length;
        },
        precioPromedio() {
            if (this.productosFiltrados.length === 0) return 0;
            const suma = this.productosFiltrados.reduce((acc, p) => acc + parseFloat(p.precio), 0);
            return (suma / this.productosFiltrados.length).toFixed(2);
        }
    },
    methods: {
        // 8.4) Métodos para eventos
        cargarProductos() {
            fetch('index.php?action=obtener_productos')
                .then(response => response.json())
                .then(data => {
                    this.productos = data;
                })
                .catch(error => console.error('Error:', error));
        },
        agregarAlCarrito(producto) {
            // Llamar función global
            if (typeof agregarAlCarrito === 'function') {
                agregarAlCarrito(producto);
            }
        },
        limpiarFiltros() {
            this.busqueda = '';
            this.precioMaximo = 50;
            this.ordenar = 'nombre';
        },
        obtenerClaseDisponibilidad(disponible) {
            // 8.5) CSS dinámico
            return disponible == 1 ? 'disponible' : 'no-disponible';
        }
    },
    mounted() {
        this.cargarProductos();
    },
    // 8.1) Plantilla
    template: `
        <div class="vue-container">
            <h2>Otros Productos</h2>
            
            <!-- FILTROS -->
            <div class="filtros-vue">
                <div class="filtro-item">
                    <label>🔍 Buscar:</label>
                    <!-- 8.2) v-model: vinculación bidireccional -->
                    <input 
                        v-model="busqueda" 
                        type="text" 
                        placeholder="Buscar producto..."
                    />
                </div>
                
                <div class="filtro-item">
                    <label>💰 Precio máximo: €{{ precioMaximo }}</label>
                    <!-- 8.2) v-model con range -->
                    <input 
                        v-model.number="precioMaximo" 
                        type="range" 
                        min="0" 
                        max="50" 
                        step="1"
                    />
                </div>
                
                <div class="filtro-item">
                    <label>📊 Ordenar por:</label>
                    <!-- 8.2) v-model con select -->
                    <select v-model="ordenar">
                        <option value="nombre">Nombre</option>
                        <option value="precio-asc">Precio ↑</option>
                        <option value="precio-desc">Precio ↓</option>
                    </select>
                </div>
                
                <!-- 8.2) v-on: evento click -->
                <button @click="limpiarFiltros" class="btn-limpiar">
                    🔄 Limpiar
                </button>
            </div>
            
            <!-- ESTADÍSTICAS (propiedades calculadas) -->
            <div class="stats-vue">
                <span>📦 Productos: {{ totalProductos }}</span>
                <span>💵 Promedio: €{{ precioPromedio }}</span>
            </div>
            
            <!-- 8.2) v-if: renderizado condicional -->
            <p v-if="productosFiltrados.length === 0" class="mensaje-vacio">
                No se encontraron productos
            </p>
            
            <!-- 8.2) v-for: lista de productos -->
            <div v-else class="productos-grid">
                <div 
                    v-for="producto in productosFiltrados" 
                    :key="producto.id"
                    class="producto-card"
                >
                    <!-- 8.2) v-bind: atributos dinámicos -->
                    <img :src="producto.imagen" :alt="producto.nombre" />
                    <h4>{{ producto.nombre }}</h4>
                    <span class="precio">€{{ parseFloat(producto.precio).toFixed(2) }}</span>
                    
                    <!-- 8.5) CSS dinámico con :class -->
                    <span 
                        class="badge-disponibilidad"
                        :class="obtenerClaseDisponibilidad(producto.disponibilidad)"
                    >
                        {{ producto.disponibilidad == 1 ? '✓ Disponible' : '✗ Agotado' }}
                    </span>
                    
                    <!-- 8.2) v-on con método, 8.2) v-bind para disabled -->
                    <button 
                        @click="agregarAlCarrito(producto)"
                        :disabled="producto.disponibilidad == 0"
                        class="btn-agregar-producto"
                    >
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `
};

// Crear la aplicación Vue
createApp({
    components: {
        'lista-productos': ListaProductos
    }
}).mount('#appProductos');