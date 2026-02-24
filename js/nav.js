/**
 * State 214 – Mobile Navigation Toggle
 */
(function () {
  'use strict';
  var btn = document.querySelector('.nav-toggle');
  var inner = document.querySelector('.nav-inner');
  if (!btn || !inner) return;
  btn.addEventListener('click', function () {
    var open = inner.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
