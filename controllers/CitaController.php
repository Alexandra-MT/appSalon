<?php

namespace Controllers;

use MVC\Router;
use Model\Usuario;


class CitaController{
    public static function index(Router $router){
        //autocompletar nombre con sesion, zona privada solo se accede si hay sesión
        isAuth();
        //debuguear($_SESSION);
        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}