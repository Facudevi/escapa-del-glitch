// Habitación del jugador para la introducción: un cuarto a oscuras, de madrugada, con su setup gamer de
// tamaño real (escritorio, monitor en un brazo, teclado, mouse, gabinete con ventilador, latas de energizante),
// la cama sin hacer, una ventana con la luna, un póster de RESET y un reloj que marca las 3:47.
// Todo con formas básicas. La única luz fuerte es la de la pantalla.
//
// construirHabitacion(escena) arma todo lejos del resto de la escena (INTRO.habitacion.x) y devuelve lo que la
// intro anima: la pantalla (con su canvas), la luz de la pantalla y el ventilador.
import '@fontsource/lilita-one/latin-400.css';
import { COLORES, INTRO } from './config.js';

const H = COLORES.habitacion;

const material = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, ...extra });

function caja(grupo, ancho, alto, fondo, x, y, z, color, extra) {
  const malla = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), material(color, extra));
  malla.position.set(x, y, z);
  grupo.add(malla);
  return malla;
}

function cilindro(grupo, radio, alto, x, y, z, color, extra) {
  const malla = new THREE.Mesh(new THREE.CylinderGeometry(radio, radio, alto, 16), material(color, extra));
  malla.position.set(x, y, z);
  grupo.add(malla);
  return malla;
}

// Plano con un dibujo en canvas (póster, reloj)
function cartelCanvas(grupo, ancho, alto, x, y, z, dibujar, rotY = 0, ppm = 400) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(ancho * ppm);
  canvas.height = Math.round(alto * ppm);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const malla = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), new THREE.MeshBasicMaterial({ map: textura }));
  malla.position.set(x, y, z);
  malla.rotation.y = rotY;
  grupo.add(malla);
  const redibujar = () => {
    dibujar(canvas.getContext('2d'), canvas.width, canvas.height);
    textura.needsUpdate = true;
  };
  redibujar();
  if (document.fonts && document.fonts.load) document.fonts.load('40px "Lilita One"').then(redibujar).catch(() => {});
  return malla;
}

export function construirHabitacion(escena) {
  const { x, ancho, fondo, alto } = INTRO.habitacion;
  const grupo = new THREE.Group();
  grupo.position.set(x, 0, 0);
  escena.object3D.add(grupo);

  // ---------- Cuarto ----------
  // El jugador está en (0, 0, 0) mirando hacia -z; el escritorio queda contra la pared de adelante
  const z0 = -1.15; // pared de adelante
  const zFondo = z0 + fondo;
  const zCentro = (z0 + zFondo) / 2;
  caja(grupo, ancho, 0.02, fondo, 0, -0.01, zCentro, H.piso);
  caja(grupo, ancho, 0.02, fondo, 0, alto, zCentro, H.techo);
  caja(grupo, ancho, alto, 0.02, 0, alto / 2, z0, H.paredes);
  caja(grupo, ancho, alto, 0.02, 0, alto / 2, zFondo, H.paredes);
  caja(grupo, 0.02, alto, fondo, -ancho / 2, alto / 2, zCentro, H.paredes);
  caja(grupo, 0.02, alto, fondo, ancho / 2, alto / 2, zCentro, H.paredes);

  // ---------- Escritorio ----------
  const yMesa = 0.74;
  const zMesa = z0 + 0.38;
  caja(grupo, 1.7, 0.035, 0.7, 0, yMesa, zMesa, H.escritorio);
  [-0.8, 0.8].forEach((lx) => caja(grupo, 0.04, yMesa, 0.62, lx, yMesa / 2, zMesa, H.metal));

  // Monitor en un brazo, a la altura de los ojos de alguien parado
  const P = INTRO.pantalla;
  caja(grupo, 0.05, 0.02, 0.18, 0, yMesa + 0.01, z0 + 0.12, H.metal); // base del brazo
  caja(grupo, 0.03, P.y - yMesa, 0.03, 0, (P.y + yMesa) / 2, z0 + 0.12, H.metal);
  caja(grupo, 0.03, 0.03, P.z - z0 - 0.12, 0, P.y, (P.z + z0 + 0.12) / 2, H.metal);
  caja(grupo, P.ancho + 0.04, P.alto + 0.04, 0.03, 0, P.y, P.z - 0.017, H.marco); // marco
  const canvasPantalla = document.createElement('canvas');
  canvasPantalla.width = P.resolucion;
  canvasPantalla.height = Math.round((P.resolucion * P.alto) / P.ancho);
  const texturaPantalla = new THREE.CanvasTexture(canvasPantalla);
  texturaPantalla.colorSpace = THREE.SRGBColorSpace;
  const pantalla = new THREE.Mesh(
    new THREE.PlaneGeometry(P.ancho, P.alto),
    new THREE.MeshBasicMaterial({ map: texturaPantalla, fog: false, toneMapped: false })
  );
  pantalla.position.set(0, P.y, P.z);
  grupo.add(pantalla);

  // Teclado con una tira de luz suave, y mouse
  caja(grupo, 0.46, 0.025, 0.15, -0.02, yMesa + 0.03, zMesa + 0.14, H.teclado);
  for (let fila = 0; fila < 4; fila++) {
    caja(grupo, 0.42, 0.006, 0.022, -0.02, yMesa + 0.045, zMesa + 0.09 + fila * 0.032, H.metal);
  }
  caja(grupo, 0.46, 0.004, 0.006, -0.02, yMesa + 0.019, zMesa + 0.218, H.tecladoLuz, {
    emissive: H.tecladoLuz,
    emissiveIntensity: 0.8,
  });
  caja(grupo, 0.06, 0.03, 0.1, 0.32, yMesa + 0.03, zMesa + 0.15, H.teclado);

  // Gabinete con vidrio y ventilador que gira
  const xGab = 0.62;
  const zGab = z0 + 0.32;
  caja(grupo, 0.22, 0.46, 0.44, xGab, yMesa + 0.25, zGab, H.marco);
  caja(grupo, 0.005, 0.38, 0.36, xGab - 0.113, yMesa + 0.25, zGab, H.gabineteLuz, {
    emissive: H.gabineteLuz,
    emissiveIntensity: 0.5,
  });
  const ventilador = new THREE.Mesh(
    new THREE.TorusGeometry(0.07, 0.008, 8, 24),
    material(H.ventilador, { emissive: H.ventilador, emissiveIntensity: 0.6 })
  );
  ventilador.position.set(xGab - 0.118, yMesa + 0.3, zGab + 0.05);
  ventilador.rotation.y = Math.PI / 2;
  grupo.add(ventilador);
  const aspas = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.012, 0.11), material(H.metal));
  aspas.position.copy(ventilador.position);
  grupo.add(aspas);

  // Latas de energizante (una tirada) y un parlante
  cilindro(grupo, 0.033, 0.12, -0.5, yMesa + 0.08, zMesa + 0.05, H.lata);
  cilindro(grupo, 0.033, 0.12, -0.42, yMesa + 0.08, zMesa - 0.08, H.lata);
  const tirada = cilindro(grupo, 0.033, 0.12, -0.6, yMesa + 0.05, zMesa + 0.18, H.lata);
  tirada.rotation.z = Math.PI / 2;
  tirada.rotation.y = 0.5;
  caja(grupo, 0.1, 0.18, 0.1, -0.7, yMesa + 0.11, zMesa - 0.12, H.marco);

  // Reloj despertador en el escritorio: 3:47
  caja(grupo, 0.14, 0.07, 0.05, 0.3, yMesa + 0.05, zMesa - 0.12, H.marco);
  cartelCanvas(grupo, 0.12, 0.05, 0.3, yMesa + 0.05, zMesa - 0.094, (ctx, w, h) => {
    ctx.fillStyle = '#0d0a12';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = H.reloj;
    ctx.font = `${h * 0.8}px "Lilita One", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3:47', w / 2, h * 0.55);
  }, 0, 1200);

  // ---------- Resto del cuarto ----------
  // Cama sin hacer a la derecha, detrás del jugador
  caja(grupo, 1.0, 0.4, 1.9, 1.5, 0.2, 1.4, H.cama);
  caja(grupo, 0.98, 0.08, 1.4, 1.5, 0.44, 1.6, H.frazada).rotation.z = 0.04;
  caja(grupo, 0.6, 0.1, 0.35, 1.5, 0.46, 0.65, H.almohada);

  // Ventana con la luna a la izquierda, con la cortina casi cerrada
  const xVentana = -ancho / 2 + 0.015;
  caja(grupo, 0.01, 0.8, 0.9, xVentana, 1.55, -0.1, H.ventana, { emissive: H.ventana, emissiveIntensity: 0.6 });
  const luna = new THREE.Mesh(new THREE.CircleGeometry(0.07, 20), new THREE.MeshBasicMaterial({ color: H.luna }));
  luna.position.set(xVentana + 0.01, 1.75, 0.12);
  luna.rotation.y = Math.PI / 2;
  grupo.add(luna);
  caja(grupo, 0.04, 1.0, 0.55, xVentana + 0.04, 1.5, -0.33, H.cortina);
  caja(grupo, 0.04, 1.0, 0.2, xVentana + 0.04, 1.5, 0.3, H.cortina);

  // Póster de RESET en la pared de la izquierda, al lado del escritorio
  cartelCanvas(grupo, 0.42, 0.6, -ancho / 2 + 0.02, 1.55, -0.85, (ctx, w, h) => {
    const degrade = ctx.createLinearGradient(0, 0, 0, h);
    degrade.addColorStop(0, '#3c3489');
    degrade.addColorStop(1, '#7b5cc4');
    ctx.fillStyle = degrade;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#fffaf0';
    ctx.textAlign = 'center';
    ctx.font = `${h * 0.17}px "Lilita One", system-ui, sans-serif`;
    ctx.fillText('RESET', w / 2, h * 0.42);
    ctx.font = `${h * 0.05}px system-ui, sans-serif`;
    ctx.fillText('festival de bienestar gamer', w / 2, h * 0.55);
    ctx.fillStyle = '#d9a15b';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.75, h * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }, Math.PI / 2);

  // ---------- Luces ----------
  // La pantalla es la que ilumina el cuarto; una lucecita cálida del reloj
  const luzPantalla = new THREE.PointLight(H.luzPantalla, INTRO.luzPantalla.intensidad, INTRO.luzPantalla.distancia, 2);
  luzPantalla.position.set(0, P.y, P.z + 0.35);
  grupo.add(luzPantalla);
  const luzReloj = new THREE.PointLight(H.luzLampara, 0.25, 1.2, 2);
  luzReloj.position.set(0.3, yMesa + 0.15, zMesa - 0.05);
  grupo.add(luzReloj);

  return { grupo, pantalla, canvasPantalla, texturaPantalla, luzPantalla, aspas };
}
