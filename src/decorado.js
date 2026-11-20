// Decorado de las tres paredes del setup gigante: teclado, torre de PC y monitor.
// Son solo adornos (no se agarran). Las teclas y los píxeles son muchas piezas iguales, así que
// se dibujan con una sola malla instanciada para que no pese en el casco. Todo con cajas.
import { COLORES, ESCENARIO } from './config.js';

// Azar determinista, para que el decorado sea siempre igual
function azarSimple(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Malla instanciada: `piezas` es una lista de { x, y, z, ancho, alto, profundidad, color }
function mallaInstanciada(piezas, material) {
  const malla = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material, piezas.length);
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
  if (malla.instanceColor) malla.instanceColor.needsUpdate = true;
  return malla;
}

const materialMate = () => new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 });

// Teclado: una grilla de teclas apagadas que sobresalen un poco de la base
export function crearTeclado(tramo) {
  const E = ESCENARIO;
  const azar = azarSimple(11);
  const paso = 0.5;
  const zFrente = E.z + E.profundidadPared / 2;
  const columnas = Math.floor(E.anchoPared / paso);
  const filas = Math.floor((tramo.y1 - tramo.y0) / paso);
  const piezas = [];
  for (let f = 0; f < filas; f++) {
    const desfase = (f % 2) * 0.12; // las filas del teclado no están alineadas
    for (let c = 0; c < columnas; c++) {
      piezas.push({
        x: -E.anchoPared / 2 + paso / 2 + c * paso + desfase - 0.06,
        y: tramo.y0 + paso / 2 + f * paso,
        z: zFrente + 0.03,
        ancho: 0.44,
        alto: 0.44,
        profundidad: 0.06,
        color: COLORES.teclas[Math.floor(azar() * COLORES.teclas.length)],
      });
    }
  }
  return mallaInstanciada(piezas, materialMate());
}

// Torre de PC: rejillas de ventilación, dos ventiladores y una tira de luz suave
export function crearTorre(tramo) {
  const E = ESCENARIO;
  const zFrente = E.z + E.profundidadPared / 2;
  const grupo = new THREE.Group();

  // Rejillas: ranuras horizontales a los costados
  const piezas = [];
  for (let y = tramo.y0 + 0.4; y < tramo.y1 - 0.2; y += 0.28) {
    [-2.75, 2.75].forEach((x) => {
      piezas.push({ x, y, z: zFrente + 0.01, ancho: 0.7, alto: 0.07, profundidad: 0.02, color: COLORES.rejilla });
    });
  }
  grupo.add(mallaInstanciada(piezas, materialMate()));

  // Ventiladores: un aro con aspas
  const materialVentilador = new THREE.MeshStandardMaterial({ color: COLORES.ventilador, roughness: 1, metalness: 0 });
  [
    { x: -1.1, y: tramo.y0 + (tramo.y1 - tramo.y0) * 0.35 },
    { x: 1.1, y: tramo.y0 + (tramo.y1 - tramo.y0) * 0.7 },
  ].forEach(({ x, y }) => {
    const ventilador = new THREE.Group();
    ventilador.add(new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.07, 8, 36), materialVentilador));
    for (let i = 0; i < 5; i++) {
      const aspa = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.78, 0.03), materialVentilador);
      aspa.position.set(0, 0.4, 0);
      const pivote = new THREE.Group();
      pivote.rotation.z = (i * Math.PI * 2) / 5;
      pivote.add(aspa);
      ventilador.add(pivote);
    }
    ventilador.position.set(x, y, zFrente + 0.03);
    grupo.add(ventilador);
  });

  // Tira de luz suave en el costado (sin brillo fuerte)
  const tira = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, tramo.y1 - tramo.y0 - 0.4, 0.03),
    new THREE.MeshBasicMaterial({ color: COLORES.led })
  );
  tira.position.set(-E.anchoPared / 2 + 0.2, (tramo.y0 + tramo.y1) / 2, zFrente + 0.02);
  grupo.add(tira);
  return grupo;
}

// Monitor: una pantalla azul oscura llena de píxeles apagados, rodeada por un marco ancho
export function crearMonitor(tramo, alturaTope) {
  const E = ESCENARIO;
  const azar = azarSimple(23);
  const zFrente = E.z + E.profundidadPared / 2;
  const alto = alturaTope - tramo.y0; // la pantalla sigue por encima de la plataforma de arriba
  const mitadMarco = 0.65; // ancho (m) del marco lateral
  const grupo = new THREE.Group();

  // Pantalla
  const anchoPantalla = E.anchoPared - mitadMarco * 2;
  const pantalla = new THREE.Mesh(
    new THREE.BoxGeometry(anchoPantalla, alto, 0.02),
    new THREE.MeshStandardMaterial({ color: COLORES.pantalla, roughness: 1, metalness: 0 })
  );
  pantalla.position.set(0, tramo.y0 + alto / 2, zFrente + 0.01);
  grupo.add(pantalla);

  // Marcos laterales
  const materialMarco = new THREE.MeshStandardMaterial({ color: COLORES.marcoMonitor, roughness: 1, metalness: 0 });
  [-1, 1].forEach((lado) => {
    const marco = new THREE.Mesh(new THREE.BoxGeometry(mitadMarco, alto, 0.08), materialMarco);
    marco.position.set(lado * (anchoPantalla / 2 + mitadMarco / 2), tramo.y0 + alto / 2, zFrente + 0.04);
    grupo.add(marco);
  });

  // Píxeles apagados (variaciones sutiles de azul)
  const piezas = [];
  const paso = 0.4;
  for (let y = tramo.y0 + 0.2; y < tramo.y0 + alto - 0.1; y += paso) {
    for (let x = -anchoPantalla / 2 + 0.2; x < anchoPantalla / 2 - 0.1; x += paso) {
      if (azar() < 0.35) continue; // no todos los píxeles, para que se vea una trama
      piezas.push({
        x,
        y,
        z: zFrente + 0.025,
        ancho: 0.3,
        alto: 0.3,
        profundidad: 0.01,
        color: COLORES.pixeles[Math.floor(azar() * COLORES.pixeles.length)],
      });
    }
  }
  grupo.add(mallaInstanciada(piezas, materialMate()));
  return grupo;
}

// Base lisa detrás de un tramo
export function crearBase(y0, y1, color) {
  const E = ESCENARIO;
  const alto = y1 - y0;
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(E.anchoPared, alto, E.profundidadPared),
    new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0 })
  );
  base.position.set(0, y0 + alto / 2, E.z);
  return base;
}
