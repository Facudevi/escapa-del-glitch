// Sonidos simples sintetizados con la Web Audio API: no hay archivos de audio que cargar.
// Todos son suaves y cortos. Si el navegador no permite audio, no pasa nada.
import { SONIDO } from './config.js';

let contexto = null;

// El contexto de audio se crea al primer uso (los navegadores lo habilitan tras un gesto del usuario)
function audio() {
  try {
    if (!contexto) {
      const Clase = window.AudioContext || window.webkitAudioContext;
      if (!Clase) return null;
      contexto = new Clase();
    }
    if (contexto.state === 'suspended') contexto.resume();
    return contexto;
  } catch (error) {
    return null;
  }
}

// Tono con caída de volumen
function tono(frecuencia, duracion, tipo = 'sine', volumen = 1) {
  const ctx = audio();
  if (!ctx) return;
  const ahora = ctx.currentTime;
  const oscilador = ctx.createOscillator();
  const ganancia = ctx.createGain();
  oscilador.type = tipo;
  oscilador.frequency.setValueAtTime(frecuencia, ahora);
  ganancia.gain.setValueAtTime(SONIDO.volumen * volumen, ahora);
  ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + duracion);
  oscilador.connect(ganancia).connect(ctx.destination);
  oscilador.start(ahora);
  oscilador.stop(ahora + duracion);
}

// Ráfaga de ruido filtrado (crujidos y golpes)
function ruido(duracion, frecuenciaFiltro, volumen = 1) {
  const ctx = audio();
  if (!ctx) return;
  const ahora = ctx.currentTime;
  const muestras = Math.max(1, Math.floor(ctx.sampleRate * duracion));
  const buffer = ctx.createBuffer(1, muestras, ctx.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1;

  const fuente = ctx.createBufferSource();
  const filtro = ctx.createBiquadFilter();
  const ganancia = ctx.createGain();
  fuente.buffer = buffer;
  filtro.type = 'bandpass';
  filtro.frequency.setValueAtTime(frecuenciaFiltro, ahora);
  ganancia.gain.setValueAtTime(SONIDO.volumen * volumen, ahora);
  ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + duracion);
  fuente.connect(filtro).connect(ganancia).connect(ctx.destination);
  fuente.start(ahora);
}

// Clic al agarrar
export function clic() {
  tono(520, 0.06, 'triangle', 0.9);
}

// Crujido de la lata
export function crujido() {
  ruido(0.09, 1800, 0.8);
  tono(190, 0.07, 'square', 0.2);
}

// La lata se rompe
export function rotura() {
  ruido(0.35, 700, 1);
  tono(110, 0.25, 'triangle', 0.5);
}
