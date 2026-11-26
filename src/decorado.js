// Decorado del setup gamer gigante. Cada tramo es una pared (un escalón sólido) con la cara de un objeto:
// un teclado, una torre de PC con parlantes y un monitor. Son formas grandes y simples, sin detalles chicos,
// para que se reconozca cada objeto y se distingan bien los agarres, que son lo único con colores vivos.
//
// Todo se arma con cajas, cilindros y toros, con algo de relieve (ninguna pieza sale más de 0,7 m de la
// pared; los agarres salen ESCENARIO.salienteAgarres = 1,15 m, siempre por delante de todo). Cada agarre
// lleva un poste que lo une con la pared, así no parece flotar. Al final se fusionan las piezas en unas
// pocas mallas para que el casco dibuje poco (ver fusion.js). Los pisos de arriba de cada escalón están
// en plataformas.js.
import { DECORADO as D, ESCENARIO as E, ESTANTE, INTERMITENTE, LATA, PANEL } from './config.js';
import { fusionar } from './fusion.js';
import { teclasDelTeclado, ANCHO_TECLADO } from './teclado.js';

const U = E.teclado.unidad;
const W = E.anchoPared;

// ---------- Ayudas para armar piezas ----------
// Cada pared se arma en un grupo cuyo origen está en el frente de la pared: z = 0 es la pared y z > 0 es
// hacia el jugador. `atras` es la distancia de la cara de atrás de la pieza a la pared.

const materiales = new Map();
function material(color, basico = false) {
  const clave = `${basico ? 'b' : 's'}${color}`;
  if (!materiales.has(clave)) {
    materiales.set(
      clave,
      basico ? new THREE.MeshBasicMaterial({ color }) : new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0 })
    );
  }
  return materiales.get(clave);
}

function poner(grupo, geometria, color, x, y, z, opciones = {}) {
  const malla = new THREE.Mesh(geometria, material(color, opciones.basico));
  malla.position.set(x, y, z);
  if (opciones.rot) malla.rotation.set(...opciones.rot);
  grupo.add(malla);
  return malla;
}
const caja = (g, w, h, d, x, y, atras, color, op) => poner(g, new THREE.BoxGeometry(w, h, d), color, x, y, atras + d / 2, op);
// Cilindro con el eje hacia el jugador
const cilindro = (g, radio, largo, x, y, atras, color, op = {}) =>
  poner(g, new THREE.CylinderGeometry(radio, radio, largo, 24), color, x, y, atras + largo / 2, { rot: [Math.PI / 2, 0, 0], ...op });
// Aro con el eje hacia el jugador
const aro = (g, radio, tubo, x, y, atras, color, op) => poner(g, new THREE.TorusGeometry(radio, tubo, 8, 32), color, x, y, atras, op);

// Malla instanciada de cajas: piezas = [{ x, y, z, ancho, alto, profundidad, color }]
function instanciadas(g, piezas) {
  const malla = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material('#ffffff'), piezas.length);
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
function plano(g, ancho, alto, textura, x, y, atras) {
  const malla = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), new THREE.MeshBasicMaterial({ map: textura }));
  malla.position.set(x, y, atras);
  malla.userData.noFusionar = true;
  g.add(malla);
  return malla;
}

// ---------- Tramo 1: teclado ----------

// Teclado completo que ocupa toda la pared: carcasa, hilera de teclas lisas y apoyamuñecas abajo
function crearTeclado(g, t) {
  const apoyo = 1.55; // alto del apoyamuñecas
  const altoCarcasa = t.y1 - apoyo;
  caja(g, W, altoCarcasa, 0.3, 0, apoyo + altoCarcasa / 2, 0, D.tecladoCarcasa);
  // Marco: borde de arriba y de los costados, apenas más alto que las teclas
  caja(g, W, 0.3, 0.5, 0, t.y1 - 0.15, 0, D.tecladoBase);
  [-1, 1].forEach((lado) => caja(g, 0.3, altoCarcasa, 0.5, lado * (W / 2 - 0.15), apoyo + altoCarcasa / 2, 0, D.tecladoBase));
  // Apoyamuñecas acolchado, con una costura que lo separa de la carcasa
  caja(g, W, apoyo, 0.42, 0, apoyo / 2, 0, D.apoyamunecas);
  caja(g, W, 0.08, 0.5, 0, apoyo, 0, D.tecladoBase);

  // Teclas lisas, de dos tonos (las especiales más oscuras)
  const izquierda = -ANCHO_TECLADO / 2;
  const teclas = teclasDelTeclado().map((k, i) => ({
    x: izquierda + (k.x + k.w / 2) * U,
    y: E.teclado.arriba - k.y * U,
    z: 0.3 + 0.17,
    ancho: k.w * U - 0.06,
    alto: k.h * U - 0.06,
    profundidad: 0.34,
    color: k.esp ? D.teclaEspecial : D.teclas[i % 2],
  }));
  instanciadas(g, teclas);
  // Entre el apoyamuñecas y las teclas, el frente de la carcasa: una franja de luz suave y una placa con el logo
  const abajoDeTeclas = E.teclado.arriba - 3.25 - 0.3;
  if (abajoDeTeclas - apoyo > 1.0) {
    caja(g, W - 1.2, 0.08, 0.06, 0, apoyo + 0.5, 0.3, D.cables[0], { basico: true });
    caja(g, W - 1.2, 0.08, 0.06, 0, abajoDeTeclas - 0.3, 0.3, D.cables[1], { basico: true });
    caja(g, 2.6, 0.7, 0.08, 0, (apoyo + abajoDeTeclas) / 2, 0.3, D.tecladoBase);
  }
}

// ---------- Tramo 2: torre de PC con parlantes ----------

// Ventilador de la torre: marco cuadrado, aro de color suave, buje y seis aspas
function ventilador(g, cx, cy, atras, colorLuz) {
  caja(g, 2.3, 2.3, 0.12, cx, cy, atras, D.ventilador);
  aro(g, 0.98, 0.07, cx, cy, atras + 0.14, colorLuz, { basico: true });
  cilindro(g, 0.34, 0.14, cx, cy, atras + 0.1, D.metalOscuro);
  for (let i = 0; i < 6; i++) {
    const pivote = new THREE.Group();
    pivote.position.set(cx, cy, atras + 0.2);
    pivote.rotation.z = (i * Math.PI * 2) / 6;
    g.add(pivote);
    poner(pivote, new THREE.BoxGeometry(0.46, 0.6, 0.05), D.ventiladorAspa, 0, 0.62, 0, { rot: [0, 0.5, 0] });
  }
}

function crearTorre(g, t) {
  const ancho = 4.0;
  const alto = t.alto;
  const cy = t.y0 + alto / 2;
  // Fondo de toda la pared, con tiras verticales apenas más claras (como un mueble de madera pintada)
  caja(g, W, alto, 0.2, 0, cy, 0, D.torreFondo);
  const tiras = [];
  for (let x = -W / 2 + 0.9; x < W / 2; x += 1.8) tiras.push({ x, y: cy, z: 0.215, ancho: 0.12, alto, profundidad: 0.03, color: D.torreFondoTira });
  instanciadas(g, tiras);

  // Torre: cuerpo, marco con relieve y panel frontal oscuro
  caja(g, ancho, alto, 0.35, 0, cy, 0.2, D.torreCarcasa);
  [-1, 1].forEach((lado) => caja(g, 0.26, alto, 0.7, lado * (ancho / 2 - 0.13), cy, 0, D.metalOscuro));
  caja(g, ancho, 0.45, 0.7, 0, t.y1 - 0.225, 0, D.metalOscuro); // tapa
  caja(g, ancho, 0.4, 0.62, 0, t.y0 + 0.2, 0, D.metalOscuro); // base
  caja(g, ancho - 0.55, alto - 1.0, 0.06, 0, cy, 0.55, D.tecladoBase);
  // Tres ventiladores con aros de distinto color
  [
    [t.y0 + t.alto * 0.24, D.cables[2]],
    [t.y0 + t.alto * 0.5, D.cables[1]],
    [t.y0 + t.alto * 0.76, D.cables[0]],
  ].forEach(([y, luz]) => ventilador(g, 0, y, 0.55, luz));
  // Botón de encendido arriba
  cilindro(g, 0.17, 0.1, 0, t.y1 - 0.75, 0.6, D.ramLuz, { basico: true });

  // Parlantes a los costados: caja, cono grande y cono chico
  [-1, 1].forEach((lado) => {
    const cx = lado * 4.3;
    caja(g, 2.6, 4.4, 0.55, cx, t.y0 + 2.2, 0, D.parlante);
    cilindro(g, 0.95, 0.1, cx, t.y0 + 1.5, 0.55, D.parlanteCono);
    aro(g, 0.98, 0.08, cx, t.y0 + 1.5, 0.64, D.metal);
    cilindro(g, 0.3, 0.1, cx, t.y0 + 1.5, 0.62, D.metalOscuro);
    cilindro(g, 0.42, 0.1, cx, t.y0 + 3.3, 0.55, D.parlanteCono);
    aro(g, 0.44, 0.06, cx, t.y0 + 3.3, 0.64, D.metal);
  });
}

// ---------- Tramo 3: monitor ----------

// Pantalla del monitor: un escritorio de juego, simple y sin letras
function pantallaDelMonitor(ancho, alto) {
  const px = 60;
  return texturaCanvas(Math.round(ancho * px), Math.round(alto * px), (ctx, w, h) => {
    const degradado = ctx.createLinearGradient(0, 0, 0, h);
    degradado.addColorStop(0, '#2d3a66');
    degradado.addColorStop(1, '#4a4580');
    ctx.fillStyle = degradado;
    ctx.fillRect(0, 0, w, h);
    // Ventana de un juego: cielo, edificios y un personaje
    const vx = w * 0.16;
    const vy = h * 0.1;
    const vw = w * 0.68;
    const vh = h * 0.7;
    ctx.fillStyle = '#1d1a36';
    ctx.beginPath();
    ctx.roundRect(vx, vy, vw, vh, 12);
    ctx.fill();
    ctx.fillStyle = '#3d3866';
    ctx.fillRect(vx, vy, vw, 30);
    const cielo = ctx.createLinearGradient(0, vy + 30, 0, vy + vh);
    cielo.addColorStop(0, '#4a5a9c');
    cielo.addColorStop(1, '#9a86c4');
    ctx.fillStyle = cielo;
    ctx.fillRect(vx + 8, vy + 38, vw - 16, vh - 46);
    ctx.fillStyle = '#5a4e8a';
    for (let i = 0; i < 7; i++) ctx.fillRect(vx + 30 + i * 80, vy + vh - 170 - ((i * 37) % 80), 80, 170 + ((i * 37) % 80));
    ctx.fillStyle = '#322f5c';
    ctx.fillRect(vx + 8, vy + vh - 70, vw - 16, 62);
    ctx.fillStyle = '#f0e9fb';
    ctx.fillRect(vx + vw * 0.45, vy + vh - 150, 30, 40);
    ctx.fillStyle = '#c4665b';
    for (let i = 0; i < 3; i++) ctx.fillRect(vx + 24 + i * 38, vy + 54, 26, 24);
    // Iconos a la izquierda y barra de abajo
    const colores = ['#7a62b8', '#5b8a86', '#d9a15b', '#8fc3e6'];
    colores.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.roundRect(36, 40 + i * 110, 64, 64, 14);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#1b1830';
    ctx.fillRect(0, h - 44, w, 44);
    ctx.fillStyle = '#7a62b8';
    ctx.beginPath();
    ctx.roundRect(14, h - 36, 28, 28, 8);
    ctx.fill();
  });
}

function crearMonitor(g, t) {
  const ancho = 11.6;
  const alto = t.alto - 0.1;
  const cy = t.y0 + 0.1 + alto / 2;
  const marco = 0.3;
  const menton = 0.6;
  caja(g, W, t.alto, 0.2, 0, t.y0 + t.alto / 2, 0, D.torreFondo);
  // Marco con relieve: cuerpo, borde de arriba, costados y mentón
  caja(g, ancho, alto, 0.25, 0, cy, 0, D.monitorMarco);
  caja(g, ancho, marco, 0.5, 0, t.y1 - marco / 2, 0, D.monitorMarco);
  [-1, 1].forEach((lado) => caja(g, marco, alto, 0.5, lado * (ancho / 2 - marco / 2), cy, 0, D.monitorMarco));
  caja(g, ancho, menton, 0.55, 0, t.y0 + 0.1 + menton / 2, 0, D.monitorMarco);
  // Pantalla hundida adentro del marco
  const anchoPantalla = ancho - marco * 2;
  const altoPantalla = alto - marco - menton;
  const yPantalla = t.y0 + 0.1 + menton + altoPantalla / 2;
  caja(g, anchoPantalla, altoPantalla, 0.06, 0, yPantalla, 0.25, D.monitorPantalla);
  plano(g, anchoPantalla, altoPantalla, pantallaDelMonitor(anchoPantalla, altoPantalla), 0, yPantalla, 0.325);
  // Luz de encendido en el mentón
  caja(g, 0.2, 0.06, 0.04, ancho / 2 - 0.9, t.y0 + 0.1 + menton / 2, 0.55, D.cables[1], { basico: true });
}

// ---------- Postes de los agarres y soportes del reborde ----------

// Cada agarre se apoya en la pared con una placa y un poste (más claros que el decorado, para que se vean):
// así ninguno parece flotar. Los paneles que giran tienen un eje en el medio. El reborde de arriba de cada
// pared tiene soportes largos.
function crearPostes(paredes, datos) {
  const profundidad = { firme: E.tecla.profundidad, hunde: E.tecla.profundidad, lata: LATA.radio * 2 + 0.1, intermitente: INTERMITENTE.profundidad };
  const apoyar = (g, x, y, largo) => {
    caja(g, 0.5, 0.5, 0.06, x, y, 0, D.postePlaca);
    caja(g, 0.2, 0.2, largo, x, y, 0.05, D.poste);
  };
  datos.agarres.forEach((a) => {
    apoyar(paredes[a.tramo], a.x, a.y, E.salienteAgarres - (profundidad[a.tipo] || E.tecla.profundidad));
  });
  datos.paneles.forEach((p) => apoyar(paredes[p.tramo], p.x, p.y, E.panel.centro - PANEL.grosor / 2));
  datos.bordes.forEach((b) => {
    const g = paredes[b.tramo];
    b.xs.forEach((x) => caja(g, 0.2, 0.2, E.salienteAgarres - 0.05, x, b.y, 0.05, D.poste));
  });
}

// ---------- Estantes ----------

// Pequeña base donde pararse: una tabla y dos ménsulas en diagonal que la sostienen. El borde ámbar, que se
// puede agarrar para subirse, lo crea escenario.js (es un agarre)
function crearEstantes(paredes, datos) {
  datos.estantes.forEach((e) => {
    const g = paredes[e.tramo];
    const { ancho, profundidad, grosor } = ESTANTE;
    caja(g, ancho, grosor, profundidad, e.x, e.y - grosor / 2, 0, D.estante);
    caja(g, ancho, 0.5, 0.12, e.x, e.y - 0.25, 0, D.estante); // placa contra la pared
    [-1, 1].forEach((lado) => {
      const alto = 1.0;
      const largo = Math.hypot(alto, profundidad - 0.3);
      const pivote = new THREE.Group();
      pivote.position.set(e.x + lado * (ancho / 2 - 0.15), e.y - grosor - alto / 2, (profundidad - 0.3) / 2 + 0.05);
      pivote.rotation.x = -Math.atan2(alto, profundidad - 0.3);
      g.add(pivote);
      poner(pivote, new THREE.BoxGeometry(0.12, 0.12, largo), D.poste, 0, 0, 0);
    });
  });
}

// ---------- Todo junto ----------

// Arma el decorado de las tres paredes y lo devuelve fusionado en pocas mallas
export function crearDecorado(datos) {
  const raiz = new THREE.Group();
  const paredes = datos.tramos.map((t) => {
    const g = new THREE.Group();
    g.position.z = t.frente;
    raiz.add(g);
    // Bloque macizo del escalón: llega al piso y se extiende hacia atrás hasta la pared siguiente
    const ultimo = t.indice === datos.tramos.length - 1;
    const profundidad = t.frente - (ultimo ? E.final.fondoZ : datos.tramos[t.indice + 1].frente);
    caja(g, W, t.y1, profundidad, 0, t.y1 / 2, -profundidad, D.bloque);
    return g;
  });
  const [t1, t2, t3] = datos.tramos;
  crearTeclado(paredes[0], t1);
  crearTorre(paredes[1], t2);
  crearMonitor(paredes[2], t3);
  crearPostes(paredes, datos);
  crearEstantes(paredes, datos);
  return fusionar(raiz);
}
