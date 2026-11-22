// Plataformas del setup: los entrepaños de descanso de los tramos 1 y 2 (con rejilla y soportes, para que
// no parezcan flotar y para que se vean los agarres a través de ellos) y el piso grande de arriba, sobre el
// monitor, con el botón RESET al fondo y objetos de videojuegos donde se esconden los fragmentos.
// Son piezas de adorno: dónde se puede parar el jugador lo decide el componente checkpoint.
import { DECORADO as D, ESCENARIO as E } from './config.js';
import { fusionar } from './fusion.js';

const ZF = E.z + E.profundidadPared / 2; // frente de la pared

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
function poner(grupo, geometria, color, x, y, z, opciones = {}) {
  const malla = new THREE.Mesh(geometria, material(color, opciones.basico));
  malla.position.set(x, y, z);
  if (opciones.rot) malla.rotation.set(...opciones.rot);
  grupo.add(malla);
  return malla;
}
// Caja centrada en (x, y, z) del mundo
const caja = (g, w, h, d, x, y, z, color, op) => poner(g, new THREE.BoxGeometry(w, h, d), color, x, y, z, op);
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
}

// ---------- Entrepaño con rejilla ----------

// Superficie (y) del entrepaño; sale de la pared `profundidad` metros hacia el jugador
function entrepano(g, y, profundidad, ancho) {
  const medio = ZF + profundidad / 2;

  // Rejilla metálica: barras paralelas con huecos, por las que se ve hacia arriba y hacia abajo
  const barras = [];
  for (let x = -ancho / 2 + 0.1; x <= ancho / 2 - 0.05; x += 0.16) {
    barras.push({ x, y: y - 0.035, z: medio, ancho: 0.07, alto: 0.07, profundidad: profundidad, color: D.rejilla });
  }
  instanciadas(g, barras);
  // Vigas de abajo, que sostienen la rejilla
  [0.1, profundidad * 0.35, profundidad * 0.7, profundidad - 0.1].forEach((z) =>
    caja(g, ancho, 0.14, 0.14, 0, y - 0.14, ZF + z, D.soporte)
  );
  // Borde del frente y de los costados, con una franja de luz suave que marca el checkpoint
  caja(g, ancho, 0.22, 0.14, 0, y - 0.04, ZF + profundidad, D.soporte);
  caja(g, ancho - 0.3, 0.04, 0.03, 0, y + 0.08, ZF + profundidad + 0.05, D.luzCheckpoint, { basico: true });
  [-1, 1].forEach((lado) => caja(g, 0.14, 0.22, profundidad, lado * (ancho / 2), y - 0.04, medio, D.soporte));

  // Escuadras que la sostienen de la pared (para que no parezca que flota)
  const posiciones = [-5, -2.5, 0, 2.5, 5].map((x) => x * (ancho / 12));
  posiciones.forEach((x) => {
    const dy = 1.5;
    const dz = profundidad - 0.3;
    const largo = Math.hypot(dy, dz);
    // Barra diagonal: de la pared (abajo) a la viga del frente (arriba)
    const brazo = caja(g, 0.14, 0.14, largo, x, y - 0.2 - dy / 2, ZF + 0.05 + dz / 2, D.soporte);
    brazo.rotation.x = -Math.atan2(dy, dz); // sube hacia el frente
    caja(g, 0.5, 0.5, 0.1, x, y - 0.2 - dy, ZF + 0.05, D.soporte); // placa en la pared
    [-0.17, 0.17].forEach((dx) => poner(g, new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8), D.metal, x + dx, y - 0.2 - dy, ZF + 0.12, { rot: [Math.PI / 2, 0, 0] }));
  });
}

// ---------- Piso de arriba ----------

// Control de videojuegos gigante tirado en el piso
function control(g, x, z, y, giro) {
  const c = new THREE.Group();
  c.position.set(x, y, z);
  c.rotation.y = giro;
  g.add(c);
  caja(c, 3.4, 0.5, 1.9, 0, 0.25, 0, D.controlCuerpo);
  [-1, 1].forEach((lado) => poner(c, new THREE.CylinderGeometry(0.62, 0.62, 0.5, 18), D.controlCuerpo, lado * 1.55, 0.25, 0.45));
  caja(c, 1.2, 0.18, 1.0, 0, 0.58, -0.1, D.controlCuerpo);
  // Cruceta y botones de colores
  caja(c, 0.9, 0.12, 0.3, -1.05, 0.56, -0.1, D.joystickPalo);
  caja(c, 0.3, 0.12, 0.9, -1.05, 0.56, -0.1, D.joystickPalo);
  [[0, -0.4], [0.4, 0], [0, 0.4], [-0.4, 0]].forEach(([dx, dz], i) =>
    poner(c, new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16), D.controlBotones[i], 1.05 + dx * 0.9, 0.56, -0.1 + dz * 0.9)
  );
  // Palancas
  [[-0.55, 0.55], [0.55, 0.55]].forEach(([dx, dz]) => {
    poner(c, new THREE.CylinderGeometry(0.3, 0.3, 0.12, 16), D.joystickBase, dx, 0.56, dz);
    poner(c, new THREE.CylinderGeometry(0.22, 0.22, 0.12, 16), D.joystickPalo, dx, 0.66, dz);
  });
  [-0.2, 0.2].forEach((dx) => caja(c, 0.3, 0.06, 0.12, dx, 0.52, -0.55, D.joystickBase));
}

// Joystick de arcade con sus botones
function joystick(g, x, z, y) {
  const j = new THREE.Group();
  j.position.set(x, y, z);
  g.add(j);
  caja(j, 2.2, 0.55, 2.0, 0, 0.275, 0, D.joystickBase);
  caja(j, 2.0, 0.1, 1.8, 0, 0.6, 0, D.controlCuerpo);
  poner(j, new THREE.CylinderGeometry(0.3, 0.38, 0.18, 16), D.joystickPalo, -0.35, 0.74, 0);
  poner(j, new THREE.CylinderGeometry(0.1, 0.1, 1.4, 12), D.joystickPalo, -0.35, 1.4, 0);
  poner(j, new THREE.SphereGeometry(0.38, 16, 12), D.joystickBola, -0.35, 2.1, 0);
  [[0.4, -0.3], [0.9, 0.1], [0.4, 0.45]].forEach(([dx, dz], i) =>
    poner(j, new THREE.CylinderGeometry(0.25, 0.25, 0.12, 16), D.controlBotones[i], dx, 0.71, dz)
  );
}

// Cartuchos de juegos apoyados unos contra otros
function cartuchos(g, x, z, y) {
  [-1, 0, 1].forEach((i) => {
    const c = new THREE.Group();
    c.position.set(x + i * 0.6, y, z + (i === 0 ? 0.1 : 0));
    c.rotation.z = -i * 0.16;
    g.add(c);
    caja(c, 1.2, 1.7, 0.3, 0, 0.85, 0, D.cartucho[i + 1]);
    caja(c, 0.9, 0.65, 0.03, 0, 1.15, 0.16, D.leyenda);
    caja(c, 0.9, 0.18, 0.2, 0, 0.12, 0, D.joystickPalo);
    caja(c, 0.7, 0.05, 0.03, 0, 0.45, 0.16, D.joystickBase);
  });
}

// Auriculares gamer parados sobre una base
function auriculares(g, x, z, y) {
  caja(g, 1.4, 0.12, 1.0, x, y + 0.06, z, D.joystickBase);
  poner(g, new THREE.TorusGeometry(0.85, 0.1, 8, 24, Math.PI), D.auriculares, x, y + 0.3, z);
  [-1, 1].forEach((lado) => {
    poner(g, new THREE.CylinderGeometry(0.42, 0.42, 0.34, 18), D.auriculares, x + lado * 0.85, y + 0.45, z, { rot: [0, 0, Math.PI / 2] });
    poner(g, new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), D.joystickBola, x + lado * 0.64, y + 0.45, z, { rot: [0, 0, Math.PI / 2] });
  });
  poner(g, new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6), D.joystickPalo, x - 0.95, y + 0.1, z + 0.4, { rot: [Math.PI / 2.4, 0, 0] });
}

// Lata de energizante, dados, monedas, hongo y corazón de píxeles
function chiquitos(g, y) {
  // Lata
  poner(g, new THREE.CylinderGeometry(0.45, 0.45, 1.3, 20), '#d9a15b', -5.2, y + 0.65, -2.5);
  poner(g, new THREE.CylinderGeometry(0.47, 0.47, 0.06, 20), D.metal, -5.2, y + 1.32, -2.5);
  poner(g, new THREE.CylinderGeometry(0.46, 0.46, 0.35, 20), '#7a62b8', -5.2, y + 0.7, -2.5);
  // Dado de veinte caras
  const dado = poner(g, new THREE.IcosahedronGeometry(0.6), D.dado, 2.3, y + 0.55, -2.4);
  dado.rotation.set(0.5, 0.3, 0.1);
  // Monedas
  for (let i = 0; i < 5; i++) poner(g, new THREE.CylinderGeometry(0.42, 0.42, 0.09, 20), D.moneda, -1.9, y + 0.05 + i * 0.1, -2.7);
  poner(g, new THREE.CylinderGeometry(0.42, 0.42, 0.09, 20), D.moneda, -1.2, y + 0.42, -2.6, { rot: [1.2, 0, 0.6] });
  // Hongo de potenciador
  poner(g, new THREE.CylinderGeometry(0.3, 0.34, 0.55, 14), D.hongoPuntos, 5.0, y + 0.275, -2.6);
  poner(g, new THREE.SphereGeometry(0.85, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), D.hongo, 5.0, y + 0.5, -2.6);
  [[-0.35, 0.3, 0.45], [0.4, 0.45, 0.2], [0.0, 0.7, -0.3]].forEach(([dx, dy, dz]) =>
    poner(g, new THREE.SphereGeometry(0.17, 10, 8), D.hongoPuntos, 5.0 + dx, y + 0.5 + dy, -2.6 + dz + 0.15)
  );
  // Corazón de píxeles en el piso, justo en el camino al botón
  const molde = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
  const cubos = [];
  molde.forEach((fila, r) => {
    fila.split('').forEach((c, i) => {
      if (c === 'X') cubos.push({ x: (i - 3) * 0.34, y: y + 0.06, z: -3.7 + (r - 2.5) * 0.34, ancho: 0.32, alto: 0.1, profundidad: 0.32, color: D.hongo });
    });
  });
  instanciadas(g, cubos);
}

// Baranda baja a los costados del piso de arriba
function barandas(g, y, ancho, zFrente, zFondo) {
  const largo = zFrente - zFondo;
  [-1, 1].forEach((lado) => {
    const x = lado * (ancho / 2 - 0.05);
    caja(g, 0.08, 0.08, largo, x, y + 1.0, (zFrente + zFondo) / 2, D.metal);
    caja(g, 0.06, 0.06, largo, x, y + 0.5, (zFrente + zFondo) / 2, D.soporte);
    for (let z = zFondo + 0.2; z <= zFrente; z += 2) poner(g, new THREE.CylinderGeometry(0.05, 0.05, 1.0, 8), D.metal, x, y + 0.5, z);
  });
}

// Piso de arriba: la parte de rejilla que sale hacia el jugador, el piso macizo hasta el fondo de la sala,
// el panel de atrás con la consola del botón RESET, las barandas y los objetos de videojuegos
function pisoFinal(g, y) {
  const F = E.final;
  entrepano(g, y, F.bordeZ - ZF, F.ancho);

  // Piso macizo de baldosas, desde la pared hasta el fondo
  const profundidad = ZF - F.fondoZ;
  caja(g, F.ancho, 0.4, profundidad, 0, y - 0.2, (ZF + F.fondoZ) / 2, D.pisoFinal);
  const baldosas = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      baldosas.push({
        x: -F.ancho / 2 + 0.75 + i * 1.5,
        y: y + 0.012,
        z: ZF - 0.75 - j * 1.5,
        ancho: 1.46,
        alto: 0.02,
        profundidad: 1.46,
        color: (i + j) % 2 ? D.pisoFinalBaldosa : D.pisoFinal,
      });
    }
  }
  instanciadas(g, baldosas);
  barandas(g, y, F.ancho, ZF, F.fondoZ);

  // Panel del fondo y consola donde está el botón RESET grande
  caja(g, F.ancho, F.altoFondo, 0.4, 0, y + F.altoFondo / 2, F.fondoZ + 0.2, D.fondoFinal);
  caja(g, F.ancho - 0.6, 0.1, 0.1, 0, y + F.altoFondo - 0.4, F.fondoZ + 0.45, D.cables[0], { basico: true });
  caja(g, 5.2, 3.2, 1.0, 0, y + 1.6, F.fondoZ + 0.9, D.joystickBase); // consola
  caja(g, 5.4, 0.18, 1.1, 0, y + 3.3, F.fondoZ + 0.95, D.soporte);
  caja(g, 5.0, 0.12, 0.1, 0, y + 0.3, F.fondoZ + 1.45, D.cables[0], { basico: true }); // luz de la consola

  // Objetos de videojuegos
  control(g, -4.0, -4.0, y, 0.2);
  joystick(g, 4.0, -3.6, y);
  cartuchos(g, -3.4, -6.1, y);
  auriculares(g, 3.6, -6.2, y);
  chiquitos(g, y);
}

// Posición del botón RESET grande, al fondo del piso de arriba (para otros componentes)
export function posicionReset(alturaFinal) {
  const F = E.final;
  return { x: 0, y: alturaFinal + 1.7, z: F.fondoZ + 1.9, frenteConsola: F.fondoZ + 1.4 };
}

// ---------- Todo junto ----------

// Entrepaños de los tramos 1 y 2 (profundidad fija) y piso de arriba, fusionados en pocas mallas
export function crearPlataformas(datos) {
  const raiz = new THREE.Group();
  const { ancho, profundidad } = E.plataforma;
  datos.checkpoints.forEach((c, i) => {
    if (i < datos.checkpoints.length - 1) entrepano(raiz, c.y, profundidad, ancho);
  });
  pisoFinal(raiz, datos.alturaFinal);
  return fusionar(raiz);
}

