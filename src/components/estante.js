// Estante: una pequeña base que sale de la pared en medio de un tramo, donde el jugador puede pararse sin
// agarrarse (y descansar las manos). No es un checkpoint: si el jugador cae, vuelve al último piso.
// La entidad va en el centro de la superficie del estante; el dibujo lo arma decorado.js.
import { CHECKPOINT, ESTANTE } from '../config.js';

// Todos los estantes de la escena; los consultan caida y limites
export const estantes = [];

AFRAME.registerComponent('estante', {
  schema: {
    ancho: { type: 'number', default: 1.9 },
    profundidad: { type: 'number', default: 2.1 },
  },

  init() {
    this.posicion = new THREE.Vector3();
    estantes.push(this);
  },

  remove() {
    const i = estantes.indexOf(this);
    if (i >= 0) estantes.splice(i, 1);
  },

  // Rectángulo (en x y z del mundo) de la superficie
  zona() {
    this.el.object3D.getWorldPosition(this.posicion);
    return {
      x0: this.posicion.x - this.data.ancho / 2,
      x1: this.posicion.x + this.data.ancho / 2,
      z0: this.posicion.z - this.data.profundidad / 2,
      z1: this.posicion.z + this.data.profundidad / 2,
      y: this.posicion.y,
    };
  },

  // ¿Puede quedar parado acá? Si se suelta un poco más arriba (hasta ESTANTE.caidaMaxima), cae parado en él.
  sostiene(posRig, posCamara) {
    const z = this.zona();
    const dentro = posCamara.x >= z.x0 && posCamara.x <= z.x1 && posCamara.z >= z.z0 && posCamara.z <= z.z1;
    const dy = posRig.y - z.y;
    return dentro && dy >= -CHECKPOINT.toleranciaApoyo && dy <= ESTANTE.caidaMaxima;
  },
});
