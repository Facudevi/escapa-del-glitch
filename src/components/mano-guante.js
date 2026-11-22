// Mano de dibujos animados, al estilo de los juegos sociales de realidad virtual: una palma redonda, cuatro
// dedos y un pulgar hechos con cápsulas, y una manga que la une con la muñeca. Va en la entidad con
// meta-touch-controls (en modo escritorio, en la entidad de cada mano).
//
// - La mano se abre y se cierra: relajada si está libre, medio cerrada al apretar el grip sin agarrar nada y
//   puño cerrado cuando tiene un agarre ('agarre-tomado' y 'agarre-soltado' los emite climb).
// - Al apretar o soltar el grip emite 'mano-agarra' / 'mano-suelta' (burbujean hasta el rig),
//   para que los demás componentes no dependan de los nombres de los eventos del control.
// - El guante se pone ámbar solo cuando la mano realmente tiene un agarre.
//
// Marco de la mano: los dedos apuntan hacia -z, la palma mira hacia el centro del cuerpo y el pulgar hacia
// arriba. El centro de la palma es el origen de la entidad (el punto con el que se agarra).
import { COLORES, JUGADOR } from '../config.js';

const M = JUGADOR.mano;

// Cápsula que va del origen hacia -z, `largo` metros, con la punta redonda
function segmento(radio, largo, material) {
  const geometria = new THREE.CapsuleGeometry(radio, largo, 3, 10);
  geometria.rotateX(Math.PI / 2);
  geometria.translate(0, 0, -largo / 2);
  return new THREE.Mesh(geometria, material);
}

// Dedo de tres falanges, cada una pivotando en su articulación. `largos` = [falange 1, 2, 3]
function crearDedo(radio, largos, material) {
  const base = new THREE.Group();
  const falanges = [base];
  let padre = base;
  largos.forEach((largo, i) => {
    const grupo = i === 0 ? base : new THREE.Group();
    if (i > 0) {
      grupo.position.z = -largos[i - 1];
      padre.add(grupo);
      falanges.push(grupo);
    }
    grupo.add(segmento(radio * (1 - i * 0.07), largo, material));
    padre = grupo;
  });
  return { base, falanges };
}

AFRAME.registerComponent('mano-guante', {
  schema: { mano: { type: 'string', default: 'izquierda' } },

  init() {
    this.agarrando = false; // tiene un agarre de la pared
    this.gripApretado = false; // tiene el grip apretado
    this.cierre = 0.12; // 0 = abierta, 1 = puño; se mueve suave hacia su objetivo
    this.material = new THREE.MeshStandardMaterial({ color: COLORES.guante, roughness: 0.55, metalness: 0 });
    const manga = new THREE.MeshStandardMaterial({ color: COLORES.violeta, roughness: 0.7, metalness: 0 });

    const mano = new THREE.Group(); // en el marco de la mano; luego se gira según sea izquierda o derecha
    this.grupo = new THREE.Group();
    this.grupo.scale.setScalar(M.escala);
    this.grupo.add(mano);

    // Palma: un óvalo aplastado, con un bulto en el nacimiento del pulgar
    const palma = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), this.material);
    palma.scale.set(M.anchoPalma / 2, M.grosorPalma / 2, M.largoPalma / 2);
    mano.add(palma);
    const bultoPulgar = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), this.material);
    bultoPulgar.scale.set(0.017, 0.015, 0.024);
    bultoPulgar.position.set(M.anchoPalma / 2 - 0.012, -0.004, -0.004);
    mano.add(bultoPulgar);

    // Manga que une la mano con la muñeca
    const mangaMalla = new THREE.Mesh(new THREE.CylinderGeometry(0.037, 0.04, 0.034, 20), manga);
    mangaMalla.rotation.x = Math.PI / 2;
    mangaMalla.position.z = M.largoPalma / 2 + 0.012;
    mano.add(mangaMalla);

    // Cuatro dedos: índice, mayor, anular y meñique, de largos distintos
    this.dedos = [
      { x: 0.027, largos: [0.03, 0.022, 0.018], abre: 0.0 },
      { x: 0.009, largos: [0.033, 0.024, 0.019], abre: 0.02 },
      { x: -0.009, largos: [0.03, 0.022, 0.018], abre: 0.05 },
      { x: -0.026, largos: [0.023, 0.017, 0.015], abre: 0.09 },
    ].map((d) => {
      const dedo = crearDedo(M.radioDedo, d.largos, this.material);
      dedo.base.position.set(d.x, 0, -M.largoPalma / 2 + 0.006);
      mano.add(dedo.base);
      return { ...dedo, abre: d.abre };
    });

    // Pulgar de dos falanges, que sale hacia afuera y adelante
    this.pulgar = crearDedo(M.radioDedo * 1.1, [0.028, 0.022], this.material);
    this.pulgar.base.position.set(M.anchoPalma / 2 - 0.005, 0, -0.012);
    mano.add(this.pulgar.base);

    // La mano derecha es la espejada de la izquierda
    const izquierda = this.data.mano === 'izquierda';
    mano.scale.x = izquierda ? 1 : -1;
    this.grupo.rotation.z = izquierda ? Math.PI / 2 : -Math.PI / 2;

    this.el.setObject3D('guante', this.grupo);
    this.aplicarPose(this.cierre);

    this.el.addEventListener('gripdown', () => this.el.emit('mano-agarra', { mano: this.data.mano }));
    this.el.addEventListener('gripup', () => this.el.emit('mano-suelta', { mano: this.data.mano }));
    // Los dos modos (casco y mouse) emiten estos eventos, así que sirven para saber si el grip está apretado
    this.el.addEventListener('mano-agarra', () => (this.gripApretado = true));
    this.el.addEventListener('mano-suelta', () => (this.gripApretado = false));
    this.el.addEventListener('agarre-tomado', () => this.pintar(true));
    this.el.addEventListener('agarre-soltado', () => this.pintar(false));
  },

  pintar(agarrando) {
    this.agarrando = agarrando;
    this.material.color.set(agarrando ? COLORES.guanteAgarrado : COLORES.guante);
  },

  // Dobla los dedos según el cierre (0 = abierta, 1 = puño)
  aplicarPose(c) {
    this.dedos.forEach((d) => {
      const [f1, f2, f3] = d.falanges;
      f1.rotation.x = -(0.08 + c * 1.25);
      f2.rotation.x = -(0.15 + c * 1.5);
      f3.rotation.x = -(0.1 + c * 1.1);
      f1.rotation.y = (1 - c) * d.abre * 0.5; // los dedos se separan un poco al abrir la mano
    });
    const [p1, p2] = this.pulgar.falanges;
    p1.rotation.y = -0.55 + c * 0.95;
    p1.rotation.x = -c * 0.25;
    p2.rotation.y = c * 0.5;
    p2.rotation.x = -(0.1 + c * 0.5);
  },

  tick(tiempo, dt) {
    const objetivo = this.agarrando ? 1 : this.gripApretado ? 0.75 : 0.12;
    const paso = Math.min(dt / 1000 * 12, 1);
    if (Math.abs(objetivo - this.cierre) < 0.003) return;
    this.cierre += (objetivo - this.cierre) * paso;
    this.aplicarPose(this.cierre);
  },

  remove() {
    this.el.removeObject3D('guante');
  },
});
