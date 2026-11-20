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

// Pared de prueba de la etapa 2 (en metros). Se reemplaza por los tramos reales en la etapa 6.
export const PARED_PRUEBA = {
  ancho: 5,
  alto: 7.5,
  profundidad: 0.2,
  z: -0.9, // centro de la pared; las teclas sobresalen hacia el jugador
  filas: 10, // cantidad de teclas firmes
  alturaPrimera: 1.2, // altura de la primera tecla
  pasoVertical: 0.5, // distancia vertical entre teclas
  separacionLateral: 0.5, // las teclas alternan izquierda y derecha
  variacionLateral: 0.15, // desvío fijo para que no queden en fila perfecta
  tecla: { ancho: 0.4, alto: 0.14, profundidad: 0.3 },
  // Checkpoint de prueba a mitad de la pared (la parte de arriba de la plataforma es el piso)
  checkpoint: { altura: 3.0, ancho: 2.2, profundidad: 1.3 },
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
