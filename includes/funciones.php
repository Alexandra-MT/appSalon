<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function esUltimo(string $actual, string $proximo): bool{
    if($actual !== $proximo){
        return true;
    }
    return false;
}

function isAuth() : void {
    if(!isset($_SESSION)) {
        session_start();
    } elseif(!isset($_SESSION['login'])) {
        header('Location: /');
    }
}

function isAdmin() : void{
    //si hay sesion, la sesión la tenemos en login 
    if(!isset($_SESSION['admin'])){
        header('Location: /');
    }
}