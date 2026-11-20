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

// Se junta un fragmento: dos notas suaves que suben
export function fragmentoRecogido() {
  tono(659, 0.25, 'sine', 0.9);
  setTimeout(() => tono(988, 0.4, 'sine', 0.8), 110);
}

// Onda del escaneo: un barrido grave y suave
export function ondaEscaneo() {
  tono(220, 0.5, 'sine', 0.7);
  setTimeout(() => tono(330, 0.6, 'sine', 0.5), 150);
}

// Sonido espacial continuo de un fragmento: se oye más fuerte cuanto más cerca está el jugador.
// Devuelve { mover(x, y, z), detener() }, o null si no hay audio.
export function crearZumbido(frecuencias, volumen, distanciaMax) {
  const ctx = audio();
  if (!ctx) return null;
  try {
    const panner = ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'linear'; // el volumen baja en línea recta hasta ser 0 a distanciaMax
    panner.refDistance = 0.5;
    panner.maxDistance = distanciaMax;
    panner.rolloffFactor = 1;

    const ganancia = ctx.createGain();
    ganancia.gain.value = SONIDO.volumen * volumen;

    // Respiración muy lenta del volumen (sin pulsos bruscos)
    const lfo = ctx.createOscillator();
    const profundidad = ctx.createGain();
    lfo.frequency.value = 0.35;
    profundidad.gain.value = SONIDO.volumen * volumen * 0.25;
    lfo.connect(profundidad).connect(ganancia.gain);

    const osciladores = frecuencias.map((f) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(ganancia);
      return o;
    });
    ganancia.connect(panner).connect(ctx.destination);
    lfo.start();
    osciladores.forEach((o) => o.start());

    return {
      mover(x, y, z) {
        if (panner.positionX) {
          panner.positionX.value = x;
          panner.positionY.value = y;
          panner.positionZ.value = z;
        } else {
          panner.setPosition(x, y, z);
        }
      },
      silenciar(silencio) {
        ganancia.gain.value = silencio ? 0 : SONIDO.volumen * volumen;
      },
      detener() {
        try {
          lfo.stop();
          osciladores.forEach((o) => o.stop());
          panner.disconnect();
        } catch (error) {
          // ya estaba detenido
        }
      },
    };
  } catch (error) {
    return null;
  }
}

// Posición y orientación del oyente (la cabeza del jugador) para el sonido espacial
export function actualizarOyente(px, py, pz, fx, fy, fz) {
  const ctx = contexto;
  if (!ctx) return;
  const oyente = ctx.listener;
  try {
    if (oyente.positionX) {
      oyente.positionX.value = px;
      oyente.positionY.value = py;
      oyente.positionZ.value = pz;
      oyente.forwardX.value = fx;
      oyente.forwardY.value = fy;
      oyente.forwardZ.value = fz;
      oyente.upX.value = 0;
      oyente.upY.value = 1;
      oyente.upZ.value = 0;
    } else {
      oyente.setPosition(px, py, pz);
      oyente.setOrientation(fx, fy, fz, 0, 1, 0);
    }
  } catch (error) {
    // sin audio espacial: no es grave
  }
}
