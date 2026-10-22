const SPEED_FACTOR = 1.6; 

(() => {
  const header = document.querySelector('.site-header');
  const getOffset = () => (header ? header.getBoundingClientRect().height + 30 : 0);

  const scrollToTarget = (el) => {
    const top = el.getBoundingClientRect().top + window.pageYOffset - getOffset();
    window.scrollTo({ top, behavior: 'smooth' });
  };

  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) scrollToTarget(target);
      }
    });
  });
})();

(() => {
  const paras = document.querySelectorAll('.scroll-fill');
  if (!paras.length) return;

  const datasets = [...paras].map(p => {
    const original = p.textContent.trim();
    p.setAttribute('aria-label', original);
    p.textContent = '';

    const tokens = original.match(/\S+/g) || [];
    const words = [];
    tokens.forEach((tok, i) => {
      const s = document.createElement('span');
      s.className = 'word';
      s.textContent = tok;
      s.style.color = '#c9c9c9';
      p.appendChild(s);
      words.push(s);
      if (i < tokens.length - 1) p.appendChild(document.createTextNode(' '));
    });

    return { el: p, words };
  });

  const clamp01 = n => Math.min(1, Math.max(0, n));
  const update = () => {
    datasets.forEach(({ el, words }) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      let prog = (vh - rect.top) / (vh + rect.height); 
      prog = clamp01(prog * SPEED_FACTOR);

      const total = words.length;
      const active = Math.floor(prog * total);
      for (let i = 0; i < total; i++) {
        words[i].style.color = i < active ? '#000' : '#c9c9c9';
      }
    });
  };

  const onScroll = () => requestAnimationFrame(update);
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
})();

(() => {
  const els = document.querySelectorAll('.word-fill');
  if (!els.length) return;

  const datasets = [...els].map(el => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const chars = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === ' ') { el.appendChild(document.createTextNode(' ')); continue; }
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      s.style.color = '#c9c9c9';
      el.appendChild(s);
      chars.push(s);
    }
    return { el, chars };
  });

  const clamp01 = n => Math.min(1, Math.max(0, n));
  const update = () => {
    datasets.forEach(({ el, chars }) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      let p = (vh - r.top) / (vh + r.height);
      p = clamp01(p * SPEED_FACTOR);

      const n = Math.floor(p * chars.length);
      for (let i = 0; i < chars.length; i++) {
        chars[i].style.color = i < n ? '#000' : '#c9c9c9';
      }
    });
  };

  const onScroll = () => requestAnimationFrame(update);
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
})();

(() => {
  const headingBox = document.querySelector('.sw-heading');
  const firstRightFigure = document.querySelector('.selected-work .sw-col:nth-child(2) .sw-item');
  if (!headingBox || !firstRightFigure) return;

  const img = firstRightFigure.querySelector('.thumb');
  const cap = firstRightFigure.querySelector('figcaption');

  const sync = () => {
    const capStyles = cap ? getComputedStyle(cap) : null;
    const capH = cap ? cap.clientHeight : 0;
    const capMT = capStyles ? parseFloat(capStyles.marginTop) || 0 : 0;
    const imgH = img ? img.clientHeight : 0;
    const target = imgH + capH + capMT;
    headingBox.style.minHeight = target + 'px';
  };

  window.addEventListener('resize', sync);
  window.addEventListener('load', sync);
  if (img && !img.complete) img.addEventListener('load', sync, { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
  setTimeout(sync, 300);
})();
