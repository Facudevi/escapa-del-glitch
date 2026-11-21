# Intervención manual del código (obligatoria en la consigna)

La consigna del TP4 pide que el equipo **modifique a mano al menos una parte del código generado por la IA** y **explique qué cambió y por qué**. El informe tiene que mostrar un **fragmento antes y después**. Esto lo hacen ustedes; Claude no puede hacerlo por ustedes.

Al momento de escribir esto, **todavía no está hecha** (no hay ningún bloque `// INTERVENCIÓN MANUAL` en el código).

## Cómo hacerla, paso a paso

1. **Elegir un bloque chico y con efecto visible en el juego** (ver las ideas más abajo).
2. **Commit del «antes»**: asegurarse de que no haya nada sin guardar y correr
   ```powershell
   git status
   git commit -m "chore: estado antes de la intervención manual" --allow-empty
   ```
   (con `--allow-empty` el commit existe aunque no haya cambios pendientes; si hay cambios pendientes, hagan el commit normal con ellos).
3. **Escribir el cambio a mano**, sin pedirle el código a la IA, y marcar el bloque en el archivo así:
   ```js
   // INTERVENCIÓN MANUAL: <qué se cambió y por qué, en una línea>
   ... el código que escribieron ...
   // FIN INTERVENCIÓN MANUAL
   ```
4. **Probar** que el juego sigue andando (`npm run dev`, subir un poco, soltarse, etc.) y que `npm run build` compila.
5. **Commit del «después»**:
   ```powershell
   git add .
   git commit -m "feat: intervención manual en <archivo> (<qué cambia>)"
   ```
6. **Sacar el antes y el después** con `git show <commit-antes>:src/components/<archivo>.js` y `git diff <commit-antes> <commit-después> -- src/components/<archivo>.js`, y completar la tabla de abajo.

A partir de ahí, `CLAUDE.md` impide que Claude modifique esos bloques sin pedirles permiso.

## Ideas de bloques (elijan una, o propongan otra)

| Idea | Archivo | Qué se ve en el juego |
|---|---|---|
| Que la mano libre recupere energía más rápido cuando la otra mano está agarrada a una **tecla firme** (hoy recupera siempre al mismo ritmo) | `src/components/energia.js` | Cambia el balance de la escalada |
| Cambiar los umbrales de color del anillo de energía, o agregar un cuarto estado de aviso | `src/components/anillo-energia.js` | Cambia cuándo se pone ámbar y rojo |
| Que la tecla que se hunde se hunda más rápido a medida que pasa el tiempo agarrada | `src/components/tecla-hunde.js` | Una tecla más exigente |
| Que el escaneo marque también el fragmento del tramo de arriba cuando ya se juntó el del actual | `src/components/escaneo.js` | Cambia qué marca el pulso |
| Cambiar qué frase dice el Glitch según cuántos fragmentos lleva el jugador | `src/components/glitch.js` | Frases más ajustadas |

Los números de tiempos y velocidades viven en `src/config.js`. Cambiar solo un número **no alcanza** como intervención: tiene que ser **lógica** que ustedes escriban.

## Registro (completar)

| | |
|---|---|
| **Quién la hizo** | |
| **Fecha** | |
| **Archivo y bloque** | |
| **Commit del «antes»** | |
| **Commit del «después»** | |
| **Qué cambió** | |
| **Por qué** (qué problema o mejora buscaban) | |
| **Cómo lo probaron** | |

### Fragmento antes

```js
// pegar acá
```

### Fragmento después

```js
// pegar acá
```
