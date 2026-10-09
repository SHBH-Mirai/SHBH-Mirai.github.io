// cards.js: makes the site's cards interactive. Runs after site.js (which exposes window.Portfolio).
//   1. skill chips → filter projects, or list the projects that use that skill
//   2. certification badges flip to show the exam and what it covers
//   3. timeline chapters collapse/expand and link to their related projects
//   4. profile rows (industries, domains, interests) are clickable
//   5. a gentle tilt on cards for mouse users
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const projects = window.PROJECTS || [];
  const P = window.Portfolio;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!P) return;

  // Projects whose text mentions any of the keywords (case-insensitive).
  const textOf = (p) => [p.title, p.org, p.summary, ...(p.points || []), ...(p.tags || [])].join(' ').toLowerCase();
  const matching = (words) => projects.map((p, i) => ({ p, i })).filter(({ p }) => words.some((w) => textOf(p).includes(w.toLowerCase())));

  function goToProjects() { $('#projects').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }

  // ---------- popover: a small floating list of matching projects ----------
  const pop = document.createElement('div');
  pop.className = 'pop2 frame';
  pop.setAttribute('role', 'dialog');
  pop.hidden = true;
  document.body.appendChild(pop);
  let opener = null;
  function openPop(anchor, title, found, emptyText) {
    opener = anchor;
    pop.innerHTML = `<p class="pt">${esc(title)}</p>${found.length
      ? found.slice(0, 6).map(({ p, i }) => `<button type="button" data-open="${i}"><b>${esc(p.title)}</b><small>${esc(p.org)}</small></button>`).join('')
      : `<p class="pe">${esc(emptyText)}</p>`}`;
    pop.setAttribute('aria-label', title);
    pop.hidden = false;
    const r = anchor.getBoundingClientRect(), w = Math.min(320, innerWidth - 32);
    pop.style.width = `${w}px`;
    pop.style.left = `${Math.max(16, Math.min(r.left + scrollX, scrollX + innerWidth - w - 16))}px`;
    pop.style.top = `${r.bottom + scrollY + 8}px`;
    (pop.querySelector('button') || pop).focus({ preventScroll: true });
  }
  function closePop(restore = true) { if (pop.hidden) return; pop.hidden = true; if (restore && opener) opener.focus({ preventScroll: true }); opener = null; }
  pop.tabIndex = -1;
  pop.addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (!b) return; closePop(false); P.open(Number(b.dataset.open)); goToProjects(); });
  document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target) && e.target !== opener && !opener?.contains(e.target)) closePop(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closePop(); });
  addEventListener('resize', () => closePop(false));

  // ---------- 1. skill chips ----------
  const SKILL_TAG = { 'Power Apps (Canvas & model-driven)': 'Canvas App', 'Power Automate': 'Power Automate', 'SharePoint Online': 'SharePoint', Dataverse: 'Dataverse', 'Dynamics 365 CE (Sales, Customer Service, PSA)': 'Dynamics 365', 'Custom connectors & REST APIs': 'Custom Connector', 'Power BI': 'Power BI', 'AI Builder': 'AI Builder', 'Copilot & LLM-assisted delivery': 'Copilot', 'Power Fx': 'Canvas App', 'Delegation-safe app design': 'Canvas App', 'Business process flows': 'Dynamics 365' };
  const SKILL_WORDS = { 'Requirements & stakeholder mapping': ['requirement', 'stakeholder', 'mapping'], 'Solution ALM': ['alm', 'solution'], 'Azure Logic Apps': ['logic app'], 'JavaScript / TypeScript': ['javascript', 'typescript'], React: ['react'], SQL: ['sql'] };
  $('#skills')?.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-skill]');
    if (!chip) return;
    const skill = chip.dataset.skill;
    if (SKILL_TAG[skill]) { closePop(false); P.filter(SKILL_TAG[skill]); goToProjects(); return; }
    const words = SKILL_WORDS[skill] || [skill];
    const group = chip.closest('.skill-group')?.querySelector('h3')?.textContent || '';
    openPop(chip, skill, matching(words), group === 'Exploring' ? 'Learning this now. No featured project uses it yet.' : 'Used across many of these projects rather than in one specific app.');
  });

  // ---------- 2. certification badges flip ----------
  $('#ach')?.addEventListener('click', (e) => {
    const badge = e.target.closest('.badge');
    if (!badge) return;
    const flipped = badge.getAttribute('aria-pressed') !== 'true';
    badge.setAttribute('aria-pressed', flipped);
  });

  // ---------- 3. timeline chapters ----------
  $$('.chap').forEach((chap, n) => {
    const head = chap.querySelector('h3');
    const list = chap.querySelector('ul');
    const words = (chap.dataset.rel || '').split('|').filter(Boolean);
    const related = words.length ? matching(words) : [];
    if (related.length) {
      chap.insertAdjacentHTML('beforeend', `<div class="rel"><span>Related projects</span>${related.map(({ p, i }) => `<button type="button" data-open="${i}">${esc(p.title)}</button>`).join('')}</div>`);
    }
    if (!list) return;
    list.id = list.id || `chap-list-${n}`;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'chev';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-controls', list.id);
    toggle.setAttribute('aria-label', `Show or hide details for ${head.textContent}`);
    chap.appendChild(toggle);
    toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', open); chap.classList.toggle('shut', !open); });
  });
  $('#map')?.addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (!b) return; P.open(Number(b.dataset.open)); goToProjects(); });

  // ---------- 4. profile rows ----------
  $('.attrs')?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-find],[data-play]');
    if (!b) return;
    if (b.hasAttribute('data-play')) { $('#playBtn')?.click(); return; }
    const words = b.dataset.find.split('|');
    openPop(b, b.textContent.trim(), matching(words), 'No featured project in this area yet.');
  });

  // ---------- 5. gentle tilt for mouse users ----------
  if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.chap, .panel, #home .card').forEach((card) => {
      let raf = 0;
      card.addEventListener('pointermove', (e) => {
        if (!card.classList.contains('in') && card.classList.contains('rv')) return; // wait until it has revealed
        const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { card.style.setProperty('--ry', `${(x * 5).toFixed(2)}deg`); card.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`); card.classList.add('tilt'); });
      });
      card.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); card.classList.remove('tilt'); });
    });
  }
})();
