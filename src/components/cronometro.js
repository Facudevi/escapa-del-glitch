// Cronómetro de la partida, invisible para el jugador. Va en la <a-scene>.
// Empieza cuando el jugador se agarra por primera vez y se detiene al activar el RESET.
// El tiempo decide la medalla del final. Si el jugador escala más lento por buscar los fragmentos
// comidos, eso se refleja acá.
//
// tiempo() devuelve los segundos transcurridos.
AFRAME.registerComponent('cronometro', {
  init() {
    this.reiniciar();
    this.el.addEventListener('mano-agarra', () => {
      if (this.el.introActiva) return; // el grip que saltea la intro no cuenta como primer agarre
      if (this.inicio === null) this.inicio = performance.now();
    });
    this.el.addEventListener('reset-activado', () => {
      if (this.inicio !== null && this.fin === null) this.fin = performance.now();
    });
  },

  reiniciar() {
    this.inicio = null;
    this.fin = null;
  },

  // Segundos desde el primer agarre (o hasta el RESET, si ya se activó)
  tiempo() {
    if (this.inicio === null) return 0;
    return ((this.fin === null ? performance.now() : this.fin) - this.inicio) / 1000;
  },
});
