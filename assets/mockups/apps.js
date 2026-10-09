// apps.js: one interactive mockup per project (keys match the "mock" field in projects.js).
// All names, numbers and records are SAMPLE DATA, invented for the demo. No client data is used.
// "basis" says whether the mockup recreates real screens ("screens") or was designed from the description ("description").
window.MOCKUPS = (() => {
  const { ui } = window.MockKit;
  const e = ui.esc;
  const money = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
  const toneOf = (s) => ({ Approved: 'ok', Completed: 'ok', Booked: 'info', 'Checked in': 'ok', Delivered: 'ok', Hired: 'ok', Available: 'ok', Submitted: 'warn', Pending: 'warn', 'In progress': 'warn', Draft: '', Rejected: 'bad', 'Checked out': 'warn', 'More info': 'info', Open: 'info' }[s] || '');

  const apps = {
    // 1 ─────────────────────────────── Inventory & Job Costing (tablet, dark/red)
    inventory: {
      basis: 'screens', device: 'tablet', title: 'Inventory', user: 'SA',
      theme: { bg: '#121317', surface: '#1b1c22', surface2: '#25262e', text: '#f1f1f4', muted: '#9a9aa6', accent: '#e8333a', 'accent-text': '#fff' },
      nav: [{ go: 'home', icon: 'home', label: 'Home' }, { go: 'checkout', icon: 'swap', label: 'Check-in/out' }, { go: 'manage', icon: 'box', label: 'Inventory' }, { go: 'jobs', icon: 'flow', label: 'Job Builder' }],
      navMap: { chemicals: 'manage', picksheet: 'jobs' },
      start: 'home',
      state: {
        items: [{ code: 'MKE-003', name: 'XP 275 Gray Extreme', w: 9069, s: 'Checked out' }, { code: 'FTW-001', name: 'Oil Stop Primer', w: 4569, s: 'Available' }, { code: 'MKE-004', name: 'Clear Topcoat', w: 3120, s: 'Available' }, { code: 'FTW-005', name: 'Crimson Flake Blend', w: 860, s: 'Available' }],
        chemicals: ['XR 800', 'Dark Gray Tint', 'IHE 400', 'XP 275 B', 'Yellow Tint', 'Green Tint', 'Blue Tint'], q: '', sqft: 450, flake: '1/4', season: 'Summer'
      },
      screens: {
        home: (c) => `<h4>Home dashboard</h4>${c.ui.tiles([
          { icon: 'swap', label: 'Check-in / Check-out', sub: 'Scan items for jobs', go: 'checkout' }, { icon: 'box', label: 'Inventory management', sub: 'Colours, chemicals, supplies', go: 'manage' },
          { icon: 'flow', label: 'Job Builder', sub: 'Pick sheets per job', go: 'jobs' }, { icon: 'money', label: 'Transactions', sub: 'Ordering & usage', act: 'soon' },
          { icon: 'chart', label: 'Reports', sub: 'Stock & history', act: 'soon' }, { icon: 'user', label: 'Admin center', sub: 'Users & settings', act: 'soon' }])}`,
        checkout: (c) => `<h4>Check-in / Check-out</h4><div class="mk-actions" style="margin:0 0 10px">${c.ui.btn(`${c.ui.icon('scan')} Simulate barcode scan`, 'scan', 'pri')}</div>
          ${c.state.items.map((it, i) => `<div class="mk-row"><div class="mk-grow"><b>${e(it.code)} · ${e(it.name)}</b><small>${it.w.toLocaleString()} g on hand</small></div>${c.ui.chip(it.s, toneOf(it.s))}
          ${c.ui.btn(it.s === 'Checked out' ? 'Check in' : 'Check out', 'toggleItem', 'sm', { i })}</div>`).join('')}`,
        manage: (c) => `<h4>Inventory management</h4>${c.ui.tiles([{ icon: 'paint', label: 'Colours & finishes', act: 'soon' }, { icon: 'flask', label: 'Chemicals', go: 'chemicals' }, { icon: 'tool', label: 'Supplies', act: 'soon' }, { icon: 'list', label: 'Inventory records', act: 'soon' }], 2)}`,
        chemicals: (c) => `<div class="mk-grid2"><div>${c.ui.search('q', c.state.q, 'Search chemicals')}<div data-list>${chemList(c)}</div></div>
          <div class="mk-panel"><h4>New chemical</h4><div class="mk-form" style="--cols:1">${c.ui.field('Chemical type', '<input id="mkChem" placeholder="e.g. Polyaspartic Clear">')}${c.ui.field('Price per pound', '<input placeholder="$" inputmode="decimal">')}${c.ui.field('Category', c.ui.select('cat', ['Epoxy', 'Polyaspartic', 'Solvent', 'Tint'], 'Epoxy'))}</div>
          <div class="mk-actions">${c.ui.btn('Save', 'addChem', 'pri')}</div></div></div>`,
        jobs: (c) => `<h4>Job Builder</h4>${c.ui.tiles([{ icon: 'plus', label: 'Create pick sheet', sub: 'Start a new job', go: 'picksheet' }, { icon: 'search', label: 'Current pick sheets', sub: 'TJ-ID-001 … 003', act: 'soon' }], 2)}`,
        picksheet: (c) => `<h4>New pick sheet</h4><p>Enter the job size and the app estimates how much product to pull.</p>
          <div class="mk-form" style="--cols:3">${c.ui.field('Floor area (sq ft)', c.ui.input('sqft', c.state.sqft, 'number', 'min="0" step="10"'))}${c.ui.field('Flake size', c.ui.select('flake', ['1/4', '1/8', '1/16'], c.state.flake))}${c.ui.field('Season', c.ui.select('season', ['Summer', 'Winter'], c.state.season))}</div>
          <h5>Inventory to pull</h5><div data-out>${pickTable(c)}</div><p class="mk-note">Illustrative coverage rates for the demo, not real product data.</p>`
      },
      actions: {
        soon: (c) => c.toast('Screen not included in this recreation'),
        scan: (c) => { const it = c.state.items.find((x) => x.s === 'Available'); if (!it) return c.toast('Everything is checked out'); it.s = 'Checked out'; c.render(); c.toast(`Scanned ${it.code}: checked out to job TJ-ID-003`); },
        toggleItem: (c, d) => { const it = c.state.items[d.i]; it.s = it.s === 'Checked out' ? 'Available' : 'Checked out'; c.render(); c.toast(`${it.code} ${it.s === 'Available' ? 'checked in' : 'checked out'}`); },
        addChem: (c) => { const v = document.getElementById('mkChem')?.value.trim(); if (!v) return c.toast('Enter a chemical type first'); c.state.chemicals.unshift(v); c.render(); c.toast(`Saved "${v}"`); }
      },
      inputs: {
        q: (c, v) => { c.state.q = v; c.patch('[data-list]', chemList(c)); },
        sqft: (c, v) => { c.state.sqft = Math.max(0, Number(v) || 0); c.patch('[data-out]', pickTable(c)); },
        flake: (c, v) => { c.state.flake = v; c.patch('[data-out]', pickTable(c)); },
        season: (c, v) => { c.state.season = v; c.patch('[data-out]', pickTable(c)); }
      }
    },

    // 2 ─────────────────────────────── Issue Tracker & Jira Approval (desktop, SharePoint blue)
    tracker: {
      basis: 'screens', device: 'desktop', title: 'Jira Issue Approval', user: 'JD',
      theme: { bg: '#f3f5f9', surface: '#ffffff', surface2: '#e8edf6', text: '#1d2433', muted: '#5b6478', accent: '#2457d6', 'accent-text': '#fff', line: 'rgba(20,30,60,.12)' },
      nav: [{ go: 'library', icon: 'folder', label: 'Library' }, { go: 'approvals', icon: 'check', label: 'My approvals' }, { go: 'flows', icon: 'flow', label: 'Flows' }],
      start: 'library',
      state: { docs: [{ t: 'Payment gateway timeout.docx', ch: 'Finance', p: 'High', s: 'Submitted' }, { t: 'Login SSO loop.pdf', ch: 'Security', p: 'Medium', s: 'Approved' }, { t: 'Report export blank.xlsx', ch: 'Reporting', p: 'Low', s: 'More info' }, { t: 'Field mapping error.docx', ch: 'Integration', p: 'High', s: 'Submitted' }], run: [] },
      screens: {
        library: (c) => `<h4>Issue documents</h4><p>Uploading a file raises a Jira ticket and routes it to the channel's approvers.</p>
          ${c.ui.table(['Document', 'Channel', 'Priority', 'Status'], c.state.docs.map((d) => [e(d.t), e(d.ch), c.ui.chip(d.p, d.p === 'High' ? 'bad' : d.p === 'Medium' ? 'warn' : ''), c.ui.chip(d.s, toneOf(d.s))]))}
          <div class="mk-actions">${c.ui.btn(`${c.ui.icon('upload')} Upload new issue`, 'upload', 'pri')}</div>`,
        approvals: (c) => { const pending = c.state.docs.filter((d) => d.s === 'Submitted' || d.s === 'More info');
          return `<h4>My approvals</h4>${pending.length ? pending.map((d) => `<div class="mk-row"><div class="mk-grow"><b>${e(d.t)}</b><small>Requestor: A. Sharma · ${e(d.ch)} · ${e(d.p)} priority</small></div>${c.ui.chip(d.s, toneOf(d.s))}
            ${c.ui.btn('Approve', 'decide', 'ok sm', { t: d.t, v: 'Approved' })}${c.ui.btn('Reject', 'decide', 'bad sm', { t: d.t, v: 'Rejected' })}${c.ui.btn('Ask info', 'decide', 'sm', { t: d.t, v: 'More info' })}</div>`).join('') : '<div class="mk-empty">All caught up. Nothing waiting for approval.</div>'}`; },
        flows: (c) => `<h4>Approval flow</h4><div class="mk-actions" style="margin:0 0 12px">${c.ui.btn(`${c.ui.icon('play')} Test run`, 'runFlow', 'pri')}</div><div class="mk-flow">${c.ui.flow(TRACKER_FLOW, c.state.run)}</div>`
      },
      actions: {
        upload: (c) => { c.state.docs.unshift({ t: `New issue ${c.state.docs.length + 1}.docx`, ch: 'Operations', p: 'Medium', s: 'Submitted' }); c.render(); c.toast('Uploaded: Jira ticket created, approvers notified'); },
        decide: (c, d) => { const doc = c.state.docs.find((x) => x.t === d.t); doc.s = d.v; c.render(); c.toast(`${d.v === 'More info' ? 'Asked requestor for more info' : d.v}: ${doc.t}`); },
        runFlow: (c) => runSteps(c, TRACKER_FLOW.length, 'Flow run succeeded')
      }
    },

    // 3 ─────────────────────────────── Issue Analysis & Validation Dashboards (desktop, Power BI style)
    analysis: {
      basis: 'description', device: 'desktop', title: 'Analyst Dashboard', user: 'AN',
      theme: { bg: '#eef1f6', surface: '#ffffff', surface2: '#e3e8f1', text: '#1b2230', muted: '#5d6676', accent: '#0f6cbd', 'accent-text': '#fff', line: 'rgba(20,30,60,.12)' },
      nav: [{ go: 'queue', icon: 'list', label: 'Issue queue' }, { go: 'report', icon: 'chart', label: 'Power BI' }],
      start: 'queue',
      state: { phase: 'All', issues: [['IS-1051', 'Tech', 'Phase 1', 'On track'], ['IS-1055', 'Ops', 'Phase 1', 'At risk'], ['IS-1056', 'Tech', 'Phase 2', 'On track'], ['IS-1057', 'Ops', 'Test script', 'On track'], ['IS-1058', 'Tech', 'Interim validation', 'Escalated'], ['IS-1059', 'Ops', 'Final validation', 'On track'], ['IS-1060', 'Tech', 'Phase 3', 'At risk']] },
      screens: {
        queue: (c) => { const phases = ['All', 'Phase 1', 'Phase 2', 'Phase 3', 'Test script', 'Interim validation', 'Final validation'];
          const rows = c.state.issues.filter((r) => c.state.phase === 'All' || r[2] === c.state.phase);
          return `${c.ui.kpis([{ label: 'Issues in queue', value: c.state.issues.length }, { label: 'At risk', value: c.state.issues.filter((r) => r[3] === 'At risk').length }, { label: 'Escalated', value: c.state.issues.filter((r) => r[3] === 'Escalated').length }])}
          ${c.ui.filters('phase', phases, c.state.phase)}${c.ui.table(['Issue', 'Division', 'Phase', 'SLA'], rows.map((r) => [r[0], r[1], r[2], c.ui.chip(r[3], r[3] === 'On track' ? 'ok' : r[3] === 'At risk' ? 'warn' : 'bad')]))}`; },
        report: (c) => `<h4>Issue Analysis Portfolio</h4><div class="mk-grid2"><div class="mk-panel"><h5>Issues by phase</h5>${c.ui.bars([{ label: 'P1', value: 17 }, { label: 'P2', value: 9 }, { label: 'P3', value: 6 }, { label: 'Test', value: 4 }, { label: 'Final', value: 3 }])}</div>
          <div class="mk-panel"><h5>By phase status</h5>${c.ui.donut([{ label: 'On track', value: 15, color: '#0f6cbd' }, { label: 'At risk', value: 4, color: '#f5a524' }, { label: 'Escalated', value: 2, color: '#d9434f' }])}</div></div><p class="mk-note">Sample figures for the demo.</p>`
      },
      actions: { phase: (c, d) => { c.state.phase = d.v; c.render(); } }
    },

    // 4 ─────────────────────────────── Healthcare Member Services on D365 (desktop, D365 look)
    health: {
      basis: 'screens', device: 'desktop', title: 'Member Search · Dynamics 365', user: 'CS',
      theme: { bg: '#f4f4f6', surface: '#ffffff', surface2: '#eceef3', text: '#1f2129', muted: '#5d6170', accent: '#c4472a', 'accent-text': '#fff', line: 'rgba(20,20,40,.12)' },
      nav: [{ go: 'search', icon: 'search', label: 'Member search' }, { go: 'fax', icon: 'flow', label: 'Fax intake flow' }],
      start: 'search',
      state: { results: [], run: [] },
      screens: {
        search: (c) => `<h4>Member search</h4><div class="mk-form" style="--cols:3">${c.ui.field('Member ID', '<input id="mkMid" placeholder="e.g. 100245">')}${c.ui.field('First name', '<input id="mkFn" placeholder="Sample">')}${c.ui.field('Last name', '<input placeholder="Member">')}</div>
          <div class="mk-actions">${c.ui.btn(`${c.ui.icon('search')} Search via custom connector`, 'search', 'pri')}</div>
          <h5>Results</h5>${c.state.results.length ? c.ui.table(['Member ID', 'Name', 'Plan', ''], c.state.results.map((r, i) => [r[0], r[1], r[2], c.ui.btn('Import & create case', 'importMember', 'sm', { i })])) : '<div class="mk-empty">Search to call the member API.</div>'}`,
        fax: (c) => `<h4>Fax intake → Case</h4><div class="mk-actions" style="margin:0 0 12px">${c.ui.btn(`${c.ui.icon('play')} Simulate an incoming fax`, 'runFax', 'pri')}</div><div class="mk-flow">${c.ui.flow(FAX_FLOW, c.state.run)}</div>`
      },
      actions: {
        search: (c) => { c.cancel(); c.toast('Calling getMember…'); c.later(() => { c.state.results = [['100245', 'Sample Member A', 'Gold PPO'], ['100377', 'Sample Member B', 'Silver HMO']]; c.render(); }, 600); },
        importMember: (c, d) => c.toast(`Imported ${c.state.results[d.i][1]}: case CAS-${4800 + Number(d.i)} created`),
        runFax: (c) => { c.cancel(); const out = []; FAX_FLOW.forEach((s, i) => c.later(() => { out[i] = Array.isArray(s) ? ['done', 'skip'] : 'done'; c.state.run = [...out]; c.render(); if (i === FAX_FLOW.length - 1) c.toast('Case created with document metadata'); }, 450 * (i + 1))); }
      }
    },

    // 5 ─────────────────────────────── Product Attribute Search & Reports (desktop)
    attributes: {
      basis: 'screens', device: 'desktop', title: 'Part Finder', user: 'SD',
      theme: { bg: '#f2f2f2', surface: '#ffffff', surface2: '#e9e9ec', text: '#222', muted: '#666', accent: '#c8373e', 'accent-text': '#fff', line: 'rgba(0,0,0,.1)' },
      start: 'search',
      state: { cat: 'Connectors', found: null },
      screens: {
        search: (c) => `<div class="mk-grid2"><div><h4>Search parts</h4><div class="mk-form" style="--cols:1">${c.ui.field('Category', c.ui.select('cat', ['Connectors', 'Relays', 'Fuses'], c.state.cat))}</div>
          <h5>Attributes</h5>${(ATTRS[c.state.cat] || []).map((a) => `<div class="mk-row"><div class="mk-grow"><b>${e(a[0])}</b></div><select aria-label="${e(a[0])} condition" style="width:auto"><option>equal to</option><option>not equal</option></select><select aria-label="${e(a[0])} value" style="width:auto">${a[1].map((o) => `<option>${e(o)}</option>`).join('')}</select></div>`).join('')}
          <div class="mk-actions">${c.ui.btn('Search', 'find', 'pri')}${c.ui.btn('Reset', 'reset')}</div></div>
          <div><div class="mk-panel" style="text-align:center"><b style="font-size:26px;color:var(--mk-accent)">${c.state.found ?? 0}/${c.state.cat === 'Connectors' ? 40 : 25}</b><p>available parts</p></div>
          <h5>Reports</h5>${c.ui.tiles([{ icon: 'doc', label: 'ID card', act: 'report', data: { r: 'ID card' } }, { icon: 'list', label: 'Summary', act: 'report', data: { r: 'Summary' } }, { icon: 'money', label: 'Commercial', act: 'report', data: { r: 'Commercial' } }, { icon: 'gear', label: 'Technical', act: 'report', data: { r: 'Technical' } }], 2)}</div></div>`
      },
      actions: {
        find: (c) => { c.state.found = 3 + Math.floor(Math.random() * 9); c.render(); c.toast(`${c.state.found} matching parts`); },
        reset: (c) => { c.state.found = null; c.render(); },
        report: (c, d) => c.toast(c.state.found ? `${d.r} report generated` : 'Run a search first')
      },
      inputs: { cat: (c, v) => { c.state.cat = v; c.state.found = null; c.render(); } }
    },

    // 6 ─────────────────────────────── Invoice Extraction with AI Builder (desktop)
    invoice: {
      basis: 'screens', device: 'desktop', title: 'Invoice Extract · AI Builder', user: 'SD',
      theme: { bg: '#faf9fb', surface: '#ffffff', surface2: '#f1edf5', text: '#201f24', muted: '#605e6b', accent: '#742774', 'accent-text': '#fff', line: 'rgba(30,20,40,.12)' },
      start: 'model',
      state: { done: false },
      screens: {
        model: (c) => `<div class="mk-grid2"><div class="mk-panel" style="text-align:center"><div style="margin:6px auto 10px;width:120px;height:150px;border-radius:6px;background:repeating-linear-gradient(#fff 0 10px,#eceaf1 10px 12px);box-shadow:0 6px 18px rgba(0,0,0,.12)"></div><b>sample-invoice.pdf</b><div class="mk-actions" style="justify-content:center">${c.ui.btn(`${c.ui.icon('sparkle')} Analyze`, 'analyze', 'pri')}</div></div>
          <div class="mk-panel"><h4>Information to extract</h4>${INVOICE_FIELDS.map((f) => `<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;font-size:12.5px"><span>${e(f[0])}</span><b>${c.state.done ? e(f[1]) : '—'}</b></div>${c.ui.progress(c.state.done ? f[2] : 0)}</div>`).join('')}
          ${c.state.done ? `<div class="mk-actions">${c.ui.btn('Send to Power Automate', 'send', 'pri')}</div>` : ''}</div></div>`
      },
      actions: {
        analyze: (c) => { c.cancel(); c.toast('Analyzing with the custom model…'); c.later(() => { c.state.done = true; c.render(); }, 700); },
        send: (c) => c.toast('Flow started: invoice row created in Dataverse')
      }
    },

    // 7 ─────────────────────────────── Employee Onboarding with AI Builder (desktop, light blue)
    onboarding: {
      basis: 'screens', device: 'desktop', title: 'Employee Onboarding', user: 'HR',
      theme: { bg: '#e9f1fb', surface: '#ffffff', surface2: '#dbe7f7', text: '#13294b', muted: '#4f6487', accent: '#0f6cbd', 'accent-text': '#fff', line: 'rgba(15,40,80,.14)' },
      nav: [{ go: 'form', icon: 'user', label: 'New hire' }, { go: 'passport', icon: 'scan', label: 'Passport' }, { go: 'hr', icon: 'users', label: 'HR review' }],
      start: 'form',
      state: { passport: false, people: [{ n: 'Asha K.', s: 'Submitted' }, { n: 'Rahul S.', s: 'Submitted' }, { n: 'Maria L.', s: 'Approved' }, { n: 'John D.', s: 'Submitted' }] },
      screens: {
        form: (c) => `<h4>New hire details</h4><div class="mk-form" style="--cols:3">${['First name', 'Last name', 'Email', 'Mobile', 'Birthday', 'Department'].map((l) => c.ui.field(l, `<input placeholder="${l === 'Birthday' ? 'dd/mm/yyyy' : ''}">`)).join('')}</div>
          <div class="mk-actions">${c.ui.go('Next: passport', 'passport', 'pri')}</div>`,
        passport: (c) => `<div class="mk-grid2"><div class="mk-panel" style="text-align:center">${c.ui.icon('scan')}<p>Form processor (AI Builder)</p>${c.ui.btn(`${c.ui.icon('sparkle')} Analyze passport`, 'scanPassport', 'pri')}</div>
          <div><h4>Passport details</h4><div class="mk-form" style="--cols:1">${c.ui.field('Passport number', `<input value="${c.state.passport ? 'Z1234567' : ''}">`)}${c.ui.field('Place of birth', `<input value="${c.state.passport ? 'Sample City' : ''}">`)}${c.ui.field('Place of issue', `<input value="${c.state.passport ? 'Sample Office' : ''}">`)}</div>
          <div class="mk-actions">${c.ui.btn('Sign & submit', 'submit', 'pri')}</div></div></div>`,
        hr: (c) => `<h4>HR review</h4><div class="mk-tiles" style="--cols:2">${c.state.people.map((p, i) => `<div class="mk-panel"><b>${e(p.n)}</b> ${c.ui.chip(p.s, toneOf(p.s))}${p.s === 'Submitted' ? `<div class="mk-actions">${c.ui.btn('Approve', 'hrDecide', 'ok sm', { i, v: 'Approved' })}${c.ui.btn('Reject', 'hrDecide', 'bad sm', { i, v: 'Rejected' })}</div>` : ''}</div>`).join('')}</div>`
      },
      actions: {
        scanPassport: (c) => { c.cancel(); c.toast('Reading passport fields…'); c.later(() => { c.state.passport = true; c.render(); c.toast('Fields filled from the document'); }, 700); },
        submit: (c) => { c.state.people.unshift({ n: 'New hire', s: 'Submitted' }); c.go('hr'); c.toast('Submitted for HR approval'); },
        hrDecide: (c, d) => { c.state.people[d.i].s = d.v; c.render(); }
      }
    },

    // 8 ─────────────────────────────── My Expense (phone)
    expense: {
      basis: 'screens', device: 'phone', title: 'My Expenses', user: 'DU',
      theme: { bg: '#eef1f7', surface: '#ffffff', surface2: '#e3e8f2', text: '#14204a', muted: '#5a6585', accent: '#1f3a93', 'accent-text': '#fff', line: 'rgba(20,32,74,.12)' },
      nav: [{ go: 'approvals', icon: 'list', label: 'Approvals' }, { go: 'expenses', icon: 'money', label: 'Expenses' }, { go: 'reports', icon: 'chart', label: 'Reports' }],
      navMap: { detail: 'expenses' },
      start: 'expenses',
      state: { f: 'All', sel: 0, list: [{ t: 'Food bills for site visit', a: 99.75, s: 'Submitted' }, { t: 'Travel to Mumbai', a: 4580, s: 'Approved' }, { t: 'Client dinner', a: 2150, s: 'Draft' }, { t: 'Taxi to airport', a: 760, s: 'Rejected' }, { t: 'Hotel stay', a: 6400, s: 'Submitted' }] },
      screens: {
        expenses: (c) => { const L = c.state.list.filter((x) => c.state.f === 'All' || x.s === c.state.f); const sum = (s) => money(c.state.list.filter((x) => x.s === s).reduce((a, x) => a + x.a, 0));
          return `${c.ui.kpis([{ label: 'Submitted', value: sum('Submitted') }, { label: 'Approved', value: sum('Approved') }], 2)}${c.ui.filters('f', ['All', 'Draft', 'Submitted', 'Approved', 'Rejected'], c.state.f)}
          ${L.map((x) => `<button type="button" class="mk-row" data-act="open" data-i="${c.state.list.indexOf(x)}"><div class="mk-grow"><b>${e(x.t)}</b><small>${money(x.a)}</small></div>${c.ui.chip(x.s, toneOf(x.s))}</button>`).join('') || '<div class="mk-empty">No expenses here.</div>'}
          <div class="mk-actions">${c.ui.btn('+ New expense', 'add', 'pri')}</div>`; },
        detail: (c) => { const x = c.state.list[c.state.sel]; return `<h4>${e(x.t)}</h4>${c.ui.kv([['Amount', money(x.a)], ['Status', c.ui.chip(x.s, toneOf(x.s))], ['Approver', 'T. Anderson'], ['Cost centre', 'Sample CC-12']])}<h5>Receipt</h5><div class="mk-panel">Restaurant receipt · ${money(x.a)}</div>${x.s === 'Draft' ? `<div class="mk-actions">${c.ui.btn('Submit', 'submitX', 'pri')}</div>` : ''}`; },
        approvals: (c) => { const L = c.state.list.filter((x) => x.s === 'Submitted');
          return `<h4>My approvals</h4>${L.map((x) => `<div class="mk-row"><div class="mk-grow"><b>${e(x.t)}</b><small>${money(x.a)}</small></div>${c.ui.btn('✓', 'approve', 'ok sm', { i: c.state.list.indexOf(x), v: 'Approved' })}${c.ui.btn('✕', 'approve', 'bad sm', { i: c.state.list.indexOf(x), v: 'Rejected' })}</div>`).join('') || '<div class="mk-empty">Nothing to approve.</div>'}`; },
        reports: (c) => `<h4>Expenses by category</h4>${c.ui.bars([{ label: 'Travel', value: 2192 }, { label: 'Food', value: 674 }, { label: 'Business', value: 583 }])}<p class="mk-note">Embedded Power BI tile (sample data).</p>`
      },
      actions: {
        f: (c, d) => { c.state.f = d.v; c.render(); },
        open: (c, d) => { c.state.sel = Number(d.i); c.go('detail'); },
        submitX: (c) => { c.state.list[c.state.sel].s = 'Submitted'; c.render(); c.toast('Sent for approval'); },
        approve: (c, d) => { c.state.list[d.i].s = d.v; c.render(); c.toast(d.v); },
        add: (c) => { c.state.list.unshift({ t: 'New expense', a: 350, s: 'Draft' }); c.state.f = 'All'; c.render(); c.toast('Draft created'); }
      }
    },

    // 9 ─────────────────────────────── Royal India Trucks: Sales CPQ (desktop)
    cpq: {
      basis: 'description', device: 'desktop', title: 'Royal India Trucks · CPQ', user: 'RS',
      theme: { bg: '#ededf0', surface: '#ffffff', surface2: '#e2e3e8', text: '#1a1d2b', muted: '#5f6274', accent: '#1d2a6b', 'accent-text': '#fff', line: 'rgba(0,0,0,.1)' },
      nav: [{ go: 'catalogue', icon: 'truck', label: 'Catalogue' }, { go: 'quote', icon: 'money', label: 'Quote' }],
      start: 'catalogue',
      state: { i: 0, engine: 0 },
      screens: {
        catalogue: (c) => { const t = TRUCKS[c.state.i]; return `<div class="mk-grid2"><div class="mk-panel" style="text-align:center"><div style="font-size:54px;line-height:1.2">🚚</div><h4>${e(t.n)}</h4><p>${e(t.d)}</p>
          <div class="mk-actions" style="justify-content:center">${c.ui.btn('‹', 'prev', 'sm')}<span style="align-self:center;font-size:12px">${c.state.i + 1} / ${TRUCKS.length}</span>${c.ui.btn('›', 'next', 'sm')}</div></div>
          <div><h5>Specifications</h5>${c.ui.kv([['Horsepower', t.hp], ['Peak torque', t.tq], ['Max load (kg)', t.load.toLocaleString()], ['Base price', money(t.price)]])}
          <h5>Ratings</h5><div style="font-size:12px">Fuel efficiency ${t.fe}/10</div>${c.ui.progress(t.fe / 10)}<div style="font-size:12px;margin-top:6px">Resale ${t.rs}/10</div>${c.ui.progress(t.rs / 10)}
          <div class="mk-actions">${c.ui.go('Book this truck', 'quote', 'pri')}</div></div></div>`; },
        quote: (c) => { const t = TRUCKS[c.state.i], en = ENGINES[c.state.engine], total = t.price + en.price, cost = total * 0.86;
          return `<h4>Quote · ${e(t.n)}</h4><h5>Select engine</h5>${ENGINES.map((x, k) => `<button type="button" class="mk-row" data-act="engine" data-k="${k}" aria-pressed="${k === c.state.engine}" style="${k === c.state.engine ? 'border-color:var(--mk-accent)' : ''}"><div class="mk-grow"><b>${e(x.n)}</b><small>${x.rpm} rpm · ${x.tq} Nm</small></div><b>+${money(x.price)}</b></button>`).join('')}
          ${c.ui.kpis([{ label: 'Total amount', value: money(total) }, { label: 'Dealer cost', value: money(cost) }, { label: 'Gross profit', value: `${Math.round(((total - cost) / total) * 100)}%` }])}
          <div class="mk-actions">${c.ui.btn('Save booking', 'book', 'pri')}</div><p class="mk-note">Sample prices for the demo.</p>`; }
      },
      actions: {
        prev: (c) => { c.state.i = (c.state.i + TRUCKS.length - 1) % TRUCKS.length; c.render(); },
        next: (c) => { c.state.i = (c.state.i + 1) % TRUCKS.length; c.render(); },
        engine: (c, d) => { c.state.engine = Number(d.k); c.render(); },
        book: (c) => c.toast('Booking saved as Draft · flow notifies sales')
      }
    },

    // 10 ────────────────────────────── Desk & Parking Reservation (phone, purple)
    desk: {
      basis: 'description', device: 'phone', title: 'Desk Booking', user: 'SD',
      theme: { bg: '#f1eef8', surface: '#ffffff', surface2: '#e7e1f3', text: '#24193f', muted: '#655a80', accent: '#7b44c4', 'accent-text': '#fff', line: 'rgba(40,20,80,.12)' },
      nav: [{ go: 'desks', icon: 'desk', label: 'Desks' }, { go: 'cars', icon: 'car', label: 'Car slots' }, { go: 'mine', icon: 'calendar', label: 'My bookings' }],
      start: 'desks',
      state: { desks: [['D-01', 'Normal', ''], ['D-02', 'Normal', 'Booked'], ['D-03', 'Priority', ''], ['D-04', 'Normal', ''], ['D-05', 'Priority', 'Booked'], ['D-06', 'Normal', '']], cars: [['P-1', ''], ['P-2', 'Booked'], ['P-3', ''], ['P-4', '']] },
      screens: {
        desks: (c) => `<h4>Floor 3 · Today</h4><div class="mk-tiles" style="--cols:2">${c.state.desks.map((d, i) => `<button type="button" class="mk-tile" data-act="bookDesk" data-i="${i}">${c.ui.icon('desk')}${d[0]}<small>${d[1]}</small>${d[2] ? c.ui.chip(d[2] === 'Mine' ? 'Booked by you' : d[2], d[2] === 'Mine' ? 'acc' : toneOf(d[2])) : c.ui.chip('Free', 'ok')}</button>`).join('')}</div>`,
        cars: (c) => `<h4>Car slots</h4>${c.state.cars.map((p, i) => `<div class="mk-row"><div class="mk-grow"><b>${p[0]}</b><small>${p[1] ? (p[1] === 'Mine' ? 'Booked by you' : 'Taken') : 'Free'}</small></div>${p[1] ? '' : c.ui.btn('Book', 'bookCar', 'pri sm', { i })}</div>`).join('')}`,
        mine: (c) => { const mine = [...c.state.desks.filter((d) => d[2] === 'Mine').map((d) => d[0]), ...c.state.cars.filter((p) => p[1] === 'Mine').map((p) => p[0])];
          return `<h4>My bookings</h4>${mine.map((m) => `<div class="mk-row"><div class="mk-grow"><b>${m}</b><small>Today</small></div>${c.ui.btn('Check in', 'checkin', 'ok sm', { m })}</div>`).join('') || '<div class="mk-empty">No bookings yet. Tap a free desk.</div>'}`; }
      },
      actions: {
        bookDesk: (c, d) => { const desk = c.state.desks[d.i]; if (desk[2] && desk[2] !== 'Mine') return c.toast(`${desk[0]} is already booked`); desk[2] = desk[2] ? '' : 'Mine'; c.render(); c.toast(desk[2] ? `${desk[0]} booked` : `${desk[0]} released`); },
        bookCar: (c, d) => { c.state.cars[d.i][1] = 'Mine'; c.render(); c.toast(`${c.state.cars[d.i][0]} booked`); },
        checkin: (c, d) => c.toast(`Checked in to ${d.m}`)
      }
    },

    // 11 ────────────────────────────── HR Training & Onboarding Hub (desktop)
    hr: {
      basis: 'description', device: 'desktop', title: 'People Hub', user: 'HR',
      theme: { bg: '#f3f4f6', surface: '#ffffff', surface2: '#eceef5', text: '#1d1f2b', muted: '#5c6072', accent: '#9b2fae', 'accent-text': '#fff', line: 'rgba(0,0,0,.1)' },
      nav: [{ go: 'board', icon: 'users', label: 'Onboarding board' }, { go: 'training', icon: 'doc', label: 'Training requests' }, { go: 'activity', icon: 'chart', label: 'My activity' }],
      start: 'board',
      state: { cols: { 'In progress': ['Emma C.', 'Arjun P.'], Hired: ['James A.'], Training: ['Olivia B.', 'Mason D.'] }, reqs: [{ t: 'Power Apps with SharePoint', by: 'Arjun P.', s: 'Pending' }, { t: 'Advanced D365 customization', by: 'Emma C.', s: 'Pending' }] },
      screens: {
        board: (c) => `<h4>Onboarding board</h4><p>Click a person to move them to the next stage.</p><div class="mk-kanban">${Object.entries(c.state.cols).map(([col, people]) => `<div class="mk-col"><h5>${e(col)} · ${people.length}</h5>${people.map((p) => `<button type="button" class="mk-card" data-act="move" data-p="${e(p)}" data-c="${e(col)}" style="width:100%;text-align:left;cursor:pointer;color:inherit"><b>${e(p)}</b><small>Start: sample date</small></button>`).join('')}</div>`).join('')}</div>`,
        training: (c) => `<h4>Training requests</h4>${c.state.reqs.map((r, i) => `<div class="mk-row"><div class="mk-grow"><b>${e(r.t)}</b><small>Requested by ${e(r.by)} · manager → HR</small></div>${c.ui.chip(r.s, toneOf(r.s))}${r.s === 'Pending' ? c.ui.btn('Approve', 'train', 'ok sm', { i, v: 'Approved' }) + c.ui.btn('Reject', 'train', 'bad sm', { i, v: 'Rejected' }) : ''}</div>`).join('')}`,
        activity: (c) => { const done = c.state.reqs.filter((r) => r.s === 'Approved').length; return `<h4>My activity</h4>${c.ui.kpis([{ label: 'Trainings approved', value: done }, { label: 'Remaining', value: c.state.reqs.length - done }])}${c.ui.progress(done / c.state.reqs.length)}`; }
      },
      actions: {
        move: (c, d) => { const order = ['In progress', 'Hired', 'Training']; const next = order[(order.indexOf(d.c) + 1) % order.length]; c.state.cols[d.c] = c.state.cols[d.c].filter((p) => p !== d.p); c.state.cols[next].push(d.p); c.render(); c.toast(`${d.p} → ${next}`); },
        train: (c, d) => { c.state.reqs[d.i].s = d.v; c.render(); c.toast(`${d.v}: email sent with options`); }
      }
    },

    // 12 ────────────────────────────── Timesheet, Calendar & Utility apps (desktop)
    utility: {
      basis: 'description', device: 'desktop', title: 'Utility Apps', user: 'SD',
      theme: { bg: '#eef2fb', surface: '#ffffff', surface2: '#e2e8f6', text: '#16213d', muted: '#56627f', accent: '#2a52d4', 'accent-text': '#fff', line: 'rgba(20,30,70,.12)' },
      nav: [{ go: 'timesheet', icon: 'clock', label: 'Timesheet' }, { go: 'calendar', icon: 'calendar', label: 'Calendar' }, { go: 'todo', icon: 'check', label: 'To-do' }],
      start: 'timesheet',
      state: { hours: [8, 8, 7, 8, 0, 0, 8, 8, 8, 6, 0, 0, 8, 8], day: 25, todos: [{ t: 'Prepare sprint demo', d: false }, { t: 'Review flow failures', d: true }] },
      screens: {
        timesheet: (c) => `<h4>Fortnightly timesheet</h4><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">${c.state.hours.map((h, i) => `<label class="mk-field" style="text-align:center">D${i + 1}<input type="number" min="0" max="12" data-in="hour" data-i="${i}" value="${h}" style="text-align:center;padding:6px 2px" aria-label="Day ${i + 1} hours"></label>`).join('')}</div><div data-tot style="margin-top:12px">${tsTotal(c)}</div>
          <div class="mk-actions">${c.ui.btn('Submit for approval', 'tsSubmit', 'pri')}</div>`,
        calendar: (c) => `<div class="mk-grid2"><div><h4>January · events</h4>${c.ui.calendar(2026, 0, CAL_EVENTS, c.state.day)}</div><div class="mk-panel"><h5>${c.state.day} January</h5>${CAL_EVENTS[c.state.day] ? `<b>${e(CAL_EVENTS[c.state.day])}</b><p>Synced from a SharePoint events list.</p>` : '<p>No events this day.</p>'}</div></div>`,
        todo: (c) => `<h4>My tasks</h4><div class="mk-search">${c.ui.icon('plus')}<input id="mkTodo" placeholder="Add a task and press Add" aria-label="New task"></div>${c.ui.btn('Add', 'addTodo', 'pri sm')}<div style="margin-top:10px">${c.state.todos.map((t, i) => `<button type="button" class="mk-row" data-act="toggleTodo" data-i="${i}"><span>${t.d ? '☑' : '☐'}</span><div class="mk-grow"><b style="${t.d ? 'text-decoration:line-through;opacity:.6' : ''}">${e(t.t)}</b></div></button>`).join('')}</div>`
      },
      actions: {
        tsSubmit: (c) => c.toast('Timesheet sent to approver'),
        pickDay: (c, d) => { c.state.day = Number(d.d); c.render(); },
        addTodo: (c) => { const v = document.getElementById('mkTodo')?.value.trim(); if (!v) return c.toast('Type a task first'); c.state.todos.unshift({ t: v, d: false }); c.render(); },
        toggleTodo: (c, d) => { c.state.todos[d.i].d = !c.state.todos[d.i].d; c.render(); }
      },
      inputs: { hour: (c, v, el) => { c.state.hours[el.dataset.i] = Math.max(0, Math.min(12, Number(v) || 0)); c.patch('[data-tot]', tsTotal(c)); } }
    },

    // 13 ────────────────────────────── PSA Activity Generation (desktop, Power Automate)
    psa: {
      basis: 'description', device: 'desktop', title: 'Power Automate · Activity Generation', user: 'SD',
      theme: { bg: '#f5f6f8', surface: '#ffffff', surface2: '#eceef3', text: '#1c1f26', muted: '#5f6470', accent: '#0f6cbd', 'accent-text': '#fff', line: 'rgba(0,0,0,.1)' },
      start: 'flow',
      state: { run: [], acts: [] },
      screens: {
        flow: (c) => `<div class="mk-grid2"><div><h4>Parent flow</h4><div class="mk-actions" style="margin:0 0 12px">${c.ui.btn(`${c.ui.icon('play')} Generate 7 days`, 'gen', 'pri')}</div><div class="mk-flow">${c.ui.flow(PSA_FLOW, c.state.run)}</div></div>
          <div><h4>Generated activities</h4>${c.state.acts.map((a) => `<div class="mk-row"><div class="mk-grow"><b>${a.d}</b><small>${a.h ? 'Holiday or weekend: skipped by child flow' : 'Scheduled activity created'}</small></div>${c.ui.chip(a.h ? 'Skipped' : 'Created', a.h ? '' : 'ok')}</div>`).join('') || '<div class="mk-empty">Run the flow to generate activities.</div>'}
          <p class="mk-note">The holiday check runs in a child flow to stay under the 8-level nesting limit.</p></div></div>`
      },
      actions: {
        gen: (c) => { c.cancel(); c.state.acts = []; c.state.run = []; c.render(); const days = ['Mon 5', 'Tue 6', 'Wed 7', 'Thu 8', 'Fri 9', 'Sat 10', 'Sun 11'];
          PSA_FLOW.forEach((s, i) => c.later(() => { c.state.run[i] = 'done'; c.render(); }, 350 * (i + 1)));
          days.forEach((d, k) => c.later(() => { c.state.acts.push({ d, h: k >= 5 }); c.render(); if (k === days.length - 1) c.toast('5 activities created, 2 skipped'); }, 350 * PSA_FLOW.length + 220 * (k + 1))); }
      }
    },

    // 14 ────────────────────────────── SharePoint Document Viewer (desktop)
    docviewer: {
      basis: 'description', device: 'desktop', title: 'Document Viewer', user: 'SD',
      theme: { bg: '#f3f6f6', surface: '#ffffff', surface2: '#e5eeee', text: '#152523', muted: '#566966', accent: '#03787c', 'accent-text': '#fff', line: 'rgba(0,40,40,.12)' },
      start: 'viewer',
      state: { folder: 'My folder', open: 0, files: { 'My folder': ['Offer letter.pdf', 'Policy handbook.pdf', 'Expense rules.docx'], Shared: ['Team charter.pdf', 'Q3 plan.pptx'] } },
      screens: {
        viewer: (c) => { const files = c.state.files[c.state.folder]; const f = files[c.state.open] || files[0];
          return `<div style="display:grid;grid-template-columns:150px 1fr 1.4fr;gap:12px;height:100%"><div>${Object.keys(c.state.files).map((k) => `<button type="button" class="mk-row" data-act="folder" data-f="${e(k)}" style="${k === c.state.folder ? 'border-color:var(--mk-accent)' : ''}">${c.ui.icon('folder')}<b>${e(k)}</b></button>`).join('')}<div class="mk-actions">${c.ui.btn(`${c.ui.icon('upload')} Upload`, 'upload', 'pri sm')}</div></div>
          <div>${files.map((x, i) => `<button type="button" class="mk-row" data-act="openFile" data-i="${i}" style="${i === c.state.open ? 'border-color:var(--mk-accent)' : ''}">${c.ui.icon('doc')}<div class="mk-grow"><b>${e(x)}</b><small>SharePoint library</small></div></button>`).join('')}</div>
          <div class="mk-panel"><h5>${e(f)}</h5><div style="height:180px;border-radius:6px;background:repeating-linear-gradient(#fff 0 12px,#eef2f2 12px 14px);border:1px solid var(--mk-line)"></div><p class="mk-note">PDF viewer control · page 1 of 3</p></div></div>`; }
      },
      actions: {
        folder: (c, d) => { c.state.folder = d.f; c.state.open = 0; c.render(); },
        openFile: (c, d) => { c.state.open = Number(d.i); c.render(); },
        upload: (c) => { c.state.files[c.state.folder].push(`Upload ${c.state.files[c.state.folder].length + 1}.pdf`); c.render(); c.toast('Uploaded to your folder'); }
      }
    },

    // 15 ────────────────────────────── Exemption Request Application (desktop)
    exemption: {
      basis: 'description', device: 'desktop', title: 'Exemption Requests', user: 'SD',
      theme: { bg: '#f4f5f9', surface: '#ffffff', surface2: '#e8eaf3', text: '#1a1d2e', muted: '#5b6077', accent: '#3d4bd6', 'accent-text': '#fff', line: 'rgba(0,0,0,.1)' },
      nav: [{ go: 'request', icon: 'doc', label: 'New request' }, { go: 'track', icon: 'shield', label: 'Track' }],
      start: 'request',
      state: { stage: -1 },
      screens: {
        request: (c) => `<h4>New exemption request</h4><div class="mk-form">${c.ui.field('Exemption type', c.ui.select('type', ['Software install', 'Network access', 'Data export'], 'Software install'))}${c.ui.field('Duration', c.ui.select('dur', ['30 days', '90 days', '180 days'], '90 days'))}${c.ui.field('Business justification', '<textarea placeholder="Why is this needed?"></textarea>', true)}</div>
          <div class="mk-actions">${c.ui.btn('Submit request', 'submitReq', 'pri')}</div><p class="mk-note">Who can approve is controlled by Azure AD groups.</p>`,
        track: (c) => `<h4>Request status</h4>${c.state.stage < 0 ? '<div class="mk-empty">No request yet. Submit one first.</div>' : `<div class="mk-flow">${c.ui.flow(EX_STAGES, EX_STAGES.map((_, i) => (i < c.state.stage ? 'done' : i === c.state.stage ? 'run' : '')))}</div>
          ${c.state.stage < EX_STAGES.length ? `<div class="mk-actions" style="justify-content:center">${c.ui.btn('Approve current step', 'advance', 'ok')}</div>` : '<div class="mk-empty">Approved: exemption active for the selected period.</div>'}`}`
      },
      actions: {
        submitReq: (c) => { c.state.stage = 1; c.go('track'); c.toast('Submitted · flow notified your manager'); },
        advance: (c) => { c.state.stage += 1; c.render(); c.toast(c.state.stage >= EX_STAGES.length ? 'Request approved' : 'Moved to the next approver'); }
      }
    },

    // 16 ────────────────────────────── Vaccine Slot Alert (phone)
    vaccine: {
      basis: 'description', device: 'phone', title: 'Slot Alert', user: 'SD',
      theme: { bg: '#eef7f4', surface: '#ffffff', surface2: '#dcefe8', text: '#11352b', muted: '#4d6b62', accent: '#0e8a64', 'accent-text': '#fff', line: 'rgba(10,60,40,.12)' },
      start: 'register',
      state: { on: false, slots: [] },
      screens: {
        register: (c) => `<h4>Get slot alerts</h4><div class="mk-form" style="--cols:1">${c.ui.field('PIN code', '<input inputmode="numeric" placeholder="e.g. 201301">')}${c.ui.field('Age group', c.ui.select('age', ['18–44', '45+'], '18–44'))}</div>
          <div class="mk-actions">${c.ui.btn(c.state.on ? 'Alerts on ✓' : 'Turn on alerts', 'alerts', 'pri')}</div>
          <h5>Open slots</h5>${c.state.slots.map((s) => `<div class="mk-row">${c.ui.icon('bell')}<div class="mk-grow"><b>${e(s.c)}</b><small>${s.n} doses · ${e(s.d)}</small></div>${c.ui.chip('Open', 'ok')}</div>`).join('') || `<div class="mk-empty">${c.state.on ? 'Watching for slots…' : 'Turn on alerts to start watching.'}</div>`}`
      },
      actions: {
        alerts: (c) => { if (c.state.on) return; c.state.on = true; c.render(); c.toast('Power Automate is checking every few minutes');
          [{ c: 'Sample Health Centre', n: 40, d: 'Tomorrow' }, { c: 'Community Hospital', n: 12, d: 'Friday' }].forEach((s, i) => c.later(() => { c.state.slots.push(s); c.render(); c.toast(`🔔 New slot: ${s.c}`); }, 1400 * (i + 1))); }
      }
    }
  };

  // ---------- shared sample data and small helpers ----------
  function chemList(c) {
    const q = c.state.q.toLowerCase();
    return c.state.chemicals.filter((x) => x.toLowerCase().includes(q)).map((x) => `<div class="mk-row"><div class="mk-grow"><b>${e(x)}</b></div></div>`).join('') || '<div class="mk-empty">No matches</div>';
  }
  function pickTable(c) {
    const s = c.state.sqft, warm = c.state.season === 'Summer' ? 1 : 1.12, flakeCover = { '1/4': 350, '1/8': 280, '1/16': 200 }[c.state.flake];
    const rows = [['Flake', `${Math.ceil(s / flakeCover)} box(es)`], ['Base A', `${(s / 160 * warm).toFixed(1)} lb`], ['Base B', `${(s / 320 * warm).toFixed(1)} lb`], ['Top A', `${(s / 200 * warm).toFixed(1)} lb`], ['Top B', `${(s / 400 * warm).toFixed(1)} lb`]];
    return ui.table(['Product', 'Amount to pull'], rows);
  }
  function tsTotal(c) { const t = c.state.hours.reduce((a, h) => a + h, 0); return `<b>${t} h</b> worked of 80 h available ${ui.progress(t / 80)}`; }
  function runSteps(c, count, done) { c.cancel(); c.state.run = []; c.render(); for (let i = 0; i < count; i++) c.later(() => { c.state.run[i] = 'done'; c.render(); if (i === count - 1) c.toast(done); }, 450 * (i + 1)); }

  const TRACKER_FLOW = [{ name: 'When a file is created in the library', icon: 'folder' }, { name: 'Create Jira issue (HTTP)', icon: 'web' }, { name: 'Get approvers for the channel', icon: 'users' }, { name: 'Start and wait for an approval', icon: 'check' }, { name: 'Update status + notify requestor', icon: 'mail' }];
  const FAX_FLOW = [{ name: 'When a fax arrives (SharePoint)', icon: 'doc' }, { name: 'List member records (Dataverse)', icon: 'db' }, [{ name: 'General fax → create case', icon: 'check' }, { name: 'Auth fax → create case', icon: 'shield' }], { name: 'Create document metadata', icon: 'db' }];
  const PSA_FLOW = [{ name: 'Recurrence trigger', icon: 'clock' }, { name: 'Get activity generation rules', icon: 'db' }, { name: 'Run child flow: holiday check', icon: 'flow' }, { name: 'Create scheduled activities', icon: 'calendar' }];
  const EX_STAGES = [{ name: 'Submitted', icon: 'doc' }, { name: 'Line manager approval', icon: 'user' }, { name: 'Security team approval', icon: 'shield' }, { name: 'Access granted via AD group', icon: 'check' }];
  const INVOICE_FIELDS = [['Invoice subject', 'Monthly service', 0.97], ['Date', '12/03/2023', 0.99], ['Service name', 'Cloud hosting', 0.92], ['Amount', '1,240.00', 0.98], ['Currency', 'ILS', 0.95], ['Description', 'Hosting + support', 0.88]];
  const ATTRS = { Connectors: [['Gender', ['Male', 'Female']], ['Hybrid poles', ['Yes', 'No']], ['Pin rows', ['1', '2', '3']], ['Sealed', ['Yes', 'No']], ['Terminal size', ['0.64', '1.5', '2.8']]], Relays: [['Coil voltage', ['12 V', '24 V']], ['Contacts', ['SPDT', 'DPDT']]], Fuses: [['Rating', ['5 A', '10 A', '20 A']], ['Type', ['Blade', 'Cartridge']]] };
  const TRUCKS = [{ n: 'Canis Major', d: 'Electric + hydrogen pickup', hp: 389, tq: 1289, load: 13600, price: 4200000, fe: 9, rs: 8 }, { n: 'Orion Hauler', d: 'Heavy-duty diesel tractor', hp: 520, tq: 2500, load: 40000, price: 6800000, fe: 6, rs: 7 }, { n: 'Lyra City', d: 'Light urban delivery truck', hp: 180, tq: 620, load: 3500, price: 1900000, fe: 8, rs: 6 }];
  const ENGINES = [{ n: 'Holmberg 15A', rpm: 16000, tq: 5000, price: 380000 }, { n: 'Messier 87', rpm: 15980, tq: 4703, price: 310000 }, { n: 'Cygnus A', rpm: 17890, tq: 4999, price: 450000 }];
  const CAL_EVENTS = { 6: 'Sprint planning', 13: 'Release review', 20: 'Team offsite', 25: 'Calendar app demo', 26: 'Weekly view rollout' };

  return apps;
})();
