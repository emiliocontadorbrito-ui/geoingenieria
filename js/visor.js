/* Plano de capas (inicio y teledetección).
   Sin JavaScript se ven todas las capas. Con él, la leyenda enciende y apaga
   cada capa y, la primera vez que el plano entra en pantalla, las capas
   aparecen una tras otra y se quedan encendidas. Con «reducir movimiento» no
   hay animación. */
(function () {
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-visor]').forEach(function (visor) {
    var botones = Array.prototype.slice.call(visor.querySelectorAll('button[data-capa]'));
    var estado = visor.querySelector('[data-estado]');
    var svg = visor.querySelector('svg');
    var tocado = false;

    function poner(nombre, on) {
      var g = svg.querySelector('g[data-capa="' + nombre + '"]');
      if (g) g.classList.toggle('apagada', !on);
      botones.forEach(function (b) { if (b.getAttribute('data-capa') === nombre) b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    }
    function contar() {
      var on = botones.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; });
      var alertas = on.some(function (b) { return b.getAttribute('data-capa') === 'alertas'; });
      if (estado) estado.textContent = on.length + ' de ' + botones.length + ' capas' + (alertas ? ' · 3 alertas' : '');
    }
    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        tocado = true;
        poner(b.getAttribute('data-capa'), b.getAttribute('aria-pressed') !== 'true');
        contar();
      });
    });
    contar();
    if (reducir || !('IntersectionObserver' in window)) return;

    var orden = botones.map(function (b) { return b.getAttribute('data-capa'); });
    orden.forEach(function (n, i) { poner(n, i === 0); });
    contar();
    var obs = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      obs.disconnect();
      orden.slice(1).forEach(function (n, i) {
        setTimeout(function () { if (!tocado) { poner(n, true); contar(); } }, 900 * (i + 1));
      });
    }, { threshold: .45 });
    obs.observe(visor);
  });
})();
