// Checkpoint: una zona donde el jugador descansa. Si cae, reaparece en el último que alcanzó.
// La entidad se coloca en el CENTRO DE LA SUPERFICIE donde se para el jugador (ahí queda parado).
// Lo que se ve (el entrepaño con rejilla y sus soportes, o el piso de arriba) lo arman plataformas.js y
// escenario.js: este componente solo define la zona y el punto de reaparición.
//
// Los checkpoints se alcanzan en orden creciente: el progreso no retrocede.
import { CAIDA, CHECKPOINT } from '../config.js';

// Todos los checkpoints de la escena; los consulta el componente caida.
export const checkpoints = [];

AFRAME.registerComponent('checkpoint', {
  schema: {
    orden: { type: 'int', default: 0 }, // 0 = inicio, 1 = primer checkpoint, etc.
    ancho: { type: 'number', default: 2 }, // medida en x
    profundidad: { type: 'number', default: 1.4 }, // medida en z
    reaparecerZ: { type: 'number', default: 9999 }, // z donde reaparece el jugador (por defecto, el centro)
  },

  init() {
    this.posicion = new THREE.Vector3();
    checkpoints.push(this);
  },

  remove() {
    const i = checkpoints.indexOf(this);
    if (i >= 0) checkpoints.splice(i, 1);
  },

  // Punto del mundo donde reaparece el jugador
  puntoDeReaparicion(destino) {
    this.el.object3D.getWorldPosition(destino);
    if (this.data.reaparecerZ !== 9999) destino.z = this.data.reaparecerZ;
    return destino;
  },

  // Rectángulo (en x y z del mundo) donde se puede caminar sobre este checkpoint
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

  // ¿Está el jugador parado sobre este checkpoint? posRig: pies; posCamara: dónde está su cuerpo en x y z.
  // Tiene un pequeño margen (CAIDA.margenSinCaida) para no ser tan exigente con el borde y la altura.
  sostiene(posRig, posCamara) {
    const z = this.zona();
    const m = CAIDA.margenSinCaida;
    const dentro = posCamara.x >= z.x0 - m.lado && posCamara.x <= z.x1 + m.lado && posCamara.z >= z.z0 - m.lado && posCamara.z <= z.z1 + m.lado;
    const dy = posRig.y - z.y;
    return dentro && dy >= -CHECKPOINT.toleranciaApoyo && dy <= CHECKPOINT.alturaApoyo + m.alto;
  },
});
