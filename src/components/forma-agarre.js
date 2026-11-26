// Identidad gráfica de cada tipo de agarre. Va en la entidad del agarre, junto al componente agarre.
//
// En vez de un bloque liso de color, cada tipo lleva un dibujo propio (una textura hecha en un canvas) y algún
// detalle en relieve, para que se reconozca de un vistazo qué es y cómo se comporta:
//   - firme: una tecla lavanda con una flecha hacia arriba (“por acá se sube”) y un tornillo que la sujeta;
//   - hunde: una tecla violeta oscura con una flecha grande hacia abajo (se hunde al agarrarla);
//   - lata: una lata de gaseosa con su etiqueta, rayitas de que se va a romper y la tapa con anillo;
//   - intermitente: un bloque de píxeles celestes (aparece y desaparece como un píxel que falla);
//   - borde: la barra verde de arriba de la pared, con flechas hacia arriba;
//   - tirolesa: el enchufe USB, con el símbolo grabado.
import { COLORES } from '../config.js';

const texturas = new Map();

function lienzo(ancho, alto, dibujar) {
  const canvas = document.createElement('canvas');
  canvas.width = ancho;
  canvas.height = alto;
  dibujar(canvas.getContext('2d'), ancho, alto);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 4;
  return textura;
}

function redondeado(ctx, x, y, w, h, r, relleno, borde, grosor = 0) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (relleno) {
    ctx.fillStyle = relleno;
    ctx.fill();
  }
  if (borde) {
    ctx.lineWidth = grosor;
    ctx.strokeStyle = borde;
    ctx.stroke();
  }
}

function flecha(ctx, cx, cy, tam, haciaArriba, color) {
  const s = haciaArriba ? -1 : 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * tam);
  ctx.lineTo(cx + tam * 0.9, cy - s * tam * 0.1);
  ctx.lineTo(cx + tam * 0.35, cy - s * tam * 0.1);
  ctx.lineTo(cx + tam * 0.35, cy - s * tam * 0.9);
  ctx.lineTo(cx - tam * 0.35, cy - s * tam * 0.9);
  ctx.lineTo(cx - tam * 0.35, cy - s * tam * 0.1);
  ctx.lineTo(cx - tam * 0.9, cy - s * tam * 0.1);
  ctx.closePath();
  ctx.fill();
}

const DIBUJOS = {
  // Tecla firme: tecla con un borde más oscuro, una cara más clara y una flecha corta hacia arriba
  firme: () =>
    lienzo(256, 256, (ctx, w, h) => {
      redondeado(ctx, 0, 0, w, h, 40, '#7d68b0');
      redondeado(ctx, 18, 14, w - 36, h - 40, 34, COLORES.lavanda);
      const brillo = ctx.createLinearGradient(0, 14, 0, h - 26);
      brillo.addColorStop(0, 'rgba(255,255,255,0.35)');
      brillo.addColorStop(1, 'rgba(255,255,255,0)');
      redondeado(ctx, 18, 14, w - 36, h - 40, 34, brillo);
      flecha(ctx, w / 2, h / 2 - 6, 52, true, '#3f3260');
    }),
  // Tecla que se hunde: más oscura, con una flecha grande hacia abajo y rayas de “presionar”
  hunde: () =>
    lienzo(256, 256, (ctx, w, h) => {
      redondeado(ctx, 0, 0, w, h, 40, '#4f3f80');
      redondeado(ctx, 18, 26, w - 36, h - 40, 34, COLORES.lavandaHunde);
      flecha(ctx, w / 2, h / 2 + 8, 64, false, '#f0e9fb');
      ctx.fillStyle = 'rgba(240,233,251,0.5)';
      [0, 1, 2].forEach((i) => ctx.fillRect(w / 2 - 50 + i * 40, 36, 20, 10));
    }),
  // Lata: tapa y fondo plateados, etiqueta ámbar con una onda y una grieta (se rompe)
  lata: () =>
    lienzo(512, 256, (ctx, w, h) => {
      ctx.fillStyle = '#c9cdd8';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = COLORES.ambar;
      ctx.fillRect(0, h * 0.12, w, h * 0.76);
      ctx.fillStyle = '#c4665b';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.62);
      for (let x = 0; x <= w; x += 16) ctx.lineTo(x, h * 0.62 + Math.sin(x / 40) * 16);
      ctx.lineTo(w, h * 0.88);
      ctx.lineTo(0, h * 0.88);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff6e6';
      ctx.font = 'bold 64px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('COLA', w * 0.25, h * 0.4);
      ctx.fillText('COLA', w * 0.75, h * 0.4);
      // Grieta: avisa que no aguanta mucho
      ctx.strokeStyle = '#3f2a1a';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.14);
      ctx.lineTo(w * 0.53, h * 0.3);
      ctx.lineTo(w * 0.49, h * 0.42);
      ctx.lineTo(w * 0.54, h * 0.58);
      ctx.stroke();
    }),
  // Bloque intermitente: mosaico de píxeles celestes con un borde
  intermitente: () =>
    lienzo(256, 256, (ctx, w, h) => {
      ctx.fillStyle = '#4f86a8';
      ctx.fillRect(0, 0, w, h);
      const tonos = ['#8fc3e6', '#b5dcf2', '#6fa8cc', '#d6eefa'];
      const n = 6;
      const lado = (w - 24) / n;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          ctx.fillStyle = tonos[(i * 7 + j * 3 + ((i + j) % 2)) % tonos.length];
          ctx.fillRect(12 + i * lado + 2, 12 + j * lado + 2, lado - 4, lado - 4);
        }
      }
    }),
  // Reborde: verde con flechas claras hacia arriba
  borde: () =>
    lienzo(512, 64, (ctx, w, h) => {
      ctx.fillStyle = COLORES.verde;
      ctx.fillRect(0, 0, w, h);
      for (let x = 40; x < w; x += 96) flecha(ctx, x, h / 2, 22, true, '#e4f3ea');
    }),
  // Enchufe USB: metal oscuro con el símbolo grabado, apenas visible
  tirolesa: () =>
    lienzo(128, 128, (ctx, w, h) => {
      ctx.fillStyle = '#4a4666';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#6a6590';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w / 2, h * 0.85);
      ctx.lineTo(w / 2, h * 0.2);
      ctx.moveTo(w / 2, h * 0.6);
      ctx.lineTo(w * 0.3, h * 0.45);
      ctx.moveTo(w / 2, h * 0.5);
      ctx.lineTo(w * 0.7, h * 0.35);
      ctx.stroke();
    }),
};

export function texturaDeAgarre(tipo) {
  if (!DIBUJOS[tipo]) return null;
  if (!texturas.has(tipo)) texturas.set(tipo, DIBUJOS[tipo]());
  return texturas.get(tipo);
}

AFRAME.registerComponent('forma-agarre', {
  schema: { tipo: { type: 'string', default: 'firme' } },

  init() {
    this.aplicar = () => {
      const malla = this.el.getObject3D('mesh');
      const textura = texturaDeAgarre(this.data.tipo);
      if (!malla || !textura || malla.material.map === textura) return;
      malla.material.map = textura;
      malla.material.color.set('#ffffff');
      malla.material.needsUpdate = true;
    };
    this.el.addEventListener('object3dset', this.aplicar);
    this.aplicar();
    this.agregarRelieve();
  },

  // Detalles en relieve según el tipo
  agregarRelieve() {
    const tipo = this.data.tipo;
    const grupo = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: '#c9cdd8', roughness: 0.4, metalness: 0.5 });
    if (tipo === 'firme') {
      // Tornillo hexagonal en el centro de la cara de adelante
      const tornillo = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 6), metal);
      tornillo.rotation.x = Math.PI / 2;
      tornillo.position.set(0, -0.09, 0.33);
      grupo.add(tornillo);
    } else if (tipo === 'lata') {
      // Borde de la tapa y anillo para abrirla
      const geometria = this.el.getAttribute('geometry') || {};
      const radio = geometria.radius || 0.2;
      const alto = geometria.height || 0.4;
      const borde = new THREE.Mesh(new THREE.TorusGeometry(radio * 0.95, 0.015, 6, 24), metal);
      borde.rotation.x = Math.PI / 2;
      borde.position.y = alto / 2;
      const anillo = new THREE.Mesh(new THREE.TorusGeometry(radio * 0.28, 0.012, 6, 16), metal);
      anillo.rotation.x = Math.PI / 2;
      anillo.position.set(radio * 0.25, alto / 2 + 0.01, 0);
      grupo.add(borde, anillo);
    }
    if (grupo.children.length) this.el.setObject3D('relieve', grupo);
  },

  remove() {
    this.el.removeEventListener('object3dset', this.aplicar);
    this.el.removeObject3D('relieve');
  },
});
