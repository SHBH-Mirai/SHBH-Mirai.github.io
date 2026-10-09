// exact-b.js: pixel-faithful recreations, part 2 (Attributes search, Employee onboarding). Same rules as exact-a.js: native size, brands/URLs hidden, sample data only.
(() => {
  const M = window.MockKit && window.MOCKUPS;
  if (!M) return;
  const e = window.MockKit.esc;

  // ── Attributes search (3 screens) ──
  const SVG = (p, s = 56, st = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 48 48" fill="none" stroke="${st}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const REPORTS = [['ID Card Report', 'o', '<rect x="5" y="14" width="38" height="26" rx="2"/><circle cx="16" cy="25" r="4"/><path d="M9 36c1-5 4-7 7-7s6 2 7 7M27 24h10M27 30h8M20 14V8h8v6M24 4l2 4"/>'], ['Summary Report', 'g', '<path d="M8 10h22v30H8z"/><path d="M12 18h12M12 24h12M12 30h8M30 30l12-16 4 3-12 16-5 1z"/>'], ['Commercial Report', 'b', '<path d="M8 6h24v34H8z"/><path d="M13 30V24M18 30V18M23 30V21M28 30V15"/><circle cx="32" cy="34" r="6"/><path d="M36 38l6 6"/>'], ['Technical Report', 'r', '<circle cx="27" cy="20" r="11" stroke-dasharray="5 3"/><circle cx="27" cy="20" r="5"/><circle cx="15" cy="34" r="7"/><path d="M10 39l-5 5"/>']];
  const ATTRS = { CONNECTORS: ['Gender', 'Hybrid Poles', 'Pin Rows/Layout', 'Sealed', 'Terminal Size'], CABLES: ['Conductor Count', 'Gauge (AWG)', 'Jacket Material', 'Shielding', 'Voltage Rating'], RELAYS: ['Coil Voltage', 'Contact Form', 'Mounting Type', 'Switching Current', 'Sealed'] };
  const attrHdr = (back) => `<div class="tbar"><span class="logo" aria-hidden="true"></span><b>Shubham D</b><span class="av" aria-hidden="true"></span></div>${back ? '<button class="bk" data-go="home" aria-label="Back to dashboard">➜</button>' : '<p class="crumb"><span>◷</span> Dashboard</p>'}`;
  M.attributes = {
    basis: 'screens', device: 'desktop', title: 'Attributes', cls: 'xa', size: [1600, 731], start: 'home',
    state: { cat: '', part: '', name: '', rows: [], found: 0, file: '', doc: '' },
    screens: {
      home: (c) => { const s = c.state, on = !!s.cat; return `${attrHdr(false)}
        <div class="pan"><input class="nm" placeholder="Search Name" data-in="name" value="${e(s.name)}" aria-label="Search name">
          <div class="frm"><label>Category</label><select data-in="cat" aria-label="Category"><option value="">Find items</option>${Object.keys(ATTRS).map((k) => `<option${k === s.cat ? ' selected' : ''}>${k}</option>`).join('')}</select>
          <label>Part Number</label><input class="pn${on ? '' : ' off'}" placeholder="Search Part Number" data-in="part" value="${e(s.part)}" ${on ? '' : 'disabled'} aria-label="Part number">
          <div class="bt${on ? '' : ' dim'}"><button class="rs" data-act="reset">${SVG('<path d="M38 18A15 15 0 0 0 10 16M10 30a15 15 0 0 0 28 2M6 10v8h8M42 38v-8h-8"/>', 26)} Reset</button><button class="up" data-go="upload">${SVG('<path d="M14 36H11a9 9 0 0 1-1-18 12 12 0 0 1 23-2 9 9 0 0 1 5 17h-3M24 38V22M18 28l6-6 6 6"/>', 30)} Upload</button><button class="sr" data-act="search">Search</button></div></div>
          <div class="ring"><div><b>${s.found}/${s.rows.length}</b><small>Available<br>Attributes</small></div><i></i></div></div>
        <div class="rep">${REPORTS.map(([t, k, p]) => `<button class="${k}" data-act="report" data-t="${t}">${SVG(p, 62)}<span>${t}</span></button>`).join('')}</div>
        ${on ? `<div class="grid"><div class="gh"><span>Attribute</span><span>Attribute Value</span><span>Condition</span><span>Condition Value</span></div><div class="gb">${s.rows.map((r, i) => `<div class="gr"><input type="checkbox" data-act="chk" data-i="${i}" ${r.cur ? 'checked' : ''} aria-label="Use ${e(r.n)}"><b>${e(r.n)}</b><span class="spin"><input data-in="val" data-i="${i}" value="${e(r.v)}" aria-label="${e(r.n)} value"><i>▴<br>▾</i></span><select aria-label="Condition"><option>equal to</option><option>not equal to</option><option>contains</option></select><select aria-label="Condition value"><option>Find items</option><option>Yes</option><option>No</option></select></div>`).join('')}</div><button class="add" data-act="addRow">Add New +</button></div>` : ''}
        <p class="pw">Powered by <span></span></p>`; },
      rep: (c) => { const s = c.state, k = REPORTS.find((r) => r[0] === s.rep) || REPORTS[0];
        return `${attrHdr(true)}<div class="rpp"><div class="rph ${k[1]}">${SVG(k[2], 40)}<b>${s.rep}</b><span>${e(s.cat)} · ${s.rows.filter((r) => r.on).length} attributes</span><button data-act="export">Export to Excel</button></div>
          <table class="rpt2"><tr><th>Part Number</th>${s.rows.filter((r) => r.on).map((r) => `<th>${e(r.n)}</th>`).join('')}</tr>${['CN-1042-A', 'CN-1042-B', 'CN-2210', 'CN-3307-S'].map((pn, i) => `<tr data-kit="row" tabindex="0"><td>${pn}</td>${s.rows.filter((r) => r.on).map((r, j) => `<td>${r.v || ['Male', 'Female', 'Yes', 'No', '2 x 6', '12 AWG'][(i + j) % 6]}</td>`).join('')}</tr>`).join('')}</table><p class="rpn">Sample parts. Click a row to select it.</p></div>`; },
      upload: (c) => `${attrHdr(true)}<div class="upp"><div class="uc"><h3>Upload List</h3><label class="cf"><span>Choose File</span><input type="file" data-in="file" aria-label="Choose file"></label><em>${e(c.state.file || 'No file chosen')}</em><input class="dn" placeholder="Doc Name (Required) *" data-in="doc" value="${e(c.state.doc)}" aria-label="Document name"></div>
        ${['Existing Lists', 'BOM', 'Item Group'].map((t, i) => `<div class="uc"><h3>${t}</h3><select aria-label="${t}"><option></option><option>${['Q3 connector list', 'BOM-1042 Harness', 'Connectors'][i]}</option><option>${['Q2 cable list', 'BOM-0987 Relay board', 'Cables'][i]}</option></select></div>`).join('')}
        <hr><div class="ub${c.state.file && c.state.doc ? '' : ' dim'}"><button class="rs" data-act="clearUp">${SVG('<path d="M38 18A15 15 0 0 0 10 16M10 30a15 15 0 0 0 28 2M6 10v8h8M42 38v-8h-8"/>', 26)} Reset</button><button class="up" data-act="doUpload">${SVG('<path d="M14 36H11a9 9 0 0 1-1-18 12 12 0 0 1 23-2 9 9 0 0 1 5 17h-3M24 38V22M18 28l6-6 6 6"/>', 30)} Upload</button></div></div>`
    },
    actions: {
      reset: (c) => { Object.assign(c.state, { cat: '', part: '', name: '', rows: [], found: 0 }); c.render(); },
      search: (c) => { const s = c.state; if (!s.cat) return c.toast('Pick a category first'); s.found = s.rows.filter((r) => r.cur && r.v).length; c.render(); c.toast(`${s.found} of ${s.rows.length} attributes matched`); },
      chk: (c, d, el) => { c.state.rows[d.i].cur = el.checked; },
      addRow: (c) => { c.state.rows.push({ n: `Custom ${c.state.rows.length + 1}`, v: '', on: true }); c.render(); },
      report: (c, d) => { if (!c.state.cat) return c.toast('Pick a category first'); c.state.rep = d.t; c.go('rep'); },
      export: (c) => c.toast(`${c.state.rep} exported to Excel (sample)`),
      clearUp: (c) => { c.state.file = ''; c.state.doc = ''; c.render(); },
      doUpload: (c) => { if (!c.state.file || !c.state.doc) return c.toast('Choose a file and enter a Doc Name'); c.toast(`Uploaded "${c.state.doc}"`); c.state.file = ''; c.state.doc = ''; c.render(); }
    },
    inputs: {
      name: (c, v) => { c.state.name = v; },
      cat: (c, v) => { c.state.cat = v; c.state.rows = (ATTRS[v] || []).map((n) => ({ n, v: '', on: true })); c.state.found = 0; c.render(); },
      part: (c, v) => { c.state.part = v; },
      val: (c, v, el) => { c.state.rows[el.dataset.i].v = v; },
      file: (c, v) => { c.state.file = v.split(/[\\/]/).mpop(); c.render(); },
    },
    css: `
.xa{background:#f4f4f4;color:#222;font-family:"Open Sans","Segoe UI",system-ui,sans-serif;position:relative;border:10px solid #fff;border-width:8px 16px 14px 10px}
.xa button{font:inherit;cursor:pointer}
.xa .tbar{height:42px;background:#fff;box-shadow:0 2px 3px rgba(0,0,0,.12);display:flex;align-items:center;padding:0 20px 0 54px}
.xa .logo{width:150px;height:34px;border-radius:12px;background:linear-gradient(90deg,#e6e6e6,#f1f1f1);filter:blur(4px)}
.xa .tbar b{margin-left:auto;font-weight:600;font-size:14px;margin-right:26px}.xa .av{width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 50% 45%,#2e2e2e 30%,#000 60%)}
.xa .crumb{position:absolute;left:66px;top:48px;margin:0;font-weight:700;font-size:14.5px;display:flex;gap:10px;align-items:center}.xa .crumb span{color:#e8333a;font-size:20px}
.xa .pan{position:absolute;left:60px;top:75px;width:1066px;height:256px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18)}
.xa .nm{position:absolute;left:17px;top:11px;width:776px;height:38px;border:1px solid #bbb;border-radius:2px;background:#f2f2f2;padding:0 10px;font:16px "Open Sans",sans-serif}
.xa .frm{position:absolute;left:19px;top:68px;width:775px;height:165px;background:#f7f7f7;box-shadow:0 2px 6px rgba(0,0,0,.18);display:grid;grid-template-columns:260px 508px;grid-template-rows:38px 38px 1fr;row-gap:10px;padding:11px 0 0 15px;align-items:center}
.xa .frm label{font-weight:700;font-size:16px}
.xa .frm select{height:38px;border:1px solid #444;border-radius:0;background:#fff;font:16px "Open Sans",sans-serif;padding:0 4px;color:#333}
.xa .pn{height:38px;border:1px solid #888;background:#fff;text-align:center;font:16px "Open Sans",sans-serif}.xa .pn.off{background:#ccc;border-color:#bbb}
.xa .bt,.xa .ub{grid-column:2;display:flex;gap:20px;justify-content:flex-end;align-self:start;padding-top:4px}
.xa .bt button,.xa .ub button{width:128px;height:41px;border:0;border-radius:3px;color:#fff;font-weight:600;font-size:15.5px;display:flex;align-items:center;justify-content:center;gap:6px}
.xa .rs{background:linear-gradient(90deg,#1f9ed8,#57c2e9)}.xa .up{background:linear-gradient(90deg,#f39a1e,#f8b648)}.xa .sr{background:linear-gradient(90deg,#c62f3c,#d8656d)}
.xa .dim button{opacity:.62}.xa .dim .sr{opacity:.9}
.xa .ring{position:absolute;left:852px;top:28px;width:172px;height:172px;border-radius:50%;background:#f3f3f3;box-shadow:inset 0 0 0 7px #e8e8e8,0 0 0 2px #f8f8f8;display:grid;place-items:center}
.xa .ring div{width:112px;height:112px;border-radius:50%;background:#ebebeb;display:flex;flex-direction:column;align-items:center;justify-content:center}.xa .ring b{font-weight:400;font-size:21px;margin-bottom:12px}.xa .ring small{font-size:13px;font-weight:700;text-align:center;line-height:1.2}
.xa .ring i{position:absolute;right:6px;top:73px;width:20px;height:20px;border-radius:50%;background:#16a34a}
.xa .rep{position:absolute;left:1160px;top:72px;display:grid;grid-template-columns:174px 174px;grid-auto-rows:124px;gap:10px 12px}
.xa .rep button{border:0;border-radius:3px;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;font-size:14.5px;opacity:.9}
.xa .rep span{opacity:.92}.xa .rep .o{background:linear-gradient(120deg,#f2953f,#f7b680)}.xa .rep .g{background:linear-gradient(120deg,#3f945f,#71b98a)}.xa .rep .b{background:linear-gradient(120deg,#5d8cbc,#86acd2)}.xa .rep .r{background:linear-gradient(120deg,#b4504c,#ce827f)}
.xa .rep .g span,.xa .rep .b span,.xa .rep .r span{opacity:.6}
.xa .grid{position:absolute;left:60px;top:345px;width:1462px;height:338px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18)}
.xa .gh{display:grid;grid-template-columns:390px 360px 328px 1fr;padding:12px 0 0 150px;font-weight:600;font-size:17.5px}
.xa .gb{position:absolute;left:28px;right:16px;top:50px;height:220px;overflow:auto;border-bottom:1px solid #ddd}
.xa .gr{display:grid;grid-template-columns:118px 336px 172px 340px 1fr;align-items:center;height:32px;margin:0 12px 12px 0;background:#f5f5f5;box-shadow:0 2px 2px rgba(0,0,0,.14);padding-left:20px;font-size:14px}
.xa .gr b{font-weight:600}.xa .spin{display:flex;align-items:center}.xa .spin input{width:152px;height:22px;border:0;background:#fff;font-size:12px}.xa .spin i{font-style:normal;font-size:7px;line-height:.9;color:#555}
.xa .gr input[type=checkbox]{width:14px;height:14px;margin:0}.xa .gr select{width:168px;height:22px;border:1px solid #888;background:#fff;font-size:10.5px;color:#333}
.xa .add{position:absolute;right:30px;bottom:12px;width:128px;height:41px;border:0;border-radius:3px;background:linear-gradient(90deg,#1f9ed8,#57c2e9);color:#fff;font-size:18px}
.xa .pw{position:absolute;left:0;right:0;bottom:-2px;text-align:center;font-size:12.5px;color:#555}.xa .pw span{display:inline-block;width:40px;height:10px;background:#ddd;filter:blur(2px)}
.xa .rpp{position:absolute;left:80px;right:40px;top:70px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18);padding:0 0 16px}
.xa .rph{display:flex;align-items:center;gap:14px;color:#fff;padding:14px 20px}.xa .rph b{font-size:20px}.xa .rph span{opacity:.85}.xa .rph button{margin-left:auto;border:2px solid #fff;background:none;color:#fff;border-radius:4px;padding:6px 14px;font-weight:600}
.xa .rph.o{background:linear-gradient(120deg,#f2953f,#f7b680)}.xa .rph.g{background:linear-gradient(120deg,#3f945f,#71b98a)}.xa .rph.b{background:linear-gradient(120deg,#5d8cbc,#86acd2)}.xa .rph.r{background:linear-gradient(120deg,#b4504c,#ce827f)}
.xa .rpt2{width:calc(100% - 40px);margin:16px 20px 0;border-collapse:collapse;font-size:14px}.xa .rpt2 th{text-align:left;background:#f4f4f4;padding:8px}.xa .rpt2 td{padding:9px 8px;border-bottom:1px solid #eee}.xa .rpt2 tr[data-kit]{cursor:pointer}.xa .rpt2 tr[aria-selected=true] td{background:#e6f4fb}.xa .rpn{margin:10px 20px 0;color:#777;font-size:12.5px}
.xa .bk{position:absolute;left:14px;top:57px;width:40px;height:40px;border-radius:50%;border:5px solid #fff;background:#3cc4ee;color:#fff;font-size:12px;transform:scaleX(-1)}
.xa .upp{position:absolute;left:140px;top:79px;width:1274px;height:376px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.15)}
.xa .uc{position:absolute;top:35px;width:276px;height:158px;background:#f4f4f4;box-shadow:0 2px 5px rgba(0,0,0,.2);padding:12px 12px 0 13px}
.xa .uc:nth-child(1){left:16px}.xa .uc:nth-child(2){left:325px}.xa .uc:nth-child(3){left:672px}.xa .uc:nth-child(4){left:979px}
.xa .uc h3{margin:0 0 20px;font-weight:400;font-size:24px}
.xa .cf{display:inline-block;font-size:11px;border:1px solid #767676;border-radius:2px;background:#efefef;padding:1px 6px;position:relative;overflow:hidden;cursor:pointer}.xa .cf input{position:absolute;inset:0;opacity:0;cursor:pointer}
.xa .uc em{font-style:normal;font-size:11px;margin-left:4px}
.xa .dn{display:block;width:250px;height:38px;border:0;background:#fff;margin-top:6px;padding:0 10px;font:14px "Open Sans",sans-serif}
.xa .uc select{width:250px;height:46px;border:0;background:#fff;margin-top:20px;font-size:14px}
.xa hr{position:absolute;left:28px;top:237px;width:1216px;margin:0;border:0;border-top:3px solid #ccc;height:0}
.xa .ub{position:absolute;right:70px;top:266px;gap:58px;padding:0}
`
  };
  // the upload screen enables its buttons once both fields are filled; re-render is cheap
  M.attributes.inputs.doc = (c, v) => { const before = !!(c.state.file && c.state.doc); c.state.doc = v; if (before !== !!(c.state.file && v)) { const ub = document.querySelector('.xa .ub'); if (ub) ub.classList.toggle('dim', !(c.state.file && v)); } };

  // ── Employee onboarding (login, form, passport, HR dashboard) ──
  const NAMES = [['Mr. Shubam', 'shubam@example.com', '2/11/1996'], ['Ms. Rachael', 'rachael@example.com', '9/3/1990'], ['Yvonne McKay', 'someone_a@example.com', '5/16/1954'], ['Susanna Stubberod', 'someone_b@example.com', '8/21/1982']];
  const ring = '<svg width="370" height="118" viewBox="0 0 370 118" aria-hidden="true"><defs><filter id="xosh"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".25"/></filter></defs>' +
    [['#b8202d', 52, 1], ['#ee7d22', 140, 0], ['#5fae35', 226, 1], ['#14889c', 312, 0]].map(([col, x, down]) => `<path d="M${x - 54} 58 A54 54 0 0 ${down ? 0 : 1} ${x + 54} 58" stroke="${col}" stroke-width="22" fill="none"/><circle cx="${x}" cy="58" r="34" fill="#fff" filter="url(#xosh)"/>`).join('') +
    '<circle cx="52" cy="54" r="7" fill="#c3202d"/><path d="M40 72c2-8 7-11 12-11s10 3 12 11z" fill="#c3202d"/><path d="M38 40l4 4M66 40l-4 4M52 34v5" stroke="#c3202d" stroke-width="2"/>' +
    '<rect x="125" y="46" width="30" height="20" rx="1" fill="none" stroke="#ee7d22" stroke-width="2"/><circle cx="133" cy="54" r="3" fill="#ee7d22"/><path d="M139 52h10M139 57h8M121 69h38" stroke="#ee7d22" stroke-width="2"/>' +
    '<circle cx="226" cy="58" r="15" fill="none" stroke="#5fae35" stroke-width="2.5"/><circle cx="221" cy="54" r="2" fill="#5fae35"/><circle cx="231" cy="54" r="2" fill="#5fae35"/><path d="M219 61q7 7 14 0" stroke="#5fae35" stroke-width="2.5" fill="#5fae35"/>' +
    '<g fill="#14889c"><circle cx="312" cy="50" r="5"/><circle cx="300" cy="54" r="4"/><circle cx="324" cy="54" r="4"/><path d="M302 72c1-9 5-13 10-13s9 4 10 13zM292 70c1-6 4-9 8-9l1 9zM332 70c-1-6-4-9-8-9l-1 9z"/></g></svg>';
  const DOTS = [[403, 203, 5, '#c8102e'], [382, 274, 10, '#f78a8a'], [381, 352, 20, '#ffc000'], [313, 368, 8, '#0b4f9c'], [671, 367, 4, '#22c7d4'], [661, 478, 20, '#0b4f9c'], [730, 471, 9, '#ffc000'], [705, 536, 15, '#f78a8a'], [412, 543, 15, '#22c7d4'], [541, 578, 8, '#c8102e']];
  const home = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0a74c2" stroke-width="1.6" aria-hidden="true"><path d="M3 11l9-8 9 8M5 9.5V21h5v-6h4v6h5V9.5"/></svg>';
  const cup = '<svg width="24" height="42" viewBox="0 0 12 22" aria-hidden="true"><path d="M5 0l1 5" stroke="#555" stroke-width=".6"/><path d="M1 6h10l-1.4 15H2.4z" fill="#2fd3a4"/><path d="M0.5 5h11v2H.5z" fill="#1fb88a"/><path d="M2 11h8" stroke="#1d9c78"/></svg>';
  M.onboarding = {
    basis: 'screens', device: 'desktop', title: 'Employee Onboarding', cls: 'xo', size: [1538, 863], start: 'login',
    state: { email: '', pw: '', f: {}, files: [], sig: false, filter: 'Submitted', people: NAMES.map(([n, m, b]) => ({ n, m, b, s: 'Submitted' })), sel: 2, cmt: '' },
    screens: {
      login: (c) => `<div class="sky"><svg class="mtn" viewBox="0 0 1538 863" preserveAspectRatio="none" aria-hidden="true"><path d="M0 372l40 4 70-32 80 60 110 80 80 40 70-10 60 10 60-40 50-20 50 20 60-20 50 40 80 30 70 30 80 10 100 40 110-30 60 20 80 10 248 30 V863H0z" fill="#c5d8ec"/><path d="M0 560l120-20 180 40 200 30 250 20 220-40 200 60 368-10V863H0z" fill="#dde8f3" opacity=".8"/></svg>
        ${DOTS.map(([x, y, r, col]) => `<i class="dot" style="left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;background:${col}"></i>`).join('')}
        <div class="box"><div class="ring">${ring}</div><input placeholder="Enter your email" data-in="email" value="${e(c.state.email)}" aria-label="Email"><input type="password" placeholder="Enter your password" data-in="pw" aria-label="Password">
        <button class="lg" data-act="login"><svg width="46" height="44" viewBox="0 0 24 24" fill="none" stroke="#0b2e7a" stroke-width="1.3"><circle cx="9" cy="7" r="4"/><path d="M2 21c0-5 3-8 7-8s7 3 7 8M18 16v6M15 19h6"/></svg>Login</button><p class="hint">Tip: an email starting with <b>hr</b> opens the HR view</p></div></div>`,
      form: (c) => { const f = c.state.f; const fld = (k, l, req) => `<label class="fl">${req ? '<i>*</i>' : ''}${l}<input data-in="f" data-k="${k}" value="${e(f[k] || '')}" aria-label="${l}"></label>`;
        return `<div class="obar">${'<button class="hm" data-go="login" aria-label="Home">' + home + '</button>'}<h1>Employee Onboarding</h1></div><div class="frm">${fld('first', 'First Name')}${fld('last', 'Last Name', 1)}<label class="fl em">Email<input data-in="f" data-k="email" value="${e(f.email || c.state.email)}" aria-label="Email"></label>
          ${fld('mobile', 'Mobile Phone')}<label class="fl">Birthday<span class="dt"><input data-in="f" data-k="bday" placeholder="12/31/2001" value="${e(f.bday || '')}" aria-label="Birthday"><b>▦</b></span></label><label class="fl">Gender<span class="sel"><select data-in="f" data-k="gender" aria-label="Gender"><option></option>${['Female', 'Male', 'Prefer not to say'].map((g) => `<option${f.gender === g ? ' selected' : ''}>${g}</option>`).join('')}</select><b>⌄</b></span></label>
          <div class="idp"><span>ID Picture</span><svg width="64" height="54" viewBox="0 0 24 20" fill="none" stroke="#0a74c2" stroke-width="2"><path d="M2 5h5l2-3h6l2 3h5v14H2z"/><circle cx="12" cy="11" r="4.5"/><circle cx="5" cy="8" r=".6" fill="#0a74c2"/></svg><button class="pic" data-act="pic">${f.pic ? 'Picture added ✓' : 'Tap or click to add a<br>picture'}</button></div>
          <div class="att"><span><i>*</i>Attachments</span><div><p>${c.state.files.length ? c.state.files.map(e).join('<br>') : 'There is nothing attached.'}</p><button data-act="attach">📎 Attach file</button></div></div></div>
          <button class="next" data-act="next">Next</button>`; },
      passport: (c) => `<div class="obar"><h1 class="r">Passport Details</h1></div><div class="pp"><div class="fp"><svg width="56" height="62" viewBox="0 0 24 26" fill="none" stroke="#222" stroke-width="1.4"><rect x="4" y="2" width="17" height="21" rx="1.5"/><path d="M4 5H2.5v19H18"/><path d="M8 6h3v2H8zM13 6h5M8 11h3M13 11h5M8 14h3M13 14h5M13 17h5" stroke="#777"/></svg><span>Form processor</span><button data-act="analyze">⤒ Analyze</button></div>
        <div class="pf">${['Passport Number', 'Place Of Birth', 'Place Of Issue'].map((l, i) => `<label>${l}<input data-in="f" data-k="p${i}" value="${e(c.state.f['p' + i] || '')}" aria-label="${l}"></label>`).join('')}</div>
        <div class="pen"><button class="pad${c.state.sig ? ' signed' : ''}" data-act="sign" aria-label="Sign here">${c.state.sig ? '<svg viewBox="0 0 300 120"><path d="M20 90c30-60 50-60 50-20s20 30 40-10 30-40 40 0 30 20 60-10 40-10 70 0" stroke="#111" stroke-width="3" fill="none"/></svg>' : ''}</button><div class="tools"><b>✒</b><span>⌫</span><span>✕</span><i></i><span>☰</span><span>✎</span></div></div>
        <button class="sub" data-act="submit">Submit</button></div>`,
      hr: (c) => { const s = c.state; const L = s.people.filter((p) => p.s === s.filter && p.n.toLowerCase().includes((s.hq || '').toLowerCase())); if (s.az) L.sort((a, b) => a.n.localeCompare(b.n)); const p = s.people[s.sel] || {};
        return `<div class="hbar"><button class="hm" data-go="login" aria-label="Home">${home}</button><span class="sr"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0b2e7a" stroke-width="1.6"><circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/></svg><input placeholder="Search items" aria-label="Search items" data-in="hq" value="${e(s.hq || '')}"></span><button class="ic" data-act="sort" aria-label="Sort by name">⇅</button><button class="ic" data-act="refresh" aria-label="Refresh">↻</button></div>
        <div class="flt">${['Submitted', 'Approved', 'Rejected'].map((f) => `<button data-act="filter" data-v="${f}" class="${f === s.filter ? 'cur' : ''}">${f}</button>`).join('')}</div>
        <button class="ext" data-act="newEmp" aria-label="Open the onboarding form"><svg width="76" height="58" viewBox="0 0 30 22" fill="none" stroke="#0a74c2" stroke-width="2.2"><path d="M14 4H2v16h20v-8M18 2h8v8M26 2L14 14"/></svg></button><button class="lo" data-go="login">Log Out</button>
        <div class="gal">${L.map((x) => { const i = s.people.indexOf(x); return `<div class="cd${i === s.sel ? ' cur' : ''}" data-act="pick" data-i="${i}"><b>${e(x.n)}</b><span class="cup">${cup}</span>${x.s === 'Submitted' ? `<button class="okb" data-act="decide" data-i="${i}" data-v="Approved">Approve</button><button class="no" data-act="decide" data-i="${i}" data-v="Rejected">Reject</button>` : ''}<em class="${x.s.toLowerCase()}">${x.s}</em></div>`; }).join('') || `<p class="none">No ${s.filter.toLowerCase()} requests</p>`}</div>
        <div class="dp"><span>Full Name</span><p>${e(p.n || '')} (sample)</p><span>Email</span><div class="v">${e(p.m || '')}</div><span>Birthday</span><div class="v">${e(p.b || '')}</div><span>Signature</span><div class="v sg"></div></div>
        <p class="cl">Approval OR Rejection Comment:</p><textarea data-in="cmt" aria-label="Approval or rejection comment">${e(s.cmt)}</textarea>`; }
    },
    actions: {
      login: (c) => { if (!/.+@.+/.test(c.state.email)) return c.toast('Enter an email (any sample address)'); c.go(/^hr/i.test(c.state.email) ? 'hr' : 'form'); },
      pic: (c) => { c.state.f.pic = true; c.render(); },
      attach: (c) => { c.state.files.push(`offer-letter-${c.state.files.length + 1}.pdf`); c.render(); },
      next: (c) => { if (!c.state.f.last) return c.toast('Last Name is required'); if (!c.state.files.length) return c.toast('Attachments are required'); c.go('passport'); },
      analyze: (c) => { c.cancel(); c.toast('Reading the passport…'); c.later(() => { Object.assign(c.state.f, { p0: 'Z1234567', p1: 'Pune', p2: 'Mumbai' }); c.render(); c.toast('3 fields filled by AI Builder'); }, 900); },
      sign: (c) => { c.state.sig = !c.state.sig; c.render(); },
      submit: (c) => { const f = c.state.f; if (!f.p0) return c.toast('Passport Number is required'); c.state.people.unshift({ n: `${f.first || ''} ${f.last}`.trim(), m: f.email || c.state.email, b: f.bday || '12/31/2001', s: 'Submitted' }); c.state.sel = 0; c.state.filter = 'Submitted'; c.go('hr'); c.toast('Submitted: HR sees the new request'); },
      filter: (c, d) => { c.state.filter = d.v; c.render(); },
      sort: (c) => { c.state.az = !c.state.az; c.render(); c.toast(c.state.az ? 'Sorted A → Z' : 'Original order'); },
      refresh: (c) => { c.state.hq = ''; c.render(); c.toast('Refreshed from SharePoint'); },
      newEmp: (c) => { c.state.f = {}; c.state.files = []; c.state.sig = false; c.go('form'); },
      pick: (c, d) => { c.state.sel = Number(d.i); c.render(); },
      decide: (c, d) => { const p = c.state.people[d.i]; p.s = d.v; c.state.sel = Number(d.i); c.render(); c.toast(`${p.n}: ${d.v.toLowerCase()}${c.state.cmt ? ' with comment' : ''}`); }
    },
    inputs: {
      email: (c, v) => { c.state.email = v; }, pw: (c, v) => { c.state.pw = v; },
      f: (c, v, el) => { c.state.f[el.dataset.k] = v; }, cmt: (c, v) => { c.state.cmt = v; },
      hq: (c, v) => { c.state.hq = v; c.render(); const i = document.querySelector('.xo [data-in=hq]'); if (i) { i.focus(); i.setSelectionRange(v.length, v.length); } }
    },
    css: `
.xo{background:linear-gradient(180deg,#fff 8%,#dfe8f3 45%,#93b0d4);color:#0b1f6b;font-family:"Segoe UI",system-ui,sans-serif;position:relative;overflow:hidden}
.xo button{font:inherit;cursor:pointer}
.xo .sky{position:absolute;inset:0;background:linear-gradient(180deg,#d8e7f6,#eef4fa 40%,#e3ecf5)}.xo .mtn{position:absolute;inset:0;width:100%;height:100%}
.xo .dot{position:absolute;border-radius:50%}
.xo .box{position:absolute;left:940px;top:63px;width:550px;height:706px;border:2px solid #0b2e7a;background:rgba(248,251,255,.55)}
.xo .ring{position:absolute;left:88px;top:44px}
.xo .box input{position:absolute;left:34px;width:480px;height:55px;border:0;border-radius:3px;background:#e9e9e9;font-size:20px;padding:0 14px;color:#333}
.xo .box input:first-of-type{top:203px}.xo .box input[type=password]{top:287px}
.xo .lg{position:absolute;left:34px;top:446px;width:481px;height:57px;border:2px solid #0b2e7a;border-radius:7px;background:#0a74c2;color:#fff;font-size:24px;font-weight:600;display:flex;align-items:center;padding:0 16px}.xo .lg svg{margin-right:150px}
.xo .hint{position:absolute;left:34px;top:520px;margin:0;font-size:13px;color:#4a5d86}
.xo .obar{height:65px;background:linear-gradient(180deg,#bfe2f7,#fff);border-bottom:1px solid #2b6c8f;display:flex;align-items:center;padding:0 38px 0 16px}
.xo .obar h1{margin:0 0 0 auto;font-weight:400;font-size:38px;color:#0a74c2}.xo .obar h1.r{margin-top:6px}
.xo .hm{border:0;background:none;padding:0}
.xo .frm{position:absolute;left:32px;top:184px;width:1474px;display:grid;grid-template-columns:repeat(3,447px);column-gap:67px;row-gap:22px}
.xo .fl{display:flex;flex-direction:column;gap:12px;font-size:20px;padding-left:6px;position:relative}.xo .fl i{position:absolute;left:-14px;top:0;color:#e33;font-style:normal}
.xo .fl input,.xo .fl .dt,.xo .fl .sel{margin-left:-6px;height:47px;border:2px solid #0b2e7a;background:#fff;font-size:20px;padding:0 6px;color:#444}
.xo .fl.em input{border-color:#fff}
.xo .dt,.xo .sel{display:flex;padding:0!important}.xo .dt input{flex:1;border:0;height:43px;margin:0}.xo .dt b{width:37px;background:#2f58b5;color:#fff;display:grid;place-items:center;font-weight:400;font-size:16px}
.xo .sel select{flex:1;border:0;background:#fff;font-size:18px;appearance:none;padding:0 8px}.xo .sel b{width:38px;background:#2f58b5;color:#fff;display:grid;place-items:center;font-size:26px;font-weight:400;line-height:.6}
.xo .idp{position:relative;height:200px;font-size:20px;padding-left:6px}.xo .idp svg{position:absolute;right:4px;top:-20px}
.xo .pic{position:absolute;right:0;top:118px;width:226px;height:57px;border:0;border-radius:4px;background:#fff;font-size:16px;font-weight:600;color:#111;line-height:1.4}
.xo .att{grid-column:2;font-size:20px;position:relative}.xo .att>span{display:block;margin:0 0 9px 6px}.xo .att i{position:absolute;left:-14px;color:#e33;font-style:normal}
.xo .att>div{width:455px;height:118px;border:2px solid #0b2e7a;background:#fff;padding:16px 18px;color:#222}.xo .att p{margin:0 0 18px;font-size:20px;max-height:52px;overflow:hidden}.xo .att button{border:0;background:none;font-size:20px;padding:0;color:#222}
.xo .next{position:absolute;left:1324px;top:758px;width:182px;height:47px;border:2px solid #2445a8;border-radius:7px;background:#3a5fc0;color:#fff;font-size:24px;font-weight:600}
.xo .pp{position:absolute;inset:65px 0 0}
.xo .fp{position:absolute;left:11px;top:86px;width:605px;height:651px;background:#e8e8e8;border:1px solid #ddd;display:flex;flex-direction:column;align-items:center;padding-top:250px;gap:16px;font-size:15px;color:#333}
.xo .fp button{position:absolute;left:0;right:0;bottom:0;height:45px;border:0;background:#0a74c2;color:#fff;font-size:15px}
.xo .pf{position:absolute;left:639px;top:105px;width:870px;display:flex;flex-direction:column;gap:18px}.xo .pf label{display:flex;flex-direction:column;gap:12px;font-size:20px;padding-left:6px}.xo .pf input{margin-left:-6px;height:47px;border:2px solid #0b2e7a;background:#fff;font-size:20px;padding:0 8px}
.xo .pen{position:absolute;left:659px;top:440px;width:417px;height:298px;border:2px solid #0b2e7a}
.xo .pad{display:block;width:100%;height:228px;border:0;background:transparent;padding:10px}.xo .pad svg{width:100%;height:100%}
.xo .tools{height:66px;background:#000;display:flex;align-items:center;color:#fff;font-size:30px}.xo .tools>*{width:56px;text-align:center}.xo .tools b{height:66px;background:#333;line-height:66px;color:#d6b24a;font-weight:400;margin-left:54px}.xo .tools i{width:2px;height:44px;background:#fff;margin:0 10px}
.xo .sub{position:absolute;left:1193px;top:683px;width:299px;height:55px;border:2px solid #0b5aa0;border-radius:7px;background:#0a74c2;color:#fff;font-size:24px;font-weight:600}
.xo .hbar{height:65px;background:linear-gradient(180deg,#bfe2f7,#fff);border-bottom:1px solid #2b6c8f;display:flex;align-items:center;gap:20px;padding-left:2px}
.xo .hbar .sr{width:511px;height:44px;border:1.5px solid #0a74c2;border-radius:8px;display:flex;align-items:center;gap:20px;padding-left:14px;background:#d5ecf9}.xo .sr input{border:0;background:none;font-size:23px;color:#555;flex:1;outline:none}
.xo .hbar .ic{font-size:38px;color:#0a74c2;margin-left:4px;border:0;background:none;padding:0 4px;line-height:1}.xo .ext{border:0;background:none;padding:0}
.xo .flt{position:absolute;left:146px;top:105px;display:flex;gap:11px}.xo .flt button{height:30px;border:1px solid #0b2e7a;border-radius:15px;background:#0a74c2;color:#fff;font-size:18px;padding:0 16px;letter-spacing:-.5px}.xo .flt button.cur{box-shadow:0 0 0 2px #fff,0 0 0 4px #0a74c2}
.xo .ext{position:absolute;left:927px;top:70px}
.xo .lo{position:absolute;left:1369px;top:86px;width:138px;height:36px;border:0;border-radius:18px;background:#0a74c2;color:#fff;font-size:23px;font-weight:600}
.xo .gal{position:absolute;left:38px;top:170px;width:840px;height:693px;overflow:auto;display:grid;grid-template-columns:358px 358px;grid-auto-rows:328px;column-gap:62px;row-gap:20px;align-content:start;border-right:20px solid #f0f0f0}
.xo .cd{position:relative;border:3px solid #6ab0e6;background:#cfe6f5;cursor:pointer}.xo .cd.cur{border-color:#0a74c2;box-shadow:0 0 0 2px #0a74c2}
.xo .cd b{position:absolute;left:0;right:30px;top:180px;text-align:center;font-weight:400;font-size:31px;color:#111;white-space:nowrap}
.xo .cup{position:absolute;right:20px;top:170px}
.xo .cd .okb,.xo .cd .no{position:absolute;top:225px;width:115px;height:30px;border:2px solid #fff;border-radius:15px;font-size:15px;font-weight:600;color:#fff;box-shadow:0 0 0 1px #9ac}.xo .okb{left:16px;background:#8fd84a}.xo .no{left:210px;background:#e35f51}
.xo .cd em{position:absolute;left:0;right:0;bottom:0;height:45px;border:3px solid #a0711a;background:#ff8c00;font-style:normal;text-align:center;font-size:31px;font-weight:600;color:#111;line-height:38px}
.xo .cd em.approved{background:#5ec16b;border-color:#2f7a3a}.xo .cd em.rejected{background:#e35f51;border-color:#8a2a22}
.xo .none{grid-column:1/-1;font-size:22px;color:#335}
.xo .dp{position:absolute;left:898px;top:150px;width:609px;height:510px;border:2px solid #cde3f5;padding:16px 34px 0 34px;display:flex;flex-direction:column;gap:6px;font-size:20px}
.xo .dp span{margin-left:6px;margin-top:8px}.xo .dp p{margin:0 0 6px;color:#222}.xo .dp .v{height:46px;background:#fff;color:#222;padding:10px 6px;margin-right:0}.xo .dp .sg{height:133px;background:#f0f4f9;margin-right:16px}
.xo .cl{position:absolute;left:933px;top:686px;margin:0;font-size:20px;color:#222}
.xo textarea{position:absolute;left:897px;top:737px;width:603px;height:92px;border:2px solid #e8202a;background:#fff;font:18px "Segoe UI",sans-serif;padding:8px;resize:none}
`
  };
})();
