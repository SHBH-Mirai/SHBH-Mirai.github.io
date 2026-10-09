// exact-c.js: designed apps for projects whose screenshots show settings pages rather than the app itself
// (Issue approvals, Member services on D365, Invoice inbox), plus the Royal India Trucks CPQ rebuilt from its real screens.
// Built from each project's description and real data model (list columns, extracted fields). Sample data only.
(() => {
  const M = window.MockKit && window.MOCKUPS;
  if (!M) return;
  const e = window.MockKit.esc;
  const ic = (p, s = 18, w = 1.8) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const I = {
    plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="M5 12l5 5 9-10"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', ask: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01"/>',
    file: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>', link: '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>', save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7M8 20v-6h8v6"/>', back: '<path d="M15 6l-6 6 6 6"/>',
    home: '<path d="M4 11l8-7 8 7v9H4z"/>', grid: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>', case: '<path d="M4 8h16v11H4z"/><path d="M9 8V5h6v3"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>',
    fax: '<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="9" rx="1"/><path d="M8 14h8v7H8z"/>', cloud: '<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z"/><path d="M12 11v6M9 14l3 3 3-3"/>', flow: '<path d="M4 6h6v4H4zM14 14h6v4h-6z"/><path d="M7 10v4a2 2 0 0 0 2 2h5"/>',
    up: '<path d="M12 16V5M7 10l5-5 5 5M5 19h14"/>', send: '<path d="M4 12l16-8-6 16-3-7z"/>', star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>', truck: '<path d="M2 7h11v9H2zM13 10h5l3 3v3h-8z"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>'
  };

  // ───────────────────────── 02 · Issue approvals (Canvas app) ─────────────────────────
  // Data model = the real SharePoint columns: Title, Description, Jira Issue URL, Status, Priority, Channel,
  // Approver/Requestor Response, Approvers per channel.
  const APPROVERS = { Finance: ['Rohan Iyer', 'Meera Khan'], Infrastructure: ['Dev Patel'], 'HR Systems': ['Sara Thomas', 'Ali Raza'], Security: ['Nina George'] };
  const now = () => new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const doc = (id, title, desc, jira, status, priority, channel, requester, log) => ({ id, title, desc, jira, status, priority, channel, requester, log });
  M.tracker = {
    basis: 'description', device: 'desktop', title: 'Issue Approvals', cls: 'xr', size: [1366, 768], start: 'list',
    state: {
      role: 'approver', sel: 0, filter: 'All', q: '', cmt: '', newDoc: { file: '', channel: 'Finance', priority: 'Medium', desc: '' }, steps: [],
      docs: [
        doc('DOC-1042', 'Vendor contract renewal.pdf', 'Annual renewal for the payroll vendor. Pricing changed by 6%; needs Finance sign-off before 30 Oct.', 'IT-2317', 'Pending', 'High', 'Finance', 'Asha Menon', [['Asha Menon', 'Requestor', 'Uploaded for approval', '07 Oct, 10:12']]),
        doc('DOC-1039', 'Firewall rule change.docx', 'Open port 8443 for the new reporting gateway in the DMZ.', 'IT-2309', 'More info', 'Critical', 'Security', 'Karan Shah', [['Karan Shah', 'Requestor', 'Uploaded for approval', '06 Oct, 15:40'], ['Nina George', 'Approver', 'Which subnet will the gateway sit in?', '06 Oct, 17:02']]),
        doc('DOC-1035', 'Laptop refresh batch 3.xlsx', '48 laptops for the support team, replacing 2019 models.', 'IT-2298', 'Approved', 'Medium', 'Infrastructure', 'Asha Menon', [['Asha Menon', 'Requestor', 'Uploaded for approval', '04 Oct, 09:30'], ['Dev Patel', 'Approver', 'Approved. Stagger delivery over 2 weeks.', '04 Oct, 12:15']]),
        doc('DOC-1031', 'Onboarding checklist v4.docx', 'Adds the new security-awareness module to week 1.', 'IT-2291', 'Rejected', 'Low', 'HR Systems', 'Leo Fernandes', [['Leo Fernandes', 'Requestor', 'Uploaded for approval', '02 Oct, 11:05'], ['Sara Thomas', 'Approver', 'Rejected: module not signed off by Legal yet.', '03 Oct, 16:48']]),
        doc('DOC-1028', 'Backup retention policy.pdf', 'Move from 30 to 90 days retention for finance shares.', 'IT-2284', 'Pending', 'Medium', 'Infrastructure', 'Karan Shah', [['Karan Shah', 'Requestor', 'Uploaded for approval', '01 Oct, 14:22']])
      ]
    },
    screens: {
      list: (c) => {
        const s = c.state, me = s.role === 'approver' ? 'Rohan Iyer' : 'Asha Menon';
        const mine = s.docs.filter((d) => (s.role === 'approver' ? true : d.requester === me));
        const L = mine.filter((d) => (s.filter === 'All' || d.status === s.filter) && (d.title + d.jira).toLowerCase().includes(s.q.toLowerCase()));
        const d = s.docs[s.sel] || L[0];
        const count = (st) => mine.filter((x) => x.status === st).length;
        return `${trHead(c)}
        <div class="kp">${[['Pending', 'Waiting on approvers'], ['More info', 'Need a reply'], ['Approved', 'This month'], ['Rejected', 'This month']].map(([k, sub]) => `<button class="kc ${k === s.filter ? 'act' : ''}" data-act="filter" data-v="${k}"><b>${count(k)}</b><span>${k}</span><small>${sub}</small></button>`).join('')}</div>
        <div class="lst"><div class="lsh"><span class="sbx">${ic(I.search, 16)}<input placeholder="Search title or Jira key" data-in="q" value="${e(s.q)}" aria-label="Search"></span><button class="${s.filter === 'All' ? 'act' : ''} lnk" data-act="filter" data-v="All">All</button></div>
          <div class="gal">${L.map((x) => `<button class="it ${x === d ? 'act' : ''}" data-act="pick" data-i="${s.docs.indexOf(x)}"><span class="pr p${x.priority[0]}"></span><b>${e(x.title)}</b><small>${x.jira} · ${x.channel}</small><em class="st s${x.status[0]}">${x.status}</em></button>`).join('') || '<p class="nil">Nothing here</p>'}</div></div>
        ${d ? detail(c, d) : '<div class="det"><p class="nil">Select a document</p></div>'}`;
      },
      new: (c) => { const n = c.state.newDoc, s = c.state;
        return `${trHead(c)}<div class="nw"><h2>New approval request</h2><p class="sub">Uploading a file to the library starts the flows: Jira ticket → channel approvers → outcome.</p>
        <div class="drop ${n.file ? 'has' : ''}">${ic(I.up, 30)}<b>${n.file ? e(n.file) : 'Choose a document'}</b><span>${['Budget variance Q3.xlsx', 'Access request - SAP.docx', 'DR test report.pdf'].map((f) => `<button data-act="pickFile" data-v="${f}">${f}</button>`).join('')}</span></div>
        <div class="fg"><label>Channel<select data-in="nd" data-k="channel">${Object.keys(APPROVERS).map((k) => `<option${k === n.channel ? ' selected' : ''}>${k}</option>`).join('')}</select></label>
        <label>Priority<select data-in="nd" data-k="priority">${['Low', 'Medium', 'High', 'Critical'].map((k) => `<option${k === n.priority ? ' selected' : ''}>${k}</option>`).join('')}</select></label>
        <label class="w">Description<textarea data-in="nd" data-k="desc" rows="3">${e(n.desc)}</textarea></label>
        <p class="ap">Approvers for <b>${n.channel}</b>: ${APPROVERS[n.channel].map((a) => `<span class="chip">${a}</span>`).join('')}</p></div>
        <div class="flowv">${['File saved to document library', 'Jira ticket created', `Sent to ${n.channel} approvers`].map((t, i) => `<div class="fs ${s.steps.length > i ? 'done' : ''}"><i>${s.steps.length > i ? ic(I.check, 14, 3) : i + 1}</i><span>${t}${s.steps[i] ? ` <b>${s.steps[i]}</b>` : ''}</span></div>`).join('')}</div>
        <div class="acts"><button class="ghost" data-go="list">Cancel</button><button class="pri" data-act="submit">${ic(I.send, 16)} Submit for approval</button></div></div>`; }
    },
    actions: {
      role: (c, d) => { c.state.role = d.v; c.state.filter = 'All'; c.state.sel = d.v === 'approver' ? 0 : 0; c.render(); },
      filter: (c, d) => { c.state.filter = d.v; c.render(); },
      pick: (c, d) => { c.state.sel = Number(d.i); c.state.cmt = ''; c.render(); },
      decide: (c, d) => {
        const x = c.state.docs[c.state.sel], txt = c.state.cmt.trim();
        if (d.v !== 'Approved' && !txt) return c.toast('Add a comment first');
        x.status = d.v; x.log.push([c.state.role === 'approver' ? 'Rohan Iyer' : x.requester, c.state.role === 'approver' ? 'Approver' : 'Requestor', txt || 'Approved', now()]);
        c.state.cmt = ''; c.render(); c.toast(d.v === 'More info' ? 'Question sent to the requestor (Teams + email)' : `${d.v}: Jira ${x.jira} updated by the outcome flow`);
      },
      reply: (c) => { const x = c.state.docs[c.state.sel], txt = c.state.cmt.trim(); if (!txt) return c.toast('Write a reply first'); x.status = 'Pending'; x.log.push([x.requester, 'Requestor', txt, now()]); c.state.cmt = ''; c.render(); c.toast('Reply sent: back with the approvers'); },
      pickFile: (c, d) => { c.state.newDoc.file = d.v; c.render(); },
      submit: (c) => {
        const n = c.state.newDoc; if (!n.file) return c.toast('Choose a document first');
        if (c.state.steps.length) return; c.cancel();
        const key = `IT-${2318 + c.state.docs.length - 5}`;
        [['', 500], [key, 1100], [`(${APPROVERS[n.channel].length})`, 1700]].forEach(([t, ms]) => c.later(() => { c.state.steps.push(t); c.render(); }, ms));
        c.later(() => {
          c.state.docs.unshift(doc(`DOC-${1043 + c.state.docs.length - 5}`, n.file, n.desc || 'No description', key, 'Pending', n.priority, n.channel, 'Asha Menon', [['Asha Menon', 'Requestor', 'Uploaded for approval', now()]]));
          Object.assign(c.state, { sel: 0, filter: 'All', steps: [], role: 'requester', newDoc: { file: '', channel: 'Finance', priority: 'Medium', desc: '' } });
          c.go('list'); c.toast(`${key} created and sent for approval`);
        }, 2300);
      }
    },
    inputs: { q: (c, v) => { c.state.q = v; c.patch('.gal', ''); c.render(); }, cmt: (c, v) => { c.state.cmt = v; }, nd: (c, v, el) => { c.state.newDoc[el.dataset.k] = v; if (el.dataset.k === 'channel') c.render(); } },
    css: `
.xr{background:#f5f6f8;color:#1f2430;font-family:"Segoe UI",system-ui,sans-serif;position:relative}
.xr button{font:inherit;cursor:pointer}
.xr .hdr{height:56px;background:#1f3a8a;color:#fff;display:flex;align-items:center;padding:0 22px;gap:14px}
.xr .hdr h1{margin:0;font-size:19px;font-weight:600}.xr .hdr .lg{width:30px;height:30px;border-radius:7px;background:#fff;color:#1f3a8a;display:grid;place-items:center}
.xr .seg{margin-left:28px;display:flex;background:rgba(255,255,255,.14);border-radius:8px;padding:3px}.xr .seg button{border:0;background:none;color:#dfe6ff;padding:6px 14px;border-radius:6px;font-size:13px}.xr .seg .act{background:#fff;color:#1f3a8a;font-weight:600}
.xr .hdr .nb{margin-left:auto;border:0;border-radius:8px;background:#ffb020;color:#1f2430;font-weight:600;font-size:13px;padding:8px 14px;display:flex;gap:6px;align-items:center}
.xr .me{display:flex;align-items:center;gap:8px;font-size:13px}.xr .me i{width:32px;height:32px;border-radius:50%;background:#9db4ff;color:#1f3a8a;font-style:normal;font-weight:700;display:grid;place-items:center}
.xr .kp{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:16px 22px 0}
.xr .kc{border:1px solid #e3e6ee;background:#fff;border-radius:10px;text-align:left;padding:10px 14px;display:grid;grid-template-columns:auto 1fr;column-gap:12px;align-items:center}
.xr .kc b{grid-row:1/3;font-size:28px;font-weight:600;color:#1f3a8a}.xr .kc span{font-weight:600;font-size:14px}.xr .kc small{color:#69718a;font-size:12px}.xr .kc.act{border-color:#1f3a8a;box-shadow:0 0 0 2px #c9d4ff}
.xr .lst{position:absolute;left:22px;top:150px;width:420px;bottom:18px;background:#fff;border:1px solid #e3e6ee;border-radius:10px;display:flex;flex-direction:column;overflow:hidden}
.xr .lsh{display:flex;gap:8px;padding:12px;border-bottom:1px solid #eef0f5}.xr .sbx{flex:1;display:flex;align-items:center;gap:6px;border:1px solid #d6dae5;border-radius:8px;padding:0 10px;color:#69718a}.xr .sbx input{border:0;outline:0;flex:1;height:32px;font:13px "Segoe UI",sans-serif}
.xr .lnk{border:1px solid #d6dae5;background:#fff;border-radius:8px;padding:0 14px;font-size:13px}.xr .lnk.act{background:#1f3a8a;color:#fff;border-color:#1f3a8a}
.xr .gal{overflow:auto;flex:1}
.xr .it{display:grid;grid-template-columns:6px 1fr auto;grid-template-rows:auto auto;column-gap:12px;width:100%;border:0;border-bottom:1px solid #eef0f5;background:#fff;text-align:left;padding:12px 14px 12px 0}
.xr .it:hover{background:#f7f9ff}.xr .it.act{background:#eef2ff}
.xr .pr{grid-row:1/3;border-radius:0 4px 4px 0}.xr .pC{background:#d92d20}.xr .pH{background:#f79009}.xr .pM{background:#2e90fa}.xr .pL{background:#98a2b3}
.xr .it b{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.xr .it small{grid-column:2;color:#69718a;font-size:12px}
.xr .st{grid-row:1/3;grid-column:3;align-self:center;font-style:normal;font-size:11.5px;font-weight:600;border-radius:999px;padding:3px 10px}
.xr .sP{background:#fff4e5;color:#b54708}.xr .sM{background:#f4ebff;color:#6941c6}.xr .sA{background:#e7f8ef;color:#067647}.xr .sR{background:#fdecec;color:#b42318}
.xr .det{position:absolute;left:458px;right:22px;top:150px;bottom:18px;background:#fff;border:1px solid #e3e6ee;border-radius:10px;padding:18px 22px;display:grid;grid-template-columns:1fr 330px;grid-template-rows:auto 1fr;column-gap:24px;overflow:hidden}
.xr .dh{grid-column:1/-1;display:flex;align-items:center;gap:12px;border-bottom:1px solid #eef0f5;padding-bottom:12px;margin-bottom:12px}.xr .dh h2{margin:0;font-size:19px;font-weight:600}.xr .dh .st{margin-left:auto}
.xr .jl{display:inline-flex;gap:5px;align-items:center;font-size:12.5px;color:#1f3a8a;background:#eef2ff;border-radius:6px;padding:3px 8px;text-decoration:none}
.xr dl{display:grid;grid-template-columns:110px 1fr;row-gap:9px;margin:0 0 12px;font-size:13.5px}.xr dt{color:#69718a}.xr dd{margin:0;font-weight:600}
.xr .ds{font-size:13.5px;line-height:1.5;color:#384055;margin:0 0 14px}
.xr button.chip{border:0;cursor:pointer}.xr button.chip:hover{background:#dfe5f5}
.xr .chip{display:inline-block;background:#f1f3f8;border-radius:999px;padding:3px 10px;font-size:12px;margin:0 4px 4px 0;font-weight:500}
.xr .tl{border-left:1px solid #eef0f5;padding-left:20px;overflow:auto;display:flex;flex-direction:column}
.xr .tl h3{margin:0 0 10px;font-size:14px;font-weight:600}
.xr .msg{position:relative;padding:0 0 14px 18px;font-size:13px}.xr .msg:before{content:"";position:absolute;left:0;top:5px;width:8px;height:8px;border-radius:50%;background:#1f3a8a}.xr .msg.req:before{background:#ffb020}
.xr .msg b{font-weight:600}.xr .msg small{color:#69718a;margin-left:6px;font-size:11.5px}.xr .msg p{margin:3px 0 0;color:#384055}
.xr .cm{margin-top:auto;display:flex;flex-direction:column;gap:8px}.xr .cm textarea{border:1px solid #d6dae5;border-radius:8px;padding:8px;font:13px "Segoe UI",sans-serif;resize:none;height:62px}
.xr .bt{display:flex;gap:8px}.xr .bt button{flex:1;border:0;border-radius:8px;padding:9px 6px;font-weight:600;font-size:13px;display:flex;align-items:center;justify-content:center;gap:5px;color:#fff}
.xr .ok{background:#12a150}.xr .no{background:#d92d20}.xr .mi{background:#7a5af8}.xr .rp{background:#1f3a8a}
.xr .nt2{font-size:12.5px;color:#69718a;margin:0}
.xr .nw{position:absolute;left:50%;top:76px;transform:translateX(-50%);width:760px;background:#fff;border:1px solid #e3e6ee;border-radius:12px;padding:22px 28px}
.xr .nw h2{margin:0;font-size:20px;font-weight:600}.xr .sub{margin:4px 0 16px;color:#69718a;font-size:13px}
.xr .drop{border:2px dashed #c3cad9;border-radius:10px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:8px;color:#69718a}.xr .drop.has{border-color:#12a150;color:#067647;background:#f3fbf6}
.xr .drop b{color:#1f2430;font-size:14px}.xr .drop span{display:flex;gap:6px}.xr .drop span button{border:1px solid #d6dae5;background:#fff;border-radius:6px;font-size:12px;padding:4px 8px}
.xr .fg{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.xr .fg label{display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:#69718a;font-weight:600}.xr .fg .w{grid-column:1/-1}
.xr .fg select,.xr .fg textarea{border:1px solid #d6dae5;border-radius:8px;padding:7px 8px;font:13.5px "Segoe UI",sans-serif;color:#1f2430;resize:none}
.xr .ap{grid-column:1/-1;margin:0;font-size:13px;color:#384055}
.xr .flowv{display:flex;gap:10px;margin:16px 0}.xr .fs{flex:1;display:flex;gap:8px;align-items:center;background:#f5f6f8;border-radius:8px;padding:8px 10px;font-size:12.5px;color:#69718a}
.xr .fs i{width:22px;height:22px;border-radius:50%;background:#d6dae5;color:#fff;font-style:normal;font-size:12px;font-weight:700;display:grid;place-items:center;flex:none}.xr .fs.done{background:#e7f8ef;color:#067647}.xr .fs.done i{background:#12a150}
.xr .acts{display:flex;justify-content:flex-end;gap:10px}.xr .ghost{border:1px solid #d6dae5;background:#fff;border-radius:8px;padding:9px 16px}.xr .pri{border:0;background:#1f3a8a;color:#fff;border-radius:8px;padding:9px 16px;font-weight:600;display:flex;gap:6px;align-items:center}
.xr .nil{color:#69718a;text-align:center;margin-top:40px}
`
  };
  function trHead(c) {
    const s = c.state, who = s.role === 'approver' ? 'RI' : 'AM';
    return `<div class="hdr"><span class="lg">${ic(I.check, 18, 2.4)}</span><h1>Issue Approvals</h1><div class="seg">${[['approver', 'My approvals'], ['requester', 'My requests']].map(([k, l]) => `<button class="${s.role === k ? 'act' : ''}" data-act="role" data-v="${k}">${l}</button>`).join('')}</div>
      <button class="nb" data-go="new">${ic(I.plus, 16, 2.4)} New request</button><span class="me"><i>${who}</i>${s.role === 'approver' ? 'Rohan Iyer' : 'Asha Menon'}</span></div>`;
  }
  function detail(c, d) {
    const s = c.state, canDecide = s.role === 'approver' && d.status === 'Pending', canReply = s.role === 'requester' && d.status === 'More info';
    return `<div class="det"><div class="dh"><span style="color:#1f3a8a">${ic(I.file, 26)}</span><h2>${e(d.title)}</h2><a class="jl" href="#" data-act="jira" onclick="return false">${ic(I.link, 14)} ${d.jira}</a><em class="st s${d.status[0]}">${d.status}</em></div>
      <div><dl><dt>Requested by</dt><dd>${d.requester}</dd><dt>Channel</dt><dd>${d.channel}</dd><dt>Priority</dt><dd>${d.priority}</dd><dt>Document</dt><dd>${d.id}</dd></dl>
      <p class="ds">${e(d.desc)}</p><p class="nt2" style="margin-bottom:6px">Approvers for this channel</p>${(APPROVERS[d.channel] || []).map((a) => `<button class="chip" data-act="who" data-v="${a}">${a}</button>`).join('')}</div>
      <div class="tl"><h3>Responses</h3>${d.log.map(([who, role, txt, when]) => `<div class="msg ${role === 'Requestor' ? 'req' : ''}"><b>${who}</b><small>${role} · ${when}</small><p>${e(txt)}</p></div>`).join('')}
      <div class="cm">${canDecide || canReply ? `<textarea data-in="cmt" placeholder="${canReply ? 'Reply to the approver…' : 'Comment (required to reject or ask)…'}" aria-label="Comment">${e(s.cmt)}</textarea>` : ''}
      ${canDecide ? `<div class="bt"><button class="ok" data-act="decide" data-v="Approved">${ic(I.check, 15, 2.6)} Approve</button><button class="no" data-act="decide" data-v="Rejected">${ic(I.x, 15, 2.6)} Reject</button><button class="mi" data-act="decide" data-v="More info">${ic(I.ask, 15)} Ask</button></div>` : canReply ? '<div class="bt"><button class="rp" data-act="reply">Send reply</button></div>' : `<p class="nt2">${d.status === 'Pending' ? 'Waiting on the approvers.' : d.status === 'More info' ? 'Waiting on the requestor.' : 'Closed. The outcome flow has updated Jira.'}</p>`}</div></div></div>`;
  }
  M.tracker.actions.who = (c, d) => c.toast(`${d.v} · ${d.v.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com · approves via Teams`);
  M.tracker.actions.jira = (c) => c.toast(`Opens ${c.state.docs[c.state.sel].jira} in Jira (sample)`);
  M.tracker.inputs.q = (c, v) => { c.state.q = v; const pos = document.activeElement?.selectionStart; c.render(); const i = document.querySelector('.xr [data-in=q]'); if (i) { i.focus(); i.setSelectionRange(pos, pos); } };

  // ───────────────────────── 04 · Member services on Dynamics 365 ─────────────────────────
  const MEMBERS = [['M-10421', 'Aria', 'Patel', '14/03/1988', '555-0142', 'TX', 'Gold PPO'], ['M-10433', 'Ben', 'Okafor', '02/07/1975', '555-0178', 'CA', 'Silver HMO'], ['M-10457', 'Carla', 'Nguyen', '23/11/1992', '555-0119', 'TX', 'Gold PPO'], ['M-10462', 'Dev', 'Sharma', '09/01/2001', '555-0190', 'NY', 'Bronze EPO'], ['M-10470', 'Ana', 'Petrov', '30/05/1969', '555-0133', 'FL', 'Medicare Adv.']];
  const kase = (no, title, origin, fax, member, pri, pages, from) => ({ no, title, origin, fax, member, pri, pages, from, status: 'Active' });
  M.health = {
    basis: 'description', device: 'desktop', title: 'Customer Service Hub', cls: 'xd', size: [1366, 768], start: 'cases',
    state: {
      sel: 0, tab: 'Summary', dlg: false, cf: 'All', mem: '',
      flows: [{ n: 'Fax intake → Case', t: 'When a fax arrives in the shared mailbox', on: true, runs: [['Succeeded', 'today 08:16', '2.4 s'], ['Succeeded', 'today 07:52', '1.9 s'], ['Failed', 'yesterday', 'Attachment too large']] }, { n: 'getMember (custom connector)', t: 'Called by the Member Search dialog', on: true, runs: [['Succeeded', 'today 09:02', '0.6 s'], ['Succeeded', 'today 08:40', '0.7 s']] }, { n: 'Save attachments to OneDrive', t: 'HTTP request from the case form', on: true, runs: [['Succeeded', 'yesterday', '3.1 s']] }], q: { id: '', first: '', last: '', dob: '', state: '' }, busy: false, hits: null, faxN: 0,
      cases: [kase('CAS-01842', 'Prior authorisation – MRI lumbar spine', 'Fax', 'Auth', null, 'High', 6, '+1 512 555 0101'), kase('CAS-01839', 'Claim status enquiry', 'Phone', '', 'M-10433', 'Normal', 0, ''), kase('CAS-01836', 'Referral letter – cardiology', 'Fax', 'General', 'M-10457', 'Normal', 3, '+1 713 555 0144'), kase('CAS-01830', 'ID card replacement', 'Web', '', 'M-10462', 'Low', 0, '')]
    },
    screens: {
      cases: (c) => `${d365(c, 'cases')}<div class="cmd"><button data-act="fax">${ic(I.fax, 16)} Simulate inbound fax</button><button data-act="newCase">${ic(I.plus, 16)} New Case</button><button data-act="refresh">↻ Refresh</button>${c.state.cf !== 'All' ? `<button data-act="cf" data-v="All">✕ Filter: ${c.state.cf}</button>` : ''}</div>
        <div class="vw"><h2>My Active Cases <span>⌄</span></h2><table><thead><tr><th>Case Number</th><th>Case Title</th><th>Origin</th><th>Fax Type</th><th>Member</th><th>Priority</th><th>Status</th></tr></thead><tbody>${c.state.cases.filter((k) => caseFilter(c.state.cf, k)).map((k) => [k, c.state.cases.indexOf(k)]).map(([k, i]) => `<tr data-act="open" data-i="${i}" tabindex="0"><td><a>${k.no}</a></td><td>${e(k.title)}</td><td>${k.origin}</td><td>${k.fax ? `<span class="tg t${k.fax[0]}">${k.fax}</span>` : '—'}</td><td>${k.member ? memberName(k.member) : '<i class="mt">Not linked</i>'}</td><td>${k.pri}</td><td>${k.status}</td></tr>`).join('')}</tbody></table><p class="ft">1 - ${c.state.cases.length} of ${c.state.cases.length}</p></div>`,
      dash: (c) => { const C = c.state.cases, n = (f) => C.filter((k) => caseFilter(f, k)).length, by = ['Fax', 'Phone', 'Web'].map((o) => [o, C.filter((k) => k.origin === o).length]), mx = Math.max(...by.map((b) => b[1]), 1);
        return `${d365(c, 'dash')}<div class="cmd"><button data-act="refresh">↻ Refresh all</button></div><div class="vw"><h2>Member Services Dashboard</h2>
          <div class="tiles2">${[['Active', 'Active cases'], ['Fax', 'Fax cases'], ['Unlinked', 'No member linked'], ['Resolved', 'Resolved']].map(([f, l]) => `<button data-act="cf" data-v="${f}"><b>${n(f)}</b><span>${l}</span><small>Open list ›</small></button>`).join('')}</div>
          <div class="g2"><div class="sc1"><h3>Cases by origin</h3>${by.map(([o, v]) => `<div class="hb2"><span>${o}</span><i style="width:${(v / mx) * 100}%"></i><b>${v}</b></div>`).join('')}</div><div class="sc1"><h3>Flow health</h3>${c.state.flows.map((f) => `<div class="hb2"><span>${f.n}</span><em class="${f.on ? 'on3' : 'off3'}">${f.on ? 'On' : 'Off'}</em><b>${f.runs.filter((r) => r[0] === 'Succeeded').length}/${f.runs.length} ok</b></div>`).join('')}<button class="hi" data-go="flows" style="margin-top:10px">Open flows</button></div></div></div>`; },
      members: (c) => `${d365(c, 'members')}<div class="cmd"><button data-act="refresh">↻ Refresh</button></div><div class="vw"><h2>Members <span>(read from the source system via getMember)</span></h2><table><thead><tr><th>Member ID</th><th>Name</th><th>Date of birth</th><th>Plan</th><th>State</th><th>Open cases</th></tr></thead><tbody>${MEMBERS.map((m) => { const cs = c.state.cases.filter((k) => k.member === m[0]);
          return `<tr data-act="mem" data-id="${m[0]}" tabindex="0" class="${c.state.mem === m[0] ? 'selr' : ''}"><td><a>${m[0]}</a></td><td>${m[1]} ${m[2]}</td><td>${m[3]}</td><td>${m[6]}</td><td>${m[5]}</td><td>${cs.length}</td></tr>${c.state.mem === m[0] ? `<tr class="xp"><td colspan="6">${cs.length ? cs.map((k) => `<button class="lk" data-act="open" data-i="${c.state.cases.indexOf(k)}">${k.no} · ${e(k.title)}</button>`).join(' ') : 'No cases linked to this member yet.'}</td></tr>` : ''}`; }).join('')}</tbody></table></div>`,
      faxq: (c) => { const F = c.state.cases.filter((k) => k.origin === 'Fax');
        return `${d365(c, 'faxq')}<div class="cmd"><button data-act="fax">${ic(I.fax, 16)} Simulate inbound fax</button></div><div class="vw"><h2>Fax queue <span>${F.length} items</span></h2><div class="fxl">${F.map((k) => `<button class="fx" data-act="open" data-i="${c.state.cases.indexOf(k)}"><span class="tg t${k.fax[0]}">${k.fax}</span><b>${e(k.title)}</b><small>${k.no} · ${k.pages} pages · from ${k.from}</small><em>${k.member ? 'Member linked' : 'Needs member'}</em></button>`).join('')}</div></div>`; },
      flows: (c) => `${d365(c, 'flows')}<div class="cmd"><button data-act="refresh">↻ Refresh</button></div><div class="vw"><h2>Cloud flows</h2>${c.state.flows.map((f, i) => `<div class="fl2"><div class="fh2"><span class="fi">${ic(I.flow, 18)}</span><div><b>${f.n}</b><small>${f.t}</small></div><button class="sw3 ${f.on ? 'on3' : ''}" data-act="flow" data-i="${i}" aria-pressed="${f.on}"><i></i>${f.on ? 'On' : 'Off'}</button><button class="hi" data-act="run" data-i="${i}">Test run</button></div>
          <table class="mini"><tr><th>Run</th><th>Started</th><th>Duration / error</th></tr>${f.runs.slice(0, 4).map(([st, when, dur]) => `<tr><td><span class="tg ${st === 'Succeeded' ? 'tG' : 'tA'}">${st}</span></td><td>${when}</td><td>${dur}</td></tr>`).join('')}</table></div>`).join('')}</div>`,
      case: (c) => { const k = c.state.cases[c.state.sel], m = k.member && MEMBERS.find((x) => x[0] === k.member);
        return `${d365(c, 'cases')}<div class="cmd"><button data-go="cases">${ic(I.back, 16)}</button><button data-act="save">${ic(I.save, 16)} Save</button><button class="hi" data-act="dlg">${ic(I.search, 16)} Member Search</button><button data-act="resolve">${ic(I.check, 16)} Resolve Case</button>${k.fax ? `<button data-act="dl">${ic(I.cloud, 16)} Save attachments to OneDrive</button>` : ''}</div>
        <div class="fh"><span class="av">${ic(I.case, 22)}</span><div><h2>${e(k.title)}</h2><small>Case · ${k.no}</small></div><dl><dt>Priority</dt><dd>${k.pri}</dd><dt>Origin</dt><dd>${k.origin}</dd><dt>Status</dt><dd>${k.status}</dd><dt>Owner</dt><dd>Priya Nair</dd></dl></div>
        <div class="tb2">${['Summary', 'Documents'].map((t) => `<button class="${c.state.tab === t ? 'act' : ''}" data-act="tab" data-v="${t}">${t}</button>`).join('')}</div>
        ${c.state.tab === 'Summary' ? `<div class="fb"><div class="sc1"><h3>Case details</h3>${fld('Case Title', k.title)}${fld('Case Type', k.fax === 'Auth' ? 'Prior authorisation' : 'Question')}${fld('Origin', k.origin)}${fld('Fax type', k.fax || '—')}</div>
          <div class="sc1"><h3>Member</h3>${m ? `${fld('Member', `<a>${m[1]} ${m[2]}</a>`)}${fld('Member ID', m[0])}${fld('Date of birth', m[3])}${fld('Plan', m[6])}${fld('State', m[5])}` : `<div class="emp">${ic(I.user, 34, 1.4)}<p>No member linked to this case.</p><button class="hi" data-act="dlg">${ic(I.search, 15)} Search member</button></div>`}</div>
          <div class="sc1"><h3>Timeline</h3><div class="tli"><b>Case created</b><small>${k.origin === 'Fax' ? 'by the fax intake flow' : 'by Priya Nair'}</small></div>${m ? `<div class="tli"><b>Member linked</b><small>${m[0]} via getMember connector</small></div>` : ''}${k.saved ? '<div class="tli"><b>Attachments saved</b><small>to OneDrive by HTTP flow</small></div>' : ''}</div></div>`
          : `<div class="fb one"><div class="sc1"><h3>Fax document metadata</h3>${k.fax ? `<table class="mini"><tr><th>File</th><th>Pages</th><th>Fax type</th><th>From</th><th>Received</th></tr><tr><td>${k.no}-fax.pdf</td><td>${k.pages}</td><td>${k.fax}</td><td>${k.from}</td><td>Today 08:${10 + k.pages}</td></tr></table>` : '<p class="mt">This case did not come in by fax.</p>'}</div></div>`}
        ${c.state.dlg ? dialog(c) : ''}`; }
    },
    actions: {
      cf: (c, d) => { c.state.cf = d.v; c.go('cases'); },
      refresh: (c) => { c.render(); c.toast('List refreshed'); },
      newCase: (c) => { c.state.cases.unshift(kase(`CAS-0${1900 + c.state.cases.length}`, 'New case – member enquiry', 'Phone', '', null, 'Normal', 0, '')); c.state.sel = 0; c.state.tab = 'Summary'; c.go('case'); c.toast('New case created. Link a member next.'); },
      mem: (c, d) => { c.state.mem = c.state.mem === d.id ? '' : d.id; c.render(); },
      flow: (c, d) => { const f = c.state.flows[d.i]; f.on = !f.on; c.render(); c.toast(`${f.n} turned ${f.on ? 'on' : 'off'}`); },
      run: (c, d) => { const f = c.state.flows[d.i]; if (!f.on) return c.toast('Turn the flow on first'); f.runs.unshift(['Succeeded', 'just now', `${(0.8 + Math.random() * 2).toFixed(1)} s`]); c.render(); c.toast(`${f.n}: test run succeeded`); },
      open: (c, d) => { c.state.sel = Number(d.i); c.state.tab = 'Summary'; c.go('case'); },
      tab: (c, d) => { c.state.tab = d.v; c.render(); },
      save: (c) => c.toast('Saved'),
      resolve: (c) => { const k = c.state.cases[c.state.sel]; if (!k.member) return c.toast('Link a member before resolving'); k.status = 'Resolved'; c.render(); c.toast(`${k.no} resolved`); },
      dl: (c) => { c.state.cases[c.state.sel].saved = true; c.render(); c.toast('HTTP flow saved the fax to OneDrive'); },
      dlg: (c) => { Object.assign(c.state, { dlg: true, hits: null }); c.render(); document.querySelector('.xd [data-in=mq]')?.focus(); },
      close: (c) => { c.cancel(); Object.assign(c.state, { dlg: false, busy: false }); c.render(); },
      find: (c) => {
        const q = c.state.q; c.cancel(); c.state.busy = true; c.state.hits = null; c.render();
        c.later(() => { c.state.busy = false; c.state.hits = MEMBERS.filter((m) => (!q.id || m[0].toLowerCase().includes(q.id.toLowerCase())) && (!q.first || m[1].toLowerCase().startsWith(q.first.toLowerCase())) && (!q.last || m[2].toLowerCase().startsWith(q.last.toLowerCase())) && (!q.state || m[5].toLowerCase() === q.state.toLowerCase())); c.render(); }, 900);
      },
      link: (c, d) => { const k = c.state.cases[c.state.sel]; k.member = d.id; c.state.dlg = false; c.render(); c.toast(`Member ${d.id} linked to ${k.no}`); },
      fax: (c) => { const n = c.state.faxN++, auth = n % 2 === 0; c.state.cases.unshift(kase(`CAS-0184${3 + n}`, auth ? 'Prior authorisation – physiotherapy' : 'Medical records request', 'Fax', auth ? 'Auth' : 'General', null, auth ? 'High' : 'Normal', 2 + n, '+1 214 555 01' + (20 + n))); c.render(); c.toast(`Fax received → ${auth ? 'Auth' : 'General'} case created with document metadata`); }
    },
    inputs: { mq: (c, v, el) => { c.state.q[el.dataset.k] = v; } },
    css: `
.xd{background:#faf9f8;color:#323130;font-family:"Segoe UI",system-ui,sans-serif;position:relative;font-size:14px}
.xd button{font:inherit;cursor:pointer}
.xd .nav{height:48px;background:#002050;color:#fff;display:flex;align-items:center;padding:0 16px;gap:14px}.xd .nav .wf{display:grid;grid-template-columns:repeat(3,4px);gap:3px}.xd .nav .wf i{width:4px;height:4px;background:#fff}
.xd .nav b{font-weight:600;font-size:15px}.xd .nav span{opacity:.85;border-left:1px solid rgba(255,255,255,.35);padding-left:14px}.xd .nav .sr2{margin-left:auto;width:300px;height:30px;border-radius:4px;background:rgba(255,255,255,.12);display:flex;align-items:center;gap:8px;padding:0 10px;opacity:.85;font-size:13px}.xd .nav .av2{width:30px;height:30px;border-radius:50%;background:#8a6ad8;display:grid;place-items:center;font-size:12px;font-weight:600}
.xd .sm{position:absolute;left:0;top:48px;bottom:0;width:208px;background:#efefef;border-right:1px solid #e1dfdd;padding:10px 0}
.xd .sm h4{margin:12px 16px 6px;font-size:12px;color:#605e5c;font-weight:600}.xd .sm button{display:flex;gap:10px;align-items:center;width:100%;border:0;background:none;padding:8px 16px;text-align:left;font-size:14px;color:#323130}.xd .sm .act{background:#fff;border-left:3px solid #0f6cbd;padding-left:13px;font-weight:600}
.xd .cmd{position:absolute;left:208px;right:0;top:48px;height:44px;background:#fff;border-bottom:1px solid #e1dfdd;display:flex;align-items:center;padding:0 10px;gap:2px}
.xd .cmd button{border:0;background:none;padding:8px 12px;display:flex;gap:6px;align-items:center;font-size:13.5px;color:#323130;border-radius:4px}.xd .cmd button:hover{background:#f3f2f1}.xd .cmd .hi{color:#0f6cbd;font-weight:600}
.xd .vw{position:absolute;left:224px;right:16px;top:108px;bottom:16px;background:#fff;border:1px solid #e1dfdd;border-radius:4px;padding:14px 16px;overflow:auto}
.xd .vw h2{margin:0 0 12px;font-size:20px;font-weight:600}.xd .vw h2 span{font-size:14px;color:#605e5c}
.xd table{width:100%;border-collapse:collapse;font-size:13.5px}.xd th{text-align:left;font-weight:600;color:#605e5c;border-bottom:1px solid #e1dfdd;padding:8px}.xd td{padding:10px 8px;border-bottom:1px solid #f3f2f1}
.xd tbody tr{cursor:pointer}.xd tbody tr:hover{background:#f3f9fd}.xd td a{color:#0f6cbd}
.xd .tg{font-size:12px;font-weight:600;border-radius:3px;padding:2px 8px}.xd .tA{background:#fde7e9;color:#a4262c}.xd .tG{background:#e5f1fb;color:#0f548c}
.xd .mt{color:#a19f9d;font-style:normal}.xd .ft{color:#605e5c;font-size:12px;margin:10px 0 0}
.xd .fh{position:absolute;left:208px;right:0;top:92px;height:76px;background:#fff;border-bottom:1px solid #e1dfdd;display:flex;align-items:center;gap:14px;padding:0 24px}
.xd .fh .av{width:44px;height:44px;border-radius:50%;background:#0f6cbd;color:#fff;display:grid;place-items:center}.xd .fh h2{margin:0;font-size:19px;font-weight:600}.xd .fh small{color:#605e5c}
.xd .fh dl{margin:0 0 0 auto;display:grid;grid-auto-flow:column;grid-template-rows:auto auto;column-gap:30px}.xd .fh dt{font-size:12px;color:#605e5c}.xd .fh dd{margin:0;font-weight:600;font-size:13.5px}
.xd .tb2{position:absolute;left:224px;top:176px;display:flex;gap:18px}.xd .tb2 button{border:0;background:none;padding:6px 2px;font-size:14px;color:#323130}.xd .tb2 .act{font-weight:600;box-shadow:inset 0 -2px 0 #0f6cbd}
.xd .fb{position:absolute;left:224px;right:16px;top:216px;bottom:16px;display:grid;grid-template-columns:1fr 1fr 0.8fr;gap:14px}.xd .fb.one{grid-template-columns:1fr;align-content:start}
.xd .sc1{background:#fff;border:1px solid #e1dfdd;border-radius:4px;padding:14px 16px;overflow:auto}.xd .sc1 h3{margin:0 0 12px;font-size:15px;font-weight:600}
.xd .f{display:grid;grid-template-columns:120px 1fr;padding:7px 0;border-bottom:1px solid #f3f2f1;font-size:13.5px}.xd .f span{color:#605e5c}.xd .f a{color:#0f6cbd}
.xd .emp{display:flex;flex-direction:column;align-items:center;gap:6px;color:#a19f9d;padding-top:30px}.xd .emp p{margin:0;color:#605e5c}
.xd .hi{border:1px solid #0f6cbd!important;border-radius:4px;background:#fff;color:#0f6cbd;font-weight:600;padding:6px 12px;display:flex;gap:6px;align-items:center}
.xd .tli{border-left:2px solid #0f6cbd;padding:2px 0 10px 12px;font-size:13px;display:flex;flex-direction:column}.xd .tli small{color:#605e5c}
.xd .mini th,.xd .mini td{font-size:13px}
.xd .ov{position:absolute;inset:0;background:rgba(0,0,0,.4);display:grid;place-items:center}
.xd .dg{width:780px;background:#fff;border-radius:6px;box-shadow:0 20px 50px rgba(0,0,0,.3);padding:20px 24px}
.xd .dg h2{margin:0 0 4px;font-size:20px;font-weight:600;display:flex}.xd .dg h2 button{margin-left:auto;border:0;background:none}.xd .dg p{margin:0 0 14px;color:#605e5c;font-size:13px}
.xd .qg{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;align-items:end}.xd .qg label{display:flex;flex-direction:column;gap:4px;font-size:12.5px;font-weight:600;color:#323130}.xd .qg input{width:100%;min-width:0;height:32px;border:1px solid #8a8886;border-radius:3px;padding:0 8px;font:13.5px "Segoe UI",sans-serif}
.xd .qb{display:flex;justify-content:flex-end;gap:8px;margin:14px 0 6px}.xd .pb{border:0;background:#0f6cbd;color:#fff;border-radius:3px;padding:7px 18px;font-weight:600}.xd .sb2{border:1px solid #8a8886;background:#fff;border-radius:3px;padding:7px 18px}
.xd .rz{min-height:150px}.xd .spin{display:flex;gap:10px;align-items:center;color:#605e5c;padding:30px 0;justify-content:center}.xd .spin i{width:18px;height:18px;border-radius:50%;border:3px solid #c7e0f4;border-top-color:#0f6cbd;animation:xdspin .8s linear infinite}
@keyframes xdspin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.xd .spin i{animation:none}}
.xd .tiles2{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}.xd .tiles2 button{border:1px solid #e1dfdd;border-radius:6px;background:#fff;text-align:left;padding:14px 16px;display:flex;flex-direction:column;gap:2px;transition:border-color .15s ease,box-shadow .15s ease}.xd .tiles2 button:hover{border-color:#0f6cbd;box-shadow:0 2px 8px rgba(15,108,189,.15)}.xd .tiles2 b{font-size:30px;font-weight:600;color:#0f6cbd}.xd .tiles2 small{color:#0f6cbd;font-size:12px}
.xd .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.xd .hb2{display:grid;grid-template-columns:200px 1fr 70px;align-items:center;gap:10px;padding:6px 0;font-size:13.5px}.xd .hb2 i{display:block;height:14px;border-radius:3px;background:#0f6cbd}.xd .hb2 b{font-weight:600;text-align:right}
.xd .on3{color:#107c10;font-style:normal;font-weight:600}.xd .off3{color:#a19f9d;font-style:normal;font-weight:600}
.xd .selr td{background:#e5f1fb}.xd .xp td{background:#f3f9fd;padding:10px 16px}.xd .xp .lk{margin-right:8px}
.xd .fxl{display:grid;gap:10px}.xd .fx{display:grid;grid-template-columns:80px 1fr auto;grid-template-rows:auto auto;column-gap:14px;text-align:left;border:1px solid #e1dfdd;border-radius:6px;background:#fff;padding:12px 16px}.xd .fx:hover{border-color:#0f6cbd}.xd .fx .tg{grid-row:1/3;align-self:center;text-align:center}.xd .fx b{font-weight:600}.xd .fx small{color:#605e5c}.xd .fx em{grid-row:1/3;grid-column:3;align-self:center;font-style:normal;font-size:12.5px;color:#605e5c}
.xd .fl2{border:1px solid #e1dfdd;border-radius:6px;padding:12px 16px;margin-bottom:12px}.xd .fh2{display:flex;align-items:center;gap:12px;margin-bottom:8px}.xd .fh2 div{flex:1;display:flex;flex-direction:column}.xd .fh2 b{font-weight:600}.xd .fh2 small{color:#605e5c}.xd .fi{width:34px;height:34px;border-radius:6px;background:#0066ff;color:#fff;display:grid;place-items:center}
.xd .sw3{display:flex;align-items:center;gap:8px;border:0;background:none;font-size:13px}.xd .sw3 i{width:36px;height:18px;border-radius:9px;background:#c8c6c4;position:relative}.xd .sw3 i:after{content:"";position:absolute;left:3px;top:3px;width:12px;height:12px;border-radius:50%;background:#fff;transition:transform .15s ease}.xd .sw3.on3 i{background:#0f6cbd}.xd .sw3.on3 i:after{transform:translateX(18px)}
.xd .lk{border:0;background:#0f6cbd;color:#fff;border-radius:3px;padding:4px 10px;font-size:12.5px;font-weight:600}
`
  };
  const caseFilter = (f, k) => f === 'All' || (f === 'Active' && k.status === 'Active') || (f === 'Fax' && k.origin === 'Fax') || (f === 'Unlinked' && !k.member) || (f === 'Resolved' && k.status === 'Resolved');
  const memberName = (id) => { const m = MEMBERS.find((x) => x[0] === id); return m ? `<a>${m[1]} ${m[2]}</a>` : id; };
  const fld = (l, v) => `<div class="f"><span>${l}</span><b style="font-weight:600">${v}</b></div>`;
  function d365(c, on) {
    return `<div class="nav"><span class="wf" aria-hidden="true">${'<i></i>'.repeat(9)}</span><b>Dynamics 365</b><span>Customer Service Hub</span><span class="sr2">${ic(I.search, 15)} Search</span><span class="av2">PN</span></div>
      <div class="sm" role="navigation">${[['dash', I.home, 'Home'], ['', '', 'My Work'], ['dash', I.grid, 'Dashboards'], ['cases', I.case, 'Cases'], ['members', I.user, 'Members'], ['faxq', I.fax, 'Fax queue'], ['', '', 'Automation'], ['flows', I.flow, 'Flows']].map(([go, p, l], n) => (go ? `<button class="${on === go && !(n === 0) ? 'act' : ''}" data-go="${go}">${ic(p, 16)} ${l}</button>` : `<h4>${l}</h4>`)).join('')}</div>`;
  }
  function dialog(c) {
    const q = c.state.q, h = c.state.hits;
    return `<div class="ov"><div class="dg" role="dialog" aria-label="Member Search"><h2>Member Search <button data-act="close" aria-label="Close">${ic(I.x, 18)}</button></h2><p>Looks the member up in the source system through the custom connector (getMember).</p>
      <div class="qg">${[['id', 'Member ID'], ['first', 'First Name'], ['last', 'Last Name'], ['dob', 'Birth Date'], ['state', 'State']].map(([k, l]) => `<label>${l}<input data-in="mq" data-k="${k}" value="${e(q[k])}" placeholder="${k === 'dob' ? 'dd/mm/yyyy' : ''}"></label>`).join('')}</div>
      <div class="qb"><button class="sb2" data-act="close">Cancel</button><button class="pb" data-act="find">Search</button></div>
      <div class="rz">${c.state.busy ? '<div class="spin"><i></i>Calling getMember…</div>' : h ? (h.length ? `<table><thead><tr><th>Member ID</th><th>Name</th><th>Date of birth</th><th>Plan</th><th>State</th><th></th></tr></thead><tbody>${h.map((m) => `<tr><td>${m[0]}</td><td>${m[1]} ${m[2]}</td><td>${m[3]}</td><td>${m[6]}</td><td>${m[5]}</td><td><button class="lk" data-act="link" data-id="${m[0]}">Link to case</button></td></tr>`).join('')}</tbody></table>` : '<p style="text-align:center;padding-top:30px">No member found. Try fewer filters.</p>') : '<p style="text-align:center;padding-top:30px">Enter any field and press Search (try last name "N" or state "TX").</p>'}</div></div></div>`;
  }

  // ───────────────────────── 06 · Invoice inbox (AI Builder) ─────────────────────────
  const FIELDS = ['Invoice Subject', 'Description', 'Date', 'Service Name', 'Amount', 'Currency'];
  const inv = (id, vendor, lang, status, v, conf, lines) => ({ id, vendor, lang, status, v, conf, lines });
  M.invoice = {
    basis: 'description', device: 'desktop', title: 'Invoice Inbox', cls: 'xn', size: [1366, 768], start: 'inbox',
    state: {
      sel: 0, busy: false, n: 0,
      list: [
        inv('INV-2024-0612', 'Northwind Supplies', 'EN', 'Extracted', ['Software maintenance', 'Annual support renewal', '12/06/2024', 'Cloud hosting', '1,284.00', 'USD'], [0.98, 0.91, 0.99, 0.87, 0.97, 0.99], [['Cloud hosting – annual', 1, 1080], ['Premium support', 1, 204]]),
        inv('INV-77810', 'מערכות אור בע״מ', 'HE', 'New', null, null, [['שירותי ענן', 1, 2900], ['תמיכה טכנית', 2, 450]]),
        inv('RE-2024-3391', 'Contoso GmbH', 'DE', 'Posted', ['Wartungsvertrag', 'Quartalswartung Server', '03/05/2024', 'Server-Wartung', '2.450,00', 'EUR'], [0.95, 0.88, 0.99, 0.9, 0.96, 1], [['Quartalswartung', 1, 2450]]),
        inv('INV-5521', 'Fabrikam Logistics', 'EN', 'New', null, null, [['Freight – Mumbai to Pune', 3, 410], ['Insurance', 1, 95]])
      ]
    },
    screens: {
      inbox: (c) => { const s = c.state, x = s.list[s.sel];
        return `<div class="hd"><span class="lg2">${ic(I.file, 18, 2)}</span><h1>Invoice Inbox</h1><span class="md">Model: <b>Invoice Extract</b> · AI Builder document processing</span><button class="upb" data-act="upload">${ic(I.up, 16, 2.2)} Upload invoice</button></div>
        <div class="ls2"><h3>Mailbox: invoices@ <small>${s.list.length}</small></h3>${s.list.map((v, i) => `<button class="iv ${i === s.sel ? 'act' : ''}" data-act="pick" data-i="${i}"><b>${e(v.vendor)}</b><small>${v.id}</small><span class="lang">${v.lang}</span><em class="ss ${v.status[0]}">${v.status}</em></button>`).join('')}</div>
        <div class="pv"><div class="paper" dir="${x.lang === 'HE' ? 'rtl' : 'ltr'}"><div class="ph1"><b>${e(x.vendor)}</b><span>${x.lang === 'HE' ? 'חשבונית מס' : x.lang === 'DE' ? 'RECHNUNG' : 'INVOICE'}</span></div><p class="mm">${x.id}<br>${x.v ? x.v[2] : '—'}</p>
          <table><thead><tr><th>${x.lang === 'HE' ? 'תיאור' : x.lang === 'DE' ? 'Beschreibung' : 'Description'}</th><th>Qty</th><th>${x.lang === 'DE' ? 'Betrag' : x.lang === 'HE' ? 'סכום' : 'Amount'}</th></tr></thead><tbody>${x.lines.map(([d, q, a]) => `<tr><td>${e(d)}</td><td>${q}</td><td>${(q * a).toLocaleString()}</td></tr>`).join('')}</tbody></table>
          <p class="tot2">${x.lang === 'HE' ? 'סה״כ' : x.lang === 'DE' ? 'Gesamt' : 'Total'} <b>${x.lines.reduce((t, [, q, a]) => t + q * a, 0).toLocaleString()}</b></p>${s.busy ? '<i class="scan"></i>' : ''}</div></div>
        <div class="ex"><h3>Extracted fields</h3>${x.v ? FIELDS.map((f, i) => `<label class="xf">${f}<span><input value="${e(x.v[i])}" data-in="fix" data-i="${i}" ${x.status === 'Posted' ? 'disabled' : ''}><i class="cf ${x.conf[i] < 0.9 ? 'lo' : ''}" title="Confidence"><u style="width:${x.conf[i] * 100}%"></u></i><small>${Math.round(x.conf[i] * 100)}%</small></span></label>`).join('')
          : `<div class="em2">${ic(I.flow, 34, 1.4)}<p>${s.busy ? 'Reading the document…' : 'Not processed yet.'}</p></div>`}
          <div class="eb">${x.status === 'New' ? `<button class="p1" data-act="extract">${s.busy ? 'Extracting…' : 'Run extraction'}</button>` : x.status === 'Extracted' ? '<button class="p1" data-act="post">Post to Dataverse</button>' : '<p class="pd">✓ Posted by the flow. Record locked.</p>'}</div></div>`; }
    },
    actions: {
      pick: (c, d) => { if (c.state.busy) return; c.state.sel = Number(d.i); c.render(); },
      extract: (c) => {
        if (c.state.busy) return; const x = c.state.list[c.state.sel]; c.cancel(); c.state.busy = true; c.render();
        c.later(() => {
          const tot = x.lines.reduce((t, [, q, a]) => t + q * a, 0);
          x.v = x.lang === 'HE' ? ['שירותי ענן ותמיכה', 'חשבון חודשי', '01/10/2024', 'שירותי ענן', tot.toLocaleString(), 'ILS'] : ['Freight services', `${x.lines[0][0]}`, '28/09/2024', 'Freight', tot.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 'INR'];
          x.conf = [0.86, 0.79, 0.97, 0.84, 0.95, 0.98]; x.status = 'Extracted'; c.state.busy = false; c.render(); c.toast('6 fields extracted. Low-confidence ones are amber: check them.');
        }, 1500);
      },
      post: (c) => { const x = c.state.list[c.state.sel]; x.status = 'Posted'; c.render(); c.toast(`Flow created the Dataverse record for ${x.id}`); },
      upload: (c) => { const n = ++c.state.n; c.state.list.unshift(inv(`INV-90${n}`, n % 2 ? 'Tailspin Toys' : 'Adatum Office', 'EN', 'New', null, null, [['Office chairs', 4 + n, 120], ['Delivery', 1, 40]])); c.state.sel = 0; c.render(); c.toast('Invoice arrived in the mailbox'); }
    },
    inputs: { fix: (c, v, el) => { const x = c.state.list[c.state.sel]; x.v[el.dataset.i] = v; x.conf[el.dataset.i] = 1; } },
    css: `
.xn{background:#f3f2f1;color:#242424;font-family:"Segoe UI",system-ui,sans-serif;position:relative}
.xn button{font:inherit;cursor:pointer}
.xn .hd{height:58px;background:#742774;color:#fff;display:flex;align-items:center;gap:12px;padding:0 22px}.xn .hd h1{margin:0;font-size:19px;font-weight:600}.xn .lg2{width:30px;height:30px;border-radius:6px;background:rgba(255,255,255,.18);display:grid;place-items:center}
.xn .md{font-size:13px;opacity:.85;margin-left:14px}.xn .upb{margin-left:auto;border:0;border-radius:6px;background:#fff;color:#742774;font-weight:600;font-size:13px;padding:8px 14px;display:flex;gap:6px;align-items:center}
.xn .ls2{position:absolute;left:18px;top:76px;bottom:18px;width:300px;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.12);overflow:auto}
.xn .ls2 h3{margin:0;padding:14px 16px;font-size:14px;font-weight:600;border-bottom:1px solid #edebe9;display:flex}.xn .ls2 h3 small{margin-left:auto;background:#f3e8f3;color:#742774;border-radius:10px;padding:0 8px}
.xn .iv{display:grid;grid-template-columns:1fr auto;row-gap:2px;width:100%;border:0;border-bottom:1px solid #f3f2f1;background:#fff;text-align:left;padding:12px 16px}.xn .iv:hover{background:#faf5fa}.xn .iv.act{background:#f3e8f3;box-shadow:inset 3px 0 0 #742774}
.xn .iv b{font-size:14px;font-weight:600}.xn .iv small{color:#616161;font-size:12px}.xn .lang{grid-row:1;grid-column:2;font-size:11px;font-weight:700;color:#616161;border:1px solid #d1d1d1;border-radius:4px;padding:0 5px;justify-self:end}
.xn .ss{grid-column:2;font-style:normal;font-size:11.5px;font-weight:600;justify-self:end}.xn .ss.N{color:#0f6cbd}.xn .ss.E{color:#b54708}.xn .ss.P{color:#107c10}
.xn .pv{position:absolute;left:334px;top:76px;bottom:18px;width:470px;background:#e1dfdd;border-radius:8px;display:grid;place-items:center;overflow:hidden}
.xn .paper{position:relative;width:400px;min-height:540px;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.18);padding:28px 30px;font-size:13px;overflow:hidden}
.xn .ph1{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #242424;padding-bottom:10px}.xn .ph1 b{font-size:17px}.xn .ph1 span{font-size:15px;font-weight:700;letter-spacing:1px;color:#742774}
.xn .mm{color:#616161;margin:10px 0 18px;font-size:12px;line-height:1.5}
.xn .paper table{width:100%;border-collapse:collapse}.xn .paper th{text-align:start;border-bottom:1px solid #242424;padding:6px 0;font-size:12px}.xn .paper td{padding:7px 0;border-bottom:1px solid #edebe9}
.xn .tot2{text-align:end;margin-top:16px;font-size:14px}.xn .tot2 b{font-size:17px;margin-inline-start:12px}
.xn .scan{position:absolute;left:0;right:0;height:60px;background:linear-gradient(180deg,transparent,rgba(116,39,116,.25),transparent);animation:xnscan 1.4s linear infinite}
@keyframes xnscan{from{transform:translateY(-60px)}to{transform:translateY(560px)}}
@media (prefers-reduced-motion:reduce){.xn .scan{animation:none;top:40%}}
.xn .ex{position:absolute;left:820px;right:18px;top:76px;bottom:18px;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.12);padding:16px 18px;display:flex;flex-direction:column}
.xn .ex h3{margin:0 0 10px;font-size:15px;font-weight:600}
.xn .xf{display:flex;flex-direction:column;gap:4px;font-size:12.5px;font-weight:600;color:#616161;margin-bottom:10px}.xn .xf span{display:flex;align-items:center;gap:8px}
.xn .xf input{flex:1;height:32px;border:1px solid #d1d1d1;border-radius:4px;padding:0 8px;font:13.5px "Segoe UI",sans-serif;color:#242424}.xn .xf input:disabled{background:#faf9f8}
.xn .cf{width:60px;height:6px;border-radius:3px;background:#edebe9;overflow:hidden}.xn .cf u{display:block;height:100%;background:#107c10}.xn .cf.lo u{background:#f7a600}.xn .xf small{width:32px;font-size:11.5px}
.xn .em2{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#a19f9d}.xn .em2 p{color:#616161}
.xn .eb{margin-top:auto}.xn .p1{width:100%;border:0;border-radius:6px;background:#742774;color:#fff;font-weight:600;padding:10px}.xn .pd{margin:0;color:#107c10;font-weight:600;text-align:center}
`
  };

  // ───────────────────────── 09 · Royal India Trucks CPQ (rebuilt from the real screens) ─────────────────────────
  // Stock photos (trucks, engines, branded background) are replaced with drawn illustrations. Sample data.
  const PRODUCTS = [
    { n: 'Orion Hauler', id: 'RITOH', d: 'A 6×4 long-haul tractor built for highway fleets.', hp: 450, tq: 1650, w: 18200, load: 40000, rpm: 1800, curb: 18900, col: 'Red', paint: '#b7322c', price: 98000, fe: 7, rs: 8, terrain: 'Highway' },
    { n: 'Lyra Tipper', id: 'RITLT', d: 'A heavy tipper for quarries and construction sites.', hp: 360, tq: 1400, w: 16400, load: 28000, rpm: 1700, curb: 16900, col: 'Yellow', paint: '#e3a51b', price: 81000, fe: 6, rs: 7, terrain: 'Off-road' },
    { n: 'Cassiopeia Van', id: 'RITCV', d: 'A city delivery van with a low loading floor.', hp: 210, tq: 620, w: 7400, load: 9000, rpm: 2400, curb: 7800, col: 'White', paint: '#eef0f3', price: 42000, fe: 8, rs: 7, terrain: 'Urban' },
    { n: 'Canis Major', id: 'RITCM', d: "Royal Motor Company's Canis Major is a fully-electric and hydrogen fuel cell electric pickup truck. ✨", hp: 389, tq: 1289, w: 15009, load: 30090, rpm: 29008, curb: 15780, col: 'Silver', paint: '#d9dde2', price: 76000, fe: 9, rs: 8, terrain: 'R & U', pickup: true },
    { n: 'Andromeda Reefer', id: 'RITAR', d: 'A refrigerated carrier for cold-chain logistics.', hp: 400, tq: 1500, w: 17100, load: 32000, rpm: 1900, curb: 17600, col: 'Blue', paint: '#2d5aa3', price: 91000, fe: 7, rs: 8, terrain: 'Highway' },
    { n: 'Pegasus Pickup', id: 'RITPP', d: 'A rugged diesel pickup for farms and small business.', hp: 280, tq: 900, w: 6100, load: 3500, rpm: 2600, curb: 6300, col: 'Black', paint: '#2b2f36', price: 38000, fe: 8, rs: 9, terrain: 'R & U', pickup: true },
    { n: 'Draco Tanker', id: 'RITDT', d: 'A fuel tanker with a 30,000-litre aluminium barrel.', hp: 430, tq: 1600, w: 17900, load: 36000, rpm: 1800, curb: 18300, col: 'Green', paint: '#2f7d4f', price: 102000, fe: 6, rs: 7, terrain: 'Highway' }
  ];
  const ENG = [['Holmberg 15A', 16000, 5000, 2021, 350, 345, 760, 4200], ['Abell 1201 BCG', 15890, 5030, '', 350, 340, 745, 3900], ['Messier 87', 15980, 4703, '', 290, 297, 690, 3100], ['Hercules A (3C 348)', 18094, 5890, '2018Yellow', 370, 345, 820, 5600], ['Cygnus A', 17890, 4999, 2022, 418, 390, 805, 5100], ['Markarian 501', 15900, 4980, 2021, 345, 395, 740, 3800], ['Centaurus A', 14090, 4909, 2020, 421, 401, 700, 3500]];
  const ENG_COL = ['#7d8590', '#5d6470', '#8b9099', '#d9a520', '#b8473d', '#4d7fb8', '#9aa1ab'];
  const TYRE = [['Standard radial', 0], ['All-terrain', 900], ['Low-rolling eco', 1400]];
  const WAR = [['2 years + 2 PM visits', 0], ['3 years + 4 PM visits', 1800], ['5 years + 8 PM visits', 4200]];
  const money = (v) => `$ ${Math.round(v).toLocaleString('en-US')}`;
  const pickup = (paint, w) => `<svg width="${w}" viewBox="0 0 420 220" aria-hidden="true"><ellipse cx="210" cy="198" rx="196" ry="12" fill="rgba(0,0,0,.18)"/>
    <path d="M14 168v-46l12-14 92-8 34-46h104l26 44v24h126v14l-6 32z" fill="${paint}" stroke="#4b515c" stroke-width="2"/>
    <path d="M14 168v-46l12-14 92-8 34-46h104l26 44v24h126v14l-6 32z" fill="url(#xqb)"/><defs><linearGradient id="xqb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <path d="M160 62h40v38h-70zM208 62h40l20 38h-60z" fill="#2f3540"/><path d="M282 124h126" stroke="#4b515c" stroke-width="3"/><path d="M282 110v14" stroke="#4b515c" stroke-width="2"/>
    <path d="M18 116h34v10H16z" fill="#eaf8ff"/><rect x="14" y="132" width="44" height="22" rx="3" fill="#20252d"/><path d="M20 140h32" stroke="#bfe8ff" stroke-width="3"/><path d="M70 160h330" stroke="#3fd7e8" stroke-width="3"/>
    ${[96, 332].map((x) => `<circle cx="${x}" cy="168" r="36" fill="#1d2129"/><circle cx="${x}" cy="168" r="22" fill="#3b414c"/><path d="M${x - 16} 168h32M${x} 152v32" stroke="#8a919c" stroke-width="4"/>`).join('')}</svg>`;
  const rig = (paint, w) => `<svg width="${w}" viewBox="0 0 420 220" aria-hidden="true"><ellipse cx="210" cy="196" rx="190" ry="14" fill="rgba(0,0,0,.18)"/>
    <rect x="14" y="48" width="250" height="112" rx="4" fill="#eceef2" stroke="#9aa1ab" stroke-width="2"/><path d="M24 60h230M24 148h230" stroke="#d3d7de" stroke-width="2"/>
    <path d="M270 70h74l50 48v46H270z" fill="${paint}" stroke="#555b66" stroke-width="2"/><path d="M284 82h52l36 36h-88z" fill="#3a4250"/><rect x="384" y="130" width="14" height="10" fill="#ffe08a"/><rect x="276" y="34" width="8" height="40" rx="3" fill="#8a919c"/>
    ${[70, 120, 300, 362].map((x) => `<circle cx="${x}" cy="172" r="24" fill="#1d2129"/><circle cx="${x}" cy="172" r="9" fill="#9aa1ab"/>`).join('')}</svg>`;
  const vehicle = (p, w) => (p.pickup ? pickup(p.paint, w) : rig(p.paint, w));
  const engine = (col, w) => `<svg width="${w}" viewBox="0 0 200 170" aria-hidden="true"><ellipse cx="100" cy="158" rx="80" ry="8" fill="rgba(0,0,0,.18)"/>
    <path d="M40 60h110l20 20v56H50l-20-22V70z" fill="${col}" stroke="#2b2f36" stroke-width="3"/><path d="M52 40h86v22H52z" fill="#2b2f36"/><path d="M58 46h74" stroke="${col}" stroke-width="4" stroke-dasharray="10 6"/>
    <circle cx="60" cy="104" r="16" fill="#3a3f48" stroke="#d6d9de" stroke-width="3"/><circle cx="60" cy="104" r="5" fill="#d6d9de"/><path d="M90 84h60M90 98h60M90 112h60" stroke="#2b2f36" stroke-width="5" stroke-linecap="round"/>
    <path d="M150 70c22 0 26 30 8 36" fill="none" stroke="#8a919c" stroke-width="7"/><rect x="30" y="122" width="40" height="14" fill="#2b2f36"/></svg>`;
  const donut = (v, max, size, cls) => { const r = size / 2 - 9, C = 2 * Math.PI * r; return `<span class="dn ${cls}" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#f1f3f6" stroke-width="13"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="url(#xqg${cls})" stroke-width="13" stroke-linecap="round" stroke-dasharray="${(C * v) / max} ${C}" transform="rotate(-90 ${size / 2} ${size / 2})"/><defs><linearGradient id="xqg${cls}"><stop offset="0" stop-color="${cls === 'big' ? '#b6f000' : '#6ab04c'}"/><stop offset="1" stop-color="${cls === 'big' ? '#11a347' : '#4caf50'}"/></linearGradient></defs></svg><b>${v}</b></span>`; };
  const RIT_LOGO = '<svg width="124" height="58" viewBox="0 0 124 58" aria-hidden="true"><path d="M4 50l26-6M0 44l20-4M10 54l30-4" stroke="#555" stroke-width="1.4"/><path d="M22 14h46v26H22z" fill="#fff" stroke="#333" stroke-width="2"/><path d="M68 22h16l10 10v8H68z" fill="#e8e8e8" stroke="#333" stroke-width="2"/><circle cx="34" cy="44" r="6" fill="#333"/><circle cx="80" cy="44" r="6" fill="#333"/><path d="M96 20l26 18-26 18M96 20v10M96 46v10" fill="none" stroke="#333" stroke-width="2.4"/></svg>';
  const fmtDate = (d) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const fmtTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const blank = () => ({ id: '', name: '', mobile: '', customer: '', email: '', status: 'Draft', street: '', sstreet: '', country: 'Afghanistan', ship: 'Afghanistan', state: '', sstate: '', city: '', scity: '', pin: '', spin: '' });
  M.cpq = {
    basis: 'screens', device: 'tablet', title: 'Royal India Trucks', cls: 'xq', size: [1550, 870], start: 'home',
    state: { p: 3, eng: 0, tyre: 0, war: 0, scheme: 0, video: false, b: blank(), bookings: [], sec: 'summary', list: 'Open' },
    screens: {
      home: (c) => { tick(c); return `${ritHead()}<div class="hero2"><svg class="scn" viewBox="0 0 1550 790" preserveAspectRatio="none" aria-hidden="true">
          <rect width="1550" height="790" fill="url(#xqsky)"/><defs><linearGradient id="xqsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9ccb2"/><stop offset=".55" stop-color="#c9bb9e"/><stop offset=".56" stop-color="#9b9486"/><stop offset="1" stop-color="#7f796e"/></linearGradient></defs>
          <rect x="160" y="0" width="24" height="230" fill="#8d8478"/><rect x="0" y="215" width="725" height="300" fill="#b9b6ad" stroke="#8d877c" stroke-width="3"/>${Array.from({ length: 24 }, (_, i) => `<path d="M${10 + i * 30} 222v286" stroke="#a7a399" stroke-width="2"/>`).join('')}
          <rect x="1215" y="0" width="335" height="440" fill="#c4bdb0"/>${Array.from({ length: 11 }, (_, i) => `<path d="M${1225 + i * 30} 0v440" stroke="#b2ab9e" stroke-width="3"/>`).join('')}<rect x="725" y="325" width="500" height="160" fill="#aaa69d"/>
          <path d="M1170 300l380-80v40l-380 70z" fill="#5a1f22"/><g transform="translate(740 270)"><path d="M20 70l40-10 60-60h200v200H20z" fill="#24262b"/><path d="M60 60l50-46h80v60H60z" fill="#3b3e45"/><path d="M20 150h400" stroke="#b33" stroke-width="18"/><rect x="18" y="110" width="80" height="80" fill="#c9c9c9" stroke="#777"/><circle cx="120" cy="250" r="42" fill="#1a1b1e"/><circle cx="420" cy="250" r="42" fill="#1a1b1e"/><path d="M200 180h300l40 40v40H200z" fill="#2c2e33"/></g>
          <g transform="translate(150 410)"><path d="M40 200l20-110 60-60h260l60 60 20 110z" fill="#9b9a97"/><path d="M130 40h220l40 70H90z" fill="#5f5f60"/><rect x="60" y="150" width="120" height="26" fill="#3b3b3d"/><rect x="300" y="150" width="120" height="26" fill="#3b3b3d"/><rect x="190" y="190" width="100" height="40" fill="#6e6e70"/></g>
          <ellipse cx="1330" cy="560" rx="120" ry="30" fill="rgba(255,255,255,.12)"/></svg>
        ${[['Product<br>Catalogue', 'catalogue', 128], ['Open<br>Bookings', 'open', 655], ['Product<br>Booked', 'booked', 1192]].map(([t, go, x]) => `<button class="pill" style="left:${x}px" data-act="home" data-v="${go}"><b>${t}</b><svg width="110" height="76" viewBox="0 0 110 76" aria-hidden="true"><path d="M8 8l47 58L102 8" fill="none" stroke="#2b2b2b" stroke-width="5"/><path d="M20 4l35 44L90 4" fill="none" stroke="#666" stroke-width="3"/></svg></button>`).join('')}</div>`; },
      catalogue: (c) => { tick(c); const p = PRODUCTS[c.state.p];
        return `${ritHead()}${tbar('<button data-go="home">Home</button>')}<div class="cb2"><span class="pn2">${p.n}</span><button class="arr l" data-act="nav" data-v="-1" aria-label="Previous product"><svg width="44" height="76" viewBox="0 0 44 76"><path d="M40 4L4 38l36 34" fill="none" stroke="#111" stroke-width="3"/></svg></button>
          <div class="img2">${vehicle(p, 520)}</div><button class="arr r" data-act="nav" data-v="1" aria-label="Next product"><svg width="44" height="76" viewBox="0 0 44 76"><path d="M4 4l36 34L4 72" fill="none" stroke="#111" stroke-width="3"/></svg></button>
          <button class="bp" data-act="book">Book this Product</button><button class="cam" data-act="video" aria-label="Play product video"><svg width="40" height="26" viewBox="0 0 40 26"><rect x="1" y="4" width="26" height="18" fill="none" stroke="#555" stroke-width="2"/><path d="M27 10l11-6v18l-11-6" fill="none" stroke="#555" stroke-width="2"/></svg></button>${c.state.video ? `<div class="vid" data-act="video"><div class="vbox"><div class="road"></div><div class="drive">${vehicle(p, 300)}</div><b>${p.n} · test drive</b><i>Click to close</i></div></div>` : ''}
          <div class="sp"><p class="dsc">${p.d}</p><h3 class="h1">Specifications</h3><h3 class="h2">Application and Preferences</h3>
            <div class="t1">${[['Engine Horsepower', p.hp], ['Peak Torque', p.tq], ['Weight', p.w], ['Max. Expected Load Weight', p.load]].map(([l, v]) => `<span>${l}</span><i>${v}</i>`).join('')}</div>
            <div class="t2">${[['Product Type', 'Truck'], ['Product ID', p.id], ['Color', p.col]].map(([l, v]) => `<span>${l}</span><i>${v}</i>`).join('')}</div>
            <h3 class="h3">Ratings</h3><span class="fe">Fuel Efficiency</span><span class="rs">Resale</span><button class="dbt d1" data-act="rate" data-v="Fuel efficiency ${p.fe}/10: from owner surveys (sample)">${donut(p.fe, 10, 108, 'd1')}</button><button class="dbt d2" data-act="rate" data-v="Resale ${p.rs}/10: 3-year residual value index (sample)">${donut(p.rs, 10, 108, 'd2')}</button><button class="dbt big" data-act="rate" data-v="Overall ${(p.fe + p.rs) / 2}: average of the two ratings">${donut((p.fe + p.rs) / 2, 10, 150, 'big')}</button><span class="wb"></span></div>
          <div class="pg2"><i></i><b>${c.state.p + 1}</b><em>/</em><b>${PRODUCTS.length}</b><i></i></div></div>`; },
      booking: (c) => { tick(c); const s = c.state, b = s.b, p = PRODUCTS[s.p], E = ENG[s.eng], t = totals(s), ready = b.name && b.mobile && b.customer && b.email;
        const inp = (k, l, req, cls = '') => `<label class="${cls}">${req ? '<em>*</em>' : ''}${l}<input data-in="b" data-k="${k}" value="${e(b[k])}" ${k === 'id' ? 'readonly placeholder=""' : ''}></label>`;
        const sel = (k, l, opts) => `<label><em>*</em>${l}<span class="sl"><select data-in="b" data-k="${k}">${opts.map((o) => `<option${o === b[k] ? ' selected' : ''}>${o}</option>`).join('')}</select></span></label>`;
        return `${ritHead()}${tbar('<button data-go="catalogue">Back</button><button data-act="refresh">Refresh</button>', `<button class="${ready ? 'en' : ''}" data-act="doBook">Book</button><button class="${ready ? 'en' : ''}" data-act="save">Save</button>`)}
        <div class="mnu">${[['summary', 'BOOKING SUMMARY'], ['engine', 'ENGINE'], ['tyre', 'Tyre'], ['warranty', 'WARRANTY &amp; PM'], ['pricing', 'PRICING SUMMARY']].map(([k, l]) => `<button class="${s.sec === k ? 'cur2' : ''}" data-act="sec" data-v="${k}"><span>${ic('<rect x="3" y="5" width="13" height="14" rx="2"/><path d="M8 3v4M16 9h5v10H9"/><path d="M6 11h7M6 15h5"/>', 22)}</span>${l}</button>`).join('')}</div>
        <div class="scr">
          <div class="fm" id="xq-summary">${inp('id', 'Booking ID', 0, 'pl2')}${inp('name', 'Booking Name', 1, 'pl2')}<label class="w2"><em>*</em>Product<input value="${p.n}" readonly></label>${inp('mobile', 'Mobile', 1, 'w2')}${inp('customer', 'Customer', 1, 'w2 tall')}${inp('email', 'EmailId', 1)}<label>Book Status<input value="${b.status}" readonly></label>
            ${inp('street', 'Bill to Address:  Street', 1)}${inp('sstreet', 'Ship to Address:  Street', 1)}${sel('country', 'Bill to Address:  Country', ['Afghanistan', 'India', 'United Arab Emirates', 'Nepal'])}${sel('ship', 'Ship to Address:  Country', ['Afghanistan', 'India', 'United Arab Emirates', 'Nepal'])}${sel('state', 'Bill to Address:  State', ['', 'Maharashtra', 'Gujarat', 'Kabul', 'Dubai'])}${sel('sstate', 'Ship to Address:  State', ['', 'Maharashtra', 'Gujarat', 'Kabul', 'Dubai'])}${inp('city', 'Bill to Address:  City', 1)}${inp('scity', 'Ship to Address:  City', 1)}${inp('pin', 'Bill to Address:  Pinco...', 1)}${inp('spin', 'Ship to Address:  Pinc...', 1)}</div>
          <div class="rt2"><h2>${p.n}</h2><div class="im3">${vehicle(p, 400)}</div><h3>Specifications</h3><div class="tb3">${[['Engine Horsepower', p.hp], ['Peak Torque', p.tq], ['Peak Torque RPM', p.rpm], ['Max. Expected Load Weight', p.load], ['Curb Weight', p.curb]].map(([l, v]) => `<span>${l}</span><i>${v}</i>`).join('')}</div>
            <h3>Application and Prefrences</h3><div class="tb3">${[['Terrain', p.terrain], ['Governed Speed', E[4]], ['HP at Governed RPM', E[1] + 980]].map(([l, v]) => `<span>${l}</span><i>${v}</i>`).join('')}</div></div>
          <div class="sec2" id="xq-engine"><h4>Engine</h4><button class="lk2" data-go="engines">+SELECT A DIFFERENT ENGINE</button><div class="eim">${engine(ENG_COL[s.eng], 200)}</div><b class="en2">${E[0]}</b>
            <div class="eb2"><span>Airtake Required CFM</span><i>${E[5]}</i><span>Peak Torque</span><i>${E[2]}</i><span>Governed RPM</span><i>${E[1]}</i><span>Peak Torque<br>RPM</span><i>${E[1] + 2900}</i><span>HP at Governed RPM</span><i>${E[6]}</i><button class="lk3" data-act="scheme">+SELECT A DIFFERENT PRICE SCHEME · <b>${SCHEMES[s.scheme][0]}</b></button></div></div>
          <div class="sec2 sm2" id="xq-tyre"><h4>Tyre</h4><div class="opt3">${TYRE.map(([n, pr], i) => `<button class="${s.tyre === i ? 'cur2' : ''}" data-act="tyre" data-i="${i}"><b>${n}</b><small>${pr ? '+ ' + money(pr) : 'Included'}</small></button>`).join('')}</div></div>
          <div class="sec2 sm2" id="xq-warranty"><h4>Warranty &amp; PM</h4><div class="opt3">${WAR.map(([n, pr], i) => `<button class="${s.war === i ? 'cur2' : ''}" data-act="war" data-i="${i}"><b>${n}</b><small>${pr ? '+ ' + money(pr) : 'Included'}</small></button>`).join('')}</div></div>
          <div class="sec2 sm2" id="xq-pricing"><h4>Pricing Summary</h4><table class="ps2">${[['Product: ' + p.n, p.price], ['Engine: ' + E[0], E[7]], ['Tyre: ' + TYRE[s.tyre][0], TYRE[s.tyre][1]], ['Warranty: ' + WAR[s.war][0], WAR[s.war][1]]].map(([l, v]) => `<tr><td>${l}</td><td>${money(v)}</td></tr>`).join('')}<tr class="tt"><td>Total Amount</td><td>${money(t.total)}</td></tr></table></div>
        </div>
        <div class="foot">${[['Total Amount', `-- ${Math.round(t.total).toLocaleString('en-US')}`], ['Dealer Cost', Math.round(t.dealer).toLocaleString('en-US')], ['Total Weight', `${p.curb}  lbs`], ['Country', b.country], ['Gross Profit', `${t.gp.toFixed(0)} %`]].map(([l, v]) => `<b>${l}</b><i>${v}</i>`).join('')}<span>RIT</span></div>`; },
      engines: (c) => { tick(c); const s = c.state;
        return `${ritHead()}${tbar('<button data-back>Back</button><button data-act="refresh">Refresh</button>')}<div class="eh"><span>Select</span><span>Name</span><span>Governed RPM</span><span>Peak Torque</span><span>Built Year</span><span>Governed Speed</span><span>Airtake required CFM</span><b>Selected Product</b></div>
        <div class="el2">${ENG.map((E, i) => `<button class="er ${s.eng === i ? 'cur2' : ''}" data-act="eng" data-i="${i}"><span class="cbx">${s.eng === i ? '✓' : ''}</span><span>${E[0]}</span><span>${E[1]}</span><span>${E[2]}</span><span>${E[3]}</span><span>${E[4]}</span><span>${E[5]}</span>${engine(ENG_COL[i], 74)}</button>`).join('')}</div>
        <div class="ep"><div class="epi">${engine(ENG_COL[s.eng], 250)}</div><b>${ENG[s.eng][0]}</b><button class="use" data-back>Use this engine</button></div>`; },
      list: (c) => { tick(c); const s = c.state, L = s.bookings.filter((x) => (s.list === 'Open' ? x.status === 'Draft' : x.status === 'Booked'));
        return `${ritHead()}${tbar('<button data-go="home">Home</button>')}<div class="bl"><h2>${s.list === 'Open' ? 'Open Bookings' : 'Product Booked'}</h2>${L.length ? `<table><tr><th>Booking ID</th><th>Booking Name</th><th>Product</th><th>Customer</th><th>Total Amount</th><th>Status</th></tr>${L.map((x) => `<tr><td>${x.id}</td><td>${e(x.name)}</td><td>${x.product}</td><td>${e(x.customer)}</td><td>${money(x.total)}</td><td>${x.status}</td></tr>`).join('')}</table>` : `<p>${s.list === 'Open' ? 'No draft bookings. Save one from the catalogue.' : 'Nothing booked yet. Book a product from the catalogue.'}</p>`}</div>`; }
    },
    actions: {
      scheme: (c) => { c.state.scheme = (c.state.scheme + 1) % SCHEMES.length; c.render(); c.toast(`Price scheme: ${SCHEMES[c.state.scheme][0]}`); },
      video: (c) => { c.state.video = !c.state.video; c.render(); },
      rate: (c, d) => c.toast(d.v),
      home: (c, d) => { if (d.v === 'catalogue') return c.go('catalogue'); c.state.list = d.v === 'open' ? 'Open' : 'Booked'; c.go('list'); },
      nav: (c, d) => { c.state.p = (c.state.p + Number(d.v) + PRODUCTS.length) % PRODUCTS.length; c.render(); },
      book: (c) => { Object.assign(c.state, { b: blank(), eng: 0, tyre: 0, war: 0, sec: 'summary' }); c.go('booking'); },
      refresh: (c) => { c.render(); c.toast('Refreshed'); },
      sec: (c, d) => { c.state.sec = d.v; c.render(); const t = document.getElementById(`xq-${d.v}`); if (t) t.parentElement.scrollTop = t.offsetTop - 12; },
      tyre: (c, d) => { c.state.tyre = Number(d.i); c.render(); }, war: (c, d) => { c.state.war = Number(d.i); c.render(); },
      eng: (c, d) => { c.state.eng = Number(d.i); c.render(); },
      save: (c) => store(c, 'Draft'), doBook: (c) => store(c, 'Booked')
    },
    inputs: { b: (c, v, el) => { const k = el.dataset.k, had = ready(c.state.b); c.state.b[k] = k === 'mobile' ? v.replace(/\D/g, '') : v; if (k === 'country' || had !== ready(c.state.b)) { const pos = el.selectionStart; c.render(); const i = document.querySelector(`.xq [data-k="${k}"]`); if (i) { i.focus(); try { i.setSelectionRange(pos, pos); } catch (_) {} } } } },
    css: `
.xq{background:#dcdcdc;color:#111;font-family:"Open Sans","Segoe UI",system-ui,sans-serif;position:relative;overflow:hidden}
.xq button{font:inherit;cursor:pointer;color:inherit}
.xq .rh{position:absolute;left:0;right:0;top:0;height:80px;background:#f0f0f0;border-bottom:1px solid #c9c9c9}
.xq .rh .lgo{position:absolute;left:4px;top:10px}.xq .rh h1{position:absolute;left:128px;top:3px;margin:0;font-size:27px;font-weight:700}.xq .rh p{position:absolute;left:138px;top:42px;margin:0;font-size:16px;color:#1d5f99;font-weight:600}
.xq .clk{position:absolute;right:13px;top:8px;width:362px;height:68px;border-radius:14px;background:#e4e4e4;text-align:center}.xq .clk b{display:block;font-size:23px;margin-top:2px}.xq .clk span{display:inline-block;border:1.5px solid #999;border-radius:14px;padding:0 12px;font-size:20px;background:#f2f2f2}
.xq .clk i{position:absolute;width:4px;height:4px;border-radius:50%}
.xq .hero2{position:absolute;left:0;right:0;top:80px;bottom:0}.xq .scn{position:absolute;inset:0;width:100%;height:100%;filter:sepia(.25)}
.xq .pill{position:absolute;top:430px;width:230px;height:340px;border-radius:115px;border:2px solid rgba(255,255,255,.4);background:rgba(220,220,220,.28);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;transition:background .15s ease}
.xq .pill:hover{background:rgba(240,240,240,.42)}.xq .pill b{font-size:26px;line-height:1.25;color:#111;text-align:center}
.xq .tb4{position:absolute;left:12px;right:20px;top:82px;height:46px;border-radius:24px;background:#c4c4c4;box-shadow:0 2px 3px rgba(0,0,0,.2);display:flex;align-items:center;padding:0 8px;gap:14px}
.xq .tb4 button{height:38px;min-width:110px;border:1.5px solid #6d6d6d;border-radius:20px;background:#bcbcbc;font-size:24px;padding:0 22px}
.xq .tb4 .rr{margin-left:auto;display:flex;gap:20px}.xq .tb4 .rr button{width:170px;background:#fff;border-color:#bbb;color:#bbb}.xq .tb4 .rr button.en{color:#111;border-color:#6d6d6d}
.xq .cb2{position:absolute;left:0;right:0;top:135px;bottom:0}
.xq .pn2{position:absolute;left:115px;top:30px;width:515px;height:38px;border-radius:19px;background:#d0d0d0;text-align:center;font-size:23px;line-height:38px}
.xq .arr{position:absolute;top:145px;width:78px;height:430px;border:0;border-radius:14px;background:#e3e3e3;display:grid;place-items:center}.xq .arr.l{left:5px}.xq .arr.r{right:8px}
.xq .img2{position:absolute;left:92px;top:128px;width:602px;height:462px;border-radius:22px;background:#fafafa;display:grid;place-items:center}
.xq .bp{position:absolute;left:207px;top:630px;width:283px;height:52px;border:0;border-radius:26px;background:#e6e6e6;box-shadow:0 3px 6px rgba(0,0,0,.2);font-size:27px}.xq .cam{position:absolute;left:507px;top:643px}
.xq .sp{position:absolute;left:706px;top:35px;width:744px;height:655px;border-radius:22px;background:#fff}
.xq .dsc{position:absolute;left:42px;top:12px;width:660px;margin:0;color:#e0706b;font-size:19px;line-height:1.25}
.xq .sp h3{position:absolute;margin:0;font-size:25px;font-weight:700;color:#0b1f5c}.xq .h1{left:47px;top:80px}.xq .h2{left:383px;top:79px}.xq .h3{left:57px;top:350px}
.xq .sp:before{content:"";position:absolute;left:37px;right:24px;top:118px;border-top:1.5px solid #6a7aa8}.xq .sp:after{content:"";position:absolute;left:37px;right:24px;top:391px;border-top:2.5px solid #0b1f5c}
.xq .t1,.xq .t2{position:absolute;top:130px;display:grid;row-gap:4px;column-gap:5px}.xq .t1{left:32px;grid-template-columns:228px 92px}.xq .t2{left:390px;grid-template-columns:172px 149px}
.xq .t1 span,.xq .t2 span,.xq .t1 i,.xq .t2 i{height:46px;border:1.5px solid #0b1f5c;display:flex;align-items:center;font-style:normal}.xq .t1 span,.xq .t2 span{padding-left:4px;font-weight:700;font-size:19px;color:#173a7a;line-height:1.1}.xq .t1 i,.xq .t2 i{justify-content:center;font-size:17px}
.xq .fe,.xq .rs{position:absolute;font-size:20px;font-weight:700;color:#2a5aa3}.xq .fe{left:50px;top:452px}.xq .rs{left:125px;top:572px}
.xq .dn{position:absolute;display:grid;place-items:center}.xq .dn svg{position:absolute;inset:0}.xq .dn b{position:relative;font-size:28px}.xq .d1{left:252px;top:404px}.xq .d2{left:252px;top:524px}.xq .big{left:386px;top:446px}.xq .big b{font-size:30px}
.xq .wb{position:absolute;left:594px;top:445px;width:120px;height:158px;background:#fafafa}
.xq .pg2{position:absolute;left:684px;top:700px;display:flex;align-items:center;gap:10px;font-size:26px}.xq .pg2 i{width:46px;height:2px;background:linear-gradient(90deg,transparent,#d33,transparent)}.xq .pg2 em{font-style:normal;color:#d33;font-size:30px}
.xq .mnu{position:absolute;left:3px;top:148px;width:220px;height:316px;border-radius:12px;background:#d2d2d2;padding:12px 6px;display:flex;flex-direction:column;gap:6px;z-index:2}
.xq .mnu button{height:54px;border:0;border-radius:27px;background:linear-gradient(90deg,#c9c9c9,#fff 45%);text-align:left;display:flex;align-items:center;gap:14px;padding-left:8px;font-size:14.5px;font-weight:600;letter-spacing:.3px}.xq .mnu span{color:#2a6fd6}.xq .mnu .cur2{box-shadow:inset 0 0 0 2px #2a6fd6}
.xq .scr{position:absolute;left:0;right:14px;top:136px;bottom:38px;overflow-y:auto;overflow-x:hidden}
.xq .fm{position:relative;margin:16px 0 0 238px;width:585px;border-radius:22px;background:#ececec;display:grid;grid-template-columns:1fr 1fr;column-gap:68px;row-gap:10px;padding:12px 26px 26px 38px}
.xq .fm label{position:relative;display:flex;flex-direction:column;gap:12px;font-size:20px;color:#1d3a85}.xq .fm em{position:absolute;left:-26px;top:0;font-style:normal;color:#1d3a85}.xq .fm .w2{grid-column:1/-1}
.xq .fm input{height:46px;border:0;background:#fff;font:20px "Open Sans",sans-serif;padding:0 2px;margin-left:-6px}.xq .fm .pl2 input{border-radius:23px;margin-left:-8px}.xq .fm .tall{gap:56px}
.xq .sl{display:flex;margin-left:-6px;background:#fff}.xq .sl select{flex:1;height:46px;border:0;background:#fff;font:19px "Open Sans",sans-serif;padding-left:10px}
.xq .rt2{position:absolute;left:832px;top:0;width:690px}.xq .rt2 h2{margin:6px 0 10px;text-align:center;font-size:30px;font-weight:600;color:#0b1f5c}
.xq .im3{margin:0 0 0 78px;width:568px;height:232px;border-radius:16px;background:#f5f5f5;display:grid;place-items:center}
.xq .rt2 h3{margin:22px 0 0;font-size:26px;font-weight:700;color:#0b1f5c;border-bottom:1.5px solid #7d8bb5;padding:0 0 8px 10px}
.xq .tb3{margin:8px 0 0;border-radius:12px;background:#ececec;padding:6px 12px 6px 14px;display:grid;grid-template-columns:342px 285px;column-gap:32px;row-gap:4px}
.xq .tb3 span,.xq .tb3 i{height:35px;border:1px solid #c6c6c6;background:#fafafa;display:flex;align-items:center;font-style:normal;font-size:18.5px}.xq .tb3 span{padding-left:6px}.xq .tb3 i{justify-content:flex-end;padding-right:6px}
.xq .sec2{position:relative;margin:40px 0 0 238px;width:1282px;height:228px;border-radius:14px;background:#d0d0d0;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.xq .sec2 h4{position:absolute;left:35px;top:14px;margin:0;font-size:21px;font-weight:700;color:#0b1f5c}
.xq .lk2,.xq .lk3{position:absolute;border:0;background:#f2f2f2;color:#3a6bc4;font-size:14.5px;letter-spacing:.3px;padding:3px 6px}.xq .lk2{left:14px;top:48px;width:248px;text-align:left}.xq .lk3{left:420px;top:126px;background:none}
.xq .eim{position:absolute;left:280px;top:14px;width:246px;height:200px;border:1.5px solid #4a5aa0;background:#e8e8e8;display:grid;place-items:center}
.xq .en2{position:absolute;right:30px;top:6px;font-size:22px;color:#a01818}
.xq .eb2{position:absolute;left:548px;top:40px;width:712px;height:178px;border:1.5px solid #888;background:#f0f0f0;display:grid;grid-template-columns:228px 140px 196px 1fr;grid-template-rows:repeat(3,48px);align-items:center;padding:12px 22px;font-size:20px}.xq .eb2 i{font-style:normal}
.xq .sm2{height:150px}.xq .opt3{position:absolute;left:35px;right:35px;top:56px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.xq .opt3 button{height:70px;border:2px solid #bbb;border-radius:14px;background:#f5f5f5;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:0 16px;font-size:18px}.xq .opt3 small{color:#2b8a3e;font-size:14px}.xq .opt3 .cur2{border-color:#2a6fd6;background:#fff}
.xq .ps2{position:absolute;left:35px;right:35px;top:50px;border-collapse:collapse;font-size:17px}.xq .ps2 td{padding:4px 0;border-bottom:1px solid #bbb}.xq .ps2 td+td{text-align:right}.xq .ps2 .tt td{font-weight:700;border:0}
.xq #xq-pricing{margin-bottom:30px;height:220px}
.xq .foot{position:absolute;left:8px;right:4px;bottom:3px;height:34px;display:grid;grid-template-columns:148px 148px 148px 148px 148px 148px 148px 148px 148px 148px auto;border:1.5px solid #333;background:#f5f5f5;align-items:center;font-size:18px}
.xq .foot b,.xq .foot i{height:100%;display:flex;align-items:center;border-right:1.5px solid #333;padding:0 14px}.xq .foot i{justify-content:flex-end;font-size:17px}.xq .foot span{font-size:26px;font-style:italic;padding-left:6px}
.xq .eh{position:absolute;left:0;right:0;top:135px;height:44px;background:#fff;display:grid;grid-template-columns:125px 205px 140px 130px 130px 160px 300px 1fr;align-items:center;font-weight:700;font-size:18px;padding-left:22px;box-shadow:0 1px 3px rgba(0,0,0,.15)}.xq .eh b{text-align:center}
.xq .el2{position:absolute;left:5px;top:190px;width:1203px;bottom:12px;border-radius:14px;background:#f8f8f8;overflow:auto;overflow-x:hidden}
.xq .er{display:grid;grid-template-columns:120px 205px 140px 130px 130px 160px 170px 1fr;align-items:center;width:100%;height:95px;border:0;background:none;text-align:left;font-size:20px;padding-left:30px}
.xq .er:hover{background:#fff}.xq .er.cur2{background:linear-gradient(180deg,transparent 46%,#c9d3f2 46%,#a6e9f0 50%,transparent 52%)}
.xq .cbx{width:30px;height:30px;border:1.5px solid #7d84a8;background:#fff;display:grid;place-items:center;font-size:22px}
.xq .ep{position:absolute;left:1233px;top:215px;width:280px}.xq .epi{height:346px;border-radius:14px;background:#f2f2f2;display:grid;place-items:center}.xq .ep b{display:block;margin-top:92px;height:46px;border-radius:12px;background:#f2f2f2;text-align:center;font-size:27px;line-height:46px}
.xq .use{margin-top:18px;width:100%;height:42px;border:1.5px solid #6d6d6d;border-radius:20px;background:#bcbcbc;font-size:19px}
.xq .cam{border:0;background:none;padding:0;cursor:pointer}
.xq .dbt{position:absolute;border:0;background:none;padding:0;cursor:pointer;border-radius:50%}.xq .dbt .dn{position:relative;left:0;top:0}.xq .dbt:hover{filter:brightness(1.05) drop-shadow(0 2px 6px rgba(0,0,0,.15))}
.xq .dbt.d1{left:252px;top:404px}.xq .dbt.d2{left:252px;top:524px}.xq .dbt.big{left:386px;top:446px}
.xq .vid{position:absolute;inset:0;background:rgba(0,0,0,.6);display:grid;place-items:center;z-index:9;cursor:pointer}.xq .vbox{position:relative;width:900px;height:460px;border-radius:18px;overflow:hidden;background:linear-gradient(#cfe3f5,#eef4fa 60%,#8d9097 60%)}
.xq .road{position:absolute;left:0;right:0;top:330px;height:8px;background:repeating-linear-gradient(90deg,#fff 0 60px,transparent 60px 120px);animation:xqroad .6s linear infinite}
.xq .drive{position:absolute;left:300px;top:170px;animation:xqbob .5s ease-in-out infinite alternate}.xq .drive svg{transform:scaleX(-1)}.xq .vbox b{position:absolute;left:24px;top:18px;font-size:24px}.xq .vbox i{position:absolute;right:20px;top:22px;font-style:normal;color:#555}
@keyframes xqroad{to{background-position:-120px 0}}@keyframes xqbob{to{transform:translateY(-3px)}}
@media (prefers-reduced-motion:reduce){.xq .road,.xq .drive{animation:none}}
.xq .bl{position:absolute;left:40px;right:40px;top:160px;background:#fff;border-radius:20px;padding:20px 30px;font-size:18px}.xq .bl h2{margin:0 0 14px;font-size:28px;color:#0b1f5c}.xq .bl table{width:100%;border-collapse:collapse}.xq .bl th,.xq .bl td{text-align:left;padding:10px;border-bottom:1px solid #ddd}
`
  };
  function ritHead() {
    const n = new Date();
    return `<div class="rh"><span class="lgo">${RIT_LOGO}</span><h1>Royal India Trucks</h1><p>Grow naturally, move naturally 🚚</p><div class="clk"><b data-date>${fmtDate(n)}</b><span data-time>${fmtTime(n)}</span>${[[340, 8, '#2a6fd6'], [352, 14, '#e74c3c'], [332, 40, '#f1c40f'], [312, 52, '#e74c3c'], [280, 56, '#2a6fd6'], [346, 44, '#1abc9c'], [210, 36, '#2a6fd6']].map(([x, y, col]) => `<i style="left:${x}px;top:${y}px;background:${col}"></i>`).join('')}</div></div>`;
  }
  const tbar = (left, right = '') => `<div class="tb4">${left}${right ? `<span class="rr">${right}</span>` : ''}</div>`;
  function tick(c) { // the live clock: update just the two text nodes once a second while the mockup is open
    if (c.state._tick) return; c.state._tick = true;
    const step = () => { const n = new Date(), d = document.querySelector('.xq [data-date]'), t = document.querySelector('.xq [data-time]'); if (d) d.textContent = fmtDate(n); if (t) t.textContent = fmtTime(n); c.later(step, 1000); };
    c.later(step, 1000);
  }
  const SCHEMES = [['Standard', 0], ['Fleet −4%', 0.04], ['Festive −6%', 0.06]];
  function totals(s) { const total = (PRODUCTS[s.p].price + ENG[s.eng][7] + TYRE[s.tyre][1] + WAR[s.war][1]) * (1 - SCHEMES[s.scheme || 0][1]), dealer = (PRODUCTS[s.p].price + ENG[s.eng][7] + TYRE[s.tyre][1] + WAR[s.war][1]) * 0.86; return { total, dealer, gp: ((total - dealer) / total) * 100 }; }
  const ready = (b) => !!(b.name && b.mobile && b.customer && b.email);
  function store(c, status) {
    const s = c.state, b = s.b; if (!ready(b)) return c.toast('Fill the required fields (*) first');
    if (!b.id) b.id = `RIT-${String(1001 + s.bookings.length).padStart(5, '0')}`;
    b.status = status; const rec = { id: b.id, name: b.name, product: PRODUCTS[s.p].n, customer: b.customer, total: totals(s).total, status };
    const i = s.bookings.findIndex((x) => x.id === b.id); if (i >= 0) s.bookings[i] = rec; else s.bookings.push(rec);
    c.render(); c.toast(status === 'Booked' ? `${b.id} booked: saved to Dataverse by the flow` : `${b.id} saved as draft`);
  }
})();
