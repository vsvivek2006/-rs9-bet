/* ============================================================
   RS9 GAME — age-gate.js
   18+ verification modal. Fires on first visit.
   Cannot be dismissed by Escape or outside click.
   ============================================================ */
(function() {
    'use strict';

    var KEY = 'rs9_age_verified';
    var gate = document.getElementById('age-gate');
    if (!gate) return;

    if (localStorage.getItem(KEY) === '1') {
        gate.remove();
        return;
    }

    /* Show gate + lock scroll */
    gate.hidden = false;
    document.body.style.overflow = 'hidden';

    var enterBtn = gate.querySelector('[data-age-enter]');
    var exitBtn = gate.querySelector('[data-age-exit]');

    function enter() {
        localStorage.setItem(KEY, '1');
        gate.style.transition = 'opacity 350ms ease';
        gate.style.opacity = '0';
        document.body.style.overflow = '';
        setTimeout(function() {
            gate.remove();
        }, 360);
    }

    function exit() {
        window.location.href = 'https://www.google.com';
    }

    if (enterBtn) enterBtn.addEventListener('click', enter);
    if (exitBtn) exitBtn.addEventListener('click', exit);

    /* Block Escape key while gate is up */
    document.addEventListener('keydown', function(e) {
        if (!gate.isConnected) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    /* Outside click does nothing (no handler on backdrop) */
})();