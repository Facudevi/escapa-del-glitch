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

    // Luces puntuales cálidas repartidas en altura, para que toda la pared quede iluminada
    AMBIENTE.alturasLuz.forEach((altura) => {
      const punto = document.createElement('a-entity');
      punto.setAttribute(
        'light',
        `type: point; color: ${COLORES.luzPunto}; intensity: ${AMBIENTE.intensidadPunto}; distance: 22; decay: 1.5`
      );
      punto.setAttribute('position', `0 ${altura} 2`);
      escena.appendChild(punto);
    });
  },
});
