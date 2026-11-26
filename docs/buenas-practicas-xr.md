# Buenas prácticas de UX para XR, aplicadas a Escapá del Glitch

Este documento resume las buenas prácticas del libro de referencia y dice cómo las aplicamos en el juego. **Hay que leerlo antes de empezar cada etapa** y usar el checklist de la sección 4. Al terminar el desarrollo se hace la auditoría final de la sección 6.

> Fuente: Cornel Hillmann, *UX for XR: User Experience Design and Strategies for Immersive Technologies*, 2.ª edición, Apress, 2025. Las páginas citadas son las del libro impreso. Los resúmenes están redactados con palabras propias.

## 1. Alcance del análisis

El archivo adjunto no tiene 200 páginas: es el libro completo, de unas 380 páginas impresas. Se leyeron **en detalle** los apartados que aplican a una experiencia WebXR de escalada, que además es un touchpoint de un evento:

| Apartado | Páginas |
|---|---|
| Elementos del diseño XR: comodidad, interacción, sentidos, restricciones, inclusión | 26–30 |
| Usabilidad en VR: locomoción, orientación, interacción con objetos, configuración inicial y accesibilidad | 43–55 |
| Gamificación y onboarding en XR | 69–77 |
| Convenciones emergentes de VR | 100–111 |
| Interacción inmersiva: sentidos, háptica, audio; bucle OODA; documento de diseño (GDD) | 151–158 |
| Diseño consciente (mindful design) | 158–161 |
| Prototipado rápido en gris (grayboxing) | 180–181 |
| Vibe coding y diseño asistido por IA | 227–230 |
| WebXR y experiencias que funcionan con y sin casco | 284–287 |
| Pruebas con usuarios, feedback con WebXR y auditorías UX | 358–362 |

**No se leyeron** (no aplican al proyecto): historia de XR, realidad aumentada y Vision Pro, avatares y XR social, reconstrucción 3D con Gaussian Splatting, generación de imágenes con IA, ética de IA generativa y los casos de estudio de entrenamiento industrial y galería. Si el equipo lo pide, se pueden sumar.

El propio libro avisa que las convenciones de VR cambian rápido (p. 110–111). Sirven como guía, pero hay que **validarlas probando el juego**.

## 2. Principios del libro y cómo se aplican

### A. Comodidad y seguridad (p. 26–27, 45–47, 107)
- **Seguridad física:** con el casco puesto la gente subestima distancias y hace movimientos bruscos. El onboarding debería recordar despejar el espacio de juego.
- **Mareo:** entre el 25 y el 40 % de los usuarios primerizos tiene una reacción inicial, y entre el 3 y el 5 % una persistente (p. 45). Las transiciones se hacen con **fundido** (p. 46). En los movimientos guiados conviene **velocidad constante**, sin aceleraciones (p. 107). La viñeta de comodidad es una opción complementaria.
- **Fatiga:** el libro marca la fatiga de manos como un problema abierto de las interacciones con gestos (p. 121). Escalar con los brazos cansa, así que conviene tener sesiones cortas y puntos de descanso.

**Decisiones para el juego:**
- La caída es un fundido a negro sin animación de caída.
- Todo movimiento que no controla el jugador (tecla que se hunde, panel que gira, tirolesa, niebla) va **lento y a velocidad constante**.
- La lata que cruje tiembla solo en lo visual (rotación), sin mover el punto donde está agarrado el jugador.
- La partida dura unos 2 min 30 s y hay checkpoints para descansar.

### B. Opciones e inclusión (p. 29–30, 47–49, 106)
El libro propone como estándar ofrecer: jugar sentado o parado, ajuste de altura, modo zurdo o diestro, juego con una mano, niveles de dificultad y rotación por pasos. Valve hizo de *Half-Life: Alyx* la referencia en este punto.

**Decisiones para el juego:**
- Las dos manos son simétricas, así que no hay que elegir zurdo o diestro.
- Se puede escalar con una sola mano alternando agarres.
- En VR se camina por los pisos con el stick de cualquiera de los dos controles, a velocidad constante y sin aceleraciones (componente `movimiento-stick`, agregado el 2026-11-26 porque los jugadores se quejaban de tener que caminar por la habitación). Como el jugador casi siempre mira a la pared, la rotación por pasos no es imprescindible, pero queda para **evaluar** al probar con casco.
- Quedan para evaluar: jugar sentado y adaptar la pared a la altura del jugador (ver el checklist).

### C. Interacción: affordance, signifiers y feedback (p. 27–28, 108, 151–153)
- El jugador siempre tiene que saber qué se puede usar y si lo está haciendo bien. Se resuelve con **signifiers** (pistas visibles) y con respuesta inmediata.
- Los usuarios esperan resaltado visual y vibración al interactuar (p. 108).
- Convención de botones: **grip para agarrar** y gatillo para activar (p. 108).
- El **audio** es la forma más barata de guiar y dar feedback (p. 152). La vibración confirma que algo pasó (p. 152–153).

**Decisiones para el juego:**
- Cada agarre mantiene su color y su forma, y un cartel lo explica la primera vez.
- El guante cambia de color al agarrar y el control vibra.
- Falta resaltar el agarre cuando la mano se acerca, y los sonidos: conviene adelantar un clic mínimo al agarrar, aunque el audio completo sea de la etapa 9.

### D. Interfaz: diegética primero, legible y en zona cómoda (p. 102–109)
- La interfaz **diegética** (parte del mundo) es preferible a la que se pega en pantalla (p. 102). Ejemplo del libro: un reloj en la muñeca.
- **Texto:** evitar letra chica y fuentes finas, orientar los carteles hacia el jugador, usar fondo contrastante y respetar una distancia mínima de lectura (p. 108).
- **Zona cómoda:** el contenido importante debería estar dentro de unos 70° a cada lado y 40° hacia arriba y abajo del frente (p. 103).
- Un HUD fijo molesta; si se usa, conviene que tenga un leve retraso de movimiento (p. 109).

**Decisiones para el juego:**
- Los anillos de energía van en los guantes y el contador de fragmentos en la pulsera: no hay HUD.
- Los carteles se dibujan con letra grande y contraste alto, y quedan de frente al jugador.
- Los carteles de tutorial van a la altura de los ojos, cerca de lo que explican.

### E. Onboarding y gamificación (p. 72–74, 107)
- El **primer minuto** decide si el usuario se queda. Hay que reducir la carga mental, comunicar los botones y ofrecer tutoriales salteables (p. 107).
- La barra de progreso motiva; las medallas y trofeos premian al terminar (p. 72–73).

**Decisiones para el juego:**
- Tutorial con dos carteles al pie de la pared y primer fragmento obligatorio como guía.
- Contador 0/3 en la pulsera y medalla final.
- Falta una **pantalla de inicio** con instrucciones por dispositivo (casco o escritorio) y un aviso de seguridad.

### F. Errores, control del usuario y acciones dramáticas (p. 53–54, 102–103)
Las heurísticas de Nielsen aplican a VR: mostrar el estado del sistema, dar control y libertad, prevenir errores y ayudar a recuperarse. Una acción con gran impacto (cambiar todo el entorno) conviene protegerla con una **pulsación larga que se pueda cancelar**.

**Decisiones para el juego:**
- No hay game over: caer te devuelve al checkpoint.
- El botón RESET, que cambia todo el entorno, se activa con un golpe deliberado y solo con los tres fragmentos. Evaluar si exige mantener el golpe o contacto un instante, para no activarse por accidente.

### G. Sentidos: audio espacial y háptica (p. 151–153)
Un sonido espacial puede dirigir la atención. La vibración es sutil pero confirma que algo pasó. Los sonidos de fragmentos que suenan más fuerte al acercarse (etapa 7) siguen esta idea.

### H. Diseño consciente (mindful design) (p. 158–161)
Pide pensar en el bienestar del usuario: límites de uso, descanso, privacidad y accesibilidad. Encaja con RESET, un festival sobre bienestar gamer.

**Decisiones para el juego:**
- Sesión corta y checkpoints para descansar.
- Paleta calma, sin neón ni destellos.
- No se recogen datos personales; hay que dejarlo escrito en el README.
- Considerar un mensaje de descanso al terminar.

### I. WebXR y experiencia con y sin casco (p. 284–287, 359–361)
- Una experiencia **que funciona con casco y sin él** (device-inclusive) debe seguir las convenciones planas de 3D: **apuntar y hacer clic, WASD** y, si hace falta, controles táctiles (p. 287).
- Un enlace WebXR es la forma más rápida de compartir pruebas, y el **Immersive Web Emulator** de Meta permite probar sin casco (p. 360).

**Decisiones para el juego:**
- El modo escritorio es una **entrega**, no solo una ayuda de pruebas: la consigna dice que el docente abre el link en el navegador. Tiene que estar pulido y explicado en pantalla.
- Todas las mecánicas tienen que poder jugarse con mouse y teclado, incluido el escaneo de fragmentos (etapa 7).

### J. Proceso: GDD vivo, graybox, OODA, pruebas y métricas (p. 153–158, 180–181, 358–362)
- El **GDD** (documento de diseño) es una pieza viva que se actualiza con los resultados de las pruebas (p. 155–158). Acá lo cumplen `docs/idea-final.md` y estos documentos.
- **Graybox:** probar el espacio con formas simples antes de pulir (p. 181). Es justo nuestro enfoque con primitivas.
- **Bucle OODA** (observar, orientar, decidir, actuar): sirve para diagnosticar por qué un jugador falla. Si no usa una ayuda, tal vez no la vio (observar); si siempre elige lo mismo, quizá las opciones no se entienden (decidir) (p. 154).
- **Pruebas:** un prototipo en bruto conviene mostrarlo a gente con experiencia en XR, y el producto final a gente nueva. Usar entrevistas antes y después y dejar tiempo para acostumbrarse a los controles (p. 358).
- **Métricas útiles** (p. 362): abandono, éxito de la tarea, tiempo, problemas y frustraciones, satisfacción y recomendación.
- **Vibe coding** (p. 227–230): dirigir a la IA con criterio y no reemplaza las pruebas con personas. Coincide con la consigna.

## 3. Cómo usar este documento en cada etapa

1. Leer la sección 4 de la etapa que se va a hacer.
2. Aplicar los puntos durante el desarrollo.
3. Al cerrar la etapa, anotar en `PROMPTS.md` qué prácticas se aplicaron y cuáles quedan pendientes.
4. Si una práctica no se puede cumplir, dejar escrito por qué (sirve para el informe).

## 4. Checklist por etapa

**Etapa 1 — Base**
- [ ] Ambiente calmo: penumbra cálida, sin neón ni destellos.
- [ ] Límites claros en la sala.
- [ ] Modo escritorio usable (WASD, mirar, clic) con ayuda en pantalla.
- [ ] Botón de VR disponible.

**Etapa 2 — Escalar**
- [ ] Grip para agarrar (convención).
- [ ] Vibración y cambio visual al agarrar.
- [ ] Tolerancia de agarre generosa, para alturas de brazo distintas.
- [ ] Se puede escalar con una sola mano.
- [ ] Carteles de tutorial legibles y a la altura de los ojos.

**Etapa 3 — Caída y checkpoints**
- [ ] Fundido corto y sin movimiento de caída.
- [ ] Reaparición inmediata y clara, sin castigo.
- [ ] Checkpoints visibles y reconocibles.

**Etapa 4 — Energía por mano**
- [ ] El estado de la energía se ve en el guante (interfaz diegética).
- [ ] No depende solo del color: el largo del arco también informa.
- [ ] Sin parpadeos.
- [ ] Consecuencias claras: la mano se suelta sola y se recupera.

**Etapa 5 — Agarres especiales**
- [ ] Color y forma fijos por tipo, más un cartel de una línea la primera vez.
- [ ] Movimientos que arrastran al jugador: lentos y a velocidad constante.
- [ ] Lata: crujido visual solo por rotación; sonido y vibración al crujir.
- [ ] Bloque intermitente: aparece y desaparece con un **fundido suave**, no un parpadeo seco. El anillo se lee de lejos.
- [ ] Panel que gira: giro lento, avisado visualmente.
- [ ] Todo se puede probar con mouse.

**Etapa 6 — Tramos completos**
- [ ] Dificultad creciente y sin camino marcado, pero con **puntos de referencia** para orientarse (el RESET arriba).
- [ ] No exigir mantener los brazos en alto mucho tiempo seguido.
- [ ] Contenido importante en la zona cómoda de visión.
- [ ] Distancias de agarres lejanos alcanzables por distintas alturas de jugador.

**Etapa 7 — Fragmentos, pulsera, escaneo y niebla**
- [ ] Sonido espacial de los fragmentos.
- [ ] Pulsera diegética con contador y barra de espera del escaneo.
- [ ] El escaneo tiene alternativa para escritorio (una tecla).
- [ ] Niebla de velocidad lenta y constante, color suave y sin parpadeos.
- [ ] Qué pasó con un fragmento comido se explica con el cartel del Glitch.

**Etapa 8 — Final**
- [ ] El golpe al RESET es deliberado y no se activa por accidente.
- [ ] Transición al exterior con fundido, sin cortes bruscos.
- [ ] La frase y la medalla son legibles y se quedan el tiempo suficiente.
- [ ] Se puede volver a jugar fácilmente.

**Etapa 9 — Glitch y extras**
- [ ] Frases cortas, legibles y con tiempo de espera entre repeticiones.
- [ ] Tirolesa a velocidad constante, sin aceleraciones.
- [ ] Sonidos suaves, con volumen consistente y posibilidad de silenciar.

**Etapa 10 — Pulido**
- [ ] Pantalla de inicio con instrucciones por dispositivo y aviso de seguridad.
- [ ] Prueba en el Quest: estable y cómoda.
- [ ] Evaluar rotación por pasos, jugar sentado y ajuste de altura.
- [ ] Prueba con al menos tres personas (entrevista antes y después).
- [ ] Auditoría final de la sección 6.

## 5. Hallazgos de la revisión de las etapas 1 a 4

> Esta tabla es de la revisión inicial. El estado final de todas las prácticas está en `docs/auditoria-final.md`.

| Tema | Estado | Acción |
|---|---|---|
| Caída con fundido, sin movimiento | Cumple (p. 46, 107) | — |
| Interfaz diegética (anillos en el guante) | Cumple (p. 102) | — |
| Estado de la energía legible sin depender del color | Cumple: el arco también se acorta | — |
| Sin parpadeos ni destellos | Cumple | Cuidar en etapa 5 el bloque intermitente |
| Grip para agarrar y vibración | Cumple (p. 108, 152) | — |
| Texto de los carteles | Cumple: letra grande y contraste alto | Revisar tamaño dentro del casco |
| Resaltado del agarre al acercar la mano | Cumple desde la etapa 5 (p. 108): brillo propio al alcance de la mano o del cursor | — |
| Sonido al agarrar | Cumple desde la etapa 5 (p. 152): clic sintetizado; faltan los demás sonidos | Etapa 9 |
| Pantalla de inicio y aviso de seguridad | **Falta** (p. 26–27, 107) | Etapa 10, o antes si hay tiempo |
| Opciones de accesibilidad (sentado, altura, rotación) | **Falta** (p. 47–49) | Evaluar en la etapa 10 |
| Modo escritorio como entrega al docente | Parcial: funciona, pero `CLAUDE.md` lo trataba solo como prueba | Corregido en `CLAUDE.md` |
| Declarar que no se recogen datos | **Falta** (p. 159) | Agregar al README |

## 6. Auditoría final (etapa 10)

Al terminar el desarrollo hay que revisar **todo el juego** contra este documento y dejar el resultado en `docs/auditoria-final.md`, con una tabla de estado por práctica (cumple, parcial o no cumple) y la acción tomada. Incluye:

1. Recorrer los checklists de la sección 4 y marcar cada punto.
2. Recorrer las diez heurísticas de Nielsen (p. 53–54): estado visible, correspondencia con el mundo real, control y libertad, consistencia, prevención de errores, reconocer en vez de recordar, flexibilidad, diseño minimalista, recuperación de errores, ayuda.
3. Probar el juego completo en modo escritorio, en el emulador y, si es posible, en el Quest.
4. Buscar incongruencias entre lo que dicen `docs/idea-final.md`, `docs/consigna-tp4.md`, el README y el comportamiento real.
5. Verificar los requisitos de la consigna: entorno navegable, al menos 3 objetos con intención espacial, mecánica central funcional, link público, modo VR disponible, bitácora de prompts, intervención manual documentada y problema resuelto documentado.
6. Medir con al menos tres personas: éxito de la tarea, tiempo, abandonos y satisfacción (p. 362).
