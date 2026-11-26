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
  luzSolExterior: '#fff1da', // luz cálida del amanecer sobre los objetos del exterior
  fraseCielo: '#fffaf0', // letras de los carteles sin fondo
  // Título del final en el cielo, estilo «nivel superado»: cara crema, volumen lavanda a violeta y cinta clara
  tituloNivel: {
    cara: '#fffaf0',
    volumen: ['#b9a6dc', '#9b84cf', '#7b5cc4'], // de la capa pegada a la cara a la más profunda
    sombra: 'rgba(60, 40, 90, 0.35)',
    cinta: '#fffaf0',
    cintaTexto: '#3c3489',
  },
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
  luces: [{ y: 5, z: 7 }, { y: 14, z: 5 }, { y: 23, z: 3 }, { y: 31, z: 0 }], // luces puntuales cálidas: altura y z (delante de cada tramo)
};

// Medidas de la sala de pruebas de la etapa 1 (en metros).
export const SALA = {
  lado: 18, // la sala es un cuadrado de lado x lado
  altoParedes: 36, // paredes que marcan los límites (tienen que llegar a lo más alto de la escalada)
};

// Jugador y manos.
export const JUGADOR = {
  alturaOjos: 1.6, // altura de la cámara en modo escritorio
  radioGuante: 0.06,
  mano: { largoPalma: 0.085, anchoPalma: 0.08, grosorPalma: 0.034, radioDedo: 0.0105, escala: 1.2 }, // medidas de la mano dibujada (m); escala la agranda (manos de dibujos animados, más gordas)
  radioAgarre: 0.18, // distancia máxima (m) entre la mano y el agarre para poder agarrarlo
};

// Caminar con el stick de los controles (VR), sin desplazarse físicamente por la habitación.
export const STICK = {
  velocidad: 1.8, // m/s, constante (sin aceleración, para que no maree)
  zonaMuerta: 0.3, // de 0 a 1: por debajo de esta inclinación el stick no mueve al jugador
};

// Vibración del control al agarrar (si el casco la soporta).
export const VIBRACION = {
  fuerza: 0.35, // de 0 a 1
  duracion: 40, // ms
};

// Escenario: el setup gamer gigante que se escala (en metros). Cada tramo es un ESCALÓN: una pared de un
// objeto (teclado, torre de PC, monitor) con un piso arriba donde el jugador descansa (el checkpoint). Desde
// ese piso se ve de frente la pared del tramo siguiente, que está `profundidadPiso` metros más atrás.
// Las proporciones de la torre y el monitor respetan las de los objetos reales a escala 1 cm = 18 cm; el
// teclado se agranda (unidad de tecla de 50 cm) para que ocupe todo el ancho de la pared.
// Cada tramo es una pared amplia sin camino marcado: el generador (src/tramos.js) reparte los agarres por
// toda la pared, parejos pero sin orden evidente, de modo que haya muchos caminos posibles para subir.
// Los tipos de agarre más difíciles aparecen más en los tramos de arriba.
export const ESCENARIO = {
  semilla: 20261339, // cambia la distribución de los agarres (la misma semilla da siempre la misma pared)
  escala: 18, // cuántas veces más grande que el objeto real es todo el setup
  anchoPared: 12.5, // la pared va de -ancho/2 a +ancho/2 en x
  zFrente: 4.0, // z del frente del primer escalón (el teclado); el de cada tramo siguiente queda más atrás
  profundidadPiso: 3.4, // lo que mide hacia atrás el piso de cada escalón (m): deja lugar para moverse entre el borde y la pared
  distanciaAlJugador: 1.65, // a cuántos m del frente de una pared se para el jugador al escalarla (y al llegar a su piso)
  salienteAgarres: 1.15, // cuánto salen los agarres del frente de la pared: más que todo el decorado (que sale hasta 0,7)
  tecla: { ancho: 0.46, alto: 0.3, profundidad: 0.65 }, // medida de la tecla firme y la que se hunde (larga: llega hasta el decorado)
  primerAgarre: 1.2, // altura del primer agarre sobre el piso de cada tramo
  panel: { separacionAgarres: 0.3, centro: 0.82 }, // los agarres de un panel quedan a ±separacion del centro; centro = cuánto sale su cuerpo de la pared
  // Teclado del primer tramo: unidad de tecla, y y (sobre el piso) de la fila de arriba de las teclas
  teclado: { unidad: 0.5, arriba: 8.0 },
  // Reborde de arriba de cada pared: tramos cortos de barra que el jugador agarra para subir al piso
  borde: { alto: 0.16, grosor: 0.18, bajoElTope: 0.15, ancho: 2.2, posiciones: [-3.2, 0, 3.2] }, // ancho de cada tramo de reborde y dónde están (x)
  // Piso de arriba (sobre el monitor): se camina hasta el botón RESET, al fondo de la sala
  final: {
    ancho: 12.5,
    fondoZ: -8.4, // hasta dónde llega el piso hacia el fondo de la sala
    spawnDesdeElBorde: 1.2, // a cuántos m del borde de adelante queda el jugador al llegar o reaparecer
    altoFondo: 6, // alto del panel del fondo, donde está el botón RESET grande
  },

  // Tramos de abajo hacia arriba. `alto` es lo que sube cada uno (hasta su piso).
  //   xMax: hasta dónde llegan los agarres a cada lado del centro (m)
  //   rejilla: separación horizontal y vertical (m) de la trama de la que salen los agarres; se corren un poco
  //     al azar, así no se nota el orden. Más separación = menos agarres y saltos más largos (más difícil)
  //   alcance: distancia máxima (m) entre dos agarres vecinos, que garantiza que se pueda pasar de uno a otro
  //   quitar: fracción de agarres que se sacan al azar (siempre quedan caminos de subida) para que haya huecos
  //   mezcla: qué fracción de los agarres es de cada tipo especial y desde qué fracción de altura del tramo
  //     (más difícil cuanto más arriba); se reparten lo más lejos posible entre sí
  //   paneles: fracciones del tramo donde hay un panel que gira
  //   estantes: pequeñas bases salientes donde el jugador puede pararse y soltarse (fracción de altura y x del centro)
  //   fragmento: fracción de altura donde está el fragmento; en los tramos de arriba, `dificiles` son los tipos con los
  //     que se endurece la zona de `zona` metros alrededor del fragmento (y el agarre más cercano también);
  //     con `panelDebajo`, el fragmento queda en `zonaX` (x) sobre una lata, y el único camino hasta ella pasa por un panel
  tramos: [
    {
      nombre: 'Teclado',
      alto: 9, // más alto que el objeto real a propósito, para que el primer tramo no se supere tan rápido
      xMax: 4.4,
      rejilla: { columnas: 1.7, filas: 0.85 },
      alcance: 1.35,
      quitar: 0.1,
      mezcla: [{ tipo: 'hunde', fraccion: 0.1, desde: 0.6 }], // fácil: casi todo firme, y apenas teclas que se hunden arriba
      paneles: [],
      estantes: [{ fraccion: 0.45, x: -2.8 }],
      fragmento: { fraccion: 0.7 },
    },
    {
      nombre: 'Torre de PC',
      alto: 10,
      xMax: 4.4,
      rejilla: { columnas: 1.8, filas: 0.9 },
      alcance: 1.4,
      quitar: 0.15,
      mezcla: [
        { tipo: 'hunde', fraccion: 0.1, desde: 0.15 },
        { tipo: 'lata', fraccion: 0.15, desde: 0.3 },
      ], // media: latas que se rompen y teclas que se hunden, repartidas
      paneles: [0.2], // más el panel que está justo debajo del fragmento
      estantes: [{ fraccion: 0.3, x: -2.8 }, { fraccion: 0.82, x: -1.4 }],
      fragmento: { fraccion: 0.62, dificiles: ['lata', 'hunde'], zona: 1.2, panelDebajo: true, zonaX: [-4.4, -1.6] }, // el fragmento está en la zona izquierda, sobre una lata a la que se llega por un panel que gira
    },
    {
      nombre: 'Monitor',
      alto: 9,
      xMax: 4.4,
      rejilla: { columnas: 1.85, filas: 0.95 },
      alcance: 1.55,
      quitar: 0.2,
      mezcla: [
        { tipo: 'intermitente', fraccion: 0.25, desde: 0 },
        { tipo: 'lata', fraccion: 0.1, desde: 0.4 },
        { tipo: 'hunde', fraccion: 0.05, desde: 0.2 },
      ], // difícil: bloques que aparecen y desaparecen, con algunas latas
      paneles: [0.2, 0.55, 0.85],
      estantes: [{ fraccion: 0.38, x: -2.8 }, { fraccion: 0.7, x: 2.8 }],
      fragmento: { fraccion: 0.7, dificiles: ['intermitente', 'lata'], zona: 1.3 }, // el fragmento queda en una zona de bloques que aparecen y desaparecen
    },
  ],
};

// Estantes: pequeñas bases que salen de la pared en medio de cada tramo, donde el jugador puede pararse sin
// agarrarse (no son checkpoints: si cae, vuelve al último piso).
export const ESTANTE = {
  ancho: 1.9, // m
  profundidad: 2.1, // m que sale de la pared (llega por delante de los agarres, hasta donde está el jugador)
  grosor: 0.14,
  despejeArriba: 1.0, // m por encima del estante sin agarres (lugar para el cuerpo)
  despejeAbajo: 0.35, // m por debajo del estante sin agarres
  caidaMaxima: 0.8, // m: si el jugador se suelta hasta esta altura sobre un estante, cae parado en él
};

// Cuerpo del jugador: torso, cadera y piernas que siguen a la cabeza, para ver dónde está el cuerpo (si la
// niebla lo toca o si está parado sobre un estante).
export const CUERPO = {
  color: '#7b6aa8',
  colorPeligro: '#c4665b', // cuando la niebla le llega a los pies
  distanciaPeligro: 0.6, // m: a cuánto por encima de los pies tiene que estar la niebla para avisar
  anchoTorso: 0.34,
  alturaHombros: 0.25, // m por debajo de los ojos
  alturaCadera: 0.85, // m sobre los pies (en modo escritorio)
};

// Límites para el jugador: no puede salir del espacio de juego (ni caminar por el "limbo" de afuera).
export const LIMITES = {
  margen: 0.3, // m que se deja de borde respecto de las paredes y los bordes de los pisos
  sala: 9, // medio lado de la sala (m)
  aire: { zAtras: -0.6, zAdelante: 0.6 }, // mientras escala, cuánto puede separarse de su lugar frente a la pared (m)
  piso: { cercaDeLaPared: 0.9 }, // en el piso de la sala, a cuánto del frente de la pared puede acercarse (m)
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
  radio: 0.2,
  alto: 0.4,
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
  intensidad: 0.5, // brillo propio del agarre cuando una mano lo tiene al alcance, de 0 a 1
  base: 0.22, // brillo propio de todos los agarres, para que se distingan del decorado
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
  radioRecogerDificil: 0.36, // en la torre y el monitor hay que acercar más la mano (m)
  radioRecogerCuerpo: 0.6, // en la plataforma de arriba también se recogen al pasar cerca (m)
  velocidadPulso: 0.5, // Hz: el brillo respira muy despacio, sin parpadeo
  // Escondites sobre el piso de arriba, entre los objetos de videojuegos pero a la vista (nunca debajo ni detrás
  // de ellos, mirando desde donde llega el jugador): x del mundo y z medida desde el borde de adelante del piso
  // (negativo = hacia el fondo). Delante del control, al lado del joystick, junto a los cartuchos y junto a los
  // auriculares.
  escondites: [
    { x: -4.6, z: -0.9 },
    { x: 2.4, z: -2.0 },
    { x: -2.0, z: -3.8 },
    { x: 2.2, z: -3.7 },
  ],
  alturaEscondite: 0.5, // altura del centro sobre el piso de arriba: flota un poco, así se ve desde lejos
  sonido: {
    distanciaMax: 8, // m: más lejos que esto no se oye
    frecuencias: [523.25, 783.99], // do y sol, un aviso tranquilo
    cada: 2.6, // s entre un aviso y el siguiente (no es un sonido continuo)
    duracion: 1.2, // s que tarda en apagarse cada aviso
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
  alturaInicial: -0.6, // m: apenas debajo del piso, así se ve desde que empieza a subir
  velocidad: 0.2, // m/s
  retardoInicio: 4, // s después de agarrarse por primera vez
  retroceso: 3, // m por debajo del checkpoint donde queda al devolver al jugador
  alcanceTramo: 0.75, // al completar un tramo, la niebla sube enseguida hasta esta fracción de ese tramo
  velocidadAlcance: 1.5, // m/s con que sube hasta ahí
  velocidadFinal: 2, // m/s: cuando el jugador llega arriba, se come lo que quedó sin juntar
  distanciaAPlataforma: 0.8, // m: arriba se detiene por debajo del piso de la plataforma
  ancho: 18, // m (igual que la sala)
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
    salteado: ['Te olvidaste un fragmento: lo mando más arriba'],
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
  volumen: 0.35, // relativo al volumen general de SONIDO: bien bajito, de fondo
  pulsosPorMinuto: 66, // lento y tranquilo
  filtro: 1800, // Hz: corta los agudos para que suene redondo y suave
  ataque: 0.12, // s que tarda cada nota en subir
  liberacion: 0.7, // s que tarda cada nota en apagarse (se pisa un poquito con la siguiente)
  eco: { tiempo: 0.6, nivel: 0.22 }, // eco leve: segundos de demora y volumen
  anticipacion: 1.5, // s de melodía que se programan por adelantado
  // Melodía en do mayor pentatónica: [frecuencia en Hz (0 = silencio), duración en pulsos]. Dos frases de 8 pulsos y
  // un silencio de 4 pulsos, y vuelve a empezar.
  frases: [
    [[659.25, 1], [783.99, 1], [880.0, 1.5], [783.99, 0.5], [659.25, 1], [587.33, 1], [523.25, 2]],
    [[587.33, 1], [659.25, 1], [783.99, 2], [659.25, 1], [587.33, 1], [523.25, 1], [440.0, 1]],
    [[0, 4]],
  ],
  teclaSilencio: 'KeyM', // en modo escritorio; con casco, botón B o Y
};

// Tirolesa: un cable USB en lo alto de la torre que lleva solo hasta el segundo checkpoint.
export const TIROLESA = {
  velocidad: 1.5, // m/s, constante (sin aceleraciones, para no marear)
  altoBajoCheckpoint: 2.1, // m por debajo del checkpoint donde está el enchufe
  xMin: 3.6, // m: el enchufe está lejos del centro, entre xMin y xMax (se busca un lugar libre)
  xMax: 5.3,
  tolerancia: 0.1, // multiplicador del radio de agarre: hay que tocar el enchufe casi con la mano (2 cm)
  radioCable: 0.03,
  alturaArco: 0.4, // m que se levanta el camino a mitad de recorrido
  curvaZ: 0.35, // m que sale el cable hacia el jugador a mitad de recorrido
  margenProteccion: 800, // ms extra sin caer después de llegar al checkpoint
  enchufe: { ancho: 0.08, alto: 0.05, profundidad: 0.2, saliente: 1.05 }, // chiquito y del color de la torre, casi invisible
  distanciaAgarres: { min: 1.0, max: 1.3 }, // distancia (m) al agarre más cercano: hay que estirarse para llegar
};

// Ascenso automático al piso de cada escalón, al agarrarse del reborde de arriba de la pared.
export const ASCENSO = {
  velocidad: 1.6, // m/s, constante (sin aceleraciones, para no marear)
  alturaPorEncima: 0.35, // m que sube el camino por encima del piso antes de avanzar sobre él
  margenProteccion: 700, // ms extra sin caer después de llegar al piso
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
  frase: { titulo: 'Subiste de nivel', bajada: 'adentro y afuera de la pantalla' }, // título del cielo y su bajada
  cielo: {
    y: 14, // dónde flota el título, en el cielo, frente al jugador
    distancia: 30,
    ancho: 30,
    alto: 8,
    pixelesPorMetro: 80, // resolución del dibujo del título
    entrada: { duracion: 0.9, escalaInicial: 0.75, rebote: 1.2 }, // al aparecer: crece con un rebote chico (s)
    flotar: { amplitud: 0.3, periodo: 5 }, // después flota despacio: m arriba y abajo, s por vuelta
  },
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
    intensidadSol: 1.1, // luz que ilumina los objetos del exterior
  },
};

// Paisaje del exterior del final (árboles, pasto, flores, pajaritos, mariposas y nubes que se mueven).
export const PAISAJE = {
  arboles: 34,
  radioArboles: [9, 50], // m desde el jugador
  colorHojas: ['#6fae8f', '#5b9a7a', '#86b98f', '#4f8a6c'],
  matas: 260,
  flores: 170,
  radioFlores: 16, // m
  colorFlores: ['#f2a7c3', '#f6d36b', '#c1adf5', '#ffffff', '#f6a67a'],
  pajaros: 7,
  mariposas: 5,
  nubes: 7,
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
  tecladoCarcasa: '#3d3753',
  tecladoBase: '#2a2540',
  apoyamunecas: '#4d4566',
  teclas: ['#5b5273', '#645a7d'],
  teclaEspecial: '#463e5c',
  leyenda: '#cfc6e4',
  raton: '#3d3650',
  // Torre de PC
  torreCarcasa: '#3a3756',
  placaBase: '#2e4a45',
  placaBaseDetalle: '#3f6a60',
  metal: '#8f8aa8',
  metalOscuro: '#5a5678',
  ventilador: '#4a4768',
  ventiladorAspa: '#6a6690',
  gpu: '#262335',
  gpuAcento: '#7a62b8',
  ram: '#8a84a6',
  ramLuz: '#9d86e6',
  cables: ['#9b82e6', '#6fae8f', '#d9a15b'],
  parlante: '#3a3650',
  parlanteCono: '#625c80',
  // Monitor
  monitorMarco: '#2d2a40',
  monitorPantalla: '#27304f',
  // Escalones y pisos
  bloque: '#2b2640', // bloque macizo de cada escalón
  torreFondo: '#352f50', // fondo de la pared de la torre y del monitor
  torreFondoTira: '#40395f',
  enchufeOculto: '#4a4666', // enchufe USB de la tirolesa: casi del color de la torre
  poste: '#8a85a8', // poste que une cada agarre con la pared (más claro que el decorado, para que se vea)
  postePlaca: '#6a6590',
  estante: '#8a6f55', // estantes: madera cálida, distinta de la pared
  luzEstante: '#e0b36a', // borde ámbar suave de los estantes // placa que lo apoya contra la pared
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
