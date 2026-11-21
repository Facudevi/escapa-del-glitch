// Tirolesa: el enchufe del cable USB que hay en lo alto de la torre. Quien se agarra de él se desliza
// solo hasta el segundo checkpoint, al pie del monitor. Va en el enchufe (junto al componente agarre).
//
// El camino es una curva suave y el jugador lo recorre a velocidad constante (TIROLESA.velocidad), sin
// aceleraciones ni sacudidas, porque un movimiento que no controla el jugador es lo que más marea.
// Durante el recorrido no se puede caer ni lo alcanza la niebla.
//
// Eventos sobre la escena: 'tirolesa-inicio' y 'tirolesa-fin'.
import { ESCENARIO, TIROLESA } from '../config.js';
import { deslizar } from '../sonidos.js';

AFRAME.registerComponent('tirolesa', {
  init() {
    this.deslizando = false;
    this.ruta = null;
    this.largo = 0;
    this.recorrido = 0;
    this.el.addEventListener('agarrado', () => this.comenzar());
  },

  comenzar() {
    const escena = this.el.sceneEl;
    const datos = escena.escalada;
    if (this.deslizando || escena.juegoTerminado || !datos) return;

    const rig = document.querySelector('#rig');
    const checkpoint = datos.checkpoints[1];
    const zCheckpoint = ESCENARIO.z + ESCENARIO.profundidadPared / 2 + ESCENARIO.checkpoint.profundidad / 2;
    const inicio = rig.object3D.position.clone();
    const fin = new THREE.Vector3(0, checkpoint.y, zCheckpoint);
    const control = inicio.clone().lerp(fin, 0.5).add(new THREE.Vector3(0, TIROLESA.alturaArco, 0));
    this.ruta = new THREE.QuadraticBezierCurve3(inicio, control, fin);
    this.largo = this.ruta.getLength();
    this.recorrido = 0;

    // Suelta las manos del enchufe: el recorrido lo hace solo
    const climb = rig.components.climb;
    Object.keys(climb.sujetas).forEach((mano) => {
      if (climb.sujetas[mano].agarre === this.el) climb.soltar(mano);
    });
    // No se puede caer mientras dura el recorrido
    rig.components.caida.protegidoHasta = performance.now() + (this.largo / TIROLESA.velocidad) * 1000 + TIROLESA.margenProteccion;

    deslizar();
    this.deslizando = true;
    escena.emit('tirolesa-inicio', {}, false);
  },

  tick(tiempo, dt) {
    if (!this.deslizando) return;
    this.recorrido += TIROLESA.velocidad * (Math.min(dt, 100) / 1000);
    const avance = Math.min(this.recorrido / this.largo, 1);
    document.querySelector('#rig').object3D.position.copy(this.ruta.getPointAt(avance)); // por longitud de arco: velocidad constante
    if (avance >= 1) {
      this.deslizando = false;
      this.el.sceneEl.emit('tirolesa-fin', {}, false);
    }
  },
});
