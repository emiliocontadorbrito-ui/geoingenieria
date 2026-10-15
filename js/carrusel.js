/* Carrusel del inicio.
   Sin JavaScript la banda se desliza a mano (scroll-snap). Con él aparecen
   las rayitas que marcan la diapositiva (y llevan a ella), y pasa solo cada
   7 segundos. Se para mientras el ratón o el foco están encima, y con
   «reducir movimiento» no pasa solo. */
(function () {
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-carrusel]').forEach(function (c) {
    var pista = c.querySelector('.carrusel-pista');
    var diap = Array.prototype.slice.call(pista.children);
    var puntos = Array.prototype.slice.call(c.querySelectorAll('.carrusel-puntos button'));
    var actual = 0, parado = reducir, encima = false, espera = null;

    function marcar() {
      puntos.forEach(function (p, i) { p.setAttribute('aria-current', i === actual ? 'true' : 'false'); });
      diap.forEach(function (d, i) {
        d.setAttribute('aria-hidden', i === actual ? 'false' : 'true');
        d.inert = i !== actual;
      });
    }
    function ir(i) {
      actual = (i + diap.length) % diap.length;
      pista.scrollTo({ left: actual * pista.clientWidth, behavior: reducir ? 'auto' : 'smooth' });
      marcar();
    }
    puntos.forEach(function (p, i) { p.addEventListener('click', function () { ir(i); }); });

    // Al deslizar con el dedo, el punto activo sigue a la diapositiva visible.
    pista.addEventListener('scroll', function () {
      clearTimeout(espera);
      espera = setTimeout(function () {
        var i = Math.round(pista.scrollLeft / pista.clientWidth);
        if (i !== actual) { actual = i; marcar(); }
      }, 120);
    });
    c.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { ir(actual - 1); }
      if (e.key === 'ArrowRight') { ir(actual + 1); }
    });
    c.addEventListener('mouseenter', function () { encima = true; });
    c.addEventListener('mouseleave', function () { encima = false; });
    c.addEventListener('focusin', function () { encima = true; });
    c.addEventListener('focusout', function () { encima = false; });
    window.addEventListener('resize', function () { pista.scrollTo({ left: actual * pista.clientWidth }); });

    setInterval(function () {
      if (!parado && !encima && !document.hidden) { ir(actual + 1); }
    }, 7000);

    c.classList.add('activo');
    marcar();
  });
})();
