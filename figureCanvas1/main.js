window.onload = cargar

function cargar() {
    let canvas = document.getElementById('lienzo')
    let context = canvas.getContext('2d')
    let rejillaBtn = document.getElementById('dibujaRejilla')
    dibujarLogo(context)
    rejillaBtn.addEventListener('click', () => pintarRejilla(canvas, context))
}

function dibujarLogo(context) {
    var logo = new Image () ; 
    logo.src = "ehu.png"; 
    logo.onload = function() { 
        context.drawImage(logo, 0, 0); 
    }; 

}

function pintarRejilla(canvas, context){ 
    context.beginPath();

    for (var x = 0; x < canvas.width; x += 10) { 
        context.moveTo(x, 0); 
        context.lineTo(x, canvas.height); 
    }

    for (var y = 0; y < canvas.height; y += 10) { 
        context.moveTo(0, y); 
        context.lineTo(canvas.width, y); 
    }

    context.strokeStyle = "#918d8dff"; 
    context.stroke();
}
