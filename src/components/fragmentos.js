// Fragmentos: hay uno por tramo y hay que juntar los tres para encender el RESET. Va en la <a-scene>.
//
// Cada fragmento brilla suave (el brillo respira muy despacio) y suena en el espacio: se oye más fuerte
// cuanto más cerca está el jugador. Se juntan tocándolos con la mano. Cada uno que se junta enciende un
// hueco del RESET.
//
// Si la niebla alcanza uno sin juntar, el Glitch se lo come: desaparece de la pared y, cuando el jugador
// llega a la plataforma de arriba, reaparece medio escondido ahí, para buscarlo.
//
// Estados de cada fragmento: 'pared' → 'recogido', o 'pared' → 'comido' → 'escondido' → 'recogido'.
//
// Eventos sobre la escena: 'fragmento-recogido' { tramo, total }, 'fragmento-comido' { tramo } y
// 'fragmentos-revelados'. Escucha 'niebla-termino' para esconder arriba los fragmentos comidos.
// Para otros componentes: recogidos, lista, marcar(tramo, ms), comer(tramo) y revelar().
import { COLORES, ESCENARIO, FRAGMENTO } from '../config.js';
import { actualizarOyente, crearZumbido, fragmentoRecogido } from '../sonidos.js';

// Textura de brillo suave: un círculo que se desvanece hacia los bordes
function texturaBrillo() {
  const lienzo = document.createElement('canvas');
  lienzo.width = lienzo.height = 64;
  const ctx = lienzo.getContext('2d');
  const degradado = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
  degradado.addColorStop(0, 'rgba(255,255,255,1)');
  degradado.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = degradado;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(lienzo);
}

AFRAME.registerComponent('fragmentos', {
  init() {
    this.lista = []; // { tramo, estado, x, y, z, grupo, halo, zumbido, marcaHasta }
    this.recogidos = 0;
    this.construido = false;
    this.manos = [];
    this.tiempo = 0;
    this.camara = null;
    this.posCamara = new THREE.Vector3();
    this.adelante = new THREE.Vector3();
    this.posMano = new THREE.Vector3();
    this.textura = texturaBrillo();

    this.el.addEventListener('niebla-termino', () => this.revelar());
  },

  construir() {
    const datos = this.el.escalada;
    const zFrente = ESCENARIO.z + ESCENARIO.profundidadPared / 2;
    this.alturaFinal = datos.alturaFinal;
    this.zFrente = zFrente;

    datos.fragmentos.forEach((f) => {
      const grupo = new THREE.Group();
      const prisma = new THREE.Mesh(
        new THREE.CylinderGeometry(FRAGMENTO.radio, FRAGMENTO.radio, 0.07, 6),
        new THREE.MeshBasicMaterial({ color: COLORES.fragmento })
      );
      prisma.rotation.x = Math.PI / 2; // de frente al jugador
      const halo = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          map: this.textura,
          color: COLORES.fragmentoBrillo,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
          fog: false,
        })
      );
      halo.scale.setScalar(0.75);
      halo.position.z = -0.03;
      grupo.add(prisma, halo);

      const z = zFrente + FRAGMENTO.distanciaAlFrente;
      grupo.position.set(f.x, f.y, z);
      this.el.object3D.add(grupo);

      const zumbido = crearZumbido(FRAGMENTO.sonido.frecuencias, FRAGMENTO.sonido.volumen, FRAGMENTO.sonido.distanciaMax);
      if (zumbido) zumbido.mover(f.x, f.y, z);
      this.lista.push({ tramo: f.tramo, estado: 'pared', x: f.x, y: f.y, z, grupo, halo, zumbido, marcaHasta: 0 });
    });

    this.manos = Array.from(this.el.querySelectorAll('[mano-guante]'));
    this.construido = true;
  },

  // Marca el fragmento de ese tramo por `ms` milisegundos (lo usa el escaneo). Devuelve si había uno.
  marcar(tramo, ms) {
    const f = this.lista.find((x) => x.tramo === tramo && (x.estado === 'pared' || x.estado === 'escondido'));
    if (!f) return false;
    f.marcaHasta = performance.now() + ms;
    return true;
  },

  recoger(f) {
    f.estado = 'recogido';
    f.grupo.visible = false;
    if (f.zumbido) f.zumbido.detener();
    this.encenderHueco(this.recogidos);
    this.recogidos += 1;
    fragmentoRecogido();
    this.el.emit('fragmento-recogido', { tramo: f.tramo, total: this.recogidos }, false);
  },

  // Cada fragmento juntado enciende un hueco del RESET, en orden
  encenderHueco(indice) {
    const hueco = document.querySelector(`#reset-hueco-${indice}`);
    if (!hueco) return;
    hueco.setAttribute(
      'material',
      `color: ${COLORES.huecoEncendido}; emissive: ${COLORES.huecoEncendido}; emissiveIntensity: 0.7; roughness: 1; metalness: 0`
    );
  },

  // El Glitch se come un fragmento que no se juntó
  comer(tramo) {
    const f = this.lista.find((x) => x.tramo === tramo && x.estado === 'pared');
    if (!f) return;
    f.estado = 'comido';
    f.grupo.visible = false;
    if (f.zumbido) f.zumbido.silenciar(true);
    this.el.emit('fragmento-comido', { tramo }, false);
  },

  // Los fragmentos comidos reaparecen medio escondidos en la plataforma de arriba
  revelar() {
    this.lista.forEach((f) => {
      if (f.estado !== 'comido') return;
      const sitio = FRAGMENTO.escondites[f.tramo % FRAGMENTO.escondites.length];
      f.estado = 'escondido';
      f.x = sitio.x;
      f.y = this.alturaFinal + FRAGMENTO.hundimiento;
      f.z = this.zFrente + sitio.z;
      f.grupo.position.set(f.x, f.y, f.z);
      f.grupo.visible = true;
      if (f.zumbido) {
        f.zumbido.mover(f.x, f.y, f.z);
        f.zumbido.silenciar(false);
      }
    });
    this.el.emit('fragmentos-revelados', {}, false);
  },

  tick(tiempo, dt) {
    if (!this.construido) {
      if (!this.el.escalada) return;
      this.construir();
    }
    this.tiempo += Math.min(dt, 100) / 1000;
    if (!this.camara) this.camara = document.querySelector('#camara');
    if (!this.camara) return;

    this.camara.object3D.getWorldPosition(this.posCamara);
    this.adelante.set(0, 0, -1).applyQuaternion(this.camara.object3D.getWorldQuaternion(new THREE.Quaternion()));
    actualizarOyente(this.posCamara.x, this.posCamara.y, this.posCamara.z, this.adelante.x, this.adelante.y, this.adelante.z);

    const ahora = performance.now();
    const rigY = document.querySelector('#rig').object3D.position.y;
    const respiracion = Math.sin(this.tiempo * Math.PI * 2 * FRAGMENTO.velocidadPulso);

    this.lista.forEach((f) => {
      if (f.estado !== 'pared' && f.estado !== 'escondido') return;

      // Brillo que respira despacio; marcado por el escaneo, se ve más grande y claro
      const marcado = ahora < f.marcaHasta;
      f.halo.material.opacity = marcado ? 0.85 : 0.45 + 0.08 * respiracion;
      f.halo.scale.setScalar(marcado ? 2 : 0.75 + 0.05 * respiracion);
      f.halo.lookAt(this.posCamara);

      // ¿La toca alguna mano?
      let toca = this.manos.some((mano) => {
        mano.object3D.getWorldPosition(this.posMano);
        return this.posMano.distanceTo(f.grupo.position) <= FRAGMENTO.radioRecoger;
      });
      // Arriba, los escondidos también se juntan al pasar cerca
      if (!toca && f.estado === 'escondido') {
        const horizontal = Math.hypot(this.posCamara.x - f.x, this.posCamara.z - f.z);
        toca = horizontal <= FRAGMENTO.radioRecogerCuerpo && Math.abs(rigY - f.y) <= 0.6;
      }
      if (toca) this.recoger(f);
    });
  },

  remove() {
    this.lista.forEach((f) => {
      if (f.zumbido) f.zumbido.detener();
      this.el.object3D.remove(f.grupo);
    });
  },
});
