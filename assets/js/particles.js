/* ============================================================
   RS9 GAME — particles.js
   40 rising blue/white ember particles on a fixed canvas.
   ============================================================ */
(function() {
    'use strict';

    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var COUNT = 40;
    var particles = [];
    var w = 0,
        h = 0;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function makeParticle(startBottom) {
        var isRed = Math.random() < 0.6; /* blue 60%, white 40% */
        return {
            x: rand(0, w),
            y: startBottom ? rand(h * 0.4, h + 40) : rand(-20, h),
            size: rand(2, 5),
            opacity: rand(0.3, 0.7),
            speed: rand(h / 15000, h / 8000) * 16,
            /* px per frame ~ 8s-15s traversal */
            wobble: rand(0.2, 0.9),
            phase: rand(0, Math.PI * 2),
            color: isRed ? '0,102,255' : '255,255,255'
        };
    }

    for (var i = 0; i < COUNT; i++) particles.push(makeParticle(false));

    function frame() {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.y -= p.speed;
            p.phase += 0.02;
            p.x += Math.sin(p.phase) * p.wobble;

            /* fade out as it nears the top */
            var fade = p.y < h * 0.2 ? Math.max(0, p.y / (h * 0.2)) : 1;

            if (p.y < -20) {
                particles[i] = makeParticle(true);
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + p.color + ',' + (p.opacity * fade) + ')';
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(' + p.color + ',0.5)';
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
})();