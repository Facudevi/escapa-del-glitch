// Guante de una mano: una esfera que sigue al control. Va en la entidad con meta-touch-controls.
//
// - Al apretar o soltar el grip emite 'mano-agarra' / 'mano-suelta' (burbujean hasta el rig),
//   para que los demás componentes no dependan de los nombres de los eventos del control.
// - El guante se pone ámbar solo cuando la mano realmente tiene un agarre ('agarre-tomado'
//   y 'agarre-soltado' los emite el componente climb).
import { COLORES, JUGADOR } from '../config.js';

AFRAME.registerComponent('mano-guante', {
  schema: { mano: { type: 'string', default: 'izquierda' } },

  init() {
    // Esfera del guante
    this.guante = document.createElement('a-sphere');
    this.guante.setAttribute('radius', JUGADOR.radioGuante);
    this.guante.setAttribute('color', COLORES.guante);
    this.guante.setAttribute('material', 'roughness: 0.9; metalness: 0');
    this.el.appendChild(this.guante);

    this.el.addEventListener('gripdown', () => this.el.emit('mano-agarra', { mano: this.data.mano }));
    this.el.addEventListener('gripup', () => this.el.emit('mano-suelta', { mano: this.data.mano }));

    this.el.addEventListener('agarre-tomado', () => this.pintar(true));
    this.el.addEventListener('agarre-soltado', () => this.pintar(false));
  },

  pintar(agarrando) {
    this.guante.setAttribute('color', agarrando ? COLORES.guanteAgarrado : COLORES.guante);
  },
});
