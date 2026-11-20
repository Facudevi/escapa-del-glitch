// Escalada: mientras una mano aprieta el grip cerca de un agarre queda "pegada" a él, y el
// movimiento de esa mano se aplica al rig en sentido contrario (bajar el brazo = subir).
// Va en el rig del jugador, que contiene las manos (entidades con mano-guante).
//
// Eventos que escucha (burbujean desde la mano): 'mano-agarra' y 'mano-suelta'.
// Eventos que emite sobre la mano: 'agarre-tomado' y 'agarre-soltado' (detalle: { agarre }).
import { JUGADOR, VIBRACION } from '../config.js';

AFRAME.registerComponent('climb', {
  init() {
    this.sujetas = {}; // por mano: { mano, agarre, previa }
    this.delta = new THREE.Vector3();
    this.tmp = new THREE.Vector3();
    this.caja = new THREE.Box3();

    this.el.addEventListener('mano-agarra', (e) => this.alAgarrar(e));
    this.el.addEventListener('mano-suelta', (e) => this.soltar(e.detail.mano));
  },

  // Agarre más cercano a la mano (dentro del radio de agarre) o null
  agarreCercano(posicionMano) {
    let mejor = null;
    let mejorDistancia = JUGADOR.radioAgarre;
    this.el.sceneEl.querySelectorAll('.agarre').forEach((agarre) => {
      this.caja.setFromObject(agarre.object3D);
      const distancia = this.caja.distanceToPoint(posicionMano);
      if (distancia <= mejorDistancia) {
        mejor = agarre;
        mejorDistancia = distancia;
      }
    });
    return mejor;
  },

  alAgarrar(e) {
    const nombre = e.detail.mano;
    const mano = e.target;
    if (this.sujetas[nombre]) return;

    // Sin energía en esa mano no se puede agarrar (si el rig tiene el componente energia)
    const energia = this.el.components.energia;
    if (energia && !energia.puedeAgarrar(nombre)) return;

    mano.object3D.getWorldPosition(this.tmp);
    const agarre = this.agarreCercano(this.tmp);
    if (!agarre) return; // apretó el grip lejos de cualquier agarre: no pasa nada

    this.sujetas[nombre] = { mano, agarre, previa: mano.object3D.position.clone() };
    this.vibrar(mano);
    mano.emit('agarre-tomado', { agarre }, false);
  },

  // Suelta la mano indicada (por el jugador o por otro componente, como energia)
  soltar(nombre) {
    const sujeta = this.sujetas[nombre];
    if (!sujeta) return;
    delete this.sujetas[nombre];
    sujeta.mano.emit('agarre-soltado', { agarre: sujeta.agarre }, false);
  },

  vibrar(mano) {
    try {
      const control = mano.components['tracked-controls'];
      const actuador = control && control.controller && control.controller.gamepad
        && control.controller.gamepad.hapticActuators
        && control.controller.gamepad.hapticActuators[0];
      if (actuador) actuador.pulse(VIBRACION.fuerza, VIBRACION.duracion);
    } catch (error) {
      // sin vibración disponible: no es grave
    }
  },

  tick() {
    const manos = Object.values(this.sujetas);
    if (!manos.length) return;

    // Cuánto se movió cada mano respecto del rig desde el cuadro anterior (promedio si hay dos)
    this.delta.set(0, 0, 0);
    manos.forEach((sujeta) => {
      const actual = sujeta.mano.object3D.position;
      this.delta.add(this.tmp.copy(actual).sub(sujeta.previa));
      sujeta.previa.copy(actual);
    });
    this.delta.divideScalar(manos.length);

    // El cuerpo se mueve al revés que la mano, para que la mano quede fija en el agarre
    this.delta.applyQuaternion(this.el.object3D.quaternion);
    const posicion = this.el.object3D.position;
    posicion.sub(this.delta);
    if (posicion.y < 0) posicion.y = 0; // nunca por debajo del piso
  },
});
