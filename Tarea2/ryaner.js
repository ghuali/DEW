
(function () {
  const AEROLINEA = 'ryaner';
  const FILAS = 8;
  const COLUMNAS = 6; // 3 izq, pasillo, 3 der (visual 7 con pasillo en 4)
  const PRECIOS_CATEGORIAS = { business: 160, economica: 100, lowcost: 60 };
  const CLAVE_VENDIDOS = `vendidos_${AEROLINEA}`;
  const CLAVE_SESION = `sesion_${AEROLINEA}`;

  function obtenerVendidos() { return JSON.parse(localStorage.getItem(CLAVE_VENDIDOS) || '[]'); }
  function guardarVendidos(lista) { localStorage.setItem(CLAVE_VENDIDOS, JSON.stringify(lista)); }
  function obtenerSesion() { return JSON.parse(sessionStorage.getItem(CLAVE_SESION) || '[]'); }
  function guardarSesion(lista) { sessionStorage.setItem(CLAVE_SESION, JSON.stringify(lista)); }

  function construirAsientos() {
    const asientos = [];
    for (let r = 1; r <= FILAS; r++) {
      for (let c = 1; c <= COLUMNAS; c++) {
        asientos.push({ id: `R${r}C${c}`, fila: r, col: c, categoria: (r === 1 ? 'business' : (r < 5 ? 'economica' : 'lowcost')) });
      }
    }
    return asientos;
  }
  const ASIENTOS = construirAsientos();

  function reservarPlaza(idAsiento) {
    const vendidos = obtenerVendidos();
    if (vendidos.includes(idAsiento)) return false;
    const sesion = obtenerSesion();
    if (!sesion.includes(idAsiento)) { sesion.push(idAsiento); guardarSesion(sesion); }
    return true;
  }

  function liberarPlaza(idAsiento) {
    const sesion = obtenerSesion();
    const i = sesion.indexOf(idAsiento);
    if (i !== -1) { sesion.splice(i, 1); guardarSesion(sesion); }
  }

  function dibujarTablaYControles() {
    const vendidos = obtenerVendidos();
    let html = '';
    html += '<h2>Ryaner — Asientos</h2>';
    html += '<table class="tabla-asientos">';
    html += '<tr><th></th><th>1</th><th>2</th><th>3</th><th></th><th>4</th><th>5</th><th>6</th></tr>';
    for (let r = 1; r <= FILAS; r++) {
      html += `<tr><th>${r}</th>`;
      for (let c = 1; c <= 7; c++) {
        if (c === 4) { html += '<td class="pasillo"></td>'; continue; }
        const realCol = c < 4 ? c : c - 1;
        const id = `R${r}C${realCol}`;
        const asiento = ASIENTOS.find(s => s.id === id);
        const estaVendido = vendidos.includes(id);
        const precio = PRECIOS_CATEGORIAS[asiento.categoria];
        html += `<td class="${asiento.categoria}" data-asiento="${id}" style="background:${estaVendido ? '#f88' : '#8f8'}">${precio}€<br><span class="estado">${estaVendido ? 'Ocupado' : 'Libre'}</span></td>`;
      }
      html += '</tr>';
    }
    html += '</table>';

    // controles (se generan con document.write)
    html += '<div class="controles">';
    html += '<label><input type="checkbox" id="residente_ryaner"> Soy residente (75% descuento)</label> ';
    html += '<span id="info_ryaner">Total: 0€ (0 asientos)</span> ';
    html += '<button id="confirmar_ryaner">Confirmar reserva (mantén pulsado)</button> ';
    html += '<button id="cancelar_ryaner">Cancelar selección</button>';
    html += '</div>';

    document.write(html);

    // aseguramos que el DOM incluye lo escrito antes de asignar handlers
    setTimeout(() => {
      // asignar eventos a cada celda
      const celdas = document.querySelectorAll('td[data-asiento]');
      celdas.forEach(td => {
        const id = td.getAttribute('data-asiento');
        const estaVendido = obtenerVendidos().includes(id);

        // onmouseover / onmouseleave
        td.onmouseover = function () { if (!estaVendido) td.style.boxShadow = '0 0 6px rgba(0,0,0,0.4)'; };
        td.onmouseleave = function () { td.style.boxShadow = ''; };

        // onmousedown / onmouseup visual pequeño
        td.onmousedown = function () { if (!estaVendido) td.style.transform = 'scale(0.98)'; };
        td.onmouseup = function () { td.style.transform = ''; };

        // onclick -> toggle en sessionStorage
        td.onclick = function () {
          const idLocal = td.getAttribute('data-asiento');
          // si está vendido, preguntar si queremos liberarlo
          if (obtenerVendidos().includes(idLocal)) {
            const respuesta = prompt('Este asiento está ocupado. Escribe S para marcarlo como libre, otra tecla para cancelar:');
            if (respuesta && respuesta.trim().toUpperCase() === 'S') {
              const vendidosAct = obtenerVendidos();
              const idx = vendidosAct.indexOf(idLocal);
              if (idx !== -1) {
                vendidosAct.splice(idx, 1);
                guardarVendidos(vendidosAct);
                // actualizar visual de esta celda
                td.style.background = '#dff0d8';
                td.style.cursor = 'pointer';
                const estado = td.querySelector('.estado');
                if (estado) estado.textContent = 'Libre';
                alert(`Asiento ${idLocal} marcado como libre.`);
              } else {
                alert('Error: no se encontró el asiento en la lista de vendidos.');
              }
            }
            return;
          }
          const sesion = obtenerSesion();
          if (!sesion.includes(idLocal)) {
            reservarPlaza(idLocal);
            td.style.background = '#d9534f';
            td.querySelector('.estado').textContent = 'Reservado';
          } else {
            liberarPlaza(idLocal);
            td.style.background = '#dff0d8';
            td.querySelector('.estado').textContent = 'Libre';
          }
          actualizarInfo();
        };
      });

      // controles
      const residente = document.getElementById('residente_ryaner');
      const info = document.getElementById('info_ryaner');
      const confirmar = document.getElementById('confirmar_ryaner');
      const cancelar = document.getElementById('cancelar_ryaner');

      residente.onclick = actualizarInfo;
      function actualizarInfo() {
        const sesion = obtenerSesion();
        let total = 0;
        sesion.forEach(id => { const s = ASIENTOS.find(x => x.id === id); if (s) total += PRECIOS_CATEGORIAS[s.categoria]; });
        const esRes = residente.checked;
        const totalFinal = esRes ? total * 0.25 : total;
        info.textContent = `Total: ${totalFinal.toFixed(2)}€ (${sesion.length} asientos)`;
      }

      // Confirmación con hold (onmousedown/onmouseup)
      let inicioHold = 0;
      confirmar.onmousedown = function () {
        inicioHold = Date.now();
        confirmar.textContent = 'Mantén pulsado para confirmar...';
      };
      confirmar.onmouseup = function () {
        const tiempo = Date.now() - inicioHold;
        confirmar.textContent = 'Confirmar reserva (mantén pulsado)';
        if (tiempo >= 600) {
          const sesion = obtenerSesion(); // guardamos selección actual
          if (sesion.length === 0) { alert('No has seleccionado asientos.'); return; }
          let total = 0;
          sesion.forEach(id => { const s = ASIENTOS.find(x => x.id === id); if (s) total += PRECIOS_CATEGORIAS[s.categoria]; });
          const esRes = residente.checked;
          const totalFinal = esRes ? total * 0.25 : total;

          // marcar vendidos (persistir)
          const vendidosAct = obtenerVendidos();
          sesion.forEach(id => { if (!vendidosAct.includes(id)) vendidosAct.push(id); });
          guardarVendidos(vendidosAct);
          guardarSesion([]); // limpiamos sesión
          alert(`Compra confirmada. Total pagado: ${totalFinal.toFixed(2)}€`);

          const change = confirm('¿Deseas cambiar tu elección y repetir? (Aceptar = repetir, Cancelar = finalizar)');
          if (change) {
            // si repite, quitamos los asientos que acabamos de marcar como vendidos
            const actuales = obtenerVendidos();
            sesion.forEach(id => {
              const idx = actuales.indexOf(id);
              if (idx !== -1) actuales.splice(idx, 1);
            });
            guardarVendidos(actuales);
            location.reload();
          } else {
            actualizarCeldasPostVenta();
            actualizarInfo();
          }
        } else {
          alert('Operación no confirmada. Mantén pulsado más tiempo para confirmar.');
        }
      };

      cancelar.onclick = function () {
        // liberar selección temporal
        const sesion = obtenerSesion().slice();
        sesion.forEach(id => liberarPlaza(id));
        // actualizar visual
        const celdas2 = document.querySelectorAll('td[data-asiento]');
        celdas2.forEach(td => {
          const id = td.getAttribute('data-asiento');
          if (!obtenerVendidos().includes(id)) {
            td.style.background = '#8f8f8'; 
            td.style.background = '#dff0d8';
            td.querySelector('.estado').textContent = 'Libre';
          }
        });
        guardarSesion([]);
        actualizarInfo();
        alert('Selección cancelada.');
      };

      function actualizarCeldasPostVenta() {
        const vendidosNow = obtenerVendidos();
        const celdas3 = document.querySelectorAll('td[data-asiento]');
        celdas3.forEach(td => {
          const id = td.getAttribute('data-asiento');
          if (vendidosNow.includes(id)) {
            td.style.background = '#aaa';
            td.style.cursor = 'not-allowed';
            td.querySelector('.estado').textContent = 'Ocupado';
          } else {
            td.style.background = '#dff0d8';
            td.style.cursor = 'pointer';
            const ses = obtenerSesion();
            td.querySelector('.estado').textContent = ses.includes(id) ? 'Reservado' : 'Libre';
          }
        });
      }

      // inicializa info y estado
      actualizarInfo();
      actualizarCeldasPostVenta();
    }, 0);
  }

  // iniciar
  try { dibujarTablaYControles(); } catch (e) { console.error('Error Ryaner:', e); }

  window.reservarPlazaRyaner = reservarPlaza;
  window.liberarPlazaRyaner = liberarPlaza;
})();