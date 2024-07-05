<?php
    foreach($alertas as $key => $mensajes):
        //key = 'error'
        //$mensajes = indice mas mensaje por eso se necesita un segundo foreach
        foreach($mensajes as $mensaje):
?>
    <div class="alerta <?php echo $key; ?>">
        <?php echo $mensaje; ?>
    </div>
<?php 
        endforeach;
    endforeach;
?>