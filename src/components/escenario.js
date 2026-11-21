// Escenario completo: el setup gamer gigante que el jugador escala. Va en la <a-scene>.
//
// Arma los tres tramos (teclado, torre de PC y monitor) con sus agarres, paneles y checkpoints, la
// plataforma de arriba con el botón RESET apagado y los carteles. Las posiciones salen del generador
// (src/tramos.js) y las medidas de config.js.
//
// Deja los datos de la escalada en escena.escalada (agarres, paneles, fragmentos, checkpoints) para que
// los usen las etapas siguientes (fragmentos, niebla, tirolesa).
import { COLORES, ESCENARIO, INTERMITENTE, LATA, PANEL } from '../config.js';
import { crearBase, crearMonitor, crearTeclado, crearTorre } from '../decorado.js';
import { generarEscalada } from '../tramos.js';
import { crear } from '../utilidades.js';

const CARTELES_POR_TIPO = {
  hunde: 'Esta tecla se hunde: seguí subiendo',
  lata: 'La lata se rompe a los 3 segundos',
  intermitente: 'El bloque se apaga: mirá el anillo',
  panel: 'El panel gira: agarrate cuando esté de frente',
};

AFRAME.registerComponent('escenario-glitch', {
  init() {
    const E = ESCENARIO;
    const escena = this.el;
    const datos = generarEscalada();
    escena.escalada = datos;

    const [teclado, torre, monitor] = datos.tramos;
    const zFrente = E.z + E.profundidadPared / 2;
    const alturaTope = datos.alturaFinal + E.final.alturaPared + 0.5;

    // Bases y decorado de cada tramo
    const decorado = crear(escena, 'a-entity');
    decorado.setObject3D('base-teclado', crearBase(teclado.y0, teclado.y1, COLORES.paredBase));
    decorado.setObject3D('teclado', crearTeclado(teclado));
    decorado.setObject3D('base-torre', crearBase(torre.y0, torre.y1, COLORES.torre));
    decorado.setObject3D('torre', crearTorre(torre));
    decorado.setObject3D('base-monitor', crearBase(monitor.y0, alturaTope, COLORES.marcoMonitor));
    decorado.setObject3D('monitor', crearMonitor(monitor, alturaTope));

    // Agarres de la ruta y de más
    datos.agarres.forEach((a) => this.crearAgarre(a, zFrente));

    // Paneles que giran, con dos teclas firmes en la cara frontal
    datos.paneles.forEach((p) => this.crearPanel(p));

    // Checkpoints: la zona del piso de inicio y una plataforma al final de cada tramo
    crear(escena, 'a-entity', {
      checkpoint: 'orden: 0; ancho: 6; profundidad: 6; dibujar: false',
      position: '0 0 0',
    });
    datos.checkpoints.forEach((c) => {
      const esFinal = c.orden === datos.checkpoints.length;
      const medidas = esFinal ? E.final : E.checkpoint;
      crear(escena, 'a-entity', {
        checkpoint: `orden: ${c.orden}; ancho: ${medidas.ancho}; profundidad: ${medidas.profundidad}; color: ${
          esFinal ? COLORES.violeta : COLORES.verde
        }`,
        position: `0 ${c.y} ${zFrente + medidas.profundidad / 2}`,
      });
    });

    this.crearReset(datos, zFrente);
    this.crearCarteles(datos, zFrente);
  },

  // Un agarre de cualquier tipo, cada uno con su color y su forma
  crearAgarre(a, zFrente) {
    const T = ESCENARIO.tecla;
    const posicion = `${a.x.toFixed(3)} ${a.y.toFixed(3)} ${(zFrente + T.profundidad / 2 - 0.05).toFixed(3)}`;
    const material = 'roughness: 0.8; metalness: 0';
    const caja = { width: T.ancho, height: T.alto, depth: T.profundidad };
    if (a.tipo === 'hunde') {
      return crear(this.el, 'a-box', {
        agarre: 'tipo: hunde', 'tecla-hunde': '', position: posicion, ...caja, color: COLORES.lavandaHunde, material,
      });
    }
    if (a.tipo === 'lata') {
      return crear(this.el, 'a-cylinder', {
        agarre: 'tipo: lata', 'lata-rompe': '', position: posicion, radius: LATA.radio, height: LATA.alto,
        color: COLORES.ambar, material,
      });
    }
    if (a.tipo === 'intermitente') {
      return crear(this.el, 'a-box', {
        agarre: 'tipo: intermitente',
        'bloque-intermitente': `fase: ${a.fase}`,
        position: posicion,
        width: INTERMITENTE.ancho,
        height: INTERMITENTE.alto,
        depth: INTERMITENTE.profundidad,
        color: COLORES.celeste,
        material,
      });
    }
    return crear(this.el, 'a-box', {
      agarre: 'tipo: firme', position: posicion, ...caja, color: COLORES.lavanda, material,
    });
  },

  crearPanel(p) {
    const T = ESCENARIO.tecla;
    const panel = crear(this.el, 'a-box', {
      'panel-gira': `fase: ${p.fase}`,
      position: `${p.x.toFixed(3)} ${p.y.toFixed(3)} ${PANEL.z}`,
      width: PANEL.ancho,
      height: PANEL.alto,
      depth: PANEL.grosor,
      color: COLORES.panel,
      material: 'roughness: 0.9; metalness: 0',
    });
    const separacion = ESCENARIO.panel.separacionAgarres;
    [-separacion, separacion].forEach((dx) => {
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
  },

  // Botón RESET apagado y los tres huecos de los fragmentos, arriba de todo. Se ven desde el principio
  // como referencia de adónde ir. Las etapas 7 y 8 los encienden.
  crearReset(datos, zFrente) {
    const E = ESCENARIO;
    const y = datos.alturaFinal;
    crear(this.el, 'a-cylinder', {
      id: 'reset-boton',
      class: 'golpeable',
      golpeable: '',
      'reset-boton': '',
      position: `0 ${y + 1.1} ${zFrente + 0.1}`,
      rotation: '90 0 0',
      radius: 0.38,
      height: 0.16,
      color: COLORES.resetApagado,
      material: 'roughness: 0.9; metalness: 0',
    });
    crear(this.el, 'a-entity', {
      cartel: 'texto: RESET; ancho: 0.7; alto: 0.26',
      position: `0 ${y + 1.6} ${zFrente + 0.03}`,
    });
    [-0.7, 0, 0.7].forEach((x, i) => {
      crear(this.el, 'a-cylinder', {
        id: `reset-hueco-${i}`,
        position: `${x} ${y + 2.3} ${zFrente + 0.03}`,
        rotation: '90 0 0',
        radius: 0.24,
        height: 0.05,
        'segments-radial': 6,
        color: COLORES.hueco,
        material: 'roughness: 1; metalness: 0',
      });
    });
    // Cartel grande: se lee desde el piso
    crear(this.el, 'a-entity', {
      cartel: 'texto: Juntá los 3 fragmentos para encender el RESET; ancho: 6; alto: 1.6',
      position: `0 ${y + 3.6} ${zFrente + 0.03}`,
    });
  },

  crearCarteles(datos, zFrente) {
    const z = zFrente + 0.02;
    const poner = (x, y, texto, ancho = 1.1, alto = 0.5) =>
      crear(this.el, 'a-entity', {
        cartel: `texto: ${texto}; ancho: ${ancho}; alto: ${alto}`,
        position: `${x.toFixed(3)} ${y.toFixed(3)} ${z}`,
      });

    // Los dos carteles de inicio
    poner(-1.35, 1.5, 'Agarrá con el botón lateral');
    poner(1.35, 1.5, 'Bajá el brazo para subir');

    // Lugar libre cerca de un punto: sin agarres, paneles ni checkpoints debajo del cartel
    const libre = (x, y, ancho, alto) =>
      Math.abs(x) <= ESCENARIO.anchoPared / 2 - ancho / 2 - 0.1 &&
      !datos.agarres.some((a) => Math.abs(a.x - x) < ancho / 2 + 0.25 && Math.abs(a.y - y) < alto / 2 + 0.15) &&
      !datos.paneles.some((p) => Math.abs(p.x - x) < ancho / 2 + 0.85 && Math.abs(p.y - y) < alto / 2 + 0.65) &&
      !datos.checkpoints.some((c) => Math.abs(c.y - y) < alto / 2 + 0.25);
    const colocarCerca = (origen, texto, ancho = 1.1, alto = 0.5) => {
      // Se prefiere un lugar a la misma altura o un poco más abajo, para que se lea antes de llegar
      for (const dy of [0, -0.7, 0.7, -1.4, 1.4, -2.1, 2.1]) {
        for (const dx of [1.5, -1.5, 0.9, -0.9, 2.1, -2.1]) {
          if (libre(origen.x + dx, origen.y + dy, ancho, alto)) {
            poner(origen.x + dx, origen.y + dy, texto, ancho, alto);
            return;
          }
        }
      }
    };

    // Un cartel de una línea la primera vez que aparece cada tipo de agarre
    const primeros = {
      hunde: datos.agarres.find((a) => a.tipo === 'hunde'),
      lata: datos.agarres.find((a) => a.tipo === 'lata'),
      intermitente: datos.agarres.find((a) => a.tipo === 'intermitente'),
      panel: datos.paneles[0],
    };
    Object.entries(primeros).forEach(([tipo, origen]) => {
      if (origen) colocarCerca(origen, CARTELES_POR_TIPO[tipo]);
    });

    // Fragmentos, escaneo y niebla, cerca del principio
    colocarCerca({ x: 0, y: 2.4 }, 'Juntá un fragmento por tramo. Para escanear: tocá la pulsera, apretá A o X (en la compu, la tecla E)', 1.5, 0.75);
    colocarCerca({ x: 0, y: 3.6 }, 'La niebla de píxeles sube: no te quedes quieto', 1.3, 0.5);
  },
});
