// Sonidos simples sintetizados con la Web Audio API: no hay archivos de audio que cargar.
// Todos son suaves y cortos. Si el navegador no permite audio, no pasa nada.
import { MUSICA, SONIDO } from './config.js';

let contexto = null;
let maestro = null; // volumen general: todos los sonidos pasan por acá, así se pueden silenciar juntos
let mudo = false;

try {
  mudo = window.localStorage.getItem('glitch-silencio') === '1'; // se recuerda la elección (si el navegador lo permite)
} catch (error) {
  mudo = false;
}

// Salida común de todos los sonidos
function salida(ctx) {
  if (!maestro) {
    maestro = ctx.createGain();
    maestro.gain.value = mudo ? 0 : 1;
    maestro.connect(ctx.destination);
  }
  return maestro;
}

// ¿Está todo silenciado?
export function estaSilenciado() {
  return mudo;
}

// Silencia o devuelve el sonido de todo el juego (efectos y música). Devuelve el nuevo estado.
export function alternarSilencio() {
  mudo = !mudo;
  const ctx = audio();
  if (ctx) salida(ctx).gain.value = mudo ? 0 : 1;
  try {
    window.localStorage.setItem('glitch-silencio', mudo ? '1' : '0');
  } catch (error) {
    // no se pudo guardar: solo vale para esta visita
  }
  return mudo;
}

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
  oscilador.connect(ganancia).connect(salida(ctx));
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
  fuente.connect(filtro).connect(ganancia).connect(salida(ctx));
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
    ganancia.connect(panner).connect(salida(ctx));
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

// Golpe contra el botón RESET apagado: un toque sordo, sin consecuencias
export function golpeSordo() {
  tono(120, 0.18, 'triangle', 0.7);
}

// El botón RESET se enciende: una nota clara
export function resetListo() {
  tono(784, 0.5, 'sine', 0.8);
  setTimeout(() => tono(1175, 0.7, 'sine', 0.6), 160);
}

// Se rompe la pantalla: un golpe grave y un crujido de vidrio
export function roturaPantalla() {
  tono(90, 0.5, 'triangle', 1);
  ruido(0.6, 2600, 0.9);
  setTimeout(() => ruido(0.4, 3400, 0.5), 180);
}

// Amanecer: un acorde que sube despacio
export function amanecer() {
  [392, 523, 659, 784].forEach((f, i) => setTimeout(() => tono(f, 1.6, 'sine', 0.6), i * 220));
}

// Frase del Glitch: un pitido digital corto y suave
export function blipGlitch() {
  tono(740, 0.07, 'square', 0.25);
  setTimeout(() => tono(555, 0.09, 'square', 0.2), 70);
}

// Deslizarse por el cable: un soplido suave
export function deslizar() {
  ruido(1.4, 600, 0.5);
}

// Música tranquila de fondo: un colchón de acordes suaves y, encima, notas sueltas de una escala pentatónica
// que suenan como campanitas. No lleva ruido ni notas desafinadas (eso es lo que molestaba: un zumbido
// parejo y constante). Los acordes cambian despacio y las notas caen en lugares al azar, sin ritmo fijo.
const ACORDES = [
  [220.0, 261.63, 329.63], // la menor
  [174.61, 220.0, 261.63], // fa mayor
  [261.63, 329.63, 392.0], // do mayor
  [196.0, 246.94, 293.66], // sol mayor
];
// Notas de las campanitas: pentatónica de do mayor, una octava más arriba de los acordes
const ESCALA = [523.25, 587.33, 659.25, 783.99, 880.0];
let musicaActiva = false;
let acordeActual = 0;
let ultimaNota = -1;

// Una campanita: ataque suave, caída larga y un poco de eco
function campanita() {
  const ctx = audio();
  if (!ctx || ctx.state !== 'running') return;
  let i = Math.floor(Math.random() * ESCALA.length);
  if (i === ultimaNota) i = (i + 2) % ESCALA.length; // nunca la misma nota dos veces seguidas
  ultimaNota = i;
  const ahora = ctx.currentTime;
  const oscilador = ctx.createOscillator();
  const ganancia = ctx.createGain();
  oscilador.type = 'sine';
  oscilador.frequency.value = ESCALA[i];
  const pico = SONIDO.volumen * MUSICA.volumen * MUSICA.volumenNotas;
  ganancia.gain.setValueAtTime(0.0001, ahora);
  ganancia.gain.linearRampToValueAtTime(pico, ahora + 0.08);
  ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + MUSICA.duracionNota);
  oscilador.connect(ganancia).connect(salida(ctx));
  // Eco: la misma nota, más baja y más tarde
  const eco = ctx.createDelay(1);
  const gananciaEco = ctx.createGain();
  eco.delayTime.value = 0.45;
  gananciaEco.gain.value = 0.3;
  ganancia.connect(eco).connect(gananciaEco).connect(salida(ctx));
  oscilador.start(ahora);
  oscilador.stop(ahora + MUSICA.duracionNota + 0.1);
}

function programarNota() {
  campanita();
  const espera = MUSICA.notasCada[0] + Math.random() * (MUSICA.notasCada[1] - MUSICA.notasCada[0]);
  setTimeout(programarNota, espera * 1000);
}

function tocarAcorde() {
  const ctx = audio();
  if (!ctx || ctx.state !== 'running') return; // todavía no hay un gesto del usuario: se reintenta
  const ahora = ctx.currentTime;
  const duracion = MUSICA.segundosPorAcorde + MUSICA.cola;
  const acorde = ACORDES[acordeActual % ACORDES.length];
  acordeActual += 1;

  const filtro = ctx.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.value = MUSICA.filtro;
  filtro.connect(salida(ctx));
  acorde.forEach((frecuencia) => {
    const oscilador = ctx.createOscillator();
    const ganancia = ctx.createGain();
    oscilador.type = 'sine'; // sin desafinar: así no hay pulsaciones que suenen a zumbido
    oscilador.frequency.value = frecuencia;
    const pico = (SONIDO.volumen * MUSICA.volumen * MUSICA.volumenAcordes) / acorde.length;
    ganancia.gain.setValueAtTime(0.0001, ahora);
    ganancia.gain.linearRampToValueAtTime(pico, ahora + MUSICA.ataque);
    ganancia.gain.linearRampToValueAtTime(0.0001, ahora + duracion);
    oscilador.connect(ganancia).connect(filtro);
    oscilador.start(ahora);
    oscilador.stop(ahora + duracion + 0.1);
  });
}

// Empieza la música (una sola vez). Si todavía no se puede reproducir, reintenta cada acorde.
export function iniciarMusica() {
  if (musicaActiva) return;
  const ctx = audio();
  if (!ctx) return;
  musicaActiva = true;
  if (ctx.state === 'running') tocarAcorde();
  else ctx.resume().then(tocarAcorde).catch(() => {}); // arranca en cuanto el navegador lo permite
  setInterval(tocarAcorde, MUSICA.segundosPorAcorde * 1000);
  setTimeout(programarNota, MUSICA.notasCada[0] * 1000);
}

// Estado del audio, para diagnóstico: { contexto: 'running' | 'suspended' | null, musica, silenciado }
export function estadoDeAudio() {
  return { contexto: contexto ? contexto.state : null, musica: musicaActiva, silenciado: mudo };
}
