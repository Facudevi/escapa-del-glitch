// Guante de una mano: una esfera que sigue al control y cambia de color al apretar el grip.
// Va en la entidad con meta-touch-controls. Emite 'mano-agarra' / 'mano-suelta' para que
// los demás componentes (climb, energía) no dependan de los nombres de los eventos del control.
import { COLORES, JUGADOR } from '../config.js';

AFRAME.registerComponent('mano-guante', {
  schema: { mano: { type: 'string', default: 'izquierda' } },

  init() {
    this.agarrando = false;

    // Esfera del guante
    this.guante = document.createElement('a-sphere');
    this.guante.setAttribute('radius', JUGADOR.radioGuante);
    this.guante.setAttribute('color', COLORES.guante);
    this.guante.setAttribute('material', 'roughness: 0.9; metalness: 0');
    this.el.appendChild(this.guante);

    this.el.addEventListener('gripdown', () => this.cambiar(true));
    this.el.addEventListener('gripup', () => this.cambiar(false));
  },

  cambiar(agarrando) {
    this.agarrando = agarrando;
    this.guante.setAttribute('color', agarrando ? COLORES.guanteAgarrado : COLORES.guante);
    this.el.emit(agarrando ? 'mano-agarra' : 'mano-suelta', { mano: this.data.mano });
  },
});
