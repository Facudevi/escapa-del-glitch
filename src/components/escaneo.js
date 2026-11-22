// Pulso de escaneo: una onda suave recorre la pared y marca por un segundo dónde está el fragmento
// del tramo en el que está el jugador. Después hay que esperar 10 segundos. Va en la <a-scene>.
//
// Se pide de cuatro formas: tocando la pulsera con la otra mano (lo detecta pulsera), con el botón A o X
// del control, con la tecla E en modo escritorio, o con el evento 'escaneo-pedido'.
//
// Emite 'escaneo' { tramo, marcado } sobre la escena. La pulsera lee fraccionEspera() para su barra.
import { COLORES, ESCANEO } from '../config.js';
import { frenteTramo } from '../utilidades.js';
import { ondaEscaneo } from '../sonidos.js';

AFRAME.registerComponent('escaneo', {
  init() {
    this.listoEn = 0; // marca de performance.now() desde la que se puede volver a usar
    this.ondaDesde = -1;
    this.posCamara = new THREE.Vector3();

    // Onda: un aro fino que se agranda sobre la pared mientras se desvanece
    this.onda = new THREE.Mesh(
      new THREE.RingGeometry(0.93, 1, 64),
      new THREE.MeshBasicMaterial({
        color: COLORES.onda,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      })
    );
    this.onda.visible = false;
    this.el.object3D.add(this.onda);

    this.el.addEventListener('escaneo-pedido', () => this.pedir());
    this.el.addEventListener('abuttondown', () => this.pedir());
    this.el.addEventListener('xbuttondown', () => this.pedir());
    this.alTeclear = (e) => {
      if (e.code === ESCANEO.tecla && !e.repeat) this.pedir();
    };
    window.addEventListener('keydown', this.alTeclear);
  },

  // 0 recién usado, 1 listo para usar
  fraccionEspera() {
    const falta = this.listoEn - performance.now();
    return falta <= 0 ? 1 : 1 - falta / (ESCANEO.espera * 1000);
  },

  // Tramo en el que está el jugador, por su altura
  tramoActual() {
    const datos = this.el.escalada;
    if (!datos) return 0;
    const y = document.querySelector('#rig').object3D.position.y;
    const tramo = datos.tramos.find((t) => y < t.y1 - 0.05);
    return tramo ? tramo.indice : datos.tramos.length - 1;
  },

  pedir() {
    const ahora = performance.now();
    if (ahora < this.listoEn) return false; // todavía en espera
    this.listoEn = ahora + ESCANEO.espera * 1000;

    const tramo = this.tramoActual();
    const fragmentos = this.el.components.fragmentos;
    const marcado = fragmentos ? fragmentos.marcar(tramo, ESCANEO.duracionMarca * 1000) : false;

    // La onda sale de donde está el jugador, sobre la pared
    const camara = document.querySelector('#camara');
    camara.object3D.getWorldPosition(this.posCamara);
    this.onda.position.set(this.posCamara.x, this.posCamara.y, frenteTramo(tramo) + 0.08);
    this.ondaDesde = ahora;
    ondaEscaneo();
    this.el.emit('escaneo', { tramo, marcado }, false);
    return true;
  },

  tick() {
    if (this.ondaDesde < 0) return;
    const avance = (performance.now() - this.ondaDesde) / (ESCANEO.duracionOnda * 1000);
    if (avance >= 1) {
      this.onda.visible = false;
      this.ondaDesde = -1;
      return;
    }
    this.onda.visible = true;
    this.onda.scale.setScalar(Math.max(avance * ESCANEO.radioOnda, 0.01));
    this.onda.material.opacity = 0.55 * (1 - avance);
  },

  remove() {
    window.removeEventListener('keydown', this.alTeclear);
    this.el.object3D.remove(this.onda);
  },
});
