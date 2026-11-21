// Caída y reaparición. Va en el rig del jugador.
//
// Si el jugador está en el aire con las dos manos sueltas más de CAIDA.graciaSoltar ms, cae:
// la vista se funde a negro, reaparece en el último checkpoint alcanzado y la vista vuelve.
// No hay game over ni movimiento de caída (para que no maree).
//
// También se encarga de los checkpoints: detecta cuándo el jugador llega a uno y, si está
// parado sobre uno (o sobre el piso) sin agarrarse, lo apoya a la altura de la plataforma.
//
// Eventos que emite sobre la escena:
//   'checkpoint-alcanzado' { orden }   al llegar a un checkpoint nuevo (la energía se recarga en la etapa 4)
//   'caida'                { orden }   cuando empieza la caída (el Glitch comenta en la etapa 9)
//   'reaparecer'           { orden }   cuando el jugador reaparece
// Escucha 'escritorio-viaje' (modo escritorio) para no dejar caer al jugador mientras viaja.
import { CAIDA } from '../config.js';
import { checkpoints } from './checkpoint.js';

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

AFRAME.registerComponent('caida', {
  init() {
    this.estado = 'normal'; // 'normal' o 'cayendo' (mientras dura el fundido)
    this.sinApoyo = 0; // ms seguidos en el aire sin agarrarse
    this.protegidoHasta = 0; // hasta cuándo no se puede caer (marca de performance.now())
    this.ultimo = null; // último checkpoint alcanzado
    this.posCamara = new THREE.Vector3();
    this.destino = new THREE.Vector3();

    this.el.sceneEl.addEventListener('escritorio-viaje', (e) => {
      this.protegidoHasta = performance.now() + e.detail.duracion + CAIDA.graciaViaje;
    });
  },

  // Checkpoint de mayor orden sobre el que está parado el jugador, o null
  checkpointBajoLosPies(posRig) {
    let mejor = null;
    checkpoints.forEach((cp) => {
      if (cp.sostiene(posRig, this.posCamara) && (!mejor || cp.data.orden > mejor.data.orden)) {
        mejor = cp;
      }
    });
    return mejor;
  },

  tick(tiempo, dt) {
    if (this.estado !== 'normal' || this.el.sceneEl.juegoTerminado) return; // después del final no hay caídas

    const posRig = this.el.object3D.position;
    const camara = document.querySelector('#camara');
    if (!camara) return;
    camara.object3D.getWorldPosition(this.posCamara);

    // Llegar a un checkpoint nuevo lo activa (el progreso no retrocede)
    const bajoLosPies = this.checkpointBajoLosPies(posRig);
    if (bajoLosPies && (!this.ultimo || bajoLosPies.data.orden > this.ultimo.data.orden)) {
      this.ultimo = bajoLosPies;
      this.el.sceneEl.emit('checkpoint-alcanzado', { orden: bajoLosPies.data.orden }, false);
    }

    const agarrando = Object.keys(this.el.components.climb.sujetas).length > 0;
    const enElPiso = posRig.y <= CAIDA.toleranciaPiso;
    const apoyado = enElPiso || !!bajoLosPies;

    if (agarrando || performance.now() < this.protegidoHasta) {
      this.sinApoyo = 0;
      return;
    }

    if (apoyado) {
      // Parado sin agarrarse: queda a la altura de la plataforma
      if (bajoLosPies) posRig.y = bajoLosPies.el.object3D.getWorldPosition(this.destino).y;
      this.sinApoyo = 0;
      return;
    }

    this.sinApoyo += dt;
    if (this.sinApoyo >= CAIDA.graciaSoltar) this.caer();
  },

  async caer() {
    this.estado = 'cayendo';
    this.sinApoyo = 0;
    const escena = this.el.sceneEl;
    const orden = this.ultimo ? this.ultimo.data.orden : 0;
    const fundido = document.querySelector('#camara').components.fundido;
    escena.emit('caida', { orden }, false);

    await fundido.ir(1, CAIDA.fundidoSalida);
    await esperar(CAIDA.pausaNegro);
    this.reaparecer();
    escena.emit('reaparecer', { orden }, false);
    await fundido.ir(0, CAIDA.fundidoEntrada);

    this.protegidoHasta = performance.now() + CAIDA.graciaReaparecer;
    this.estado = 'normal';
  },

  // Pone al jugador sobre el último checkpoint (o en el origen si todavía no tocó ninguno)
  reaparecer() {
    this.el.removeAttribute('animation__viaje'); // corta un viaje de modo escritorio en curso
    if (this.ultimo) this.ultimo.puntoDeReaparicion(this.destino);
    else this.destino.set(0, 0, 0);
    this.el.object3D.position.copy(this.destino);
  },
});
