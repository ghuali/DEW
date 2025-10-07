const filas = 8;
const columnas = 6; // 3 asientos izquierda, pasillo, 3 asientos derecha
const preciosCategorias = { business: 160, economica: 100, lowcost: 60 };
let html = '';
html += '<table class="tabla-asientos">';
html += '<tr><th></th><th>1</th><th>2</th><th>3</th><th></th><th>4</th><th>5</th><th>6</th></tr>';
for (let f = 0; f < filas; f++) {
    html += `<tr><th>${f + 1}</th>`;
    for (let c = 0; c < 7; c++) { // 0,1,2 = asientos izq; 3 = pasillo; 4,5,6 = asientos der
        if (c === 3) {
            html += '<td class="pasillo"></td>';
            continue;
        }
        let categoria = f === 0 ? 'business' : (f < 4 ? 'economica' : 'lowcost');
        let libre = true;
        let color = libre ? 'green' : 'red';
        html += `<td class="${categoria}">${preciosCategorias[categoria]}€<br><span style="color:${color}">${libre ? 'Libre' : 'Ocupado'}</span></td>`;
    }
    html += '</tr>';
}
html += '</table>';
document.write(html);
setTimeout(() => {
    const head = document.head || document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'style.css';
    head.appendChild(link);
}, 0);