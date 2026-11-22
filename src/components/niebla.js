// Niebla de píxeles: sube despacio desde abajo, a velocidad constante. Va en la <a-scene>.
//
// - Empieza a subir unos segundos después de que el jugador se agarra por primera vez.
// - Si alcanza al jugador, lo devuelve al último checkpoint (como una caída) y baja unos metros por
//   debajo de ese checkpoint, para no devolverlo adentro de la niebla.
// - Si alcanza un fragmento que no se juntó, el Glitch se lo come y lo manda a un agarre del tramo
//   siguiente (ver fragmentos); una vez completado el tercer tramo, lo manda arriba, al piso final.
// - Cuando el jugador llega a la plataforma de arriba, la niebla sube rápido hasta comerse lo que quedó
//   sin juntar y se detiene debajo de la plataforma, sin alcanzar al jugador. Así la partida nunca se
//   traba: los fragmentos comidos aparecen arriba para buscarlos.
//
// Eventos sobre la escena: 'niebla-alcanza' y 'niebla-termino'.
import { COLORES, NIEBLA } from '../config.js';

AFRAME.registerComponent('niebla', {
  init() {
    this.y = NIEBLA.alturaInicial; // altura de la parte de arriba de la niebla
    this.iniciaEn = Infinity; // marca de performance.now() en que empieza a subir
    this.modoFinal = false;
    this.terminada = false;
    this.rig = null;

    // Losa translucente lila y píxeles flotando en el borde de arriba
    this.grupo = new THREE.Group();
    const losa = new THREE.Mesh(
      new THREE.BoxGeometry(NIEBLA.ancho, NIEBLA.alto, NIEBLA.ancho),
      new THREE.MeshBasicMaterial({
        color: COLORES.niebla,
        transparent: true,
        opacity: NIEBLA.opacidad,
        depthWrite: false,
        fog: false,
      })
    );
    losa.position.y = -NIEBLA.alto / 2; // la parte de arriba queda en y = 0 del grupo
    this.grupo.add(losa);

    const pixeles = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6, fog: false }),
      NIEBLA.pixeles
    );
    const auxiliar = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < NIEBLA.pixeles; i++) {
      const lado = NIEBLA.ancho / 2 - NIEBLA.tamanoPixel;
      auxiliar.position.set((Math.random() * 2 - 1) * lado, Math.random() * 0.9, (Math.random() * 2 - 1) * lado);
      const escala = NIEBLA.tamanoPixel * (0.5 + Math.random() * 0.7);
      auxiliar.scale.setScalar(escala);
      auxiliar.updateMatrix();
      pixeles.setMatrixAt(i, auxiliar.matrix);
      pixeles.setColorAt(i, color.set(Math.random() < 0.5 ? COLORES.niebla : COLORES.nieblaPixel));
    }
    pixeles.instanceMatrix.needsUpdate = true;
    this.grupo.add(pixeles);
    this.pixeles = pixeles;
    this.losa = losa;

    this.grupo.position.y = this.y;
    this.el.object3D.add(this.grupo);

    const escena = this.el;
    // Empieza al agarrarse por primera vez
    this.alAgarrar = () => {
      if (this.iniciaEn === Infinity) this.iniciaEn = performance.now() + NIEBLA.retardoInicio * 1000;
    };
    escena.addEventListener('mano-agarra', this.alAgarrar);
    escena.addEventListener('checkpoint-alcanzado', (e) => {
      const datos = this.el.escalada;
      if (datos && e.detail.orden === datos.checkpoints.length) this.modoFinal = true;
    });
    escena.addEventListener('reaparecer', () => this.bajarTrasReaparecer());
  },

  // Después de volver a un checkpoint, la niebla queda varios metros por debajo de él
  bajarTrasReaparecer() {
    const caida = document.querySelector('#rig').components.caida;
    const alturaCheckpoint = caida.ultimo ? caida.ultimo.el.object3D.getWorldPosition(new THREE.Vector3()).y : 0;
    this.y = Math.min(this.y, alturaCheckpoint - NIEBLA.retroceso);
  },

  // Vuelve a empezar: abajo del todo y quieta hasta que el jugador se agarre
  reiniciar() {
    this.y = NIEBLA.alturaInicial;
    this.iniciaEn = Infinity;
    this.modoFinal = false;
    this.terminada = false;
    this.grupo.position.y = this.y;
  },

  tick(tiempo, dt) {
    if (this.el.juegoTerminado) return; // después del final no hay niebla que avance
    const fragmentos = this.el.components.fragmentos;
    if (!this.rig) this.rig = document.querySelector('#rig');
    if (!this.rig || this.terminada) return;
    const segundos = Math.min(dt, 100) / 1000;
    const ahora = performance.now();
    const enMarcha = ahora >= this.iniciaEn;
    const caida = this.rig.components.caida;

    if (enMarcha && caida.estado === 'normal') {
      const datos = this.el.escalada;
      this.y += (this.modoFinal ? NIEBLA.velocidadFinal : NIEBLA.velocidad) * segundos;
      if (this.modoFinal && datos) this.y = Math.min(this.y, datos.alturaFinal - NIEBLA.distanciaAPlataforma);
    }
    this.grupo.position.y = this.y;

    // El Glitch se come los fragmentos que la niebla alcanza
    if (fragmentos) {
      fragmentos.lista.forEach((f) => {
        if (f.estado === 'pared' && this.y >= f.y - 0.1) fragmentos.comer(f.tramo, !this.modoFinal);
      });
    }

    if (this.modoFinal) {
      // Arriba: cuando ya no queda nada por comer, la niebla termina su trabajo
      const datos = this.el.escalada;
      const tope = datos ? datos.alturaFinal - NIEBLA.distanciaAPlataforma : this.y;
      const pendientes = fragmentos ? fragmentos.lista.some((f) => f.estado === 'pared') : false;
      if (this.y >= tope - 1e-3 && pendientes) fragmentos.lista.forEach((f) => f.estado === 'pared' && fragmentos.comer(f.tramo));
      if (!fragmentos || !fragmentos.lista.some((f) => f.estado === 'pared')) {
        this.terminada = true;
        this.el.emit('niebla-termino', {}, false);
      }
      return;
    }

    // ¿Alcanzó al jugador?
    if (enMarcha && caida.estado === 'normal' && this.rig.object3D.position.y <= this.y + NIEBLA.fraccionCatch) {
      this.el.emit('niebla-alcanza', {}, false);
      caida.caer();
    }
  },

  remove() {
    this.el.removeEventListener('mano-agarra', this.alAgarrar);
    this.el.object3D.remove(this.grupo);
    this.losa.geometry.dispose();
    this.losa.material.dispose();
    this.pixeles.geometry.dispose();
    this.pixeles.material.dispose();
  },
});
