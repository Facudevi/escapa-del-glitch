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
  radioAgarre: 0.18, // distancia máxima mano-agarre para poder agarrar (se usa desde la etapa 2)
};

// Modo escritorio (sin casco): pensado solo para probar.
export const ESCRITORIO = {
  velocidadCaminar: 2.2, // m/s con WASD
  duracionViaje: 650, // ms que tarda en llevar al jugador hasta el agarre clickeado
  distanciaAlAgarre: 0.55, // a qué distancia (m) del agarre queda el jugador
  alturaAgarre: 1.45, // altura (m) a la que queda el agarre respecto del piso del jugador
};
