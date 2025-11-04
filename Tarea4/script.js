//https://www.w3schools.com/html/html_forms.asp


// DEFINICIÓN DE FORMULARIOS Y LISTA

const searchForm=document.forms[0]; // Accede al primer formulario en el documento (índice [0]) y lo almacena en 'searchForm'.

const addForm=document.forms["add-ex"]; // Accede al formulario con el nombre add-ex y lo guarda en addForm.

const list = document.querySelector('#ex-list ul'); // Selecciona el elemento 'ul' dentro del contenedor ''#ex-list' y lo asigna a list, donde se listarán los ejercicios.


// OCULTAR EJERCICIOS


const hideBox = document.querySelector('#hide'); //Selecciona el elemento con id hide, que probablemente es un checkbox para ocultar la lista de ejercicios.
// Añade un evento 'change' al checkbox 'hideBox' que se dispara al marcar o desmarcar.
hideBox.addEventListener('change', function(){
  // Si hideBox está marcado 'checked', oculta la lista de ejercicios (display: none); 
  if(hideBox.checked){
    list.style.display = "none";
    // si está desmarcado, vuelve a mostrarla (display: initial).
  } else {
    list.style.display = "initial";
  }
});


// Delegación de eventos sobre toda la lista
list.addEventListener('click', function(e) {
  const target = e.target;

  // 🗑️ --- BORRAR DIRECTORIOS O ELEMENTOS ---
  if (target.classList.contains('delete')) {
    const li = target.closest('li'); // obtenemos el <li> más cercano
    const subList = li.querySelector('ul'); // buscamos si tiene un <ul> dentro (subelementos)

    // Si tiene hijos, no se puede borrar
    if (subList && subList.children.length > 0) {
      alert('❌ No puedes borrar este directorio, contiene elementos dentro.');
      return;
    }

    // Si no tiene hijos, se puede borrar
    li.remove();
  }

  // ➕ --- AGREGAR NUEVO ELEMENTO ---
  if (target.classList.contains('add')) {
  const parentLi = target.closest('li');



  const tipo = prompt('¿Qué quieres crear? Escribe "carpeta" o "archivo":');
  if (!tipo || !['carpeta', 'archivo'].includes(tipo.toLowerCase())) {
    alert('⚠️ Debes escribir "carpeta" o "archivo".');
    return;
  }

  const nombre = prompt(`Agrega el nombre del ${tipo}:`);
  if (!nombre || nombre.trim() === '') {
    alert('⚠️ Debes escribir un nombre válido.');
    return;
  }

  const li = document.createElement('li');
  const nombreSpan = document.createElement('span');
  const deleteBtn = document.createElement('span');

  nombreSpan.textContent =
    tipo === 'carpeta' ? `📁 ${nombre}` : `📄 ${nombre}`;
  nombreSpan.classList.add('name');
  deleteBtn.textContent = 'borrar';
  deleteBtn.classList.add('delete');
  li.dataset.tipo = tipo;

  // --- Si es carpeta ---
  if (tipo === 'carpeta') {
    const addBtn = document.createElement('span');
    addBtn.textContent = 'agregar';
    addBtn.classList.add('add');

    const subUl = document.createElement('ul');

    li.appendChild(nombreSpan);
    li.appendChild(deleteBtn);
    li.appendChild(addBtn);
    li.appendChild(subUl);
  }

  // --- Si es archivo ---
  if (tipo === 'archivo') {
    li.appendChild(nombreSpan);
    li.appendChild(deleteBtn);
    // No se agrega botón "agregar"
  }

  // Buscar el <ul> donde insertar el nuevo elemento
  let parentUl = parentLi.querySelector('ul');
  if (!parentUl) {
    parentUl = document.createElement('ul');
    parentLi.appendChild(parentUl);
  }

  parentUl.appendChild(li);
}

});


// FILTRAR EJERCICIOS

const searchBar = document.forms['search-ex'].querySelector('input'); // Selecciona el campo de entrada dentro del formulario search-ex para buscar ejercicios y lo guarda en searchBar.
// Añade un evento 'keyup' al campo de búsqueda que se ejecutará cada vez que se suelte una tecla.
searchBar.addEventListener('keyup',(e)=>{// FUNCIÓN DE FLECHA
   
  const term = e.target.value.toLowerCase();// to insure matches para asegurar coincidencias --> Convierte el texto de búsqueda en minúsculas para realizar una comparación insensible a mayúsculas.
  
  const exercises = list.getElementsByTagName('li'); // Obtiene todos los elementos 'li' de list (la lista de ejercicios).
  
  // Convierte exercises en un array y recorre cada ejercicio (exer) en la lista.
  Array.from(exercises).forEach(function (exer){ //FOR EACH instead of for loop
    // Obtiene el texto del primer elemento hijo (el nombre del ejercicio) dentro de cada <li>.
    const title = exer.firstElementChild.textContent;   
    // Si el término de búsqueda no se encuentra en el título (indexOf(term) == -1), oculta el ejercicio (display: none). 
    if(title.toLowerCase().indexOf(term) == -1){ //-1 significa no presente
      exer.style.display = 'none';
      // Si lo encuentra, muestra el ejercicio (display: block).
    } else {
      exer.style.display = 'block';
    }
  });
});