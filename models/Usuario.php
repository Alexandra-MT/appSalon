<?php

namespace Model;

class Usuario extends ActiveRecord{
    //BBDD
    protected static $tabla='usuarios';
    protected static $columnasDB=['id', 'nombre', 'apellido','email', 'password', 'telefono', 'admin', 'confirmado', 'token'];

    //atributos
    public $id;
    public $nombre;
    public $apellido;
    public $email;
    public $password;
    public $telefono;
    public $admin;
    public $confirmado;
    public $token;

    //constructor
    public function __construct($args=[]){
        $this->id=$args['id'] ?? null;
        $this->nombre=$args['nombre'] ?? '';
        $this->apellido=$args['apellido'] ?? '';
        $this->email=$args['email'] ?? '';
        $this->password=$args['password'] ?? '';
        $this->telefono=$args['telefono'] ?? '';
        $this->admin=$args['admin'] ?? '0';//recuerda true 1, 0 false, para que no accepte null, se debe confirmar
        $this->confirmado=$args['confirmado'] ?? '0';
        $this->token=$args['token'] ?? '';

    }

    //validación
    public function validarCuenta(){
        if(!$this->nombre){
            //self::$alertas['error'][]='El Nombre del Cliente es obligatorio';
            self::setAlerta('error', 'El Nombre es Obligatorio');
        }
        if(!$this->apellido){
           // self::$alertas['error'][]='El Apellido del Cliente es obligatorio';
           self::setAlerta('error','El Apellido es Obligatorio');
        }
        if(!filter_var($this->email, FILTER_VALIDATE_EMAIL)){
            self::setAlerta('error','El Email es Obligatorio');
        }
        if(!($this->password && strlen($this->password) > 6)){ //ojo con la negación se aplica a las dos
            self::setAlerta('error','El Password es Obligatorio y debe contener al menos 6 cáracteres');
        }
        return self::getAlertas();
    }

    //validar login
    public function validarLogin(){
        if(!$this->email){
            self::setAlerta('error', 'El E-mail es Obligatorio');
        }
        if(!$this->password){
            self::setAlerta('error', 'El Password es Obligatorio');
        }
        return self::getAlertas();
    }

    public function validarOlvide(){
        if(!$this->email){
            self::setAlerta('error', 'El E-mail es Obligatorio');
        }
        return self::getAlertas();
    }

    //validar usuario por email
    public function existeUsuario(){
        // ojo no ponemos $this->tabla porque es static se pone self
        $query="SELECT * FROM ". self::$tabla ." WHERE email ='".$this->email."' LIMIT 1";
        $resultado=self::$db->query($query);//devuelve un objeto, accedemos con ->
        if($resultado->num_rows){
            self::setAlerta('error', 'El Usuario ya esta registrado');
        }
        return $resultado;// devuelve un objeto
    }
    public function hashPassword(){
        //reescribimos el password
        $this->password= password_hash($this->password, PASSWORD_BCRYPT);
    }
    public function generarToken(){
        $this->token =uniqid();//13 digitos
    }
    public function comprobarPasswordAndVerificado($password){
        //debuguear($this);
        $resultado=password_verify($password,$this->password);
        if(!$resultado || !$this->confirmado){
            self::setAlerta('error', 'Password incorrecto o tu cuenta no ha sido confirmada');
        }else{
            return true;
        }
    }
    public function validarPassword($password,$password2){
        if(!($password && strlen($password) > 6)){ //ojo con la negación se aplica a las dos
            self::setAlerta('error','Debes añadir un password de al menos 6 cáracteres');
        }
        if(!$password2){
            self::setAlerta('error','Debes confirmar el Password');
        }
        if($password !== $password2){
            self::setAlerta('error','Los Password no coinciden');
        }
        return self::getAlertas();
    }
}
