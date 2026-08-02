/* ============================================================
   RS9 GAME — main.js
   Nav, scroll, reveal, counters, cookie banner, mobile menu,
   active link, external-link handling, games filter.
   Vanilla ES6+, event delegation, no libraries.
   ============================================================ */
(function() {
    'use strict';

   var DOWNLOAD_LINKS = [
        'https://rs9-in.rs9uniors.com/en/affiliate-invited?c=WWWXXFWSKW&s=3',
        'https://rs9-in.rs9uniors.com/en/affiliate-invited?c=WWWXXFWSKW&s=3',
        // 'https://aagame.chat/?code=K0VNK3Z',
        // 'https://77game.com.in/?code=B9D70QZ'
    ];

    function randomDownloadLink() {
        return DOWNLOAD_LINKS[Math.floor(Math.random() * DOWNLOAD_LINKS.length)];
    }
    window.RS9_DOWNLOAD_LINKS = DOWNLOAD_LINKS;
    window.rs9RandomDownloadLink = randomDownloadLink;

    /* ---------- Randomize affiliate download/register links ---------- */
    document.querySelectorAll('[data-download-link]').forEach(function(a) {
        a.setAttribute('href', randomDownloadLink());
    });

    /* ---------- Sticky nav ---------- */
    var nav = document.querySelector('.nav');

    function onScroll() {
        if (!nav) return;
        if (window.scrollY > 80) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, {
        passive: true
    });
    onScroll();

    /* ---------- Mobile hamburger ---------- */
    var toggle = document.querySelector('.nav__toggle');
    var mobile = document.querySelector('.nav__mobile');

    function closeMobile() {
        if (toggle) toggle.classList.remove('open');
        if (mobile) mobile.classList.remove('open');
        document.body.style.overflow = '';
    }
    if (toggle && mobile) {
        toggle.addEventListener('click', function() {
            var open = toggle.classList.toggle('open');
            mobile.classList.toggle('open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });
        mobile.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') closeMobile();
        });
    }

    /* ---------- Active nav link ---------- */
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav]').forEach(function(a) {
        if (a.getAttribute('data-nav') === path) a.classList.add('active');
    });

    /* ---------- Scroll reveal ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        var io = new IntersectionObserver(function(entries, obs) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });
        reveals.forEach(function(el) {
            io.observe(el);
        });
    } else {
        reveals.forEach(function(el) {
            el.classList.add('visible');
        });
    }

    /* ---------- Counter animation ---------- */
    function animateCounter(el) {
        var target = parseFloat(el.getAttribute('data-count')) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var dur = 1600,
            start = null;

        function tick(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = Math.floor(eased * target);
            el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
        }
        requestAnimationFrame(tick);
    }
    var counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window && counters.length) {
        var cio = new IntersectionObserver(function(entries, obs) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        counters.forEach(function(el) {
            cio.observe(el);
        });
    }

    /* ---------- Cookie banner ---------- */
    var cookie = document.querySelector('.cookie');
    if (cookie) {
        if (!localStorage.getItem('rs9_cookie_ok')) {
            setTimeout(function() {
                cookie.classList.add('show');
            }, 1200);
        }
        cookie.addEventListener('click', function(e) {
            if (e.target.matches('[data-cookie]')) {
                localStorage.setItem('rs9_cookie_ok', '1');
                cookie.classList.remove('show');
                setTimeout(function() {
                    cookie.remove();
                }, 700);
            }
        });
    }

    /* ---------- External / affiliate links open in new tab ---------- */
    document.querySelectorAll('a[href]').forEach(function(a) {
        var href = a.getAttribute('href');
        if (!href) return;
        if (href.indexOf('http') === 0 && href.indexOf(window.location.host) === -1) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer nofollow');
        }
    });

    /* ---------- Games filter (download.html) ---------- */
    var filterBar = document.querySelector('.filters');
    if (filterBar) {
        filterBar.addEventListener('click', function(e) {
            var btn = e.target.closest('.filter-btn');
            if (!btn) return;
            filterBar.querySelectorAll('.filter-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            var cat = btn.getAttribute('data-filter');
            document.querySelectorAll('.g-card').forEach(function(card) {
                var show = cat === 'all' || card.getAttribute('data-category') === cat;
                card.classList.toggle('hide', !show);
            });
        });
    }

    /* ---------- Blog category filter (blogs.html) ---------- */
    var blogFilter = document.querySelector('[data-blog-filters]');
    if (blogFilter) {
        blogFilter.addEventListener('click', function(e) {
            var btn = e.target.closest('.filter-btn');
            if (!btn) return;
            blogFilter.querySelectorAll('.filter-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            var cat = btn.getAttribute('data-filter');
            document.querySelectorAll('.post-card').forEach(function(card) {
                var show = cat === 'all' || card.getAttribute('data-category') === cat;
                card.classList.toggle('hide', !show);
            });
        });
    }

    /* ---------- Simple contact / newsletter form UX (no backend) ---------- */
    document.querySelectorAll('form[data-static]').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            var note = form.querySelector('[data-form-note]');
            if (note) {
                note.hidden = false;
            }
            form.reset();
        });
    });
})();
