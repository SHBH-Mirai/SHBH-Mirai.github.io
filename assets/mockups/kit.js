// kit.js: a tiny engine for interactive app mockups (think of it as a mini "canvas app player").
// Each mockup in apps.js describes: device, colours, navigation, screens (functions returning HTML) and actions.
//
//   screen(ctx) returns HTML           → like a Power Apps screen
//   data-go="screenId"                 → like Navigate(Screen)
//   data-act="name" data-x="…"         → like an OnSelect formula: runs app.actions.name(ctx, dataset, element)
//   data-in="name"                     → like OnChange on an input: runs app.inputs.name(ctx, value, element)
//   ctx.state                          → like context variables (UpdateContext)
//   ctx.patch(selector, html)          → redraw just one part (keeps the cursor in text boxes)
//   ctx.cancel()                       → stop any timed demo steps still waiting (call before re-running a demo)
//
// Note: the ui.* helpers trust their inputs (some take icon HTML). Only pass your own text, never what a visitor typed,
// unless you wrap it in ui.esc() first.
window.MockKit = (() => {
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- icons (simple 24×24 line icons) ----------
  const P = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    swap: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c.8-3.5 3.5-5 7-5s6.2 1.5 7 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.4 2.2 4 5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    doc: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    folder: '<path d="M3 6h7l2 2h9v11H3z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    car: '<path d="M5 16l1.5-5h11L19 16M4 16h16v3H4zM7 19v2M17 19v2"/><circle cx="7.5" cy="16.5" r=".5"/>',
    desk: '<path d="M3 9h18M5 9v11M19 9v11M9 9V5h6v4"/>',
    flow: '<rect x="3" y="3" width="7" height="6" rx="1"/><rect x="14" y="15" width="7" height="6" rx="1"/><path d="M6.5 9v4a2 2 0 0 0 2 2H14"/>',
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
    star: '<path d="M12 3l2.8 6 6.2.6-4.7 4.2 1.4 6.2L12 16.8 6.3 20l1.4-6.2L3 9.6 9.2 9z"/>',
    truck: '<path d="M2 6h11v10H2zM13 10h5l3 3v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    scan: '<path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M7 8v8M10 8v8M13 8v8M17 8v8"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    paint: '<path d="M4 20c2 0 3-1 3-3s1-3 3-3l9-9-3-3-9 9c0 2-1 3-3 3s-3 1-3 3z"/>',
    flask: '<path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 19l-6-10V3"/>',
    tool: '<path d="M14 6a4 4 0 0 0 5 5l-9 9-3-3 9-9a4 4 0 0 0-2-2z"/>'
  };
  const icon = (name) => `<svg class="mk-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.grid}</svg>`;

  // A small made-up trend line for a KPI, seeded from its label so it stays the same on every render.
  function spark(label, value) {
    let seed = [...label].reduce((a, ch) => a + ch.charCodeAt(0), 0);
    const pts = Array.from({ length: 7 }, (_, i) => { seed = (seed * 9301 + 49297) % 233280; return i === 6 ? 1 : 0.35 + (seed / 233280) * 0.6; });
    const path = pts.map((p, i) => `${i ? 'L' : 'M'}${i * 20} ${30 - p * 26}`).join(' ');
    const prev = Math.max(0, Math.round(value * pts[5]));
    return `<span class="mk-spark"><svg viewBox="0 0 120 32" aria-hidden="true"><path d="${path}"/></svg><em>Last week ${prev} · now ${value}</em></span>`;
  }

  // ---------- reusable building blocks (each returns HTML) ----------
  const ui = {
    esc, icon,
    tiles: (items, cols = 3) => `<div class="mk-tiles" style="--cols:${cols}">${items.map((t) =>
      `<button type="button" class="mk-tile" ${t.go ? `data-go="${t.go}"` : ''} ${t.act ? `data-act="${t.act}"` : ''} ${t.data ? Object.entries(t.data).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ') : ''}>${icon(t.icon)}${esc(t.label)}${t.sub ? `<small>${esc(t.sub)}</small>` : ''}</button>`).join('')}</div>`,
    chip: (text, tone = '') => `<span class="mk-chip ${tone}">${esc(text)}</span>`,
    btn: (label, act, kind = '', data = {}) => `<button type="button" class="mk-btn ${kind}" data-act="${act}" ${Object.entries(data).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ')}>${label}</button>`,
    go: (label, screen, kind = '') => `<button type="button" class="mk-btn ${kind}" data-go="${screen}">${label}</button>`,
    field: (label, control, full = false) => `<label class="mk-field${full ? ' full' : ''}">${esc(label)}${control}</label>`,
    input: (name, value = '', type = 'text', extra = '') => `<input type="${type}" data-in="${name}" value="${esc(value)}" ${extra}>`,
    select: (name, options, value) => `<select data-in="${name}">${options.map((o) => `<option${o === value ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`,
    search: (name, value = '', placeholder = 'Search') => `<div class="mk-search">${icon('search')}<input type="search" data-in="${name}" value="${esc(value)}" placeholder="${esc(placeholder)}" aria-label="${esc(placeholder)}"></div>`,
    filters: (act, options, current) => `<div class="mk-filters">${options.map((o) => `<button type="button" data-act="${act}" data-v="${esc(o)}" aria-pressed="${o === current}">${esc(o)}</button>`).join('')}</div>`,
    // Built-in interactivity (data-kit): rows select, KPIs open a trend, bars and donut slices highlight.
    table: (cols, rows) => `<table class="mk-table"><thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr data-kit="row" tabindex="0" aria-selected="false">${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`,
    kpis: (items, cols) => `<div class="mk-kpis" style="--cols:${cols || items.length}">${items.map((k) => `<button type="button" class="mk-kpi" data-kit="kpi" aria-expanded="false"><b>${esc(k.value)}</b><small>${esc(k.label)}</small>${spark(k.label, Number(k.value) || 0)}</button>`).join('')}</div>`,
    bars: (data, color) => {
      const max = Math.max(...data.map((d) => d.value), 1);
      return `<div class="mk-bars">${data.map((d, n) => `<button type="button" class="mk-bar-col" data-kit="bar" data-label="${esc(d.label)}" data-value="${esc(d.value)}" aria-label="${esc(d.label)}: ${esc(d.value)}"><b>${esc(d.value)}</b><i style="height:${(d.value / max) * 100}%;--n:${n};${color ? `background:${color}` : ''}"></i></button>`).join('')}</div><div class="mk-bar-labels">${data.map((d) => `<span>${esc(d.label)}</span>`).join('')}</div>`;
    },
    donut: (data) => {
      const total = data.reduce((a, d) => a + d.value, 0) || 1, c = 2 * Math.PI * 40;
      let offset = 0;
      const rings = data.map((d) => { const len = (d.value / total) * c; const s = `<circle data-seg="${data.indexOf(d)}" r="40" cx="55" cy="55" stroke="${d.color}" stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-offset}"></circle>`; offset += len; return s; }).join('');
      return `<div class="mk-donut"><svg viewBox="0 0 110 110" aria-hidden="true">${rings}</svg><div class="mk-legend">${data.map((d, n) => `<button type="button" data-kit="seg" data-n="${n}" aria-pressed="false"><i style="background:${d.color}"></i>${esc(d.label)}: <b>${d.value}</b> <small>${Math.round((d.value / total) * 100)}%</small></button>`).join('')}</div></div>`;
    },
    kv: (pairs) => `<dl class="mk-kv">${pairs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`,
    progress: (fraction) => `<div class="mk-progress"><i style="transform:scaleX(${Math.max(0, Math.min(1, fraction))})"></i></div>`,
    // flow: steps [{name, icon}] ; status array of '' | 'run' | 'done' | 'skip'
    flow: (steps, status = []) => steps.map((s, i) => (Array.isArray(s)
      ? `<div class="mk-branch">${s.map((b, j) => `<div class="mk-step ${status[i]?.[j] || ''}">${icon(b.icon)}${esc(b.name)}</div>`).join('')}</div>`
      : `<div class="mk-step ${status[i] || ''}">${icon(s.icon)}${esc(s.name)}</div>`)).join('<div class="mk-arrow"></div>'),
    calendar: (year, month, events, selected) => {
      const first = new Date(year, month, 1).getDay(), days = new Date(year, month + 1, 0).getDate();
      const heads = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<span>${d}</span>`).join('');
      const blanks = Array.from({ length: first }, () => '<i></i>').join('');
      const cells = Array.from({ length: days }, (_, k) => { const d = k + 1; return `<button type="button" data-act="pickDay" data-d="${d}" class="${events[d] ? 'has' : ''}" aria-pressed="${d === selected}">${d}</button>`; }).join('');
      return `<div class="mk-cal">${heads}${blanks}${cells}</div>`;
    }
  };

  // ---------- the player ----------
  function mount(container, app) {
    const state = JSON.parse(JSON.stringify(app.state || {}));
    const timers = [];
    let screen = app.start;
    const history = [];
    const colours = Object.entries(app.theme || {}).map(([k, v]) => `--mk-${k}:${v}`).join(';');
    const navHtml = (app.nav || []).map((n) => `<button type="button" data-nav="${n.go}" aria-label="${esc(n.label)}" title="${esc(n.label)}">${icon(n.icon)}${app.device === 'phone' ? esc(n.label) : ''}</button>`).join('');
    const nav = app.nav ? (app.device === 'phone' ? `<div class="mk-tabbar" role="navigation" aria-label="App menu">${navHtml}</div>` : `<div class="mk-rail" role="navigation" aria-label="App menu">${navHtml}</div>`) : '';
    // "Exact" apps (app.size = [width, height]) are drawn at the screenshot's real pixel size and scaled to fit,
    // with their own header/menus and their own CSS (app.css, scoped under app.cls).
    const exact = Array.isArray(app.size);
    if (exact && app.css && !document.getElementById(`mkcss-${app.cls}`)) {
      const style = document.createElement('style'); style.id = `mkcss-${app.cls}`; style.textContent = app.css; document.head.appendChild(style);
    }
    container.innerHTML = exact ? `
      <div class="mk mk-exact mk-${app.device || 'desktop'}" style="${colours}">
        <div class="mk-stage ${app.cls}" style="width:${app.size[0]}px;height:${app.size[1]}px"><div class="mk-body" role="region" tabindex="-1" aria-label="${esc(app.title)} screen"></div></div>
        <div class="mk-toast" role="status" aria-live="polite"></div>
        <button type="button" class="mk-expand" data-expand aria-label="Expand mockup to full screen" title="Expand">⤢</button>
      </div>` : `
      <div class="mk mk-${app.device || 'desktop'}" style="${colours}">
        <div class="mk-bar"><span class="mk-dots" aria-hidden="true"><i></i><i></i><i></i></span><button type="button" class="mk-back" data-back aria-label="Back" hidden>‹</button><span class="mk-title">${esc(app.title)}</span><span class="mk-user" aria-hidden="true">${esc(app.user || 'SD')}</span></div>
        <div class="mk-main">${app.device === 'phone' ? '' : nav}<div class="mk-body" role="region" tabindex="-1" aria-label="${esc(app.title)} screen"></div></div>
        ${app.device === 'phone' ? nav : ''}
        <div class="mk-toast" role="status" aria-live="polite"></div>
      </div>`;
    const body = container.querySelector('.mk-body');
    const toastEl = container.querySelector('.mk-toast');
    const backBtn = container.querySelector('.mk-bar [data-back]');
    const frame = container.querySelector('.mk');
    const stage = container.querySelector('.mk-stage');
    // Scale the native-size stage to the frame width (or to the whole screen when expanded).
    function fit() {
      if (!exact) return;
      const [w, h] = app.size;
      const full = frame.classList.contains('mk-full');
      const scale = full ? Math.min(innerWidth * 0.96 / w, innerHeight * 0.9 / h) : frame.clientWidth / w;
      stage.style.transform = full ? `translate(${(innerWidth - w * scale) / 2}px, ${(innerHeight - h * scale) / 2}px) scale(${scale})` : `scale(${scale})`;
      if (!full) frame.style.height = `${h * scale}px`;
    }
    const resizer = exact ? new ResizeObserver(fit) : null;
    if (resizer) { resizer.observe(frame); addEventListener('resize', fit); fit(); }
    // Full screen moves the frame to <body>, so no transformed ancestor (scroll reveals) can trap position:fixed.
    function toggleFull(on) {
      if (on) document.body.appendChild(frame); else container.appendChild(frame);
      frame.classList.toggle('mk-full', on);
      document.body.style.overflow = on ? 'hidden' : '';
      const b = frame.querySelector('[data-expand]'); b.textContent = on ? '✕' : '⤢'; b.setAttribute('aria-label', on ? 'Close full screen' : 'Expand mockup to full screen');
      b.focus({ preventScroll: true });
      fit();
    }
    const onKey = (e) => { if (e.key === 'Escape' && frame.classList.contains('mk-full')) toggleFull(false); };
    addEventListener('keydown', onKey);

    const ctx = {
      state, ui,
      go(id, remember = true) { if (remember && id !== screen) history.push(screen); screen = id; render(); body.scrollTop = 0; },
      back() { if (history.length) { screen = history.pop(); render(); } },
      render,
      patch(selector, html) { const el = body.querySelector(selector); if (el) el.innerHTML = html; },
      toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove('on'), 2200); },
      later(fn, ms) { timers.push(setTimeout(fn, ms)); },
      cancel() { timers.forEach(clearTimeout); timers.length = 0; }
    };
    // Remember which button had keyboard focus so it can be focused again after the redraw.
    const focusKey = (el) => (el && frame.contains(el) ? ['act', 'go', 'nav', 'i', 'v', 'k', 'd', 'in'].map((k) => el.dataset?.[k] || '').join('|') : null);
    function render() {
      const before = focusKey(document.activeElement);
      body.innerHTML = `<div class="mk-screen">${app.screens[screen](ctx)}</div>`;
      frame.querySelectorAll('[data-nav]').forEach((b) => {
        if ((app.navMap?.[screen] || screen) === b.dataset.nav) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
      if (before) {
        const again = [...frame.querySelectorAll('button,input,select,textarea')].find((el) => focusKey(el) === before);
        (again || body).focus({ preventScroll: true });
      }
      if (backBtn) backBtn.hidden = !history.length || !!(app.nav || []).find((n) => n.go === screen);
    }
    frame.addEventListener('click', (e) => {
      const t = e.target.closest('[data-go],[data-act],[data-nav],[data-back],[data-expand]');
      if (!t || !frame.contains(t)) { kit(e.target.closest('[data-kit]')); return; }
      if (t.hasAttribute('data-expand')) toggleFull(!frame.classList.contains('mk-full'));
      else if (t.hasAttribute('data-back')) ctx.back();
      else if (t.dataset.nav) { history.length = 0; ctx.go(t.dataset.nav, false); }
      else if (t.dataset.go) ctx.go(t.dataset.go);
      else if (app.actions?.[t.dataset.act]) app.actions[t.dataset.act](ctx, t.dataset, t);
    });
    // Built-in card behaviours that every mockup gets for free (no app code needed).
    function kit(el) {
      if (!el || !frame.contains(el)) return;
      const k = el.dataset.kit;
      if (k === 'kpi') { const open = el.getAttribute('aria-expanded') !== 'true'; el.setAttribute('aria-expanded', open); }
      else if (k === 'bar') { el.parentElement.querySelectorAll('.sel').forEach((x) => x !== el && x.classList.remove('sel')); el.classList.toggle('sel'); if (el.classList.contains('sel')) ctx.toast(`${el.dataset.label}: ${el.dataset.value}`); }
      else if (k === 'seg') { const root = el.closest('.mk-donut'), n = el.dataset.n, on = root.dataset.hl !== n; root.dataset.hl = on ? n : ''; root.querySelectorAll('[data-kit=seg]').forEach((b) => b.setAttribute('aria-pressed', on && b === el)); root.querySelectorAll('circle').forEach((ci) => ci.classList.toggle('dim', on && ci.dataset.seg !== n)); }
      else if (k === 'row') { const was = el.getAttribute('aria-selected') === 'true'; el.parentElement.querySelectorAll('tr').forEach((r) => r.setAttribute('aria-selected', 'false')); el.setAttribute('aria-selected', !was); if (!was) ctx.toast(`Selected ${el.cells[0].textContent}`); }
    }
    frame.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('tr[data-kit]')) { e.preventDefault(); kit(e.target); } });
    frame.addEventListener('input', (e) => {
      const t = e.target.closest('[data-in]');
      if (t && app.inputs?.[t.dataset.in]) app.inputs[t.dataset.in](ctx, t.value, t);
    });
    render();
    return { destroy() {
      timers.forEach(clearTimeout); clearTimeout(toastEl._t);
      if (resizer) { resizer.disconnect(); removeEventListener('resize', fit); }
      removeEventListener('keydown', onKey);
      if (frame.classList.contains('mk-full')) document.body.style.overflow = '';
      frame.remove(); container.innerHTML = '';
    } };
  }

  return { mount, ui, icon, esc };
})();
