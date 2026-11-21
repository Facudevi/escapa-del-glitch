// Audio general del juego. Va en la <a-scene>.
//
// - Empieza la música de fondo con el primer gesto del jugador (los navegadores no dejan sonar antes).
// - Permite silenciar y volver a activar todo el sonido (efectos y música): tecla M en modo escritorio,
//   o el botón B o Y del control con casco. Muestra un aviso breve con el estado.
// - Se recuerda la elección (en el navegador) para la próxima visita.
import { MUSICA } from '../config.js';
import { alternarSilencio, iniciarMusica } from '../sonidos.js';

AFRAME.registerComponent('audio-juego', {
  init() {
    this.iniciar = () => iniciarMusica();
    this.gestos = ['mousedown', 'keydown', 'touchstart'];
    this.gestos.forEach((nombre) => window.addEventListener(nombre, this.iniciar));
    this.el.addEventListener('enter-vr', this.iniciar);
    this.el.addEventListener('mano-agarra', this.iniciar);

    this.alTeclear = (e) => {
      if (e.code === MUSICA.teclaSilencio && !e.repeat) this.alternar();
    };
    window.addEventListener('keydown', this.alTeclear);
    this.el.addEventListener('bbuttondown', () => this.alternar());
    this.el.addEventListener('ybuttondown', () => this.alternar());
  },

  alternar() {
    const mudo = alternarSilencio();
    const glitch = this.el.components.glitch;
    if (glitch) glitch.mostrarAviso(mudo ? 'Sonido silenciado' : 'Sonido activado');
    this.el.emit('silencio-cambiado', { mudo }, false);
    return mudo;
  },

  remove() {
    this.gestos.forEach((nombre) => window.removeEventListener(nombre, this.iniciar));
    window.removeEventListener('keydown', this.alTeclear);
  },
});
