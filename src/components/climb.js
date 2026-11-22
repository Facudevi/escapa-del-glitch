// Escalada: mientras una mano aprieta el grip cerca de un agarre queda "pegada" a él, y el
// movimiento de esa mano se aplica al rig en sentido contrario (bajar el brazo = subir).
// Si el agarre se mueve (tecla que se hunde, panel que gira), el jugador va con él.
// Va en el rig del jugador, que contiene las manos (entidades con mano-guante).
//
// Eventos que escucha (burbujean desde la mano): 'mano-agarra' y 'mano-suelta'.
// Eventos que emite sobre la mano: 'agarre-tomado' y 'agarre-soltado' (detalle: { agarre }).
// Eventos que emite sobre el agarre: 'agarrado' y 'soltado' (detalle: { mano }),
// y 'resaltar' / 'apagar' cuando una mano sin agarrar lo tiene al alcance o lo deja.
import { JUGADOR, VIBRACION } from '../config.js';
import { clic } from '../sonidos.js';

AFRAME.registerComponent('climb', {
  init() {
    this.sujetas = {}; // por mano: { mano, agarre, previa, agarrePrevio }
    this.resaltados = {}; // por mano: agarre que tiene resaltado (mano sin agarrar)
    this.manosLibres = null; // entidades de las manos, por nombre (se buscan al empezar)

    this.delta = new THREE.Vector3();
    this.arrastre = new THREE.Vector3();
    this.tmp = new THREE.Vector3();
    this.tmp2 = new THREE.Vector3();
    this.caja = new THREE.Box3();

    this.el.addEventListener('mano-agarra', (e) => this.alAgarrar(e));
    this.el.addEventListener('mano-suelta', (e) => this.soltar(e.detail.mano));
  },

  // Agarre más cercano a la mano (dentro del radio de agarre) o null
  agarreCercano(posicionMano) {
    let mejor = null;
    let mejorDistancia = Infinity;
    this.el.sceneEl.querySelectorAll('.agarre').forEach((agarre) => {
      // Se mide contra la malla del agarre (sin carteles ni anillos que pueda tener alrededor)
      const malla = agarre.getObject3D('mesh') || agarre.object3D;
      this.caja.setFromObject(malla);
      const distancia = this.caja.distanceToPoint(posicionMano);
      // Algunos agarres (como el enchufe de la tirolesa) piden tocarlos más justo
      const info = agarre.components.agarre;
      const radio = info ? JUGADOR.radioAgarre * info.data.tolerancia : JUGADOR.radioAgarre;
      if (distancia <= radio && distancia <= mejorDistancia) {
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

    this.apagarResaltado(nombre);
    this.sujetas[nombre] = {
      mano,
      agarre,
      previa: mano.object3D.position.clone(),
      agarrePrevio: agarre.object3D.getWorldPosition(new THREE.Vector3()),
    };
    this.vibrar(mano, VIBRACION.fuerza, VIBRACION.duracion);
    clic();
    mano.emit('agarre-tomado', { agarre }, false);
    agarre.emit('agarrado', { mano: nombre }, false);
  },

  // Suelta la mano indicada (por el jugador o por otro componente, como energia o un agarre que se apaga)
  soltar(nombre) {
    const sujeta = this.sujetas[nombre];
    if (!sujeta) return;
    delete this.sujetas[nombre];
    sujeta.mano.emit('agarre-soltado', { agarre: sujeta.agarre }, false);
    sujeta.agarre.emit('soltado', { mano: nombre }, false);
  },

  vibrar(mano, fuerza, duracion) {
    try {
      const control = mano.components['tracked-controls'];
      const actuador = control && control.controller && control.controller.gamepad
        && control.controller.gamepad.hapticActuators
        && control.controller.gamepad.hapticActuators[0];
      if (actuador) actuador.pulse(fuerza, duracion);
    } catch (error) {
      // sin vibración disponible: no es grave
    }
  },

  // Hace vibrar los controles de las manos que sostienen ese agarre (por ejemplo, el crujido de la lata)
  vibrarAgarre(agarre, fuerza, duracion) {
    Object.values(this.sujetas).forEach((sujeta) => {
      if (sujeta.agarre === agarre) this.vibrar(sujeta.mano, fuerza, duracion);
    });
  },

  apagarResaltado(nombre) {
    const anterior = this.resaltados[nombre];
    if (!anterior) return;
    delete this.resaltados[nombre];
    anterior.emit('apagar', { mano: nombre }, false);
  },

  // Resalta el agarre que cada mano libre tiene al alcance, para que se vea qué se puede agarrar.
  // Solo en VR: en modo escritorio las manos están quietas en reposo y el resaltado lo da el cursor.
  actualizarResaltados() {
    if (!this.el.sceneEl.is('vr-mode')) {
      Object.keys(this.resaltados).forEach((nombre) => this.apagarResaltado(nombre));
      return;
    }
    if (!this.manosLibres) {
      const manos = Array.from(this.el.querySelectorAll('[mano-guante]'));
      if (manos.length < 2) return;
      this.manosLibres = {};
      manos.forEach((el) => (this.manosLibres[el.components['mano-guante'].data.mano] = el));
    }
    Object.keys(this.manosLibres).forEach((nombre) => {
      let nuevo = null;
      if (!this.sujetas[nombre]) {
        this.manosLibres[nombre].object3D.getWorldPosition(this.tmp2);
        nuevo = this.agarreCercano(this.tmp2);
      }
      const anterior = this.resaltados[nombre] || null;
      if (nuevo === anterior) return;
      this.apagarResaltado(nombre);
      if (nuevo) {
        this.resaltados[nombre] = nuevo;
        nuevo.emit('resaltar', { mano: nombre }, false);
      }
    });
  },

  tick() {
    this.actualizarResaltados();

    const manos = Object.values(this.sujetas);
    if (!manos.length) return;

    // Cuánto se movió cada mano respecto del rig desde el cuadro anterior (promedio si hay dos)
    // y cuánto se movió el agarre en el mundo (si se hunde o gira, el jugador va con él)
    this.delta.set(0, 0, 0);
    this.arrastre.set(0, 0, 0);
    manos.forEach((sujeta) => {
      const actual = sujeta.mano.object3D.position;
      this.delta.add(this.tmp.copy(actual).sub(sujeta.previa));
      sujeta.previa.copy(actual);

      sujeta.agarre.object3D.getWorldPosition(this.tmp2);
      this.arrastre.add(this.tmp.copy(this.tmp2).sub(sujeta.agarrePrevio));
      sujeta.agarrePrevio.copy(this.tmp2);
    });
    this.delta.divideScalar(manos.length);
    this.arrastre.divideScalar(manos.length);

    // El cuerpo se mueve al revés que la mano, para que la mano quede fija en el agarre
    this.delta.applyQuaternion(this.el.object3D.quaternion);
    const posicion = this.el.object3D.position;
    posicion.sub(this.delta);
    posicion.add(this.arrastre);
    if (posicion.y < 0) posicion.y = 0; // nunca por debajo del piso
  },
});
