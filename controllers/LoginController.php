<?php

namespace Controllers;

use MVC\Router;
use Classes\Email;
use Model\Usuario;

class LoginController{
    public static function login(Router $router){
        $alertas=[];
        //para que autocomplete los datos
        $auth=new Usuario();
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $auth=new Usuario($_POST);
            $alertas=$auth->validarLogin();

            if(empty($alertas)){
                //comprobar que exista el usuario, por email
                $usuario=Usuario::where('email', $auth->email);//ojo solo nos interesa el email
                
                if($usuario){
                    //verificar el password
                    if($usuario->comprobarPasswordAndVerificado($auth->password)){
                        //autenticar usuario
                        //session_start();
                        isAuth();

                        $_SESSION['id']= $usuario->id;
                        $_SESSION['nombre']= $usuario->nombre." ".$usuario->apellido;
                        $_SESSION['email']=$usuario->email;
                        $_SESSION['login']=true;

                        //redireccionamiento
                        if($usuario->admin === "1"){
                            $_SESSION['admin']=$usuario->admin ?? null;
                            //debuguear($_SESSION);
                            header('Location: /admin');
                        }else{
                            header('Location: /cita');
                        }
                    }
                }else{
                    //si no hay usuario
                    $alertas=Usuario::setAlerta('error', 'Usuario no encontrado');
                }
            }
        }

        $alertas=Usuario::getAlertas();

        $router->render('auth/login',[
            'alertas'=>$alertas,
            'auth'=>$auth
        ]);

    }

    public static function logout(){
        isAuth();

        $_SESSION = [];
        
        header('Location: /');
    }

    public static function olvide(Router $router){
        $alertas=[];

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $auth=new Usuario($_POST);
            $alertas=$auth->validarOlvide($auth->email);

            if(empty($alertas)){
                $usuario=Usuario::where('email',$auth->email);

                if($usuario && $usuario->confirmado === "1"){
                    //genarar un token
                   $usuario->generarToken();
                   $usuario->guardar();//actualiza el token 

                   //enviar el email
                   $email=new Email($usuario->email,$usuario->nombre,$usuario->token);
                   $email->enviarInstrucciones();
                   Usuario::setAlerta('exito', 'Revisa tu E-mail');
                }else{
                    Usuario::setAlerta('error', 'El Usuario no existe o no esta confirmado');
                }
            }
        }

        $alertas=Usuario::getAlertas();

        $router->render('auth/olvide', [
            'alertas'=>$alertas
        ]);
    }

    public static function recuperar(Router $router){
        $alertas=[];
        $error=false;
        //leer el token con get
        $token=s($_GET['token']);
       
        //buscar usuario
        $usuario=Usuario::where('token', $token);
        if(empty($usuario)){
            Usuario::setAlerta('error', 'Token No Válido');
            $error=true;
        }

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            //leer el nuevo password y guardarlo
            $password=s($_POST['password'] ?? '');
            $password2=s($_POST['password2'] ?? '');
            
            $alertas=$usuario->validarPassword($password, $password2);

            //$pass=new Usuario($_POST);  
            if(empty($alertas)){
                $usuario->password=null;
                $usuario->password=$password;
                $usuario->hashPassword();
                $usuario->token=null;
                $resultado=$usuario->guardar();

                if($resultado){
                    header('Location:/');
                }
            }
        }
        

        //debuguear($usuario);

        $alertas=Usuario::getAlertas();

        $router->render('auth/recuperar-password', [
            'alertas'=>$alertas,
            'error'=>$error
        ]);
    }

    public static function crear(Router $router){
        //pasar datos hacia la vista con render
        $usuario=new Usuario;//no existe post aun
        $alertas=[];
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
              //$usuario=new Usuario($_POST);
              //debuguear($usuario);
              $usuario->sincronizar($_POST);// $key=$value;
              $alertas=$usuario->validarCuenta();

              //revisar que $alertas este vacio
              if(empty($alertas)){
                    //una vez pasada la validación verificamos que el usuario no esta registrado?
                    $resultado=$usuario->existeUsuario();
                    if($resultado->num_rows){
                        $alertas=Usuario::getAlertas();//pasamos la validacion pero hay que crear el error por si existe el usuario
                        //no se vulve a instanciar el $usuario porque esta como static, ponemos el nombre de la clase Usuario
                        //ponemos Usuario::getAlertas() porque es static
                    }else{
                        //No esta registrado
                        //hashear el password
                        $usuario->hashPassword();

                        //token unico para verficar que la persona que esta rellenando la cuenta si es una persona y no un robot
                        $usuario->generarToken();

                        //enviar el email
                        $email=new Email($usuario->email, $usuario->nombre, $usuario->token);
                        //enviar confirmacion por email
                        $email->enviarConfirmacion();

                        //crear el usuario
                        $resultado=$usuario->guardar();
                        //debuguear($usuario);
                        if($resultado){
                            header('Location: /mensaje');
                        }
                    }

               }
    
        }
        $router->render('auth/crear-cuenta',[
           'usuario'=>$usuario,
           'alertas'=>$alertas
           
        ]);
    }

    public static function mensaje(Router $router){
        $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router){
        $alertas=[];
        //hay que leer el token con get ya que lo pasamos por la URL
        $token=s($_GET['token']);
        
        $usuario=Usuario::where('token', $token);

        if(empty($usuario)){
            //Mostrar mensaje de error
            Usuario::setAlerta('error', 'Token No Válido');
        }else{
            //usuario confirmado, actualiza el usuario porque aqui ya tiene un id
            $usuario->confirmado="1";
            $usuario->token =null;
            $usuario->guardar();//actualiza
            Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
         
        }

        //obtener alertas
        $alertas=Usuario::getAlertas();

        //renderizar la vista
        $router->render('auth/confirmar-cuenta',[
            'alertas'=>$alertas
        ]);
    }
}