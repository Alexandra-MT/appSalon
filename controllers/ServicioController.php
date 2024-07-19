<?php

namespace Controllers;

use MVC\Router;
use Model\Servicio;

class ServicioController{

    public static function index(Router $router){
        isAuth();

        isAdmin();

        $servicios = Servicio::all();

        $router->render('servicios/index', [
            'nombre' => $_SESSION['nombre'],
            'servicios' => $servicios,
        ]);
      
    }

    public static function crear(Router $router){
        isAuth();
        isAdmin();
        $servicio = new Servicio();
        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $servicio->sincronizar($_POST);
            $alertas = $servicio->validar();
            if(empty($alertas)){
                $servicio->guardar();
                header('Location: /servicios');
            }
        }

        $router->render('servicios/crear', [
            'nombre' => $_SESSION['nombre'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }

    public static function actualizar(Router $router){
        isAuth();
        isAdmin();
        //$id = filter_var($_GET['id'], FILTER_VALIDATE_INT);//Si es un entero, devolverá ese entero, pero si no lo es, devolverá false.
        $id = $_GET['id'];// si pones is numeric aqui te devolvera true que es 0 por eso consultara siempre la primera posicion
        if(!is_numeric($_GET['id'])) return; //se valida is numneric aqui (false)
        $servicio = Servicio::find($id);
        $alertas=[];
        
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $alertas = $servicio->validar();
            $servicio->sincronizar($_POST);
            if(empty($alertas)){
                $servicio->guardar();
                header('Location: /servicios');
            }
            
        }

        $router->render('servicios/actualizar', [
            'nombre' => $_SESSION['nombre'],
            'alertas' => $alertas,
            'servicio' => $servicio
        ]);
    }

    public static function eliminar(){
        isAuth();
        isAdmin();
        //ojo es un formulario
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $id = $_POST['id'];
            $servicio = Servicio::find($id);
            $servicio->eliminar();
            header('Location: /servicios');
        }
    }
}