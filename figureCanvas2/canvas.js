window.onload = inicializar

function inicializar() {
  let lienzo = document.getElementById("lienzo");
  let context = lienzo.getContext("2d");
  // cargando elementos de la página, lograr referencia del botón
  let dibujaTriangulo = document.getElementById("dibujaTriangulo");
  let dibujaArco = document.getElementById("dibujaArco");
  let dibujaRectangulo = document.getElementById("dibujaRectangulo");
  //Al pulsar sobre el botón, debe responder algun gestor de eventos
  dibujaTriangulo.onclick = () => dibujarTriangulo(context);
  dibujaArco.onclick = () => dibujarArco(context);
  dibujaRectangulo.onclick = () => dibujarRectangulo(context);
}

function dibujarTriangulo(context) {
  context.beginPath();
  context.moveTo(100, 150);
  context.lineTo(250, 75);
  context.lineTo(125, 30);
  context.closePath();

  context.lineWidth = 5;
  context.stroke();
  // rellena de rojo
  context.fillStyle = "red";
  context.fill();
}

function dibujarArco(context) {
  context.beginPath();
  context.arc(100, 100, 50, 0, 1.5 * Math.PI, false);
  context.stroke();
  context.fill();
}

function dibujarRectangulo(context) {
  context.fillRect(20, 10, 50, 80);
  context.strokeRect(110, 110, 50, 50);
}
