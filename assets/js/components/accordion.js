/* ============================================================
   RS9 GAME — accordion.js
   FAQ / T&C accordion. Smooth height transition, one open at a
   time per accordion group. Event delegation.
   ============================================================ */
(function() {
    'use strict';

    document.querySelectorAll('.accordion').forEach(function(acc) {
        var single = acc.hasAttribute('data-single');

        acc.addEventListener('click', function(e) {
            var trigger = e.target.closest('.acc-trigger');
            if (!trigger) return;
            var item = trigger.closest('.acc-item');
            var panel = item.querySelector('.acc-panel');
            var isOpen = item.classList.contains('open');

            if (single && !isOpen) {
                acc.querySelectorAll('.acc-item.open').forEach(function(other) {
                    other.classList.remove('open');
                    var op = other.querySelector('.acc-panel');
                    if (op) op.style.maxHeight = null;
                    var ot = other.querySelector('.acc-trigger');
                    if (ot) ot.setAttribute('aria-expanded', 'false');
                });
            }

            item.classList.toggle('open', !isOpen);
            trigger.setAttribute('aria-expanded', String(!isOpen));
            if (!isOpen) panel.style.maxHeight = panel.scrollHeight + 'px';
            else panel.style.maxHeight = null;
        });

        /* Recompute open panel height on resize */
        window.addEventListener('resize', function() {
            acc.querySelectorAll('.acc-item.open .acc-panel').forEach(function(panel) {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            });
        });
    });
})();