// Fundido a negro de la vista. Va en la entidad de la cámara.
// Es una esfera negra alrededor de la cabeza, porque en VR no se puede tapar la pantalla con HTML.
//
// Uso: camara.components.fundido.ir(1, 500) se va a negro en 500 ms; ir(0, 500) vuelve.
// Devuelve una promesa que se cumple cuando termina.
import { CAIDA } from '../config.js';

AFRAME.registerComponent('fundido', {
  init() {
    this.material = new THREE.MeshBasicMaterial({
      color: CAIDA.colorFundido,
      transparent: true,
      opacity: 0,
      side: THREE.BackSide, // se ve desde adentro
      depthTest: false,
      depthWrite: false,
      fog: false,
    });
    this.esfera = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), this.material);
    this.esfera.renderOrder = 9999; // siempre arriba de todo
    this.esfera.frustumCulled = false;
    this.esfera.visible = false;
    this.el.setObject3D('fundido', this.esfera);

    this.opacidad = 0;
    this.desde = 0;
    this.hasta = 0;
    this.duracion = 0;
    this.transcurrido = 0;
    this.alTerminar = null;
  },

  // Lleva la opacidad a `hasta` (0 = transparente, 1 = negro) en `ms` milisegundos
  ir(hasta, ms) {
    if (this.alTerminar) this.alTerminar(); // si había un fundido en curso, lo da por terminado
    this.desde = this.opacidad;
    this.hasta = hasta;
    this.duracion = Math.max(ms, 1);
    this.transcurrido = 0;
    return new Promise((resolver) => {
      this.alTerminar = resolver;
    });
  },

  tick(tiempo, dt) {
    if (!this.alTerminar) return;
    this.transcurrido += dt;
    const avance = Math.min(this.transcurrido / this.duracion, 1);
    this.opacidad = this.desde + (this.hasta - this.desde) * avance;
    this.material.opacity = this.opacidad;
    this.esfera.visible = this.opacidad > 0.001;

    if (avance >= 1) {
      const resolver = this.alTerminar;
      this.alTerminar = null;
      resolver();
    }
  },

  remove() {
    this.el.removeObject3D('fundido');
    this.esfera.geometry.dispose();
    this.material.dispose();
  },
});
