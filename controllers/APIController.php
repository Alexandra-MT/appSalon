<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController{
    public static function index(){
        //traemos todos los servicios
        $servicios=Servicio::all();//arreglo asociativo
        //hay que pasarlo a json, los arrays asociativos no existen en js y no se pueden leer de otra forma con la funcion consultarAPI de app.js
        //lo que hacemos es pasar una array asociativo a json y de json a un array de objetos en js
        echo json_encode($servicios);

    }

    public static function guardar(){
        //almacena la cita y devuelve un id
        $cita = new Cita($_POST);
        
        $resultado = $cita->guardar();

        $id = $resultado['id'];

        //almacena la cita y el servicio
        //con explode en php pasamos de string a array
        $idServicios = explode(",", $_POST['servicios']);

        foreach ($idServicios as $idServicio){
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }

        //retornamos una respuesta
        echo json_encode(['resultado' => $resultado]);
    } 
}

