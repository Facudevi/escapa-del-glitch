// Escalada con mouse (modo escritorio, para probar sin casco). Va en la <a-scene>.
//
// - Botón izquierdo sostenido sobre un agarre al alcance = mano izquierda agarrada.
// - Botón derecho sostenido = mano derecha agarrada.
// - Con la mano agarrada, mover el mouse hacia abajo baja la "mano" y el jugador sube.
//   Mover el mouse hacia un costado desplaza al jugador hacia el lado contrario.
//
// No tiene lógica de escalada propia: mueve las entidades de las manos y dispara los mismos
// eventos que el control real ('mano-agarra' / 'mano-suelta'), así que usa el componente climb.
// Se desactiva solo al entrar en VR. En reposo, las manos giran con la mirada del jugador.
import { ESCRITORIO } from '../config.js';

const BOTONES = { 0: 'izquierda', 2: 'derecha' };
const ID_MANO = { izquierda: '#mano-izq', derecha: '#mano-der' };

AFRAME.registerComponent('escalada-mouse', {
  init() {
    this.agarradas = {}; // nombre de mano → true mientras el botón está apretado
    this.resaltado = null; // agarre resaltado porque el cursor lo tiene al alcance
    this.rayo = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this.punto = new THREE.Vector3();
    this.posCamara = new THREE.Vector3();

    this.alBajarBoton = (e) => this.alBajarBoton_(e);
    this.alMoverMouse = (e) => this.alMoverMouse_(e);
    this.alSoltarBoton = (e) => this.soltar(BOTONES[e.button]);
    this.alPerderFoco = () => this.soltarTodas();
    this.alMenuContexto = (e) => {
      if (e.target === this.el.canvas) e.preventDefault(); // el botón derecho es una mano, no un menú
    };

    window.addEventListener('mousedown', this.alBajarBoton);
    window.addEventListener('mousemove', this.alMoverMouse);
    window.addEventListener('mouseup', this.alSoltarBoton);
    window.addEventListener('blur', this.alPerderFoco);
    window.addEventListener('contextmenu', this.alMenuContexto);

    // Guantes en su posición de reposo (en VR los pisan los controles reales)
    // y atentos a que el juego los suelte solo (por ejemplo, sin energía)
    const alCargar = () => {
      this.ponerTodasEnReposo();
      Object.keys(ID_MANO).forEach((nombre) => {
        this.mano(nombre).addEventListener('agarre-soltado', () => this.alSoltarElJuego(nombre));
      });
    };
    if (this.el.hasLoaded) alCargar();
    else this.el.addEventListener('loaded', alCargar);
    this.el.addEventListener('exit-vr', () => this.ponerTodasEnReposo());
  },

  remove() {
    window.removeEventListener('mousedown', this.alBajarBoton);
    window.removeEventListener('mousemove', this.alMoverMouse);
    window.removeEventListener('mouseup', this.alSoltarBoton);
    window.removeEventListener('blur', this.alPerderFoco);
    window.removeEventListener('contextmenu', this.alMenuContexto);
  },

  mano(nombre) {
    return document.querySelector(ID_MANO[nombre]);
  },

  ponerEnReposo(nombre) {
    const mano = this.mano(nombre);
    if (mano) mano.object3D.position.set(...ESCRITORIO.reposoMano[nombre]);
  },

  ponerTodasEnReposo() {
    Object.keys(ID_MANO).forEach((nombre) => this.ponerEnReposo(nombre));
  },

  // Agarre bajo el cursor del mouse y al alcance, como { punto, agarre } (punto en coordenadas del mundo), o null
  agarreBajoElMouse(e) {
    const canvas = this.el.canvas;
    const camara = this.el.camera;
    if (!canvas || !camara) return null;

    const caja = canvas.getBoundingClientRect();
    this.ndc.set(
      ((e.clientX - caja.left) / caja.width) * 2 - 1,
      -((e.clientY - caja.top) / caja.height) * 2 + 1
    );
    this.rayo.setFromCamera(this.ndc, camara);

    // Solo las mallas de los agarres (sin anillos ni otros adornos)
    const objetos = Array.from(this.el.querySelectorAll('.agarre')).map(
      (el) => el.getObject3D('mesh') || el.object3D
    );
    const toques = this.rayo.intersectObjects(objetos, true);
    if (!toques.length) return null;

    camara.getWorldPosition(this.posCamara);
    if (this.posCamara.distanceTo(toques[0].point) > ESCRITORIO.alcance) return null;
    return { punto: toques[0].point, agarre: toques[0].object.el };
  },

  // Resalta el agarre que está bajo el cursor (y al alcance) para que se vea qué se puede agarrar
  resaltarBajoElMouse(e) {
    const toque = this.agarreBajoElMouse(e);
    const nuevo = toque ? toque.agarre : null;
    if (nuevo === this.resaltado) return;
    if (this.resaltado) this.resaltado.emit('apagar', { mano: 'mouse' }, false);
    this.resaltado = nuevo;
    if (nuevo) nuevo.emit('resaltar', { mano: 'mouse' }, false);
  },

  apagarResaltado() {
    if (this.resaltado) this.resaltado.emit('apagar', { mano: 'mouse' }, false);
    this.resaltado = null;
  },

  alBajarBoton_(e) {
    const nombre = BOTONES[e.button];
    if (!nombre || this.agarradas[nombre]) return;
    if (this.el.is('vr-mode') || e.target !== this.el.canvas) return;

    const toque = this.agarreBajoElMouse(e);
    if (!toque) return; // sin agarre al alcance: el mouse sigue sirviendo para mirar
    const punto = toque.punto;
    this.apagarResaltado();

    const rig = document.querySelector('#rig');
    const mano = this.mano(nombre);
    rig.removeAttribute('animation__viaje'); // corta un viaje en curso

    // El guante va al punto del agarre y "aprieta el grip"
    this.punto.copy(punto);
    mano.object3D.position.copy(rig.object3D.worldToLocal(this.punto));
    mano.emit('mano-agarra', { mano: nombre });

    if (!rig.components.climb.sujetas[nombre]) {
      mano.emit('mano-suelta', { mano: nombre }); // no agarró nada: la mano vuelve a abrirse
      this.ponerEnReposo(nombre);
      return;
    }
    this.agarradas[nombre] = true;
    this.pausarMirada(true);
    this.avisarCambio();
    e.preventDefault();
  },

  alMoverMouse_(e) {
    const nombres = Object.keys(this.agarradas);
    if (!nombres.length) {
      if (!this.el.is('vr-mode') && e.target === this.el.canvas) this.resaltarBajoElMouse(e);
      return;
    }

    const dx = e.movementX * ESCRITORIO.metrosPorPixel;
    const dy = e.movementY * ESCRITORIO.metrosPorPixel;
    const yaw = document.querySelector('#camara').object3D.rotation.y;

    // Mouse abajo = mano abajo; mouse a la derecha = mano a la derecha (según hacia dónde mira)
    nombres.forEach((nombre) => {
      const posicion = this.mano(nombre).object3D.position;
      posicion.y -= dy;
      posicion.x += dx * Math.cos(yaw);
      posicion.z -= dx * Math.sin(yaw);
    });
  },

  soltar(nombre) {
    if (!nombre || !this.agarradas[nombre]) return;
    delete this.agarradas[nombre];
    this.mano(nombre).emit('mano-suelta', { mano: nombre });
    this.ponerEnReposo(nombre);
    if (!Object.keys(this.agarradas).length) this.pausarMirada(false);
    this.avisarCambio();
  },

  // El juego soltó la mano (sin energía): se deja de seguir al mouse aunque el botón siga apretado
  alSoltarElJuego(nombre) {
    if (!this.agarradas[nombre]) return; // la soltó el propio jugador: ya está resuelto
    delete this.agarradas[nombre];
    this.ponerEnReposo(nombre);
    if (!Object.keys(this.agarradas).length) this.pausarMirada(false);
    this.avisarCambio();
  },

  soltarTodas() {
    Object.keys(this.agarradas).forEach((nombre) => this.soltar(nombre));
  },

  // Mientras se escala, arrastrar el mouse no debe girar la cámara
  pausarMirada(pausar) {
    const camara = document.querySelector('#camara');
    if (camara) camara.setAttribute('look-controls', 'enabled', !pausar);
  },

  // Las manos acompañan la mirada: si el jugador gira la cabeza, las manos en reposo giran con él (quedan
  // siempre adelante, de frente al eje del jugador) y todas apuntan hacia donde mira
  tick() {
    if (this.el.is('vr-mode')) return; // con casco, las manos las mueven los controles
    const camara = document.querySelector('#camara');
    if (!camara) return;
    const giro = camara.object3D.rotation.y;
    const cabeza = camara.object3D.position;
    const coseno = Math.cos(giro);
    const seno = Math.sin(giro);
    Object.keys(ID_MANO).forEach((nombre) => {
      const mano = this.mano(nombre);
      if (!mano) return;
      mano.object3D.rotation.y = giro;
      if (this.agarradas[nombre]) return; // agarrada: queda en el agarre
      const [x, y, z] = ESCRITORIO.reposoMano[nombre];
      mano.object3D.position.set(cabeza.x + x * coseno + z * seno, y, cabeza.z - x * seno + z * coseno);
    });
  },

  // Le avisa a modo-escritorio cuántas manos hay agarradas (para no caminar ni viajar mientras tanto)
  avisarCambio() {
    this.el.emit('escalada-mouse-cambio', { activas: Object.keys(this.agarradas).length }, false);
  },
});
