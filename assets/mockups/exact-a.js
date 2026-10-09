// exact-a.js: pixel-faithful recreations of apps that have real screenshots (part 1: Inventory, My Expense).
// Each app is drawn at the screenshot's native size (app.size) and scaled to fit by kit.js.
// Brand names, logos and company details stay hidden, exactly as in the cleaned screenshots. All records are sample data.
(() => {
  const M = window.MOCKUPS;
  const e = window.MockKit.esc;

  // ── shared bits for the Inventory app ──
  const sv = (body, size = 22) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const W = '#e6e6e6', R = '#e8333a';
  const BIG = { // large dashboard icons (white line art with red accents), 120×120
    checkin: `<path d="M22 30 L60 14 L98 30 V104 H22Z M22 30 H98" stroke="${W}"/><path d="M48 52h26l-8-8M74 74H48l8 8" stroke="${R}"/>`,
    manage: `<path d="M18 24v86M102 24v86M18 50h84M18 80h84M18 108h84" stroke="${W}"/><path d="M26 74V60h16v14M48 74V56h14v18M68 74V64h14v10M84 44V24h16v20M62 44V34h18v10M26 104V90h18v14M52 104V96h16v8M72 104V86h16v18" stroke="${R}"/>`,
    jobs: `<path d="M18 74h30v36H18zM48 74h30v36H48zM33 40h30v34H33zM72 14h30v30H72z" stroke="${W}"/><path d="M70 48L56 62M56 52v10h10" stroke="${R}"/>`,
    trans: `<path d="M22 30 L56 16 L90 30 V104 H22Z M22 30H90" stroke="${W}"/><path d="M34 54h22l-6-6M56 74H34l6 6" stroke="${R}"/><circle cx="88" cy="74" r="20" stroke="${R}"/><path d="M93 66h-7a4 4 0 0 0 0 8h4a4 4 0 0 1 0 8h-8M88 62v4M88 82v4" stroke="${W}"/>`,
    reports: `<path d="M30 14h50l10 10v86H30z" stroke="${W}"/><path d="M38 20h50v86" stroke="${W}"/><path d="M40 56l12-12 10 10 10-14 10 10" stroke="${R}"/><path d="M44 92V80M52 92V74M60 92V82M68 92V76M76 92V84" stroke="${W}"/>`,
    admin: `<path d="M22 30 L60 14 L98 30 V104 H22Z M22 30H98" stroke="${W}"/><circle cx="60" cy="56" r="13" stroke="${R}"/><path d="M38 104c2-14 10-22 22-22s20 8 22 22" stroke="${R}"/>`,
    create: `<rect x="26" y="14" width="56" height="80" rx="3" stroke="${W}" fill="#e6e6e6" fill-opacity=".15"/><path d="M36 30h30M36 42h30M36 54h20" stroke="${W}"/><rect x="58" y="62" width="30" height="30" rx="2" fill="${R}" stroke="${R}"/><path d="M73 69v16M65 77h16" stroke="#fff" stroke-width="5"/>`,
    current: `<rect x="26" y="14" width="56" height="80" rx="3" stroke="${W}" fill="#e6e6e6" fill-opacity=".15"/><path d="M36 30h6M48 30h24M36 44h6M48 44h24M36 58h6M48 58h20" stroke="${W}"/><rect x="34" y="27" width="8" height="6" fill="${R}" stroke="none"/><circle cx="76" cy="78" r="11" stroke="${R}" stroke-width="5"/><path d="M84 86l10 10" stroke="${R}" stroke-width="5"/>`,
    records: `<path d="M18 40 L52 22 L86 40 V82 L52 100 L18 82Z M18 40 L52 58 L86 40 M52 58V100" stroke="#111" stroke-width="5"/><path d="M28 56l14 7" stroke="#4a6680" stroke-width="5"/><circle cx="86" cy="80" r="16" stroke="${R}" stroke-width="5"/><path d="M98 92l12 12" stroke="${R}" stroke-width="6"/>`
  };
  const big = (k, s = 116) => `<svg width="${s}" height="${s}" viewBox="0 0 120 120" fill="none" stroke-width="4" stroke-linejoin="miter" aria-hidden="true">${BIG[k]}</svg>`;
  // real product photos, cut from the screenshot (inv-mgmt.webp is 1233 px wide)
  const PH = { chips: [282, 112, 179, 164], buckets: [848, 105, 169, 179], pads: [282, 401, 179, 162] };
  const photo = (k, w) => { const [x, y, cw, ch] = PH[k]; const s = w / cw; return `<span class="pho" style="width:${w}px;height:${Math.round(ch * s)}px;background-size:${1233 * s}px auto;background-position:-${x * s}px -${y * s}px"></span>`; };

  const ICON = { // small rail icons
    box: sv('<path d="M5 8l7-4 7 4v11H5z"/><path d="M9 11h6M9 14h6"/>'),
    shelf: sv('<path d="M4 4v16M20 4v16M4 10h16M4 16h16"/>'),
    jobs: sv('<path d="M4 13h6v7H4zM10 13h6v7h-6zM7 6h6v7H7zM15 3h5v5h-5z"/>'),
    trans: sv('<path d="M4 7l7-3 7 3v12H4z"/><circle cx="17" cy="15" r="4"/>'),
    rep: sv('<path d="M6 3h10l3 3v15H6z"/><path d="M8 13l3-3 2 2 3-4"/>'),
    admin: sv('<path d="M4 8l8-4 8 4v12H4z"/><circle cx="12" cy="11" r="2.5"/><path d="M8 19c.5-3 2-4 4-4s3.5 1 4 4"/>'),
    sheet: sv('<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 10h6"/><path d="M13 15h5v5h-5z"/>'),
    find: sv('<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 10h4"/><circle cx="15" cy="16" r="2.5"/>'),
    net: sv('<circle cx="12" cy="12" r="2"/><circle cx="5" cy="6" r="1.5"/><circle cx="19" cy="6" r="1.5"/><circle cx="5" cy="18" r="1.5"/><circle cx="19" cy="18" r="1.5"/><path d="M6 7l4.5 4M18 7l-4.5 4M6 17l4.5-4M18 17l-4.5-4"/>')
  };
  const RAIL_MAIN = [['box', 'checkout'], ['shelf', 'manage'], ['jobs', 'jobs'], ['trans', 'trans'], ['rep', 'reports'], ['admin', 'admin']];
  const RAIL_CAT = [['chips', 'colors'], ['buckets', 'chemicals'], ['pads', 'supplies'], ['records', 'records'], ['net', 'admin']];
  const RAIL_JOB = [['sheet', 'picksheet'], ['find', 'picksheets'], ['jobs', 'jobs']];

  function shell(title, rail, active, content) {
    const items = rail === 'home'
      ? `<button class="ri cur" data-go="home" aria-label="Home">${sv('<rect x="4" y="9" width="16" height="10" rx="1"/><path d="M9 9V6h6v3M4 13h16"/>', 24)}</button>`
      : rail.map(([k, go]) => {
        const inner = PH[k] ? photo(k, 30) : k === 'records' ? big('records', 32) : ICON[k];
        return `<button class="ri${go === active ? ' cur' : ''}" ${go ? `data-go="${go}"` : 'data-act="soon"'} aria-label="${go || k}">${inner}</button>`;
      }).join('');
    return `<div class="hdr"><button class="hb" data-back aria-label="Back">‹</button><button class="hb" data-go="home" aria-label="Home">${sv('<path d="M4 11l8-6 8 6v9H4z"/>', 16)}</button><span class="brand" aria-hidden="true"></span><span class="ttl">${title}</span>
      <span class="usr"><span class="av">SA</span><span class="pw">${sv('<path d="M12 3v8M7 6a7 7 0 1 0 10 0"/>', 16)}</span></span></div>
      <div class="rail"><span class="ham"><i></i><i></i><i></i></span>${items}<span class="tog"></span></div><div class="main">${content}</div>`;
  }
  const tile = (k, ttl, desc, go) => `<button class="tile" ${go ? `data-go="${go}"` : 'data-act="soon"'}>${big(k)}<b>${ttl}</b><small>${desc}</small></button>`;
  const catalog = (title, active, field, priceLabel, items, c) => shell(`${title} Management`, RAIL_CAT, active, `
    <div class="cat"><div class="lp"><input class="srch" placeholder="Search here..." data-in="q" value="${e(c.state.q)}" aria-label="Search"><div class="tools"><button class="tb cur">${sv('<path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/>', 18)}</button><button class="tb">${sv('<path d="M9 6h11M9 12h8M9 18h11M4 6h1M4 12h1M4 18h1"/>', 18)}</button><button class="new" data-act="newItem">＋ New</button></div>
      ${active === 'colors' ? '<div class="hd">Product</div>' : ''}<div class="items" data-list>${catItems(items, c.state.q)}</div></div>
      <div class="rp"><label><span class="req">*</span>${field}<input id="xiName"></label><label>${priceLabel}<input id="xiPrice" value="$" ></label><label>${field.replace(' Type', '')} Category<input id="xiCat"></label>
      <div class="sc"><button data-act="save">${sv('<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7"/>', 14)} Save</button><button data-act="cancel">✕ Cancel</button></div></div></div>`);
  const catItems = (items, q) => items.filter((x) => x.toLowerCase().includes((q || '').toLowerCase())).map((x) => `<button class="it" data-act="pickItem" data-v="${e(x)}">${e(x)}</button>`).join('');
  const priceOf = (x) => ([...x].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 900) / 100 + 2.5;

  M.inventory = {
    basis: 'screens', device: 'tablet', title: 'Inventory', cls: 'xi', size: [1229, 690], start: 'home',
    state: {
      q: '',
      cards: [{ code: 'MKE-003', chem: 'XP 275 Gray Extreme', w: 9069, s: 'out', jobs: ['U R Cow', 'U R Cow', ''] }, { code: 'FtW-001', chem: 'Oil Stop Primer', w: 4569, s: 'in', jobs: null }, { code: 'MKE-002', chem: 'Clear Topcoat', w: 3120, s: 'in', jobs: null }],
      colors: ['Crimson Blood Red', 'Turquoise Hybrid', 'Anchorage Terrazzo A1', 'Trail Mix', 'Husky Terrazzo', 'Scarlett', 'Ruby', 'Bronze'],
      chemicals: ['XR 800', 'Dark Gray Tint', 'IHE 400', 'XP 275 B', 'Yellow Tint', 'Green Tint', 'Blue Tint', 'Red Tint', 'Black Tint'],
      supplies: ['Pulse-Bac 550 Replacement', '20 Amp Fuse Pack 1', 'S26 Conical LARGE', 'HEPA for S36/S26', 'Hose Cuff 1.5 Inch to 2 Inch Enlarger', 'S36 Conical LARGE', '2 Amp Fuse Pack', 'V20E-F-2 Conical', '1 Quart Bucket'],
      barcodes: ['MKE-003', 'FtW-001', 'MKE-002', 'MKE-004', 'FtW-002', 'FtW-005', 'FtW-003', 'FtW-004', 'APT-100'],
      sqft: 0, season: '', sheets: ['TJ-ID-003', 'TJ-ID-002', 'TJ-ID-001', 'U R Cow', 'In the  beninging'], tab: 'All', pick: 0, fc: 0, rtab: 'Quantity', waste: 5,
      reorder: [{ n: 'XP 275 B', q: 120, u: 'lb', on: 38, min: 60, st: 'Below minimum' }, { n: 'Crimson Blood Red', q: 50, u: 'lb', on: 12, min: 25, st: 'Below minimum' }, { n: 'S26 Conical LARGE', q: 6, u: 'pcs', on: 2, min: 4, st: 'Below minimum' }, { n: 'IHE 400', q: 80, u: 'lb', on: 71, min: 60, st: 'OK' }],
      usage: [[42, 55, 48, 61, 58, 66], [18, 22, 15, 26, 24, 29], [3, 2, 4, 3, 5, 4], [30, 28, 35, 31, 33, 36]],
      log: [['MKE-003 checked out to U R Cow', '2 h ago'], ['FtW-001 checked in (4569 lb)', 'yesterday'], ['Pick sheet TJ-ID-003 created', 'yesterday'], ['PO for Yellow Tint (40 lb) received', '3 days ago']],
      users: [{ n: 'Service Account', r: 'Admin' }, { n: 'Warehouse Lead', r: 'Manager' }, { n: 'Crew Tablet 1', r: 'Crew' }, { n: 'Crew Tablet 2', r: 'Crew' }],
      perms: { 'Crew can trash items': false, 'Auto-order below minimum': true, 'Email weekly stock report': true, 'Require job on check-out': true }
    },
    screens: {
      home: () => shell('Home Dashboard', 'home', '', `<div class="tiles">${tile('checkin', 'Inventory Check-In/Check-Out', 'Check-Out Colors &amp; Finishess, Chemicals, and Supplies for projects. Also Check-In items after the project.', 'checkout')}${tile('manage', 'Inventory Management', 'Add inventory, edit, search, export inventory.', 'manage')}${tile('jobs', 'Job Builder', 'Helps you build a materials list for each project.', 'jobs')}${tile('trans', 'Inventory Transactions', 'Automated inventory ordering, product usage forecasting, and inventory activity.', 'trans')}${tile('reports', 'Inventory Reports', 'Review inventory quantity, type, location, and historical data.', 'reports')}${tile('admin', 'Admin Center', 'Modify inventory calculations, user permissions, and system settings.', 'admin')}</div>`),
      checkout: (c) => shell('Inventory Check-In/Check-Out', RAIL_MAIN, 'checkout', `<div class="co"><div class="sbar"><input placeholder="Search here..." aria-label="Search"><button data-act="scan">Scan ▦</button></div><div class="cards">${c.state.cards.map((it, i) => `
        <div class="cc"><div class="chd"><span><b>Barcode</b>${e(it.code)}</span><span><b>Chemical</b>${e(it.chem)}</span></div>
        <div class="cb"><div class="st"><small>Select Item Status</small><div class="sb"><button class="out${it.s === 'out' ? ' sel' : ''}" data-act="status" data-i="${i}" data-v="out">Check Out</button><button class="in${it.s === 'in' ? ' sel' : ''}" data-act="status" data-i="${i}" data-v="in">Check In</button><button class="tr" data-act="trash" data-i="${i}">Trash</button></div></div>
        <label class="wt">Weight<input value="${it.w}" inputmode="numeric" data-in="wt" data-i="${i}"></label>
        ${it.jobs ? `<div class="jg">${it.jobs.map((j, k) => `<label>Job${it.edit ? `<select data-in="job" data-i="${i}" data-k="${k}" aria-label="Job">${['', 'U R Cow', 'TJ-ID-003', 'TJ-ID-002', 'TJ-ID-001'].map((o) => `<option${o === j ? ' selected' : ''}>${o}</option>`).join('')}</select>` : `<span>${e(j)}</span>`}</label>`).join('')}${it.jobs.map(() => '<label>User<span>Service Account</span></label>').join('')}</div>` : '<div class="jg"></div>'}
        <button class="ed${it.edit ? ' on2' : ''}" data-act="edit" data-i="${i}" aria-label="${it.edit ? 'Save changes' : 'Edit'}">${sv('<path d="M6 3h9l4 4v14H6z"/><path d="M10 15l5-5 2 2-5 5h-2z" stroke="#e8333a"/>', 18)}</button></div></div>`).join('')}</div></div>`),
      manage: () => shell('Inventory Management', RAIL_MAIN, 'manage', `<div class="tiles t2">
        <button class="tile" data-go="colors">${photo('chips', 179)}<b>Colors &amp; Finishes</b><small>Add, edit, and search color-chip SKUs.</small></button>
        <button class="tile" data-go="chemicals">${photo('buckets', 169)}<b>Chemicals</b><small>Manage epoxy, polyaspartic, and solvents inventory.</small></button>
        <button class="tile" data-go="supplies">${photo('pads', 179)}<b>Supplies</b><small>Consumables like rollers, tape, spikes, etc.</small></button>
        <button class="tile" data-go="records">${big('records', 170)}<b>Inventory Records</b><small>Historical inventory snapshots &amp; stock-on-hand ledger.</small></button></div>`),
      colors: (c) => catalog('Colors &amp; Finishes', 'colors', 'Colors &amp; Finishes', 'Price per pound', c.state.colors, c),
      chemicals: (c) => catalog('Chemicals', 'chemicals', 'Chemical Type', 'Price per pound', c.state.chemicals, c),
      supplies: (c) => catalog('Supplies', 'supplies', 'Supplies', 'Price per Item', c.state.supplies, c),
      trans: (c) => {
        const s = c.state, r = s.reorder[s.fc], u = s.usage[s.fc], mx = Math.max(...u);
        return shell('Inventory Transactions', RAIL_MAIN, 'trans', `<div class="tx"><div class="pnl"><h5>Automated ordering</h5>${s.reorder.map((x, i) => `<div class="ro${i === s.fc ? ' cur' : ''}"><button class="rn" data-act="fc" data-i="${i}"><b>${x.n}</b><small>On hand ${x.on} ${x.u} · min ${x.min}</small></button><em class="${x.st === 'OK' ? 'ok2' : x.st === 'Ordered' ? 'od' : 'lo2'}">${x.st}</em>${x.st === 'Below minimum' ? `<button class="ob" data-act="order" data-i="${i}">Order ${x.q} ${x.u}</button>` : ''}</div>`).join('')}</div>
          <div class="pnl"><h5>Usage forecast · ${r.n}</h5><div class="fcb">${u.map((v, i) => `<div><i style="height:${(v / mx) * 100}%"${i === 5 ? ' class="nx"' : ''}></i><small>${i === 5 ? 'Next wk' : `Wk ${i + 1}`}</small><b>${v}</b></div>`).join('')}</div><p class="nt">Forecast = average of the last 5 weeks + trend. Click another item on the left.</p></div>
          <div class="pnl wide"><h5>Inventory activity</h5>${s.log.map(([t, w]) => `<div class="lg3"><span>${e(t)}</span><small>${w}</small></div>`).join('')}</div></div>`);
      },
      reports: (c) => {
        const s = c.state, tabs = ['Quantity', 'Type', 'Location', 'History'];
        const rows = { Quantity: [['XP 275 B', '38 lb', 'Low'], ['IHE 400', '71 lb', 'OK'], ['Crimson Blood Red', '12 lb', 'Low'], ['S26 Conical LARGE', '2 pcs', 'Low'], ['Clear Topcoat', '3120 lb', 'OK']], Type: [['Colors & Finishes', '8 SKUs', '1,240 lb'], ['Chemicals', '9 SKUs', '16,480 lb'], ['Supplies', '9 SKUs', '214 pcs']], Location: [['Milwaukee (MKE)', '4 barcodes', '62%'], ['Fort Worth (FtW)', '5 barcodes', '38%']], History: [['Sep', '18 jobs', '9,860 lb used'], ['Aug', '22 jobs', '11,240 lb used'], ['Jul', '19 jobs', '10,105 lb used']] }[s.rtab];
        return shell('Inventory Reports', RAIL_MAIN, 'reports', `<div class="rpt"><div class="ptabs">${tabs.map((t) => `<button data-act="rtab" data-v="${t}" class="${t === s.rtab ? 'cur' : ''}">${t}</button>`).join('')}</div>
          <table class="rt3"><tbody>${rows.map((r) => `<tr data-kit="row" tabindex="0">${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="nt">Click a row to select it. Sample figures.</p></div>`);
      },
      admin: (c) => {
        const s = c.state;
        return shell('Admin Center', RAIL_MAIN, 'admin', `<div class="tx"><div class="pnl"><h5>Inventory calculations</h5><label class="wst">Waste allowance on pick sheets<span><input type="range" min="0" max="30" value="${s.waste}" data-in="waste" aria-label="Waste allowance"><b data-wo>${s.waste}%</b></span></label><p class="nt">Changes the amounts the Pick Sheet calculates.</p></div>
          <div class="pnl"><h5>User permissions</h5>${s.users.map((u, i) => `<div class="usr2"><span>${u.n}</span><select data-in="role" data-i="${i}" aria-label="Role for ${u.n}">${['Admin', 'Manager', 'Crew'].map((r) => `<option${r === u.r ? ' selected' : ''}>${r}</option>`).join('')}</select></div>`).join('')}</div>
          <div class="pnl wide"><h5>System settings</h5>${Object.entries(s.perms).map(([k, v]) => `<button class="sw2${v ? ' on2' : ''}" data-act="perm" data-k="${k}" aria-pressed="${v}"><i></i>${k}</button>`).join('')}</div></div>`);
      },
      records: (c) => shell('Inventory Records', RAIL_CAT, 'records', `<div class="cat"><div class="lp"><input class="srch" placeholder="Search here..." data-in="q" value="${e(c.state.q)}" aria-label="Search"><div class="tools"><button class="tb cur">${sv('<path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/>', 18)}</button><button class="tb">${sv('<path d="M9 6h11M9 12h8M9 18h11M4 6h1M4 12h1M4 18h1"/>', 18)}</button><button class="new nw2" data-act="newItem">＋ New</button><button class="dl" data-act="soon" aria-label="Export">↓</button></div>
        <div class="items" data-list>${catItems(c.state.barcodes, c.state.q)}</div></div>
        <div class="rp rec"><div class="fb"><label>Job<select><option>Select Job</option><option>TJ-ID-003</option><option>U R Cow</option></select></label><label>Status<select><option>Select Status</option><option>Checked out</option><option>In stock</option></select></label><label>User<select><option>Select User</option><option>Service Account</option></select></label><span class="ic">✎</span><span class="ic">🗑</span></div>
        <div class="bc"><small>Barcode #</small><input></div></div></div>`),
      jobs: () => shell('Job Builder', RAIL_JOB, 'jobs', `<div class="tiles t2 short">${tile('create', 'Create Pick Sheet', 'Start a new pick sheet for a job.', 'picksheet')}${tile('current', 'Current Pick Sheets', 'View and manage in-progress pick sheets.', 'picksheets')}</div>`),
      picksheet: (c) => shell('New Pick Sheet', RAIL_JOB, 'picksheet', `<div class="ps"><div class="pst"><button data-act="saveSheet" aria-label="Save">${sv('<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7"/>', 16)}</button><button data-go="jobs" aria-label="Close">✕</button></div>
        <p class="intro">Enter job details, and the app will calculate the estimated Product weight to pull along with Liquid Cheatsheet.</p>
        <div class="row1"><label>Locations<span class="dd"><select><option></option><option>Warehouse A</option><option>Warehouse B</option></select></span></label><label>Job ID<span class="jid"><input value="_"><b>+</b></span></label><label>Installation Date<span class="dt"><input value="4/12/2026"><i></i></span></label></div>
        <div class="flk"><i>Flake Sizes :</i><span>1/4<b>350</b></span><span>1/8<b>280</b></span><span>1/16<b>200</b></span><label><input type="radio" name="xis" data-act="season" data-v="Summer" ${c.state.season === 'Summer' ? 'checked' : ''}>Summer</label><label><input type="radio" name="xis" data-act="season" data-v="Winter" ${c.state.season === 'Winter' ? 'checked' : ''}>Winter</label><span class="rf">↻</span></div>
        <h6>Floor</h6><div class="sq"><input data-in="sqft" value="${c.state.sqft}" inputmode="numeric" aria-label="Square feet"><b>sq ft</b><span class="hd2">Inventory to Pull</span><span class="hd3">Amount</span></div>
        <div data-out>${pickRows(c)}</div></div>`),
      picksheets: (c) => shell('Pick Sheets', RAIL_JOB, 'picksheets', `<div class="pl"><input class="srch" placeholder="Search here..." aria-label="Search"><div class="ptabs">${['Job ID', 'Pick Sheet', 'All'].map((t) => `<button data-act="tab" data-v="${t}" class="${t === c.state.tab ? 'cur' : ''}">${t}</button>`).join('')}</div>
        <div class="sheets">${c.state.sheets.map((s, i) => `<button class="sh${i === c.state.pick ? ' cur' : ''}" data-act="pickSheet" data-i="${i}"><b>Job ID</b><span>${e(s)}</span></button>`).join('')}</div></div>`)
    },
    actions: {
      pickItem: (c, d) => {
        document.querySelectorAll('.xi .it').forEach((b) => b.classList.toggle('cur', b.dataset.v === d.v));
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
        if (document.getElementById('xiName')) { set('xiName', d.v); set('xiPrice', `$${priceOf(d.v).toFixed(2)}`); set('xiCat', /Tint/.test(d.v) ? 'Tints' : /Terrazzo|Mix/.test(d.v) ? 'Blends' : 'Standard'); }
        const bc = document.querySelector('.xi .bc input'); if (bc) { bc.value = d.v; c.toast(`${d.v}: ${d.v.startsWith('MKE') ? 'Milwaukee' : 'Fort Worth'} location`); }
      },
      edit: (c, d) => { const it = c.state.cards[d.i]; it.edit = !it.edit; c.render(); if (!it.edit) c.toast(`${it.code} updated`); },
      order: (c, d) => { const r = c.state.reorder[d.i]; r.st = 'Ordered'; c.state.log.unshift([`PO for ${r.n} (${r.q} ${r.u})`, 'just now']); c.render(); c.toast(`Purchase order sent for ${r.n}`); },
      fc: (c, d) => { c.state.fc = Number(d.i); c.render(); },
      rtab: (c, d) => { c.state.rtab = d.v; c.render(); },
      perm: (c, d) => { const u = c.state.perms; u[d.k] = !u[d.k]; c.render(); },
      scan: (c) => { const it = c.state.cards.find((x) => x.s === 'in'); if (!it) return c.toast('All items checked out'); it.s = 'out'; it.jobs = ['TJ-ID-003', '', '']; c.render(); c.toast(`Scanned ${it.code}: checked out`); },
      status: (c, d) => { const it = c.state.cards[d.i]; it.s = d.v; if (d.v === 'out' && !it.jobs) it.jobs = ['TJ-ID-003', '', '']; c.render(); },
      trash: (c, d) => { const it = c.state.cards.splice(d.i, 1)[0]; c.render(); c.toast(`${it.code} moved to trash`); },
      newItem: () => document.getElementById('xiName')?.focus(),
      save: (c) => { const n = document.getElementById('xiName'); if (!n?.value.trim()) return c.toast('* Required field is empty'); c.toast(`Saved "${n.value.trim()}"`); n.value = ''; },
      cancel: () => { const n = document.getElementById('xiName'); if (n) n.value = ''; },
      season: (c, d) => { c.state.season = d.v; c.patch('[data-out]', pickRows(c)); },
      saveSheet: (c) => { c.state.sheets.unshift(`TJ-ID-00${c.state.sheets.length}`); c.state.pick = 0; c.go('picksheets'); c.toast('Pick sheet saved'); },
      tab: (c, d) => { c.state.tab = d.v; c.render(); },
      pickSheet: (c, d) => { c.state.pick = Number(d.i); c.render(); }
    },
    inputs: {
      q: (c, v) => { c.state.q = v; const k = { colors: 'colors', chemicals: 'chemicals', supplies: 'supplies', records: 'barcodes' }; const list = document.querySelector('.xi [data-list]'); const scr = document.querySelector('.xi .ttl')?.textContent || ''; const key = scr.startsWith('Colors') ? 'colors' : scr.startsWith('Chemicals') ? 'chemicals' : scr.startsWith('Supplies') ? 'supplies' : 'barcodes'; if (list) list.innerHTML = catItems(c.state[k[key] || key], v); },
      sqft: (c, v) => { c.state.sqft = Math.max(0, Number(v) || 0); c.patch('[data-out]', pickRows(c)); },
      wt: (c, v, el) => { c.state.cards[el.dataset.i].w = v; },
      job: (c, v, el) => { c.state.cards[el.dataset.i].jobs[el.dataset.k] = v; },
      waste: (c, v) => { c.state.waste = Math.max(0, Math.min(30, Number(v) || 0)); const o = document.querySelector('.xi [data-wo]'); if (o) o.textContent = `${c.state.waste}%`; },
      role: (c, v, el) => { c.state.users[el.dataset.i].r = v; c.toast(`${c.state.users[el.dataset.i].n} is now ${v}`); }
    },
    css: `
.xi{background:#0b0b0d;color:#e9e9ec;font-family:"Open Sans","Segoe UI",system-ui,sans-serif;position:relative}
.xi button{font:inherit;color:inherit;cursor:pointer}
.xi .hdr{position:absolute;left:12px;top:10px;right:12px;height:60px;border-radius:16px;background:#141416;display:flex;align-items:center;padding:0 10px;gap:6px}
.xi .hb{width:32px;height:32px;border-radius:50%;border:1.5px solid #5b1c22;background:#19191b;display:grid;place-items:center;color:#ddd;font-size:18px;padding:0}
.xi .brand{width:180px;height:30px;margin:0 30px 0 16px;border-radius:14px;background:linear-gradient(90deg,#2b2b2f,#3d3d42 50%,#2b2b2f);filter:blur(6px)}
.xi .ttl{font-weight:700;font-size:17px;color:#fff}
.xi .usr{margin-left:auto;display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:18px;background:#1c1c1f}
.xi .av{width:32px;height:32px;border-radius:50%;background:#38383d;font-weight:700;display:grid;place-items:center;font-size:16px}
.xi .pw{width:32px;height:32px;border-radius:50%;border:1.5px solid #6b2027;display:grid;place-items:center;color:#ddd}
.xi .rail{position:absolute;left:14px;top:84px;bottom:12px;width:60px;border-radius:14px;background:#151517;display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:8px}
.xi .ham{display:grid;gap:5px;width:28px;margin-bottom:6px}.xi .ham i{height:3px;border-radius:2px;background:#e8333a}
.xi .ri{width:46px;height:44px;border-radius:12px;border:1px solid #4a181d;background:#121214;display:grid;place-items:center;color:#cfcfd3;padding:0;overflow:hidden}
.xi .ri.cur{background:#f28b8b;border-color:#f28b8b;color:#6d1a20}
.xi .ri .pho{border-radius:4px}
.xi .tog{margin-top:auto;margin-bottom:12px;width:42px;height:22px;border-radius:11px;background:#d1343b;position:relative}.xi .tog:after{content:"";position:absolute;right:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff}
.xi .main{position:absolute;left:84px;top:84px;right:12px;bottom:12px;border-radius:18px;background:#19191c;padding:16px;overflow:hidden}
.xi .tiles{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:268px;gap:24px 26px;height:100%}
.xi .tiles.t2{grid-template-columns:1fr 1fr;grid-auto-rows:262px}
.xi .tiles.short{grid-auto-rows:262px}
.xi .tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border:0;border-radius:18px;background:#1f1f22;padding:18px;text-align:center;transition:filter .15s}
.xi .tile:hover{filter:brightness(1.12)}
.xi .tile b{font-size:13.5px;color:#b9b9bf;font-weight:700}.xi .tile small{font-size:12px;color:#a7a7ad;line-height:1.35;max-width:340px}
.xi .pho{display:inline-block;background-image:url(assets/img/inv-mgmt.webp);background-repeat:no-repeat}
.xi .co .sbar{display:flex;align-items:center;height:40px;border-radius:20px;background:#2c2c30;padding:0 6px 0 16px;margin-bottom:8px}
.xi .co .sbar input,.xi .srch{flex:1;background:none;border:0;color:#ddd;font:13px "Open Sans",sans-serif;outline:none}
.xi .co .sbar button{border:1px solid #5b1c22;border-radius:16px;background:#141416;padding:5px 26px;font-weight:700;font-size:13px}
.xi .cards{border-top:1px solid #7a1d23;padding-top:12px;height:calc(100% - 48px);overflow:auto;padding-right:8px}
.xi .cc{margin-bottom:14px;border-radius:16px;background:#1d1d20}
.xi .chd{display:grid;grid-template-columns:1fr 1fr;background:#fff;color:#111;border-radius:14px;padding:10px 0;box-shadow:0 0 0 2px #2a0d10 inset}
.xi .chd span{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:13px}.xi .chd b{font-weight:700}
.xi .cb{display:flex;align-items:flex-start;gap:24px;padding:14px 16px 12px}
.xi .st small{display:block;color:#a9a9ae;font-weight:700;font-size:12.5px;margin-bottom:8px}
.xi .sb{display:grid;grid-template-columns:76px 80px;grid-template-rows:52px 52px;gap:4px}
.xi .sb .out{border:0;border-radius:10px;background:#a9cce3;color:#fff;font-weight:700;font-size:12.5px}
.xi .sb .in{border:0;border-radius:10px;background:#4f6c86;color:#ff4d4d;font-weight:700;font-size:12.5px}
.xi .sb .tr{grid-column:2;grid-row:1/3;border:3px solid #f0f0f2;border-radius:10px;background:#d8dbe0;color:#6b6f78;font-size:13px}
.xi .sb .sel{outline:3px solid #fff;outline-offset:-3px}
.xi .wt{display:flex;flex-direction:column;gap:6px;color:#a9a9ae;font-size:13px;padding-top:30px}.xi .wt input{width:100px;height:30px;border:0;border-radius:15px;background:#2c2c30;color:#eee;padding:0 14px}
.xi .jg{flex:1;display:grid;grid-template-columns:repeat(3,1fr);gap:4px 14px;padding-top:6px}
.xi .jg label{display:flex;flex-direction:column;gap:6px;color:#a9a9ae;font-size:13px}.xi .jg span{height:30px;border-radius:15px;background:#2c2c30;color:#e8e8ea;padding:5px 14px;font-size:13px}
.xi .ed{border:1px solid #5b1c22;background:#141416;border-radius:10px;width:38px;height:38px;display:grid;place-items:center}
.xi .cat{display:grid;grid-template-columns:372px 1fr;gap:12px;height:100%;margin:-16px;padding:2px 0 0}
.xi .lp{background:#1c1c1f;border-radius:16px;padding:8px;display:flex;flex-direction:column;overflow:hidden}
.xi .lp .srch{height:40px;border-radius:18px;background:#2e2e32;padding:0 12px;flex:none;margin-bottom:12px}
.xi .tools{display:flex;gap:0;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #7a1d23}
.xi .tb{width:72px;height:36px;border:1px solid #4a181d;background:#141416;color:#cfcfd3;display:grid;place-items:center}.xi .tb:first-child{border-radius:12px 0 0 12px}.xi .tb:nth-child(2){border-radius:0 12px 12px 0;color:#e8333a}
.xi .new{margin-left:auto;width:144px;height:36px;border:1px solid #4a181d;border-radius:12px;background:#141416;font-weight:700;font-size:11px}
.xi .nw2{width:120px;border-radius:12px 0 0 12px}.xi .dl{width:36px;height:36px;border:1px solid #4a181d;border-radius:0 12px 12px 0;background:#141416;color:#e8333a}
.xi .hd{color:#9b9ba1;font-weight:700;font-size:13px;margin:-4px 0 8px 4px}
.xi .items{overflow:auto;display:flex;flex-direction:column;gap:7px;padding-right:6px}
.xi .it{display:block;border:1px solid #4a181d;border-radius:12px;padding:4px}.xi .it{background:#151517;color:#a3a3a8;font-weight:700;font-size:13px}
.xi .it:before{content:"";display:none}
.xi .items .it{padding:10px 12px;background:#323236;border:4px solid #151517;box-shadow:0 0 0 1px #4a181d}
.xi .rp{position:relative;background:#19191c;border-radius:16px;padding:22px 34px}
.xi .rp label{display:flex;flex-direction:column;gap:8px;color:#d6d6d8;font-size:13px;margin-bottom:18px;position:relative}
.xi .rp .req{position:absolute;left:-18px;top:-2px;font-size:16px}
.xi .rp input{height:26px;border:0;border-radius:4px;background:#fff;color:#111;padding:0 8px}
.xi .sc{position:absolute;right:10px;bottom:10px;display:flex;border:1px solid #4a181d;border-radius:12px;overflow:hidden}.xi .sc button{border:0;background:#141416;padding:10px 16px;font-size:11px;font-weight:700}.xi .sc button+button{border-left:1px solid #4a181d}
.xi .rec{padding:10px 12px}.xi .fb{display:flex;align-items:center;gap:14px;font-size:13px;color:#ddd}.xi .fb label{flex-direction:row;align-items:center;margin:0;font-weight:700}.xi .fb select{height:26px;border:0;border-radius:3px;background:#fff;color:#777;width:168px;font-size:12px}.xi .fb .ic{width:26px;height:26px;border-radius:5px;background:#fff;color:#bbb;display:grid;place-items:center;font-size:12px}
.xi .bc{margin-top:14px;width:186px;height:66px;border-radius:4px;background:#232327;padding:8px 22px;font-size:13px;color:#ccc}.xi .bc input{display:block;width:140px;height:26px;border:0;border-radius:4px;margin-top:6px}
.xi .ps{position:relative;height:100%;overflow:auto;padding:4px 8px}
.xi .pst{position:absolute;right:0;top:0;display:flex;border:1px solid #5b1c22;border-radius:12px;overflow:hidden}.xi .pst button{width:46px;height:38px;border:0;background:#141416;display:grid;place-items:center}.xi .pst button+button{border-left:1px solid #5b1c22}
.xi .intro{margin:44px 0 18px;font-size:13px;color:#e4e4e6}
.xi .row1{display:flex;gap:26px;justify-content:center;margin-bottom:18px}.xi .row1 label{display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:13px;color:#ddd}
.xi .dd select,.xi .jid input,.xi .dt input{height:34px;border:0;border-radius:8px;background:#2c2c30;color:#ccc;padding:0 10px}
.xi .dd select{width:228px}.xi .jid{display:flex;align-items:center;gap:6px}.xi .jid input{width:196px;text-align:center}.xi .jid b{color:#e8333a;font-size:26px;font-weight:400}
.xi .dt{display:flex}.xi .dt input{width:200px;border-radius:8px 0 0 8px;color:#ddd}.xi .dt i{width:30px;background:#e8333a;border-radius:0 12px 12px 0}
.xi .flk{display:flex;align-items:center;gap:8px;margin:0 0 6px 20px;font-size:13px;font-weight:700}.xi .flk>i{color:#ccc;margin-right:6px}
.xi .flk span{display:flex;gap:28px;justify-content:center;width:128px;height:26px;align-items:center;border-radius:8px;background:#2c2c30;color:#ccc}.xi .flk span b{font-weight:700}
.xi .flk label{display:flex;align-items:center;gap:6px;margin-left:10px;font-weight:400;color:#ddd}.xi .flk .rf{margin-left:auto;color:#e8333a;font-size:20px}
.xi h6{margin:6px 0 8px;font-size:16px;font-weight:400;color:#e4e4e6}
.xi .sq{display:flex;align-items:center;gap:12px;margin-bottom:12px}.xi .sq input{width:132px;height:30px;border:0;border-radius:6px;background:#2c2c30;color:#ddd;text-align:center}.xi .sq b{font-size:13px}
.xi .hd2{margin-left:auto;font-weight:700;font-size:13px;width:166px;text-align:center}.xi .hd3{font-weight:700;font-size:13px;width:126px;padding-left:14px}
.xi .pr{display:flex;align-items:center;height:46px;padding-left:10px;font-size:13px;color:#ddd}.xi .pr span{flex:1}
.xi .pr select{width:162px;height:26px;border:0;border-radius:3px;background:#2c2c30;color:#888;font-size:12px}.xi .pr input{width:90px;height:26px;border:0;border-radius:3px;background:#2c2c30;color:#ddd;margin-left:8px;padding-left:12px}.xi .pr b{width:34px;text-align:center;font-size:13px}
.xi .pl .srch{display:block;width:100%;height:38px;border-radius:18px;background:#2e2e32;padding:0 12px;margin-bottom:10px}
.xi .ptabs{display:flex;justify-content:center;gap:0;width:510px;margin:0 auto 12px;border-radius:12px;background:#141416}.xi .ptabs button{flex:1;border:0;background:none;padding:8px;font-weight:700;font-size:12.5px;color:#bbb}.xi .ptabs button.cur{box-shadow:inset 0 -1px 0 #e8333a}
.xi .sheets{border-top:1px solid #7a1d23;padding-top:16px;display:flex;flex-direction:column;gap:12px;overflow:auto;height:calc(100% - 110px)}
.xi .sh{display:flex;flex-direction:column;align-items:flex-start;gap:6px;text-align:left;border:1px solid #6b1d24;border-radius:14px;background:#1c1c1f;padding:12px 14px}.xi .sh b{font-size:14px;color:#bbb;border-bottom:1px solid #7a1d23;padding-bottom:6px;width:130px}.xi .sh span{font-size:12.5px;color:#ccc}
.xi .sh.cur{background:#f5303a;border-color:#f5303a}.xi .sh.cur b,.xi .sh.cur span{color:#f0d0d2}
.xi .tx{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr;gap:14px;height:100%}
.xi .pnl{background:#1f1f22;border-radius:14px;padding:14px 16px;overflow:auto}.xi .pnl.wide{grid-column:1/-1}.xi .pnl h5{margin:0 0 10px;font-size:14px;color:#f28b8b;font-weight:700}
.xi .ro{display:flex;align-items:center;gap:10px;border-bottom:1px solid #2c2c30;padding:6px 4px}.xi .ro.cur{background:#2a1a1c;border-radius:10px}
.xi .rn{flex:1;border:0;background:none;text-align:left;display:flex;flex-direction:column;padding:2px}.xi .rn b{font-size:13px}.xi .rn small{color:#9b9ba1;font-size:11.5px}
.xi .ro em{font-style:normal;font-size:11px;font-weight:700;padding:2px 8px;border-radius:8px}.xi .lo2{background:#4a181d;color:#ff9b9b}.xi .ok2{background:#163a24;color:#7ee2a0}.xi .od{background:#1c2c4a;color:#9cc0ff}
.xi .ob{border:1px solid #e8333a;background:#e8333a;color:#fff;border-radius:10px;font-size:11.5px;font-weight:700;padding:5px 10px}
.xi .fcb{display:flex;align-items:flex-end;gap:12px;height:150px;border-bottom:1px solid #3a3a3e;padding:0 6px}.xi .fcb div{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:3px;font-size:11px;color:#9b9ba1}
.xi .fcb i{display:block;width:100%;border-radius:6px 6px 0 0;background:#e8333a}.xi .fcb i.nx{background:repeating-linear-gradient(45deg,#e8333a 0 6px,#7a1d23 6px 12px)}.xi .fcb b{order:-1;color:#e6e6e6;font-size:11.5px}
.xi .nt{color:#8b8b91;font-size:11.5px;margin:8px 0 0}
.xi .lg3{display:flex;justify-content:space-between;border-bottom:1px solid #2c2c30;padding:7px 2px;font-size:13px}.xi .lg3 small{color:#9b9ba1}
.xi .rpt{height:100%;display:flex;flex-direction:column}.xi .rpt .ptabs{width:520px}.xi .rt3{width:100%;border-collapse:collapse;font-size:13.5px}.xi .rt3 td{padding:11px 12px;border-bottom:1px solid #2c2c30}.xi .rt3 tr{cursor:pointer}.xi .rt3 tr:hover td{background:#232327}.xi .rt3 tr[aria-selected=true] td{background:#3a1d20}
.xi .wst{display:flex;flex-direction:column;gap:8px;font-size:13px}.xi .wst span{display:flex;align-items:center;gap:12px}.xi .wst input{flex:1;accent-color:#e8333a}.xi .wst b{width:40px}
.xi .usr2{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2c2c30;padding:6px 2px;font-size:13px}.xi .usr2 select{background:#2c2c30;color:#eee;border:1px solid #4a181d;border-radius:8px;padding:4px 8px}
.xi .sw2{display:inline-flex;align-items:center;gap:10px;border:0;background:none;margin:6px 26px 6px 0;font-size:13px}.xi .sw2 i{width:38px;height:20px;border-radius:10px;background:#3a3a3e;position:relative;transition:background .15s ease}.xi .sw2 i:after{content:"";position:absolute;left:3px;top:3px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .15s ease}
.xi .sw2.on2 i{background:#d1343b}.xi .sw2.on2 i:after{transform:translateX(18px)}
.xi .ed.on2{background:#e8333a;border-color:#e8333a}.xi .jg select{height:30px;border-radius:15px;background:#2c2c30;color:#eee;border:1px solid #e8333a;padding:0 10px}
.xi .items .it{text-align:left;font:inherit;font-weight:700;cursor:pointer;color:#a3a3a8}.xi .items .it:hover{color:#fff}.xi .items .it.cur{box-shadow:0 0 0 2px #e8333a;color:#fff}
`
  };
  function pickRows(c) {
    const s = c.state.sqft * (1 + (c.state.waste || 0) / 100), k = c.state.season === 'Winter' ? 1.12 : 1;
    const amt = { 'Type of Flake/Epoxy': s / 4.2, 'Base A': s / 160 * k, 'Base B': s / 320 * k, 'Top A': s / 200 * k, 'Top B': s / 400 * k, 'Moisture Barrier A': s / 250 * k };
    return Object.entries(amt).map(([label, v]) => `<div class="pr"><span>${label}</span><select aria-label="${label} item"><option>Select items</option><option>XP 275 B</option><option>IHE 400</option><option>Crimson Blood Red</option></select><input value="${s ? v.toFixed(1) : 0}" aria-label="${label} amount" readonly><b>lb</b></div>`).join('');
  }

  // ── My Expense (phone) ──
  const RI = '<svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true"><path d="M3 5h14l-1.5 15h-11z" fill="#9fd6ec" stroke="#3a8fb3"/><path d="M1 5h18M7 5V2h6v3" stroke="#3a8fb3" fill="none"/><path d="M7 11l3 3 3-3" stroke="#3a8fb3" fill="none"/></svg>';
  const exTab = (on) => `<div class="tb" role="navigation">${[['approvals', 'Approvals', '<path d="M3 6h9M15 6h6M3 12h9M15 12h6M3 18h9M15 18h6"/>'], ['list', 'Expenses', '<circle cx="12" cy="12" r="9"/><path d="M15 9h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9M12 6v2M12 16v2"/>'], ['reports', 'Reports', '<path d="M3 20h18M4 15l5-5 4 4 7-7M20 7v4M20 7h-4"/>']].map(([go, l, p]) => `<button data-go="${go}" class="${on === go ? 'cur' : ''}"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">${p}</svg>${l}</button>`).join('')}</div>`;
  const exHead = (title, left = true, right = '') => `<div class="hd">${left ? '<button class="bk" data-back aria-label="Back">‹</button>' : ''}<h2>${title}</h2>${right}</div>`;
  M.expense = {
    basis: 'screens', device: 'phone', title: 'My Expense', cls: 'xe', size: [487, 862], start: 'home',
    state: { f: 'All', sel: 0, list: [{ t: 'Food bills for site visit', d: '7/27/2021 2:04 PM', s: 'Submitted', a: 99.75 }, { t: 'Travel to Mumbai', d: '7/27/2021 7:19 PM', s: 'Approved', a: 4580 }, { t: 'Travel Expense 345', d: '', s: 'Draft', a: 345 }, { t: 'On site-US', d: '8/19/2021 6:42 PM', s: 'Submitted', a: 2150 }, { t: 'Taxi to airport', d: '8/02/2021 9:10 AM', s: 'Rejected', a: 760 }] },
    screens: {
      home: () => `<div class="home"><div class="wcard"><b>Welcome back,<br>Dev</b></div><div class="epanel"><button class="gl big" data-go="list"><svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#14256b" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><path d="M15.5 8.5h-5a2.2 2.2 0 0 0 0 4.4h3a2.2 2.2 0 0 1 0 4.4h-5.5M12 5.5v2M12 17v2"/></svg>My Expenses</button>
        <button class="gl" data-go="approvals"><svg width="84" height="70" viewBox="0 0 24 20" fill="none" stroke="#14256b" stroke-width="1.6"><path d="M2 3h11M15 3h7M2 8h11M15 8h7M2 13h11M15 13h7M2 18h11M15 18h7"/></svg>Approvals</button><button class="gl" data-go="reports"><svg width="96" height="64" viewBox="0 0 24 16" fill="none" stroke="#14256b" stroke-width="1.4"><path d="M1 15h22M2 11l6-6 5 5 8-8M21 2v5M21 2h-5"/></svg>Reports</button></div>${exTab('')}</div>`,
      list: (c) => { const L = c.state.list.filter((x) => c.state.f === 'All' || x.s === c.state.f); const cnt = (s) => c.state.list.filter((x) => x.s === s); const tot = (s) => `₹${cnt(s).reduce((a, x) => a + x.a, 0).toLocaleString('en-IN')}`;
        return `${exHead('My Expenses', true, '<button class="pl" data-act="add" aria-label="New expense">+</button>')}<div class="sht"><div class="tot">${['Submitted', 'Rejected', 'Approved'].map((s) => `<button data-act="f" data-v="${s}" class="${c.state.f === s ? 'cur' : ''}"><small>${s} (${cnt(s).length})</small><b>${tot(s)}</b></button>`).join('')}</div>
        <div class="fl">${['Draft', 'Submitted', 'Approved', 'Rejected', 'All'].map((s) => `<button data-act="f" data-v="${s}" class="${c.state.f === s ? 'cur' : ''}">${s.toUpperCase()}</button>`).join('')}</div>
        <div class="ls">${L.map((x) => `<button class="erow" data-act="open" data-i="${c.state.list.indexOf(x)}"><b>Dev User1</b><span class="t">${e(x.t)}</span><span class="s">${x.s}</span><span class="d">${x.d}</span><span class="r" aria-hidden="true">${RI}</span></button>`).join('') || '<p class="none">No expenses</p>'}</div></div>${exTab('list')}`; },
      detail: (c) => { const x = c.state.list[c.state.sel]; return `${exHead('Expense Details', true, '<button class="hm" data-go="home" aria-label="Home"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6"><path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg></button>')}<div class="sht det">
        <div class="dh"><span>Dev User1</span><b>₹${x.a.toLocaleString('en-IN')}</b><i>↻</i></div><em class="${x.s.toLowerCase()}">${x.s.toUpperCase()}</em>
        <dl><dt>APPROVER:</dt><dd>Thomas Anderson</dd><dt>COST CENTER:</dt><dd>Sky Line</dd><dt>DATE SUBMITTED:</dt><dd>${x.d || '—'}</dd><dt>PERIOD:</dt><dd>7/5/2021 12:00 AM - 7/9/2021 12:00 AM</dd></dl>
        <p class="rm">REMARKS:</p><p class="rt">${e(x.t)} for the 2nd week of July 2021</p>
        <button class="rc" data-act="rcpt" aria-label="Open receipt"><b>${RI} Restaurant Receipt</b><span>Drink E</span><small>7/27/2021 1:48 PM <i>₹ ${x.a}</i> <u>Email</u></small><em class="tap">Tap to view the receipt</em></button>${c.state.rcpt ? `<div class="rv2" data-act="rcpt"><div class="slip"><b>CAFE 42</b><small>Pune · GSTIN sample</small><hr><p><span>Drink E</span><span>₹ ${x.a}</span></p><p><span>Service</span><span>₹ 0</span></p><hr><p class="tt"><span>Total</span><span>₹ ${x.a}</span></p><small>7/27/2021 1:48 PM · Card</small><i>Tap anywhere to close</i></div></div>` : ''}
        ${x.s === 'Draft' ? '<button class="sub" data-act="submit">Submit</button>' : ''}</div>${exTab('list')}`; },
      approvals: (c) => `${exHead('My Approvals', true, '<button class="hm" data-go="home" aria-label="Home"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6"><path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg></button>')}<div class="sht"><p class="ap">Approval:</p><div class="sel"><span>Thomas Anderson</span><i>⌄</i></div>
        ${c.state.list.filter((x) => x.s === 'Submitted').map((x) => `<div class="arow"><b>Dev User1</b><span>${e(x.t)}</span><small>${x.d}</small><i>›</i><div class="ab"><button data-act="decide" data-i="${c.state.list.indexOf(x)}" data-v="Approved">Approve</button><button data-act="decide" data-i="${c.state.list.indexOf(x)}" data-v="Rejected">Reject</button></div></div>`).join('') || '<p class="none">Nothing to approve</p>'}</div>${exTab('approvals')}`,
      reports: (c) => `${exHead('Reports', true, '<button class="hm" data-go="home" aria-label="Home"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6"><path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg></button>')}<div class="sht rep"><h3>Expenses Category Report</h3><p class="cap">ava_cost<br><small>BY AVA_CATEGORY (GROUPS)</small></p><p class="lg"><b>ava_category (groups)</b> <i style="background:#118dff"></i>Business Needs <i style="background:#12239e"></i>Food &amp; Beverages <i style="background:#e66c37"></i>Transportation</p>
        <div class="chd"><div class="ax">${[3500, 3000, 2500, 2000, 1500, 1000, 500, 0].map((v) => `<span>${v.toLocaleString()}</span>`).join('')}</div><div class="stack">${[['Transportation', 2192, 62.6, '#e66c37'], ['Food & Beverages', 674, 19.3, '#12239e'], ['Business Needs', 583, 16.7, '#118dff']].map(([n, v, h, col]) => `<button style="height:${h}%;background:${col}" class="${c.state.seg === n ? 'cur' : ''}" data-act="seg" data-v="${n}" aria-label="${n}: ${v}">${v}</button>`).join('')}</div>${c.state.seg ? `<p class="segi"><b>${c.state.seg}</b> · ${{ Transportation: '2,192 (63%) · 6 claims', 'Food & Beverages': '674 (19%) · 9 claims', 'Business Needs': '583 (17%) · 3 claims' }[c.state.seg]}</p>` : ''}<span class="yl">ava_cost</span></div></div>${exTab('reports')}`
    },
    actions: {
      f: (c, d) => { c.state.f = d.v; c.render(); },
      open: (c, d) => { c.state.sel = Number(d.i); c.go('detail'); },
      submit: (c) => { c.state.list[c.state.sel].s = 'Submitted'; c.render(); c.toast('Sent for approval'); },
      decide: (c, d) => { c.state.list[d.i].s = d.v; c.render(); c.toast(d.v); },
      rcpt: (c) => { c.state.rcpt = !c.state.rcpt; c.render(); },
      seg: (c, d) => { c.state.seg = c.state.seg === d.v ? '' : d.v; c.render(); },
      add: (c) => { c.state.list.unshift({ t: 'New expense', d: '', s: 'Draft', a: 0 }); c.state.f = 'All'; c.render(); c.toast('Draft created'); }
    },
    css: `
.xe{background:#eef1f6;color:#14204a;font-family:"Segoe UI",system-ui,sans-serif;position:relative}
.xe button{font:inherit;cursor:pointer}
.xe .tb{position:absolute;left:0;right:0;bottom:0;height:92px;display:flex;justify-content:space-around;align-items:flex-start;border-top:2px solid #6b6f78;background:#eef1f6;padding-top:18px}
.xe .tb button{display:flex;flex-direction:column;align-items:center;gap:4px;border:0;background:none;color:#2a2f45;font-size:16px}.xe .tb button.cur{color:#1f3a93;font-weight:600}
.xe .home .wcard{height:285px;background:linear-gradient(115deg,#3b2a12 0%,#8d6a2c 22%,#d9b866 40%,#f2e2a8 52%,#b88d3e 64%,#5a4218 100%);position:relative;border-bottom:1px solid #b9bcc6}
.xe .home .wcard:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(100deg,rgba(255,255,255,.08) 0 2px,transparent 2px 26px)}
.xe .home .wcard b{position:absolute;right:52px;top:14px;text-align:right;font-size:30px;line-height:1.15;color:#14256b}
.xe .home .epanel{position:absolute;left:14px;right:16px;top:216px;height:532px;border-radius:44px;background:#fff;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:200px 150px;gap:44px 34px;padding:64px 22px 0}
.xe .gl{border:4px solid #bfe9ff;border-radius:6px;background:#fff;box-shadow:0 0 14px #76c8ff,inset 0 0 6px #9cdcff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#111;font-size:20px}
.xe .gl.big{grid-column:1/-1;justify-self:center;width:166px;height:170px}
.xe .hd{height:180px;background:linear-gradient(180deg,#1f3a93,#5a72c0);display:flex;align-items:flex-start;justify-content:center;padding-top:42px;position:relative}
.xe .hd h2{margin:0;color:#fff;font-size:31px;font-weight:700}
.xe .hd .bk{position:absolute;left:16px;top:20px;width:52px;height:52px;border-radius:50%;border:3px solid #fff;background:none;color:#fff;font-size:30px;line-height:1}
.xe .hd .pl{position:absolute;right:26px;top:14px;border:0;background:none;color:#fff;font-size:58px;font-weight:200;line-height:1}
.xe .hd .hm{position:absolute;right:28px;top:26px;border:0;background:none}
.xe .sht{position:absolute;left:14px;right:16px;top:118px;bottom:104px;border-radius:40px;background:#fff;padding:24px 18px;overflow:hidden}
.xe .tot{display:flex;justify-content:space-between;padding:0 6px}.xe .tot button{display:flex;flex-direction:column;align-items:flex-start;border:0;background:none;border-radius:10px;padding:2px 6px}.xe .tot button.cur{background:#e5e9f5}.xe .tot small{font-size:15px;color:#111}.xe .tot b{font-size:21px;font-weight:400;color:#8a1a1a}
.xe .fl{display:flex;gap:6px;margin:10px 0 12px}.xe .fl button{flex:1;height:46px;border:0;border-radius:18px;background:#e5e7ec;color:#222;font-weight:700;font-size:12px}.xe .fl button.cur{background:#0f2a58;color:#fff}
.xe .ls{height:470px;overflow:auto;border-right:10px solid #d7d7d7;padding-right:6px}
.xe .erow{display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto auto;width:100%;border:0;border-bottom:1.5px solid #47507a;background:#fff;text-align:left;padding:14px 10px 12px;column-gap:10px}
.xe .erow b{font-size:19px}.xe .erow .r{grid-column:2;grid-row:1}.xe .erow .t{font-size:20px;grid-column:1}.xe .erow .s{grid-column:2;grid-row:2;font-weight:700;font-size:15px;align-self:center}.xe .erow .d{color:#2f6db5;font-size:18px}
.xe .det{padding:22px 26px}.xe .dh{display:flex;align-items:center;font-size:28px}.xe .dh b{margin-left:auto;font-weight:400}.xe .dh i{font-style:normal;color:#1c7ac9;margin-left:26px;font-size:28px}
.xe em{display:block;text-align:right;font-style:normal;font-size:20px;color:#2fd34a;margin:4px 6px 12px}.xe em.approved{color:#2fd34a}.xe em.rejected{color:#d63b3b}.xe em.draft{color:#888}
.xe dl{display:grid;grid-template-columns:auto 1fr;gap:6px 18px;margin:0;font-size:13.5px}.xe dt{text-decoration:underline;color:#14204a}.xe dd{margin:0;font-weight:700}
.xe .rm{margin:18px 0 4px;font-size:13px;text-decoration:underline}.xe .rt{margin:0;font-size:14px}
.xe .rc{width:100%;text-align:left;background:#fff;cursor:pointer;margin-top:46px;border:4px solid #13265c;height:236px;padding:6px 10px;display:flex;flex-direction:column;gap:2px}.xe .rc b{font-size:17px;display:flex;align-items:center;gap:4px;font-weight:600}.xe .rc span{font-size:17px;padding-left:14px}.xe .rc small{margin-top:20px;font-size:13px;border-bottom:1.5px solid #13265c;padding-bottom:12px;display:flex;justify-content:space-between}.xe .rc i,.xe .rc u{font-style:normal;text-decoration:none}
.xe .sub{margin-top:14px;width:100%;height:44px;border:0;border-radius:22px;background:#1f3a93;color:#fff;font-weight:700}
.xe .ap{margin:20px 0 6px 14px;font-weight:700;font-size:20px}.xe .sel{display:flex;align-items:center;margin:0 6px 20px;height:46px;border:1.5px solid #13265c}.xe .sel span{flex:1;padding-left:8px;font-size:21px}.xe .sel i{width:44px;height:100%;background:#3150b7;color:#fff;display:grid;place-items:center;font-style:normal;font-size:22px}
.xe .arow{position:relative;margin:0 14px;padding:16px 10px 12px;border-bottom:1.5px solid #13265c}.xe .arow b{display:block;font-size:19px}.xe .arow span{display:block;font-size:17px;margin-top:6px}.xe .arow small{position:absolute;right:46px;top:52px;font-size:16px}.xe .arow i{position:absolute;right:6px;top:40px;font-style:normal;font-size:30px}
.xe .ab{display:flex;gap:10px;margin-top:12px}.xe .ab button{border:0;border-radius:6px;background:#3150b7;color:#fff;font-weight:700;font-size:14px;padding:4px 12px}
.xe .rep{padding:30px 22px}.xe .rep h3{text-align:center;margin:30px 0 26px;font-size:21px;color:#2b4a9b;font-weight:600}
.xe .cap{margin:0 0 4px;font-size:15px;color:#333}.xe .cap small{font-size:9px;color:#777}.xe .lg{font-size:9.5px;color:#555;margin:0 0 4px}.xe .lg i{display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 2px 0 4px}
.xe .chd{position:relative;height:340px;display:flex;gap:4px;padding-left:16px}.xe .ax{display:flex;flex-direction:column;justify-content:space-between;font-size:9.5px;color:#666;height:300px;width:30px;text-align:right}
.xe .stack{width:72px;height:300px;margin-left:118px;display:flex;flex-direction:column-reverse}.xe .stack button{display:grid;place-items:center;color:#fff;border:0;padding:0;font-size:10px;cursor:pointer;transition:filter .15s ease}.xe .stack button:hover{filter:brightness(1.15)}.xe .stack:has(.cur) button:not(.cur){opacity:.35}
.xe .segi{position:absolute;left:150px;top:150px;width:150px;font-size:12px;color:#333;background:#f5f7fb;border-radius:8px;padding:8px}
.xe .tap{font-style:normal;font-size:12px;color:#2f6db5;margin-top:auto}
.xe .rv2{position:absolute;inset:0;background:rgba(10,20,50,.55);display:grid;place-items:center;z-index:5;cursor:pointer}.xe .slip{width:260px;background:#fffdf6;padding:18px 20px;font-family:monospace;font-size:14px;color:#222;box-shadow:0 10px 30px rgba(0,0,0,.3)}.xe .slip b{display:block;text-align:center;font-size:18px}.xe .slip small{display:block;text-align:center;color:#666}.xe .slip p{display:flex;justify-content:space-between;margin:6px 0}.xe .slip .tt{font-weight:700}.xe .slip i{display:block;text-align:center;margin-top:10px;color:#888;font-size:11px}
.xe .yl{position:absolute;left:-6px;top:120px;transform:rotate(-90deg);font-size:10px;color:#555}
.xe .none{text-align:center;color:#888;margin-top:30px}
`
  };
})();
