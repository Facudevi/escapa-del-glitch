// Generador de la escalada. Arma, a partir de ESCENARIO en config.js, la distribución de agarres de
// los tres tramos (teclado, torre de PC y monitor). No usa A-Frame: solo calcula posiciones.
//
// La pared es amplia y no tiene un camino marcado, pero siempre se puede subir:
//   1. Se arma una RUTA GARANTIZADA en zigzag, que se va corriendo hacia los costados, con agarres a
//      distancias alcanzables. Su separación vertical y los tipos especiales aumentan a medida que se
//      acerca al checkpoint del tramo.
//   2. Se agregan agarres EXTRA al azar para que el jugador pueda elegir por dónde subir.
//   3. Se ubican los fragmentos (el del tramo 1 en el camino, los demás a un costado, con un desvío)
//      y se endurece la zona que los rodea.
//   4. Se reservan los REFUGIOS: lugares de cada tramo adonde el Glitch puede llevar un fragmento
//      que se come, para que reaparezca más arriba en vez de desaparecer.
//   5. Se ubica el enchufe de la TIROLESA, lejos de la ruta, con una cadena de agarres que lleva hasta él.
// La misma semilla da siempre la misma pared, así todos prueban lo mismo.
import { ESCENARIO, TIROLESA } from './config.js';

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

// Devuelve { agarres, paneles, fragmentos, refugios, checkpoints, tirolesa, tramos, alturaFinal, alturaTotal }
export function generarEscalada() {
  const E = ESCENARIO;
  const azar = crearAzar(E.semilla);

  // Alturas de cada tramo: y0 es el piso donde empieza y y1 la parte de arriba de su checkpoint
  let base = 0;
  const tramos = E.tramos.map((t, indice) => {
    const y0 = base;
    base += t.alto;
    const desdeNodos = indice === 0 ? E.primerAgarre : y0 + E.primerAgarre;
    return { ...t, indice, y0, y1: base, desdeNodos, hastaNodos: base + E.primerAgarre };
  });
  const alturaFinal = base; // piso de la plataforma de arriba (donde está el RESET)
  const checkpoints = tramos.map((t) => ({ orden: t.indice + 1, y: t.y1 }));

  const tramoDe = (y) => tramos.find((t) => y <= t.hastaNodos + 1e-6) || tramos[tramos.length - 1];
  const progreso = (t, y) => limitar((y - t.desdeNodos) / (t.hastaNodos - t.desdeNodos), 0, 1);

  // Los agarres no pueden quedar dentro de la plataforma de un checkpoint
  const plataformaEn = (y) => checkpoints.find((c) => y > c.y - 0.2 && y < c.y + 0.15);
  const dentroDeLaPlataforma = (y) => !!plataformaEn(y);

  // Tipo de agarre según las reglas del tramo y qué tan avanzado está
  const elegirTipo = (t, p) => {
    for (const regla of t.reglas) {
      if (p >= regla.desde && azar() < regla.prob) return regla.tipo;
    }
    return 'firme';
  };
  const nuevoAgarre = (tipo, x, y, extra = {}) => ({
    tipo,
    x,
    y,
    fase: tipo === 'intermitente' ? +(azar() * 5).toFixed(2) : 0,
    ...extra,
  });

  // 1. Ruta garantizada, en zigzag, de abajo hacia arriba. El centro del zigzag se va corriendo hacia los
  // costados para aprovechar todo el ancho de la pared.
  const ruta = [nuevoAgarre('firme', 0, E.primerAgarre, { ruta: true })];
  const tope = alturaFinal + E.primerAgarre;
  let lado = 1;
  let centro = 0;
  while (ruta[ruta.length - 1].y < tope - 0.05) {
    const anterior = ruta[ruta.length - 1];
    const t = tramoDe(anterior.y + 0.01);
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
    let y = anterior.y + Math.max(Math.min(dyBase, dyMax), 0.3);
    // Si cae dentro de una plataforma, se lo corre al borde más cercano (arriba o abajo)
    const plataforma = plataformaEn(y);
    if (plataforma) {
      const abajo = plataforma.y - 0.21;
      const arriba = plataforma.y + 0.15;
      y = abajo - anterior.y >= 0.3 && y - abajo < arriba - y ? abajo : arriba;
    }

    // Después de un agarre con tiempo (lata o bloque) viene uno seguro: así siempre hay dónde
    // apoyarse y esperar sin que se rompa o se apague el agarre que se está sosteniendo
    let tipo = elegirTipo(t, progreso(t, y));
    if (CON_TIEMPO.includes(anterior.tipo) && CON_TIEMPO.includes(tipo)) tipo = 'firme';
    ruta.push(nuevoAgarre(tipo, x, Math.min(y, tope), { ruta: true }));
  }

  // Los paneles que giran reemplazan agarres de la ruta (el panel trae sus propios agarres)
  const paneles = [];
  tramos.forEach((t) => {
    t.paneles.forEach((fraccion) => {
      const objetivo = t.desdeNodos + fraccion * (t.hastaNodos - t.desdeNodos);
      let mejor = null;
      ruta.forEach((n, i) => {
        // Un panel no puede quedar cerca de un checkpoint (el panel necesita lugar para girar)
        if (i === 0 || i === ruta.length - 1 || n.tipo === 'panel') return;
        if (n.y < t.desdeNodos || n.y > t.hastaNodos) return; // solo dentro del tramo
        if (checkpoints.some((c) => Math.abs(n.y - c.y) < 1.8)) return;
        // Dos paneles no pueden pisarse: miden 0,8 m de alto, así que se pide bastante separación
        if (paneles.some((p) => Math.abs(p.y - n.y) < 1.7)) return;
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
        paneles.push({ x: mejor.x, y: mejor.y, fase: 0 });
      }
    });
  });

  const agarres = ruta.filter((n) => n.tipo !== 'panel');
  const posicionesOcupadas = () => [
    ...agarres,
    ...paneles.flatMap((p) => [
      { x: p.x - E.panel.separacionAgarres, y: p.y },
      { x: p.x + E.panel.separacionAgarres, y: p.y },
    ]),
  ];
  const enAreaDePanel = (x, y) => paneles.some((p) => Math.abs(x - p.x) < 1 && Math.abs(y - p.y) < 0.75);

  // 2. Agarres de más, al azar, para que la pared sea amplia (hay muchos más cuanto más ancha es)
  tramos.forEach((t) => {
    const cantidad = Math.round(t.extras * ruta.filter((n) => tramoDe(n.y) === t).length);
    for (let intento = 0, agregados = 0; agregados < cantidad && intento < cantidad * 40; intento++) {
      const x = entre(-t.xMax, t.xMax, azar());
      const y = entre(t.desdeNodos, t.hastaNodos, azar());
      if (dentroDeLaPlataforma(y) || enAreaDePanel(x, y)) continue;
      if (posicionesOcupadas().some((o) => distancia(o, { x, y }) < E.separacionMinima)) continue;
      agarres.push(nuevoAgarre(elegirTipo(t, progreso(t, y)), x, y));
      agregados++;
    }
  });

  // Cadena de agarres firmes que lleva de un punto a otro (para los fragmentos y la tirolesa)
  const cadena = (desde, hasta) => {
    const pasos = Math.max(1, Math.ceil(distancia(desde, hasta) / 0.7));
    for (let k = 1; k <= pasos; k++) {
      const f = k / pasos;
      const punto = { x: entre(desde.x, hasta.x, f), y: entre(desde.y, hasta.y, f) };
      // Si ya hay un agarre de más muy cerca, se lo reemplaza por el de la cadena
      for (let j = agarres.length - 1; j >= 0; j--) {
        if (!agarres[j].ruta && !agarres[j].desvio && distancia(agarres[j], punto) < E.separacionMinima) agarres.splice(j, 1);
      }
      agarres.push(nuevoAgarre('firme', punto.x, punto.y, { desvio: true }));
    }
  };

  // 3. Fragmentos: uno por tramo. El del tramo 1 está en el camino; los demás, a un costado con un desvío
  const fragmentos = [];
  tramos.forEach((t) => {
    const objetivo = t.desdeNodos + t.fragmento.fraccion * (t.hastaNodos - t.desdeNodos);
    const candidatos = ruta.filter((n) => n.tipo !== 'panel');
    const cercano = candidatos.reduce((a, b) => (Math.abs(b.y - objetivo) < Math.abs(a.y - objetivo) ? b : a));

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
      cadena(cercano, { x: fx - Math.sign(fx - cercano.x || sentido) * 0.3, y: objetivo - 0.3 });
    }
    fragmentos.push({ tramo: t.indice, ...fragmento });

    // Zona del fragmento: los agarres que no son de la ruta ni del desvío se endurecen
    if (t.tiposDificiles.length) {
      agarres.forEach((a) => {
        if (a.ruta || a.desvio || distancia(a, fragmento) > E.zonaFragmento) return;
        a.tipo = t.tiposDificiles[Math.floor(azar() * t.tiposDificiles.length)];
        a.fase = a.tipo === 'intermitente' ? +(azar() * 5).toFixed(2) : 0;
      });
    }
  });

  // 4. Refugios: lugares de cada tramo adonde el Glitch puede llevar un fragmento que se come. Son agarres
  // de más (no de la ruta) en la mitad de arriba del tramo, con la posición del fragmento apenas más arriba
  // para poder juntarlo desde ese agarre. Los más bajos primero.
  const refugios = tramos.map((t) => {
    const desde = t.y0 + t.alto * 0.35;
    const hasta = t.y0 + t.alto * 0.85;
    return agarres
      .filter((a) => !a.ruta && !a.desvio && a.y >= desde && a.y <= hasta && !dentroDeLaPlataforma(a.y))
      .sort((a, b) => a.y - b.y)
      .map((a) => ({ x: a.x, y: a.y + 0.28 }));
  });

  // 5. Tirolesa: el enchufe del cable USB, en la torre, bien lejos de la ruta y con una cadena de agarres
  // que lleva hasta él. Es difícil de encontrar y de agarrar.
  let tirolesa = null;
  const torre = tramos[1];
  if (torre) {
    const yBase = torre.y1 - TIROLESA.altoBajoCheckpoint;
    const lejosDeLaRuta = (x, y) => ruta.every((n) => distancia(n, { x, y }) > 2.2);
    const libreParaEnchufe = (x, y) =>
      lejosDeLaRuta(x, y) &&
      !agarres.some((a) => !a.desvio && distancia(a, { x, y }) < 1.0) &&
      !paneles.some((p) => Math.abs(p.x - x) < 1.4 && Math.abs(p.y - y) < 1.0) &&
      !fragmentos.some((f) => distancia(f, { x, y }) < 1.6);
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
      // Cadena desde el agarre de la ruta más cercano hasta un punto a una mano del enchufe
      const aproximacion = { x: tirolesa.x - tirolesa.lado * 0.75, y: tirolesa.y - 0.15 };
      const origen = ruta.reduce((a, b) => (distancia(b, aproximacion) < distancia(a, aproximacion) ? b : a));
      cadena(origen, aproximacion);
    }
  }

  agarres.sort((a, b) => a.y - b.y);
  return { agarres, paneles, fragmentos, refugios, checkpoints, tramos, tirolesa, alturaFinal, alturaTotal: tope };
}
