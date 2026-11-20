// El Glitch: frases cortas, con humor y sin burlarse, en un cartel que aparece en momentos puntuales.
// Va en la <a-scene>. Por ahora dice una frase cuando se come un fragmento; el resto de las frases
// (caída, quedarse quieto, llegar sin fragmentos, romper el RESET) llegan en la etapa 9.
//
// El cartel flota delante de la cabeza, un poco más arriba de la mirada, con un leve retraso al seguirla
// (como una interfaz que tiene peso) y se dibuja por encima de todo para que siempre se lea.
// Cada frase tiene un tiempo de espera para no repetirse seguido.
import { GLITCH } from '../config.js';
import { crear } from '../utilidades.js';

AFRAME.registerComponent('glitch', {
  init() {
    this.cartel = crear(this.el, 'a-entity', {
      cartel: 'texto: ...; ancho: 1.5; alto: 0.45; siempreVisible: true',
    });
    this.cartel.object3D.visible = false;
    this.hasta = 0; // marca de performance.now() en que se va el cartel
    this.ultimaVez = {}; // por clave: cuándo se dijo por última vez
    this.indices = {}; // por clave: qué frase sigue
    this.camara = null;
    this.posCamara = new THREE.Vector3();
    this.direccion = new THREE.Vector3();
    this.objetivo = new THREE.Vector3();

    this.el.addEventListener('fragmento-comido', () => this.decir('comido'));
  },

  // Dice una frase de la lista `clave` (ver GLITCH.frases), si pasó el tiempo de espera
  decir(clave) {
    const frases = GLITCH.frases[clave];
    if (!frases || !frases.length) return false;
    const ahora = performance.now();
    if (ahora - (this.ultimaVez[clave] ?? -Infinity) < GLITCH.espera * 1000) return false;

    const indice = (this.indices[clave] || 0) % frases.length;
    this.indices[clave] = indice + 1;
    this.ultimaVez[clave] = ahora;
    this.hasta = ahora + GLITCH.duracion * 1000;

    this.cartel.setAttribute('cartel', 'texto', frases[indice]);
    this.cartel.object3D.visible = true;
    this.cartel.components.cartel.material.opacity = 1;
    this.colocar(true);
    return true;
  },

  // Pone el cartel delante de la cabeza (de golpe o siguiéndola con retraso)
  colocar(inmediato) {
    if (!this.camara) this.camara = document.querySelector('#camara');
    if (!this.camara) return;
    this.camara.object3D.getWorldPosition(this.posCamara);
    this.camara.object3D.getWorldDirection(this.direccion);
    this.direccion.negate(); // getWorldDirection apunta hacia atrás en la cámara
    this.direccion.y = 0;
    if (this.direccion.lengthSq() < 1e-4) this.direccion.set(0, 0, -1);
    this.direccion.normalize();

    this.objetivo
      .copy(this.posCamara)
      .addScaledVector(this.direccion, GLITCH.distancia)
      .setY(this.posCamara.y + GLITCH.alturaExtra);
    if (inmediato) this.cartel.object3D.position.copy(this.objetivo);
    return this.objetivo;
  },

  tick(tiempo, dt) {
    if (!this.cartel.object3D.visible) return;
    const ahora = performance.now();
    const segundos = Math.min(dt, 100) / 1000;

    // Se desvanece en el último medio segundo y después se esconde
    const falta = this.hasta - ahora;
    if (falta <= 0) {
      this.cartel.object3D.visible = false;
      return;
    }
    this.cartel.components.cartel.material.opacity = Math.min(1, falta / 500);

    // Sigue a la cabeza con un leve retraso y mira hacia ella
    const objetivo = this.colocar(false);
    if (objetivo) {
      this.cartel.object3D.position.lerp(objetivo, Math.min(1, GLITCH.suavizado * segundos));
      this.cartel.object3D.lookAt(this.posCamara);
    }
  },
});
