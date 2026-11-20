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
};

// Ambiente general de la sala.
export const AMBIENTE = {
  nieblaDensidad: 0.02,
  intensidadAmbiente: 1.0,
  intensidadPunto: 1.1,
};

// Medidas de la sala de pruebas de la etapa 1 (en metros).
export const SALA = {
  lado: 16, // la sala es un cuadrado de lado x lado
  altoParedes: 8, // paredes que marcan los límites
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

// Pared de prueba (en metros). Muestra un ejemplo de cada tipo de agarre; se reemplaza por los
// tramos reales en la etapa 6.
export const PARED_PRUEBA = {
  ancho: 5,
  alto: 8,
  profundidad: 0.2,
  z: -0.9, // centro de la pared; los agarres sobresalen hacia el jugador
  tecla: { ancho: 0.4, alto: 0.14, profundidad: 0.3 }, // medida de la tecla firme y la que se hunde
  // Agarres: tipo ('firme', 'hunde', 'lata' o 'intermitente'), posición x e y, y fase (s) del intermitente
  agarres: [
    { tipo: 'firme', x: -0.65, y: 1.2 },
    { tipo: 'firme', x: 0.5, y: 1.7 },
    { tipo: 'hunde', x: -0.5, y: 2.2 },
    { tipo: 'firme', x: 0.5, y: 2.7 },
    { tipo: 'lata', x: -0.4, y: 3.2 },
    { tipo: 'firme', x: 0.5, y: 3.7 },
    { tipo: 'firme', x: 1.35, y: 3.6 }, // agarre lejano hacia la plataforma
    { tipo: 'intermitente', x: -0.5, y: 4.2, fase: 0 },
    { tipo: 'intermitente', x: 0.5, y: 4.7, fase: 2.5 },
    { tipo: 'firme', x: -0.5, y: 5.2 },
  ],
  panel: { x: 0.1, y: 6.3, separacionAgarres: 0.3, fase: 0 },
  // Checkpoint al costado de la pared (la parte de arriba de la plataforma es el piso)
  checkpoint: { x: 1.9, altura: 2.3, ancho: 1.2, profundidad: 1.3 },
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
