// Pared de prueba de la etapa 2: una pared con teclas firmes alternadas y los dos carteles
// del tutorial. Sirve para probar la escalada; se reemplaza por los tramos reales en la etapa 6.
import { COLORES, PARED_PRUEBA } from '../config.js';
import { crear } from '../utilidades.js';

AFRAME.registerComponent('pared-prueba', {
  init() {
    const c = PARED_PRUEBA;
    const escena = this.el;

    // Pared de fondo
    crear(escena, 'a-box', {
      position: `0 ${c.alto / 2} ${c.z}`,
      width: c.ancho,
      height: c.alto,
      depth: c.profundidad,
      color: COLORES.paredEscalada,
      material: 'roughness: 1; metalness: 0',
    });

    // Teclas firmes: sobresalen de la pared (su centro queda a z + profundidad/2 + media tecla - 0.05)
    const zTecla = c.z + c.profundidad / 2 + c.tecla.profundidad / 2 - 0.05;
    for (let i = 0; i < c.filas; i++) {
      const lado = i % 2 === 0 ? -1 : 1;
      const desvio = ((i * 7) % 3 - 1) * c.variacionLateral;
      const x = lado * c.separacionLateral + desvio;
      const y = c.alturaPrimera + i * c.pasoVertical;
      crear(escena, 'a-box', {
        class: 'agarre',
        'data-tipo': 'firme',
        position: `${x} ${y} ${zTecla}`,
        width: c.tecla.ancho,
        height: c.tecla.alto,
        depth: c.tecla.profundidad,
        color: COLORES.lavanda,
        material: 'roughness: 0.8; metalness: 0',
      });
    }

    // Los dos carteles de inicio, a los costados de las primeras teclas
    const zCartel = c.z + c.profundidad / 2 + 0.02;
    crear(escena, 'a-entity', {
      cartel: 'texto: Agarrá con el botón lateral; ancho: 0.95; alto: 0.45',
      position: `-1.35 1.5 ${zCartel}`,
    });
    crear(escena, 'a-entity', {
      cartel: 'texto: Bajá el brazo para subir; ancho: 0.95; alto: 0.45',
      position: `1.35 1.5 ${zCartel}`,
    });
  },
});
