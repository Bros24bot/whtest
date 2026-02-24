/**
 * State 214 – 3D Tilt für Karten (Desktop: Maus, Mobile: Touch)
 * Leichte perspective + rotateX/Y für modernen Look
 */
(function () {
  'use strict';

  var TILT_MAX = 8;
  var PERSPECTIVE = 1200;
  var EASE = 0.12;

  function getEl(sel) {
    return document.querySelectorAll(sel);
  }

  function getRect(el) {
    return el.getBoundingClientRect();
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initTilt() {
    if (prefersReducedMotion()) return;
    var cards = getEl('.card-3d');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var style = card.style;
      var currentX = 0, currentY = 0;
      var targetX = 0, targetY = 0;
      var raf = null;

      function setTransform() {
        currentX += (targetX - currentX) * EASE;
        currentY += (targetY - currentY) * EASE;
        style.transform = 'perspective(' + PERSPECTIVE + 'px) rotateX(' + (-currentY) + 'deg) rotateY(' + currentX + 'deg) scale3d(1, 1, 1)';
        if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
          raf = requestAnimationFrame(setTransform);
        }
      }

      function onMove(clientX, clientY) {
        var r = getRect(card);
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        var x = (clientX - cx) / (r.width / 2);
        var y = (clientY - cy) / (r.height / 2);
        targetX = Math.max(-1, Math.min(1, x)) * TILT_MAX;
        targetY = Math.max(-1, Math.min(1, y)) * -TILT_MAX;
        if (!raf) raf = requestAnimationFrame(setTransform);
      }

      function reset() {
        targetX = 0;
        targetY = 0;
        if (!raf) raf = requestAnimationFrame(setTransform);
      }

      card.addEventListener('mouseenter', function () {
        card.classList.add('tilt-active');
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('tilt-active');
        reset();
      });
      card.addEventListener('mousemove', function (e) {
        onMove(e.clientX, e.clientY);
      });

      var touchActive = false;
      card.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
          touchActive = true;
          card.classList.add('tilt-active');
        }
      }, { passive: true });
      card.addEventListener('touchmove', function (e) {
        if (touchActive && e.touches.length === 1) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });
      card.addEventListener('touchend', function () {
        touchActive = false;
        card.classList.remove('tilt-active');
        reset();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }
})();
