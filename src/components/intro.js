// Introducción antes de escalar (menos de 25 s). Va en la <a-scene>.
//
// Cuando se cierra la pantalla de inicio (o se entra en VR), el jugador aparece parado lejos de la pared, de
// frente al setup gigante, y delante de él se suceden cinco tarjetas que cuentan la situación: el Glitch lo
// metió adentro de su setup, todo es gigante, la salida es el botón RESET de arriba, el RESET está apagado y
// hay que juntar 3 fragmentos, y cómo se escala. Al terminar (o al saltearla) la vista se funde a negro y el
// jugador aparece al pie del teclado, listo para escalar.
//
// - Cada tarjeta tiene un dibujo simple, un título y una línea de texto, y abajo los puntos de los pasos y una
//   barra con el tiempo que le queda. La tarjeta sigue la cabeza con retraso, como las frases del Glitch.
// - Se saltea con A, X, el gatillo o agarrando algo; en la compu, con Enter, espacio, Escape o un clic.
// - Mientras dura, no se camina, no se viaja con clic y no se escanea (escena.introActiva).
// - Se ve una sola vez: al volver a jugar no se repite (INTRO.soloLaPrimeraVez).
// Todos los tiempos, medidas, textos y colores están en INTRO y COLORES.intro (src/config.js).
import '@fontsource/lilita-one/latin-400.css';
import '@fontsource/fredoka/latin-500.css';
import { COLORES, INTRO } from '../config.js';
import { lugarFrenteAlTramo } from '../utilidades.js';
import { blipGlitch } from '../sonidos.js';

const FUENTE_TITULO = '"Lilita One", system-ui, sans-serif';
const FUENTE_TEXTO = '"Fredoka", system-ui, sans-serif';

AFRAME.registerComponent('intro', {
  init() {
    this.escena = this.el;
    this.escena.introActiva = false;
    this.vista = false; // ya se mostró una vez
    this.paso = -1;
    this.enPaso = 0; // s que lleva la tarjeta actual
    this.transcurrido = 0; // s desde que empezó la intro
    this.terminando = false;
    this.camara = null;
    this.posCamara = new THREE.Vector3();
    this.direccion = new THREE.Vector3();
    this.objetivo = new THREE.Vector3();

    this.crearTarjeta();

    this.escena.addEventListener('inicio-cerrado', () => this.empezar());

    // Saltear: botones de los controles, agarrar algo, teclas o clic
    this.alSaltear = () => this.saltear();
    ['abuttondown', 'xbuttondown', 'triggerdown', 'mano-agarra'].forEach((n) => this.escena.addEventListener(n, this.alSaltear));
    this.alTeclear = (e) => {
      if (INTRO.teclasSaltear.includes(e.code)) this.saltear();
    };
    window.addEventListener('keydown', this.alTeclear);
    this.alClickear = () => this.saltear();
    if (this.escena.canvas) this.escena.canvas.addEventListener('mousedown', this.alClickear);
    else this.escena.addEventListener('render-target-loaded', () => this.escena.canvas.addEventListener('mousedown', this.alClickear));

    // Las tipografías cargan después: se redibuja la tarjeta cuando están
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load(`80px ${FUENTE_TITULO}`), document.fonts.load(`500 40px ${FUENTE_TEXTO}`)])
        .then(() => this.paso >= 0 && this.dibujar(this.paso))
        .catch(() => {});
    }
  },

  // ---------- Armado de la tarjeta ----------

  crearTarjeta() {
    const { ancho, alto, pixelesPorMetro } = INTRO;
    this.canvas = document.createElement('canvas');
    this.canvas.width = Math.round(ancho * pixelesPorMetro);
    this.canvas.height = Math.round(alto * pixelesPorMetro);
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;
    this.textura.anisotropy = 4;
    // Opaca (las esquinas redondeadas se recortan con alphaTest): A-Frame no ordena los objetos transparentes,
    // así que una tarjeta transparente podía quedar tapada por otros carteles de la escena
    const material = (opciones) => new THREE.MeshBasicMaterial({ fog: false, ...opciones });

    this.grupo = new THREE.Group();
    this.contenido = new THREE.Group(); // lo que crece al aparecer cada tarjeta
    this.grupo.add(this.contenido);
    this.materialTarjeta = material({ map: this.textura, alphaTest: 0.5 });
    const tarjeta = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), this.materialTarjeta);
    this.contenido.add(tarjeta);

    // Barra del tiempo de la tarjeta: un plano aparte que se achica (no hace falta redibujar el canvas)
    this.anchoBarra = ancho * 0.84;
    this.materialBarra = material({ color: COLORES.intro.barra });
    this.barra = new THREE.Mesh(new THREE.PlaneGeometry(1, alto * 0.018), this.materialBarra);
    this.barra.position.set(0, -alto * 0.43, 0.003);
    this.contenido.add(this.barra);

    this.grupo.visible = false;
    this.escena.object3D.add(this.grupo);
  },

  // ---------- Flujo ----------

  empezar() {
    if (this.escena.introActiva) return;
    if (this.vista && INTRO.soloLaPrimeraVez) return;
    this.vista = true;
    this.escena.introActiva = true;
    this.terminando = false;
    this.transcurrido = 0;

    // El jugador mira el setup desde lejos
    const rig = document.querySelector('#rig');
    if (rig) rig.object3D.position.set(0, 0, INTRO.miradorZ);
    if (!this.escena.is('vr-mode')) this.inclinarCamara(INTRO.inclinacionEscritorio);

    this.mostrarPaso(0);
    this.colocar(true);
    this.grupo.visible = true;
  },

  mostrarPaso(i) {
    this.paso = i;
    this.enPaso = 0;
    this.dibujar(i);
    this.contenido.scale.setScalar(INTRO.escalaInicial);
    blipGlitch();
  },

  saltear() {
    if (!this.escena.introActiva || this.terminando) return;
    if (this.transcurrido < INTRO.esperaParaSaltear) return; // la misma tecla o clic que cerró el inicio
    this.terminar();
  },

  async terminar() {
    if (this.terminando) return;
    this.terminando = true;
    const fundido = document.querySelector('#camara').components.fundido;
    await fundido.ir(1, INTRO.fundido);

    this.grupo.visible = false;
    const rig = document.querySelector('#rig');
    if (rig) rig.object3D.position.set(0, 0, lugarFrenteAlTramo(0));
    if (!this.escena.is('vr-mode')) this.inclinarCamara(0);
    this.escena.introActiva = false;
    this.escena.emit('intro-terminada', {}, false);

    await fundido.ir(0, INTRO.fundido);
  },

  // En la compu, la cámara mira un poco hacia arriba para que se vea el setup por encima de la tarjeta
  inclinarCamara(radianes) {
    const mirar = document.querySelector('#camara').components['look-controls'];
    if (mirar && mirar.pitchObject) mirar.pitchObject.rotation.x = radianes;
  },

  tick(tiempo, dt) {
    if (!this.escena.introActiva || this.terminando || !dt) return;
    const s = Math.min(dt, 100) / 1000;
    this.transcurrido += s;
    this.enPaso += s;

    // Aparición suave de cada tarjeta: crece un poco hasta su tamaño (sin parpadeo)
    const avance = Math.min((this.enPaso * 1000) / INTRO.entradaTarjeta, 1);
    const suave = 1 - Math.pow(1 - avance, 3);
    this.contenido.scale.setScalar(INTRO.escalaInicial + (1 - INTRO.escalaInicial) * suave);

    // Barra del tiempo que le queda a la tarjeta
    const resto = Math.max(1 - this.enPaso / INTRO.duracionPaso, 0.001);
    this.barra.scale.x = this.anchoBarra * resto;
    this.barra.position.x = (-this.anchoBarra * (1 - resto)) / 2;

    if (this.enPaso >= INTRO.duracionPaso) {
      if (this.paso + 1 < INTRO.pasos.length) this.mostrarPaso(this.paso + 1);
      else this.terminar();
    }
    this.colocar(false, s);
  },

  // Pone la tarjeta delante de la cabeza (de golpe o siguiéndola con retraso)
  colocar(inmediato, s = 0) {
    if (!this.camara) this.camara = document.querySelector('#camara');
    if (!this.camara) return;
    this.camara.object3D.getWorldPosition(this.posCamara);
    this.camara.object3D.getWorldDirection(this.direccion);
    this.direccion.negate(); // getWorldDirection apunta hacia atrás en la cámara
    this.direccion.y = 0;
    if (this.direccion.lengthSq() < 1e-4) this.direccion.set(0, 0, -1);
    this.direccion.normalize();
    this.objetivo
      .copy(this.posCamara)
      .addScaledVector(this.direccion, INTRO.distancia)
      .setY(this.posCamara.y + INTRO.alturaRelativa);

    const pos = this.grupo.position;
    if (inmediato) pos.copy(this.objetivo);
    else pos.lerp(this.objetivo, Math.min(INTRO.suavizado * s, 1));
    this.grupo.lookAt(this.posCamara.x, pos.y, this.posCamara.z); // de frente, sin inclinarse
  },

  // ---------- Dibujo de la tarjeta ----------

  dibujar(i) {
    const C = COLORES.intro;
    const paso = INTRO.pasos[i];
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    // Panel con borde fino
    const radio = h * 0.08;
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = C.fondo;
    ctx.beginPath();
    ctx.roundRect(4, 4, w - 8, h - 8, radio);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = h * 0.008;
    ctx.strokeStyle = C.borde;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Dibujo a la izquierda
    const lado = h * 0.56;
    const cx = h * 0.42;
    const cy = h * 0.42;
    ctx.save();
    ctx.translate(cx - lado / 2, cy - lado / 2);
    this.pictograma(ctx, paso.dibujo, lado);
    ctx.restore();

    // Título con un poco de volumen
    const x0 = h * 0.8;
    const anchoTexto = w - x0 - h * 0.08;
    let tamano = h * 0.135;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    do {
      ctx.font = `${tamano}px ${FUENTE_TITULO}`;
      tamano -= 2;
    } while (ctx.measureText(paso.titulo).width > anchoTexto && tamano > 10);
    const yTitulo = h * 0.27;
    ctx.fillStyle = C.tituloVolumen;
    ctx.fillText(paso.titulo, x0, yTitulo + tamano * 0.07);
    ctx.fillStyle = C.titulo;
    ctx.fillText(paso.titulo, x0, yTitulo);

    // Texto, cortado en líneas
    const tamanoTexto = h * 0.078;
    ctx.font = `500 ${tamanoTexto}px ${FUENTE_TEXTO}`;
    ctx.fillStyle = C.texto;
    this.partirEnLineas(ctx, paso.texto, anchoTexto).forEach((linea, n) => {
      ctx.fillText(linea, x0, h * 0.42 + n * tamanoTexto * 1.3);
    });

    // Puntos de los pasos, centrados abajo
    const total = INTRO.pasos.length;
    const separacion = h * 0.045;
    const xPuntos = w / 2 - ((total - 1) * separacion) / 2;
    for (let n = 0; n < total; n++) {
      ctx.fillStyle = n === i ? C.puntoActual : n < i ? C.borde : C.punto;
      ctx.beginPath();
      ctx.arc(xPuntos + n * separacion, h * 0.82, h * (n === i ? 0.013 : 0.01), 0, Math.PI * 2);
      ctx.fill();
    }

    // Cómo saltear
    ctx.textAlign = 'center';
    ctx.font = `500 ${h * 0.04}px ${FUENTE_TEXTO}`;
    ctx.fillStyle = C.pista;
    ctx.fillText(INTRO.saltear, w / 2, h * 0.9);

    this.textura.needsUpdate = true;
  },

  partirEnLineas(ctx, texto, anchoMaximo) {
    const lineas = [];
    let actual = '';
    texto.split(' ').forEach((palabra) => {
      const prueba = actual ? `${actual} ${palabra}` : palabra;
      if (actual && ctx.measureText(prueba).width > anchoMaximo) {
        lineas.push(actual);
        actual = palabra;
      } else actual = prueba;
    });
    if (actual) lineas.push(actual);
    return lineas;
  },

  // Dibujos simples con formas básicas, en un cuadrado de lado `l` (origen arriba a la izquierda)
  pictograma(ctx, tipo, l) {
    const K = COLORES;
    const rect = (x, y, ancho, alto, color, r = 0) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x * l, y * l, ancho * l, alto * l, r * l);
      ctx.fill();
    };
    const hexagono = (x, y, r, relleno, borde) => {
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k + Math.PI / 6;
        const px = (x + Math.cos(a) * r) * l;
        const py = (y + Math.sin(a) * r) * l;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      if (relleno) {
        ctx.fillStyle = relleno;
        ctx.fill();
      }
      if (borde) {
        ctx.lineWidth = l * 0.02;
        ctx.strokeStyle = borde;
        ctx.stroke();
      }
    };
    const persona = (x, y, s, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x * l, y * l, s * 0.22 * l, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect((x - s * 0.3) * l, (y + s * 0.28) * l, s * 0.6 * l, s * 0.7 * l, s * 0.25 * l);
      ctx.fill();
    };
    const flechaArriba = (x, y0, y1, color) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = l * 0.035;
      ctx.lineCap = 'round';
      ctx.setLineDash([l * 0.05, l * 0.05]);
      ctx.beginPath();
      ctx.moveTo(x * l, y0 * l);
      ctx.lineTo(x * l, (y1 + 0.06) * l);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo((x - 0.08) * l, (y1 + 0.08) * l);
      ctx.lineTo(x * l, y1 * l);
      ctx.lineTo((x + 0.08) * l, (y1 + 0.08) * l);
      ctx.closePath();
      ctx.fill();
    };

    if (tipo === 'atrapado') {
      // Monitor con una persona adentro y píxeles del Glitch alrededor
      rect(0.06, 0.1, 0.88, 0.62, K.lavanda, 0.06);
      rect(0.11, 0.15, 0.78, 0.52, '#1d1727', 0.03);
      rect(0.44, 0.72, 0.12, 0.1, K.lavanda);
      rect(0.3, 0.82, 0.4, 0.05, K.lavanda, 0.02);
      persona(0.5, 0.3, 0.38, K.ambar);
      [
        [0.18, 0.2, K.celeste],
        [0.76, 0.24, K.violeta],
        [0.22, 0.56, K.violeta],
        [0.72, 0.55, K.celeste],
        [0.8, 0.42, K.lavanda],
      ].forEach(([x, y, c]) => rect(x, y, 0.06, 0.06, c));
    } else if (tipo === 'setup') {
      // Tres escalones: teclado, torre y monitor, y una flecha que sube
      rect(0.04, 0.74, 0.62, 0.18, K.lavanda, 0.03);
      for (let k = 0; k < 5; k++) rect(0.08 + k * 0.11, 0.78, 0.08, 0.05, '#8f7cc0', 0.01);
      rect(0.2, 0.42, 0.34, 0.32, '#5d4a8f', 0.03);
      ctx.strokeStyle = K.verde;
      ctx.lineWidth = l * 0.02;
      ctx.beginPath();
      ctx.arc(0.37 * l, 0.58 * l, 0.08 * l, 0, Math.PI * 2);
      ctx.stroke();
      rect(0.3, 0.08, 0.5, 0.34, K.lavanda, 0.03);
      rect(0.34, 0.12, 0.42, 0.26, K.celeste, 0.02);
      flechaArriba(0.86, 0.9, 0.12, K.ambar);
    } else if (tipo === 'reset') {
      // Botón RESET con los tres huecos arriba
      [0.28, 0.5, 0.72].forEach((x) => hexagono(x, 0.16, 0.08, '#241b36', K.lavanda));
      ctx.fillStyle = '#3b3449';
      ctx.beginPath();
      ctx.arc(0.5 * l, 0.6 * l, 0.34 * l, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = K.violeta;
      ctx.beginPath();
      ctx.arc(0.5 * l, 0.6 * l, 0.28 * l, 0, Math.PI * 2);
      ctx.fill();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${l * 0.15}px ${FUENTE_TITULO}`;
      ctx.fillStyle = '#4b3a7a';
      ctx.fillText('RESET', 0.5 * l, 0.615 * l);
      ctx.fillStyle = '#fffaf0';
      ctx.fillText('RESET', 0.5 * l, 0.6 * l);
    } else if (tipo === 'fragmentos') {
      // Los tres fragmentos brillando y el contador
      [0.2, 0.5, 0.8].forEach((x) => {
        ctx.save();
        ctx.shadowColor = K.huecoEncendido;
        ctx.shadowBlur = l * 0.08;
        hexagono(x, 0.36, 0.12, K.fragmento, K.huecoEncendido);
        ctx.restore();
      });
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${l * 0.24}px ${FUENTE_TITULO}`;
      ctx.fillStyle = '#fffaf0';
      ctx.fillText('0/3', 0.5 * l, 0.76 * l);
    } else if (tipo === 'escalar') {
      // Pared con teclas, una persona colgada, una flecha que sube y la niebla abajo
      [
        [0.12, 0.1],
        [0.58, 0.16],
        [0.3, 0.36],
        [0.68, 0.44],
        [0.16, 0.6],
      ].forEach(([x, y]) => rect(x, y, 0.2, 0.1, K.lavanda, 0.025));
      persona(0.46, 0.5, 0.3, K.ambar);
      flechaArriba(0.86, 0.66, 0.08, K.ambar);
      ctx.globalAlpha = 0.85;
      rect(0, 0.82, 1, 0.16, K.niebla, 0.03);
      ctx.globalAlpha = 1;
      [0.1, 0.3, 0.55, 0.78].forEach((x, k) => rect(x, 0.76 - (k % 2) * 0.03, 0.06, 0.06, K.nieblaPixel));
    }
  },

  remove() {
    window.removeEventListener('keydown', this.alTeclear);
    if (this.escena.canvas) this.escena.canvas.removeEventListener('mousedown', this.alClickear);
    this.escena.object3D.remove(this.grupo);
    this.textura.dispose();
  },
});
