// Introducción antes de escalar: una animación en primera persona de 23,6 s. Va en la <a-scene>.
//
// 1. Habitación (0–7 s): el jugador está en su cuarto a oscuras, de madrugada, frente a su setup. En la pantalla
//    corre un juego de plataformas; el reloj marca las 3:47. Subtítulo: «Una partida más y me voy a dormir...».
// 2. Glitch (7–12 s): la pantalla empieza a fallar de a poco (bloques lavanda y celeste que cambian despacio,
//    sin parpadeos) y aparece «¿SEGUÍS AHÍ?». Subtítulo: «¿Qué le pasa a la pantalla?».
// 3. Abducción (12–16,3 s): salen píxeles de la pantalla que giran en espiral alrededor del jugador, la luz se
//    vuelve lavanda y la pantalla crece y avanza hasta envolverlo; la vista se funde a lavanda.
// 4. Llegada (16,3–22,4 s): aparece frente al setup gigante (fundido desde lavanda). Subtítulo: «Te atrapó el
//    Glitch. Juntá los 3 fragmentos y golpeá el RESET para escapar.».
// 5. Recorrido (desde 22,4 s): empieza frente al botón RESET y baja hasta el pie del teclado, parando frente a
//    cada fragmento (monitor, torre y teclado), que se marca como con el escaneo. Un subtítulo dice qué es cada
//    cosa. Al final, fundido a negro y queda al pie del teclado, listo para escalar.
//
// Comodidad: en la habitación el jugador no se mueve; lo que se mueve es la pantalla. En el recorrido, con casco
// pasa de una parada a otra con fundidos; en la compu baja deslizándose a velocidad constante (INTRO.recorrido).
// No se puede saltear: explica el objetivo del juego. Mientras dura no se camina, no se escanea, no se juntan
// fragmentos, no hay caídas ni límites (escena.introActiva), y agarrar no arranca el cronómetro ni la niebla.
// Se repite al volver a jugar salvo que INTRO.soloLaPrimeraVez sea true.
// Tiempos, textos, medidas y colores: INTRO y COLORES.habitacion / COLORES.subtitulo en src/config.js.
import '@fontsource/lilita-one/latin-400.css';
import '@fontsource/fredoka/latin-500.css';
import { CAIDA, COLORES, INTRO } from '../config.js';
import { construirHabitacion } from '../habitacion.js';
import { posicionReset } from '../plataformas.js';
import { lugarFrenteAlTramo } from '../utilidades.js';
import { blipGlitch, deslizar } from '../sonidos.js';

const FUENTE_JUEGO = '"Lilita One", system-ui, sans-serif';
const FUENTE_TEXTO = '"Fredoka", system-ui, sans-serif';
const H = COLORES.habitacion;
const T = INTRO.tiempos;

const R = INTRO.recorrido;
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
const acotar = (v, a, b) => Math.min(b, Math.max(a, v));
const entre = (t, desde, hasta) => acotar((t - desde) / (hasta - desde), 0, 1);

AFRAME.registerComponent('intro', {
  init() {
    this.escena = this.el;
    this.escena.introActiva = false;
    this.vista = false;
    this.t = 0;
    this.hechos = {}; // momentos de la línea de tiempo que ya pasaron
    this.terminando = false;
    this.ultimoDibujo = -1;
    this.subtituloActual = null;
    this.camara = null;
    this.v = {
      cam: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      obj: new THREE.Vector3(),
      tmp: new THREE.Vector3(),
      perp: new THREE.Vector3(),
    };
    this.colorPantalla = new THREE.Color(H.luzPantalla);
    this.colorAbduccion = new THREE.Color(H.luzAbduccion);

    this.cuarto = construirHabitacion(this.escena);
    this.pantallaInicial = { pos: this.cuarto.pantalla.position.clone() };
    this.crearSubtitulo();
    this.crearPixeles();
    this.dibujarPantalla(0, 0, 0);

    this.escena.addEventListener('inicio-cerrado', () => this.empezar());

    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load(`40px ${FUENTE_JUEGO}`), document.fonts.load(`500 40px ${FUENTE_TEXTO}`)])
        .then(() => this.subtituloActual && this.dibujarSubtitulo(this.subtituloActual))
        .catch(() => {});
    }
  },

  // ---------- Piezas ----------

  crearSubtitulo() {
    const S = INTRO.subtitulo;
    this.canvasSub = document.createElement('canvas');
    this.canvasSub.width = Math.round(S.ancho * S.pixelesPorMetro);
    this.canvasSub.height = Math.round(S.alto * S.pixelesPorMetro);
    this.texturaSub = new THREE.CanvasTexture(this.canvasSub);
    this.texturaSub.colorSpace = THREE.SRGBColorSpace;
    // Opaco y a 70 cm de la cara (delante del monitor), así nada queda entre el subtítulo y los ojos. Con prueba de profundidad:
    // sin ella WebGL tampoco guarda la profundidad y los carteles transparentes de atrás se le dibujaban encima
    this.subtitulo = new THREE.Mesh(
      new THREE.PlaneGeometry(S.ancho, S.alto),
      new THREE.MeshBasicMaterial({ map: this.texturaSub, alphaTest: 0.5, fog: false })
    );
    this.subtitulo.visible = false;
    this.escena.object3D.add(this.subtitulo);
  },

  crearPixeles() {
    const n = INTRO.pixeles;
    this.pixeles = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ fog: false, toneMapped: false }),
      n
    );
    this.pixeles.frustumCulled = false;
    this.pixeles.visible = false;
    const color = new THREE.Color();
    this.datosPixel = [];
    for (let i = 0; i < n; i++) {
      this.pixeles.setColorAt(i, color.set(H.glitch[i % H.glitch.length]));
      this.datosPixel.push({ activo: false, desde: new THREE.Vector3(), hasta: new THREE.Vector3(), u: 0, vida: 1, angulo: 0, radio: 0, tamano: 0 });
    }
    this.auxiliar = new THREE.Object3D();
    this.auxiliar.scale.setScalar(0);
    this.auxiliar.updateMatrix();
    for (let i = 0; i < n; i++) this.pixeles.setMatrixAt(i, this.auxiliar.matrix);
    this.escena.object3D.add(this.pixeles);
    this.porNacer = 0;
  },

  // ---------- Flujo ----------

  // ¿Se ve al volver a jugar? (si es false, la partida nueva arranca directo)
  seRepite() {
    return !INTRO.soloLaPrimeraVez;
  },

  empezar() {
    if (this.escena.introActiva) return;
    if (this.vista && INTRO.soloLaPrimeraVez) return;
    this.vista = true;
    this.escena.introActiva = true;
    this.terminando = false;
    this.t = 0;
    this.hechos = {};
    this.parada = null;
    this.viaje = null;
    document.body.classList.add('en-intro'); // la ayuda del modo escritorio se esconde mientras dura

    // Arranca en negro y aparece en su habitación
    const fundido = this.fundido();
    fundido.color(CAIDA.colorFundido);
    fundido.opacidad = 1;
    fundido.material.opacity = 1;
    fundido.esfera.visible = true;
    fundido.ir(0, T.entrada * 1000);

    this.irA(INTRO.habitacion.x, 0, 0, INTRO.inclinacionHabitacion);
    this.luzAmbiente(INTRO.luzAmbienteHabitacion);
    this.mostrarInterfazDeJuego(false); // la pulsera y los anillos aparecen recién adentro del juego
  },

  async terminar() {
    if (this.terminando) return;
    this.terminando = true;
    const fundido = this.fundido();
    await fundido.ir(1, T.duracionFin * 1000);

    this.parada = null;
    this.viaje = null;
    this.subtitulo.visible = false;
    this.pixeles.visible = false;
    this.datosPixel.forEach((p) => (p.activo = false));
    this.cuarto.pantalla.position.copy(this.pantallaInicial.pos);
    this.cuarto.pantalla.scale.setScalar(1);
    this.luzAmbiente(null);
    this.mostrarInterfazDeJuego(true);
    this.irA(0, 0, lugarFrenteAlTramo(0), 0);
    this.escena.introActiva = false;
    document.body.classList.remove('en-intro');
    this.escena.emit('intro-terminada', {}, false);

    await fundido.ir(0, T.duracionFin * 1000);
    fundido.color(CAIDA.colorFundido);
  },

  fundido() {
    return document.querySelector('#camara').components.fundido;
  },

  // Pone al jugador en un lugar; en la compu, además, lo hace mirar de frente con la inclinación dada
  irA(x, y, z, inclinacion) {
    const rig = document.querySelector('#rig');
    if (rig) rig.object3D.position.set(x, y, z);
    if (this.escena.is('vr-mode')) return;
    const mirar = document.querySelector('#camara').components['look-controls'];
    if (mirar && mirar.pitchObject) {
      mirar.pitchObject.rotation.x = inclinacion;
      mirar.yawObject.rotation.y = 0;
    }
  },

  // Baja la luz ambiente de la sala mientras está en la habitación (null: la deja como estaba)
  luzAmbiente(intensidad) {
    if (!this.ambiente) {
      this.ambiente = [...this.escena.querySelectorAll('[light]')].find((e) => e.getAttribute('light').type === 'ambient');
      if (this.ambiente) this.intensidadOriginal = this.ambiente.getAttribute('light').intensity;
    }
    if (!this.ambiente) return;
    this.ambiente.setAttribute('light', 'intensity', intensidad === null ? this.intensidadOriginal : intensidad);
  },

  mostrarInterfazDeJuego(visible) {
    const izq = document.querySelector('#mano-izq');
    const der = document.querySelector('#mano-der');
    [izq && izq.getObject3D('pulsera'), izq && izq.getObject3D('anillo'), der && der.getObject3D('anillo')].forEach((o) => {
      if (o) o.visible = visible;
    });
  },

  // ---------- Recorrido: del RESET al pie del teclado ----------

  // Paradas en orden: el RESET, los fragmentos de arriba hacia abajo y el pie del teclado
  armarParadas() {
    const datos = this.escena.escalada;
    const fragmentos = this.escena.components.fragmentos;
    const paradas = [];
    if (datos) {
      const r = posicionReset(datos.alturaFinal);
      paradas.push({ rig: new THREE.Vector3(r.x, datos.alturaFinal, r.z + R.distanciaReset), mira: new THREE.Vector3(r.x, r.y, r.z), texto: R.textos.reset });
    }
    const enLaPared = fragmentos ? fragmentos.lista.filter((f) => f.estado === 'pared').sort((a, b) => b.tramo - a.tramo) : [];
    enLaPared.forEach((f) => {
      paradas.push({
        rig: new THREE.Vector3(f.x, f.y - this.alturaOjos() + R.sobreLaMirada, f.z + R.distanciaFragmento),
        mira: new THREE.Vector3(f.x, f.y, f.z),
        texto: R.textos.fragmento[f.tramo] || '',
        fragmento: f,
      });
    });
    const base = lugarFrenteAlTramo(0);
    paradas.push({ rig: new THREE.Vector3(0, 0, base), mira: new THREE.Vector3(0, this.alturaOjos() - 0.25, base - 3), texto: R.textos.base, ultima: true });
    return paradas;
  },

  alturaOjos() {
    const camara = document.querySelector('#camara');
    const y = camara ? camara.object3D.position.y : 0;
    return y > 0.5 ? y : 1.6;
  },

  // Inclinación (en la compu) para mirar el punto `mira` desde `rig`
  inclinacionHacia(rig, mira) {
    const dy = mira.y - (rig.y + this.alturaOjos());
    const dz = Math.hypot(mira.x - rig.x, mira.z - rig.z);
    return Math.atan2(dy, Math.max(dz, 0.1));
  },

  llegarA(parada) {
    this.parada = parada;
    this.irA(parada.rig.x, parada.rig.y, parada.rig.z, this.inclinacionHacia(parada.rig, parada.mira));
    // El fragmento se marca como con el escaneo mientras dura la parada
    if (parada.fragmento) parada.fragmento.marcaHasta = performance.now() + (R.pausa + R.fundido * 2 + 1) * 1000;
  },

  async recorrer() {
    const paradas = this.armarParadas();
    const fundido = this.fundido();
    const conFundidos = this.escena.is('vr-mode') && R.enVR === 'fundido';

    await fundido.ir(1, R.fundido * 1000);
    if (this.terminando) return;
    this.llegarA(paradas[0]);
    await fundido.ir(0, R.fundido * 1000);

    for (let i = 0; i < paradas.length - 1; i++) {
      await esperar(R.pausa * 1000);
      if (this.terminando || !this.escena.introActiva) return;
      if (conFundidos) {
        await fundido.ir(1, R.fundido * 1000);
        this.llegarA(paradas[i + 1]);
        await fundido.ir(0, R.fundido * 1000);
      } else {
        await this.deslizar(paradas[i], paradas[i + 1]);
      }
    }
    await esperar(R.pausaUltima * 1000);
    this.terminar();
  },

  // Va de una parada a la otra en línea recta y a velocidad constante; la mirada pasa de un punto al otro
  deslizar(desde, hasta) {
    return new Promise((resolver) => {
      this.viaje = {
        desde,
        hasta,
        largo: desde.rig.distanceTo(hasta.rig),
        recorrido: 0,
        inclinacionDesde: this.inclinacionHacia(desde.rig, desde.mira),
        inclinacionHasta: this.inclinacionHacia(hasta.rig, hasta.mira),
        resolver,
      };
      this.parada = { texto: null }; // en el viaje no hay subtítulo
    });
  },

  avanzarViaje(s) {
    const v = this.viaje;
    v.recorrido += R.velocidad * s;
    const u = v.largo > 0 ? Math.min(v.recorrido / v.largo, 1) : 1;
    const pos = this.v.tmp.lerpVectors(v.desde.rig, v.hasta.rig, u);
    this.irA(pos.x, pos.y, pos.z, v.inclinacionDesde + (v.inclinacionHasta - v.inclinacionDesde) * u);
    if (u >= 1) {
      this.viaje = null;
      this.llegarA(v.hasta);
      v.resolver();
    }
  },

  // ---------- Línea de tiempo ----------

  tick(tiempo, dt) {
    if (!this.escena.introActiva || !dt) return;
    const s = Math.min(dt, 100) / 1000;
    this.t += s;
    const t = this.t;

    // Momentos puntuales
    const una = (clave, accion) => {
      if (!this.hechos[clave]) {
        this.hechos[clave] = true;
        accion();
      }
    };
    if (t >= T.glitch) una('glitch', () => blipGlitch());
    if (t >= T.abduccion) una('abduccion', () => deslizar());
    if (t >= T.tragado && !this.terminando) {
      una('tragado', () => {
        const fundido = this.fundido();
        fundido.color(H.fundidoAbduccion);
        fundido.ir(1, T.duracionTragado * 1000);
      });
    }
    if (t >= T.llegada && !this.terminando) {
      una('llegada', () => {
        this.pixeles.visible = false;
        this.datosPixel.forEach((p) => (p.activo = false));
        this.luzAmbiente(null);
        this.mostrarInterfazDeJuego(true);
        this.irA(0, 0, INTRO.miradorZ, INTRO.inclinacionMirador);
        this.fundido().ir(0, T.duracionLlegada * 1000);
      });
    }
    if (t >= T.fin) una('fin', () => this.recorrer());
    if (this.terminando) return;
    if (this.viaje) this.avanzarViaje(s);

    // Habitación: pantalla, luz, ventilador y abducción
    const g = entre(t, T.glitch, T.abduccion); // cuánto falla la pantalla
    const a = entre(t, T.abduccion, T.tragado); // cuánto avanzó la abducción
    if (t < T.llegada) {
      this.cuarto.aspas.rotation.x += s * 9;
      if (Math.floor(t * INTRO.pantalla.fps) !== this.ultimoDibujo) {
        this.ultimoDibujo = Math.floor(t * INTRO.pantalla.fps);
        this.dibujarPantalla(t, g, a);
      }
      this.animarLuz(g, a);
      this.animarAbduccion(a);
      this.animarPixeles(t, s);
    }

    this.actualizarSubtitulo(t, s);
  },

  animarLuz(g, a) {
    const luz = this.cuarto.luzPantalla;
    const L = INTRO.luzPantalla;
    luz.color.copy(this.colorPantalla).lerp(this.colorAbduccion, Math.max(g * 0.4, a));
    luz.intensity = L.intensidad + (L.intensidadAbduccion - L.intensidad) * a;
  },

  // La pantalla crece y avanza hacia la cabeza del jugador hasta envolverlo
  animarAbduccion(a) {
    const pantalla = this.cuarto.pantalla;
    if (a <= 0) return;
    this.camaraEnElCuarto(this.v.cam);
    const destino = this.v.obj.set(this.v.cam.x, this.v.cam.y, this.v.cam.z - 0.25);
    pantalla.position.lerpVectors(this.pantallaInicial.pos, destino, a);
    pantalla.scale.setScalar(1 + (INTRO.escalaPantallaFinal - 1) * a);
  },

  // Posición de la cámara en coordenadas de la habitación
  camaraEnElCuarto(destino) {
    if (!this.camara) this.camara = document.querySelector('#camara');
    this.camara.object3D.getWorldPosition(destino);
    return this.cuarto.grupo.worldToLocal(destino);
  },

  animarPixeles(t, s) {
    const activo = t >= T.abduccion - 1.5 && t < T.llegada;
    this.pixeles.visible = activo;
    if (!activo) return;
    // Primero salen unos pocos; durante la abducción, muchos
    const ritmo = t < T.abduccion ? 25 : 110;
    this.porNacer += ritmo * s;
    const cuarto = this.cuarto;
    if (!this.camara) this.camara = document.querySelector('#camara');
    this.camara.object3D.getWorldPosition(this.v.cam);

    this.datosPixel.forEach((p, i) => {
      if (!p.activo && this.porNacer >= 1) {
        this.porNacer -= 1;
        p.activo = true;
        p.u = 0;
        p.vida = INTRO.vidaPixel[0] + Math.random() * (INTRO.vidaPixel[1] - INTRO.vidaPixel[0]);
        p.angulo = Math.random() * Math.PI * 2;
        p.radio = 0.25 + Math.random() * 0.45;
        p.tamano = INTRO.tamanoPixel[0] + Math.random() * (INTRO.tamanoPixel[1] - INTRO.tamanoPixel[0]);
        // Nace en un punto de la pantalla y va hacia la cabeza (con un poco de desvío)
        const P = cuarto.pantalla;
        const escala = P.scale.x;
        p.desde.set(
          (Math.random() - 0.5) * INTRO.pantalla.ancho * escala,
          (Math.random() - 0.5) * INTRO.pantalla.alto * escala,
          0.02
        );
        P.localToWorld(p.desde);
        p.hasta.set(
          this.v.cam.x + (Math.random() - 0.5) * 0.6,
          this.v.cam.y + (Math.random() - 0.5) * 0.5,
          this.v.cam.z + 0.6 + Math.random() * 0.6
        );
      }
      const aux = this.auxiliar;
      if (p.activo) {
        p.u += s / p.vida;
        if (p.u >= 1) p.activo = false;
      }
      if (!p.activo) {
        aux.scale.setScalar(0);
      } else {
        // Recorrido en espiral alrededor de la línea que va de la pantalla a la cabeza
        const u = p.u;
        const eje = this.v.dir.subVectors(p.hasta, p.desde).normalize();
        const perp1 = this.v.tmp.set(0, 1, 0).cross(eje).normalize();
        const perp2 = this.v.perp.crossVectors(eje, perp1);
        const ang = p.angulo + u * INTRO.giroPixel * Math.PI * 2;
        const r = p.radio * Math.sin(Math.PI * u);
        aux.position
          .lerpVectors(p.desde, p.hasta, u)
          .addScaledVector(perp1, Math.cos(ang) * r)
          .addScaledVector(perp2, Math.sin(ang) * r);
        aux.rotation.set(u * 4, u * 3, 0);
        aux.scale.setScalar(p.tamano * Math.sin(Math.PI * Math.min(u * 1.3, 1)));
      }
      aux.updateMatrix();
      this.pixeles.setMatrixAt(i, aux.matrix);
    });
    this.pixeles.instanceMatrix.needsUpdate = true;
  },

  // ---------- Subtítulos ----------

  actualizarSubtitulo(t, s) {
    const actual = INTRO.subtitulos.find(([desde, hasta]) => t >= desde && t < hasta);
    const texto = this.hechos.fin ? (this.parada && this.parada.texto) || null : actual ? actual[2] : null;
    if (texto !== this.subtituloActual) {
      this.subtituloActual = texto;
      if (texto) this.dibujarSubtitulo(texto);
      this.subtitulo.visible = !!texto;
      if (texto) this.colocarSubtitulo(1);
    }
    if (texto) this.colocarSubtitulo(this.hechos.fin ? 1 : Math.min(INTRO.subtitulo.suavizado * s, 1));
  },

  // Un poco por encima de la mirada, siguiendo la cabeza con retraso
  colocarSubtitulo(mezcla) {
    if (!this.camara) this.camara = document.querySelector('#camara');
    const S = INTRO.subtitulo;
    const { cam, dir, obj } = this.v;
    this.camara.object3D.getWorldPosition(cam);
    this.camara.object3D.getWorldDirection(dir).negate();
    dir.y = 0;
    if (dir.lengthSq() < 1e-4) dir.set(0, 0, -1);
    dir.normalize();
    const arriba = this.hechos.fin ? R.subtituloSobreLaMirada : S.sobreLaMirada;
    obj.copy(cam).addScaledVector(dir, S.distancia).setY(cam.y + arriba);
    this.subtitulo.position.lerp(obj, mezcla);
    this.subtitulo.lookAt(cam.x, this.subtitulo.position.y, cam.z);
  },

  dibujarSubtitulo(texto) {
    const C = COLORES.subtitulo;
    const w = this.canvasSub.width;
    const h = this.canvasSub.height;
    const ctx = this.canvasSub.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = C.fondo;
    ctx.beginPath();
    ctx.roundRect(2, 2, w - 4, h - 4, h * 0.2);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let tamano = h * 0.3;
    let lineas;
    do {
      ctx.font = `500 ${tamano}px ${FUENTE_TEXTO}`;
      lineas = this.partirEnLineas(ctx, texto, w * 0.9);
      tamano -= 2;
    } while (lineas.length > 2 && tamano > 10);
    ctx.fillStyle = C.texto;
    const alturaLinea = tamano * 1.2;
    const centro = h * 0.5;
    lineas.forEach((linea, i) => ctx.fillText(linea, w / 2, centro + (i - (lineas.length - 1) / 2) * alturaLinea));
    this.texturaSub.needsUpdate = true;
  },

  partirEnLineas(ctx, texto, anchoMaximo) {
    const lineas = [];
    let actual = '';
    texto.split(' ').forEach((palabra) => {
      const prueba = actual ? `${actual} ${palabra}` : palabra;
      if (actual && ctx.measureText(prueba).width > anchoMaximo) {
        lineas.push(actual);
        actual = palabra;
      } else actual = prueba;
    });
    if (actual) lineas.push(actual);
    return lineas;
  },

  // ---------- Pantalla del monitor ----------

  // Un juego de plataformas simple; con `g` aparecen bloques del glitch y con `a` la pantalla se vuelve un túnel lavanda
  dibujarPantalla(t, g, a) {
    const canvas = this.cuarto.canvasPantalla;
    const w = canvas.width;
    const h = canvas.height;
    const ctx = canvas.getContext('2d');

    const cielo = ctx.createLinearGradient(0, 0, 0, h);
    cielo.addColorStop(0, H.cieloJuego[0]);
    cielo.addColorStop(1, H.cieloJuego[1]);
    ctx.fillStyle = cielo;
    ctx.fillRect(0, 0, w, h);

    // Montañas que pasan despacio
    ctx.fillStyle = H.montanaJuego;
    const corrimiento = (t * 18) % (w / 2);
    for (let k = -1; k < 4; k++) {
      const x = k * (w / 2) - corrimiento;
      ctx.beginPath();
      ctx.moveTo(x, h * 0.75);
      ctx.lineTo(x + w * 0.25, h * 0.35);
      ctx.lineTo(x + w * 0.5, h * 0.75);
      ctx.fill();
    }
    // Plataformas
    ctx.fillStyle = H.plataformaJuego;
    const paso = w / 3;
    const avance = (t * 70) % paso;
    for (let k = -1; k < 5; k++) {
      const alturaPlataforma = h * (0.72 + 0.08 * Math.sin(k * 1.7));
      ctx.fillRect(k * paso - avance, alturaPlataforma, paso * 0.7, h * 0.05);
    }
    ctx.fillRect(0, h * 0.9, w, h * 0.1);
    // Personaje que salta
    const salto = Math.abs(Math.sin(t * 3)) * h * 0.18;
    ctx.fillStyle = H.personajeJuego;
    ctx.fillRect(w * 0.3, h * 0.62 - salto, w * 0.035, h * 0.09);
    // Marcador
    ctx.fillStyle = '#fffaf0';
    ctx.font = `${h * 0.07}px ${FUENTE_JUEGO}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('NIVEL 99', w * 0.04, h * 0.05);

    // Glitch: bloques que cambian tres veces por segundo (despacio, sin parpadeo)
    if (g > 0) {
      let semilla = Math.floor(t * 3) * 9301 + 49297;
      const azar = () => {
        semilla = (semilla * 9301 + 49297) % 233280;
        return semilla / 233280;
      };
      const cantidad = Math.floor(g * 45);
      for (let k = 0; k < cantidad; k++) {
        ctx.globalAlpha = 0.35 + 0.5 * g;
        ctx.fillStyle = H.glitch[k % H.glitch.length];
        const lado = (0.03 + azar() * 0.09) * w;
        ctx.fillRect(azar() * w, azar() * h, lado, lado * (0.3 + azar()));
      }
      ctx.globalAlpha = 1;
      if (g > 0.4) {
        ctx.globalAlpha = Math.min((g - 0.4) / 0.4, 1);
        ctx.fillStyle = 'rgba(29, 23, 39, 0.7)';
        ctx.fillRect(w * 0.2, h * 0.36, w * 0.6, h * 0.24);
        ctx.fillStyle = '#efe6ff';
        ctx.font = `${h * 0.13}px ${FUENTE_JUEGO}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('¿SEGUÍS AHÍ?', w / 2, h * 0.48);
        ctx.globalAlpha = 1;
      }
    }

    // Abducción: la pantalla se llena de lavanda y se abre un túnel de cuadrados hacia adentro
    if (a > 0) {
      ctx.globalAlpha = Math.min(a * 1.2, 0.92);
      ctx.fillStyle = H.luzAbduccion;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.lineWidth = h * 0.02;
      for (let k = 0; k < 8; k++) {
        const f = (k / 8 + t * 0.5) % 1;
        ctx.strokeStyle = H.glitch[k % H.glitch.length];
        ctx.globalAlpha = 0.6 * a * (1 - f);
        ctx.strokeRect(w / 2 - (f * w) / 2, h / 2 - (f * h) / 2, f * w, f * h);
      }
      ctx.globalAlpha = 1;
    }

    this.cuarto.texturaPantalla.needsUpdate = true;
  },

  remove() {
    this.escena.object3D.remove(this.subtitulo);
    this.escena.object3D.remove(this.pixeles);
    this.escena.object3D.remove(this.cuarto.grupo);
  },
});
