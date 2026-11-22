// Decorado del setup gamer gigante: escritorio, teclado, torre de PC con parlantes y monitor.
// Son solo adornos (no se agarran). Las proporciones respetan las de los objetos reales a escala
// ESCENARIO.escala (1 cm real = 18 cm): una tecla mide 34 cm, el teclado sin teclado numérico unos 6,7 m,
// la torre 4 m de ancho por 8 de alto y el monitor 11,6 m por 6,9.
//
// Todo se arma con cajas, cilindros, toros y esferas, con relieve real (las teclas, los ventiladores y
// el marco del monitor sobresalen de la pared). Ninguna pieza sale más de ESCENARIO.salienteAgarres
// menos 0,15 m: los agarres siempre quedan por delante de todo, así se ven y se alcanzan.
// Al final se fusionan las piezas en unas pocas mallas para que el casco dibuje poco (ver fusion.js).
import { DECORADO as D, ESCENARIO as E } from './config.js';
import { fusionar } from './fusion.js';

const U = 1.905 * 0.01 * E.escala; // una unidad de tecla (19 mm reales)
const ZF = E.z + E.profundidadPared / 2; // frente de la pared
const MITAD = E.anchoPared / 2;

// ---------- Ayudas para armar piezas ----------

const materiales = new Map();
function material(color, basico = false) {
  const clave = `${basico ? 'b' : 's'}${color}`;
  if (!materiales.has(clave)) {
    materiales.set(
      clave,
      basico
        ? new THREE.MeshBasicMaterial({ color })
        : new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0 })
    );
  }
  return materiales.get(clave);
}

// Agrega una malla con la geometría y el color dados, en la posición (x, y, z) del mundo
function poner(grupo, geometria, color, x, y, z, opciones = {}) {
  const malla = new THREE.Mesh(geometria, material(color, opciones.basico));
  malla.position.set(x, y, z);
  if (opciones.rot) malla.rotation.set(...opciones.rot);
  grupo.add(malla);
  return malla;
}

// Caja de ancho w, alto h y profundidad d, centrada en (x, y); `atras` es la distancia de su cara de atrás al frente de la pared
const caja = (g, w, h, d, x, y, atras, color, op) => poner(g, new THREE.BoxGeometry(w, h, d), color, x, y, ZF + atras + d / 2, op);
// Cilindro con el eje hacia el jugador (z): botones, ventiladores, parlantes
const cilindro = (g, radio, largo, x, y, atras, color, op = {}) =>
  poner(g, new THREE.CylinderGeometry(radio, radio, largo, 24), color, x, y, ZF + atras + largo / 2, { rot: [Math.PI / 2, 0, 0], ...op });
// Cilindro parado (eje vertical) visto de frente: se aplasta hacia el jugador hasta la profundidad `prof`
function cilindroVertical(g, radio, alto, x, y, atras, color, prof, op = {}) {
  const malla = poner(g, new THREE.CylinderGeometry(radio, radio, alto, 20), color, x, y, ZF + atras + prof / 2, op);
  malla.scale.z = prof / (2 * radio);
  return malla;
}
// Semiesfera aplastada (cúpulas de los parlantes, tapas): radio r, saliente `sal` desde `atras`
function cupula(g, radio, sal, x, y, atras, color) {
  const malla = poner(g, new THREE.SphereGeometry(radio, 14, 10), color, x, y, ZF + atras);
  malla.scale.z = sal / radio;
  return malla;
}
// Aro con el eje hacia el jugador
const aro = (g, radio, tubo, x, y, atras, color, op) => poner(g, new THREE.TorusGeometry(radio, tubo, 8, 32), color, x, y, ZF + atras, op);
const esfera = (g, radio, x, y, atras, color, op) => poner(g, new THREE.SphereGeometry(radio, 14, 10), color, x, y, ZF + atras + radio, op);

// Cable: un tubo fino que sigue una curva de puntos [x, y, atras]
function cable(g, puntos, radio, color) {
  const curva = new THREE.CatmullRomCurve3(puntos.map(([x, y, atras]) => new THREE.Vector3(x, y, ZF + atras)));
  return poner(g, new THREE.TubeGeometry(curva, 24, radio, 6, false), color, 0, 0, 0);
}

// Malla instanciada de cajas: piezas = [{ x, y, z, ancho, alto, profundidad, color }]
function instanciadas(g, piezas, colorBase = '#ffffff') {
  const malla = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material(colorBase), piezas.length);
  const auxiliar = new THREE.Object3D();
  const color = new THREE.Color();
  piezas.forEach((p, i) => {
    auxiliar.position.set(p.x, p.y, p.z);
    auxiliar.scale.set(p.ancho, p.alto, p.profundidad);
    auxiliar.updateMatrix();
    malla.setMatrixAt(i, auxiliar.matrix);
    malla.setColorAt(i, color.set(p.color));
  });
  malla.instanceMatrix.needsUpdate = true;
  g.add(malla);
  return malla;
}

// Textura dibujada en un canvas, para pantallas, leyendas y logos
function texturaCanvas(ancho, alto, dibujar) {
  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  dibujar(lienzo.getContext('2d'), ancho, alto);
  const textura = new THREE.CanvasTexture(lienzo);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  return textura;
}

// Plano con una textura (no se fusiona: tiene textura)
function plano(g, ancho, alto, textura, x, y, atras, basico = true) {
  const malla = new THREE.Mesh(
    new THREE.PlaneGeometry(ancho, alto),
    basico ? new THREE.MeshBasicMaterial({ map: textura, transparent: true }) : new THREE.MeshStandardMaterial({ map: textura })
  );
  malla.position.set(x, y, ZF + atras);
  malla.userData.noFusionar = true;
  g.add(malla);
  return malla;
}

// ---------- Fondo ----------

// Pared de atrás de todo, con tiras verticales como un empapelado liso
function crearFondo(g, alturaTotal) {
  caja(g, E.anchoPared, alturaTotal, E.profundidadPared, 0, alturaTotal / 2, -E.profundidadPared, '#322c46');
  const tiras = [];
  for (let x = -MITAD + 0.6; x < MITAD; x += 1.25) {
    tiras.push({ x, y: alturaTotal / 2, z: ZF + 0.01, ancho: 0.04, alto: alturaTotal, profundidad: 0.02, color: '#3a3452' });
  }
  instanciadas(g, tiras);
}

// ---------- Tramo 1: escritorio y teclado ----------

// Teclado sin teclado numérico: filas de teclas con sus anchos reales. y = centro de la fila en unidades
// de tecla desde arriba; x = borde izquierdo en unidades; w, h = ancho y alto en unidades.
function teclasDelTeclado() {
  const teclas = [];
  const t = (e, x, y, w = 1, esp = false) => teclas.push({ e, x, y, w, h: 1, esp });

  // Fila de funciones
  t('Esc', 0, 0.5, 1, true);
  let x = 2;
  [['F1', 'F2', 'F3', 'F4'], ['F5', 'F6', 'F7', 'F8'], ['F9', 'F10', 'F11', 'F12']].forEach((grupo, i) => {
    grupo.forEach((e) => {
      t(e, x, 0.5, 1, true);
      x += 1;
    });
    x += i < 2 ? 0.5 : 0;
  });
  // Bloque principal
  const fila = (y, etiquetas, x0 = 0) => {
    let cursor = x0;
    etiquetas.forEach(([e, w = 1, esp = false]) => {
      t(e, cursor, y, w, esp);
      cursor += w;
    });
  };
  fila(2, [...'`1234567890-='.split('').map((c) => [c]), ['Retroc.', 2, true]]);
  fila(3, [['Tab', 1.5, true], ...'QWERTYUIOP[]'.split('').map((c) => [c]), ['\\', 1.5]]);
  fila(4, [['Bloq', 1.75, true], ...'ASDFGHJKL;\''.split('').map((c) => [c]), ['Enter', 2.25, true]]);
  fila(5, [['Shift', 2.25, true], ...'ZXCVBNM,./'.split('').map((c) => [c]), ['Shift', 2.75, true]]);
  fila(6, [['Ctrl', 1.25, true], ['Win', 1.25, true], ['Alt', 1.25, true], ['', 6.25], ['Alt', 1.25, true], ['Win', 1.25, true], ['Menú', 1.25, true], ['Ctrl', 1.25, true]]);
  // Bloque de navegación
  fila(0.5, [['Imp', 1, true], ['Bloq', 1, true], ['Paus', 1, true]], 15.25);
  fila(2, [['Ins', 1, true], ['Inic', 1, true], ['Re', 1, true]], 15.25);
  fila(3, [['Supr', 1, true], ['Fin', 1, true], ['Av', 1, true]], 15.25);
  fila(5, [['↑']], 16.25);
  fila(6, [['←'], ['↓'], ['→']], 15.25);
  return teclas;
}

function crearTeclado(g, y0) {
  const unidadesAncho = 18.25;
  const unidadesAlto = 6.5;
  const izquierda = -(unidadesAncho * U) / 2;
  const arriba = y0 + 5.05; // parte de arriba de las teclas
  const yCarcasa = y0 + 3.9; // centro de la carcasa del teclado

  // Carcasa: marco de abajo, cuerpo y borde que sobresale
  caja(g, unidadesAncho * U + 0.55, 3.0, 0.2, 0, yCarcasa, 0.08, D.tecladoBase);
  caja(g, unidadesAncho * U + 0.35, 2.8, 0.18, 0, yCarcasa, 0.28, D.tecladoCarcasa);
  // Luz tenue de estado en la esquina y rueda de volumen
  caja(g, 0.28, 0.05, 0.02, izquierda + 15.25 * U + 0.1, arriba + 0.2, 0.47, D.cables[1], { basico: true });
  caja(g, 0.28, 0.05, 0.02, izquierda + 16.25 * U + 0.1, arriba + 0.2, 0.47, D.cables[0], { basico: true });
  cilindro(g, 0.17, 0.12, izquierda + unidadesAncho * U - 0.2, arriba + 0.18, 0.46, D.metalOscuro);

  // Teclas: cada una con una base y una tapa más chica, para que se vea el relieve
  const bases = [];
  const tapas = [];
  const teclas = teclasDelTeclado();
  teclas.forEach((k, i) => {
    const cx = izquierda + (k.x + k.w / 2) * U;
    const cy = arriba - k.y * U;
    const color = k.esp ? D.teclaEspecial : D.teclas[i % 2];
    bases.push({ x: cx, y: cy, z: ZF + 0.46 + 0.05, ancho: k.w * U - 0.04, alto: U - 0.04, profundidad: 0.1, color });
    tapas.push({ x: cx, y: cy, z: ZF + 0.56 + 0.03, ancho: k.w * U - 0.13, alto: U - 0.13, profundidad: 0.06, color });
  });
  instanciadas(g, bases);
  instanciadas(g, tapas);

  // Letras sobre las teclas: un solo plano transparente con todas las leyendas
  const px = 44;
  const textura = texturaCanvas(Math.round(unidadesAncho * px), Math.round(unidadesAlto * px), (ctx) => {
    ctx.fillStyle = D.leyenda;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    teclas.forEach((k) => {
      if (!k.e) return;
      const tamano = k.e.length > 3 ? 13 : k.e.length > 1 ? 17 : 24;
      ctx.font = `bold ${tamano}px system-ui, sans-serif`;
      ctx.fillText(k.e, (k.x + k.w / 2) * px, k.y * px);
    });
  });
  plano(g, unidadesAncho * U, unidadesAlto * U, textura, izquierda + (unidadesAncho * U) / 2, arriba - (unidadesAlto * U) / 2, 0.625);

  // Apoyamuñecas acolchado debajo
  caja(g, unidadesAncho * U + 0.3, 1.45, 0.3, 0, y0 + 1.7, 0.08, D.apoyamunecas);
  caja(g, unidadesAncho * U + 0.15, 0.12, 0.34, 0, y0 + 2.35, 0.08, D.tecladoCarcasa);
  // Cable que sale por arriba
  cable(g, [[0, y0 + 5.35, 0.3], [0.05, y0 + 5.6, 0.2], [0.3, y0 + 5.65, 0.1]], 0.05, D.raton);
}

function crearEscritorio(g, y0) {
  // Canto del escritorio, con vetas
  caja(g, E.anchoPared, 0.9, 0.7, 0, y0 + 0.45, 0, D.escritorio);
  caja(g, E.anchoPared, 0.1, 0.76, 0, y0 + 0.93, 0, D.escritorioBorde);
  const vetas = [];
  for (let x = -MITAD + 0.8; x < MITAD; x += 1.1) {
    vetas.push({ x, y: y0 + 0.45, z: ZF + 0.71, ancho: 0.03, alto: 0.7, profundidad: 0.01, color: '#4d3b2d' });
  }
  instanciadas(g, vetas);

  // Alfombrilla con borde cosido y el mouse encima
  const px = 5.0;
  caja(g, 2.5, 3.5, 0.05, px, y0 + 3.0, 0.1, D.alfombrillaBorde);
  caja(g, 2.3, 3.3, 0.05, px, y0 + 3.0, 0.15, D.alfombrilla);
  const raton = poner(g, new THREE.CapsuleGeometry(0.42, 0.7, 4, 14), D.raton, px, y0 + 2.6, ZF + 0.38, { rot: [0, 0, 0] });
  raton.scale.z = 0.45;
  caja(g, 0.035, 0.6, 0.02, px, y0 + 3.0, 0.55, D.tecladoBase); // división de los botones
  caja(g, 0.8, 0.035, 0.02, px, y0 + 2.7, 0.55, D.tecladoBase);
  cilindro(g, 0.09, 0.14, px, y0 + 3.08, 0.5, D.cables[0], { rot: [0, 0, Math.PI / 2] }); // rueda
  cable(g, [[px, y0 + 3.55, 0.35], [px + 0.25, y0 + 4.2, 0.25], [px - 0.4, y0 + 4.8, 0.2], [px - 1.3, y0 + 5.0, 0.15]], 0.04, D.raton);

  // Taza de café
  const tx = -4.6;
  cilindroVertical(g, 0.55, 1.2, tx, y0 + 1.6, 0.05, D.taza, 0.6);
  poner(g, new THREE.TorusGeometry(0.3, 0.07, 8, 16, Math.PI), D.taza, tx + 0.7, y0 + 1.6, ZF + 0.6, { rot: [0, 0, -Math.PI / 2] });
  

  // Cuaderno con espiral apoyado, y un lápiz
  const cuaderno = new THREE.Group();
  g.add(cuaderno);
  cuaderno.position.set(-5.2, y0 + 3.9, 0);
  cuaderno.rotation.z = 0.1;
  caja(cuaderno, 2.1, 2.9, 0.12, 0, 0, 0.1, '#d9ceb3');
  for (let i = 0; i < 8; i++) caja(cuaderno, 1.6, 0.025, 0.02, 0, 1.1 - i * 0.28, 0.23, '#8a8aa8');
  for (let i = 0; i < 7; i++) cilindro(cuaderno, 0.06, 0.34, -0.95 + 0, 1.2 - i * 0.4, 0.08, D.metal, { rot: [0, 0, 0] });
  poner(g, new THREE.CylinderGeometry(0.06, 0.06, 1.7, 8), D.cables[2], -3.6, y0 + 1.5, ZF + 0.12, { rot: [0, 0, 1.2] });
}

// ---------- Tramo 2: torre de PC y parlantes ----------

// Ventilador de la torre: marco, aro de luz suave, buje y siete aspas
function ventilador(g, cx, cy, atras, colorLuz) {
  caja(g, 2.2, 2.2, 0.2, cx, cy, atras, D.ventilador);
  aro(g, 0.98, 0.045, cx, cy, atras + 0.21, colorLuz, { basico: true });
  aro(g, 0.9, 0.03, cx, cy, atras + 0.2, D.metalOscuro);
  cilindro(g, 0.34, 0.16, cx, cy, atras + 0.18, D.metalOscuro);
  for (let i = 0; i < 7; i++) {
    const pivote = new THREE.Group();
    pivote.position.set(cx, cy, ZF + atras + 0.24);
    pivote.rotation.z = (i * Math.PI * 2) / 7;
    g.add(pivote);
    poner(pivote, new THREE.BoxGeometry(0.4, 0.62, 0.035), D.ventiladorAspa, 0, 0.62, 0, { rot: [0, 0.55, 0] });
  }
}

function crearTorre(g, y0) {
  const ancho = 4.0;
  const alto = 8.0;
  const cy = y0 + alto / 2;

  // Cuerpo y marco de la torre
  caja(g, ancho, alto, 0.3, 0, cy, 0, D.torreCarcasa);
  [-1, 1].forEach((lado) => caja(g, 0.22, alto, 0.7, lado * (ancho / 2 - 0.11), cy, 0, D.metalOscuro));
  caja(g, ancho, 0.5, 0.7, 0, y0 + alto - 0.25, 0, D.metalOscuro); // tapa de arriba
  caja(g, ancho, 0.4, 0.62, 0, y0 + 0.2, 0, D.metalOscuro); // base
  [-1, 1].forEach((lado) => caja(g, 0.5, 0.25, 0.7, lado * 1.5, y0 - 0.02, 0, D.tecladoBase)); // patas

  // Panel frontal de malla: miles de agujeritos que dejan ver la sombra de adentro
  caja(g, ancho - 0.5, alto - 1.1, 0.06, 0, cy - 0.05, 0.26, D.tecladoBase);
  const agujeros = [];
  for (let y = y0 + 0.75; y < y0 + alto - 0.65; y += 0.22) {
    const fila = Math.round((y - y0) / 0.22);
    for (let x = -ancho / 2 + 0.45; x < ancho / 2 - 0.4; x += 0.22) {
      agujeros.push({ x: x + (fila % 2) * 0.11, y, z: ZF + 0.33, ancho: 0.1, alto: 0.1, profundidad: 0.02, color: '#15121d' });
    }
  }
  instanciadas(g, agujeros);

  // Tres ventiladores con luz suave de colores distintos
  [
    [y0 + 1.95, D.cables[2]],
    [y0 + 4.15, D.cables[1]],
    [y0 + 6.35, D.cables[0]],
  ].forEach(([y, luz]) => ventilador(g, 0, y, 0.3, luz));

  // Panel de arriba: botón de encendido, puertos y jack de auriculares
  caja(g, 1.8, 0.2, 0.25, 0, y0 + alto - 0.5, 0.4, D.tecladoCarcasa);
  cilindro(g, 0.15, 0.08, -0.6, y0 + alto - 0.5, 0.65, D.ramLuz, { basico: true });
  [0.2, 0.5, 0.8].forEach((x) => caja(g, 0.2, 0.06, 0.04, x, y0 + alto - 0.5, 0.65, '#15121d'));
  // Rejilla de ventilación de la base y logo
  const rejillas = [];
  for (let x = -1.5; x <= 1.5; x += 0.25) rejillas.push({ x, y: y0 + 0.2, z: ZF + 0.63, ancho: 0.09, alto: 0.26, profundidad: 0.02, color: '#15121d' });
  instanciadas(g, rejillas);
  // Tornillos en las esquinas
  [-1, 1].forEach((lx) => [y0 + 0.5, y0 + alto - 0.5].forEach((y) => cilindro(g, 0.07, 0.06, lx * (ancho / 2 - 0.11), y, 0.7, D.metal)));
  // Cables que salen de la parte de arriba
  cable(g, [[-1.0, y0 + alto, 0.3], [-1.3, y0 + alto + 0.35, 0.3], [-2.2, y0 + alto + 0.3, 0.3]], 0.06, D.cables[0]);
}

// Parlante de escritorio: caja, rejilla con borde, woofer y tweeter
function crearParlante(g, cx, y0, lado) {
  const w = 2.8;
  const h = 4.4;
  const cy = y0 + h / 2;
  caja(g, w, h, 0.55, cx, cy, 0, D.parlante);
  caja(g, w - 0.3, h - 0.3, 0.06, cx, cy, 0.55, D.tecladoBase);
  // Woofer
  const wy = y0 + 1.6;
  aro(g, 0.95, 0.07, cx, wy, 0.63, D.metal);
  cilindro(g, 0.9, 0.06, cx, wy, 0.58, D.parlanteCono);
  aro(g, 0.55, 0.05, cx, wy, 0.66, D.metalOscuro);
  cupula(g, 0.3, 0.1, cx, wy, 0.66, D.metalOscuro);
  // Tweeter
  const ty = y0 + 3.5;
  aro(g, 0.4, 0.05, cx, ty, 0.63, D.metal);
  cilindro(g, 0.36, 0.06, cx, ty, 0.58, D.parlanteCono);
  cupula(g, 0.15, 0.08, cx, ty, 0.64, D.metalOscuro);
  // Luz de encendido y perilla
  cilindro(g, 0.06, 0.04, cx + lado * 0.9, y0 + 0.35, 0.62, D.cables[1], { basico: true });
  cilindro(g, 0.13, 0.08, cx - lado * 0.9, y0 + 0.35, 0.61, D.metal);
}

// ---------- Tramo 3: monitor ----------

function pantallaDelMonitor(ancho, alto) {
  const px = 80;
  return texturaCanvas(Math.round(ancho * px), Math.round(alto * px), (ctx, w, h) => {
    // Fondo: degradado azul violáceo apagado
    const degradado = ctx.createLinearGradient(0, 0, 0, h);
    degradado.addColorStop(0, '#222b4a');
    degradado.addColorStop(1, '#302c58');
    ctx.fillStyle = degradado;
    ctx.fillRect(0, 0, w, h);
    // Trama de píxeles
    ctx.strokeStyle = 'rgba(160,150,210,0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    // Iconos del escritorio, a la izquierda
    const colores = ['#7a62b8', '#5b8a86', '#d9a15b', '#8fc3e6', '#c4665b', '#9b82e6'];
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = colores[i];
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.roundRect(40, 40 + i * 95, 56, 56, 12);
      ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#cfc6e4';
      ctx.fillRect(38, 104 + i * 95, 60, 6);
    }
    ctx.globalAlpha = 1;
    // Ventana de un juego, con título y un paisaje de píxeles
    const vx = w * 0.2;
    const vy = h * 0.12;
    const vw = w * 0.62;
    const vh = h * 0.68;
    ctx.fillStyle = '#17142a';
    ctx.beginPath();
    ctx.roundRect(vx, vy, vw, vh, 10);
    ctx.fill();
    ctx.fillStyle = '#3a3460';
    ctx.fillRect(vx, vy, vw, 34);
    ctx.fillStyle = '#cfc6e4';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('NIVEL 1-1  ·  GLITCH.EXE', vx + 14, vy + 24);
    const cielo = ctx.createLinearGradient(0, vy + 34, 0, vy + vh);
    cielo.addColorStop(0, '#3b4a86');
    cielo.addColorStop(1, '#8f7cb8');
    ctx.fillStyle = cielo;
    ctx.fillRect(vx + 6, vy + 40, vw - 12, vh - 46);
    ctx.fillStyle = '#4c4278';
    for (let i = 0; i < 8; i++) ctx.fillRect(vx + 30 + i * 70, vy + vh - 150 - ((i * 37) % 70), 70, 150 + ((i * 37) % 70));
    ctx.fillStyle = '#2d2a52';
    for (let i = 0; i < 14; i++) ctx.fillRect(vx + 6 + i * 44, vy + vh - 60 - ((i * 23) % 30), 44, 60 + ((i * 23) % 30));
    // Personaje de píxeles y corazones
    ctx.fillStyle = '#f0e9fb';
    ctx.fillRect(vx + vw * 0.45, vy + vh - 130, 28, 36);
    ctx.fillStyle = '#c4665b';
    for (let i = 0; i < 3; i++) ctx.fillRect(vx + 22 + i * 34, vy + 56, 24, 22);
    // Barra de tareas
    ctx.fillStyle = '#171428';
    ctx.fillRect(0, h - 46, w, 46);
    ctx.fillStyle = '#7a62b8';
    ctx.beginPath();
    ctx.roundRect(14, h - 38, 30, 30, 8);
    ctx.fill();
    ctx.fillStyle = '#cfc6e4';
    ctx.font = '20px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('20:26', w - 24, h - 16);
  });
}

function crearMonitor(g, y0, alturaTope) {
  const ancho = 11.6;
  const alto = alturaTope - (y0 + 0.1);
  const cy = y0 + 0.1 + alto / 2;
  const marco = 0.3;
  const mentón = 0.55;

  // Marco con relieve: cuerpo, borde y esquinas
  caja(g, ancho, alto, 0.25, 0, cy, 0, D.monitorMarco);
  caja(g, ancho, marco, 0.5, 0, alturaTope - marco / 2, 0, D.monitorMarco); // borde de arriba
  [-1, 1].forEach((lado) => caja(g, marco, alto, 0.5, lado * (ancho / 2 - marco / 2), cy, 0, D.monitorMarco));
  caja(g, ancho, mentón, 0.55, 0, y0 + 0.1 + mentón / 2, 0, D.monitorMarco); // mentón
  // Pantalla hundida adentro del marco
  const anchoPantalla = ancho - marco * 2;
  const altoPantalla = alto - marco - mentón;
  const yPantalla = y0 + 0.1 + mentón + altoPantalla / 2;
  caja(g, anchoPantalla, altoPantalla, 0.06, 0, yPantalla, 0.25, D.monitorPantalla);
  plano(g, anchoPantalla, altoPantalla, pantallaDelMonitor(anchoPantalla, altoPantalla), 0, yPantalla, 0.325);

  // Logo en el mentón y luz de encendido
  const logo = texturaCanvas(256, 64, (ctx, w, h) => {
    ctx.fillStyle = '#8f8aa8';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '8px';
    ctx.fillText('GLITCH', w / 2, h / 2);
  });
  plano(g, 1.6, 0.4, logo, 0, y0 + 0.1 + mentón / 2, 0.56);
  caja(g, 0.18, 0.05, 0.02, ancho / 2 - 0.9, y0 + 0.1 + mentón / 2, 0.55, D.cables[1], { basico: true });
  // Botones del costado
  [0, 1, 2].forEach((i) => caja(g, 0.2, 0.06, 0.04, ancho / 2 - 2.0 - i * 0.35, y0 + 0.1 + mentón / 2, 0.55, D.metalOscuro));
}

// ---------- Todo junto ----------

// Arma todo el decorado de los tres tramos y lo devuelve fusionado en pocas mallas
export function crearDecorado(datos) {
  const raiz = new THREE.Group();
  const [t1, t2, t3] = datos.tramos;
  const alturaTope = datos.alturaFinal;

  crearFondo(raiz, alturaTope + 0.01);
  crearEscritorio(raiz, t1.y0);
  crearTeclado(raiz, t1.y0);
  crearTorre(raiz, t2.y0);
  crearParlante(raiz, -4.4, t2.y0, 1);
  crearParlante(raiz, 4.4, t2.y0, -1);
  crearMonitor(raiz, t3.y0, alturaTope);

  return fusionar(raiz);
}
