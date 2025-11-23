// OBJETO DE VALIDACIONES
const validators = {
    name: {
        regex: /^[A-Z][a-z]+$/,
        test(value) { return this.regex.test(value); }
    },
    lastName: {
        regex: /^[A-Z][a-z]+(\s[A-Z][a-z]+)?$/,
        test(value) { return this.regex.test(value); }
    },
    dni: {
        regex: /^[XYZ]?\d{7,8}[A-Z]$/,
        test(value) { return this.regex.test(value); }
    },
    fechaNacimiento: {
        regex: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        test(value) { return this.regex.test(value); }
    },
    codigoPostal: {
        regex: /^[0-5]\d{4}$/,
        test(value) { return this.regex.test(value); }
    },
    email: {
        regex: /^[\w\.-]+@[\w\.-]+\.\w{2,7}$/,
        test(value) { return this.regex.test(value); }
    },
    telefonoF: {
        regex: /^[89]\d{8}$/,
        test(value) { return this.regex.test(value); }
    },
    telefonoM: {
        regex: /^[67]\d{8}$/,
        test(value) { return this.regex.test(value); }
    },
    IBAN: {
        regex: /^ES\d{22}$/,
        test(value) { return this.regex.test(value); }
    },
    tarjeta: {
        regex: /^\d{16}$/,
        test(value) { return this.regex.test(value); }
    },
    contrasena: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/,
        test(value) { return this.regex.test(value); }
    }
};

// ------------------------------------

const form = document.querySelector("#formRegistro");
const inputs = form.querySelectorAll("input");
const btnGuardar = document.querySelector("#btnGuardar");
const btnRecuperar = document.querySelector("#btnRecuperar");

inputs.forEach(input => {
    input.addEventListener("keyup", () => validarCampo(input));
    input.addEventListener("blur", () => validarCampo(input));
});

function validarCampo(campo) {
    const nombre = campo.name;

    if (nombre === "repetir") {
        validarRepetir();
        return;
    }

    if (validators[nombre].test(campo.value)) {
        campo.classList.remove("invalid");
        campo.classList.add("valid");
    } else {
        campo.classList.remove("valid");
        campo.classList.add("invalid");
    }
}

function validarRepetir() {
    const pass1 = document.querySelector(".contrasena");
    const pass2 = document.querySelector(".repetir");

    if (pass1.value === pass2.value && pass1.value !== "") {
        pass2.classList.add("valid");
        pass2.classList.remove("invalid");
    } else {
        pass2.classList.add("invalid");
        pass2.classList.remove("valid");
    }
}

// ------------------------------------
// GUARDAR EN SESSION STORAGE
// ------------------------------------

btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();

    // comprobar si todo es válido
    let valido = true;
    inputs.forEach(input => {
        validarCampo(input);
        if (!input.classList.contains("valid")) valido = false;
    });

    if (!valido) {
        alert("Hay campos inválidos.");
        return;
    }

    let datos = {};

    inputs.forEach(input => {
        datos[input.name] = input.value;
    });

    sessionStorage.setItem("registro", JSON.stringify(datos));

    alert("Datos guardados correctamente");
});

// ------------------------------------
// RECUPERAR
// ------------------------------------

btnRecuperar.addEventListener("click", e => {
    e.preventDefault();

    const data = sessionStorage.getItem("registro");
    if (!data) {
        alert("No hay datos guardados.");
        return;
    }

    const json = JSON.parse(data);

    inputs.forEach(input => {
        input.value = json[input.name] || "";
        validarCampo(input);
    });

    alert("Datos recuperados");
});
