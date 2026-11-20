// Configuración central: tiempos, velocidades, medidas y colores en un solo lugar.
// Todo lo que haya que ajustar al probar la experiencia se toca acá.

// Paleta de RESET suavizada (penumbra cálida, sin neón).
export const COLORES = {
  fondo: '#2a2138',
  piso: '#54456b',
  pared: '#44385a',
  luzAmbiente: '#ffe3c2',
  luzPunto: '#ffcf9a',

  lavanda: '#b9a6dc',
  violeta: '#7b5cc4',
  celeste: '#8fc3e6',
  ambar: '#d9a15b',
  verde: '#6fae8f',
  rojo: '#c4665b',

  guante: '#d3c9ea',
  guanteAgarrado: '#e8b86d',

  paredEscalada: '#5f4f7a',
  cartelFondo: '#2b2140',
  cartelTexto: '#f0e9fb',

  anilloFondo: '#d3c9ea', // parte vacía del anillo de energía

  lavandaHunde: '#8f7cc0', // tecla que se hunde: lavanda más profundo
  flecha: '#3f3260', // flecha de la tecla que se hunde
  panel: '#b8788c', // panel que gira: rosa suave

  // Decorado del setup gigante (apagado, para que los agarres se destaquen)
  paredBase: '#4d4166',
  teclas: ['#40364f', '#463b58', '#4b4060', '#3b3249'],
  torre: '#43405f',
  rejilla: '#2a2438',
  ventilador: '#55537a',
  led: '#6fae8f',
  marcoMonitor: '#5c5079',
  pantalla: '#2f3f63',
  pixeles: ['#36497a', '#32456f', '#3d5185', '#2d3d66'],
  resetApagado: '#5d4a8f', // botón RESET sin encender
  hueco: '#241b36', // huecos vacíos de los fragmentos
  huecoEncendido: '#a78bfa', // hueco con su fragmento
  fragmento: '#8f6fe0',
  fragmentoBrillo: '#c1adf5',
  niebla: '#b9a6dc', // niebla de píxeles: lila suave
  nieblaPixel: '#a08ccf',
  onda: '#8fc3e6', // onda del escaneo
};

// Ambiente general de la sala.
export const AMBIENTE = {
  nieblaDensidad: 0.02,
  intensidadAmbiente: 1.0,
  intensidadPunto: 0.8,
  alturasLuz: [4, 11, 18, 24], // luces puntuales cálidas repartidas en altura
};

// Medidas de la sala de pruebas de la etapa 1 (en metros).
export const SALA = {
  lado: 16, // la sala es un cuadrado de lado x lado
  altoParedes: 26, // paredes que marcan los límites (tienen que llegar a lo más alto de la escalada)
};

// Jugador y manos.
export const JUGADOR = {
  alturaOjos: 1.6, // altura de la cámara en modo escritorio
  radioGuante: 0.06,
  radioAgarre: 0.18, // distancia máxima (m) entre la mano y el agarre para poder agarrarlo
};

// Vibración del control al agarrar (si el casco la soporta).
export const VIBRACION = {
  fuerza: 0.35, // de 0 a 1
  duracion: 40, // ms
};

// Escenario: la pared de escalada completa (en metros). Cada tramo es una pared amplia sin camino
// marcado; el generador (src/tramos.js) arma una ruta garantizada y agarres de más, con dificultad creciente.
export const ESCENARIO = {
  semilla: 20261120, // cambia la distribución de los agarres (la misma semilla da siempre la misma pared)
  anchoPared: 6.4, // la pared va de -ancho/2 a +ancho/2 en x
  z: -0.9, // centro de la pared; los agarres sobresalen hacia el jugador
  profundidadPared: 0.2,
  tecla: { ancho: 0.4, alto: 0.14, profundidad: 0.3 }, // medida de la tecla firme y la que se hunde
  primerAgarre: 1.2, // altura del primer agarre sobre cada plataforma
  separacionMinima: 0.5, // distancia mínima (m) entre agarres
  zonaFragmento: 1.3, // radio (m) alrededor de un fragmento donde los agarres son más difíciles
  panel: { separacionAgarres: 0.3 }, // los dos agarres de cada panel quedan a ±esto del centro
  checkpoint: { ancho: 5, profundidad: 1.3 },
  final: { ancho: 3.2, profundidad: 1.6, alturaPared: 3.5 }, // plataforma de arriba, donde está el RESET

  // Tramos de abajo hacia arriba. `alto` es lo que sube cada uno (la parte de arriba del checkpoint).
  //   paso: separación vertical (m) entre agarres al principio y al final del tramo (sube con la dificultad)
  //   distanciaMax: distancia máxima (m) entre agarres consecutivos de la ruta garantizada
  //   amplitud: cuánto se aparta de la columna central la ruta (m); xMax: hasta dónde llegan los agarres
  //   reglas: tipos especiales, desde qué fracción del tramo aparecen y con qué probabilidad
  //   paneles: fracciones del tramo donde la ruta pasa por un panel que gira
  //   extras: agarres de más por cada agarre de la ruta (la pared es amplia y hay donde elegir)
  //   fragmento: fracción de altura del fragmento; enRuta = está justo en el camino (tutorial)
  //   tiposDificiles: tipos con los que se endurece la zona del fragmento
  tramos: [
    {
      nombre: 'Teclado',
      alto: 6,
      paso: [0.45, 0.6],
      distanciaMax: 0.8,
      amplitud: [0.35, 0.9],
      xMax: 2.4,
      reglas: [{ tipo: 'hunde', desde: 0.7, prob: 0.5 }],
      paneles: [],
      extras: 1.3,
      fragmento: { fraccion: 0.4, enRuta: true },
      tiposDificiles: [],
    },
    {
      nombre: 'Torre de PC',
      alto: 7,
      paso: [0.5, 0.68],
      distanciaMax: 0.85,
      amplitud: [0.4, 1.0],
      xMax: 2.4,
      reglas: [
        { tipo: 'lata', desde: 0.25, prob: 0.5 },
        { tipo: 'hunde', desde: 0.15, prob: 0.3 },
      ],
      paneles: [0.25, 0.55],
      extras: 1.3,
      fragmento: { fraccion: 0.65, enRuta: false },
      tiposDificiles: ['lata', 'hunde'],
    },
    {
      nombre: 'Monitor',
      alto: 8,
      paso: [0.5, 0.75],
      distanciaMax: 1.05,
      amplitud: [0.5, 1.6],
      xMax: 2.9,
      reglas: [
        { tipo: 'intermitente', desde: 0, prob: 0.75 },
        { tipo: 'lata', desde: 0.4, prob: 0.15 },
        { tipo: 'hunde', desde: 0.2, prob: 0.1 },
      ],
      paneles: [0.25, 0.5, 0.75],
      extras: 1.1,
      fragmento: { fraccion: 0.7, enRuta: false },
      tiposDificiles: ['intermitente', 'lata'],
    },
  ],
};

// Tecla que se hunde: baja despacio y a velocidad constante mientras está agarrada.
export const HUNDE = {
  velocidad: 0.12, // m/s
  hundimientoMaximo: 0.45, // m: hasta dónde llega a bajar
  retorno: 0.5, // m/s con que vuelve a su lugar al soltarla
};

// Lata que se rompe: cruje al agarrarla y cae a los 3 segundos.
export const LATA = {
  segundos: 3, // s desde que se agarra por primera vez hasta que se rompe
  inclinacionMaxima: 6, // grados del temblor justo antes de romperse (solo visual)
  frecuenciaTemblor: 12, // Hz
  pulsoCada: 0.5, // s entre cada crujido (sonido y vibración)
  gravedad: 9, // m/s² al caer
  duracionCaida: 1, // s que se ve caer antes de desaparecer
  reaparece: 6, // s hasta que vuelve a estar en su lugar
  duracionAparicion: 0.4, // s que tarda en reaparecer creciendo
  radio: 0.13,
  alto: 0.26,
};

// Bloque intermitente: aparece y desaparece con un fundido suave (sin parpadeos).
export const INTERMITENTE = {
  visible: 3, // s que está visible
  oculto: 2, // s que está oculto
  fundido: 0.4, // s que tardan en aparecer y desaparecer
  opacidadMinimaParaAgarrar: 0.6, // solo se puede agarrar cuando se ve casi completo
  ancho: 0.4,
  alto: 0.2,
  profundidad: 0.3,
  radioAnilloInterno: 0.27, // anillo que muestra cuánto tiempo le queda visible
  radioAnilloExterno: 0.3,
};

// Panel que gira: muestra agarres de un lado y después gira.
export const PANEL = {
  ancho: 1.1,
  alto: 0.8,
  grosor: 0.12,
  z: -0.62, // centro del panel
  segundosDeFrente: 3, // s con los agarres de frente
  segundosDeEspaldas: 3, // s del lado liso
  segundosGiro: 0.8, // s que tarda en girar (lento, para no marear)
  anguloMaximoDeAgarre: 60, // grados: más girado que esto, los agarres ya no se pueden agarrar
};

// Resaltado de un agarre cuando la mano (o el mouse) está al alcance.
export const RESALTADO = {
  intensidad: 0.35, // brillo propio del agarre, de 0 a 1
};

// Sonidos sintetizados (no hay archivos de audio).
export const SONIDO = {
  volumen: 0.12, // de 0 a 1
};

// Caída y reaparición. No hay game over: se cae, se funde a negro y se reaparece.
export const CAIDA = {
  graciaSoltar: 250, // ms con las dos manos sueltas en el aire antes de caer
  fundidoSalida: 500, // ms que tarda la vista en irse a negro
  pausaNegro: 150, // ms que se queda en negro antes de reaparecer
  fundidoEntrada: 500, // ms que tarda la vista en volver
  graciaReaparecer: 600, // ms sin poder caer justo después de reaparecer
  graciaViaje: 3000, // ms extra sin caer después de un viaje en modo escritorio (para agarrarse)
  toleranciaPiso: 0.05, // altura (m) hasta la que se considera que está parado en el piso
  colorFundido: '#000000',
};

// Energía de cada mano (de 0 a 1). La mano agarrada gasta, la mano libre recupera.
export const ENERGIA = {
  segundosAgarrando: 7, // s que dura la energía completa de una mano agarrada (con la otra suelta)
  factorDosManos: 0.6, // con las dos manos agarradas cada una gasta a este ritmo (menos de 1 = más lento)
  segundosRecuperar: 5, // s que tarda una mano libre en recuperar la energía completa
  minimoParaAgarrar: 0.15, // energía mínima para poder agarrar (evita agarrar y soltarse enseguida)

  // Color del anillo: verde con mucha energía, ámbar en el medio, rojo al final (con transición suave)
  verdeDesde: 0.65,
  ambarEn: 0.4,
  rojoDesde: 0.15,

  radioInterno: 0.075, // anillo alrededor del guante (m)
  radioExterno: 0.092,
  segmentos: 40,
};

// Checkpoints: plataformas donde el jugador descansa y reaparece.
export const CHECKPOINT = {
  grosor: 0.12, // grosor (m) de la plataforma
  toleranciaApoyo: 0.12, // cuánto (m) por debajo de la plataforma ya cuenta como parado en ella
  alturaApoyo: 0.6, // hasta cuánto (m) por encima de la plataforma sigue contando como apoyado
};

// Modo escritorio (sin casco): pensado solo para probar.
export const ESCRITORIO = {
  velocidadCaminar: 2.2, // m/s con WASD
  duracionViaje: 650, // ms que tarda en llevar al jugador hasta el agarre clickeado
  distanciaAlAgarre: 0.55, // a qué distancia (m) del agarre queda el jugador
  alturaAgarre: 1.45, // altura (m) a la que queda el agarre respecto del piso del jugador

  // Escalada con mouse: botón izquierdo = mano izquierda, botón derecho = mano derecha.
  alcance: 1.0, // distancia máxima (m) de la cámara a un agarre para poder agarrarlo con el mouse
  metrosPorPixel: 0.004, // cuánto se mueve la mano por cada píxel que se mueve el mouse
  reposoMano: {
    // dónde queda cada guante (respecto del rig) cuando no está agarrando: x, y, z en metros
    izquierda: [-0.3, 1.2, -0.55],
    derecha: [0.3, 1.2, -0.55],
  },
};

// Fragmentos: hay uno por tramo; se juntan tocándolos con la mano. Los que la niebla se come aparecen
// medio escondidos en la plataforma de arriba.
export const FRAGMENTO = {
  radio: 0.15, // tamaño del fragmento (m)
  distanciaAlFrente: 0.3, // cuánto sale de la pared (m)
  radioRecoger: 0.45, // distancia (m) de la mano a la que se recoge
  radioRecogerCuerpo: 0.6, // en la plataforma de arriba también se recogen al pasar cerca (m)
  velocidadPulso: 0.5, // Hz: el brillo respira muy despacio, sin parpadeo
  // Escondites en la plataforma de arriba: x, y distancia (m) hacia afuera desde la pared
  escondites: [
    { x: -1.2, z: 0.45 },
    { x: 1.15, z: 0.95 },
    { x: 0.3, z: 0.2 },
  ],
  hundimiento: 0.02, // altura del centro respecto del piso de la plataforma: medio escondidos
  sonido: {
    distanciaMax: 8, // m: más lejos que esto no se oye
    frecuencias: [523.25, 783.99], // do y sol, un sonido tranquilo
    volumen: 0.9,
  },
};

// Pulsera en la muñeca izquierda: contador de fragmentos y barra de espera del escaneo.
export const PULSERA = {
  ancho: 0.26,
  alto: 0.13,
  desplazamiento: [0, 0.17, 0], // dónde queda el panel respecto del guante (m)
  radioToque: 0.09, // distancia (m) a la que la otra mano toca la pulsera
};

// Pulso de escaneo: una onda suave marca por un segundo dónde está el fragmento del tramo.
export const ESCANEO = {
  espera: 10, // s hasta poder volver a usarlo
  duracionMarca: 1, // s que queda marcado el fragmento
  duracionOnda: 1.2, // s que tarda la onda en recorrer la pared
  radioOnda: 3.5, // m que alcanza la onda
  tecla: 'KeyE', // en modo escritorio
};

// Niebla de píxeles: sube despacio desde abajo y a velocidad constante.
export const NIEBLA = {
  alturaInicial: -2, // m
  velocidad: 0.1, // m/s
  retardoInicio: 5, // s después de agarrarse por primera vez
  retroceso: 3, // m por debajo del checkpoint donde queda al devolver al jugador
  velocidadFinal: 2, // m/s: cuando el jugador llega arriba, se come lo que quedó sin juntar
  distanciaAPlataforma: 0.8, // m: arriba se detiene por debajo del piso de la plataforma
  ancho: 16, // m (igual que la sala)
  alto: 30, // m de espesor
  pixeles: 260, // cantidad de píxeles flotando en el borde de arriba
  tamanoPixel: 0.5,
  opacidad: 0.4,
  fraccionCatch: 0.3, // m por encima de los pies a los que la niebla alcanza al jugador
};

// Frases del Glitch: aparecen en un cartel breve, con humor y sin burlarse.
export const GLITCH = {
  duracion: 3.5, // s que se ve cada frase
  distancia: 1.0, // m delante de la cabeza
  alturaExtra: 0.3, // m por encima de la mirada
  suavizado: 4, // cuánto sigue a la cabeza (más alto = más rápido)
  espera: 8, // s mínimos antes de repetir la misma frase
  frases: {
    comido: ['Ñam, este te lo escondo arriba'],
  },
};
