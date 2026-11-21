// Un objeto que se activa con un golpe. Va en el botón RESET y en el botón de volver a jugar.
//
// - Con casco: cuenta como golpe una mano que llega al botón con velocidad hacia él (FINAL.umbralGolpe).
//   Pasar la mano despacio o rozarlo no lo activa: hace falta un golpe deliberado.
// - En modo escritorio el golpe es un clic del mouse (lo resuelve modo-escritorio).
//
// Emite 'golpeado' { origen } sobre la entidad. Mientras `activo` sea falso no hace nada.
import { FINAL } from '../config.js';

AFRAME.registerComponent('golpeable', {
  schema: {
    radio: { type: 'number', default: FINAL.radioGolpe },
    umbral: { type: 'number', default: FINAL.umbralGolpe },
  },

  init() {
    this.el.classList.add('golpeable');
    this.manos = null;
    this.previas = {};
    this.enfriaHasta = 0;
    this.centro = new THREE.Vector3();
    this.posicion = new THREE.Vector3();
    this.velocidad = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.cuaternion = new THREE.Quaternion();
  },

  // Dispara el golpe respetando el tiempo de espera entre golpes
  golpear(origen) {
    const ahora = performance.now();
    if (ahora < this.enfriaHasta) return false;
    this.enfriaHasta = ahora + FINAL.enfriamientoGolpe * 1000;
    this.el.emit('golpeado', { origen }, false);
    return true;
  },

  tick(tiempo, dt) {
    if (!this.el.sceneEl.is('vr-mode')) return; // en escritorio se usa el clic
    if (!this.manos) {
      const manos = Array.from(this.el.sceneEl.querySelectorAll('[mano-guante]'));
      if (manos.length < 2) return;
      this.manos = manos;
    }
    const segundos = Math.min(dt, 100) / 1000;
    if (segundos <= 0) return;

    this.el.object3D.getWorldPosition(this.centro);
    // El golpe va hacia la pared (-z del lugar donde está el botón). Se usa la orientación del objeto que
    // lo contiene y no la del botón, que está girado 90° para que su cara mire al jugador.
    const padre = this.el.object3D.parent;
    if (padre) padre.getWorldQuaternion(this.cuaternion);
    else this.cuaternion.identity();
    this.normal.set(0, 0, -1).applyQuaternion(this.cuaternion);

    this.manos.forEach((mano) => {
      mano.object3D.getWorldPosition(this.posicion);
      const previa = this.previas[mano.id];
      if (!previa) {
        this.previas[mano.id] = this.posicion.clone();
        return;
      }

      // Primero se mide cuánto se movió desde el cuadro anterior y después se actualiza la posición anterior
      this.velocidad.copy(this.posicion).sub(previa).divideScalar(segundos);
      previa.copy(this.posicion);
      const haciaElBoton = this.velocidad.dot(this.normal);
      const cerca = this.posicion.distanceTo(this.centro) <= this.data.radio;
      // Tiene que ir sobre todo hacia el botón (no pasar de costado)
      if (cerca && haciaElBoton >= this.data.umbral && haciaElBoton >= this.velocidad.length() * 0.6) {
        this.golpear('mano');
      }
    });
  },
});
