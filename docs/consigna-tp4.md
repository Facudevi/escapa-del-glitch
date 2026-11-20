# Consigna del TP4: experiencia inmersiva VR del evento (WebXR)

Resumen de la consigna oficial (archivo «BIMESTRE 4 - consigna.pdf») y de cómo la cubre el proyecto. Si algo de este resumen contradice al PDF, manda el PDF.

## Qué pide

- Idear y desarrollar una experiencia de **realidad virtual que funcione como touchpoint complementario del evento**. No se trata de reconstruir el evento en VR, sino de aportar un juego, actividad o atracción coherente con la narrativa, la identidad de marca y los User Persona.
- Situar a la persona usuaria como **protagonista de una interacción espacial**, respetando las decisiones estéticas y de accesibilidad de los TP anteriores.
- Tecnología **WebXR** (A-Frame, three.js, etc.). Durante la cursada se prueba en el navegador de escritorio con mouse y teclado, pero el producto tiene que quedar **preparado para ejecutarse en modo inmersivo en un casco sin rehacerlo**.
- Se valora que la idea **tenga sentido por ser VR**, su coherencia con el evento y la marca, y el **criterio técnico** del equipo al dirigir la IA e intervenir el código.

## Requisitos mínimos del producto

1. Entorno 3D navegable: piso, límites y ambientación acorde.
2. Al menos 3 objetos 3D dispuestos con intención espacial.
3. Al menos 1 mecánica o interacción central funcional.
4. Ejecutable en el navegador y abrible por un link.
5. Preparado para modo VR.

## Obligatorio en el desarrollo

- **Bitácora de prompts** que documente el proceso de vibe coding.
- **Intervención manual del código:** el equipo modifica a mano al menos una parte del código generado por la IA y explica **qué cambió y por qué**.
- **Link público** accesible y navegable.

## Entregas

| Entrega | Formato |
|---|---|
| Experiencia VR | Link WebXR, ejecutable y navegable por el docente **en el navegador** |
| Informe digital | Horizontal 16:9, dos versiones: **interactiva (link de Figma)** y **estática (.pdf)** |
| Exposición oral | **5 minutos cronometrados**, con la participación de **todos** los integrantes y un soporte visual |

El informe tiene que incluir: investigación de referentes, definición y justificación de la idea, diseño de la experiencia, **bitácora de prompts**, **problema documentado y resuelto**, y la **intervención sobre el código (fragmento antes y después)**.

La entrega se hace por la tarea de Microsoft Teams, a cargo de **un solo integrante**. Las notas pueden variar entre integrantes según el trabajo individual.

## Cómo lo cubre el proyecto

| Requisito | Estado | Dónde |
|---|---|---|
| Entorno navegable con piso, límites y ambientación | Hecho (sala de prueba; tramos reales en la etapa 6) | `sala-base`, `ambiente-calido` |
| 3 o más objetos con intención espacial | Hecho (teclas, plataformas, guantes, carteles) | `pared-prueba`, `checkpoint` |
| Mecánica central funcional | Hecho: escalar con los brazos | `climb`, `energia`, `caida` |
| Ejecutable en el navegador por link | Hecho | GitHub Pages |
| Preparado para modo VR | Hecho (meta-touch-controls, botón de gafas); **falta probarlo en un casco** | `index.html` |
| **El docente lo abre en el navegador de escritorio** | Cubierto por el modo escritorio: mirar, WASD, clic y escalada con mouse. Tiene que estar pulido y explicado en pantalla | `modo-escritorio`, `escalada-mouse` |
| Bitácora de prompts | En curso | `PROMPTS.md` |
| Problema documentado y resuelto | En curso | `docs/problemas-resueltos.md` |
| Intervención manual con antes y después | **Pendiente: la hace el equipo** | ver más abajo |
| Informe 16:9 en Figma y PDF | **Pendiente: lo hace el equipo** | — |
| Exposición oral de 5 minutos | **Pendiente: lo hace el equipo** | — |

## Pendientes que dependen del equipo

1. **Intervención manual.** Elegir un bloque de código (por ejemplo, ajustar el balance de la energía, o cambiar cómo se agarra una tecla) y escribirlo **a mano**, marcado con `// INTERVENCIÓN MANUAL`. Antes de editar se hace un commit (el «antes») y otro después (el «después»). Anotar qué se cambió y por qué.
2. **Investigación de referentes** de experiencias inmersivas y VR (imágenes, links y análisis).
3. **Justificación:** por qué esta idea para este evento y por qué en VR (la escalada usa el cuerpo, el espacio y la altura; en una pantalla plana pierde sentido).
4. **Informe visual y exposición.** Reparto para que hablen los tres.
5. **Probar en un casco** cuando alguien pueda, para validar lo que hoy solo se probó en el navegador.
6. **User Persona y decisiones de accesibilidad de los TP1 a TP3:** esos documentos no están en el repositorio. Conviene pasarlos para chequear que el juego sea coherente con ellos.
