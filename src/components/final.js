// Final de la experiencia. Va en la <a-scene>.
//
// Al activar el RESET (evento 'reset-activado'):
//   1. Suena la rotura, el Glitch dice su frase y se abren grietas desde el botón sobre la pantalla.
//   2. Una luz cálida se abre desde la grieta y la vista se funde hacia ella (despacio, sin destellos).
//   3. El jugador aparece en un paisaje al aire libre al amanecer: pasto, montañas y cielo abierto, que
//      contrasta con el interior del setup.
//   4. Delante tiene la frase «Subiste de nivel, adentro y afuera de la pantalla» flotando en el cielo, un
//      podio con la medalla según su tiempo (oro menos de 2 min, plata menos de 3 min, bronce el resto) y un
//      pedestal con el botón para volver a jugar. Todo se acomoda delante de donde aparece el jugador.
//
// Volver a jugar (botón golpeable, clic en escritorio o tecla R) reinicia todo sin recargar la página,
// así no se corta la sesión de VR.
import { CAIDA, COLORES, ESCENARIO, FINAL } from '../config.js';
import { crearCartelDeMadera, crearPedestalDelBoton, crearPodioConMedalla } from '../objetosFinal.js';
import { amanecer, roturaPantalla } from '../sonidos.js';
import { crear, lugarFrenteAlTramo } from '../utilidades.js';

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

// Cielo: degradado vertical de celeste a durazno en el horizonte
function texturaCielo() {
  const lienzo = document.createElement('canvas');
  lienzo.width = 8;
  lienzo.height = 256;
  const ctx = lienzo.getContext('2d');
  const degradado = ctx.createLinearGradient(0, 0, 0, 256);
  const [cenit, alto, medio, horizonte] = COLORES.cielo;
  degradado.addColorStop(0, cenit);
  degradado.addColorStop(0.25, alto);
  degradado.addColorStop(0.42, medio);
  degradado.addColorStop(0.5, horizonte);
  degradado.addColorStop(1, COLORES.nieblaExterior);
  ctx.fillStyle = degradado;
  ctx.fillRect(0, 0, 8, 256);
  const textura = new THREE.CanvasTexture(lienzo);
  textura.colorSpace = THREE.SRGBColorSpace;
  return textura;
}

const formatoTiempo = (segundos) => `${Math.floor(segundos / 60)}:${String(Math.floor(segundos % 60)).padStart(2, '0')}`;

AFRAME.registerComponent('final', {
  init() {
    this.activo = false; // ya está en el exterior
    this.enCurso = false; // hay una transición andando
    this.rotura = null; // animación de grietas y luz: { desde }
    this.grietas = null;
    this.luz = null;
    this.paisaje = null;

    this.escena = this.el;
    this.escena.juegoTerminado = false;
    this.ambiente = null; // fog y fondo del interior, para restaurarlos al volver a jugar

    this.construirExterior();
    this.escena.addEventListener('reset-activado', () => this.secuencia());
    this.escena.addEventListener('volver-a-jugar', () => this.reiniciar());
    this.alTeclear = (e) => {
      if (e.code === FINAL.teclaReiniciar && !e.repeat && this.activo) this.reiniciar();
    };
    window.addEventListener('keydown', this.alTeclear);
  },

  // ---------- Exterior ----------

  construirExterior() {
    const X = FINAL.exterior.x;
    this.grupo = crear(this.escena, 'a-entity', { id: 'exterior', position: `${X} 0 0` });
    this.grupo.object3D.visible = false;

    const paisaje = new THREE.Group();
    // Cielo
    paisaje.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(420, 24, 16),
        new THREE.MeshBasicMaterial({ map: texturaCielo(), side: THREE.BackSide, fog: false })
      )
    );
    // Pasto
    const suelo = new THREE.Mesh(
      new THREE.PlaneGeometry(900, 900),
      new THREE.MeshBasicMaterial({ color: COLORES.pasto }) // sin sombreado: la paleta se ve tal cual
    );
    suelo.rotation.x = -Math.PI / 2;
    paisaje.add(suelo);
    // Montañas alrededor, de tamaños distintos
    for (let i = 0; i < 14; i++) {
      const angulo = (i / 14) * Math.PI * 2 + (i % 3) * 0.13;
      const distancia = 110 + (i % 4) * 22;
      const alto = 16 + ((i * 7) % 5) * 7;
      const montana = new THREE.Mesh(
        new THREE.ConeGeometry(18 + ((i * 5) % 4) * 6, alto, 5),
        new THREE.MeshBasicMaterial({ color: COLORES.montanas[i % COLORES.montanas.length] })
      );
      montana.position.set(Math.sin(angulo) * distancia, alto / 2 - 0.5, -Math.cos(angulo) * distancia);
      paisaje.add(montana);
    }
    // Sol bajo, justo adelante
    const sol = new THREE.Mesh(
      new THREE.SphereGeometry(9, 20, 14),
      new THREE.MeshBasicMaterial({ color: COLORES.sol, fog: false })
    );
    sol.position.set(0, 14, -230);
    paisaje.add(sol);
    this.paisaje = paisaje;
    this.grupo.setObject3D('paisaje', paisaje);

    // Luz del amanecer, solo para los objetos del exterior (se enciende y apaga junto con el grupo)
    const luzSol = new THREE.DirectionalLight(COLORES.luzSolExterior, FINAL.exterior.intensidadSol);
    luzSol.position.set(-4, 7, 5);
    this.grupo.object3D.add(luzSol);

    // Frase en el cielo, delante del jugador y sin cuadro de texto
    const C = FINAL.cielo;
    this.frase = crear(this.grupo, 'a-entity', {
      cartel: `texto: ${FINAL.frase}; ancho: ${C.ancho}; alto: ${C.alto}; sinFondo: true; pixelesPorMetro: 60`,
      position: `0 ${C.y} ${-C.distancia}`,
    });

    // Podio con la medalla, justo adelante
    this.podio = crearPodioConMedalla();
    this.podio.grupo.position.set(0, 0, -3.6);
    this.grupo.object3D.add(this.podio.grupo);

    // Pedestal con el botón de volver a jugar, a la derecha. El botón es golpeable: lo golpea la mano o el clic
    const pedestal = crearPedestalDelBoton();
    const pedestalEl = crear(this.grupo, 'a-entity', { position: '2.0 0 -2.5' });
    pedestalEl.setObject3D('pedestal', pedestal.grupo);
    this.reiniciarBoton = crear(pedestalEl, 'a-cylinder', {
      position: `${pedestal.posicionBoton.x} ${pedestal.posicionBoton.y} ${pedestal.posicionBoton.z}`,
      rotation: '90 0 0',
      radius: 0.15,
      height: 0.1,
      color: COLORES.violeta,
      golpeable: '',
      material: 'roughness: 0.5; metalness: 0.1',
    });
    this.reiniciarBoton.addEventListener('golpeado', () => this.escena.emit('volver-a-jugar', {}, false));

    // Diseño consciente: RESET habla de bienestar, así que el final también invita a descansar
    const cartelMadera = crearCartelDeMadera(['Antes de seguir:', 'tomá agua y descansá', 'la vista un rato']);
    cartelMadera.position.set(-2.1, 0, -2.4);
    cartelMadera.rotation.y = 0.35;
    this.grupo.object3D.add(cartelMadera);
  },

  // Medalla según el tiempo: oro menos de 2 min, plata menos de 3 min, bronce el resto
  tipoDeMedalla(segundos) {
    if (segundos < FINAL.medallas.oro) return 'oro';
    if (segundos < FINAL.medallas.plata) return 'plata';
    return 'bronce';
  },

  mostrarResultado(segundos) {
    const tipo = this.tipoDeMedalla(segundos);
    this.podio.pintar(tipo, `Tiempo: ${formatoTiempo(segundos)}`);
    this.ultimoResultado = { tipo, segundos };
  },

  // ---------- Rotura de la pantalla ----------

  // Grietas finas que salen del botón RESET sobre el panel del fondo del piso de arriba
  construirRotura() {
    const datos = this.escena.escalada;
    const centro = new THREE.Vector3(datos.reset.x, datos.alturaFinal + FINAL.alturaGrietas, ESCENARIO.final.fondoZ + 0.43);
    const piezas = [];
    for (let k = 0; k < FINAL.grietas; k++) {
      let angulo = (k / FINAL.grietas) * Math.PI * 2 + (k % 2) * 0.2;
      let x = 0;
      let y = 0;
      for (let s = 0; s < 9; s++) {
        const largo = 0.25 + ((k * 7 + s * 3) % 5) * 0.06;
        angulo += (((k + s) % 3) - 1) * 0.35; // la grieta zigzaguea
        const nx = x + Math.cos(angulo) * largo;
        const ny = y + Math.sin(angulo) * largo;
        piezas.push({ s, k, x: (x + nx) / 2, y: (y + ny) / 2, angulo, largo });
        x = nx;
        y = ny;
      }
    }
    piezas.sort((a, b) => a.s - b.s || a.k - b.k); // salen primero los tramos cercanos al botón

    this.grietas = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: COLORES.grieta, fog: false }),
      piezas.length
    );
    const auxiliar = new THREE.Object3D();
    piezas.forEach((p, i) => {
      auxiliar.position.set(centro.x + p.x, centro.y + p.y, centro.z);
      auxiliar.rotation.set(0, 0, p.angulo - Math.PI / 2);
      auxiliar.scale.set(0.035, p.largo, 0.01);
      auxiliar.updateMatrix();
      this.grietas.setMatrixAt(i, auxiliar.matrix);
    });
    this.grietas.instanceMatrix.needsUpdate = true;
    this.grietas.count = 0;
    this.escena.object3D.add(this.grietas);

    // Luz cálida que se abre desde la grieta
    this.luz = new THREE.Mesh(
      new THREE.CircleGeometry(1, 48),
      new THREE.MeshBasicMaterial({ color: COLORES.luzRotura, transparent: true, opacity: 0, depthWrite: false, fog: false })
    );
    this.luz.position.set(centro.x, centro.y, centro.z + 0.02);
    this.luz.visible = false;
    this.escena.object3D.add(this.luz);
    this.totalPiezas = piezas.length;
  },

  // ---------- Secuencia del final ----------

  async secuencia() {
    if (this.enCurso || this.activo) return;
    this.enCurso = true;
    this.escena.juegoTerminado = true; // la niebla y las caídas se detienen
    const segundos = this.escena.components.cronometro ? this.escena.components.cronometro.tiempo() : 0;

    if (!this.grietas) this.construirRotura();
    roturaPantalla();
    const glitch = this.escena.components.glitch;
    if (glitch) glitch.decir('reset');
    this.rotura = { desde: performance.now() };

    await esperar(FINAL.pausaAntesDeLuz * 1000);
    const fundido = document.querySelector('#camara').components.fundido;
    fundido.color(COLORES.luzRotura);
    await fundido.ir(1, FINAL.duracionLuz * 1000);

    this.entrarAlExterior(segundos);
    await fundido.ir(0, FINAL.duracionLuz * 1000);
    fundido.color(CAIDA.colorFundido);
    amanecer();
    this.enCurso = false;
  },

  entrarAlExterior(segundos) {
    const rig = document.querySelector('#rig');
    const camara = document.querySelector('#camara');

    // Nadie queda agarrado a nada
    const mouse = this.escena.components['escalada-mouse'];
    if (mouse) mouse.soltarTodas();
    Object.keys(rig.components.climb.sujetas).forEach((mano) => rig.components.climb.soltar(mano));

    // El jugador aparece en el exterior y todo se acomoda delante de él, justo adonde mira (con casco, la
    // cabeza puede estar corrida del centro del rig, así que se toma la posición real de la cámara)
    rig.object3D.position.set(FINAL.exterior.x, 0, 0);
    rig.object3D.updateMatrixWorld(true);
    const cabeza = new THREE.Vector3();
    camara.object3D.getWorldPosition(cabeza);
    const orientacion = new THREE.Euler().setFromQuaternion(camara.object3D.getWorldQuaternion(new THREE.Quaternion()), 'YXZ');
    this.grupo.object3D.position.set(cabeza.x, 0, cabeza.z);
    this.grupo.object3D.rotation.y = orientacion.y;
    this.grupo.object3D.visible = true;

    // Aire libre: la niebla de la sala se cambia por una bruma suave de amanecer
    // Se guardan copias: getAttribute devuelve el mismo objeto que después se modifica
    this.ambiente = { fog: { ...this.escena.getAttribute('fog') }, fondo: { ...this.escena.getAttribute('background') } };
    this.escena.setAttribute(
      'fog',
      `type: exponential; color: ${COLORES.nieblaExterior}; density: ${FINAL.exterior.densidadNiebla}`
    );
    this.escena.setAttribute('background', `color: ${COLORES.nieblaExterior}`);

    this.mostrarResultado(segundos);
    const glitch = this.escena.components.glitch;
    if (glitch) glitch.hasta = 0; // la frase del RESET ya se leyó: no tapa la frase del final
    this.activo = true;
    if (this.rotura) this.rotura = null;
    this.grietas.count = 0;
    this.luz.visible = false;
  },

  // ---------- Volver a jugar ----------

  async reiniciar() {
    if (this.enCurso || !this.activo) return;
    this.enCurso = true;
    const fundido = document.querySelector('#camara').components.fundido;
    await fundido.ir(1, 700);

    // Afuera
    this.grupo.object3D.visible = false;
    this.activo = false;
    if (this.ambiente) {
      this.escena.setAttribute('fog', this.ambiente.fog);
      this.escena.setAttribute('background', this.ambiente.fondo);
    }

    // Adentro: todo vuelve al principio
    const rig = document.querySelector('#rig');
    rig.object3D.position.set(0, 0, lugarFrenteAlTramo(0));
    this.escena.juegoTerminado = false;
    const caida = rig.components.caida;
    caida.ultimo = null;
    caida.estado = 'normal';
    caida.sinApoyo = 0;
    caida.protegidoHasta = performance.now() + CAIDA.graciaReinicio;
    rig.components.energia.recargar();
    ['fragmentos', 'niebla', 'cronometro', 'glitch'].forEach((nombre) => {
      const componente = this.escena.components[nombre];
      if (componente && componente.reiniciar) componente.reiniciar();
    });
    if (this.escena.components.escaneo) this.escena.components.escaneo.listoEn = 0;
    const boton = document.querySelector('#reset-boton');
    if (boton && boton.components['reset-boton']) boton.components['reset-boton'].reiniciar();

    await fundido.ir(0, 700);
    this.enCurso = false;
  },

  tick(tiempo) {
    if (this.activo && this.podio) this.podio.mecer(tiempo / 1000);
    // Animación de grietas y luz mientras dura la rotura
    if (this.rotura && this.grietas) {
      const transcurrido = (performance.now() - this.rotura.desde) / 1000;
      const grietas = Math.min(transcurrido / FINAL.duracionGrietas, 1);
      this.grietas.count = Math.floor(this.totalPiezas * grietas);
      const luz = Math.min(Math.max((transcurrido - FINAL.pausaAntesDeLuz * 0.4) / (FINAL.pausaAntesDeLuz + FINAL.duracionLuz), 0), 1);
      this.luz.visible = luz > 0;
      this.luz.scale.setScalar(Math.max(luz * FINAL.radioLuz, 0.01));
      this.luz.material.opacity = 0.7 * luz;
    }

    // En el exterior no se puede caminar sin límite
    if (this.activo) {
      const rig = document.querySelector('#rig');
      const dx = rig.object3D.position.x - FINAL.exterior.x;
      const dz = rig.object3D.position.z;
      const distancia = Math.hypot(dx, dz);
      if (distancia > FINAL.exterior.radioLimite) {
        const f = FINAL.exterior.radioLimite / distancia;
        rig.object3D.position.x = FINAL.exterior.x + dx * f;
        rig.object3D.position.z = dz * f;
      }
    }
  },

  remove() {
    window.removeEventListener('keydown', this.alTeclear);
  },
});
