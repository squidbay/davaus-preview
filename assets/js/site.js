/* DAVAUS client-review preview — interactions.
   Nothing on this site sends data, places orders or loads third-party scripts. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Products dropdown (C01 / 5b) */
  $$('.dropdown').forEach(function (dd) {
    var btn = $('button', dd);
    function set(open) { dd.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) set(false); });
    dd.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); btn.focus(); } });
    dd.addEventListener('focusout', function (e) { if (e.relatedTarget && !dd.contains(e.relatedTarget)) set(false); });
  });

  /* Mobile drawer (4c): full screen, focus trapped, Esc / close button closes */
  var drawer = $('#drawer'), opener = $('.menu-btn');
  if (drawer && opener) {
    var closer = $('.drawer-close', drawer);
    var focusables = function () { return $$('a[href],button:not([disabled])', drawer); };
    var openDrawer = function () {
      drawer.classList.add('open'); drawer.removeAttribute('hidden');
      document.body.classList.add('drawer-open');
      opener.setAttribute('aria-expanded', 'true');
      closer.focus();
    };
    var closeDrawer = function (restore) {
      drawer.classList.remove('open'); drawer.setAttribute('hidden', '');
      document.body.classList.remove('drawer-open');
      opener.setAttribute('aria-expanded', 'false');
      if (restore !== false) opener.focus();
    };
    opener.addEventListener('click', openDrawer);
    closer.addEventListener('click', function () { closeDrawer(); });
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDrawer(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { closeDrawer(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1024 && drawer.classList.contains('open')) closeDrawer(false); });
  }

  /* FAQ accordion (C08): one item open at a time, deep-linkable by #faq-… */
  $$('.faq').forEach(function (faq) {
    var buttons = $$('.faq-q button', faq);
    function toggle(btn, open) {
      btn.setAttribute('aria-expanded', String(open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
    }
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        buttons.forEach(function (b) { if (b !== btn) toggle(b, false); });
        toggle(btn, open);
      });
    });
  });
  function openFaqFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!/^faq-/.test(id)) return;
    var item = document.getElementById(id);
    var btn = item && $('.faq-q button', item);
    if (btn && btn.getAttribute('aria-expanded') !== 'true') btn.click();
  }
  openFaqFromHash();
  window.addEventListener('hashchange', openFaqFromHash);

  /* Purchase / Box links have not been supplied yet. These buttons reveal a plain
     notice instead of pretending to reach a checkout or a dealer portal. */
  $$('[data-reveal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var out = document.getElementById(btn.getAttribute('data-reveal'));
      if (!out) return;
      var nodes = Array.prototype.slice.call(out.childNodes);
      out.hidden = false;
      // Re-insert the content so screen readers announce the status each time.
      out.textContent = '';
      window.setTimeout(function () { nodes.forEach(function (n) { out.appendChild(n); }); }, 30);
    });
  });

  /* Product pages: sticky sub-nav highlights the current section; the Where-to-buy
     button joins the bar (and the mobile sticky CTA appears) once the hero CTAs scroll away. */
  var subnav = $('.subnav');
  if (subnav && 'IntersectionObserver' in window) {
    var links = $$('ul a', subnav);
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var current = function () {
      var y = subnav.getBoundingClientRect().bottom + 24, cur = sections[0];
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= y) cur = s; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = sections[sections.length - 1];
      if (subnav.getBoundingClientRect().top > 1) cur = sections[0];
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + cur.id;
        a.classList.toggle('current', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', current, { passive: true });
    current();
    var heroCtas = $('.p-hero .btn-row'), sticky = $('.sticky-cta');
    if (heroCtas) {
      new IntersectionObserver(function (entries) {
        var gone = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
        subnav.classList.toggle('show-cta', gone);
        if (sticky) { sticky.classList.toggle('show', gone); sticky.setAttribute('aria-hidden', String(!gone)); $$('a', sticky).forEach(function (a) { a.tabIndex = gone ? 0 : -1; }); }
      }).observe(heroCtas);
    }
  }

  /* Support filter (3f) */
  var chips = $$('.chip[data-filter]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      $$('[data-product]').forEach(function (el) {
        el.hidden = !(f === 'all' || el.getAttribute('data-product') === f);
      });
      var status = $('#filter-status');
      if (status) status.textContent = f === 'all' ? 'Showing resources for all products.' : 'Showing resources for ' + chip.textContent.trim() + '.';
    });
  });

  /* Kernel Keeper payback arithmetic (3c · N5) */
  var roi = $('#roi-form');
  if (roi) {
    var calc = function () {
      var rows = parseInt($('#roi-rows').value, 10);
      var price = parseFloat($('#roi-price').value);
      var cost = rows > 0 ? rows * 195 : NaN;
      $('#roi-cost').textContent = isFinite(cost) ? '$' + cost.toLocaleString('en-US') : '—';
      var acres = isFinite(cost) && price > 0 ? Math.ceil(cost / price) : NaN;
      $('#roi-acres').textContent = isFinite(acres) ? acres.toLocaleString('en-US') + ' acres' : 'Enter a corn price';
    };
    roi.addEventListener('input', calc);
    roi.addEventListener('submit', function (e) { e.preventDefault(); calc(); });
    calc();
  }

  /* Contact tabs (3g) */
  var tabs = $$('[role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        selectTab(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
      }
    });
  });
  function tabFromHash() { if (tabs.length && location.hash === '#distributor') selectTab($('#tab-distributor')); }
  tabFromHash();
  window.addEventListener('hashchange', tabFromHash);

  /* Inquiry forms (5a). There is no approved backend, so a valid submission is NOT
     sent anywhere: the visitor is told so plainly and the entries stay on screen. */
  $$('form.inquiry').forEach(function (form) {
    var summary = $('.form-summary', form), result = $('.form-result', form);
    var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
    function setErr(field, msg) {
      var wrap = field.closest('.field'), err = $('.err', wrap);
      wrap.classList.toggle('invalid', !!msg);
      err.textContent = msg ? '▲ ' + msg : '';
      err.hidden = !msg;
      if (field.setAttribute) {
        $$('input,select,textarea', wrap).forEach(function (el) {
          if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
        });
      }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      result.hidden = true;
      var errors = [];
      $$('[data-required]', form).forEach(function (el) {
        var msg = '';
        if (el.tagName === 'FIELDSET') {
          if (!$$('input:checked', el).length) msg = el.getAttribute('data-required');
        } else if (!el.value.trim()) {
          msg = el.getAttribute('data-required');
        } else if (el.type === 'email' && !emailOk(el.value.trim())) {
          msg = 'Enter a valid email address.';
        }
        setErr(el, msg);
        if (msg) errors.push(el);
      });
      if (errors.length) {
        summary.textContent = errors.length === 1 ? 'Please fix 1 field before sending.' : 'Please fix ' + errors.length + ' fields before sending.';
        summary.hidden = false;
        var first = errors[0].tagName === 'FIELDSET' ? $('input', errors[0]) : errors[0];
        first.focus();
        return;
      }
      summary.hidden = true;
      result.hidden = false;
      result.focus();
    });
    $$('input,select,textarea', form).forEach(function (el) {
      el.addEventListener('input', function () {
        var target = el.closest('fieldset[data-required]') || (el.hasAttribute('data-required') ? el : null);
        if (target && target.closest('.field').classList.contains('invalid')) {
          var ok = target.tagName === 'FIELDSET' ? $$('input:checked', target).length : (el.value.trim() && (el.type !== 'email' || emailOk(el.value.trim())));
          if (ok) setErr(target, '');
        }
      });
    });
  });
})();
