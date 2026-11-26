// Movimiento con el stick de los controles (VR): el jugador camina por los pisos moviendo el stick,
// sin tener que desplazarse físicamente por la habitación. Va en el rig del jugador.
//
// - Sirve cualquiera de los dos sticks (zurdos y diestros por igual); si se mueven los dos, manda el que
//   está más inclinado.
// - Camina hacia donde mira la cabeza, solo en el plano horizontal: el stick no sube ni baja.
// - Velocidad constante, sin aceleraciones (más cómodo, marea menos). Una zona muerta evita que el
//   jugador se deslice si el stick queda apenas corrido.
// - No camina mientras está agarrado a algo, mientras cae ni mientras un ascenso automático lo lleva.
//   Los límites (componente limites) siguen igual: no deja salir del piso ni del estante.
//
// Para probarlo sin casco: el Immersive Web Emulator tiene sticks, o desde la consola se puede emitir
// 'thumbstickmoved' en #mano-izq con { x, y }. En la compu se camina con WASD (modo-escritorio).
import { STICK } from '../config.js';

AFRAME.registerComponent('movimiento-stick', {
  init() {
    this.sticks = { izquierda: { x: 0, y: 0 }, derecha: { x: 0, y: 0 } };
    this.direccion = new THREE.Vector3();
    this.giro = new THREE.Euler(0, 0, 0, 'YXZ');
    this.camara = null;

    const escuchar = (selector, mano) => {
      const el = document.querySelector(selector);
      if (!el) return;
      el.addEventListener('thumbstickmoved', (e) => {
        this.sticks[mano].x = e.detail.x;
        this.sticks[mano].y = e.detail.y;
      });
    };
    escuchar('#mano-izq', 'izquierda');
    escuchar('#mano-der', 'derecha');

    // Al reaparecer o volver a jugar, el stick no sigue empujando con un valor viejo
    const soltar = () => Object.values(this.sticks).forEach((s) => ((s.x = 0), (s.y = 0)));
    this.el.sceneEl.addEventListener('reaparecer', soltar);
    this.el.sceneEl.addEventListener('volver-a-jugar', soltar);
  },

  // El stick más inclinado, o null si los dos están dentro de la zona muerta
  stickActivo() {
    let elegido = null;
    let mayor = STICK.zonaMuerta;
    Object.values(this.sticks).forEach((s) => {
      const largo = Math.hypot(s.x, s.y);
      if (largo > mayor) {
        mayor = largo;
        elegido = s;
      }
    });
    return elegido;
  },

  puedeCaminar() {
    const escena = this.el.sceneEl;
    if (escena.rigAutomatico) return false;
    const climb = this.el.components.climb;
    if (climb && Object.keys(climb.sujetas).length > 0) return false; // colgado de un agarre se escala, no se camina
    const caida = this.el.components.caida;
    if (caida && caida.estado !== 'normal') return false;
    return true;
  },

  tick(tiempo, dt) {
    const stick = this.stickActivo();
    if (!stick || !dt || !this.puedeCaminar()) return;
    if (!this.camara) this.camara = document.querySelector('#camara');
    if (!this.camara) return;

    // Hacia dónde mira la cabeza (solo el giro horizontal)
    this.giro.setFromQuaternion(this.camara.object3D.getWorldQuaternion(new THREE.Quaternion()), 'YXZ');

    // Stick hacia adelante = y negativo
    this.direccion.set(stick.x, 0, stick.y).normalize();
    this.direccion.applyAxisAngle(THREE.Object3D.DEFAULT_UP, this.giro.y);

    const paso = (STICK.velocidad * Math.min(dt, 100)) / 1000;
    const pos = this.el.object3D.position;
    pos.x += this.direccion.x * paso;
    pos.z += this.direccion.z * paso;
  },
});
