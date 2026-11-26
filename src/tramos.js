// Generador de la escalada. Arma, a partir de ESCENARIO en config.js, la distribución de agarres de
// los tres tramos (teclado, torre de PC y monitor). No usa A-Frame: solo calcula posiciones.
//
// Cada tramo es una pared amplia SIN camino marcado: los agarres se reparten por toda la pared, parejos
// pero sin orden evidente, y siempre hay muchas formas de subir.
//   1. Se arma una trama escalonada de puntos (cada fila corrida media columna respecto de la anterior) y
//      cada punto se corre un poco al azar, para que no se note el orden.
//   2. Se ubican los estantes (pequeñas bases donde pararse) y los paneles que giran; los dos despejan los
//      agarres de alrededor.
//   3. Se sacan agarres al azar, pero solo los que se pueden sacar sin dejar a otros sin camino: cada agarre
//      que queda tiene que tener un agarre vecino más abajo (o el piso) y otro más arriba (o el reborde).
//   4. Se reparten los tipos especiales (se hunde, lata, bloque intermitente) según la dificultad del tramo,
//      lo más lejos posible entre sí y dejando siempre un camino de agarres firmes hasta arriba.
//   5. Se ubican los fragmentos, los refugios (adonde el Glitch puede llevar un fragmento que se come) y el
//      enchufe de la tirolesa, apartado de los agarres.
// La misma semilla da siempre la misma pared, así todos prueban lo mismo.
import { ESCENARIO, ESTANTE, TIROLESA } from './config.js';
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

const entre = (a, b, t) => a + (b - a) * t;
const limitar = (v, min, max) => Math.max(min, Math.min(max, v));
const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Devuelve { agarres, paneles, estantes, fragmentos, refugios, checkpoints, tramos, bordes, tirolesa, frentes,
//            alturaFinal, tramoEn }
export function generarEscalada() {
  const E = ESCENARIO;
  const azar = crearAzar(E.semilla);

  // Alturas de cada tramo: y0 es el piso donde empieza y y1 el piso de arriba (su checkpoint)
  let base = 0;
  const tramos = E.tramos.map((t, indice) => {
    const y0 = base;
    base += t.alto;
    return {
      ...t,
      indice,
      y0,
      y1: base,
      frente: frenteTramo(indice),
      yBorde: base - E.borde.bajoElTope, // altura del reborde de arriba
      desdeNodos: y0 + E.primerAgarre, // altura de la fila de abajo
      hastaNodos: base - E.borde.bajoElTope - 0.45, // altura de la fila de arriba (a una mano del reborde)
      bordeX: E.borde.posiciones,
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
      spawnZ: ultimo ? t.frente - E.final.spawnDesdeElBorde : lugarFrenteAlTramo(t.indice + 1),
    };
  });

  const progreso = (t, y) => limitar((y - t.desdeNodos) / (t.hastaNodos - t.desdeNodos), 0, 1);
  const nuevoAgarre = (t, tipo, x, y) => ({
    tipo,
    tramo: t.indice,
    x,
    y,
    fase: tipo === 'intermitente' ? +(azar() * 5).toFixed(2) : 0,
  });
  // Distancia de un punto al reborde más cercano de su tramo (los rebordes son barras cortas)
  const distanciaAlBorde = (t, n) =>
    Math.min(...t.bordeX.map((bx) => Math.hypot(Math.max(0, Math.abs(n.x - bx) - E.borde.ancho / 2), t.yBorde - n.y)));

  // 1. Trama escalonada con un poco de desorden
  const grupos = tramos.map((t) => {
    const nodos = [];
    const { columnas, filas } = t.rejilla;
    const cantidadFilas = Math.round((t.hastaNodos - t.desdeNodos) / filas);
    const pasoFila = (t.hastaNodos - t.desdeNodos) / cantidadFilas;
    for (let f = 0; f <= cantidadFilas; f++) {
      const y = t.desdeNodos + f * pasoFila;
      const corrimiento = (f % 2) * (columnas / 2);
      for (let x = -t.xMax + corrimiento; x <= t.xMax + 1e-6; x += columnas) {
        // El desorden es chico (los vecinos tienen que seguir al alcance) y las filas de abajo y de arriba casi no se corren
        const borde = f === 0 || f === cantidadFilas;
        nodos.push(
          nuevoAgarre(
            t,
            'firme',
            limitar(x + entre(-1, 1, azar()) * (borde ? 0.15 : 0.3), -t.xMax, t.xMax),
            y + entre(-1, 1, azar()) * (borde ? 0 : 0.12)
          )
        );
      }
    }
    return nodos;
  });

  // 2a. Estantes: pequeñas bases salientes donde el jugador puede pararse sin agarrarse. Se sacan los agarres que
  // quedan donde va el estante y el cuerpo del jugador parado encima.
  const estantes = [];
  tramos.forEach((t) => {
    (t.estantes || []).forEach((e) => {
      const y = t.desdeNodos + e.fraccion * (t.hastaNodos - t.desdeNodos);
      estantes.push({ tramo: t.indice, x: e.x, y });
      grupos[t.indice] = grupos[t.indice].filter(
        (n) => !(Math.abs(n.x - e.x) < ESTANTE.ancho / 2 + 0.2 && n.y > y - ESTANTE.despejeAbajo && n.y < y + ESTANTE.despejeArriba)
      );
      // Agarres de acceso: a los costados del estante (para subirse desde el costado) y arriba (para seguir
      // escalando una vez parado en él)
      const costado = ESTANTE.ancho / 2 + 0.45;
      [
        [-costado, -0.5], [costado, -0.5], [-costado, 0.4], [costado, 0.4], [-costado, 1.3], [costado, 1.3], [-0.55, 1.55], [0.55, 1.55],
      ].forEach(([dx, dy]) => {
        const punto = { x: limitar(e.x + dx, -t.xMax, t.xMax), y: y + dy };
        grupos[t.indice] = grupos[t.indice].filter((n) => distancia(n, punto) >= 0.55);
        grupos[t.indice].push(nuevoAgarre(t, 'firme', punto.x, punto.y));
      });
    });
  });
  const cercaDeEstante = (tramo, x, y) => estantes.some((e) => e.tramo === tramo && Math.abs(e.x - x) < 2.2 && Math.abs(e.y - y) < 1.6);

  // 2b. Paneles que giran: reemplazan un agarre del medio de la pared, y se despejan los vecinos para que
  // tenga lugar para girar. El panel trae sus propios agarres, a los costados de su centro.
  const paneles = [];
  const enAreaDePanel = (tramo, x, y) => paneles.some((p) => p.tramo === tramo && Math.abs(x - p.x) < 1.0 && Math.abs(y - p.y) < 0.75);
  tramos.forEach((t) => {
    t.paneles.forEach((fraccion) => {
      const objetivo = t.desdeNodos + fraccion * (t.hastaNodos - t.desdeNodos);
      let mejor = null;
      grupos[t.indice].forEach((n) => {
        if (n.y < t.y0 + 2.2 || n.y > t.y1 - 2.2) return; // lejos del piso y del reborde
        if (Math.abs(n.x) > t.xMax - 1.2) return; // no pegado al costado
        if (cercaDeEstante(t.indice, n.x, n.y)) return; // ni encima de un estante
        if (paneles.some((p) => p.tramo === t.indice && Math.abs(p.y - n.y) < 1.7)) return;
        if (!mejor || Math.abs(n.y - objetivo) < Math.abs(mejor.y - objetivo)) mejor = n;
      });
      if (mejor) paneles.push({ tramo: t.indice, x: mejor.x, y: mejor.y, fase: 0 });
    });
    // El fragmento de la torre está en la zona izquierda, y el camino hasta él pasa por un panel que gira y por
    // una lata: se elige el agarre donde va el fragmento (el anclaje) y se pone un panel justo abajo
    if (t.fragmento.panelDebajo) {
      const objetivoY = t.desdeNodos + t.fragmento.fraccion * (t.hastaNodos - t.desdeNodos);
      const [xDesde, xHasta] = t.fragmento.zonaX;
      const izquierda = grupos[t.indice].filter((n) => n.x >= xDesde && n.x <= xHasta && n.y > t.desdeNodos + 2.5 && n.y < t.hastaNodos - 1.0 && !cercaDeEstante(t.indice, n.x, n.y));
      const anclaje = izquierda.length ? izquierda.reduce((a, b) => (Math.abs(b.y - objetivoY) < Math.abs(a.y - objetivoY) ? b : a)) : null;
      const bajo = anclaje && grupos[t.indice]
        .filter((n) => n !== anclaje && n.y <= anclaje.y - 0.7 && n.y >= anclaje.y - 1.5 && Math.abs(n.x - anclaje.x) <= 1.0)
        .filter((n) => paneles.every((p) => p.tramo !== t.indice || Math.abs(p.y - n.y) >= 1.2 || Math.abs(p.x - n.x) >= 2.0))
        .sort((a, b) => distancia(a, { x: anclaje.x, y: anclaje.y - 1.1 }) - distancia(b, { x: anclaje.x, y: anclaje.y - 1.1 }))[0];
      if (bajo) {
        paneles.push({ tramo: t.indice, x: bajo.x, y: bajo.y, fase: 0 });
        t.anclaje = anclaje;
        t.panelAnclaje = { x: bajo.x, y: bajo.y };
      }
    }
    grupos[t.indice] = grupos[t.indice].filter((n) => !enAreaDePanel(t.indice, n.x, n.y));
  });
  // Nodos que no son agarres sueltos pero cuentan para los caminos: los agarres de los paneles y, en cada
  // estante, los lugares donde quedan las manos cuando el jugador está parado encima
  const nodosDePanel = (tramo) => [
    ...paneles
      .filter((p) => p.tramo === tramo)
      .flatMap((p) => [
        { x: p.x - E.panel.separacionAgarres, y: p.y, tramo, panel: true },
        { x: p.x + E.panel.separacionAgarres, y: p.y, tramo, panel: true },
      ]),
    ...estantes.filter((e) => e.tramo === tramo).flatMap((e) => [-0.6, 0, 0.6].map((dx) => ({ x: e.x + dx, y: e.y + 1.2, tramo, estante: true }))),
  ];

  // Para cada agarre: ¿tiene un camino hacia arriba y uno hacia abajo? Se calcula sobre `nodos`. Un agarre
  // sube si está a una mano del reborde o tiene un vecino más alto que sube; baja si está en la fila de
  // abajo o tiene un vecino más bajo que baja.
  const validar = (t, nodos) => {
    const vecinos = nodos.map(() => []);
    for (let i = 0; i < nodos.length; i++) {
      for (let j = i + 1; j < nodos.length; j++) {
        if (distancia(nodos[i], nodos[j]) <= t.alcance) {
          vecinos[i].push(j);
          vecinos[j].push(i);
        }
      }
    }
    const orden = nodos.map((_, i) => i).sort((a, b) => nodos[a].y - nodos[b].y);
    const sube = new Array(nodos.length).fill(false);
    for (let k = orden.length - 1; k >= 0; k--) {
      const i = orden[k];
      sube[i] = distanciaAlBorde(t, nodos[i]) <= t.alcance || vecinos[i].some((j) => nodos[j].y >= nodos[i].y + 0.3 && sube[j]);
    }
    const baja = new Array(nodos.length).fill(false);
    for (let k = 0; k < orden.length; k++) {
      const i = orden[k];
      baja[i] = nodos[i].y <= t.desdeNodos + 0.4 || vecinos[i].some((j) => nodos[j].y <= nodos[i].y - 0.3 && baja[j]);
    }
    return nodos.map((_, i) => sube[i] && baja[i]);
  };

  // 3. Se sacan agarres al azar, sin dejar a ninguno sin camino
  tramos.forEach((t) => {
    // Primero se sacan los que ya no tienen camino (por ejemplo, los que quedaron aislados junto a un panel)
    const propios = [...grupos[t.indice], ...nodosDePanel(t.indice)];
    const buenos = validar(t, propios);
    grupos[t.indice] = grupos[t.indice].filter((n) => buenos[propios.indexOf(n)]);
    const estantesAlAlcance = buenos.filter((v, i) => v && propios[i].estante).length;

    const aSacar = Math.round(t.quitar * grupos[t.indice].length);
    const candidatos = grupos[t.indice].filter((n) => n !== t.anclaje && n.y > t.desdeNodos + 0.2 && n.y < t.hastaNodos - 0.2); // no las filas de abajo y de arriba
    for (let i = candidatos.length - 1; i > 0; i--) {
      const j = Math.floor(azar() * (i + 1));
      [candidatos[i], candidatos[j]] = [candidatos[j], candidatos[i]];
    }
    let sacados = 0;
    for (const n of candidatos) {
      if (sacados >= aSacar) break;
      const sin = grupos[t.indice].filter((m) => m !== n);
      const todos = [...sin, ...nodosDePanel(t.indice)];
      const ok = validar(t, todos);
      // Todo agarre tiene que seguir con camino, y ningún estante puede quedar sin camino
      const estantesBien = ok.filter((v, i) => v && todos[i].estante).length;
      if (todos.every((m, i) => ok[i] || m.estante) && estantesBien >= estantesAlAlcance) {
        grupos[t.indice] = sin;
        sacados++;
      }
    }
  });

  // 4. Tipos especiales según la dificultad, lo más lejos posible entre sí. Siempre queda un camino de
  // agarres firmes de abajo hasta arriba (los especiales no se pueden sostener indefinidamente).
  const hayCaminoFirme = (t, nodos) => {
    const firmes = nodos.filter((n) => n.tipo === 'firme' || n.tipo === undefined);
    return validar(t, firmes).some((ok, i) => ok && firmes[i].y <= t.desdeNodos + 0.4);
  };
  tramos.forEach((t) => {
    const nodos = grupos[t.indice];
    const editables = nodos.filter((n) => n.y > t.desdeNodos + 0.2); // la fila de abajo siempre es firme
    t.mezcla.forEach(({ tipo, fraccion, desde }) => {
      const cantidad = Math.round(fraccion * nodos.length);
      for (let i = 0; i < cantidad; i++) {
        const especiales = nodos.filter((n) => n.tipo !== 'firme');
        const candidatos = editables
          .filter((n) => n.tipo === 'firme' && progreso(t, n.y) >= desde)
          .map((n) => ({ n, d: especiales.length ? Math.min(...especiales.map((o) => distancia(o, n))) : 99 }))
          .sort((a, b) => b.d - a.d);
        const elegido = candidatos.find(({ n }) => {
          n.tipo = tipo;
          const ok = hayCaminoFirme(t, nodos);
          n.tipo = 'firme';
          return ok;
        });
        if (!elegido) break;
        elegido.n.tipo = tipo;
        elegido.n.fase = tipo === 'intermitente' ? +(azar() * 5).toFixed(2) : 0;
      }
    });
  });


  const agarres = [];
  // 5a. Fragmentos: uno por tramo, apenas arriba de un agarre de la altura que le toca. En la torre y el monitor
  // ese agarre pasa a ser especial (lata, tecla que se hunde o bloque intermitente) y los de alrededor también,
  // siempre que quede un camino de agarres firmes: así el fragmento se alcanza desde agarres que no se pueden
  // sostener mucho tiempo, y hay que ir por un lugar más difícil.
  const fragmentos = tramos.map((t) => {
    const objetivo = t.desdeNodos + t.fragmento.fraccion * (t.hastaNodos - t.desdeNodos);
    const nodos = grupos[t.indice];
    const delTramo = nodos.filter((n) => n.y > t.desdeNodos + 0.8 && n.y < t.hastaNodos - 0.8);
    const porCercania = [...delTramo].sort((a, b) => Math.abs(a.y - objetivo) - Math.abs(b.y - objetivo));
    let anfitrion = porCercania.find((n) => n.tipo === 'firme') || porCercania[0];
    const nuevoTipo = (i) => t.fragmento.dificiles[i % t.fragmento.dificiles.length];
    const endurecer = (n, tipo) => {
      const antes = n.tipo;
      n.tipo = tipo;
      if (hayCaminoFirme(t, nodos)) {
        n.fase = tipo === 'intermitente' ? +(azar() * 5).toFixed(2) : 0;
        return true;
      }
      n.tipo = antes;
      return false;
    };
    if (t.anclaje && nodos.includes(t.anclaje)) {
      // Fragmento de la torre: sobre una lata, a la que solo se llega desde el panel que gira que está debajo
      anfitrion = t.anclaje;
      const paneles_ = paneles.filter((p) => p.tramo === t.indice);
      const alcance = t.alcance;
      for (let i = nodos.length - 1; i >= 0; i--) {
        const n = nodos[i];
        if (n !== anfitrion && n.y <= anfitrion.y - 0.3 && distancia(n, anfitrion) <= alcance) nodos.splice(i, 1);
      }
      // Los agarres que quedaron sin camino por haber sacado los de abajo también se sacan
      for (let vuelta = 0; vuelta < 6; vuelta++) {
        const todos = [...nodos, ...nodosDePanel(t.indice)];
        const ok = validar(t, todos);
        let saco = false;
        for (let i = nodos.length - 1; i >= 0; i--) {
          if (nodos[i] !== anfitrion && !ok[todos.indexOf(nodos[i])]) {
            nodos.splice(i, 1);
            saco = true;
          }
        }
        if (!saco) break;
      }
      anfitrion.tipo = 'lata';
      anfitrion.fase = 0;
      // Hasta el panel se llega por agarres firmes: lo difícil es el panel y la lata, no una cadena de agarres con tiempo
      const pan = t.panelAnclaje;
      nodos.forEach((n) => {
        if (n !== anfitrion && n.y <= pan.y - 0.3 && distancia(n, pan) <= alcance) {
          n.tipo = 'firme';
          n.fase = 0;
        }
      });
      void paneles_;
    } else if (t.fragmento.dificiles) {
      // El anfitrión es el primero que se pueda endurecer entre los más cercanos a la altura del fragmento
      const elegido = porCercania.filter((n) => n.tipo === 'firme').slice(0, 8).find((n) => endurecer(n, nuevoTipo(0)));
      if (elegido) anfitrion = elegido;
    }
    if (t.fragmento.dificiles) {
      let i = 1;
      nodos
        .filter((n) => n !== anfitrion && n.tipo === 'firme' && n.y > t.desdeNodos + 0.2 && distancia(n, anfitrion) <= t.fragmento.zona)
        .forEach((n) => endurecer(n, nuevoTipo(i++)));
    }
    return { tramo: t.indice, x: anfitrion.x, y: anfitrion.y + 0.28 };
  });

  // 5a-bis. Relleno de huecos: donde quedó un hueco más grande que el alcance (por los estantes, los paneles o los
  // agarres que se sacaron), se agrega un agarre firme, siempre que tenga camino. No se rellena alrededor de los
  // fragmentos difíciles, debajo del fragmento de la torre (ahí solo se llega por el panel) ni en los estantes.
  tramos.forEach((t) => {
    const fr = fragmentos[t.indice];
    const anfitrion = { x: fr.x, y: fr.y - 0.28 };
    const protegido = (p) =>
      enAreaDePanel(t.indice, p.x, p.y) ||
      estantes.some((e) => e.tramo === t.indice && Math.abs(p.x - e.x) < ESTANTE.ancho / 2 + 0.2 && p.y > e.y - ESTANTE.despejeAbajo && p.y < e.y + ESTANTE.despejeArriba) ||
      (t.fragmento.dificiles && distancia(p, anfitrion) <= t.fragmento.zona + 0.3) ||
      (t.anclaje && p.y <= anfitrion.y - 0.3 && distancia(p, anfitrion) <= t.alcance + 0.3);
    // Se crece desde los agarres que ya hay hacia el hueco más grande, de a un agarre al alcance de otro, y al
    // final se sacan los agregados que no quedaron con camino hacia arriba y hacia abajo.
    const agregados = [];
    for (let vuelta = 0; vuelta < 80; vuelta++) {
      const nodos = [...grupos[t.indice], ...nodosDePanel(t.indice)];
      const puntos = [];
      for (let x = -t.xMax; x <= t.xMax + 1e-6; x += 0.2) {
        for (let y = t.desdeNodos; y <= t.hastaNodos + 1e-6; y += 0.2) {
          const p = { x, y };
          if (protegido(p)) continue;
          p.d = Math.min(...nodos.map((n) => distancia(n, p)));
          puntos.push(p);
        }
      }
      const hueco = puntos.reduce((a, b) => (b.d > a.d ? b : a), { d: 0 });
      if (hueco.d < t.alcance * 0.85) break;
      const candidatos = puntos.filter((p) => p.d >= 0.75 && p.d <= t.alcance * 0.8);
      if (!candidatos.length) break;
      const elegido = candidatos.reduce((a, b) => (distancia(b, hueco) < distancia(a, hueco) ? b : a));
      const nuevo = nuevoAgarre(t, 'firme', elegido.x, elegido.y);
      grupos[t.indice].push(nuevo);
      agregados.push(nuevo);
    }
    for (let vuelta = 0; vuelta < 10; vuelta++) {
      const todos = [...grupos[t.indice], ...nodosDePanel(t.indice)];
      const ok = validar(t, todos);
      const malos = agregados.filter((n) => grupos[t.indice].includes(n) && !ok[todos.indexOf(n)]);
        if (!malos.length) break;
      grupos[t.indice] = grupos[t.indice].filter((n) => !malos.includes(n));
    }
  });

  grupos.forEach((g) => agarres.push(...g));

  // 5b. Refugios: lugares de cada tramo adonde el Glitch puede llevar un fragmento que se come: arriba de un
  // agarre firme de la mitad de arriba del tramo. Los más bajos primero.
  const refugios = tramos.map((t) => {
    const desde = t.y0 + t.alto * 0.35;
    const hasta = t.y0 + t.alto * 0.85;
    return grupos[t.indice]
      .filter((a) => a.tipo === 'firme' && a.y >= desde && a.y <= hasta)
      .sort((a, b) => a.y - b.y)
      .map((a) => ({ x: a.x, y: a.y + 0.28 }));
  });

  // 5c. Tirolesa: el enchufe del cable USB, en la torre, hacia un costado, a una distancia de los agarres que
  // obliga a estirarse para llegar hasta él. Es dificilísimo de ver y de agarrar.
  let tirolesa = null;
  const torre = tramos[1];
  if (torre) {
    const yBase = torre.y1 - TIROLESA.altoBajoCheckpoint;
    const nodos = [...grupos[1], ...nodosDePanel(1)];
    busqueda: for (const dy of [0, 0.4, -0.4, 0.8, -0.8, 1.2, -1.2]) {
      for (const lado of [1, -1]) {
        for (let ax = TIROLESA.xMax; ax >= TIROLESA.xMin; ax -= 0.2) {
          const punto = { x: lado * ax, y: yBase + dy };
          const cercano = Math.min(...nodos.map((n) => distancia(n, punto)));
          const lejosDeFragmento = fragmentos.every((f) => f.tramo !== 1 || distancia(f, punto) > 1.6);
          if (cercano >= TIROLESA.distanciaAgarres.min && cercano <= TIROLESA.distanciaAgarres.max && lejosDeFragmento) {
            tirolesa = { ...punto, lado };
            break busqueda;
          }
        }
      }
    }
  }

  // Los rebordes de arriba de cada pared: tramos cortos de barra que llevan al piso
  const bordes = tramos.map((t) => ({ tramo: t.indice, y: t.yBorde, xs: t.bordeX }));

  agarres.sort((a, b) => a.y - b.y);
  return { agarres, paneles, estantes, fragmentos, refugios, checkpoints, tramos, bordes, tirolesa, frentes, alturaFinal, tramoEn };
}
