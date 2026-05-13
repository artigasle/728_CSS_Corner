/* ==========================================================
   CSS In/Out-Processing Tracker
   Static client-side app — localStorage only
   ========================================================== */

// ---------- DEFAULT CHECKLIST LIBRARY ----------
// Standard AF in/out-processing items plus common unit-level items.
// Suspense values are days from report/departure date.
const DEFAULT_LIBRARY = [
  // ===== MPF / Personnel =====
  { id: 'mpf-vrec',   name: 'vMPF / Virtual Record Update',         category: 'MPF',         applies: 'both', suspense: 7,  poc: 'MPF/FSS' },
  { id: 'mpf-rip',    name: 'Records Review (RIP)',                  category: 'MPF',         applies: 'both', suspense: 5,  poc: 'MPF' },
  { id: 'mpf-id',     name: 'CAC / ID Card Verification',             category: 'MPF',         applies: 'in',   suspense: 3,  poc: 'MPF' },
  { id: 'mpf-deers',  name: 'DEERS Enrollment / Update',              category: 'MPF',         applies: 'both', suspense: 5,  poc: 'MPF' },
  { id: 'mpf-deros',  name: 'DEROS / SRD Verification',               category: 'MPF',         applies: 'in',   suspense: 14, poc: 'MPF' },

  // ===== Finance =====
  { id: 'fin-inproc', name: 'Finance In-Processing',                  category: 'Finance',     applies: 'in',   suspense: 3,  poc: 'FMF' },
  { id: 'fin-outproc',name: 'Finance Out-Processing',                 category: 'Finance',     applies: 'out',  suspense: 5,  poc: 'FMF' },
  { id: 'fin-trvl',   name: 'Travel Voucher Submission',              category: 'Finance',     applies: 'in',   suspense: 5,  poc: 'FMF' },
  { id: 'fin-bah',    name: 'BAH / BAS Recertification',              category: 'Finance',     applies: 'both', suspense: 10, poc: 'FMF' },

  // ===== Medical / Dental =====
  { id: 'med-pha',    name: 'Periodic Health Assessment (PHA)',       category: 'Medical',     applies: 'in',   suspense: 30, poc: 'MDG' },
  { id: 'med-dental', name: 'Annual Dental Exam',                     category: 'Medical',     applies: 'in',   suspense: 30, poc: 'Dental Clinic' },
  { id: 'med-recs',   name: 'Medical Records Transfer',               category: 'Medical',     applies: 'out',  suspense: 14, poc: 'MDG' },
  { id: 'med-immun',  name: 'Immunizations Current',                  category: 'Medical',     applies: 'in',   suspense: 14, poc: 'MDG' },
  { id: 'med-pdhra',  name: 'PDHRA (if post-deployment)',             category: 'Medical',     applies: 'in',   suspense: 30, poc: 'MDG' },

  // ===== Security =====
  { id: 'sec-clear',  name: 'Security Clearance Verification',        category: 'Security',    applies: 'in',   suspense: 5,  poc: 'Unit SM' },
  { id: 'sec-jpas',   name: 'DISS / JPAS In-brief',                   category: 'Security',    applies: 'in',   suspense: 10, poc: 'Unit SM' },
  { id: 'sec-out',    name: 'Security Out-brief',                     category: 'Security',    applies: 'out',  suspense: 7,  poc: 'Unit SM' },
  { id: 'sec-nda',    name: 'NDA / SF-312 Signed',                    category: 'Security',    applies: 'in',   suspense: 5,  poc: 'Unit SM' },

  // ===== Training =====
  { id: 'trn-ojt',    name: 'OJT Training Plan / CFETP Review',       category: 'Training',    applies: 'in',   suspense: 30, poc: 'Trainer' },
  { id: 'trn-ancil',  name: 'Ancillary Training Roster',              category: 'Training',    applies: 'in',   suspense: 14, poc: 'UTM' },
  { id: 'trn-cbts',   name: 'Required CBTs Complete',                 category: 'Training',    applies: 'both', suspense: 30, poc: 'UTM' },
  { id: 'trn-cdc',    name: 'CDC Enrollment (if applicable)',         category: 'Training',    applies: 'in',   suspense: 30, poc: 'UTM' },
  { id: 'trn-tbas',   name: 'Training Records Transfer (TBA)',        category: 'Training',    applies: 'out',  suspense: 14, poc: 'UTM' },

  // ===== Commander's Support Staff (Unit) =====
  { id: 'css-inbf',   name: 'CSS In-Brief w/ Section Chief',          category: 'CSS',         applies: 'in',   suspense: 3,  poc: 'CSS' },
  { id: 'css-outbf',  name: 'CSS Out-Brief',                          category: 'CSS',         applies: 'out',  suspense: 7,  poc: 'CSS' },
  { id: 'css-spons',  name: 'Sponsor Assignment Confirmed',           category: 'CSS',         applies: 'in',   suspense: 14, poc: 'CSS' },
  { id: 'css-cmdr',   name: 'Commander\'s Office Call',               category: 'CSS',         applies: 'both', suspense: 7,  poc: 'CSS' },
  { id: 'css-1st',    name: 'First Sergeant Initial Counseling',      category: 'CSS',         applies: 'in',   suspense: 7,  poc: 'First Sergeant' },

  // ===== Logistics / Housing =====
  { id: 'log-hous',   name: 'Housing Office In-Brief / Assignment',   category: 'Logistics',   applies: 'in',   suspense: 7,  poc: 'Housing' },
  { id: 'log-hcl',    name: 'Housing Clearance',                      category: 'Logistics',   applies: 'out',  suspense: 14, poc: 'Housing' },
  { id: 'log-tmo',    name: 'TMO Counseling / HHG Shipment',          category: 'Logistics',   applies: 'out',  suspense: 30, poc: 'TMO' },
  { id: 'log-veh',    name: 'Vehicle Registration / Decal',           category: 'Logistics',   applies: 'in',   suspense: 14, poc: 'Pass & ID' },
  { id: 'log-trvl',   name: 'Travel Orders Verified',                 category: 'Logistics',   applies: 'in',   suspense: 3,  poc: 'FMF' },

  // ===== Mission / Other =====
  { id: 'msn-ulr',    name: 'Unit-Level Readiness Brief',             category: 'Mission',     applies: 'in',   suspense: 14, poc: 'Unit' },
  { id: 'msn-go',     name: 'Government Travel Card Issued/Closed',   category: 'Mission',     applies: 'both', suspense: 10, poc: 'APC' },
  { id: 'msn-eqpt',   name: 'Mobility / Deployment Gear Issued',      category: 'Mission',     applies: 'in',   suspense: 30, poc: 'Mobility' },
  { id: 'msn-eqret',  name: 'Mobility Gear Turn-In',                  category: 'Mission',     applies: 'out',  suspense: 14, poc: 'Mobility' },
  { id: 'msn-key',    name: 'Key / Equipment Turn-In',                category: 'Mission',     applies: 'out',  suspense: 5,  poc: 'Section' },

  // ===== Legal / Admin =====
  { id: 'lgl-pwr',    name: 'Power of Attorney (if needed)',          category: 'Legal',       applies: 'in',   suspense: 14, poc: 'JA' },
  { id: 'lgl-will',   name: 'Will / SGLI Review',                     category: 'Legal',       applies: 'in',   suspense: 14, poc: 'JA' },
];

// ---------- STORAGE ----------
const STORE_KEY = 'css_processing_tracker_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn('Failed to load state', e); }
  return {
    library: DEFAULT_LIBRARY.map(i => ({ ...i })),
    personnel: [],
  };
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

let state = loadState();

// ---------- HELPERS ----------
const $ = id => document.getElementById(id);
const fmt = d => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : '—';
const todayISO = () => new Date().toISOString().slice(0, 10);
const uid = () => 'id_' + Math.random().toString(36).slice(2, 10);

function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// Compute the suspense (due) date for a requirement
function computeDueDate(person, libItem) {
  if (!person.date || libItem.suspense == null || libItem.suspense === '') return null;
  const base = new Date(person.date);
  const offset = parseInt(libItem.suspense, 10) || 0;
  // in-processing: due = report date + suspense
  // out-processing: due = departure date - suspense
  if (person.type === 'in') base.setDate(base.getDate() + offset);
  else base.setDate(base.getDate() - offset);
  return base.toISOString().slice(0, 10);
}

// Status for a single requirement
function reqStatus(req, person) {
  if (req.status === 'complete') return 'green';
  const lib = state.library.find(l => l.id === req.libId);
  const due = req.due || (lib ? computeDueDate(person, lib) : null);
  if (!due) return 'gray';
  const d = daysBetween(todayISO(), due);
  if (d < 0) return 'red';      // overdue
  if (d <= 7) return 'amber';   // due soon
  return 'green';
}

// Overall status for a person
function personStatus(person) {
  if (!person.requirements?.length) return 'gray';
  const statuses = person.requirements.map(r => reqStatus(r, person));
  if (statuses.includes('red')) return 'red';
  if (statuses.includes('amber')) return 'amber';
  return 'green';
}

function progressCount(person) {
  const total = person.requirements?.length || 0;
  const complete = (person.requirements || []).filter(r => r.status === 'complete').length;
  return { complete, total };
}

// ---------- TAB SWITCHING ----------
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const id = 'panel-' + tab.dataset.tab;
    $(id).classList.add('active');
    renderAll();
  });
});

// ---------- MODAL HELPERS ----------
document.querySelectorAll('[data-close]').forEach(b => {
  b.addEventListener('click', () => $(b.dataset.close).classList.remove('active'));
});
document.querySelectorAll('.modal-backdrop').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); });
});

function openModal(id) { $(id).classList.add('active'); }
function closeModal(id) { $(id).classList.remove('active'); }

// ==========================================================
// DASHBOARD
// ==========================================================
function renderDashboard() {
  const active = state.personnel;
  const totalReqs = active.reduce((s, p) => s + (p.requirements?.length || 0), 0);
  const overdueReqs = active.reduce((s, p) => s + (p.requirements || []).filter(r => reqStatus(r, p) === 'red').length, 0);
  const dueSoonReqs = active.reduce((s, p) => s + (p.requirements || []).filter(r => reqStatus(r, p) === 'amber').length, 0);

  $('stat-grid').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Active Personnel</div>
      <div class="stat-value">${active.length}</div>
      <div class="stat-sub">${active.filter(p => p.type === 'in').length} in · ${active.filter(p => p.type === 'out').length} out</div>
    </div>
    <div class="stat-card green">
      <div class="stat-label">Tracked Requirements</div>
      <div class="stat-value">${totalReqs}</div>
      <div class="stat-sub">Across all personnel</div>
    </div>
    <div class="stat-card amber">
      <div class="stat-label">Due Within 7 Days</div>
      <div class="stat-value">${dueSoonReqs}</div>
      <div class="stat-sub">Requires action</div>
    </div>
    <div class="stat-card red">
      <div class="stat-label">Overdue</div>
      <div class="stat-value">${overdueReqs}</div>
      <div class="stat-sub">Immediate attention</div>
    </div>
  `;

  if (!active.length) {
    $('dashboard-list').innerHTML = `
      <div class="empty">
        <div class="empty-mark">NO ACTIVE RECORDS</div>
        <h3>No personnel records yet</h3>
        <p>Head to the Personnel tab to add your first in/out-processing record.</p>
      </div>`;
    return;
  }

  $('dashboard-list').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Status</th><th>Type</th><th>Rank / Name</th><th>Unit</th>
            <th>Report / Departure</th><th>Progress</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${active.map(p => {
            const s = personStatus(p);
            const { complete, total } = progressCount(p);
            return `
              <tr>
                <td><span class="pill ${s}"><span class="dot"></span>${s.toUpperCase()}</span></td>
                <td><span class="type-badge type-${p.type}">${p.type === 'in' ? 'IN' : 'OUT'}</span></td>
                <td><strong>${p.rank || ''} ${p.name || '(unnamed)'}</strong>${p.afsc ? ` <span style="color:var(--muted); font-family: 'JetBrains Mono', monospace; font-size: 11px;">${p.afsc}</span>` : ''}</td>
                <td>${p.unit || '—'}</td>
                <td>${fmt(p.date)}</td>
                <td><strong>${complete}/${total}</strong> complete</td>
                <td class="row-actions">
                  <button class="btn btn-sm" onclick="viewPerson('${p.id}')">View</button>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

// ==========================================================
// PERSONNEL LIST + DETAIL
// ==========================================================
let currentPersonId = null;

function renderPersonnel() {
  if (currentPersonId) {
    renderPersonDetail(currentPersonId);
    return;
  }
  if (!state.personnel.length) {
    $('personnel-list').innerHTML = `
      <div class="empty">
        <div class="empty-mark">EMPTY ROSTER</div>
        <h3>No personnel records</h3>
        <p>Click "New Personnel Record" to begin tracking someone.</p>
      </div>`;
    return;
  }
  $('personnel-list').innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Status</th><th>Type</th><th>Rank / Name</th><th>AFSC</th>
            <th>Unit</th><th>Date</th><th>Progress</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.personnel.map(p => {
            const s = personStatus(p);
            const { complete, total } = progressCount(p);
            return `
              <tr>
                <td><span class="pill ${s}"><span class="dot"></span>${s.toUpperCase()}</span></td>
                <td><span class="type-badge type-${p.type}">${p.type === 'in' ? 'IN' : 'OUT'}</span></td>
                <td><strong>${p.rank || ''} ${p.name || '(unnamed)'}</strong></td>
                <td>${p.afsc || '—'}</td>
                <td>${p.unit || '—'}</td>
                <td>${fmt(p.date)}</td>
                <td>${complete}/${total}</td>
                <td class="row-actions">
                  <button class="btn btn-sm" onclick="viewPerson('${p.id}')">Manage</button>
                  <button class="btn btn-sm btn-danger" onclick="deletePerson('${p.id}')">Delete</button>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

function viewPerson(id) {
  currentPersonId = id;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'personnel'));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-personnel'));
  renderPersonDetail(id);
}
window.viewPerson = viewPerson;

function backToList() {
  currentPersonId = null;
  renderPersonnel();
}
window.backToList = backToList;

function renderPersonDetail(id) {
  const p = state.personnel.find(x => x.id === id);
  if (!p) { currentPersonId = null; renderPersonnel(); return; }

  const s = personStatus(p);
  const { complete, total } = progressCount(p);

  $('personnel-list').innerHTML = `
    <button class="btn btn-sm" onclick="backToList()" style="margin-bottom:14px">← Back to Roster</button>
    <div class="person-detail-head">
      <div class="pdh-info">
        <h2>${p.rank || ''} ${p.name || '(unnamed)'} <span class="pill ${s}" style="vertical-align: middle; margin-left: 8px;"><span class="dot"></span>${s.toUpperCase()}</span></h2>
        <div class="pdh-meta">
          <span>TYPE: ${p.type === 'in' ? 'IN-PROCESSING' : 'OUT-PROCESSING'}</span>
          <span>AFSC: ${p.afsc || '—'}</span>
          <span>UNIT: ${p.unit || '—'}</span>
          <span>DATE: ${fmt(p.date)}</span>
          <span>PROGRESS: ${complete}/${total}</span>
        </div>
        ${p.email ? `<div class="pdh-meta" style="margin-top:4px"><span>EMAIL: ${p.email}</span>${p.sponsor ? `<span>SPONSOR: ${p.sponsor}</span>` : ''}</div>` : ''}
        ${p.notes ? `<div style="margin-top:10px; font-size: 13px; color: var(--ink);"><strong>Notes:</strong> ${p.notes}</div>` : ''}
      </div>
      <div class="pdh-actions">
        <button class="btn" onclick="editPerson('${p.id}')">Edit Info</button>
        <button class="btn btn-primary" onclick="generateReportFor('${p.id}')">Generate Report</button>
      </div>
    </div>

    <div class="section-header">
      <h2>Assigned Requirements</h2>
      <div class="actions">
        <button class="btn btn-sm" onclick="editPerson('${p.id}')">+ Add/Remove Items</button>
      </div>
    </div>

    ${p.requirements?.length ? `
      <div class="table-wrap">
        <div style="display: grid; grid-template-columns: 1fr 180px 130px 140px 130px; gap: 14px; padding: 11px 16px; background: var(--paper-2); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); font-weight: 700; border-bottom: 1px solid var(--line);">
          <div>Requirement</div><div>POC</div><div>Due Date</div><div>Status</div><div>Actions</div>
        </div>
        ${p.requirements.map(r => {
          const lib = state.library.find(l => l.id === r.libId) || {};
          const due = r.due || computeDueDate(p, lib);
          const rs = reqStatus(r, p);
          return `
            <div class="req-row">
              <div>
                <div class="req-name">${lib.name || r.name || 'Unknown item'}</div>
                <div class="req-cat">${lib.category || ''}</div>
              </div>
              <div style="font-size: 13px; color: var(--muted);">${lib.poc || '—'}</div>
              <div>
                <input type="date" value="${due || ''}" onchange="updateReqDue('${p.id}','${r.id}',this.value)">
              </div>
              <div>
                <select onchange="updateReqStatus('${p.id}','${r.id}',this.value)">
                  <option value="pending" ${r.status === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="in_progress" ${r.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                  <option value="complete" ${r.status === 'complete' ? 'selected' : ''}>Complete</option>
                </select>
                <div style="margin-top: 4px;"><span class="pill ${rs}"><span class="dot"></span>${rs.toUpperCase()}</span></div>
              </div>
              <div class="row-actions">
                <button class="btn btn-sm" onclick="emailReminderFor('${p.id}','${r.id}')">Email</button>
                <button class="btn btn-sm btn-danger" onclick="removeReq('${p.id}','${r.id}')">×</button>
              </div>
            </div>`;
        }).join('')}
      </div>` : `
      <div class="empty">
        <div class="empty-mark">NO ITEMS ASSIGNED</div>
        <h3>This person has no checklist items yet</h3>
        <p>Click "Edit Info" to assign requirements from the library.</p>
      </div>`}
  `;
}

window.updateReqDue = (pid, rid, val) => {
  const p = state.personnel.find(x => x.id === pid);
  const r = p.requirements.find(x => x.id === rid);
  r.due = val;
  saveState();
  renderPersonDetail(pid);
};

window.updateReqStatus = (pid, rid, val) => {
  const p = state.personnel.find(x => x.id === pid);
  const r = p.requirements.find(x => x.id === rid);
  r.status = val;
  if (val === 'complete') r.completedDate = todayISO();
  saveState();
  renderPersonDetail(pid);
};

window.removeReq = (pid, rid) => {
  if (!confirm('Remove this requirement from this person?')) return;
  const p = state.personnel.find(x => x.id === pid);
  p.requirements = p.requirements.filter(r => r.id !== rid);
  saveState();
  renderPersonDetail(pid);
};

window.deletePerson = (id) => {
  if (!confirm('Permanently delete this personnel record?')) return;
  state.personnel = state.personnel.filter(p => p.id !== id);
  saveState();
  if (currentPersonId === id) currentPersonId = null;
  renderAll();
};

// ==========================================================
// PERSON MODAL (Create / Edit)
// ==========================================================
$('btn-new-person').addEventListener('click', () => openPersonModal());

window.editPerson = (id) => openPersonModal(id);

function openPersonModal(id) {
  const isEdit = !!id;
  $('modal-person-title').textContent = isEdit ? 'Edit Personnel Record' : 'New Personnel Record';
  if (isEdit) {
    const p = state.personnel.find(x => x.id === id);
    $('person-id').value = p.id;
    $('person-rank').value = p.rank || '';
    $('person-name').value = p.name || '';
    $('person-type').value = p.type || 'in';
    $('person-date').value = p.date || '';
    $('person-afsc').value = p.afsc || '';
    $('person-unit').value = p.unit || '';
    $('person-email').value = p.email || '';
    $('person-sponsor').value = p.sponsor || '';
    $('person-notes').value = p.notes || '';
    renderChecklistPicker(p.type || 'in', p.requirements || []);
  } else {
    ['person-id','person-rank','person-name','person-date','person-afsc','person-unit','person-email','person-sponsor','person-notes'].forEach(f => $(f).value = '');
    $('person-type').value = 'in';
    renderChecklistPicker('in', []);
  }
  openModal('modal-person');
}

$('person-type').addEventListener('change', () => {
  const existing = $('person-id').value
    ? (state.personnel.find(p => p.id === $('person-id').value)?.requirements || [])
    : [];
  renderChecklistPicker($('person-type').value, existing);
});

function renderChecklistPicker(type, assignedReqs) {
  // Group library by category
  const items = state.library.filter(i => i.applies === type || i.applies === 'both');
  const groups = {};
  items.forEach(i => {
    if (!groups[i.category]) groups[i.category] = [];
    groups[i.category].push(i);
  });

  const assignedIds = new Set(assignedReqs.map(r => r.libId));

  $('checklist-picker').innerHTML = Object.entries(groups).map(([cat, list]) => `
    <div class="picker-group">
      <div class="picker-group-head">
        <span>${cat}</span>
        <button class="select-all" onclick="toggleGroup('${cat}')">Select all</button>
      </div>
      ${list.map(item => `
        <div class="picker-item">
          <input type="checkbox" id="pick-${item.id}" value="${item.id}" ${assignedIds.has(item.id) ? 'checked' : ''} data-cat="${cat}">
          <label for="pick-${item.id}">${item.name}</label>
          <span class="item-meta">${item.suspense != null ? item.suspense + 'd' : '—'} · ${item.poc || ''}</span>
        </div>
      `).join('')}
    </div>
  `).join('');
}

window.toggleGroup = (cat) => {
  const boxes = document.querySelectorAll(`.picker-item input[data-cat="${cat}"]`);
  const allChecked = Array.from(boxes).every(b => b.checked);
  boxes.forEach(b => b.checked = !allChecked);
};

$('btn-save-person').addEventListener('click', () => {
  const id = $('person-id').value;
  const data = {
    rank: $('person-rank').value.trim(),
    name: $('person-name').value.trim(),
    type: $('person-type').value,
    date: $('person-date').value,
    afsc: $('person-afsc').value.trim(),
    unit: $('person-unit').value.trim(),
    email: $('person-email').value.trim(),
    sponsor: $('person-sponsor').value.trim(),
    notes: $('person-notes').value.trim(),
  };
  if (!data.name) { alert('Name is required.'); return; }
  if (!data.date) { alert('Report/Departure date is required.'); return; }

  // Gather selected library items
  const selectedIds = Array.from(document.querySelectorAll('#checklist-picker input[type="checkbox"]:checked')).map(c => c.value);

  let person;
  if (id) {
    person = state.personnel.find(p => p.id === id);
    Object.assign(person, data);

    // Reconcile requirements: keep existing matching, add new, drop unselected
    const existingMap = new Map((person.requirements || []).map(r => [r.libId, r]));
    person.requirements = selectedIds.map(libId => {
      if (existingMap.has(libId)) return existingMap.get(libId);
      const lib = state.library.find(l => l.id === libId);
      return {
        id: uid(), libId,
        status: 'pending',
        due: computeDueDate(person, lib),
      };
    });
  } else {
    person = { id: uid(), ...data, createdDate: todayISO(), requirements: [] };
    person.requirements = selectedIds.map(libId => {
      const lib = state.library.find(l => l.id === libId);
      return {
        id: uid(), libId,
        status: 'pending',
        due: computeDueDate(person, lib),
      };
    });
    state.personnel.push(person);
  }
  saveState();
  closeModal('modal-person');
  renderAll();
});

// ==========================================================
// NOTIFICATIONS
// ==========================================================
function getNotifications(filter = 'all') {
  const list = [];
  state.personnel.forEach(p => {
    (p.requirements || []).forEach(r => {
      if (r.status === 'complete') return;
      const lib = state.library.find(l => l.id === r.libId) || {};
      const due = r.due || computeDueDate(p, lib);
      if (!due) return;
      const d = daysBetween(todayISO(), due);
      let sev = 'green';
      if (d < 0) sev = 'red';
      else if (d <= 7) sev = 'amber';
      else sev = 'green';
      if (filter === 'overdue' && sev !== 'red') return;
      if (filter === 'dueSoon' && sev !== 'amber') return;
      if (filter === 'all' && sev === 'green') return;
      list.push({ person: p, req: r, lib, due, days: d, sev });
    });
  });
  list.sort((a, b) => a.days - b.days);
  return list;
}

function renderNotifications() {
  const filter = $('notif-filter').value;
  const list = getNotifications(filter);
  if (!list.length) {
    $('notif-list').innerHTML = `
      <div class="empty">
        <div class="empty-mark">ALL CLEAR</div>
        <h3>No pending notifications</h3>
        <p>No requirements are overdue or due within 7 days.</p>
      </div>`;
    return;
  }
  $('notif-list').innerHTML = `<div class="notif-list">${list.map(n => `
    <div class="notif-card ${n.sev}">
      <div class="notif-info">
        <h4>${n.lib.name || 'Unknown'} — ${n.person.rank || ''} ${n.person.name}</h4>
        <p>${n.person.type === 'in' ? 'In-processing' : 'Out-processing'} · ${n.person.unit || ''} · POC: ${n.lib.poc || '—'}</p>
      </div>
      <div style="text-align:right">
        <div class="notif-meta">${n.days < 0 ? `${Math.abs(n.days)}d OVERDUE` : n.days === 0 ? 'DUE TODAY' : `Due in ${n.days}d`}</div>
        <div class="notif-meta">${fmt(n.due)}</div>
      </div>
      <div class="row-actions">
        <button class="btn btn-sm" onclick="viewPerson('${n.person.id}')">Open</button>
        <button class="btn btn-sm btn-gold" onclick="emailReminderFor('${n.person.id}','${n.req.id}')">Email Draft</button>
      </div>
    </div>
  `).join('')}</div>`;
}

$('notif-filter').addEventListener('change', renderNotifications);

// ==========================================================
// EMAIL DRAFTS
// ==========================================================
window.emailReminderFor = (pid, rid) => {
  const p = state.personnel.find(x => x.id === pid);
  const r = p.requirements.find(x => x.id === rid);
  const lib = state.library.find(l => l.id === r.libId) || {};
  const due = r.due || computeDueDate(p, lib);
  const days = due ? daysBetween(todayISO(), due) : null;
  const status = days < 0 ? `OVERDUE by ${Math.abs(days)} day(s)` : days === 0 ? 'DUE TODAY' : `due in ${days} day(s)`;

  const subject = `[${p.type === 'in' ? 'IN' : 'OUT'}-PROCESSING] ${lib.name} — ${p.rank} ${p.name} — ${status}`;
  const body =
`${p.rank} ${p.name},

This is a reminder regarding your ${p.type === 'in' ? 'in-processing' : 'out-processing'} requirement:

  Item:       ${lib.name}
  Category:   ${lib.category || '—'}
  POC/Office: ${lib.poc || '—'}
  Due Date:   ${fmt(due)} (${status})

${lib.description || ''}

Please coordinate with the responsible office to complete this action and notify the CSS upon completion.

Respectfully,
Commander's Support Staff
${p.unit || ''}`;

  $('email-to').value = p.email || '';
  $('email-subject').value = subject;
  $('email-body').value = body;
  openModal('modal-email');
};

$('btn-copy-email').addEventListener('click', () => {
  const text = `To: ${$('email-to').value}\nSubject: ${$('email-subject').value}\n\n${$('email-body').value}`;
  navigator.clipboard.writeText(text).then(() => {
    $('btn-copy-email').textContent = 'Copied!';
    setTimeout(() => $('btn-copy-email').textContent = 'Copy to Clipboard', 1500);
  });
});

$('btn-mailto').addEventListener('click', () => {
  const to = encodeURIComponent($('email-to').value);
  const subj = encodeURIComponent($('email-subject').value);
  const body = encodeURIComponent($('email-body').value);
  window.location.href = `mailto:${to}?subject=${subj}&body=${body}`;
});

$('btn-export-all-emails').addEventListener('click', () => {
  const list = getNotifications($('notif-filter').value);
  if (!list.length) { alert('No notifications to export.'); return; }
  const text = list.map(n => {
    const due = n.due;
    const days = n.days;
    const status = days < 0 ? `OVERDUE by ${Math.abs(days)} day(s)` : days === 0 ? 'DUE TODAY' : `due in ${days} day(s)`;
    return `==============================
To:      ${n.person.email || '(no email on file)'}
Subject: [${n.person.type === 'in' ? 'IN' : 'OUT'}-PROCESSING] ${n.lib.name} — ${n.person.rank} ${n.person.name} — ${status}

${n.person.rank} ${n.person.name},

This is a reminder regarding your ${n.person.type === 'in' ? 'in-processing' : 'out-processing'} requirement:

  Item:       ${n.lib.name}
  POC/Office: ${n.lib.poc || '—'}
  Due Date:   ${fmt(due)} (${status})

Please coordinate with the responsible office to complete this action.

Respectfully,
Commander's Support Staff
${n.person.unit || ''}
`;
  }).join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `CSS_Email_Drafts_${todayISO()}.txt`;
  a.click();
});

// ==========================================================
// REPORTS
// ==========================================================
function renderReports() {
  const sel = $('report-person');
  sel.innerHTML = '<option value="">— Select Personnel —</option>' +
    state.personnel.map(p => `<option value="${p.id}">${p.rank || ''} ${p.name} (${p.type === 'in' ? 'IN' : 'OUT'})</option>`).join('');
  if (!$('report-output-wrap').innerHTML) {
    $('report-output-wrap').innerHTML = `
      <div class="empty">
        <div class="empty-mark">SELECT PERSONNEL</div>
        <h3>Generate a status report</h3>
        <p>Choose a person from the dropdown and click "Generate Report" to produce a printable status summary.</p>
      </div>`;
  }
}

$('btn-generate-report').addEventListener('click', () => {
  const id = $('report-person').value;
  if (!id) { alert('Select a person first.'); return; }
  generateReportFor(id);
});

window.generateReportFor = (id) => {
  // Switch to reports tab
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'reports'));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-reports'));
  $('report-person').value = id;

  const p = state.personnel.find(x => x.id === id);
  if (!p) return;
  const { complete, total } = progressCount(p);
  const pct = total ? Math.round(complete / total * 100) : 0;
  const s = personStatus(p);

  // Group requirements by category
  const grouped = {};
  (p.requirements || []).forEach(r => {
    const lib = state.library.find(l => l.id === r.libId) || {};
    const cat = lib.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ r, lib });
  });

  $('report-output-wrap').innerHTML = `
    <div class="report-output" id="report-printable">
      <h1>${p.type === 'in' ? 'IN' : 'OUT'}-Processing Status Report</h1>
      <div class="meta">
        GENERATED: ${new Date().toLocaleString()} &nbsp;|&nbsp;
        CSS · ${p.unit || 'UNIT NOT SPECIFIED'}
      </div>

      <table style="width:100%; border:1px solid var(--line);">
        <tr><td style="background: var(--paper-2); width: 35%; font-weight:700;">Rank / Name</td><td>${p.rank || ''} ${p.name}</td></tr>
        <tr><td style="background: var(--paper-2); font-weight:700;">AFSC</td><td>${p.afsc || '—'}</td></tr>
        <tr><td style="background: var(--paper-2); font-weight:700;">Unit / Section</td><td>${p.unit || '—'}</td></tr>
        <tr><td style="background: var(--paper-2); font-weight:700;">Process Type</td><td>${p.type === 'in' ? 'IN-PROCESSING' : 'OUT-PROCESSING'}</td></tr>
        <tr><td style="background: var(--paper-2); font-weight:700;">Report / Departure Date</td><td>${fmt(p.date)}</td></tr>
        <tr><td style="background: var(--paper-2); font-weight:700;">Sponsor / Supervisor</td><td>${p.sponsor || '—'}</td></tr>
        <tr><td style="background: var(--paper-2); font-weight:700;">Overall Status</td><td><span class="pill ${s}"><span class="dot"></span>${s.toUpperCase()}</span> &nbsp; ${complete} of ${total} complete (${pct}%)</td></tr>
      </table>

      ${p.notes ? `<h2>Notes</h2><p>${p.notes}</p>` : ''}

      <h2>Requirements by Category</h2>
      ${Object.keys(grouped).length === 0 ? '<p style="color:var(--muted)">No requirements assigned.</p>' :
        Object.entries(grouped).map(([cat, items]) => `
          <div style="margin-bottom:14px">
            <div style="font-weight:700; color: var(--usaf-blue); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom:6px; border-bottom: 1px solid var(--line); padding-bottom: 3px;">${cat}</div>
            <table style="width:100%; border:1px solid var(--line);">
              <thead>
                <tr style="background: var(--paper-2);">
                  <th style="width:40%">Item</th><th>POC</th><th>Due</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(({ r, lib }) => {
                  const rs = reqStatus(r, p);
                  const due = r.due || computeDueDate(p, lib);
                  const statusLabel = r.status === 'complete' ? 'COMPLETE' : r.status === 'in_progress' ? 'IN PROGRESS' : 'PENDING';
                  return `<tr>
                    <td><strong>${lib.name || '—'}</strong></td>
                    <td>${lib.poc || '—'}</td>
                    <td>${fmt(due)}</td>
                    <td><span class="pill ${rs}"><span class="dot"></span>${statusLabel}</span></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>`).join('')}

      <h2>Summary</h2>
      <p style="font-size:13px">
        ${p.rank} ${p.name} is currently <strong>${pct}% complete</strong> with assigned ${p.type === 'in' ? 'in-processing' : 'out-processing'} requirements.
        ${(p.requirements || []).filter(r => reqStatus(r, p) === 'red').length > 0
          ? `<strong style="color:var(--red)"> ${(p.requirements || []).filter(r => reqStatus(r, p) === 'red').length} item(s) are overdue and require immediate action.</strong>`
          : ''}
        ${(p.requirements || []).filter(r => reqStatus(r, p) === 'amber').length > 0
          ? ` ${(p.requirements || []).filter(r => reqStatus(r, p) === 'amber').length} item(s) are due within 7 days.`
          : ''}
      </p>

      <p style="font-size:11px; color: var(--muted); margin-top:24px; font-family: 'JetBrains Mono', monospace; letter-spacing: .5px;">
        // END OF REPORT &nbsp;|&nbsp; Prepared by Commander's Support Staff
      </p>
    </div>`;
};

$('btn-print-report').addEventListener('click', () => {
  if (!$('report-output-wrap').querySelector('.report-output')) {
    alert('Generate a report first.');
    return;
  }
  window.print();
});

// ==========================================================
// LIBRARY MANAGEMENT
// ==========================================================
function renderLibrary() {
  // Group by category
  const groups = {};
  state.library.forEach(i => {
    if (!groups[i.category]) groups[i.category] = [];
    groups[i.category].push(i);
  });

  $('library-list').innerHTML = Object.entries(groups).map(([cat, items]) => `
    <div style="margin-bottom: 18px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--usaf-blue); font-weight: 700; margin-bottom: 8px;">${cat} <span style="color:var(--muted); font-weight: 500;">(${items.length})</span></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Item</th><th>Applies To</th><th>Suspense</th><th>POC</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${items.map(i => `
              <tr>
                <td><strong>${i.name}</strong>${i.description ? `<div style="font-size:11px;color:var(--muted);margin-top:2px">${i.description}</div>` : ''}</td>
                <td><span class="pill ${i.applies === 'in' ? 'blue' : i.applies === 'out' ? 'gray' : 'green'}">${i.applies === 'both' ? 'IN & OUT' : i.applies.toUpperCase()}</span></td>
                <td style="font-family:'JetBrains Mono',monospace; font-size: 13px;">${i.suspense != null ? i.suspense + ' days' : '—'}</td>
                <td>${i.poc || '—'}</td>
                <td class="row-actions">
                  <button class="btn btn-sm" onclick="editLibItem('${i.id}')">Edit</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteLibItem('${i.id}')">Delete</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `).join('');
}

$('btn-new-item').addEventListener('click', () => openItemModal());
window.editLibItem = (id) => openItemModal(id);

function openItemModal(id) {
  $('modal-item-title').textContent = id ? 'Edit Checklist Item' : 'Add Checklist Item';
  if (id) {
    const item = state.library.find(i => i.id === id);
    $('item-id').value = item.id;
    $('item-name').value = item.name;
    $('item-category').value = item.category;
    $('item-applies').value = item.applies;
    $('item-suspense').value = item.suspense ?? '';
    $('item-poc').value = item.poc || '';
    $('item-desc').value = item.description || '';
  } else {
    ['item-id','item-name','item-category','item-suspense','item-poc','item-desc'].forEach(f => $(f).value = '');
    $('item-applies').value = 'both';
  }
  openModal('modal-item');
}

$('btn-save-item').addEventListener('click', () => {
  const id = $('item-id').value;
  const data = {
    name: $('item-name').value.trim(),
    category: $('item-category').value.trim() || 'Other',
    applies: $('item-applies').value,
    suspense: $('item-suspense').value === '' ? null : parseInt($('item-suspense').value, 10),
    poc: $('item-poc').value.trim(),
    description: $('item-desc').value.trim(),
  };
  if (!data.name) { alert('Item name is required.'); return; }
  if (id) {
    Object.assign(state.library.find(i => i.id === id), data);
  } else {
    state.library.push({ id: uid(), ...data });
  }
  saveState();
  closeModal('modal-item');
  renderLibrary();
});

window.deleteLibItem = (id) => {
  if (!confirm('Delete this library item? Existing personnel records that use it will keep their assigned copy.')) return;
  state.library = state.library.filter(i => i.id !== id);
  saveState();
  renderLibrary();
};

$('btn-reset-library').addEventListener('click', () => {
  if (!confirm('Reset the library to defaults? Custom items will be lost. Personnel records will not be affected.')) return;
  state.library = DEFAULT_LIBRARY.map(i => ({ ...i }));
  saveState();
  renderLibrary();
});

// ==========================================================
// IMPORT / EXPORT
// ==========================================================
$('btn-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `css_tracker_backup_${todayISO()}.json`;
  a.click();
});

$('btn-import').addEventListener('click', () => $('file-import').click());
$('file-import').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (!parsed.library || !parsed.personnel) throw new Error('Invalid format');
      if (!confirm('Replace current data with imported data? This cannot be undone (consider exporting first).')) return;
      state = parsed;
      saveState();
      renderAll();
      alert('Import successful.');
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// ==========================================================
// RENDER ALL
// ==========================================================
function renderAll() {
  renderDashboard();
  renderPersonnel();
  renderNotifications();
  renderReports();
  renderLibrary();
}
renderAll();

// ==========================================================
// CHECKLIST IMPORT (Word .docx / Excel .xlsx)
// ==========================================================

// Working state during an import
let importState = {
  rawRows: [],     // For Excel: array of arrays (rows of cells)
  headers: [],     // Detected header row from Excel
  mapping: {},     // Column index -> field name (name/category/applies/suspense/poc/description)
  items: [],       // Parsed/edited items, each with __include boolean
  source: '',      // 'xlsx' | 'docx'
  filename: '',
};

// Heuristic keywords for auto-mapping Excel columns to fields.
// Order matters: more specific fields checked first. 'POC' must beat 'category' on "Office".
const FIELD_KEYWORDS = {
  poc:         ['poc', 'contact', 'responsible', 'owner', 'assigned', 'office'],
  suspense:    ['suspense', 'days from', 'days before', 'days', 'due', 'deadline', 'timeline'],
  applies:     ['applies', 'in/out', 'process', 'phase', 'when'],
  category:    ['category', 'cat', 'section', 'group', 'area', 'function', 'type'],
  name:        ['item', 'name', 'requirement', 'task', 'action', 'checklist', 'activity', 'step', 'description'],
  description: ['notes', 'detail', 'instruction', 'remark', 'comment'],
};

function guessFieldForHeader(header) {
  const h = String(header || '').toLowerCase().trim();
  if (!h) return null;
  for (const [field, keys] of Object.entries(FIELD_KEYWORDS)) {
    if (keys.some(k => h.includes(k))) return field;
  }
  return null;
}

// Try to infer applies-to from a value like "In", "Out", "Both", "In-Processing", etc.
function inferApplies(val) {
  const s = String(val || '').toLowerCase().trim();
  if (!s) return 'both';
  if (/(both|in.*out|all)/.test(s)) return 'both';
  if (/^out|departure|separation|pcs.*out/.test(s)) return 'out';
  if (/^in|arrival|report|pcs.*in/.test(s)) return 'in';
  return 'both';
}

// Try to extract a number of days from "7 days", "within 14 days", "7d", "30", etc.
function inferSuspense(val) {
  if (val == null || val === '') return null;
  const s = String(val);
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// Open the import modal
$('btn-import-checklist').addEventListener('click', () => {
  resetImport();
  openModal('modal-import');
});

function resetImport() {
  importState = { rawRows: [], headers: [], mapping: {}, items: [], source: '', filename: '' };
  $('import-step-upload').style.display = 'block';
  $('import-step-mapping').style.display = 'none';
  $('import-step-preview').style.display = 'none';
  $('import-foot-upload').style.display = 'flex';
  $('import-foot-preview').style.display = 'none';
  $('import-file').value = '';
}
window.resetImport = resetImport;

// Drop zone wiring
const dropZone = $('drop-zone');
dropZone.addEventListener('click', () => $('import-file').click());
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleImportFile(file);
});
$('import-file').addEventListener('change', e => {
  if (e.target.files[0]) handleImportFile(e.target.files[0]);
});

async function handleImportFile(file) {
  importState.filename = file.name;
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      await parseExcel(file);
    } else if (name.endsWith('.docx')) {
      await parseWord(file);
    } else {
      alert('Unsupported file type. Please upload .xlsx, .xls, or .docx.');
      return;
    }
  } catch (err) {
    alert('Failed to parse file: ' + err.message);
    console.error(err);
  }
}

// ---------- EXCEL PARSING ----------
async function parseExcel(file) {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  if (!rows.length) throw new Error('Spreadsheet is empty.');

  // Find header row: first row with 2+ non-empty cells, ideally containing keyword matches
  let headerIdx = 0;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i];
    const nonEmpty = row.filter(c => String(c).trim() !== '').length;
    const matches = row.filter(c => guessFieldForHeader(c)).length;
    if (matches >= 2 || (nonEmpty >= 3 && matches >= 1)) {
      headerIdx = i;
      break;
    }
  }

  importState.source = 'xlsx';
  importState.headers = rows[headerIdx].map(h => String(h).trim());
  importState.rawRows = rows.slice(headerIdx + 1).filter(r => r.some(c => String(c).trim() !== ''));

  // Auto-map
  const mapping = {};
  importState.headers.forEach((h, i) => {
    const field = guessFieldForHeader(h);
    if (field && !Object.values(mapping).includes(field)) mapping[i] = field;
  });
  importState.mapping = mapping;

  // Show mapping step
  $('import-step-upload').style.display = 'none';
  $('import-step-mapping').style.display = 'block';
  $('parse-status-mapping').textContent =
    `✓ Parsed ${file.name} — found ${importState.headers.length} columns, ${importState.rawRows.length} data rows.`;
  $('parse-status-mapping').className = 'parse-status';

  renderMappingUI();
}

function renderMappingUI() {
  const fields = [
    { key: 'name', label: 'Item Name *' },
    { key: 'category', label: 'Category' },
    { key: 'applies', label: 'Applies (In/Out/Both)' },
    { key: 'suspense', label: 'Suspense (Days)' },
    { key: 'poc', label: 'POC / Office' },
    { key: 'description', label: 'Description / Notes' },
  ];
  $('mapping-grid').innerHTML = fields.map(f => {
    const opts = ['<option value="">— Not in file —</option>']
      .concat(importState.headers.map((h, i) => {
        const sel = importState.mapping[i] === f.key ? 'selected' : '';
        return `<option value="${i}" ${sel}>${h || '(unnamed col ' + (i + 1) + ')'}</option>`;
      }));
    return `
      <div>
        <label>${f.label}</label>
        <select data-field="${f.key}" onchange="updateMapping(this)">
          ${opts.join('')}
        </select>
      </div>`;
  }).join('');
}

window.updateMapping = (sel) => {
  const field = sel.dataset.field;
  const val = sel.value;
  // Remove this field from any previous column
  Object.keys(importState.mapping).forEach(k => {
    if (importState.mapping[k] === field) delete importState.mapping[k];
  });
  if (val !== '') importState.mapping[val] = field;
};

window.applyMapping = () => {
  // Check at least name is mapped
  if (!Object.values(importState.mapping).includes('name')) {
    alert('Please map a column to "Item Name" before continuing.');
    return;
  }
  // Build items from rows
  importState.items = importState.rawRows.map(row => {
    const item = { __include: true };
    Object.entries(importState.mapping).forEach(([colIdx, field]) => {
      item[field] = row[parseInt(colIdx, 10)];
    });
    item.name = String(item.name || '').trim();
    item.category = String(item.category || 'Other').trim() || 'Other';
    item.applies = inferApplies(item.applies);
    item.suspense = inferSuspense(item.suspense);
    item.poc = String(item.poc || '').trim();
    item.description = String(item.description || '').trim();
    if (!item.name) item.__include = false;
    return item;
  });
  showPreview();
};

// ---------- WORD PARSING ----------
async function parseWord(file) {
  const buf = await file.arrayBuffer();
  // Extract HTML so we can preserve table structure
  const result = await mammoth.convertToHtml({ arrayBuffer: buf });
  const html = result.value;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const items = [];

  // Strategy 1: Tables
  const tables = tempDiv.querySelectorAll('table');
  tables.forEach(table => {
    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length < 2) return;
    const headerCells = Array.from(rows[0].querySelectorAll('td, th')).map(c => c.textContent.trim());
    // Build column map
    const colMap = {};
    headerCells.forEach((h, i) => {
      const field = guessFieldForHeader(h);
      if (field && !Object.values(colMap).includes(field)) colMap[i] = field;
    });
    // If we can't find a name column heuristically, assume first column is the item
    if (!Object.values(colMap).includes('name')) colMap[0] = 'name';

    rows.slice(1).forEach(tr => {
      const cells = Array.from(tr.querySelectorAll('td, th')).map(c => c.textContent.trim());
      if (!cells.some(c => c)) return;
      const item = { __include: true };
      Object.entries(colMap).forEach(([idx, field]) => {
        item[field] = cells[parseInt(idx, 10)] || '';
      });
      item.name = String(item.name || '').trim();
      if (!item.name) return;
      item.category = String(item.category || 'Imported').trim() || 'Imported';
      item.applies = inferApplies(item.applies);
      item.suspense = inferSuspense(item.suspense);
      item.poc = String(item.poc || '').trim();
      item.description = String(item.description || '').trim();
      items.push(item);
    });
  });

  // Strategy 2: Bulleted/numbered lists (if no tables found, or as supplement)
  if (items.length === 0) {
    const listItems = tempDiv.querySelectorAll('li');
    let currentCategory = 'Imported';

    // Walk through document to track headings as category context
    const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      const tag = node.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) {
        currentCategory = node.textContent.trim().slice(0, 50) || 'Imported';
      } else if (tag === 'li') {
        const text = node.textContent.trim();
        if (!text) continue;
        items.push({
          __include: true,
          name: text.length > 200 ? text.slice(0, 200) : text,
          category: currentCategory,
          applies: 'both',
          suspense: inferSuspense(text),
          poc: '',
          description: '',
        });
      }
    }
  }

  // Strategy 3: If still nothing, fall back to paragraphs that look like checklist lines
  if (items.length === 0) {
    const paras = tempDiv.querySelectorAll('p');
    paras.forEach(p => {
      const t = p.textContent.trim();
      // Look for lines starting with ☐, □, [], -, *, or numbered patterns
      if (/^[\u2610\u25A1\u25FB\u25FC\[\]\-\*\u2022]|^\d+[\.\)]/.test(t)) {
        const clean = t.replace(/^[\u2610\u25A1\u25FB\u25FC\[\]\-\*\u2022\s]+|^\d+[\.\)]\s*/, '').trim();
        if (clean.length > 2) {
          items.push({
            __include: true,
            name: clean.slice(0, 200),
            category: 'Imported',
            applies: 'both',
            suspense: null,
            poc: '',
            description: '',
          });
        }
      }
    });
  }

  if (items.length === 0) {
    throw new Error('No checklist items could be detected in this Word document. Try a file with tables or bulleted lists.');
  }

  importState.source = 'docx';
  importState.items = items;

  // Skip mapping step — go straight to preview
  $('import-step-upload').style.display = 'none';
  $('import-step-preview').style.display = 'block';
  $('import-foot-upload').style.display = 'none';
  $('import-foot-preview').style.display = 'flex';
  $('parse-status-preview').textContent =
    `✓ Parsed ${file.name} — extracted ${items.length} candidate item(s). Review and adjust before adding to the library.`;
  $('parse-status-preview').className = 'parse-status';
  renderPreview();
}

// ---------- PREVIEW ----------
function showPreview() {
  $('import-step-mapping').style.display = 'none';
  $('import-step-preview').style.display = 'block';
  $('import-foot-upload').style.display = 'none';
  $('import-foot-preview').style.display = 'flex';
  const included = importState.items.filter(i => i.__include).length;
  $('parse-status-preview').textContent =
    `✓ ${importState.items.length} row(s) parsed from ${importState.filename}. ${included} ready to import.`;
  $('parse-status-preview').className = importState.items.length === 0 ? 'parse-status warn' : 'parse-status';
  renderPreview();
}

function renderPreview() {
  $('preview-body').innerHTML = importState.items.map((item, idx) => `
    <div class="preview-row">
      <div><input type="checkbox" ${item.__include ? 'checked' : ''} onchange="updatePreview(${idx}, '__include', this.checked)"></div>
      <div><input type="text" value="${escAttr(item.name)}" onchange="updatePreview(${idx}, 'name', this.value)"></div>
      <div><input type="text" value="${escAttr(item.category)}" onchange="updatePreview(${idx}, 'category', this.value)"></div>
      <div>
        <select onchange="updatePreview(${idx}, 'applies', this.value)">
          <option value="both" ${item.applies === 'both' ? 'selected' : ''}>Both</option>
          <option value="in" ${item.applies === 'in' ? 'selected' : ''}>In</option>
          <option value="out" ${item.applies === 'out' ? 'selected' : ''}>Out</option>
        </select>
      </div>
      <div><input type="text" value="${item.suspense ?? ''}" onchange="updatePreview(${idx}, 'suspense', this.value)" placeholder="days"></div>
      <div><input type="text" value="${escAttr(item.poc)}" onchange="updatePreview(${idx}, 'poc', this.value)"></div>
      <div><button class="btn-remove" onclick="removePreviewRow(${idx})" title="Remove">×</button></div>
    </div>
  `).join('');
  updateSummary();
}

function escAttr(s) {
  return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

window.updatePreview = (idx, field, value) => {
  if (field === 'suspense') {
    importState.items[idx][field] = value === '' ? null : parseInt(value, 10);
  } else {
    importState.items[idx][field] = value;
  }
  updateSummary();
};

window.removePreviewRow = (idx) => {
  importState.items.splice(idx, 1);
  renderPreview();
};

window.togglePreviewAll = (val) => {
  importState.items.forEach(i => i.__include = val);
  renderPreview();
};

function updateSummary() {
  const included = importState.items.filter(i => i.__include && i.name?.trim()).length;
  $('preview-summary').textContent =
    `${included} of ${importState.items.length} items will be added to the library. Uncheck rows to exclude them.`;
}

// ---------- MERGE INTO LIBRARY ----------
$('btn-import-merge').addEventListener('click', () => {
  const toAdd = importState.items.filter(i => i.__include && i.name?.trim());
  if (!toAdd.length) {
    alert('No items selected to import.');
    return;
  }

  // Detect duplicates by name (case-insensitive)
  const existingNames = new Set(state.library.map(l => l.name.toLowerCase().trim()));
  const newItems = [];
  let skipped = 0;
  toAdd.forEach(item => {
    if (existingNames.has(item.name.toLowerCase().trim())) {
      skipped++;
      return;
    }
    newItems.push({
      id: uid(),
      name: item.name.trim(),
      category: item.category?.trim() || 'Imported',
      applies: item.applies || 'both',
      suspense: item.suspense != null ? item.suspense : null,
      poc: item.poc?.trim() || '',
      description: item.description?.trim() || '',
    });
  });

  if (skipped > 0 && newItems.length === 0) {
    alert(`All ${skipped} item(s) already exist in the library (matched by name). Nothing was added.`);
    return;
  }

  state.library.push(...newItems);
  saveState();
  closeModal('modal-import');
  renderLibrary();

  const msg = skipped > 0
    ? `Added ${newItems.length} new item(s) to the library. ${skipped} duplicate(s) were skipped.`
    : `Added ${newItems.length} new item(s) to the library.`;
  alert(msg);
});
