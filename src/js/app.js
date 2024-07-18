let paso = 1;
const pasoInicial=1;
const pasoFinal=3;

//crear el objeto de la cita
const cita = {
    id: '',
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

    //idcliente
    idCliente();

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
        //console.log(paso);

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
        //console.log(paso);

        //para que desaparezca cuando paso=1;
        botonesPaginador();
    });
}

// utilizamos funciones asyncronas para hacer varias cosas a la vez, varias funciones etc
//try catch previene a que la app deje de funcionar
async function consultarAPI(){
    try{
        const url = 'http://127.0.0.1:3000/api/servicios';
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

function idCliente(){
    cita.id = document.querySelector('#id').value; //el valor que le pasamos desde la sesión 
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
        
    });
 }

 function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];//separa un string con el separador especificado, y devolvemos el valor de la posicion 0 del array
        
        //const horaActual = new Date().getHours();
        
        if(hora < 10 || hora > 18){
            e.target.value ='';
            mostrarAlerta('Hora No Válida', 'error', '.formulario');
           
        }else{
            cita.hora = e.target.value;
            //console.log(cita);
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

    //resumen.innerHTML = '';
    //limpiar el contenido de resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }

    //console.log(Object.values(cita));
    //console.log(cita.servicios.length);
    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);
        return;
    }

        //formatear al div de resumen
        const { nombre, fecha , hora, servicios } = cita;

        //heading servicios
        const headingServicios = document.createElement('H3');
        headingServicios.textContent = 'Resumen de Servicios';
        resumen.appendChild(headingServicios);

        //interramos los servicios
        servicios.forEach(servicio =>{

            const {id, nombre, precio} = servicio;

            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');

            const textoServicio = document.createElement('P');
            textoServicio.textContent = nombre;

            const precioServicio = document.createElement('P');
            precioServicio.innerHTML = `<span>Precio:</span> € ${precio}`;

            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);

            resumen.appendChild(contenedorServicio);
        })

        //heading datos cliente
        const datosCliente = document.createElement('H3');
        datosCliente.textContent = 'Datos Cliente';
        resumen.appendChild(datosCliente);

        //formatear la fecha en español
        const fechaObj = new Date(fecha);
        const mes = fechaObj.getMonth();
        const dia = fechaObj.getDate();
        const anio = fechaObj.getFullYear();

        const fechaUTC = new Date(Date.UTC(anio, mes, dia));
        const opciones = { weekday: 'long', year:'numeric', month:'long', day:'numeric'};
        const fechaFormateada = fechaUTC.toLocaleDateString('es-ES', opciones);
        fechaDef = capitalizarPrimeraLetra(fechaFormateada);

        const nombreCliente = document.createElement('P');
        nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;
 
        const fechaCita = document.createElement('P');
        fechaCita.innerHTML = `<span>Fecha:</span> ${fechaDef}`;
 
        const horaCita = document.createElement('P');
        horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

        //boton para crear una cita
        const botonReservar = document.createElement('BUTTON');
        botonReservar.classList.add('boton');
        botonReservar.textContent = 'Reservar cita';
        botonReservar.onclick = reservarCita;
 
        resumen.appendChild(nombreCliente);
        resumen.appendChild(fechaCita);
        resumen.appendChild(horaCita);

        resumen.appendChild(botonReservar);
}

function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

 async function reservarCita(){

    //extraer el objeto de cita
    const { fecha, hora, servicios, id } = cita;
    
    //for each solamente iterra, map va colocando en la variable las coincidencias
    const idServicios = servicios.map( servicio => servicio.id ); //iterra sobre cada servicio, identifico el campo id y lo devuelve a la variable idServicios
   
    //creamos el objeto
    const datos = new FormData();

    //agregamos datos con append, // 'nombre', 'fecha', 'hora' nos ayuda a acceder al valor en post
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);

    //en caso de error critico en el servidor
    try {
        //peticion hacia la api
        const url = 'http://127.0.0.1:3000/api/citas';

        const respuesta = await fetch(url, { //el segundo parametro es opcional, es bueno declararlo en peticiones tipo post
            method: 'POST',
            body: datos //hay que hacer ek FormDate parte de fetch, en el cuerpo de la petición
        });
        const resultado = await respuesta.json();
        //console.log(resultado.resultado); //.resultado es de la funcion crear() de Active Record
        //console.log([...datos]);//para poder ver su contenido

        if(resultado.resultado){
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue creada correctamente",
            }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                }, 2000); 
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita",
            footer: "Por favor intentelo más tarde, disculpe la molestia"
          });
    }

    
}
  