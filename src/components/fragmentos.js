// Fragmentos: hay uno por tramo y hay que juntar los tres para encender el RESET. Va en la <a-scene>.
//
// Cada fragmento brilla suave (el brillo respira muy despacio) y suena en el espacio: se oye más fuerte
// cuanto más cerca está el jugador. Se juntan tocándolos con la mano. Cada uno que se junta enciende un
// hueco del RESET.
//
// Si la niebla alcanza uno sin juntar, el Glitch se lo come y lo manda más arriba: reaparece en otro
// agarre del tramo siguiente (siempre por encima del jugador). Si ya no queda un tramo más arriba, o el
// jugador ya completó el tercer tramo, el fragmento se esconde entre los objetos de videojuegos del piso
// de arriba y hay que buscarlo ahí.
//
// Estados de cada fragmento: 'pared' → 'recogido'; o 'pared' → 'pared' (reubicado en el tramo siguiente);
// o 'pared' → 'comido' → 'escondido' → 'recogido'.
// Cada fragmento tiene su número (tramo) de origen y el tramo donde está ahora (tramoActual).
//
// Eventos sobre la escena: 'fragmento-comido' { tramo, destino }, 'fragmento-salteado' { tramo, destino }, 'fragmento-recogido' { tramo, total } y
// 'fragmentos-revelados'. Escucha 'niebla-termino' para esconder arriba los fragmentos comidos.
// Para otros componentes: recogidos, perdidos (los que se comió el Glitch), lista, marcar(tramo, ms), comer(tramo, reubicar) y revelar().
import { COLORES, ESCENARIO, FRAGMENTO } from '../config.js';
import { frenteTramo } from '../utilidades.js';
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
    this.perdidos = new Set(); // fragmentos (por número) que el Glitch se comió alguna vez: bajan la medalla
    this.construido = false;
    this.manos = [];
    this.tiempo = 0;
    this.camara = null;
    this.posCamara = new THREE.Vector3();
    this.adelante = new THREE.Vector3();
    this.posMano = new THREE.Vector3();
    this.textura = texturaBrillo();

    this.el.addEventListener('niebla-termino', () => this.revelar());
    this.el.addEventListener('checkpoint-alcanzado', (e) => this.subirSalteados(e.detail.orden));
  },

  construir() {
    const datos = this.el.escalada;
    this.alturaFinal = datos.alturaFinal;

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

      const z = frenteTramo(f.tramo) + FRAGMENTO.distanciaAlFrente;
      grupo.position.set(f.x, f.y, z);
      this.el.object3D.add(grupo);

      const zumbido = crearZumbido(FRAGMENTO.sonido.frecuencias, FRAGMENTO.sonido.volumen, FRAGMENTO.sonido.distanciaMax, FRAGMENTO.sonido.cada, FRAGMENTO.sonido.duracion);
      if (zumbido) zumbido.mover(f.x, f.y, z);
      this.lista.push({ tramo: f.tramo, tramoActual: f.tramo, reubicaciones: 0, estado: 'pared', x: f.x, y: f.y, z, grupo, halo, zumbido, marcaHasta: 0 });
    });

    this.manos = Array.from(this.el.querySelectorAll('[mano-guante]'));
    this.construido = true;
  },

  // Marca el fragmento de ese tramo por `ms` milisegundos (lo usa el escaneo). Devuelve si había uno.
  marcar(tramo, ms) {
    // El del tramo donde está el jugador; si ahí no hay, el más cercano que quede más arriba
    const activos = this.lista.filter((x) => x.estado === 'pared' || x.estado === 'escondido');
    const f = activos.find((x) => x.tramoActual === tramo)
      || activos.filter((x) => x.estado === 'escondido' || x.tramoActual > tramo).sort((a, b) => a.y - b.y)[0];
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
    ['#reset-hueco-', '#reset-hueco-fondo-'].forEach((prefijo) => {
      const hueco = document.querySelector(`${prefijo}${indice}`);
      if (!hueco) return;
      hueco.setAttribute(
        'material',
        `color: ${COLORES.huecoEncendido}; emissive: ${COLORES.huecoEncendido}; emissiveIntensity: 0.7; roughness: 1; metalness: 0`
      );
    });
  },

  // Agarre libre (refugio) de un tramo más alto que el actual y por encima del jugador, o null
  buscarRefugio(f) {
    const datos = this.el.escalada;
    const rigY = document.querySelector('#rig').object3D.position.y;
    const cantidad = datos.refugios.length;
    for (let tramo = f.tramoActual + 1; tramo < cantidad; tramo++) {
      // Por encima del jugador y sin pisar el sitio de otro fragmento que sigue en la pared
      const libres = datos.refugios[tramo].filter(
        (r) => r.y > rigY + FRAGMENTO.alturaMinimaSobreJugador
          && !this.lista.some((o) => o !== f && o.estado === 'pared' && Math.hypot(o.x - r.x, o.y - r.y) < FRAGMENTO.separacionMinima)
      );
      if (!libres.length) continue;
      // Rota entre los refugios disponibles para que cada fragmento caiga en uno distinto
      return { tramo, sitio: libres[(f.tramo + f.reubicaciones) % libres.length] };
    }
    return null;
  },

  // El Glitch se come un fragmento que no se juntó. Con reubicar, intenta mandarlo a un agarre del tramo
  // siguiente; si no hay (o ya se completó el tercer tramo), queda 'comido' hasta que se esconde arriba.
  comer(tramo, reubicar = false, evento = 'fragmento-comido') {
    const f = this.lista.find((x) => x.tramo === tramo && x.estado === 'pared');
    if (!f) return;
    this.perdidos.add(tramo); // aunque después se junte de nuevo, ya se perdió: baja la medalla
    const refugio = reubicar ? this.buscarRefugio(f) : null;
    if (refugio) {
      f.reubicaciones += 1;
      f.tramoActual = refugio.tramo;
      f.x = refugio.sitio.x;
      f.y = refugio.sitio.y;
      f.z = frenteTramo(refugio.tramo) + FRAGMENTO.distanciaAlFrente;
      f.grupo.position.set(f.x, f.y, f.z);
      if (f.zumbido) f.zumbido.mover(f.x, f.y, f.z);
      this.el.emit(evento, { tramo, destino: 'tramo' }, false);
      return;
    }
    f.estado = 'comido';
    f.grupo.visible = false;
    if (f.zumbido) f.zumbido.silenciar(true);
    this.el.emit(evento, { tramo, destino: 'arriba' }, false);
  },

  // El jugador llegó a un piso sin juntar el fragmento de un tramo que ya pasó: el fragmento sube solo (a un
  // agarre de un tramo más alto o, si ya no hay, al piso de arriba). Cuenta como perdido para la medalla.
  subirSalteados(orden) {
    const datos = this.el.escalada;
    this.lista.forEach((f) => {
      if (f.estado === 'pared' && f.tramoActual < orden) this.comer(f.tramo, true, 'fragmento-salteado');
    });
    if (datos && orden >= datos.tramos.length) this.revelar(); // ya está arriba: aparecen enseguida
  },

  // Los fragmentos comidos reaparecen en el piso de arriba, entre los objetos de videojuegos pero a la vista
  revelar() {
    this.lista.forEach((f) => {
      if (f.estado !== 'comido') return;
      const sitio = FRAGMENTO.escondites[f.tramo % FRAGMENTO.escondites.length];
      f.estado = 'escondido';
      f.x = sitio.x;
      f.y = this.alturaFinal + FRAGMENTO.alturaEscondite;
      f.z = frenteTramo(ESCENARIO.tramos.length - 1) + sitio.z; // z medida desde el borde de adelante del piso de arriba
      f.grupo.position.set(f.x, f.y, f.z);
      f.grupo.visible = true;
      if (f.zumbido) {
        f.zumbido.mover(f.x, f.y, f.z);
        f.zumbido.silenciar(false);
      }
    });
    this.el.emit('fragmentos-revelados', {}, false);
  },

  // Vuelve a empezar: los tres fragmentos otra vez en la pared y los huecos del RESET apagados
  reiniciar() {
    const datos = this.el.escalada;
    this.lista.forEach((f, i) => {
      const origen = datos.fragmentos[i];
      f.estado = 'pared';
      f.tramoActual = f.tramo;
      f.reubicaciones = 0;
      f.x = origen.x;
      f.y = origen.y;
      f.z = frenteTramo(f.tramo) + FRAGMENTO.distanciaAlFrente;
      f.grupo.position.set(f.x, f.y, f.z);
      f.grupo.visible = true;
      f.marcaHasta = 0;
      if (f.zumbido) f.zumbido.detener();
      f.zumbido = crearZumbido(FRAGMENTO.sonido.frecuencias, FRAGMENTO.sonido.volumen, FRAGMENTO.sonido.distanciaMax, FRAGMENTO.sonido.cada, FRAGMENTO.sonido.duracion);
      if (f.zumbido) f.zumbido.mover(f.x, f.y, f.z);
    });
    this.recogidos = 0;
    this.perdidos.clear();
    Array.from({ length: FRAGMENTO.total }, (_, i) => i).forEach((i) => {
      ['#reset-hueco-', '#reset-hueco-fondo-'].forEach((prefijo) => {
        const hueco = document.querySelector(`${prefijo}${i}`);
        if (hueco) {
          hueco.setAttribute('material', `color: ${COLORES.hueco}; emissive: ${COLORES.hueco}; emissiveIntensity: 0; roughness: 1; metalness: 0`);
        }
      });
    });
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
        return this.posMano.distanceTo(f.grupo.position) <= (f.tramoActual >= 1 ? FRAGMENTO.radioRecogerDificil : FRAGMENTO.radioRecoger);
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
