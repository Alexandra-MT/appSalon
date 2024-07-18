<?php
include_once __DIR__.'/../templates/barra.php';
?>

<h1 class="nombre-pagina">Panel de administración</h1>

<h2>Buscar Citas</h2>
<div class="busqueda">
    <form action="" class="formulario">
        <div class="campo">
            <label for="fecha">Fecha</label>
            <input type="date" id="fecha" name="fecha" value="<?php echo $fecha; ?>">
        </div>
    </form>
</div>

<?php if(count($citas) === 0){ ?>
    <p class="alerta error">No hay Citas para esta Fecha</p>
<?php }?>

<div id="citas-admin">
    <ul class="citas"> 

    <?php 
        $idCita = 0;

        foreach($citas as $key => $cita):

            if($idCita !== $cita->id): 
                $total = 0; //reiniciamos en 0 cada vez que se cambia el id
    ?>
                <li>
                    <h3>Datos Cliente</h3>
                    <p>Id: <span><?php echo $cita->id; ?></p>
                    <p>Cliente: <span><?php echo $cita->cliente; ?></p>
                    <p>Hora: <span><?php echo $cita->hora; ?></p>
                    <p>Email: <span><?php echo $cita->email; ?></p>
                    <p>Telefono: <span><?php echo $cita->telefono; ?></p>

                    <h3>Servicios:</h3>
    <?php 
        $idCita = $cita->id;
    endif; 
    
    $total += $cita->precio; //DESPUES DEL IF PARA SUMAR    
    
    ?>
                    <p class="servicios"><?php echo $cita->servicio.' : € '.$cita->precio; ?></p>
                    
    <?php 
    //debuguear($citas);
        $actual = $citas[$key]->id; // array[$key = 0]->id=22;
        $proximo = $citas[$key + 1]->id ?? 0; //indice en el arreglo 
        
        if(esUltimo($actual, $proximo)): ?>
            <p class="total">El Total a pagar es: <?php echo $total." Euros"; ?></p>
            <form action="/api/eliminar" method="POST">
                <input type="hidden" name="id" value="<?php echo $cita->id; ?>">
                <input type="submit" class="boton-eliminar" value="Eliminar">
            </form>
        <?php endif; ?>
    <?php endforeach; ?>

    </ul>
</div>

<?php 

$script = "<script src='build/js/buscador.js'></script>";

?>