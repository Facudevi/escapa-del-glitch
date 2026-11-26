// El Glitch: frases cortas, con humor y sin burlarse, en un cartel que aparece en momentos puntuales.
// Va en la <a-scene>. No le quita progreso al jugador ni le suma dificultad: solo comenta.
//
// Momentos (frases en GLITCH.frases de config.js):
//   caida          al caerse («Ese agarre no te quería»)
//   niebla         cuando la niebla lo alcanza
//   comido         cuando se come un fragmento («Ñam, este te lo escondo arriba»)
//   quieto         si el jugador se queda quieto mucho tiempo («¿Te tomaste un cooldown?»)
//   pasado         si sube por encima del fragmento de su pared sin juntarlo
//   nuevoTramo     al llegar a un piso que no es el último: recuerda buscar el fragmento del tramo siguiente
//   sinFragmentos  si llega arriba sin los tres fragmentos («¿No te olvidaste de algo?»)
//   faltan         si golpea el RESET apagado
//   reset          al romper el RESET («Bueno, ganaste. Nos vemos afuera»)
//
// Cada frase tiene un tiempo de espera para no repetirse seguido. Si llega una frase mientras se muestra
// otra, espera su turno (hasta GLITCH.maxEnCola). El cartel flota delante de la cabeza, un poco más arriba
// de la mirada, con un leve retraso al seguirla (como una interfaz que tiene peso), se dibuja por encima de
// todo para que siempre se lea y suena un pitido corto y suave.
import { FRAGMENTO, GLITCH } from '../config.js';
import { blipGlitch } from '../sonidos.js';
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
    this.cola = []; // frases que esperan su turno
    this.ultimaNiebla = -Infinity;
    this.ultimoMovimiento = performance.now();
    this.posicionPrevia = new THREE.Vector3();
    this.camara = null;
    this.rig = null;
    this.posCamara = new THREE.Vector3();
    this.direccion = new THREE.Vector3();
    this.objetivo = new THREE.Vector3();

    const escena = this.el;
    escena.addEventListener('fragmento-comido', () => this.decir('comido'));
    escena.addEventListener('fragmento-salteado', () => this.decir('salteado'));
    escena.addEventListener('fragmento-pasado', () => this.decir('pasado'));
    escena.addEventListener('niebla-alcanza', () => {
      this.ultimaNiebla = performance.now();
      this.decir('niebla');
    });
    escena.addEventListener('caida', () => {
      // Si la niebla fue la causa, ya habló por ella
      if (performance.now() - this.ultimaNiebla > 500) this.decir('caida');
    });
    escena.addEventListener('checkpoint-alcanzado', (e) => {
      const datos = escena.escalada;
      const fragmentos = escena.components.fragmentos;
      if (datos && e.detail.orden === datos.checkpoints.length && fragmentos && fragmentos.recogidos < FRAGMENTO.total) {
        this.decir('sinFragmentos');
      } else if (datos && e.detail.orden < datos.checkpoints.length) {
        this.decir('nuevoTramo'); // recuerda buscar el fragmento del tramo que tiene adelante
      }
    });
    // Moverse, agarrarse o escanear cuenta como no estar quieto
    ['mano-agarra', 'mano-suelta', 'escaneo'].forEach((n) => escena.addEventListener(n, () => this.alMoverse()));
  },

  alMoverse() {
    this.ultimoMovimiento = performance.now();
  },

  // Dice una frase de la lista `clave` (ver GLITCH.frases), si pasó su tiempo de espera
  decir(clave) {
    const frases = GLITCH.frases[clave];
    if (!frases || !frases.length) return false;
    const ahora = performance.now();
    const espera = (GLITCH.esperaPorFrase[clave] ?? GLITCH.espera) * 1000;
    if (ahora - (this.ultimaVez[clave] ?? -Infinity) < espera) return false;

    const indice = (this.indices[clave] || 0) % frases.length;
    this.indices[clave] = indice + 1;
    this.ultimaVez[clave] = ahora;
    this.mostrarOEncolar(clave, frases[indice]);
    return true;
  },

  // Muestra la frase ya, o la deja esperando si hay otra en pantalla
  mostrarOEncolar(clave, texto) {
    if (this.cartel.object3D.visible && this.hasta > performance.now()) {
      if (this.cola.length < GLITCH.maxEnCola && !this.cola.some((c) => c.clave === clave)) {
        this.cola.push({ clave, texto });
      }
      return;
    }
    this.mostrar(texto);
  },

  // Aviso del sistema (por ejemplo, sonido silenciado): se muestra enseguida y no tiene tiempo de espera
  mostrarAviso(texto) {
    this.cola = [];
    this.mostrar(texto);
  },

  mostrar(texto) {
    this.hasta = performance.now() + GLITCH.duracion * 1000;
    this.cartel.setAttribute('cartel', 'texto', texto);
    this.cartel.object3D.visible = true;
    this.cartel.components.cartel.material.opacity = 1;
    this.colocar(true);
    blipGlitch();
  },

  // Pone el cartel delante de la cabeza (de golpe o siguiéndola con retraso)
  colocar(inmediato) {
    if (!this.camara) this.camara = document.querySelector('#camara');
    if (!this.camara) return null;
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

  // Vuelve a empezar: sin frase en pantalla ni cola, y sin tiempos de espera
  reiniciar() {
    this.ultimaVez = {};
    this.indices = {};
    this.cola = [];
    this.hasta = 0;
    this.ultimaNiebla = -Infinity;
    this.ultimoMovimiento = performance.now();
    this.cartel.object3D.visible = false;
  },

  // Si el jugador lleva mucho tiempo sin moverse (y ya empezó a jugar), el Glitch comenta
  vigilarQuietud(ahora) {
    if (this.el.juegoTerminado) return;
    const cronometro = this.el.components.cronometro;
    if (!cronometro || cronometro.inicio === null) return;
    if (!this.rig) this.rig = document.querySelector('#rig');
    const posicion = this.rig.object3D.position;
    if (posicion.distanceTo(this.posicionPrevia) > 0.03) {
      this.posicionPrevia.copy(posicion);
      this.ultimoMovimiento = ahora;
    }
    if (ahora - this.ultimoMovimiento > GLITCH.quietoSegundos * 1000) {
      this.ultimoMovimiento = ahora; // vuelve a contar desde cero
      this.decir('quieto');
    }
  },

  tick(tiempo, dt) {
    const ahora = performance.now();
    this.vigilarQuietud(ahora);

    if (!this.cartel.object3D.visible) return;
    const segundos = Math.min(dt, 100) / 1000;

    // Se desvanece en el último medio segundo; después se esconde o pasa la siguiente frase
    const falta = this.hasta - ahora;
    if (falta <= 0) {
      const siguiente = this.cola.shift();
      if (siguiente) this.mostrar(siguiente.texto);
      else this.cartel.object3D.visible = false;
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
