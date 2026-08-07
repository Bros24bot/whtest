/**
 * State 214 – 3D Tilt für Karten (Desktop: Maus, Mobile: Touch)
 * Reset muss immer greifen: raf-Flag nach Animation wieder freigeben.
 */
(function () {
  'use strict';

  var TILT_MAX = 7;
  var PERSPECTIVE = 1200;
  var EASE = 0.16;
  var SNAP = 0.08;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initTilt() {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    var cards = document.querySelectorAll('.card-3d');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var currentX = 0;
      var currentY = 0;
      var targetX = 0;
      var targetY = 0;
      var raf = 0;

      function apply() {
        card.style.transform =
          'perspective(' + PERSPECTIVE + 'px) rotateX(' + (-currentY) + 'deg) rotateY(' + currentX + 'deg)';
      }

      function tick() {
        currentX += (targetX - currentX) * EASE;
        currentY += (targetY - currentY) * EASE;

        if (Math.abs(targetX - currentX) < SNAP && Math.abs(targetY - currentY) < SNAP) {
          currentX = targetX;
          currentY = targetY;
          apply();
          raf = 0;
          if (targetX === 0 && targetY === 0) {
            card.style.transform = '';
            card.classList.remove('tilt-active');
          }
          return;
        }

        apply();
        raf = requestAnimationFrame(tick);
      }

      function startAnim() {
        if (!raf) raf = requestAnimationFrame(tick);
      }

      function onMove(clientX, clientY) {
        var r = card.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var x = (clientX - (r.left + r.width / 2)) / (r.width / 2);
        var y = (clientY - (r.top + r.height / 2)) / (r.height / 2);
        targetX = Math.max(-1, Math.min(1, x)) * TILT_MAX;
        targetY = Math.max(-1, Math.min(1, y)) * -TILT_MAX;
        card.classList.add('tilt-active');
        startAnim();
      }

      function reset() {
        targetX = 0;
        targetY = 0;
        startAnim();
      }

      card.addEventListener('mouseenter', function () {
        card.classList.add('tilt-active');
      });
      card.addEventListener('mousemove', function (e) {
        onMove(e.clientX, e.clientY);
      });
      card.addEventListener('mouseleave', reset);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }
})();
