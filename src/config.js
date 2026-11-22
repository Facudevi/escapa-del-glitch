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
  cable: '#9a98b8', // cable USB de la tirolesa
  enchufe: '#c9cdd8',

  // Exterior al amanecer
  cielo: ['#8fb4de', '#bcd4ea', '#f3d9b8', '#f6c5a0'], // de arriba (celeste) a la línea del horizonte (durazno)
  pasto: '#7fae8a',
  montanas: ['#8c7fb3', '#a392c7', '#7c88b8', '#9a8fc0'],
  sol: '#f7c982',
  nieblaExterior: '#f3d3b5',
  luzRotura: '#ffe9c7', // luz cálida que sale de la grieta del RESET
  grieta: '#efe6ff',
  resetListo: '#9b82e6', // botón RESET encendido
  oro: '#e0b34a',
  plata: '#c9cdd8',
  bronce: '#c18a5a',
};

// Ambiente general de la sala.
export const AMBIENTE = {
  nieblaDensidad: 0.02,
  intensidadAmbiente: 1.5,
  intensidadPunto: 1.2,
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

// Escenario: el setup gamer gigante que se escala (en metros). Las proporciones respetan las de los
// objetos reales a escala 1 cm = 18 cm: una tecla mide 34 cm, el teclado 7,7 m de ancho, la torre de PC
// 4 m de ancho y 8 m de alto y el monitor 11 m de ancho y 6,5 m de alto.
// Cada tramo es una pared amplia sin camino marcado; el generador (src/tramos.js) arma una ruta
// garantizada y agarres de más, con dificultad creciente.
export const ESCENARIO = {
  semilla: 20261121, // cambia la distribución de los agarres (la misma semilla da siempre la misma pared)
  escala: 18, // cuántas veces más grande que el objeto real es todo el setup
  anchoPared: 12.5, // la pared va de -ancho/2 a +ancho/2 en x
  z: -1.8, // centro de la pared; el frente de la pared queda en z + profundidadPared/2 = -1.7
  profundidadPared: 0.2,
  salienteAgarres: 1.15, // cuánto salen los agarres del frente de la pared: más que todo el decorado (que sale hasta 0,7)
  tecla: { ancho: 0.4, alto: 0.14, profundidad: 0.65 }, // medida de la tecla firme y la que se hunde (larga: llega hasta el decorado)
  primerAgarre: 1.2, // altura del primer agarre sobre cada plataforma
  separacionMinima: 0.5, // distancia mínima (m) entre agarres
  zonaFragmento: 1.3, // radio (m) alrededor de un fragmento donde los agarres son más difíciles
  panel: { separacionAgarres: 0.3, centro: 0.82 }, // los agarres de un panel quedan a ±separacion del centro; centro = cuánto sale su cuerpo de la pared
  // Plataformas de descanso de los tramos 1 y 2: un entrepaño con profundidad donde se puede caminar
  plataforma: { ancho: 12, profundidad: 2.4, grosor: 0.2, spawnZ: -0.15 },
  // Plataforma de arriba (sobre el monitor): un piso grande por donde se camina hasta el botón RESET
  final: {
    ancho: 12,
    fondoZ: -7.4, // hasta dónde llega el piso hacia el fondo de la sala
    bordeZ: 0.3, // el borde que sobresale hacia el jugador
    spawnZ: -2.2, // dónde reaparece el jugador
    altoFondo: 6, // alto del panel del fondo, donde está el botón RESET grande
  },

  // Tramos de abajo hacia arriba. `alto` es lo que sube cada uno (la parte de arriba del checkpoint).
  //   paso: separación vertical (m) entre agarres al principio y al final del tramo (sube con la dificultad)
  //   distanciaMax: distancia máxima (m) entre agarres consecutivos de la ruta garantizada
  //   amplitud: cuánto se aparta del centro del zigzag la ruta (m); xMax: hasta dónde llegan los agarres
  //   reglas: tipos especiales, desde qué fracción del tramo aparecen y con qué probabilidad
  //   paneles: fracciones del tramo donde la ruta pasa por un panel que gira
  //   extras: agarres de más por cada agarre de la ruta (la pared es amplia y hay donde elegir)
  //   fragmento: fracción de altura del fragmento; enRuta = está justo en el camino (tutorial)
  //   tiposDificiles: tipos con los que se endurece la zona del fragmento
  tramos: [
    {
      nombre: 'Teclado',
      alto: 5.6,
      paso: [0.45, 0.6],
      distanciaMax: 0.8,
      amplitud: [0.45, 1.2],
      xMax: 5.6,
      reglas: [{ tipo: 'hunde', desde: 0.7, prob: 0.5 }],
      paneles: [],
      extras: 2.4,
      fragmento: { fraccion: 0.4, enRuta: true },
      tiposDificiles: [],
    },
    {
      nombre: 'Torre de PC',
      alto: 8,
      paso: [0.5, 0.68],
      distanciaMax: 0.85,
      amplitud: [0.5, 1.5],
      xMax: 5.6,
      reglas: [
        { tipo: 'lata', desde: 0.25, prob: 0.5 },
        { tipo: 'hunde', desde: 0.15, prob: 0.3 },
      ],
      paneles: [0.25, 0.55],
      extras: 2.4,
      fragmento: { fraccion: 0.65, enRuta: false },
      tiposDificiles: ['lata', 'hunde'],
    },
    {
      nombre: 'Monitor',
      alto: 7,
      paso: [0.5, 0.75],
      distanciaMax: 1.05,
      amplitud: [0.6, 1.9],
      xMax: 5.6,
      reglas: [
        { tipo: 'intermitente', desde: 0, prob: 0.75 },
        { tipo: 'lata', desde: 0.4, prob: 0.15 },
        { tipo: 'hunde', desde: 0.2, prob: 0.1 },
      ],
      paneles: [0.25, 0.5, 0.75],
      extras: 2.0,
      fragmento: { fraccion: 0.7, enRuta: false },
      tiposDificiles: ['intermitente', 'lata'],
    },
  ],
};

// Límites para el jugador: no puede salir del espacio de juego (ni caminar por el "limbo" de afuera).
export const LIMITES = {
  margen: 0.3, // m que se deja de borde respecto de las paredes y los bordes de las plataformas
  sala: 8, // medio lado de la sala (m)
  aire: { zAtras: -0.6, zAdelante: 0.6 }, // mientras escala, cuánto puede separarse de la pared (m)
  piso: { zAtras: -0.4 }, // en el piso de la sala no puede entrar en la pared
  pisoTolerancia: 0.05, // altura (m) hasta la que se considera que está en el piso de la sala
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
  profundidad: 0.65,
  radioAnilloInterno: 0.27, // anillo que muestra cuánto tiempo le queda visible
  radioAnilloExterno: 0.3,
};

// Panel que gira: muestra agarres de un lado y después gira.
export const PANEL = {
  ancho: 1.1,
  alto: 0.8,
  grosor: 0.12,
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
  graciaReinicio: 1500, // ms sin poder caer después de volver a jugar
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

// Fragmentos: hay uno por tramo; se juntan tocándolos con la mano. Cuando la niebla se come uno, el Glitch lo
// lleva a otro agarre del tramo siguiente; si ya no queda tramo (o el jugador ya llegó arriba), lo esconde
// medio hundido entre los objetos de videojuegos del piso de arriba.
export const FRAGMENTO = {
  total: 3, // fragmentos que hay que juntar para encender el RESET
  radio: 0.15, // tamaño del fragmento (m)
  distanciaAlFrente: 1.25, // cuánto sale del frente de la pared (m): por delante de todo el decorado y los agarres
  alturaMinimaSobreJugador: 1.0, // un fragmento reubicado queda al menos esto (m) por encima del jugador
  separacionMinima: 1.5, // distancia (m) mínima entre dos fragmentos en la pared
  radioRecoger: 0.45, // distancia (m) de la mano a la que se recoge
  radioRecogerCuerpo: 0.6, // en la plataforma de arriba también se recogen al pasar cerca (m)
  velocidadPulso: 0.5, // Hz: el brillo respira muy despacio, sin parpadeo
  // Escondites sobre el piso de arriba (x y z del mundo), pegados a los objetos de videojuegos que lo decoran:
  // detrás del joystick, del control, de los cartuchos y de los auriculares
  escondites: [
    { x: -5.3, z: -4.5 },
    { x: 5.2, z: -4.4 },
    { x: -4.3, z: -6.6 },
    { x: 4.5, z: -6.6 },
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
  velocidad: 0.15, // m/s
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
  esperaPorFrase: { quieto: 45, niebla: 15 }, // tiempos de espera propios de algunas frases (s)
  quietoSegundos: 25, // s sin moverse (después del primer agarre) para que el Glitch comente
  maxEnCola: 2, // frases que pueden esperar su turno mientras se muestra otra
  frases: {
    comido: ['Ñam, este te lo escondo arriba'],
    caida: ['Ese agarre no te quería'],
    quieto: ['¿Te tomaste un cooldown?'],
    sinFragmentos: ['¿No te olvidaste de algo?'],
    niebla: ['La niebla te alcanzó: volvé a subir'],
    reset: ['Bueno, ganaste. Nos vemos afuera'],
    faltan: ['El RESET todavía no enciende: faltan fragmentos'],
  },
};

// Música de fondo: acordes suaves que cambian despacio.
export const MUSICA = {
  volumen: 1.1, // relativo al volumen general de SONIDO
  segundosPorAcorde: 8,
  ataque: 2.5, // s que tarda cada acorde en subir
  cola: 3, // s extra que tarda en apagarse
  teclaSilencio: 'KeyM', // en modo escritorio; con casco, botón B o Y
};

// Tirolesa: un cable USB en lo alto de la torre que lleva solo hasta el segundo checkpoint.
export const TIROLESA = {
  velocidad: 1.5, // m/s, constante (sin aceleraciones, para no marear)
  altoBajoCheckpoint: 2.1, // m por debajo del checkpoint donde está el enchufe
  xMin: 3.6, // m: el enchufe está lejos del centro, entre xMin y xMax (se busca un lugar libre)
  xMax: 5.3,
  tolerancia: 0.3, // multiplicador del radio de agarre: hay que tocar casi justo el enchufe
  radioCable: 0.03,
  alturaArco: 0.4, // m que se levanta el camino a mitad de recorrido
  curvaZ: 0.35, // m que sale el cable hacia el jugador a mitad de recorrido
  margenProteccion: 800, // ms extra sin caer después de llegar al checkpoint
  enchufe: { ancho: 0.16, alto: 0.09, profundidad: 0.26, saliente: 1.05 }, // chico y gris, casi como parte de la torre
};

// Final: el botón RESET, la rotura de la pantalla, el exterior al amanecer y la medalla.
export const FINAL = {
  umbralGolpe: 1.0, // m/s hacia el botón para que cuente como golpe con la mano (solo con casco)
  radioGolpe: 0.4, // m de distancia a la que la mano puede golpear un botón común
  alturaGrietas: 4.4, // m sobre el piso de arriba donde nace la rotura, en el panel del fondo
  radioGolpeReset: 1.3, // el botón RESET es grande: se puede golpear desde más lejos de su centro
  alcanceClic: 3.4, // m: en modo escritorio, hasta dónde se puede hacer clic en un botón
  enfriamientoGolpe: 1.2, // s hasta que el mismo botón vuelve a aceptar un golpe
  medallas: { oro: 120, plata: 180 }, // s: menos de 2 min oro, menos de 3 min plata, el resto bronce
  frase: 'Subiste de nivel, adentro y afuera de la pantalla',
  teclaReiniciar: 'KeyR', // en modo escritorio, para volver a jugar
  duracionGrietas: 0.9, // s que tardan las grietas en abrirse
  pausaAntesDeLuz: 1.2, // s entre el golpe y el comienzo del fundido (tiempo para leer la frase del Glitch)
  duracionLuz: 1.5, // s del fundido hacia la luz del amanecer (y de vuelta)
  radioLuz: 7, // m que llega a abrirse la luz sobre la pantalla
  grietas: 9, // cantidad de grietas que salen del botón
  exterior: {
    x: 300, // el exterior está lejos de la sala, en x
    radioLimite: 9, // m: hasta dónde se puede caminar
    densidadNiebla: 0.004,
  },
};

// Modo fácil: para quien quiere más margen (se elige en la pantalla de inicio o con ?facil=1 en el link).
// Los números son multiplicadores sobre los valores normales.
export const FACIL = {
  factorAlcance: 1.4, // agarrar desde más lejos (JUGADOR.radioAgarre)
  factorEnergia: 1.6, // la energía de cada mano dura más (ENERGIA.segundosAgarrando)
  factorNiebla: 0.6, // la niebla sube más despacio (NIEBLA.velocidad)
};

// Colores del decorado del setup gamer (apagados y cálidos, para que los agarres se destaquen).
export const DECORADO = {
  // Escritorio y accesorios
  escritorio: '#5a4636',
  escritorioBorde: '#7a604a',
  alfombrilla: '#2d2a3d',
  alfombrillaBorde: '#5a4f78',
  taza: '#5b8a86',
  cafe: '#2b2118',
  // Teclado
  tecladoCarcasa: '#2c2738',
  tecladoBase: '#1f1b29',
  apoyamunecas: '#3a3447',
  teclas: ['#3b3449', '#443c54'],
  teclaEspecial: '#30293e',
  leyenda: '#cfc6e4',
  raton: '#3d3650',
  // Torre de PC
  torreCarcasa: '#2b2840',
  placaBase: '#2e4a45',
  placaBaseDetalle: '#3f6a60',
  metal: '#8f8aa8',
  metalOscuro: '#4a4666',
  ventilador: '#3d3a58',
  ventiladorAspa: '#6a6690',
  gpu: '#262335',
  gpuAcento: '#7a62b8',
  ram: '#8a84a6',
  ramLuz: '#9d86e6',
  cables: ['#9b82e6', '#6fae8f', '#d9a15b'],
  parlante: '#2e2a3c',
  parlanteCono: '#524c6c',
  // Monitor
  monitorMarco: '#232030',
  monitorPantalla: '#27304f',
  // Plataformas
  rejilla: '#3c3650', // entrepaño de rejilla metálica
  soporte: '#2f2b42',
  luzCheckpoint: '#6fae8f', // franja de luz suave que marca el checkpoint
  pisoFinal: '#6a5a88',
  pisoFinalBaldosa: '#7a6a9a',
  fondoFinal: '#3d3460',
  // Objetos de videojuegos del piso de arriba
  controlCuerpo: '#cfc6e4',
  controlBotones: ['#7a62b8', '#6fae8f', '#d9a15b', '#c4665b'],
  joystickBase: '#3b3449',
  joystickPalo: '#2a2638',
  joystickBola: '#c4665b',
  cartucho: ['#7a62b8', '#5b8a86', '#d9a15b'],
  dado: '#8fc3e6',
  moneda: '#e0b34a',
  hongo: '#c4665b',
  hongoPuntos: '#f0e9fb',
  auriculares: '#3d3650',
};
