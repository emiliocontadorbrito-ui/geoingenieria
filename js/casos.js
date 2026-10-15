/* Desplegable de casos de teledetección (catastro.html).
   Sin JavaScript se ven los cuatro casos uno debajo de otro. Con él, el
   desplegable enseña solo el caso elegido. */
(function () {
  document.querySelectorAll('[data-casos]').forEach(function (c) {
    var sel = c.querySelector('select');
    var casos = Array.prototype.slice.call(c.querySelectorAll('[data-caso]'));
    function ver() {
      casos.forEach(function (k) { k.hidden = k.getAttribute('data-caso') !== sel.value; });
    }
    sel.addEventListener('change', ver);
    c.classList.add('activo');
    ver();
  });
})();
