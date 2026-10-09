// site.js: everything on the page that isn't 3D.
// Sections: 1 helpers · 2 theme · 3 menu · 4 boot screen · 5 hero · 6 skills · 7 certifications
//           8 projects · 9 lightbox · 10 reveal on scroll · 11 timeline line · 12 active nav tab
// It runs after projects.js and profile.js, which define window.PROJECTS, SKILLS and CERTS.
(() => {
  // ---------- 1. Helpers and settings ----------
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const root = document.documentElement;

  const TABLET = 980;                         // same as @media (max-width: 980px) in style.css
  const CAREER_START = new Date(2021, 1, 1);  // 1 Feb 2021 (JavaScript months start at 0)
  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = motionQuery.matches;
  motionQuery.addEventListener('change', (e) => { reduceMotion = e.matches; });

  // Browser storage can be blocked (private mode), so never let it crash the page.
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* ignore */ } }
  };

  // Makes text safe to put inside HTML (stops a quote or < from breaking the markup).
  const esc = (text) => String(text).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const projects = window.PROJECTS || [];
  const skills = window.SKILLS || [];
  const certs = window.CERTS || [];

  // ---------- 2. Theme (dark / light cards) ----------
  const modeButton = $('#mode');
  function setTheme(mode) {
    root.dataset.theme = mode;
    $('#modeTxt').textContent = mode === 'dark' ? 'Dark' : 'Light';
    modeButton.setAttribute('aria-pressed', String(mode === 'light'));
  }
  setTheme(store.get('theme') === 'light' ? 'light' : 'dark');
  modeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    store.set('theme', next);
  });

  // ---------- 3. Mobile menu ----------
  const menu = $('#tabs');
  const burger = $('#burger');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('#tabs a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ---------- 4. Boot screen (first-ever visit only; a tiny script in index.html removes it otherwise) ----------
  const boot = $('#boot');
  if (boot) {
    store.set('bootSeen', '1');
    const log = $('#bootlog');
    const bar = $('#bootbar');
    const lines = [['> shubham-dubey.portfolio', ''], ['> Loading profile ........... ', 'OK'], ['> Loading projects .......... ', 'OK'], ['> Ready', 'go']];
    let step = 0;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      boot.classList.add('done');
      setTimeout(() => boot.remove(), 600);
    };
    const next = () => {
      if (finished) return;
      if (step >= lines.length) { setTimeout(finish, 250); return; }
      const [text, status] = lines[step];
      log.innerHTML += status === 'go' ? `<span class="go">${text}</span>` : `${text}${status ? `<span class="ok">${status}</span>` : ''}\n`;
      step += 1;
      bar.style.transform = `scaleX(${step / lines.length})`;
      setTimeout(next, 170);
    };
    next();
    boot.addEventListener('click', finish);
    addEventListener('keydown', finish, { once: true });
  }

  // ---------- 5. Hero: live facts + typing line ----------
  $('#yrs').textContent = ((Date.now() - CAREER_START) / MS_PER_YEAR).toFixed(1);
  $('#nproj').textContent = projects.length;

  const typeLines = ['I turn manual processes into apps that run themselves.', 'Canvas & model-driven apps · Power Automate · D365 CE.', 'Currently exploring Copilot and LLM-assisted delivery.'];
  const typeBox = $('#type');
  if (reduceMotion) {
    typeBox.textContent = typeLines[0];
  } else {
    let line = 0, chars = 0, deleting = false;
    const tick = () => {
      const text = typeLines[line];
      typeBox.textContent = text.slice(0, chars);
      if (!deleting && chars < text.length) { chars += 1; setTimeout(tick, 38); }
      else if (!deleting) { deleting = true; setTimeout(tick, 2400); }
      else if (chars > 0) { chars -= 1; setTimeout(tick, 16); }
      else { deleting = false; line = (line + 1) % typeLines.length; setTimeout(tick, 300); }
    };
    tick();
  }

  // ---------- 6. Skills (grouped chips, from profile.js) ----------
  $('#skills').innerHTML = skills.map((g) => `
    <div class="skill-group">
      <h3>${esc(g.group)}</h3><p>${esc(g.note)}</p>
      <div class="perks">${g.items.map((s) => `<button type="button" class="perk" data-skill="${esc(s)}">${esc(s)}</button>`).join('')}</div>
    </div>`).join('');

  // ---------- 7. Certifications (from profile.js) ----------
  const icons = {
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/></svg>',
    app: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.8 5.5 21l2-7.5L2 9h7z"/></svg>'
  };
  $('#ach').innerHTML = certs.map((c) => `
    <button type="button" class="badge frame rv" style="--rar:${esc(c.color)}" aria-pressed="false" aria-label="${esc(c.title)}, ${esc(c.level)}. Show exam details">
      <span class="face front"><span class="hex" aria-hidden="true">${icons[c.icon] || icons.star}</span>
      <span class="bt">${esc(c.title)}</span><span class="r">${esc(c.level)}</span><span class="flip-hint" aria-hidden="true">Tap to flip</span></span>
      <span class="face back"><span class="r">Exam ${esc(c.exam || '')}</span><span class="cv">${esc(c.covers || '')}</span><span class="flip-hint" aria-hidden="true">Tap to flip back</span></span>
    </button>`).join('');

  // ---------- 8. Projects: filters, list, details ----------
  const imgPath = (name) => `assets/img/${name}.webp`;
  const filterBar = $('#qfil');
  const list = $('#qlist');
  const details = $('#qd');
  const layout = $('.qwrap');
  const narrow = matchMedia(`(max-width: ${TABLET}px)`);
  let activeTag = 'All';
  let selected = 0;   // index into projects
  let shot = 0;       // which screenshot is showing
  let view = 'mock';  // 'mock' (interactive recreation) or 'shots' (real screenshots)
  let mockPlayer = null;

  function renderFilters() {
    const tags = ['All', ...new Set(projects.flatMap((p) => p.tags))];
    filterBar.innerHTML = tags.map((t) =>
      `<button type="button" data-tag="${esc(t)}" aria-pressed="${t === activeTag}" class="${t === activeTag ? 'on' : ''}">${esc(t)}</button>`).join('');
  }

  // On phones the details card sits right under the tapped project; on wider screens it has its own column.
  function parkDetails() { if (details.parentElement !== layout) layout.appendChild(details); }
  function placeDetails() {
    const row = list.querySelector('.q.on');
    if (narrow.matches && row) { if (row.nextElementSibling !== details) row.after(details); }
    else parkDetails();
  }
  narrow.addEventListener('change', placeDetails);

  function renderList() {
    parkDetails(); // take the details card out before the list is rebuilt
    const visible = projects.map((p, i) => ({ p, i })).filter(({ p }) => activeTag === 'All' || p.tags.includes(activeTag));
    if (!visible.some((v) => v.i === selected)) selected = visible.length ? visible[0].i : 0;
    list.innerHTML = visible.map(({ p, i }) => `
      <button type="button" class="q${i === selected ? ' on' : ''}" data-i="${i}"${i === selected ? ' aria-current="true"' : ''}>
        <span class="rank" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span><span class="qn">${esc(p.title)}</span><span class="qo">${esc(p.org)}</span></span>
      </button>`).join('');
    renderDetails();
  }

  function renderDetails() {
    if (mockPlayer) { mockPlayer.destroy(); mockPlayer = null; }
    const p = projects[selected];
    if (!p) return;
    shot = 0;
    const mock = p.mock && window.MOCKUPS ? window.MOCKUPS[p.mock] : null;
    const showMock = mock && (view === 'mock' || !p.imgs.length);
    const tabs = mock && p.imgs.length
      ? `<div class="mk-tabs" role="tablist" aria-label="View">
           <button type="button" role="tab" data-view="mock" aria-selected="${showMock}">Interactive</button>
           <button type="button" role="tab" data-view="shots" aria-selected="${!showMock}">Real screenshots (${p.imgs.length})</button>
         </div>` : '';
    const label = mock && mock.basis === 'screens'
      ? 'Interactive recreation <span>· rebuilt from the real screens, sample data</span>'
      : 'Concept recreation <span>· designed from the project description, sample data</span>';
    const many = p.imgs.length > 1;
    const viewer = p.imgs.length
      ? `<div class="viewer">
           <button type="button" class="zoom" aria-label="Open screenshot full size"><img id="vimg" src="${imgPath(p.imgs[0])}" alt="${esc(p.title)}, screen 1 of ${p.imgs.length}"></button>
           ${many ? '<button type="button" class="nv l" data-step="-1" aria-label="Previous screenshot">‹</button><button type="button" class="nv r" data-step="1" aria-label="Next screenshot">›</button>' : ''}
           <span class="ct" id="vct">1 / ${p.imgs.length}</span>
         </div>
         ${many ? `<div class="thumbs">${p.imgs.map((n, k) => `<button type="button" class="th${k ? '' : ' on'}" data-shot="${k}" aria-label="Show screen ${k + 1}"><img src="${imgPath(n)}" alt=""></button>`).join('')}</div>` : ''}`
      : '<div class="nodata">Screenshots coming soon</div>';
    details.innerHTML = `
      <div class="top"><div class="meta"><span>Industry <b>${esc(p.org)}</b></span></div><h3>${esc(p.title)}</h3></div>
      ${tabs}
      ${showMock ? `<div class="mk-wrap"><p class="mk-label"><i></i>${label}</p><div id="mkHost"></div></div>` : viewer}
      <div class="body">
        <div><h4>Overview</h4><p>${esc(p.summary)}</p></div>
        <div><h4>Key features</h4><ul class="obj">${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="slots"><h4>Tech stack</h4>${p.tags.map((t) => `<span class="slot">${esc(t)}</span>`).join('')}</div>
      </div>`;
    if (showMock) mockPlayer = window.MockKit.mount($('#mkHost'), mock);
    placeDetails();
  }

  function showShot(index) {
    const p = projects[selected];
    const count = p.imgs.length;
    if (!count) return;
    shot = (index + count) % count;
    const img = $('#vimg');
    img.src = imgPath(p.imgs[shot]);
    img.alt = `${p.title}, screen ${shot + 1} of ${count}`;
    $('#vct').textContent = `${shot + 1} / ${count}`;
    $$('.thumbs .th').forEach((t, k) => t.classList.toggle('on', k === shot));
  }

  // Lets cards.js open a project or apply a filter from elsewhere on the page.
  window.Portfolio = {
    filter(tag) { activeTag = tag; renderFilters(); renderList(); },
    open(index) { if (!projects[index]) return; activeTag = 'All'; selected = index; view = 'mock'; renderFilters(); renderList(); }
  };

  filterBar.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    activeTag = button.dataset.tag;
    renderFilters();
    renderList();
  });

  list.addEventListener('click', (e) => {
    const row = e.target.closest('.q');
    if (!row || Number(row.dataset.i) === selected) return; // already open: keep the user's place
    selected = Number(row.dataset.i);
    view = 'mock';
    $$('.q').forEach((q) => {
      const on = q === row;
      q.classList.toggle('on', on);
      if (on) q.setAttribute('aria-current', 'true'); else q.removeAttribute('aria-current');
    });
    renderDetails();
    if (narrow.matches) row.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  details.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-view]');
    if (tab) { view = tab.dataset.view; renderDetails(); details.querySelector(`[data-view="${view}"]`)?.focus(); return; }
    const stepButton = e.target.closest('[data-step]');
    const thumb = e.target.closest('[data-shot]');
    const zoom = e.target.closest('.zoom');
    if (stepButton) showShot(shot + Number(stepButton.dataset.step));
    else if (thumb) showShot(Number(thumb.dataset.shot));
    else if (zoom) openLightbox(zoom);
  });

  // ---------- 9. Lightbox (full-size screenshot) ----------
  const lightbox = $('#lb');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = $('#lbx');
  let returnFocusTo = null;
  function openLightbox(opener) {
    const img = $('#vimg');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    returnFocusTo = opener;
    lightbox.classList.add('on');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }
  function closeLightbox() {
    if (!lightbox.classList.contains('on')) return;
    lightbox.classList.remove('on');
    document.body.style.overflow = '';
    if (returnFocusTo) returnFocusTo.focus();
  }
  lightbox.addEventListener('click', (e) => { if (e.target !== lightboxImg) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('on')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'Tab') { e.preventDefault(); lightboxClose.focus(); } // keep focus inside the dialog
  });

  renderFilters();
  renderList();

  // ---------- 10. Reveal sections as they scroll into view ----------
  const revealer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    revealer.unobserve(entry.target);
  }), { threshold: 0.12 });
  $$('.rv').forEach((el) => revealer.observe(el));

  // ---------- 11. Timeline line draws as you scroll ----------
  const timeline = $('#map');
  const timelineLine = $('#mapLine');
  function drawTimeline() {
    const box = timeline.getBoundingClientRect();
    const progress = Math.min(Math.max((innerHeight * 0.7 - box.top) / box.height, 0), 1);
    timelineLine.setAttribute('y2', String(progress * box.height));
  }

  // ---------- 12. Highlight the nav tab for the section on screen ----------
  const tabs = $$('#tabs a');
  const sections = tabs.map((a) => document.querySelector(a.getAttribute('href')));
  function updateActiveTab() {
    const y = scrollY + innerHeight * 0.35;
    let current = sections[0];
    sections.forEach((s) => { if (s && s.offsetTop <= y) current = s; });
    tabs.forEach((a) => {
      const on = a.getAttribute('href') === `#${current.id}`;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  // One scroll handler, run at most once per frame.
  let frameQueued = false;
  function onScroll() {
    if (frameQueued) return;
    frameQueued = true;
    requestAnimationFrame(() => { frameQueued = false; updateActiveTab(); drawTimeline(); });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
