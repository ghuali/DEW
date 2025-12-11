// ===============================
// VALIDACIONES 
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
// REFERENCIAS A INPUTS
// ===============================
const form = document.querySelector("#formRegistro");
const inputs = form.querySelectorAll("input");

// INPUTS OBJETO PARA EXPORTAR JSON
function formToJSON() {
    let obj = {};
    inputs.forEach(input => obj[input.name] = input.value);
    return obj;
}

// LLENAR FORM DESDE OBJETO
function fillForm(data) {
    inputs.forEach(input => {
        input.value = data[input.name] || "";
        validarCampo(input);
    });
}

// VALIDACIONES
inputs.forEach(input => {
    input.addEventListener("keyup", () => validarCampo(input));
    input.addEventListener("blur", () => validarCampo(input));
});

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
    const pass1 = document.querySelector(".contrasena");
    const pass2 = document.querySelector(".repetir");
    if(pass1.value === pass2.value && pass1.value !== ""){
        pass2.classList.add("valid");
        pass2.classList.remove("invalid");
    } else {
        pass2.classList.add("invalid");
        pass2.classList.remove("valid");
    }
}

// ===============================
// BOTONES SERVIDOR
// ===============================
const btnGetJSON = document.querySelector("#btnGetjson");
const btnPostPHP = document.querySelector("#btnPosphp");
const btnGetPHP = document.querySelector("#btnGetphp");
const btnPostSQL = document.querySelector("#btnPostSQL");
const btnGetSQL = document.querySelector("#btnGetSQL");

// ARCHIVOS SERVIDOR
const URL_JSON = "datos.json";
const URL_POST_PHP = "post.php";
const URL_GET_PHP = "get.php";
const URL_SQL_INSERT = "insertSQL.php";
const URL_SQL_SELECT = "getSQL.php";

// ===============================
// 1. GET JSON (.json)
// ===============================
btnGetJSON.addEventListener("click", async () => {
    try {
        const res = await fetch(URL_JSON);
        const data = await res.json();
        fillForm(data);
        alert("Datos cargados desde JSON");
    } catch (e) {
        alert("Error leyendo JSON");
    }
});

// ===============================
// 2. POST PHP (envía JSON y rebota)
// ===============================
btnPostPHP.addEventListener("click", async () => {
    const obj = formToJSON();

    const res = await fetch(URL_POST_PHP, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(obj)
    });

    const data = await res.json();
    alert("PHP recibió y devolvió los datos");
    console.log(data);
});

// ===============================
// 3. GET PHP (recupera último objeto)
// ===============================
btnGetPHP.addEventListener("click", async () => {
    const res = await fetch(URL_GET_PHP);
    const data = await res.json();
    fillForm(data);
    alert("Datos recuperados desde PHP");
});

// ===============================
// 4. POST SQL (insertar en BD)
// ===============================
btnPostSQL.addEventListener("click", async () => {
    const obj = formToJSON();

    const res = await fetch(URL_SQL_INSERT, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(obj)
    });

    const data = await res.json();
    alert(data.mensaje || "Insertado en BD");
});

// ===============================
// 5. GET SQL (buscar por DNI)
// ===============================
btnGetSQL.addEventListener("click", async () => {
    const dni = document.querySelector(".dni").value;

    const res = await fetch(URL_SQL_SELECT + "?dni=" + dni);
    const data = await res.json();

    if(data.error){
        alert("No existe en la BD");
        return;
    }

    fillForm(data);
    alert("Registro recuperado desde SQL");
});
