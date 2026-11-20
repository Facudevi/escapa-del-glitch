// Cartel flotante con un texto corto (tutoriales, frases del Glitch). Un panel oscuro con letras claras.
// El texto se dibuja en un canvas con la tipografía del sistema: así soporta tildes y ñ y no depende
// de fuentes externas (las fuentes de a-text no traen los caracteres del español).
// Si cambia el atributo `texto`, el cartel se redibuja.
import { COLORES } from '../config.js';

const PIXELES_POR_METRO = 700;
const FUENTE = 'system-ui, "Segoe UI", Roboto, Arial, sans-serif';

AFRAME.registerComponent('cartel', {
  schema: {
    texto: { type: 'string', default: '' },
    ancho: { type: 'number', default: 1 },
    alto: { type: 'number', default: 0.35 },
  },

  init() {
    this.canvas = document.createElement('canvas');
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;
    this.material = new THREE.MeshBasicMaterial({ map: this.textura, transparent: true });
    this.malla = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material);
    this.el.setObject3D('mesh', this.malla);
  },

  update() {
    const { texto, ancho, alto } = this.data;
    this.malla.scale.set(ancho, alto, 1);
    this.dibujar(texto, ancho * PIXELES_POR_METRO, alto * PIXELES_POR_METRO);
  },

  dibujar(texto, w, h) {
    const lienzo = this.canvas;
    lienzo.width = Math.round(w);
    lienzo.height = Math.round(h);
    const ctx = lienzo.getContext('2d');

    // Fondo con esquinas redondeadas
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = COLORES.cartelFondo;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, h * 0.18);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Texto: se achica la letra hasta que entre en el panel
    ctx.fillStyle = COLORES.cartelTexto;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let tamano = h * 0.34;
    let lineas;
    do {
      ctx.font = `${tamano}px ${FUENTE}`;
      lineas = this.partirEnLineas(ctx, texto, w * 0.88);
      tamano -= 2;
    } while (lineas.length * tamano * 1.2 > h * 0.8 && tamano > 10);

    const alturaLinea = tamano * 1.2;
    const inicio = h / 2 - ((lineas.length - 1) * alturaLinea) / 2;
    lineas.forEach((linea, i) => ctx.fillText(linea, w / 2, inicio + i * alturaLinea));

    this.textura.needsUpdate = true;
  },

  // Corta el texto en líneas que entren en el ancho máximo
  partirEnLineas(ctx, texto, anchoMaximo) {
    const palabras = texto.split(' ');
    const lineas = [];
    let actual = '';
    palabras.forEach((palabra) => {
      const prueba = actual ? `${actual} ${palabra}` : palabra;
      if (actual && ctx.measureText(prueba).width > anchoMaximo) {
        lineas.push(actual);
        actual = palabra;
      } else {
        actual = prueba;
      }
    });
    if (actual) lineas.push(actual);
    return lineas;
  },

  remove() {
    this.el.removeObject3D('mesh');
    this.textura.dispose();
    this.material.dispose();
    this.malla.geometry.dispose();
  },
});
