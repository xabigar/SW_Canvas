let ctx, canvas;
let w = 200, h = 200;
let x = 210, y = 140;
let paso = 10;
let logo;

window.onload = function() {
  canvas = document.getElementById('lienzo');
  ctx = canvas.getContext('2d');

  logo = new Image();
  logo.src = 'chill.png';
  logo.onload = draw;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(logo, x, y, w, h);
}

// ESCUCHAMOS EL TECLADO
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      y -= paso;
      break;
    case 'ArrowDown':
      y += paso;
      break;
    case 'ArrowLeft':
      x -= paso;
      break;
    case 'ArrowRight':
      x += paso;
      break;
    default:
      return; // ignoramos cualquier otra tecla
  }
  draw();
});
