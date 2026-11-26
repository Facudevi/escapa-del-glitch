// Palabra «RESET» sobre la cara del botón grande del piso de arriba.
//
// Usa exactamente la tipografía y los colores del título del final («SUBISTE DE NIVEL»): letras de bloque
// Lilita One, cara crema, volumen de lavanda a violeta y sombra suave (COLORES.tituloNivel). Así el botón y el
// título se leen como parte del mismo juego. Se dibuja en un canvas sobre un plano transparente, sin panel de fondo.
// La tipografía viene instalada con npm (@fontsource) y va dentro del build.
import '@fontsource/lilita-one/latin-400.css';
import { COLORES } from '../config.js';

const FUENTE = '"Lilita One", system-ui, sans-serif';
const PIXELES_POR_METRO = 600;

AFRAME.registerComponent('etiqueta-reset', {
  schema: {
    texto: { type: 'string', default: 'RESET' },
    ancho: { type: 'number', default: 1.6 }, // m
    alto: { type: 'number', default: 0.6 }, // m
  },

  init() {
    this.canvas = document.createElement('canvas');
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;
    this.textura.anisotropy = 4;
    this.material = new THREE.MeshBasicMaterial({ map: this.textura, transparent: true, depthWrite: false });
    this.malla = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material);
    this.el.setObject3D('mesh', this.malla);

    // Se dibuja ya con la letra del sistema y se redibuja cuando termina de cargar la tipografía
    if (document.fonts && document.fonts.load) {
      document.fonts.load(`80px ${FUENTE}`).then(() => this.update()).catch(() => {});
    }
  },

  update() {
    const { ancho, alto } = this.data;
    this.malla.scale.set(ancho, alto, 1);
    this.dibujar(Math.round(ancho * PIXELES_POR_METRO), Math.round(alto * PIXELES_POR_METRO));
  },

  dibujar(w, h) {
    const C = COLORES.tituloNivel; // los mismos colores que el título del final
    this.canvas.width = w;
    this.canvas.height = h;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // La letra se achica hasta que entre en el ancho
    const texto = this.data.texto.toUpperCase();
    let tamano = h * 0.72;
    do {
      ctx.font = `${tamano}px ${FUENTE}`;
      tamano -= 2;
    } while (ctx.measureText(texto).width > w * 0.9 && tamano > 10);
    tamano += 2;
    ctx.letterSpacing = `${Math.round(tamano * 0.03)}px`;

    const centro = h * 0.46;
    const paso = tamano * 0.035; // grosor de cada capa de volumen (igual que el título del final)
    const capas = C.volumen.length;

    // Sombra suave debajo de todo
    ctx.save();
    ctx.shadowColor = C.sombra;
    ctx.shadowBlur = tamano * 0.12;
    ctx.shadowOffsetY = tamano * 0.06;
    ctx.fillStyle = C.volumen[capas - 1];
    ctx.fillText(texto, w / 2, centro + paso * (capas + 1));
    ctx.restore();

    // Volumen: capas apiladas de la más oscura (abajo) a la más clara (pegada a la cara)
    for (let i = capas; i >= 1; i--) {
      ctx.fillStyle = C.volumen[i - 1];
      ctx.fillText(texto, w / 2, centro + paso * i);
    }
    // Cara, con un contorno fino del color del volumen
    ctx.lineJoin = 'round';
    ctx.lineWidth = tamano * 0.025;
    ctx.strokeStyle = C.volumen[0];
    ctx.strokeText(texto, w / 2, centro);
    ctx.fillStyle = C.cara;
    ctx.fillText(texto, w / 2, centro);

    this.textura.needsUpdate = true;
  },

  remove() {
    this.el.removeObject3D('mesh');
    this.textura.dispose();
    this.material.dispose();
    this.malla.geometry.dispose();
  },
});
