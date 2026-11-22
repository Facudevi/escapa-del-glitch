// Ascenso automático hasta un piso. Va en dos tipos de agarre, junto al componente agarre:
//   - el REBORDE de arriba de cada pared (tipo 'borde'): quien se agarra de él sube solo hasta el piso del
//     escalón, como si se impulsara con los brazos, y queda parado de frente a la pared siguiente;
//   - el ENCHUFE de la tirolesa (tipo 'tirolesa'): un atajo hasta el piso del segundo escalón.
//
// El camino es una curva suave y el jugador lo recorre a velocidad constante, sin aceleraciones ni
// sacudidas, porque un movimiento que no controla el jugador es lo que más marea. Mientras dura no se puede
// caer, no lo alcanza la niebla y los límites no lo corrigen (escena.rigAutomatico).
//
// Eventos sobre la escena: 'ascenso-inicio' y 'ascenso-fin' (detalle: { tipo, orden }).
import { ASCENSO, ESCENARIO, LIMITES, TIROLESA } from '../config.js';
import { deslizar } from '../sonidos.js';

AFRAME.registerComponent('ascenso', {
  schema: {
    tipo: { type: 'string', default: 'borde' }, // 'borde' o 'tirolesa'
    orden: { type: 'int', default: 1 }, // checkpoint al que lleva (1 = piso del teclado)
    xDestino: { type: 'number', default: 9999 }, // x donde llega (por defecto, la misma donde estaba)
  },

  init() {
    this.activo = false;
    this.ruta = null;
    this.largo = 0;
    this.recorrido = 0;
    this.velocidad = ASCENSO.velocidad;
    this.el.addEventListener('agarrado', () => this.comenzar());
  },

  comenzar() {
    const escena = this.el.sceneEl;
    const datos = escena.escalada;
    if (this.activo || escena.juegoTerminado || !datos) return;

    const rig = document.querySelector('#rig');
    const checkpoint = datos.checkpoints[this.data.orden - 1];
    const inicio = rig.object3D.position.clone();
    const limiteX = ESCENARIO.anchoPared / 2 - LIMITES.margen;
    const x = this.data.xDestino === 9999 ? Math.max(-limiteX, Math.min(limiteX, inicio.x)) : this.data.xDestino;
    const fin = new THREE.Vector3(x, checkpoint.y, checkpoint.spawnZ);

    if (this.data.tipo === 'tirolesa') {
      this.velocidad = TIROLESA.velocidad;
      const control = inicio.clone().lerp(fin, 0.5).add(new THREE.Vector3(0, TIROLESA.alturaArco, 0));
      this.ruta = new THREE.QuadraticBezierCurve3(inicio, control, fin);
    } else {
      // Primero sube por delante del reborde y después avanza hacia atrás, hasta quedar parado en el piso
      this.velocidad = ASCENSO.velocidad;
      const control = new THREE.Vector3((inicio.x + fin.x) / 2, fin.y + ASCENSO.alturaPorEncima, inicio.z);
      this.ruta = new THREE.QuadraticBezierCurve3(inicio, control, fin);
    }
    this.largo = this.ruta.getLength();
    this.recorrido = 0;

    // Suelta todas las manos: el recorrido lo hace solo
    const climb = rig.components.climb;
    Object.keys(climb.sujetas).forEach((mano) => climb.soltar(mano));
    // No se puede caer mientras dura el recorrido
    rig.components.caida.protegidoHasta = performance.now() + (this.largo / this.velocidad) * 1000 + ASCENSO.margenProteccion;

    if (this.data.tipo === 'tirolesa') deslizar();
    this.activo = true;
    escena.rigAutomatico = true;
    escena.emit('ascenso-inicio', { tipo: this.data.tipo, orden: this.data.orden }, false);
  },

  tick(tiempo, dt) {
    if (!this.activo) return;
    this.recorrido += this.velocidad * (Math.min(dt, 100) / 1000);
    const avance = Math.min(this.recorrido / this.largo, 1);
    document.querySelector('#rig').object3D.position.copy(this.ruta.getPointAt(avance)); // por longitud de arco: velocidad constante
    if (avance >= 1) {
      this.activo = false;
      this.el.sceneEl.rigAutomatico = false;
      this.el.sceneEl.emit('ascenso-fin', { tipo: this.data.tipo, orden: this.data.orden }, false);
    }
  },
});
