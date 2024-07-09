<?php

namespace Controllers;

use Model\Servicio;

class APIController{
    public static function index(){
        //traemos todos los servicios
        $servicios=Servicio::all();//arreglo asociativo
        //hay que pasarlo a json, los arrays asociativos no existen en js y no se pueden leer de otra forma con la funcion consultarAPI de app.js
        //lo que hacemos es pasar una array asociativo a json y de json a un array de objetos en js
        echo json_encode($servicios);

    }


    
}

