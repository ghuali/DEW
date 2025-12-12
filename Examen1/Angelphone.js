regexTelefono = /^[67]\d{8}$/

 telefono =  
    {
        tecla1:["1"],
        tecla2:["2","A","B","C"],
        tecla3:["3","D","E","F"],
        tecla4:["4","G","H","I"],
        tecla5:["5","J","K","L"],
        tecla6:["6","M","N","O"],
        tecla7:["7","P","Q","R","S"], 
        tecla8:["8","T","U","V"], 
        tecla9:["9","W","X","Y","Z"],
        tecla0:["0"]
    }


const form = document.querySelectorAll("form numeros");
const mostrar = document.querySelector("inputbox");
const teclas = document.querySelectorAll("td");


const timer = 3


teclas.forEach(tecla => {

    mostrar.addEventListener("blur", (e) => {
    e.preventDefault();
    });
    
    tecla.addEventListener("mouseup", () => {

        const valorTecla = tecla.id;
        const valor = telefono[valorTecla];

        

        if(valor !== undefined){
            
            mostrar.value += "Hola";
        }

        console.log(valorTecla)
        console.log(valor)
        console.log(mostrar)
        console.log(mostrar.value)


    });

    
});

mostrar.addEventListener("blur", (e) => {
    e.preventDefault();

    const valor = mostrar.value;
    if(regexTelefono.test(valor)){
        mostrar.classList.add("valid");
        mostrar.classList.remove("invalid");
    } else {
        mostrar.classList.add("invalid");
        mostrar.classList.remove("valid");
    }
});




