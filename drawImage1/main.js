window.onload = cargar

function cargar() {
    let canvas = document.getElementById('lienzo')
    let context = canvas.getContext('2d')
    let rejillaBtn = document.getElementById('dibujaRejilla')
    let borrarBtn = document.getElementById('borrarBtn')
    dibujarLogo(context)
    rejillaBtn.addEventListener('click', () => pintarRejilla(canvas, context))
    borrarBtn.addEventListener('click', () => borrar(canvas, context))
}

function dibujarLogo(context) {
    var logo = new Image () ; 
    logo.src = "chill.png"; 
    logo.onload = function() { 
        context.drawImage(logo, 210, 140, 200, 200); 
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

function borrar(canvas, context) { 
    context.clearRect(0, 0, 300, 250); 
}

