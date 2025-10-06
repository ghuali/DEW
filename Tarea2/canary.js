document.addEventListener('DOMContentLoaded', () => {
    const filas = 5;
    const columnas = 4;
    const preciosCategorias = { business: 180, economica: 110, lowcost: 70 };
    let html = `<h3>CanaryFly</h3>`;
    html += '<table class="tabla-asientos">';
    html += '<tr><th></th><th>1</th><th>2</th><th></th><th>3</th><th>4</th></tr>';
    for (let f = 0; f < filas; f++) {
        html += `<tr><th>${f + 1}</th>`;
        for (let c = 0; c < columnas + 1; c++) {
            if (c === 2) {
                html += '<td class="pasillo"></td>'; // Pasillo central
                continue;
            }
            let realCol = c > 2 ? c - 1 : c;
            let categoria = f === 0 ? 'business' : (f < 2 ? 'economica' : 'lowcost');
            let libre = true; // Aquí podrías cambiar a false para simular ocupados
            let color = libre ? 'green' : 'red';
            html += `<td class="${categoria}">${preciosCategorias[categoria]}€<br><span style="color:${color}">${libre ? 'Libre' : 'Ocupado'}</span></td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    // ADVERTENCIA: document.write reemplaza el HTML y puede romper los estilos CSS.
    // Si tu profesor exige document.write, déjalo así. Si quieres que los estilos funcionen, usa la línea comentada abajo.
    document.write(html);
    // document.getElementById('tabla-asientos').innerHTML = html;
});