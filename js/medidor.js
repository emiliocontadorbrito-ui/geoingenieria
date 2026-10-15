/* Medidor del porcentaje (teledetección). Tres parcelas de ejemplo: lo que la IA
   ve construido, lo que consta en el Catastro y la diferencia. Sin JavaScript se
   ve la parcela A, que ya viene escrita en el HTML. */
(function () {
  var P = [
    { sup: 2400, ia: 410, cat: 395, tipo: 'ok', t: 'Todo en orden',
      d: 'Lo que se ve coincide con lo registrado.' },
    { sup: 3100, ia: 520, cat: 240, tipo: 'alerta', t: 'Alerta',
      d: 'Una nave de unos 60 m² sin registrar. Pasa a campo.' },
    { sup: 4000, ia: 1150, cat: 0, tipo: 'descartada', t: 'Descartada',
      d: 'Era escombro, no una construcción. Lo comprueba un técnico.' }
  ];
  var miles = function (n) { return n.toLocaleString('es-ES'); };
  var pct = function (a, b) { return Math.round(a / b * 100); };

  document.querySelectorAll('[data-medidor]').forEach(function (m) {
    var tabs = m.querySelectorAll('[role="tab"]');
    var c = function (k) { return m.querySelector('[data-campo="' + k + '"]'); };
    function pintar(i) {
      var p = P[i], dif = Math.max(0, p.ia - p.cat);
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
      c('sup').textContent = 'Superficie de la parcela: ' + miles(p.sup) + ' m²';
      c('ia').style.width = pct(p.ia, p.sup) + '%';
      c('ia-t').textContent = pct(p.ia, p.sup) + ' % · ' + miles(p.ia) + ' m²';
      c('cat').style.width = pct(p.cat, p.sup) + '%';
      c('cat-t').textContent = pct(p.cat, p.sup) + ' % · ' + miles(p.cat) + ' m²';
      c('dif').style.width = Math.max(1, pct(dif, p.sup)) + '%';
      c('dif-t').textContent = miles(dif) + ' m²';
      c('ver').setAttribute('data-tipo', p.tipo);
      c('ver-t').textContent = p.t;
      c('ver-d').textContent = p.d;
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { pintar(+t.getAttribute('data-p')); });
      t.addEventListener('keydown', function (e) {
        var i = +t.getAttribute('data-p');
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          i = (i + (e.key === 'ArrowRight' ? 1 : P.length - 1)) % P.length;
          tabs[i].focus(); pintar(i);
        }
      });
    });
  });
})();
