// Generador de la escalada. Arma, a partir de ESCENARIO en config.js, la distribución de agarres de
// los tres tramos (teclado, torre de PC y monitor). No usa A-Frame: solo calcula posiciones.
//
// Cada tramo es una pared amplia sin camino marcado, pero siempre se puede subir:
//   1. Se arma una RUTA GARANTIZADA en zigzag, que se va corriendo hacia los costados, con agarres a
//      distancias alcanzables. Su separación vertical y los tipos especiales aumentan hacia arriba.
//   2. Se agregan dos filas de SALIDA sobre el piso del tramo (así se puede empezar a escalar desde
//      cualquier lado) y se RELLENA la pared con agarres parejos, sin dejar huecos grandes.
//   3. Se ubican los fragmentos (el del tramo 1 en el camino, los demás a un costado, con un desvío).
//   4. Se PODAN los agarres que no llevan a ningún lado: cada agarre de relleno tiene que poder alcanzarse
//      desde abajo y tiene que tener un camino hacia arriba (hasta el reborde del tope).
//   5. Se reservan los REFUGIOS (adonde el Glitch puede llevar un fragmento que se come) y se ubica el
//      enchufe de la TIROLESA, lejos de la ruta, con una cadena de agarres que lleva hasta él.
// La misma semilla da siempre la misma pared, así todos prueban lo mismo.
import { ESCENARIO, TIROLESA } from './config.js';
import { frenteTramo, lugarFrenteAlTramo } from './utilidades.js';

// Generador de números al azar con semilla (mulberry32)
function crearAzar(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CON_TIEMPO = ['lata', 'intermitente']; // agarres que no se pueden sostener indefinidamente
const entre = (a, b, t) => a + (b - a) * t;
const limitar = (v, min, max) => Math.max(min, Math.min(max, v));
const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Devuelve { agarres, paneles, fragmentos, refugios, checkpoints, tramos, bordes, tirolesa, frentes,
//            alturaFinal, tramoEn }
export function generarEscalada() {
  const E = ESCENARIO;
  const azar = crearAzar(E.semilla);

  // Alturas de cada tramo: y0 es el piso donde empieza y y1 el piso de arriba (su checkpoint)
  let base = 0;
  const tramos = E.tramos.map((t, indice) => {
    const y0 = base;
    base += t.alto;
    const yBorde = base - E.borde.bajoElTope; // altura del reborde de arriba
    return {
      ...t,
      indice,
      y0,
      y1: base,
      frente: frenteTramo(indice),
      yBorde,
      desdeNodos: y0 + E.primerAgarre,
      hastaNodos: yBorde - 0.45, // la ruta termina a una mano del reborde
    };
  });
  const alturaFinal = base; // piso de arriba de todo (donde está el RESET)
  const frentes = tramos.map((t) => t.frente);
  const tramoEn = (y) => tramos.find((t) => y < t.y1 - 0.05) || tramos[tramos.length - 1];

  // Un checkpoint por tramo: su piso está arriba de la pared, entre ella y la pared del tramo siguiente
  const checkpoints = tramos.map((t) => {
    const ultimo = t.indice === tramos.length - 1;
    return {
      orden: t.indice + 1,
      y: t.y1,
      zMax: t.frente,
      zMin: ultimo ? E.final.fondoZ : tramos[t.indice + 1].frente,
      spawnZ: ultimo ? E.final.spawnZ : lugarFrenteAlTramo(t.indice + 1),
    };
  });

  const progreso = (t, y) => limitar((y - t.desdeNodos) / (t.hastaNodos - t.desdeNodos), 0, 1);

  // Tipo de agarre según las reglas del tramo y qué tan avanzado está
  const elegirTipo = (t, p) => {
    for (const regla of t.reglas) {
      if (p >= regla.desde && azar() < regla.prob) return regla.tipo;
    }
    return 'firme';
  };
  const nuevoAgarre = (t, tipo, x, y, extra = {}) => ({
    tipo,
    tramo: t.indice,
    x,
    y,
    fase: tipo === 'intermitente' ? +(azar() * 5).toFixed(2) : 0,
    ...extra,
  });

  // 1. Ruta garantizada de cada tramo, en zigzag y de abajo hacia arriba. El centro del zigzag se va
  // corriendo hacia los costados para aprovechar todo el ancho de la pared.
  const rutas = tramos.map((t) => {
    const nodos = [nuevoAgarre(t, 'firme', 0, t.desdeNodos, { ruta: true })];
    let lado = 1;
    let centro = 0;
    let guardia = 0;
    while (nodos[nodos.length - 1].y < t.hastaNodos - 0.05 && guardia++ < 200) {
      const anterior = nodos[nodos.length - 1];
      const p = progreso(t, anterior.y);
      lado = -lado;

      centro = limitar(centro + (azar() - 0.5) * 1.1, -(t.xMax - 1.6), t.xMax - 1.6);
      let x = limitar(centro + lado * entre(t.amplitud[0], t.amplitud[1], azar()) + (azar() - 0.5) * 0.3, -t.xMax, t.xMax);
      let dx = x - anterior.x;
      const saltoMax = t.distanciaMax - 0.3;
      if (Math.abs(dx) > saltoMax) {
        x = anterior.x + Math.sign(dx) * saltoMax;
        dx = x - anterior.x;
      }
      // Cuanto más se estira hacia el costado, menos sube, para no pasarse de la distancia máxima
      const dyBase = entre(t.paso[0], t.paso[1], p) * entre(0.85, 1.15, azar());
      const dyMax = Math.sqrt(Math.max(t.distanciaMax ** 2 - dx * dx, 0.09));
      const y = Math.min(anterior.y + Math.max(Math.min(dyBase, dyMax), 0.3), t.hastaNodos);

      const punto = { x, y };
      // Después de un agarre con tiempo (lata o bloque) viene uno seguro, para poder apoyarse y esperar
      let tipo = elegirTipo(t, progreso(t, punto.y));
      if (CON_TIEMPO.includes(anterior.tipo) && CON_TIEMPO.includes(tipo)) tipo = 'firme';
      nodos.push(nuevoAgarre(t, tipo, punto.x, punto.y, { ruta: true }));
    }
    return nodos;
  });

  // Los paneles que giran reemplazan agarres de la ruta (el panel trae sus propios agarres)
  const paneles = [];
  tramos.forEach((t) => {
    const ruta = rutas[t.indice];
    t.paneles.forEach((fraccion) => {
      const objetivo = t.desdeNodos + fraccion * (t.hastaNodos - t.desdeNodos);
      let mejor = null;
      ruta.forEach((n, i) => {
        // Un panel necesita lugar para girar: no puede estar cerca del piso ni del reborde
        if (i === 0 || i === ruta.length - 1 || n.tipo === 'panel') return;
        if (n.y < t.y0 + 1.8 || n.y > t.y1 - 1.8) return;
        // Dos paneles no pueden pisarse: miden 0,8 m de alto, así que se pide bastante separación
        if (paneles.some((p) => p.tramo === t.indice && Math.abs(p.y - n.y) < 1.7)) return;
        if (!mejor || Math.abs(n.y - objetivo) < Math.abs(mejor.y - objetivo)) mejor = n;
      });
      if (mejor) {
        // Los agarres vecinos de un panel son seguros (el panel es lo que tiene tiempo)
        const i = ruta.indexOf(mejor);
        [ruta[i - 1], ruta[i + 1]].forEach((vecino) => {
          if (vecino && CON_TIEMPO.includes(vecino.tipo)) vecino.tipo = 'firme';
        });
        mejor.tipo = 'panel';
        // Todos los paneles giran a la par: se puede pasar de uno al siguiente sin esperar
        paneles.push({ tramo: t.indice, x: mejor.x, y: mejor.y, fase: 0 });
      }
    });
  });

  const agarres = rutas.flat().filter((n) => n.tipo !== 'panel');
  const nodosDePanel = () =>
    paneles.flatMap((p) => [
      { x: p.x - E.panel.separacionAgarres, y: p.y, tramo: p.tramo },
      { x: p.x + E.panel.separacionAgarres, y: p.y, tramo: p.tramo },
    ]);
  const ocupadas = (tramo) => [...agarres.filter((a) => a.tramo === tramo), ...nodosDePanel().filter((n) => n.tramo === tramo)];
  const enAreaDePanel = (tramo, x, y) => paneles.some((p) => p.tramo === tramo && Math.abs(x - p.x) < 1 && Math.abs(y - p.y) < 0.75);

  // 2. Agarres de salida y relleno parejo de la pared
  tramos.forEach((t) => {
    // Unos pocos agarres bajos, bien separados, para empezar a escalar sin caminar mucho por el piso
    for (let x = -t.xMax + 0.6; x <= t.xMax - 0.5; x += 2.2) {
      if (ocupadas(t.indice).some((o) => distancia(o, { x, y: t.desdeNodos }) < 1.0)) continue;
      agarres.push(nuevoAgarre(t, 'firme', x, t.desdeNodos, { salida: true }));
    }
    // Relleno por "mejor candidato": cada agarre nuevo va al lugar más alejado de todos los demás entre varios
    // puntos al azar, pero siempre al alcance de al menos dos agarres que ya existen (así nunca queda un
    // agarre aislado). Quedan repartidos parejo, sin amontonarse ni dejar huecos, y se frena cuando no hay
    // lugar con la separación del tramo: son los justos, no se llena toda la pared.
    const alcance = t.distanciaMax * E.alcancePoda;
    for (let vuelta = 0; vuelta < 400; vuelta++) {
      const vecinos = ocupadas(t.indice);
      let mejor = null;
      let mejorDistancia = -1;
      for (let k = 0; k < 150; k++) {
        const punto = { x: entre(-t.xMax, t.xMax, azar()), y: entre(t.desdeNodos, t.hastaNodos + 0.2, azar()) };
        if (enAreaDePanel(t.indice, punto.x, punto.y)) continue;
        const distancias = vecinos.map((o) => distancia(o, punto));
        const d = Math.min(...distancias);
        if (d < t.separacion || distancias.filter((x) => x <= alcance).length < 2) continue;
        if (d > mejorDistancia) {
          mejorDistancia = d;
          mejor = punto;
        }
      }
      if (!mejor) break;
      agarres.push(nuevoAgarre(t, elegirTipo(t, progreso(t, mejor.y)), mejor.x, mejor.y, { relleno: true }));
    }
  });

  // Cadena de agarres firmes que lleva de un punto a otro (para los fragmentos y la tirolesa)
  const cadena = (t, desde, hasta) => {
    const pasos = Math.max(1, Math.ceil(distancia(desde, hasta) / 0.7));
    for (let k = 1; k <= pasos; k++) {
      const f = k / pasos;
      const punto = { x: entre(desde.x, hasta.x, f), y: entre(desde.y, hasta.y, f) };
      // Si ya hay un agarre de relleno muy cerca, se lo reemplaza por el de la cadena
      for (let j = agarres.length - 1; j >= 0; j--) {
        const a = agarres[j];
        if (a.tramo === t.indice && !a.ruta && !a.desvio && !a.salida && distancia(a, punto) < E.separacionMinima) agarres.splice(j, 1);
      }
      agarres.push(nuevoAgarre(t, 'firme', punto.x, punto.y, { desvio: true }));
    }
  };

  // 3. Fragmentos: uno por tramo. El del tramo 1 está en el camino; los demás, a un costado con un desvío
  const fragmentos = [];
  tramos.forEach((t) => {
    const ruta = rutas[t.indice].filter((n) => n.tipo !== 'panel');
    const objetivo = t.desdeNodos + t.fragmento.fraccion * (t.hastaNodos - t.desdeNodos);
    const cercano = ruta.reduce((a, b) => (Math.abs(b.y - objetivo) < Math.abs(a.y - objetivo) ? b : a));

    let fragmento;
    if (t.fragmento.enRuta) {
      // Entre dos agarres consecutivos de la ruta: imposible de pasar de largo
      const i = ruta.indexOf(cercano);
      const siguiente = ruta[Math.min(i + 1, ruta.length - 1)];
      fragmento = { x: (cercano.x + siguiente.x) / 2, y: (cercano.y + siguiente.y) / 2 };
    } else {
      // Al otro costado de la ruta, con una cadena de agarres firmes que lleva hasta él
      const sentido = cercano.x >= 0 ? -1 : 1;
      const fx = limitar(cercano.x + sentido * (1.8 + azar() * 0.8), -(t.xMax - 0.3), t.xMax - 0.3);
      fragmento = { x: fx, y: objetivo };
      cadena(t, cercano, { x: fx - Math.sign(fx - cercano.x || sentido) * 0.3, y: objetivo - 0.3 });
    }
    fragmentos.push({ tramo: t.indice, ...fragmento });

    // Zona del fragmento: los agarres que no son de la ruta ni del desvío se endurecen
    if (t.tiposDificiles.length) {
      agarres.forEach((a) => {
        if (a.tramo !== t.indice || a.ruta || a.desvio || a.salida || distancia(a, fragmento) > E.zonaFragmento) return;
        a.tipo = t.tiposDificiles[Math.floor(azar() * t.tiposDificiles.length)];
        a.fase = a.tipo === 'intermitente' ? +(azar() * 5).toFixed(2) : 0;
      });
    }
  });

  // 4. Poda: se sacan los agarres de relleno que no llevan a ningún lado. Cada uno tiene que poder
  // alcanzarse desde las filas de salida y desde él se tiene que poder llegar al reborde del tope; y no
  // quedan agarres "puntas" con un solo vecino (un callejón sin salida).
  tramos.forEach((t) => {
    const alcance = t.distanciaMax * E.alcancePoda; // se puede estirar más que en la ruta garantizada
    const nodos = [...agarres.filter((a) => a.tramo === t.indice), ...nodosDePanel().filter((n) => n.tramo === t.indice)];
    const vecinos = (n, conjunto) => conjunto.filter((m) => m !== n && distancia(m, n) <= alcance);
    const componente = (semillas) => {
      const visto = new Set(semillas);
      const cola = [...semillas];
      while (cola.length) {
        const n = cola.pop();
        vecinos(n, nodos).forEach((m) => {
          if (!visto.has(m)) {
            visto.add(m);
            cola.push(m);
          }
        });
      }
      return visto;
    };
    const desdeAbajo = componente(nodos.filter((n) => n.y <= t.desdeNodos + 0.05));
    const haciaArriba = componente(nodos.filter((n) => t.yBorde - n.y <= alcance));
    const intocable = (a) => a.ruta || a.desvio || a.salida || a.tipo === undefined;
      for (let i = agarres.length - 1; i >= 0; i--) {
      const a = agarres[i];
      if (a.tramo !== t.indice || intocable(a)) continue;
      if (!desdeAbajo.has(a) || !haciaArriba.has(a)) agarres.splice(i, 1);
    }
    // Puntas: un agarre de relleno con un solo vecino (o ninguno) no lleva a ningún lado
    let cambio = true;
    while (cambio) {
      cambio = false;
      const vivos = [...agarres.filter((a) => a.tramo === t.indice), ...nodosDePanel().filter((n) => n.tramo === t.indice)];
      for (let i = agarres.length - 1; i >= 0; i--) {
        const a = agarres[i];
        if (a.tramo !== t.indice || intocable(a)) continue;
        const arriba = t.yBorde - a.y <= alcance;
        if (vecinos(a, vivos).length < (arriba ? 1 : 2)) {
          agarres.splice(i, 1);
          cambio = true;
        }
      }
    }
  });

  // 5a. Refugios: lugares de cada tramo adonde el Glitch puede llevar un fragmento que se come. Son agarres
  // de relleno en la mitad de arriba del tramo, con la posición del fragmento apenas más arriba para poder
  // juntarlo desde ese agarre. Los más bajos primero.
  const refugios = tramos.map((t) => {
    const desde = t.y0 + t.alto * 0.35;
    const hasta = t.y0 + t.alto * 0.85;
    return agarres
      .filter((a) => a.tramo === t.indice && a.relleno && a.y >= desde && a.y <= hasta)
      .sort((a, b) => a.y - b.y)
      .map((a) => ({ x: a.x, y: a.y + 0.28 }));
  });

  // 5b. Tirolesa: el enchufe del cable USB, en la torre, bien lejos de la ruta y con una cadena de agarres
  // que lleva hasta él. Es difícil de encontrar y de agarrar.
  let tirolesa = null;
  const torre = tramos[1];
  if (torre) {
    const ruta = rutas[1];
    const yBase = torre.y1 - TIROLESA.altoBajoCheckpoint;
    const delTramo = agarres.filter((a) => a.tramo === 1);
    const lejosDeLaRuta = (x, y) => ruta.every((n) => distancia(n, { x, y }) > 2.2);
    const libreParaEnchufe = (x, y) =>
      lejosDeLaRuta(x, y) &&
      !delTramo.some((a) => !a.desvio && !a.relleno && distancia(a, { x, y }) < 1.0) &&
      !paneles.some((p) => p.tramo === 1 && Math.abs(p.x - x) < 1.4 && Math.abs(p.y - y) < 1.0) &&
      !fragmentos.some((f) => f.tramo === 1 && distancia(f, { x, y }) < 1.6);
    busqueda: for (const dy of [0, 0.4, -0.4, 0.8, -0.8, 1.2, -1.2]) {
      for (const lado of [1, -1]) {
        for (let ax = TIROLESA.xMax; ax >= TIROLESA.xMin; ax -= 0.3) {
          const x = lado * ax;
          const y = yBase + dy;
          if (libreParaEnchufe(x, y)) {
            tirolesa = { x, y, lado };
            break busqueda;
          }
        }
      }
    }
    if (tirolesa) {
      // Se despeja el relleno que quedó pegado al enchufe: tiene que ser difícil de agarrar, no de ver
      for (let i = agarres.length - 1; i >= 0; i--) {
        const a = agarres[i];
        if (a.tramo === 1 && a.relleno && distancia(a, tirolesa) < 1.0) agarres.splice(i, 1);
      }
      // Cadena desde el agarre de la ruta más cercano hasta un punto a una mano del enchufe
      const aproximacion = { x: tirolesa.x - tirolesa.lado * 0.75, y: tirolesa.y - 0.15 };
      const origen = ruta.reduce((a, b) => (distancia(b, aproximacion) < distancia(a, aproximacion) ? b : a));
      cadena(torre, origen, aproximacion);
    }
  }

  // Los rebordes de arriba de cada pared: una barra larga que lleva al piso
  const bordes = tramos.map((t) => ({ tramo: t.indice, y: t.yBorde }));

  agarres.sort((a, b) => a.y - b.y);
  return { agarres, paneles, fragmentos, refugios, checkpoints, tramos, bordes, tirolesa, frentes, alturaFinal, tramoEn };
}
