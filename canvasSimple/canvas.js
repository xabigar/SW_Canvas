window.onload = function() {
    let lienzo = this.document.getElementById("lienzo")
    let context = lienzo.getContext('2d')
    
    // por defecto negro
    context.fillRect(10,100,90,90)

    // fondo rojo
    context.fillStyle = "red";
    context.fillRect(10,500,90,90)

    // sin fondo
    context.strokeRect(10, 300, 70, 70);

    // No se pinta entero, esta al limite del canvas (!!!)
     context.fillRect(550,100,90,90)
    // No se pinta entero, esta fuera del canvas (!!!)
    context.fillRect(600,400,90,90)

    context.beginPath();
    context.moveTo(300,350);
    context.lineTo(450,275);
    context.lineTo(325,280);
    context.closePath();
    context.stroke();
    context.fillStyle = "blue";
    context.fill()
    
    context.beginPath();
    context.moveTo(400,450);
    context.lineTo(550,375);
    context.lineTo(425,380);
    context.closePath();
    context.stroke();


}
