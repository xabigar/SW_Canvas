# SW_Canvas

Alternativas a Contexto 2d
// ==== WebGL2 3D: cubo con TEXTURA (sin iluminación) ====
document.body.style.margin = 0;
const dpr = devicePixelRatio || 1;
const canvas = document.createElement('canvas');
canvas.style.width = '100vw';
canvas.style.height = '100vh';
document.body.appendChild(canvas);
function resize(){ canvas.width = innerWidth*dpr; canvas.height = innerHeight*dpr; }
addEventListener('resize', resize); resize();

// --- Contexto WebGL2
const gl = canvas.getContext('webgl2');
if(!gl){ alert('WebGL2 no soportado'); throw ''; }

// --- Shaders (GLSL ES 3.00): posición + UV, sampler2D ---
const vsSrc = `#version 300 es
in vec3 aPos;
in vec2 aUV;
uniform mat4 uMVP;
out vec2 vUV;
void main(){
  vUV = aUV;
  gl_Position = uMVP * vec4(aPos, 1.0);
}`;
const fsSrc = `#version 300 es
precision mediump float;
in vec2 vUV;
uniform sampler2D uTex0;
out vec4 outColor;
void main(){
  outColor = texture(uTex0, vUV);
}`;

// --- Compilación/Programa
function compile(type, src){
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s);
  return s;
}
function makeProgram(vs, fs){
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if(!gl.getProgramParameter(p, gl.LINK_STATUS)) throw gl.getProgramInfoLog(p);
  return p;
}
const prog = makeProgram(vsSrc, fsSrc);
gl.useProgram(prog);

// --- Geometría: 36 vértices (duplicados por cara para UVs limpios) ---
const P = 1;
const POS = new Float32Array([
  // +Z (frente)
  -P,-P, P,  P,-P, P,  P, P, P,
  -P,-P, P,  P, P, P, -P, P, P,
  // -Z (detrás)
   P,-P,-P, -P,-P,-P, -P, P,-P,
   P,-P,-P, -P, P,-P,  P, P,-P,
  // +X (derecha)
   P,-P, P,  P,-P,-P,  P, P,-P,
   P,-P, P,  P, P,-P,  P, P, P,
  // -X (izquierda)
  -P,-P,-P, -P,-P, P, -P, P, P,
  -P,-P,-P, -P, P, P, -P, P,-P,
  // +Y (arriba)
  -P, P, P,  P, P, P,  P, P,-P,
  -P, P, P,  P, P,-P, -P, P,-P,
  // -Y (abajo)
  -P,-P,-P,  P,-P,-P,  P,-P, P,
  -P,-P,-P,  P,-P, P, -P,-P, P,
]);
// UV por cara (cada cara mapea 0..1)
const UV = new Float32Array([
  // +Z
  0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
  // -Z
  0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
  // +X
  0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
  // -X
  0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
  // +Y
  0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
  // -Y
  0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
]);

// --- VAO/VBO
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const vboPos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
gl.bufferData(gl.ARRAY_BUFFER, POS, gl.STATIC_DRAW);

const aPos = gl.getAttribLocation(prog, 'aPos');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

const vboUV = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboUV);
gl.bufferData(gl.ARRAY_BUFFER, UV, gl.STATIC_DRAW);

const aUV = gl.getAttribLocation(prog, 'aUV');
gl.enableVertexAttribArray(aUV);
gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);

// --- Textura procedimental (checkerboard) para evitar CORS ---
function makeChecker(size=128, cells=8){
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const cell = size / cells;
  for(let y=0;y<cells;y++){
    for(let x=0;x<cells;x++){
      ctx.fillStyle = ((x+y)&1) ? '#1e90ff' : '#111';
      ctx.fillRect(x*cell, y*cell, cell, cell);
    }
  }
  return c;
}
const texImage = makeChecker(256, 8);

const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texImage);
gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

// --- Uniforms y matrices ---
const uMVP = gl.getUniformLocation(prog, 'uMVP');
const uTex0 = gl.getUniformLocation(prog, 'uTex0');
gl.uniform1i(uTex0, 0); // texture unit 0

function mat4Identity(){ const m=new Float32Array(16); m[0]=m[5]=m[10]=m[15]=1; return m; }
function mat4Mul(a,b){ const c=new Float32Array(16);
  for(let r=0;r<4;r++){ for(let k=0;k<4;k++){
    c[r+4*k]=a[r]*b[0+4*k]+a[r+4]*b[1+4*k]+a[r+8]*b[2+4*k]+a[r+12]*b[3+4*k];
  }} return c; }
function mat4Translate(x,y,z){ const m=mat4Identity(); m[12]=x; m[13]=y; m[14]=z; return m; }
function mat4RotateX(a){ const c=Math.cos(a),s=Math.sin(a),m=mat4Identity(); m[5]=c;m[9]=-s;m[6]=s;m[10]=c; return m; }
function mat4RotateY(a){ const c=Math.cos(a),s=Math.sin(a),m=mat4Identity(); m[0]=c;m[8]=s;m[2]=-s;m[10]=c; return m; }
function mat4Perspective(fovy,aspect,near,far){
  const f=1/Math.tan(fovy/2), m=new Float32Array(16);
  m[0]=f/aspect; m[5]=f; m[10]=(far+near)/(near-far); m[11]=-1; m[14]=(2*far*near)/(near-far);
  return m;
}

// --- Estado GL
gl.enable(gl.DEPTH_TEST);
gl.clearColor(1,1,1,1);

// --- Animación (solo textura; sin iluminación) ---
function draw(t){
  gl.viewport(0,0,canvas.width,canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const aspect = canvas.width/canvas.height;
  const Pm = mat4Perspective(Math.PI/3, aspect, 0.1, 100.0);
  const V  = mat4Translate(0,0,-5);
  const M  = mat4Mul(mat4RotateY(t*0.0015), mat4RotateX(t*0.0011));
  const MVP = mat4Mul(Pm, mat4Mul(V, M));

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.uniformMatrix4fv(uMVP, false, MVP);

  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLES, 0, 36);

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);