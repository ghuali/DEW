//const username=/^[a-z\d]{5,12}$/i;
//const dni=/^[x]*\d{8}[a-z]$/i

 //regex patterns
const patterns = {
      name: /^[A-Z]+[a-z0-9_-]/i,
      lastName: /^[A-Z]+[a-z]\s[A-Z]+[a-z]/i,
      dni: /^[x]*\d{8}[a-z]$/i,
      fechaNacimiento: /(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4} /i,
      email: /^[\w\-\.]+@([\w\-]+\.)+[a-zA-Z]{2,7}$/i,
      telefonoF: /[0-9]{3}-[0-9]{6}/i,
      telefonoM: /[0-9]{3}-[0-9]{6}/i,
      IBAN: /^ES\[0-9]{22}/i,
      tarjeta: /^\[0-9]{16}$/i,
      contrasena: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,}$/i
};

const inputs = document.querySelectorAll('input');

// attach keyup events to inputs
inputs.forEach((input) => {
    input.addEventListener('keyup', (e) => {
         
     if (e.target.name =="dni") {validate(e.target, dni)};
      if (e.target.name =="username") {validate(e.target, username)};
   validate(e.target, patterns[e.target.attributes.name.value]);
      
    });
});
// validation function
function validate(field, regex){

    if(regex.test(field.value)){
        field.className = 'valid';
    } else {
        field.className = 'invalid';
    }

}

tecla= document.querySelector('input');
tecla.addEventListener('beforeinput', (e) => e.preventDefault());
function myFunction(event) {
  let key = event.key;
  let code = event.which;
  document.getElementById("demo").innerHTML = "The key was: " + key+"("+code+")";
}
tecla.addEventListener('keydown',teclea);
function teclea(evento){
     let key = evento.key;
     tecla.value+=key;
}