# Auditoría final de buenas prácticas

Revisión de **todo el juego** contra `docs/buenas-practicas-xr.md` (libro *UX for XR*, Hillmann, 2025), `docs/consigna-tp4.md` y `docs/idea-final.md`. Es el procedimiento de la sección 6 de las buenas prácticas.

**Fecha:** 2026-11-20. **Versión revisada:** etapas 1 a 10 completas.

## 1. Resumen

| Estado | Cantidad | Qué significa |
|---|---|---|
| ✅ Cumple y verificado | 40 | Está hecho y se comprobó (código, prueba automática o revisión visual) |
| ✅ ⏳ Cumple, falta confirmarlo | 7 | Funciona en las pruebas del navegador, pero falta confirmarlo con un casco o con personas |
| ⏳ Pendiente de prueba real | 3 | No se pudo comprobar todavía (por ejemplo, probar en el Quest o con tres personas) |
| 🟡 Parcial | 4 | Está hecho, pero queda algo por mejorar o decidir |
| ➖ No aplica | 2 | No corresponde al juego, con la razón escrita |
| **Total revisado** | **56** | Los puntos de los checklists por etapa y las diez heurísticas de Nielsen |

**No hay ninguna práctica incumplida sin justificación.** Lo importante que falta no es de código: es **probar con un casco y con personas**, y hacer la **intervención manual del código** que pide la consigna.

## 2. Cómo se hizo

- Revisión del código y de la configuración de las diez etapas.
- Un **jugador automático** (usa el mismo modo mouse que cualquier persona) recorrió la pared completa, juntó los fragmentos, rompió el RESET y volvió a jugar.
- Pruebas por función en Chrome: caída, energía, agarres, escaneo, niebla, tirolesa, frases, sonido, final, pantalla de inicio y modo fácil.
- Revisión visual de cada pantalla importante.
- `npm run build` sin errores, consola del navegador sin errores y despliegue público funcionando (último deploy exitoso).

**Datos medidos:**

| Medida | Valor |
|---|---|
| Recorrido completo del jugador automático (sin dudar) | 56,6 s de juego, **0 caídas** (teclado 9 s, torre 19 s, monitor 28 s) |
| Llamadas de dibujo por cuadro | 31 |
| Triángulos por cuadro | 8.820 |
| Entidades en la escena | 156 |
| Errores en la consola | 0 |

Es un juego muy liviano para el casco. El jugador automático no duda ni busca, así que una persona va a tardar bastante más: la estimación es de **1 a 2,5 min**, que entra en el objetivo de 2 min 30 s, pero **no está medida con personas**.

## 3. Checklists por etapa

**Estados:** ✅ cumple · 🟡 parcial · ➖ no aplica · ⏳ pendiente de prueba real.

### Etapa 1 — Base
| Práctica | Estado | Evidencia |
|---|---|---|
| Ambiente calmo: penumbra cálida, sin neón ni destellos | ✅ | Paleta suavizada en `config.js`; sin parpadeos en ningún componente |
| Límites claros en la sala | ✅ | Cuatro paredes de 26 m |
| Modo escritorio usable con ayuda en pantalla | ✅ | WASD, mirar, clic y escalada con mouse; pantalla de inicio y ayuda |
| Botón de VR disponible | ⏳ | Lo agrega A-Frame; el navegador de pruebas no tiene WebXR |

### Etapa 2 — Escalar
| Práctica | Estado | Evidencia |
|---|---|---|
| Grip para agarrar | ✅ | `meta-touch-controls`, `gripdown` |
| Vibración y cambio visual al agarrar | ✅ ⏳ | El guante cambia de color; la vibración no se probó con un control real |
| Tolerancia de agarre generosa | ✅ | 18 cm (25 cm en modo fácil) |
| Se puede escalar con una sola mano | ✅ | Probado alternando y con una mano |
| Carteles de tutorial legibles y a la altura de los ojos | ✅ ⏳ | Letra grande y contraste alto; falta ver el tamaño dentro del casco |

### Etapa 3 — Caída y checkpoints
| Práctica | Estado | Evidencia |
|---|---|---|
| Fundido corto y sin movimiento de caída | ✅ | 0,5 s a negro, 0,15 s, 0,5 s de vuelta |
| Reaparición inmediata y clara, sin castigo | ✅ | Sin game over |
| Checkpoints visibles y reconocibles | ✅ | Plataformas verdes; la de arriba, violeta |

### Etapa 4 — Energía por mano
| Práctica | Estado | Evidencia |
|---|---|---|
| El estado de la energía se ve en el guante | ✅ | Anillo en cada guante |
| No depende solo del color | ✅ | El arco también se acorta |
| Sin parpadeos | ✅ | Transición suave de color |
| Consecuencias claras | ✅ | La mano se suelta sola y se recupera |

### Etapa 5 — Agarres especiales
| Práctica | Estado | Evidencia |
|---|---|---|
| Color y forma fijos por tipo | ✅ | Cinco tipos y la tirolesa, cada uno con su color y forma (se sacaron los carteles de la pared: quedaban tapados por el decorado) |
| Movimientos que arrastran al jugador: lentos y constantes | ✅ | Tecla 0,12 m/s; panel gira en 0,8 s |
| Lata: crujido visual solo por rotación, con sonido y vibración | ✅ ⏳ | Rotación de 6° como máximo; vibración sin probar con control |
| Bloque intermitente con fundido suave | ✅ | 0,4 s de fundido |
| Panel que gira: lento y avisado | ✅ | Los agarres se apagan antes de darle la espalda al jugador |
| Todo se puede probar con mouse | ✅ | |

### Etapa 6 — Tramos completos
| Práctica | Estado | Evidencia |
|---|---|---|
| Dificultad creciente sin camino marcado | ✅ | Separación media sube de 0,51 a 0,61 m por tramo |
| Puntos de referencia para orientarse | ✅ | El decorado (teclado, torre y monitor) y el mensaje del pie de la pared, visibles desde el principio |
| No exigir brazos en alto mucho tiempo seguido | 🟡 | Hay un checkpoint cada 6 a 8 m y la energía obliga a alternar, pero no se midió la fatiga con personas |
| Contenido importante en la zona cómoda de visión | 🟡 | Los carteles y agarres están a la altura de los ojos; el RESET arriba obliga a mirar hacia arriba, por diseño |
| Distancias de agarre alcanzables por distintas alturas | ✅ ⏳ | Máximo 1,05 m entre agarres; configurable; modo fácil. Falta probar con personas de distintas alturas |

### Etapa 7 — Fragmentos, pulsera, escaneo y niebla
| Práctica | Estado | Evidencia |
|---|---|---|
| Sonido espacial de los fragmentos | ✅ ⏳ | Volumen en línea recta hasta 8 m; no se pudo escuchar |
| Pulsera diegética con contador y barra de espera | ✅ | Sin HUD pegado a la pantalla |
| El escaneo tiene alternativa para escritorio | ✅ | Tecla E |
| Niebla lenta y constante, color suave, sin parpadeos | ✅ | 0,15 m/s constante, lila suave |
| Lo que pasó con un fragmento comido se explica | ✅ | Frase del Glitch |

### Etapa 8 — Final
| Práctica | Estado | Evidencia |
|---|---|---|
| El golpe al RESET es deliberado | ✅ ⏳ | Velocidad y dirección mínimas; probado con una mano simulada; falta probar con controles reales |
| Transición al exterior con fundido, sin cortes | ✅ | 1,5 s hacia una luz cálida y 1,5 s de vuelta |
| La frase y la medalla son legibles y se quedan | ✅ | Hasta que el jugador decide volver a jugar |
| Se puede volver a jugar fácilmente | ✅ | Botón, clic o tecla R, sin recargar |

### Etapa 9 — Glitch y extras
| Práctica | Estado | Evidencia |
|---|---|---|
| Frases cortas y legibles, con tiempo de espera | ✅ | Cola de a dos y esperas por frase |
| Tirolesa a velocidad constante | ✅ | Medido: el paso por cuadro es idéntico en todo el recorrido |
| Sonidos suaves, volumen parejo y posibilidad de silenciar | ✅ ⏳ | Tecla M, B o Y, con aviso; los volúmenes no se escucharon |

### Etapa 10 — Pulido
| Práctica | Estado | Evidencia |
|---|---|---|
| Pantalla de inicio con instrucciones por dispositivo y aviso de seguridad | ✅ | En la página y, para quien juega con casco, también escrito en el mundo |
| Prueba en el Quest: estable y cómoda | ⏳ | Pendiente: nadie del equipo tiene casco por ahora |
| Evaluar rotación por pasos | ➖ | No hay locomoción libre: el jugador mira a la pared |
| Evaluar jugar sentado | ➖ | La escalada es de pie por diseño y la pared mide unos 21 m; queda escrito como limitación |
| Evaluar ajuste de altura | 🟡 | Se resuelve con el modo fácil y con `distanciaMax`; no hay un ajuste de altura propio |
| Prueba con al menos tres personas | ⏳ | Pendiente: ver `docs/guia-de-pruebas.md` |
| Auditoría final | ✅ | Este documento |

## 4. Heurísticas de Nielsen (p. 53–54)

| # | Heurística | Estado | Cómo se cumple |
|---|---|---|---|
| 1 | Visibilidad del estado | ✅ | Anillos de energía, pulsera con contador y barra, huecos del RESET, checkpoints, niebla visible. El cronómetro no se muestra, a propósito |
| 2 | Correspondencia con el mundo real | ✅ | Teclado, torre y monitor; el cuerpo escala con los brazos |
| 3 | Control y libertad | ✅ | Sin game over, volver a jugar, silencio, pantalla de inicio salteable, modo fácil |
| 4 | Consistencia y estándares | ✅ | Grip para agarrar; un color y una forma por tipo; mismo clic y golpe en escritorio |
| 5 | Prevención de errores | ✅ | Golpe deliberado, energía mínima para agarrar, protección tras un viaje, aviso de seguridad |
| 6 | Reconocer en vez de recordar | 🟡 | Con casco los controles solo se explican en la pantalla de la página (que no se ve dentro del casco) y en el mensaje del pie de la pared |
| 7 | Flexibilidad y eficiencia | ✅ | Casco o compu, tirolesa como atajo, modo fácil |
| 8 | Diseño estético y minimalista | ✅ | Sin HUD; la información está en el guante y la pulsera |
| 9 | Ayudar a recuperarse de errores | ✅ | El Glitch explica lo que pasó; el aviso cuando faltan fragmentos |
| 10 | Ayuda y documentación | ✅ | Pantalla de inicio, ayuda en pantalla, README y estos documentos |

## 5. Requisitos de la consigna

| Requisito | Estado |
|---|---|
| Entorno 3D navegable: piso, límites y ambientación | ✅ |
| Al menos 3 objetos 3D con intención espacial | ✅ (teclas, pisos de los escalones, manos con dedos, paneles, botón RESET, cable, fragmentos, medalla) |
| Al menos 1 mecánica central funcional | ✅ (escalar con los brazos) |
| Ejecutable en el navegador por un link | ✅ (GitHub Pages, último deploy exitoso) |
| Preparado para modo VR | ✅ ⏳ (falta probarlo en un casco) |
| El docente abre el link en el navegador de escritorio | ✅ (modo escritorio completo, con instrucciones al abrir) |
| Bitácora de prompts | ✅ (`PROMPTS.md`) |
| Problema documentado y resuelto | ✅ (`docs/problemas-resueltos.md`, 14 casos) |
| **Intervención manual con antes y después** | **⛔ Pendiente de ustedes**: ver `docs/intervencion-manual.md` |
| Informe 16:9, referentes, justificación, exposición | ⛔ Pendiente de ustedes |

## 6. Incongruencias entre los documentos y el juego

Se compararon `docs/idea-final.md`, la consigna, el README y el comportamiento real.

| Hallazgo | Qué se hizo |
|---|---|
| La idea final dice que la pantalla «se agrieta y se abre hacia afuera». El juego muestra las grietas y una luz cálida que se abre desde ellas, pero la pantalla no se abre físicamente | **Se deja así** y queda escrito: el efecto es equivalente para el jugador y no usa físicas ni modelos |
| `CLAUDE.md` describía la estructura del proyecto con menos archivos de los que hay | Se actualizó |
| La tabla de hallazgos de `buenas-practicas-xr.md` (etapas 1 a 4) estaba desactualizada | Se agregó un aviso que remite a este documento |
| Había valores de juego escritos dentro de los componentes (el número de fragmentos, tiempos de protección) | Se pasaron a `config.js` |
| El final no invitaba a descansar, y el diseño consciente del libro lo recomienda para RESET | Se agregó un cartel en el exterior |
| No había pantalla de inicio ni aviso de seguridad (pendiente desde la revisión de las etapas 1 a 4) | Se agregó, en la página y dentro del mundo |
| Los valores de balance (energía, niebla, tiempos de medallas) son estimaciones | Quedan marcados como pendientes de prueba con personas |

## 7. Lo que esta auditoría no pudo verificar

1. **Nada se probó con un casco real.** Falta: el botón de gafas, el seguimiento de los controles, la vibración, los botones A/X/B/Y, tocar la pulsera con la otra mano y golpear el RESET con la mano.
2. **No se escuchó el sonido.** Se comprobó que se crea y se silencia, pero no cómo suena: música, balance de volúmenes y audio espacial.
3. **Ninguna persona jugó el juego.** No hay medidas de tiempo real, abandono, mareo, fatiga ni satisfacción.
4. **Rendimiento en el Quest:** las medidas son del navegador de escritorio. Son muy bajas, pero hay que confirmarlas.
5. **Alturas distintas:** las distancias entre agarres no se probaron con personas bajas o altas.

## 8. Pendientes para el equipo, en orden

1. **Intervención manual del código** (`docs/intervencion-manual.md`).
2. **Probar en un casco** cuando alguien pueda, y anotar qué falla.
3. **Probar con al menos tres personas** (`docs/guia-de-pruebas.md`) y ajustar `config.js` con lo que encuentren.
4. Escuchar el sonido y ajustar volúmenes.
5. Informe visual (16:9, Figma y PDF) y exposición de 5 minutos con los tres.
