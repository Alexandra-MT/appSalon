let paso = 1;
const pasoInicial=1;
const pasoFinal=3;

//crear el objeto de la cita
const cita = {
    nombre:'',
    fecha:'',
    hora:'',
    servicios:[]
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarSeccion();//depende del paso de arriba
    tabs();//cambia la seccion cuando se presione los tabs
    botonesPaginador();//agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    //API
    consultarAPI();//consulta la api en el backend de php

    //nombre cliente
    nombreCliente();

    //seleccionar fecha
    seleccionarFecha();

    //seleccionar hora
    seleccionarHora();

    //mostrar resumen
    mostrarResumen();
}

function mostrarSeccion(){
    //ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }
    
    //seleccionar la seccion con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //resalta el tab actual
    const tabAnterior=document.querySelector('.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    const tab = document.querySelector(`[data-paso="${paso}"]`);//selector de atributo
    tab.classList.add('actual');
}

function tabs(){
    //seleccionamos botones
    const botones=document.querySelectorAll('.tabs button');
    
    //iterramos cada botones, no se puede usar addEvent
    botones.forEach( boton => {
        boton.addEventListener('click', function(e){
            
            //console.log(parseInt(e.target.dataset.paso));//vienen como string hay que convertirlos a numeros
            paso=parseInt(e.target.dataset.paso);

            mostrarSeccion();

            botonesPaginador();
        });
    });
}

function botonesPaginador(){
    const paginaAnterior=document.querySelector('#anterior');
    const paginaSiguiente=document.querySelector('#siguiente');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(paso === 3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();

}

function paginaSiguiente(){
    const paginaSiguiente=document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if(paso >= pasoFinal) return;
        paso++;
        console.log(paso);

        botonesPaginador();
    });
}

function paginaAnterior(){
    const paginaAnterior=document.querySelector('#anterior');
    paginaAnterior.addEventListener('click',function(){
        //ojo cogemos el paso de tabs y ya entra como numero
        //si paso es menor o igual al pasoInicial return; deja de restar
        if(paso <= pasoInicial) return;
        paso--; 
        console.log(paso);

        //para que desaparezca cuando paso=1;
        botonesPaginador();
    });
}

// utilizamos funciones asyncronas para hacer varias cosas a la vez, varias funciones etc
//try catch previene a que la app deje de funcionar
async function consultarAPI(){
    try{
        const url = 'http://localhost:3000/api/servicios';
        const resultado = await fetch(url);//espera hasta que descargue todo
        //console.log(resultado); //json() toma un json como entrada y devuelve objeto js
        const servicios = await resultado.json();// funcion json en prototype
        //console.log(servicios);//mustra los servicios como array de objetos
        mostrarServicios(servicios);
    }catch(error){
        console.log(error);
    }
}

function mostrarServicios(servicios){
    //iterramos sobre el arreglo de objetos js
    servicios.forEach( servicio=>{
        //destructuring
        const {id, nombre, precio} = servicio;

        //scripting en performance es mas rapido y seguro
        //creamos un parrafo
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `€ ${precio}`;
        //console.log(precioServicio.textContent);

        //crear un contenedor para cada uno de los servicios
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('servicio');
        //crear un atributo personalizado con dataset- 
        contenedorServicio.dataset.idServicio = id;// data-id-servicio
        //pasar un dato de una funcion a otra con callback
        contenedorServicio.onclick = function(){
            seleccionarServicio(servicio);
        };
        //console.log(contenedorServicio);

        contenedorServicio.appendChild(nombreServicio);
        contenedorServicio.appendChild(precioServicio);

        //mostrar en pantalla, injectamos en el codigo existente en views cita
        document.querySelector('#servicios').appendChild(contenedorServicio);

        
    });
}

function seleccionarServicio(servicio){
    //console.log(servicio);
    //extraemos la const servicios del objeto cita
    //cita.servicios = [...cita.servicios, servicio] sin destructuring
    //con destructuring
    const {id} = servicio;
    const { servicios } = cita;

    //resaltar servicio 
    const contenedorServicio=document.querySelector(`[data-id-servicio="${id}"]`);

    //comprobar si un servicio ya fue agregado y quitarlo
    //iterramos sobre el array servicio de cita donde algun servicio ha sido seleccionado
    if(servicios.some(agregado => agregado.id === id)){ //ojo some requiere una funcion
        //eliminarlo
        cita.servicios = servicios.filter(agregado => agregado.id !== id);// si el id es diferente se mantiene sino se elimina
        contenedorServicio.classList.remove('seleccionado');
    }else{
        //agregarlo
        cita.servicios = [...servicios, servicio];//toma una copia de los servicios y agregamos el nuevo servicio
        contenedorServicio.classList.add('seleccionado');
    }
}

function nombreCliente(){
    cita.nombre = document.querySelector('#nombre').value; //el valor que le pasamos desde la sesión 
}

 function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        const dia = new Date(e.target.value).getUTCDay(); //dia que el usuario selecciono desde 0 que es domingo a 6 que es sabado

        const error = document.createElement('P');
        if([6 , 0].includes(dia)){
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        }else{
            cita.fecha = e.target.value;
            
        }
        //cita.fecha = inputFecha.value;
        console.log(dia);
    });
 }

 function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];//separa un string con el separador especificado, y devolvemos el valor de la posicion 0 del array
        if(hora < 10 || hora > 18){
            e.target.value ='';
            mostrarAlerta('Hora No Válida', 'error', '.formulario');
           
        }else{
            cita.hora = e.target.value;
            console.log(cita);
        }
    });
}

 function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){

    //previene que se genere más de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    //scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento); 
    //const formulario = document.querySelector('#paso-2 p');
    referencia.appendChild(alerta);
    
    //eliminar la alerta
    if(desaparece){
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
}
 
function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');

    //console.log(Object.values(cita));
    //console.log(cita.servicios.length);
    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);
    }else{
        console.log('todo bien');
    }
}