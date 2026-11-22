// Límites del jugador: no puede salir del espacio de juego ni caminar por el "limbo" donde no hay nada.
// Va en el rig del jugador. Si el cuerpo (la cámara) se pasa de la zona permitida, el rig se corre lo justo
// para que vuelva a quedar adentro, así que se siente como una pared invisible.
//
// La zona permitida depende de dónde está parado:
//   - en el piso de la sala: toda la sala, menos el lugar que ocupa la pared de escalada;
//   - sobre un entrepaño o el piso de arriba: la superficie de ese checkpoint (con un margen del borde);
//   - en la pared (agarrado o en el aire): un pasillo angosto delante de la pared, del ancho de la pared.
import { ESCENARIO, LIMITES } from '../config.js';
import { checkpoints } from './checkpoint.js';

const FRENTE = ESCENARIO.z + ESCENARIO.profundidadPared / 2; // frente de la pared

const acotar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor));

AFRAME.registerComponent('limites', {
  init() {
    this.posCamara = new THREE.Vector3();
    this.camara = null;
  },

  // Rectángulo permitido { x0, x1, z0, z1 } para la posición actual del jugador
  zonaPermitida(posRig) {
    const m = LIMITES.margen;
    const climb = this.el.components.climb;
    const agarrando = climb && Object.keys(climb.sujetas).length > 0;

    // Parado sobre un entrepaño o el piso de arriba (los checkpoints de orden mayor que 0)
    let apoyo = null;
    if (!agarrando) {
      checkpoints.forEach((cp) => {
        if (cp.data.orden > 0 && cp.sostiene(posRig, this.posCamara) && (!apoyo || cp.data.orden > apoyo.data.orden)) apoyo = cp;
      });
    }
    if (apoyo) {
      const z = apoyo.zona();
      return { x0: z.x0 + m, x1: z.x1 - m, z0: z.z0 + m, z1: z.z1 - m };
    }

    // En el piso de la sala
    if (!agarrando && posRig.y <= LIMITES.pisoTolerancia) {
      return { x0: -LIMITES.sala + m, x1: LIMITES.sala - m, z0: LIMITES.piso.zAtras, z1: LIMITES.sala - m };
    }

    // Colgado de la pared o en el aire: se queda delante de la pared, dentro de su ancho
    const mitad = ESCENARIO.anchoPared / 2;
    const base = ESCENARIO.plataforma.spawnZ;
    return { x0: -mitad, x1: mitad, z0: base + LIMITES.aire.zAtras, z1: base + LIMITES.aire.zAdelante };
  },

  tick() {
    if (!this.camara) this.camara = document.querySelector('#camara');
    if (!this.camara) return;
    // Mientras la tirolesa lleva al jugador, la ruta ya está dentro de la zona: no se corrige
    if (this.el.sceneEl.tirolesaActiva) return;

    const posRig = this.el.object3D.position;
    this.camara.object3D.getWorldPosition(this.posCamara);
    const zona = this.zonaPermitida(posRig);
    const x = acotar(this.posCamara.x, zona.x0, zona.x1);
    const z = acotar(this.posCamara.z, zona.z0, zona.z1);
    posRig.x += x - this.posCamara.x;
    posRig.z += z - this.posCamara.z;
  },
});
