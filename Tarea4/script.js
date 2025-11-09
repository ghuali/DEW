// =============================
//  GESTOR DE ARCHIVOS Y CARPETAS
// =============================

// --- OBJETO CONSTRUCTOR PARA NODOS ---
function Nodo(nombre, tipo) {
  this.nombre = nombre;
  this.tipo = tipo; // "carpeta" o "archivo"
}

// --- REFERENCIAS PRINCIPALES ---
const list = document.querySelector("#ex-list ul");
const hideCheckbox = document.querySelector("#hide");
const searchBar = document.querySelector("#search-ex input");

// =============================
//  EVENTOS DE INTERFAZ
// =============================

// 📦 Ocultar o mostrar toda la lista
hideCheckbox.addEventListener("change", () => {
  list.style.display = hideCheckbox.checked ? "none" : "initial";
});

// 🎯 Delegación de eventos en toda la lista (clicks del ratón)
list.addEventListener("click", (e) => {
  const target = e.target;

  // --- 🗑️ ELIMINAR ---
  if (target.classList.contains("delete")) {
    eliminarNodo(target);
  }

  // --- ➕ AGREGAR ---
  if (target.classList.contains("add")) {
    agregarNodo(target);
  }
});

// ✅ Mostrar / ocultar contenido de carpetas con checkbox
list.addEventListener("change", (e) => {
  if (e.target.classList.contains("toggle")) {
    const li = e.target.closest("li");
    const subLista = li.querySelector("ul");
    if (subLista) subLista.style.display = e.target.checked ? "block" : "none";
  }
});

// 🔎 Filtrar elementos en tiempo real
searchBar.addEventListener("keyup", (e) => {
  filtrarNodos(e.target.value.toLowerCase());
});

// ⌨️ Autocompletar con tecla TAB
searchBar.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    autocompletarBusqueda(searchBar.value.toLowerCase());
  }
});

// =============================
//  FUNCIONES PRINCIPALES
// =============================

// 🗑️ Eliminar nodo si está vacío o es archivo
function eliminarNodo(elemento) {
  const li = elemento.closest("li");
  const subLista = li.querySelector("ul");

  if (subLista && subLista.children.length > 0) {
    alert("❌ No puedes borrar esta carpeta, contiene elementos dentro.");
    return;
  }

  li.remove();
}

// ➕ Crear carpeta o archivo
function agregarNodo(elemento) {
  const liPadre = elemento.closest("li");
  const tipo = prompt('¿Qué quieres crear? Escribe "carpeta" o "archivo":');
  if (!tipo || !["carpeta", "archivo"].includes(tipo.toLowerCase())) {
    alert("⚠️ Debes escribir 'carpeta' o 'archivo'.");
    return;
  }

  const nombre = prompt(`Agrega el nombre del ${tipo}:`);
  if (!nombre || nombre.trim() === "") {
    alert("⚠️ El nombre no puede estar vacío.");
    return;
  }

  // Crear objeto Nodo
  const nuevoNodo = new Nodo(nombre.trim(), tipo.toLowerCase());

  // Verificar duplicado en el mismo nivel
  let subLista = liPadre.querySelector("ul");
  if (!subLista) {
    subLista = document.createElement("ul");
    liPadre.appendChild(subLista);
  }

  const yaExiste = [...subLista.children].some(
    (li) =>
      li.querySelector(".name")?.textContent
        .toLowerCase()
        .includes(nuevoNodo.nombre.toLowerCase())
  );
  if (yaExiste) {
    alert("⚠️ Ya existe un elemento con ese nombre en esta carpeta.");
    return;
  }

  // Crear nuevo elemento <li>
  const liNuevo = crearElementoNodo(nuevoNodo);
  subLista.appendChild(liNuevo);
}

// 🔧 Crear elemento visual del nodo
function crearElementoNodo(nodo) {
  const li = document.createElement("li");
  li.dataset.tipo = nodo.tipo;

  // --- Botón borrar ---
  const btnBorrar = document.createElement("span");
  btnBorrar.textContent = "borrar";
  btnBorrar.classList.add("delete");

  // --- Nombre ---
  const spanNombre = document.createElement("span");
  spanNombre.classList.add("name");
  spanNombre.textContent =
    nodo.tipo === "carpeta" ? `📁 ${nodo.nombre}` : `📄 ${nodo.nombre}`;

  li.appendChild(btnBorrar);

  // --- Si es carpeta, agregar checkbox y botón "+" ---
  if (nodo.tipo === "carpeta") {
    const etiqueta = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.classList.add("toggle");
    checkbox.checked = true;
    etiqueta.appendChild(checkbox);

    const btnAgregar = document.createElement("span");
    btnAgregar.textContent = "agregar";
    btnAgregar.classList.add("add");

    const subUl = document.createElement("ul");

    li.appendChild(etiqueta);
    li.appendChild(spanNombre);
    li.appendChild(btnAgregar);
    li.appendChild(subUl);
  } else {
    li.appendChild(spanNombre);
  }

  return li;
}

// 🔍 Filtrar archivos y carpetas
function filtrarNodos(termino) {
  const nodos = list.querySelectorAll("li");
  nodos.forEach((nodo) => {
    const nombre = nodo.querySelector(".name")?.textContent.toLowerCase() || "";
    nodo.style.display = nombre.includes(termino) ? "block" : "none";
  });
}

// ⚡ Autocompletar con TAB si hay una sola coincidencia
function autocompletarBusqueda(termino) {
  if (!termino) return;

  const nombres = [...list.querySelectorAll(".name")].map((el) =>
    el.textContent.toLowerCase().replace("📁 ", "").replace("📄 ", "")
  );

  const coincidencias = nombres.filter((n) => n.includes(termino));

  if (coincidencias.length === 1) {
    searchBar.value = coincidencias[0];
  }
}
