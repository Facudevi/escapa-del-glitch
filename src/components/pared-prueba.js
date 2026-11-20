// Pared de prueba: muestra un ejemplo de cada tipo de agarre (tecla firme, tecla que se hunde, lata
// que se rompe, bloque intermitente y panel que gira), los carteles que los explican y dos
// checkpoints (el piso de inicio y una plataforma al costado).
// Sirve para probar la escalada; se reemplaza por los tramos reales en la etapa 6.
import { COLORES, INTERMITENTE, LATA, PANEL, PARED_PRUEBA } from '../config.js';
import { crear } from '../utilidades.js';

AFRAME.registerComponent('pared-prueba', {
  init() {
    const c = PARED_PRUEBA;
    const escena = this.el;
    const T = c.tecla;
    const frenteDePared = c.z + c.profundidad / 2;
    // Los agarres sobresalen de la pared: el centro queda a media profundidad del frente, menos un pequeño empotrado
    const zAgarre = frenteDePared + T.profundidad / 2 - 0.05;

    // Pared de fondo
    crear(escena, 'a-box', {
      position: `0 ${c.alto / 2} ${c.z}`,
      width: c.ancho,
      height: c.alto,
      depth: c.profundidad,
      color: COLORES.paredEscalada,
      material: 'roughness: 1; metalness: 0',
    });

    // Un agarre de cada tipo, cada uno con su color y su forma
    c.agarres.forEach((a) => {
      const posicion = `${a.x} ${a.y} ${zAgarre}`;
      const material = 'roughness: 0.8; metalness: 0';
      if (a.tipo === 'hunde') {
        crear(escena, 'a-box', {
          agarre: 'tipo: hunde',
          'tecla-hunde': '',
          position: posicion,
          width: T.ancho,
          height: T.alto,
          depth: T.profundidad,
          color: COLORES.lavandaHunde,
          material,
        });
      } else if (a.tipo === 'lata') {
        crear(escena, 'a-cylinder', {
          agarre: 'tipo: lata',
          'lata-rompe': '',
          position: posicion,
          radius: LATA.radio,
          height: LATA.alto,
          color: COLORES.ambar,
          material,
        });
      } else if (a.tipo === 'intermitente') {
        crear(escena, 'a-box', {
          agarre: 'tipo: intermitente',
          'bloque-intermitente': `fase: ${a.fase || 0}`,
          position: posicion,
          width: INTERMITENTE.ancho,
          height: INTERMITENTE.alto,
          depth: INTERMITENTE.profundidad,
          color: COLORES.celeste,
          material,
        });
      } else {
        crear(escena, 'a-box', {
          agarre: 'tipo: firme',
          position: posicion,
          width: T.ancho,
          height: T.alto,
          depth: T.profundidad,
          color: COLORES.lavanda,
          material,
        });
      }
    });

    // Panel que gira, con dos teclas firmes en la cara frontal
    const p = c.panel;
    const panel = crear(escena, 'a-box', {
      'panel-gira': `fase: ${p.fase}`,
      position: `${p.x} ${p.y} ${PANEL.z}`,
      width: PANEL.ancho,
      height: PANEL.alto,
      depth: PANEL.grosor,
      color: COLORES.panel,
      material: 'roughness: 0.9; metalness: 0',
    });
    [-p.separacionAgarres, p.separacionAgarres].forEach((dx) => {
      crear(panel, 'a-box', {
        agarre: 'tipo: firme',
        position: `${dx} 0 ${PANEL.grosor / 2 + T.profundidad / 2 - 0.05}`,
        width: T.ancho,
        height: T.alto,
        depth: T.profundidad,
        color: COLORES.lavanda,
        material: 'roughness: 0.8; metalness: 0',
      });
    });

    // Checkpoints: la zona del piso de inicio (sin plataforma visible) y una plataforma al costado
    crear(escena, 'a-entity', {
      checkpoint: 'orden: 0; ancho: 6; profundidad: 6; dibujar: false',
      position: '0 0 0',
    });
    const cp = c.checkpoint;
    crear(escena, 'a-entity', {
      checkpoint: `orden: 1; ancho: ${cp.ancho}; profundidad: ${cp.profundidad}`,
      position: `${cp.x} ${cp.altura} ${frenteDePared + cp.profundidad / 2}`,
    });

    // Carteles: los dos de inicio y uno de una línea la primera vez que aparece cada tipo
    const zCartel = frenteDePared + 0.02;
    const carteles = [
      { x: -1.35, y: 1.5, texto: 'Agarrá con el botón lateral' },
      { x: 1.35, y: 1.5, texto: 'Bajá el brazo para subir' },
      { x: -1.6, y: 2.2, texto: 'Esta tecla se hunde: seguí subiendo' },
      { x: -1.6, y: 3.2, texto: 'La lata se rompe a los 3 segundos' },
      { x: -1.6, y: 4.2, texto: 'El bloque se apaga: mirá el anillo' },
      { x: 1.7, y: p.y, texto: 'El panel gira: agarrate cuando esté de frente' },
    ];
    carteles.forEach(({ x, y, texto }) => {
      crear(escena, 'a-entity', {
        cartel: `texto: ${texto}; ancho: 1.1; alto: 0.5`,
        position: `${x} ${y} ${zCartel}`,
      });
    });
  },
});
