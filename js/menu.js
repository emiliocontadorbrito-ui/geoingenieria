/* Menú de móvil y aparición suave de bloques al hacer scroll. Si esto falla,
   la página se sigue leyendo entera: la clase .js solo se pone si el script
   arranca, y sin ella nada está oculto. */
(function () {
  document.documentElement.classList.add('js');

  var boton = document.querySelector('.menu-boton');
  var menu = document.getElementById('menu');
  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });

    // Cerrar al pulsar Escape, para no dejar el menú tapando la página.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('abierto')) {
        menu.classList.remove('abierto');
        boton.setAttribute('aria-expanded', 'false');
        boton.focus();
      }
    });
  }

  // Desplegables del menú (Catastro, Proyectos). En ordenador también se abren
  // al pasar el ratón; el clic sirve para teclado y pantallas táctiles.
  var desplegables = document.querySelectorAll('.desplegable');
  function cerrar(d) {
    d.classList.remove('abierto');
    d.querySelector('.desplegable-boton').setAttribute('aria-expanded', 'false');
  }
  desplegables.forEach(function (d) {
    var b = d.querySelector('.desplegable-boton');
    b.addEventListener('click', function () {
      var abrir = !d.classList.contains('abierto');
      desplegables.forEach(cerrar);
      if (abrir) { d.classList.add('abierto'); b.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', function (e) {
    desplegables.forEach(function (d) { if (!d.contains(e.target)) cerrar(d); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    desplegables.forEach(function (d) {
      if (d.classList.contains('abierto')) { cerrar(d); d.querySelector('.desplegable-boton').focus(); }
    });
  });

  // Aparición al entrar en pantalla. Sin IntersectionObserver, todo visible.
  var bloques = document.querySelectorAll('.revelar');
  if (!('IntersectionObserver' in window)) {
    bloques.forEach(function (b) { b.classList.add('visto'); });
    return;
  }
  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visto');
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  bloques.forEach(function (b) { obs.observe(b); });
})();
