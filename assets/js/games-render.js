/* ============================================================
   RS9 GAME — games-render.js
   Renders game cards from window.RS9_GAMES into any container
   with [data-games] and drives category filtering.
   Every card links to game.html?game=<slug> — never the
   affiliate URL directly.
   ============================================================ */
(function() {
    'use strict';

    var GAMES = window.RS9_GAMES || [];

    /* Curated highlight sets (by slug). Missing slugs are ignored. */
    var FEATURED = ['teen-patti', 'dragon-vs-tiger', 'andar-bahar', 'crazy-time', 'gates-of-olympus', 'super-ace', 'crash', 'lightning-roulette', 'fortune-gems', 'mahjong-ways', 'mega-ace', 'candy-burst'];
    var TRENDING = ['mines', 'plinko-x', 'golden-empire', 'zeus', 'starburst', 'lucky-neko', 'money-coming', 'wild-ace', 'jackpot-fishing', 'fortune-mouse', 'piggy-gold', 'dragon-hatch'];

    function bySlug(list) {
        return list.map(function(s) {
            for (var i = 0; i < GAMES.length; i++)
                if (GAMES[i].slug === s) return GAMES[i];
            return null;
        }).filter(Boolean);
    }

    var CAT_LABEL = {
        cards: 'Cards',
        slots: 'Slots',
        live: 'Live',
        fishing: 'Fishing',
        instant: 'Instant',
        sports: 'Sports'
    };

    function cardHTML(g, variant) {
        var url = 'game.html?game=' + encodeURIComponent(g.slug);
        var cls = variant === 'grid' ? 'g-card' : 'game-card';
        if (variant === 'grid') {
            return '<a class="g-card" href="' + url + '" data-category="' + g.category + '" aria-label="' + g.name + ' — view details">' +
                '<div class="g-card__art"><img src="' + g.img + '" alt="' + g.name + '" width="211" height="260" loading="lazy"></div>' +
                '<div class="g-card__overlay">' +
                '<span class="g-card__cat">' + (CAT_LABEL[g.category] || g.category) + '</span>' +
                '<span class="g-card__name">' + g.name + '</span>' +
                '<span class="g-card__play">View Game</span>' +
                '</div></a>';
        }
        return '<a class="game-card" href="' + url + '" aria-label="' + g.name + ' — view details">' +
            '<img class="game-card__img" src="' + g.img + '" alt="' + g.name + '" width="211" height="260" loading="lazy">' +
            '<div class="game-card__overlay">' +
            '<span class="game-card__name">' + g.name + '</span>' +
            '<span class="game-card__play">View Game</span>' +
            '</div></a>';
    }

    /* Render into every container */
    document.querySelectorAll('[data-games]').forEach(function(box) {
        var mode = box.getAttribute('data-games'); // 'all' | 'featured' | 'trending'
        var variant = box.getAttribute('data-variant') || 'grid';
        var list;
        if (mode === 'featured') list = bySlug(FEATURED);
        else if (mode === 'trending') list = bySlug(TRENDING);
        else list = GAMES;
        if ((mode === 'featured' || mode === 'trending') && list.length === 0) list = GAMES.slice(0, 12);
        box.innerHTML = list.map(function(g) {
            return cardHTML(g, variant);
        }).join('');
    });

    /* Update total-count placeholders */
    document.querySelectorAll('[data-games-count]').forEach(function(el) {
        el.textContent = GAMES.length;
    });
})();