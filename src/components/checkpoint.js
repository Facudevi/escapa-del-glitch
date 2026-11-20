// Checkpoint: una plataforma donde el jugador descansa. Si cae, reaparece en el último que alcanzó.
// La entidad se coloca en el CENTRO DE LA CARA SUPERIOR de la plataforma (ahí queda parado el jugador).
//
// Un checkpoint con dibujar: false es una zona sin plataforma visible (el piso de inicio).
// Los checkpoints se alcanzan en orden creciente: el progreso no retrocede.
import { COLORES, CHECKPOINT } from '../config.js';
import { crear } from '../utilidades.js';

// Todos los checkpoints de la escena; los consulta el componente caida.
export const checkpoints = [];

AFRAME.registerComponent('checkpoint', {
  schema: {
    orden: { type: 'int', default: 0 }, // 0 = inicio, 1 = primer checkpoint, etc.
    ancho: { type: 'number', default: 2 }, // medida en x
    profundidad: { type: 'number', default: 1.4 }, // medida en z
    dibujar: { type: 'boolean', default: true },
    color: { type: 'color', default: COLORES.verde },
  },

  init() {
    this.posicion = new THREE.Vector3();
    checkpoints.push(this);

    if (this.data.dibujar) {
      crear(this.el, 'a-box', {
        position: `0 ${-CHECKPOINT.grosor / 2} 0`,
        width: this.data.ancho,
        height: CHECKPOINT.grosor,
        depth: this.data.profundidad,
        color: this.data.color,
        material: 'roughness: 0.9; metalness: 0',
      });
    }
  },

  remove() {
    const i = checkpoints.indexOf(this);
    if (i >= 0) checkpoints.splice(i, 1);
  },

  // Punto del mundo donde reaparece el jugador
  puntoDeReaparicion(destino) {
    return this.el.object3D.getWorldPosition(destino);
  },

  // ¿Está el jugador parado sobre este checkpoint? posRig: pies; posCamara: dónde está su cuerpo en x y z.
  sostiene(posRig, posCamara) {
    this.el.object3D.getWorldPosition(this.posicion);
    const { ancho, profundidad } = this.data;
    const dentro =
      Math.abs(posCamara.x - this.posicion.x) <= ancho / 2 &&
      Math.abs(posCamara.z - this.posicion.z) <= profundidad / 2;
    const dy = posRig.y - this.posicion.y;
    return dentro && dy >= -CHECKPOINT.toleranciaApoyo && dy <= CHECKPOINT.alturaApoyo;
  },
});
