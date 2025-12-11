const form = document.querySelector("#formRegistro");
const inputs = form.querySelectorAll("input");

const URL_PHP = "index.php";

// ===============================
// Validaciones
// ===============================
const validators = {
    name: { regex: /^[A-Z][a-z]+$/, test(v){ return this.regex.test(v);} },
    lastName: { regex: /^[A-Z][a-z]+(\s[A-Z][a-z]+)?$/, test(v){ return this.regex.test(v);} },
    dni: { regex: /^[XYZ]?\d{7,8}[A-Z]$/, test(v){ return this.regex.test(v);} },
    fechaNacimiento: { regex:/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, test(v){ return this.regex.test(v);} },
    codigoPostal: { regex:/^[0-5]\d{4}$/, test(v){ return this.regex.test(v);} },
    email: { regex:/^[\w\.-]+@[\w\.-]+\.\w{2,7}$/, test(v){ return this.regex.test(v);} },
    telefonoF: { regex:/^[89]\d{8}$/, test(v){ return this.regex.test(v);} },
    telefonoM: { regex:/^[67]\d{8}$/, test(v){ return this.regex.test(v);} },
    IBAN: { regex:/^ES\d{22}$/, test(v){ return this.regex.test(v);} },
    tarjeta: { regex:/^\d{16}$/, test(v){ return this.regex.test(v);} },
    contrasena: { regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/, test(v){ return this.regex.test(v);} }
};

// ===============================
// Funciones auxiliares
// ===============================
function formToJSON() {
    let obj = {};
    inputs.forEach(input => obj[input.name] = input.value);
    return obj;
}

function fillForm(data) {
    inputs.forEach(input => {
        input.value = data[input.name] || "";
        validarCampo(input);
    });
}

function validarCampo(campo) {
    const nombre = campo.name;
    if(nombre === "repetir"){ return validarRepetir(); }
    if(validators[nombre]?.test(campo.value)) {
        campo.classList.add("valid");
        campo.classList.remove("invalid");
    } else {
        campo.classList.add("invalid");
        campo.classList.remove("valid");
    }
}

function validarRepetir(){
    const pass1 = document.querySelector(".contrasena").value;
    const pass2 = document.querySelector(".repetir").value;
    if(pass1 === pass2 && pass2 !== ""){
        document.querySelector(".repetir").classList.add("valid");
        document.querySelector(".repetir").classList.remove("invalid");
        return true;
    } else {
        document.querySelector(".repetir").classList.add("invalid");
        document.querySelector(".repetir").classList.remove("valid");
        return false;
    }
}

function hayErrores() {
    let errores = [];
    inputs.forEach(input => {
        const nombre = input.name;
        if(nombre === "repetir") {
            if(!validarRepetir()) errores.push("Contraseñas no coinciden");
        } else if(validators[nombre] && !validators[nombre].test(input.value)) {
            errores.push(nombre);
        }
    });
    return errores;
}

// ===============================
// Botones
// ===============================
document.querySelector("#btnGetjson").addEventListener("click", async () => {
    try {
        const res = await fetch(URL_PHP + "?action=json");
        const data = await res.json();
        fillForm(data);
        alert("✅ Datos cargados desde JSON");
    } catch(e) { alert("❌ Error leyendo JSON"); }
});

document.querySelector("#btnPosphp").addEventListener("click", async () => {
    const errores = hayErrores();
    if(errores.length) { alert("❌ Campos mal completados: " + errores.join(", ")); return; }

    try {
        const obj = formToJSON();
        const res = await fetch(URL_PHP + "?action=json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });
        const data = await res.json();
        form.reset();
        alert("✅ PHP recibió y devolvió los datos");
    } catch(e){ alert("❌ Error enviando datos a PHP"); }
});

document.querySelector("#btnGetphp").addEventListener("click", async () => {
    try {
        const res = await fetch(URL_PHP + "?action=json");
        const data = await res.json();
        if(data.error){ alert("❌ " + data.error); return; }
        fillForm(data);
        alert("✅ Datos recuperados desde PHP");
    } catch(e){ alert("❌ Error obteniendo datos desde PHP"); }
});

document.querySelector("#btnPostSQL").addEventListener("click", async () => {
    const errores = hayErrores();
    if(errores.length) { alert("❌ Campos mal completados: " + errores.join(", ")); return; }

    try {
        const obj = formToJSON();
        const formData = new FormData();
        for (let k in obj) formData.append(k, obj[k]);

        const res = await fetch(URL_PHP + "?action=db", { method: "POST", body: formData });
        const data = await res.json();
        form.reset();
        alert(data.mensaje || data.error || "✅ Insertado en BD correctamente");
    } catch(e){ alert("❌ Error al insertar en BD"); }
});

document.querySelector("#btnGetSQL").addEventListener("click", async () => {
    try {
        const dni = document.querySelector(".dni").value.toUpperCase().trim();
        const res = await fetch(URL_PHP + "?action=db&dni=" + dni);
        const data = await res.json();
        if(data.error){ alert("❌ " + data.error); return; }
        fillForm(data);
        alert("✅ Registro recuperado desde BD");
    } catch(e){ alert("❌ Error obteniendo datos de BD"); }
});
