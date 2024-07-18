<?php

namespace Controllers;

use Model\AdminCita;
use MVC\Router;

class AdminController{
    public static function index(Router $router){
        isAuth();

        isAdmin();

        //fecha, si no hay un get, pondra la fecha del servidor, de hoy
        $fecha = $_GET['fecha'] ?? date('Y-m-d');

        //validar si existe la fecha
        $fechas = explode('-', $fecha);
        //si no existe 404
        if(!checkdate($fechas[1], $fechas[2] ,$fechas[0])){
            header('Location: /404');
        }
       
        
        //consultar la bbdd, query buider
        $consulta = "SELECT citas.id, citas.hora, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
        $consulta .= " usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio  ";
        $consulta .= " FROM citas  ";
        $consulta .= " LEFT OUTER JOIN usuarios ";
        $consulta .= " ON citas.usuarioId=usuarios.id  ";
        $consulta .= " LEFT OUTER JOIN citaservicios ";
        $consulta .= " ON citaservicios.citaId=citas.id ";
        $consulta .= " LEFT OUTER JOIN servicios ";
        $consulta .= " ON servicios.id=citaservicios.servicioId ";
        $consulta .= " WHERE fecha = '$fecha'";

        $citas = AdminCita::SQL($consulta);

        $router->render('admin/index',[
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas,
            'fecha' => $fecha
        ]);
    }
}