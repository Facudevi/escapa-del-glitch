// Escenario completo: el setup gamer gigante que el jugador escala. Va en la <a-scene>.
//
// Arma el decorado de los tres tramos (escritorio y teclado, torre de PC con parlantes, monitor), los
// entrepaños de descanso y el piso de arriba, todos los agarres, los paneles que giran, el enchufe de la
// tirolesa, los checkpoints, el botón RESET grande al fondo y el mensaje del pie de la pared. Las posiciones
// salen del generador (src/tramos.js) y las medidas de config.js.
//
// Deja los datos de la escalada en escena.escalada (agarres, paneles, fragmentos, refugios, checkpoints,
// reset) para los demás componentes.
import { COLORES, DECORADO, ESCENARIO, FINAL, INTERMITENTE, LATA, PANEL, TIROLESA } from '../config.js';
import { crearDecorado } from '../decorado.js';
import { crearPlataformas, posicionReset } from '../plataformas.js';
import { generarEscalada } from '../tramos.js';
import { crear } from '../utilidades.js';

const FRENTE = ESCENARIO.z + ESCENARIO.profundidadPared / 2; // frente de la pared

AFRAME.registerComponent('escenario-glitch', {
  init() {
    const escena = this.el;
    const datos = generarEscalada();
    datos.reset = posicionReset(datos.alturaFinal);
    escena.escalada = datos;

    // Decorado y plataformas (mallas fusionadas, sin entidades por pieza)
    const decorado = crear(escena, 'a-entity');
    decorado.setObject3D('decorado', crearDecorado(datos));
    decorado.setObject3D('plataformas', crearPlataformas(datos));

    // Agarres de la ruta y de más
    datos.agarres.forEach((a) => this.crearAgarre(a));
    // Paneles que giran, con dos teclas firmes en la cara frontal
    datos.paneles.forEach((p) => this.crearPanel(p));
    // Tirolesa: un enchufe USB chico en la torre, con su cable hasta el segundo checkpoint
    this.crearTirolesa(datos);

    this.crearCheckpoints(datos);
    this.crearReset(datos);
    this.crearMensajeDelPie();
  },

  // Posición de un agarre: su cara de adelante queda a ESCENARIO.salienteAgarres del frente de la pared
  posicionAgarre(a, profundidad) {
    const z = FRENTE + ESCENARIO.salienteAgarres - profundidad / 2;
    return `${a.x.toFixed(3)} ${a.y.toFixed(3)} ${z.toFixed(3)}`;
  },

  // Un agarre de cualquier tipo, cada uno con su color y su forma
  crearAgarre(a) {
    const T = ESCENARIO.tecla;
    const material = 'roughness: 0.8; metalness: 0';
    const caja = { width: T.ancho, height: T.alto, depth: T.profundidad };
    if (a.tipo === 'hunde') {
      return crear(this.el, 'a-box', {
        agarre: 'tipo: hunde', 'tecla-hunde': '', position: this.posicionAgarre(a, T.profundidad), ...caja, color: COLORES.lavandaHunde, material,
      });
    }
    if (a.tipo === 'lata') {
      return crear(this.el, 'a-cylinder', {
        agarre: 'tipo: lata', 'lata-rompe': '', position: this.posicionAgarre(a, LATA.radio * 2 + 0.1), radius: LATA.radio, height: LATA.alto,
        color: COLORES.ambar, material,
      });
    }
    if (a.tipo === 'intermitente') {
      return crear(this.el, 'a-box', {
        agarre: 'tipo: intermitente',
        'bloque-intermitente': `fase: ${a.fase}`,
        position: this.posicionAgarre(a, INTERMITENTE.profundidad),
        width: INTERMITENTE.ancho,
        height: INTERMITENTE.alto,
        depth: INTERMITENTE.profundidad,
        color: COLORES.celeste,
        material,
      });
    }
    return crear(this.el, 'a-box', {
      agarre: 'tipo: firme', position: this.posicionAgarre(a, T.profundidad), ...caja, color: COLORES.lavanda, material,
    });
  },

  crearPanel(p) {
    const T = ESCENARIO.tecla;
    const zCentro = FRENTE + ESCENARIO.panel.centro;
    const panel = crear(this.el, 'a-box', {
      'panel-gira': `fase: ${p.fase}`,
      position: `${p.x.toFixed(3)} ${p.y.toFixed(3)} ${zCentro.toFixed(3)}`,
      width: PANEL.ancho,
      height: PANEL.alto,
      depth: PANEL.grosor,
      color: COLORES.panel,
      material: 'roughness: 0.9; metalness: 0',
    });
    // Las teclas del panel salen hasta el mismo plano que los demás agarres
    const separacion = ESCENARIO.panel.separacionAgarres;
    const zLocal = ESCENARIO.salienteAgarres - ESCENARIO.panel.centro - T.profundidad / 2;
    [-separacion, separacion].forEach((dx) => {
      crear(panel, 'a-box', {
        agarre: 'tipo: firme',
        position: `${dx} 0 ${zLocal}`,
        width: T.ancho,
        height: T.alto,
        depth: T.profundidad,
        color: COLORES.lavanda,
        material: 'roughness: 0.8; metalness: 0',
      });
    });
  },

  // Enchufe USB de la tirolesa y el cable que sale de él hasta el segundo checkpoint
  crearTirolesa(datos) {
    const t = datos.tirolesa;
    if (!t) return;
    const E = TIROLESA.enchufe;
    const zEnchufe = FRENTE + E.saliente - E.profundidad / 2;
    const enchufe = crear(this.el, 'a-box', {
      agarre: `tipo: tirolesa; tolerancia: ${TIROLESA.tolerancia}`,
      tirolesa: '',
      position: `${t.x.toFixed(3)} ${t.y.toFixed(3)} ${zEnchufe.toFixed(3)}`,
      width: E.ancho,
      height: E.alto,
      depth: E.profundidad,
      color: DECORADO.metal,
      material: 'roughness: 0.6; metalness: 0',
    });
    // Lengüeta del conector
    crear(enchufe, 'a-box', {
      position: `0 0 ${E.profundidad / 2 + 0.04}`,
      width: E.ancho * 0.65,
      height: E.alto * 0.4,
      depth: 0.08,
      color: DECORADO.metalOscuro,
      material: 'roughness: 0.8; metalness: 0',
    });

    // Cable: sale del enchufe, cuelga en curva y termina sobre el entrepaño del segundo checkpoint
    const checkpoint = datos.checkpoints[1];
    const inicio = new THREE.Vector3(t.x, t.y + E.alto / 2, zEnchufe - 0.05);
    const fin = new THREE.Vector3(t.x * 0.6, checkpoint.y + 0.05, FRENTE + 1.3);
    const control = inicio.clone().lerp(fin, 0.5).add(new THREE.Vector3(0, -0.6, TIROLESA.curvaZ));
    const curva = new THREE.QuadraticBezierCurve3(inicio, control, fin);
    const cable = new THREE.Mesh(
      new THREE.TubeGeometry(curva, 28, TIROLESA.radioCable, 6, false),
      new THREE.MeshStandardMaterial({ color: DECORADO.metalOscuro, roughness: 0.9, metalness: 0 })
    );
    crear(this.el, 'a-entity').setObject3D('cable', cable);
  },

  // Zonas donde se camina: el piso de la sala, los dos entrepaños y el piso de arriba
  crearCheckpoints(datos) {
    const escena = this.el;
    crear(escena, 'a-entity', {
      checkpoint: 'orden: 0; ancho: 15; profundidad: 15',
      position: '0 0 0',
    });
    const P = ESCENARIO.plataforma;
    const F = ESCENARIO.final;
    datos.checkpoints.forEach((c, i) => {
      if (i < datos.checkpoints.length - 1) {
        crear(escena, 'a-entity', {
          checkpoint: `orden: ${c.orden}; ancho: ${P.ancho}; profundidad: ${P.profundidad}; reaparecerZ: ${P.spawnZ}`,
          position: `0 ${c.y} ${FRENTE + P.profundidad / 2}`,
        });
      } else {
        // El piso de arriba va desde el borde que sobresale hasta el fondo de la sala
        const profundidad = F.bordeZ - F.fondoZ;
        crear(escena, 'a-entity', {
          checkpoint: `orden: ${c.orden}; ancho: ${F.ancho}; profundidad: ${profundidad}; reaparecerZ: ${F.spawnZ}`,
          position: `0 ${c.y} ${(F.bordeZ + F.fondoZ) / 2}`,
        });
      }
    });
  },

  // Botón RESET grande al fondo del piso de arriba, con los tres huecos de los fragmentos; y otra fila de
  // huecos arriba del monitor, que se ve desde el pie de la pared como referencia de adónde ir
  crearReset(datos) {
    const R = datos.reset;
    const hueco = (id, x, y, z, radio) =>
      crear(this.el, 'a-cylinder', {
        id,
        position: `${x} ${y} ${z}`,
        rotation: '90 0 0',
        radius: radio,
        height: 0.05,
        'segments-radial': 6,
        color: COLORES.hueco,
        material: 'roughness: 1; metalness: 0',
      });

    // Base del botón y el botón (golpeable: con la mano en VR, con clic en la compu)
    crear(this.el, 'a-cylinder', {
      position: `${R.x} ${R.y} ${R.z - 0.4}`,
      rotation: '90 0 0',
      radius: 1.25,
      height: 0.3,
      color: DECORADO.soporte,
      material: 'roughness: 0.9; metalness: 0',
    });
    crear(this.el, 'a-cylinder', {
      id: 'reset-boton',
      class: 'golpeable',
      golpeable: `radio: ${FINAL.radioGolpeReset}`,
      'reset-boton': '',
      position: `${R.x} ${R.y} ${R.z}`,
      rotation: '90 0 0',
      radius: 1.0,
      height: 0.5,
      color: COLORES.resetApagado,
      material: 'roughness: 0.9; metalness: 0',
    });
    crear(this.el, 'a-entity', {
      cartel: 'texto: RESET; ancho: 1.6; alto: 0.5',
      position: `${R.x} ${R.y} ${R.z + 0.27}`, // sobre la cara del botón
    });
    // Huecos de los fragmentos sobre el botón
    [-1.3, 0, 1.3].forEach((x, i) => hueco(`reset-hueco-fondo-${i}`, x, datos.alturaFinal + 2.95, R.frenteConsola + 0.03, 0.25));
    // Fila de referencia arriba del monitor, visible desde abajo
    [-1.1, 0, 1.1].forEach((x, i) => hueco(`reset-hueco-${i}`, x, datos.alturaFinal - 0.6, FRENTE + 0.38, 0.26));
  },

  // Mensaje abajo de todo, en el canto del escritorio, donde no lo tapa ningún objeto
  crearMensajeDelPie() {
    crear(this.el, 'a-entity', {
      cartel: 'texto: A lo largo de la escalada tenés que juntar los fragmentos para escapar; ancho: 6.4; alto: 0.75',
      position: `0 0.47 ${FRENTE + 0.8}`,
    });
  },
});
