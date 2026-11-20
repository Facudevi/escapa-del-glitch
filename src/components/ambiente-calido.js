// Ambiente calmo: penumbra cálida, niebla suave y luces. Va en la <a-scene>.
import { COLORES, AMBIENTE } from '../config.js';

AFRAME.registerComponent('ambiente-calido', {
  init() {
    const escena = this.el;

    escena.setAttribute('background', `color: ${COLORES.fondo}`);
    escena.setAttribute(
      'fog',
      `type: exponential; color: ${COLORES.fondo}; density: ${AMBIENTE.nieblaDensidad}`
    );

    // Luz ambiente cálida y tenue
    const ambiente = document.createElement('a-entity');
    ambiente.setAttribute(
      'light',
      `type: ambient; color: ${COLORES.luzAmbiente}; intensity: ${AMBIENTE.intensidadAmbiente}`
    );
    escena.appendChild(ambiente);

    // Luz puntual cálida sobre la zona de juego
    const punto = document.createElement('a-entity');
    punto.setAttribute(
      'light',
      `type: point; color: ${COLORES.luzPunto}; intensity: ${AMBIENTE.intensidadPunto}; distance: 30; decay: 1.5`
    );
    punto.setAttribute('position', '0 5 1');
    escena.appendChild(punto);
  },
});
