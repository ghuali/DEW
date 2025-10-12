// ...existing code...
(function () {
  const AEROLINEA = 'canary';
  const FILAS = 5;
  const COLUMNAS = 4; // visual COLUMNAS+1 con pasillo en posición 3
  const PRECIOS_CATEGORIAS = { business: 180, economica: 110, lowcost: 70 };
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
        asientos.push({ id: `R${r}C${c}`, fila: r, col: c, categoria: (r === 1 ? 'business' : (r < 3 ? 'economica' : 'lowcost')) });
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
    html += '<h2>CanaryFly — Asientos</h2>';
    html += '<table class="tabla-asientos">';
    html += '<tr><th></th><th>1</th><th>2</th><th></th><th>3</th><th>4</th></tr>';
    for (let r = 1; r <= FILAS; r++) {
      html += `<tr><th>${r}</th>`;
      for (let c = 1; c <= COLUMNAS + 1; c++) {
        if (c === 3) { html += '<td class="pasillo"></td>'; continue; }
        const realCol = c > 3 ? c - 1 : c;
        const id = `R${r}C${realCol}`;
        const asiento = ASIENTOS.find(s => s.id === id);
        const estaVendido = vendidos.includes(id);
        const precio = PRECIOS_CATEGORIAS[asiento.categoria];
        html += `<td class="${asiento.categoria}" data-asiento="${id}" style="background:${estaVendido ? '#f88' : '#8f8'}">${precio}€<br><span class="estado">${estaVendido ? 'Ocupado' : 'Libre'}</span></td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
    html += '<div class="controles">';
    html += '<label><input type="checkbox" id="residente_canary"> Soy residente (75% descuento)</label> ';
    html += '<span id="info_canary">Total: 0€ (0 asientos)</span> ';
    html += '<button id="confirmar_canary">Confirmar reserva (mantén pulsado)</button> ';
    html += '<button id="cancelar_canary">Cancelar selección</button>';
    html += '</div>';

    document.write(html);

    setTimeout(() => {
      const celdas = document.querySelectorAll('td[data-asiento]');
      celdas.forEach(td => {
        const id = td.getAttribute('data-asiento');
        td.onmouseover = function () { if (!obtenerVendidos().includes(id)) td.style.boxShadow = '0 0 6px rgba(0,0,0,0.4)'; };
        td.onmouseleave = function () { td.style.boxShadow = ''; };
        td.onmousedown = function () { if (!obtenerVendidos().includes(id)) td.style.transform = 'scale(0.98)'; };
        td.onmouseup = function () { td.style.transform = ''; };
        td.onclick = function () {
          const id = td.getAttribute('data-asiento');
          // permitir liberar si está vendido
          if (obtenerVendidos().includes(id)) {
            const r = prompt('Este asiento está ocupado. Escribe S para marcarlo como libre, otra tecla para cancelar:');
            if (r && r.trim().toUpperCase() === 'S') {
              const vendidosAct = obtenerVendidos();
              const pos = vendidosAct.indexOf(id);
              if (pos !== -1) {
                vendidosAct.splice(pos, 1);
                guardarVendidos(vendidosAct);
                td.style.background = '#dff0d8';
                td.style.cursor = 'pointer';
                const estado = td.querySelector('.estado');
                if (estado) estado.textContent = 'Libre';
                alert(`Asiento ${id} liberado.`);
              } else {
                alert('Error al liberar el asiento.');
              }
            }
            return;
          }
          const ses = obtenerSesion();
          if (!ses.includes(id)) {
            reservarPlaza(id);
            td.style.background = '#d9534f';
            td.querySelector('.estado').textContent = 'Reservado';
          } else {
            liberarPlaza(id);
            td.style.background = '#dff0d8';
            td.querySelector('.estado').textContent = 'Libre';
          }
          actualizarInfo();
        };
      });

      const residente = document.getElementById('residente_canary');
      const info = document.getElementById('info_canary');
      const confirmar = document.getElementById('confirmar_canary');
      const cancelar = document.getElementById('cancelar_canary');

      residente.onclick = actualizarInfo;

      function actualizarInfo() {
        const ses = obtenerSesion();
        let total = 0;
        ses.forEach(id => { const s = ASIENTOS.find(x => x.id === id); if (s) total += PRECIOS_CATEGORIAS[s.categoria]; });
        const es = residente.checked;
        const tf = es ? total * 0.25 : total;
        info.textContent = `Total: ${tf.toFixed(2)}€ (${ses.length} asientos)`;
      }

      let inicio = 0;
      confirmar.onmousedown = function () { inicio = Date.now(); confirmar.textContent = 'Mantén pulsado para confirmar...'; };
     
      confirmar.onmouseup = function () {
        confirmar.textContent = 'Confirmar reserva (mantén pulsado)';
        const dur = Date.now() - inicio;
        if (dur >= 600) {
          const ses = obtenerSesion(); // guardamos selección actual
          if (ses.length === 0) { alert('No has seleccionado asientos.'); return; }
          let total = 0;
          ses.forEach(id => { const s = ASIENTOS.find(x => x.id === id); if (s) total += PRECIOS_CATEGORIAS[s.categoria]; });
          const es = residente.checked;
          const tf = es ? total * 0.25 : total;

          // marcar vendidos
          const vendidosAct = obtenerVendidos();
          ses.forEach(id => { if (!vendidosAct.includes(id)) vendidosAct.push(id); });
          guardarVendidos(vendidosAct);
          guardarSesion([]);
          alert(`Compra confirmada. Total pagado: ${tf.toFixed(2)}€`);

          const change = confirm('¿Deseas cambiar la elección y repetir? (Aceptar = repetir)');
          if (change) {
            // si repite, quitamos los asientos recién vendidos y recargamos
            const actuales = obtenerVendidos();
            ses.forEach(id => {
              const indice = actuales.indexOf(id);
              if (indice !== -1) actuales.splice(indice, 1);
            });
            guardarVendidos(actuales);
            location.reload();
          } else {
            actualizarCeldasPostVenta();
            actualizarInfo();
          }
        } else { alert('Operación no confirmada. Mantén pulsado más tiempo para confirmar.'); }
      };

      cancelar.onclick = function () {
        
        const ses = obtenerSesion().slice();
        ses.forEach(id => liberarPlaza(id));
        guardarSesion([]);
        document.querySelectorAll('td[data-asiento]').forEach(td => {
          const id = td.getAttribute('data-asiento');
          if (!obtenerVendidos().includes(id)) {
            td.style.background = '#dff0d8';
            const estado = td.querySelector('.estado');
            if (estado) estado.textContent = 'Libre';
            td.style.cursor = 'pointer';
          }
        });
        actualizarInfo();
        alert('Selección cancelada.');
      };


      function actualizarCeldasPostVenta() {
        const vendidosNow = obtenerVendidos();
        document.querySelectorAll('td[data-asiento]').forEach(td => {
          const id = td.getAttribute('data-asiento');
          if (vendidosNow.includes(id)) { td.style.background = '#aaa'; td.style.cursor = 'not-allowed'; td.querySelector('.estado').textContent = 'Ocupado'; }
          else { td.style.background = '#dff0d8'; td.style.cursor = 'pointer'; td.querySelector('.estado').textContent = obtenerSesion().includes(id) ? 'Reservado' : 'Libre'; }
        });
      }

      actualizarInfo();
      actualizarCeldasPostVenta();
    }, 0);
  }

  try { dibujarTablaYControles(); } catch (e) { console.error('Error Canary:', e); }

  window.reservarPlazaCanary = reservarPlaza;
  window.liberarPlazaCanary = liberarPlaza;
})();