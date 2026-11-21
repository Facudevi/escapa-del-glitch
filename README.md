# Escapá del Glitch

Experiencia de realidad virtual, touchpoint complementario de **RESET** (festival sobre bienestar gamer). Quedás atrapado dentro de tu propio setup gamer, ahora gigante, y lo escalás con los brazos, de pie, para salir. Para encender el botón RESET que rompe la pantalla tenés que juntar tres fragmentos, uno por tramo: **teclado**, **torre de PC** y **monitor**.

TP4 — Santino Mosca, Rodrigo Masek y Facundo de Vichenzo.

🔗 **Jugar:** https://facudevi.github.io/escapa-del-glitch/ (funciona en el navegador de la compu y en el del Meta Quest)

La partida dura unos 2 minutos y medio. Si te caés, no pasa nada: volvés al último checkpoint.

## Cómo se juega

### Con casco (Meta Quest)
- Abrí el link en el navegador del casco y tocá el botón de **gafas VR** (abajo a la derecha).
- **Grip** (botón lateral) cerca de una tecla y **bajá el brazo** para subir. Alterná las manos.
- Cada guante tiene un **anillo de energía** (verde, ámbar, rojo): la mano que agarra se cansa y la libre se recupera.
- **Escanear** fragmentos: tocá la **pulsera** de la muñeca izquierda con la otra mano, o apretá **A / X**.
- **Golpeá** el botón RESET con la mano. **B o Y** silencia el sonido.

### En la compu
- Arrastrá el mouse para **mirar** y usá **WASD** para caminar.
- Mantené el **clic izquierdo** (mano izquierda) o el **derecho** (mano derecha) sobre una tecla cercana y **bajá el mouse** para subir.
- **Clic** en un agarre lejano para ir hasta él. Tecla **E** escanea, tecla **M** silencia, **clic** en el RESET lo golpea y tecla **R** vuelve a jugar.
- Hay un **modo fácil** (más alcance, más energía, niebla más lenta): se elige en la pantalla de inicio o con `?facil=1` al final del link.

### El juego
- Cinco tipos de agarre, cada uno con su color y su forma: **tecla firme** (lavanda), **tecla que se hunde**, **lata que se rompe** (cruje y cae a los 3 s), **bloque intermitente** (mirá su anillo) y **panel que gira**. Los agarres al alcance se resaltan.
- Un cable **USB** en lo alto de la torre te lleva solo hasta el segundo checkpoint.
- Una **niebla de píxeles** sube despacio desde abajo. Si te alcanza, volvés al último checkpoint; si alcanza un fragmento sin juntar, el **Glitch** se lo come y lo esconde en la plataforma de arriba.
- Al final, una medalla según el tiempo: **oro** menos de 2 min, **plata** menos de 3, **bronce** el resto.

## Cómo correrlo

Requiere **Node.js 22 o superior**.

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`. Otros comandos: `npm run build` (genera `dist/`) y `npm run preview` (sirve el build).

### Cómo probarlo sin casco
- Abrir en Chrome: el **modo escritorio** permite jugar todo con mouse y teclado.
- Para simular casco y controles, usar la extensión **Immersive Web Emulator** de Meta (pestaña WebXR de las herramientas de desarrollador).
- En el Quest por USB: `adb reverse tcp:5173 tcp:5173` y abrir `http://localhost:5173` en el navegador del casco.
- En el Quest sin cable: abrir el link público (HTTPS).

## Cómo está hecho

**A-Frame 1.8** con **Vite**. Solo primitivas de A-Frame (cajas, cilindros, planos): no hay modelos 3D, librerías externas ni motor de física. Los sonidos se sintetizan con la Web Audio API, sin archivos.

```
├── CLAUDE.md          reglas del proyecto
├── PROMPTS.md         bitácora de prompts del desarrollo
├── docs/              diseño, consigna, buenas prácticas, auditoría y guías
├── index.html         pantalla de inicio y escena
├── src/
│   ├── main.js        registra los componentes
│   ├── config.js      tiempos, velocidades, medidas y colores
│   ├── tramos.js      generador de la pared (agarres, paneles, fragmentos)
│   ├── decorado.js    teclado, torre y monitor
│   ├── dificultad.js  modo normal y modo fácil
│   ├── sonidos.js     efectos, música y audio espacial
│   ├── utilidades.js
│   └── components/    un componente de A-Frame por archivo
└── .github/workflows/deploy.yml
```

**Todos los tiempos, velocidades y colores están en `src/config.js`**: para ajustar el juego al probarlo, ese es el único archivo que hace falta tocar. La pared la genera `src/tramos.js` con una semilla fija (`ESCENARIO.semilla`): cambiarla da otra distribución de agarres.

## Despliegue

Cada push a `main` publica en GitHub Pages mediante GitHub Actions.

## Documentación

- [`docs/idea-final.md`](docs/idea-final.md): diseño completo de la experiencia.
- [`docs/consigna-tp4.md`](docs/consigna-tp4.md): requisitos y entregas del TP4.
- [`docs/buenas-practicas-xr.md`](docs/buenas-practicas-xr.md): buenas prácticas de UX para XR y checklist por etapa.
- [`docs/auditoria-final.md`](docs/auditoria-final.md): revisión final de todo el juego contra las buenas prácticas y la consigna.
- [`docs/problemas-resueltos.md`](docs/problemas-resueltos.md): problemas encontrados y cómo se resolvieron.
- [`docs/guia-de-pruebas.md`](docs/guia-de-pruebas.md): cómo probar el juego con personas y qué medir.
- [`docs/intervencion-manual.md`](docs/intervencion-manual.md): cómo hacer y documentar la intervención manual del código.
- [`PROMPTS.md`](PROMPTS.md): bitácora de prompts.

## Estado y límites conocidos

- Todo está probado en el navegador de escritorio, con un jugador automático que recorre la pared completa.
- **Todavía falta probarlo con un casco real y con personas**, y escuchar el sonido. El detalle está en `docs/auditoria-final.md`.
- Jugar sentado no está soportado: la escalada es de pie.

## Privacidad

La experiencia no recoge ni envía datos personales ni de uso. Lo único que guarda en el navegador es si silenciaste el sonido.
