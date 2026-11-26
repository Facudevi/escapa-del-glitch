// Título del final, en el cielo, estilo cartel de «nivel superado» de videojuego.
//
// Arriba va el título en letras de bloque grandes (tipografía Lilita One), color crema y con volumen: debajo de
// cada letra se apilan capas lavanda y violeta, como un título en relieve. Abajo va la bajada, más chica
// (tipografía Fredoka), sobre una cinta clara. Todo se dibuja en un canvas sobre un plano, sin panel de fondo.
//
// Al aparecer el exterior, el título entra con un pequeño rebote y después flota despacio, sin parpadeos.
// Las tipografías vienen instaladas con npm (@fontsource) y van dentro del build: no hace falta internet.
import '@fontsource/lilita-one/latin-400.css';
import '@fontsource/fredoka/latin-500.css';
import { COLORES, FINAL } from '../config.js';

const FUENTE_TITULO = '"Lilita One", system-ui, sans-serif';
const FUENTE_BAJADA = '"Fredoka", system-ui, sans-serif';

AFRAME.registerComponent('titulo-nivel', {
  schema: {
    titulo: { type: 'string', default: '' },
    bajada: { type: 'string', default: '' },
    ancho: { type: 'number', default: 30 },
    alto: { type: 'number', default: 8 },
  },

  init() {
    this.canvas = document.createElement('canvas');
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;
    this.textura.anisotropy = 4;
    this.material = new THREE.MeshBasicMaterial({ map: this.textura, transparent: true, fog: false, depthWrite: false });
    this.malla = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material);
    this.el.setObject3D('mesh', this.malla);
    this.visibleAntes = false;
    this.entradaDesde = 0;
    this.yBase = null;

    // Se dibuja ya con la letra del sistema y se redibuja cuando terminan de cargar las tipografías
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load(`80px ${FUENTE_TITULO}`), document.fonts.load(`500 40px ${FUENTE_BAJADA}`)])
        .then(() => this.update())
        .catch(() => {});
    }
  },

  update() {
    const { ancho, alto } = this.data;
    this.malla.scale.set(ancho, alto, 1);
    const ppm = FINAL.cielo.pixelesPorMetro;
    this.dibujar(Math.round(ancho * ppm), Math.round(alto * ppm));
  },

  dibujar(w, h) {
    const C = COLORES.tituloNivel;
    this.canvas.width = w;
    this.canvas.height = h;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // ---------- Título: se achica hasta que entre en el ancho ----------
    const titulo = this.data.titulo.toUpperCase();
    let tamano = h * 0.46;
    do {
      ctx.font = `${tamano}px ${FUENTE_TITULO}`;
      tamano -= 2;
    } while (ctx.measureText(titulo).width > w * 0.94 && tamano > 10);
    tamano += 2;
    ctx.letterSpacing = `${Math.round(tamano * 0.03)}px`;
    const baseTitulo = h * 0.56;
    const paso = tamano * 0.035; // grosor de cada capa de volumen
    const capas = C.volumen.length;

    // Sombra suave debajo de todo
    ctx.save();
    ctx.shadowColor = C.sombra;
    ctx.shadowBlur = tamano * 0.12;
    ctx.shadowOffsetY = tamano * 0.06;
    ctx.fillStyle = C.volumen[capas - 1];
    ctx.fillText(titulo, w / 2, baseTitulo + paso * (capas + 1));
    ctx.restore();

    // Volumen: capas apiladas de la más oscura (abajo) a la más clara (pegada a la cara)
    for (let i = capas; i >= 1; i--) {
      ctx.fillStyle = C.volumen[i - 1];
      ctx.fillText(titulo, w / 2, baseTitulo + paso * i);
    }
    // Cara del título, con un contorno fino del color del volumen
    ctx.lineJoin = 'round';
    ctx.lineWidth = tamano * 0.025;
    ctx.strokeStyle = C.volumen[0];
    ctx.strokeText(titulo, w / 2, baseTitulo);
    ctx.fillStyle = C.cara;
    ctx.fillText(titulo, w / 2, baseTitulo);

    // ---------- Bajada sobre una cinta clara ----------
    const bajada = this.data.bajada;
    if (bajada) {
      ctx.letterSpacing = '0px';
      const tamanoBajada = tamano * 0.36;
      ctx.font = `500 ${tamanoBajada}px ${FUENTE_BAJADA}`;
      const anchoTexto = ctx.measureText(bajada).width;
      const altoCinta = tamanoBajada * 1.6;
      const anchoCinta = anchoTexto + tamanoBajada * 1.6;
      const yCinta = baseTitulo + paso * (capas + 1) + tamano * 0.22;
      ctx.save();
      ctx.shadowColor = C.sombra;
      ctx.shadowBlur = tamanoBajada * 0.3;
      ctx.shadowOffsetY = tamanoBajada * 0.08;
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = C.cinta;
      ctx.beginPath();
      ctx.roundRect(w / 2 - anchoCinta / 2, yCinta, anchoCinta, altoCinta, altoCinta / 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = C.cintaTexto;
      ctx.textBaseline = 'middle';
      ctx.fillText(bajada, w / 2, yCinta + altoCinta / 2 + tamanoBajada * 0.04);
    }

    this.textura.needsUpdate = true;
  },

  // Rebote de entrada cuando aparece el exterior, y después flota despacio
  tick(tiempo) {
    const objeto = this.el.object3D;
    if (this.yBase === null) this.yBase = objeto.position.y;
    const visible = !!(objeto.parent && objeto.parent.visible);
    if (visible && !this.visibleAntes) this.entradaDesde = tiempo;
    this.visibleAntes = visible;
    if (!visible) return;

    const { entrada, flotar } = FINAL.cielo;
    const t = Math.min((tiempo - this.entradaDesde) / 1000 / entrada.duracion, 1);
    // Curva con un rebote chico al final (sube un poco de más y vuelve)
    const c = entrada.rebote;
    const rebote = 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
    const escala = entrada.escalaInicial + (1 - entrada.escalaInicial) * rebote;
    this.malla.scale.set(this.data.ancho * escala, this.data.alto * escala, 1);
    objeto.position.y = this.yBase + Math.sin(((tiempo / 1000) * Math.PI * 2) / flotar.periodo) * flotar.amplitud;
  },

  remove() {
    this.el.removeObject3D('mesh');
    this.textura.dispose();
    this.material.dispose();
    this.malla.geometry.dispose();
  },
});
