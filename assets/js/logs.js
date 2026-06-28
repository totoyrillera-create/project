'use strict';

let activeFilter = 'all';

function setFilter(f, btn) {
  activeFilter = f;
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderLogs();
}

function renderLogs() {
  const query   = (document.getElementById('logSearch')?.value || '').toLowerCase();
  let entries   = SYSTEM.history;
  if (activeFilter !== 'all') entries = entries.filter(e => e.severity === activeFilter);
  if (query) entries = entries.filter(e =>
    e.event.toLowerCase().includes(query) ||
    e.data.toLowerCase().includes(query)  ||
    e.action.toLowerCase().includes(query)
  );

  const body = document.getElementById('logBody');
  if (!body) return;

  if (!entries.length) {
    body.innerHTML = `<div class="empty-state"><div class="e-icon">📋</div><span>NO EVENTS FOUND</span></div>`;
  } else {
    body.innerHTML = entries.map((e, i) => `
      <div class="table-row log-row sev-${e.severity}">
        <div class="col-mono">#${SYSTEM.history.length - SYSTEM.history.indexOf(e)}</div>
        <div class="col-mono">${e.date} ${e.time}</div>
        <div style="color:var(--c-text);font-weight:500;">${e.event}</div>
        <div class="col-mono" style="color:var(--c-fire2);">${e.data}</div>
        <div style="color:var(--c-safe);font-size:0.8rem;">${e.action}</div>
        <div>${sevBadge(e.severity)}</div>
      </div>`).join('');
  }

  const el = id => document.getElementById(id);
  if (el('cTotal'))  el('cTotal').textContent  = SYSTEM.history.length;
  if (el('cDanger')) el('cDanger').textContent = SYSTEM.history.filter(e => e.severity === 'danger').length;
  if (el('cWarn'))   el('cWarn').textContent   = SYSTEM.history.filter(e => e.severity === 'warn').length;
  if (el('cInfo'))   el('cInfo').textContent   = SYSTEM.history.filter(e => e.severity === 'info').length;
  if (el('sidebarBadge')) el('sidebarBadge').textContent = SYSTEM.alarmCount;
}

function sevBadge(s) {
  const map = {
    danger: '<span class="badge badge-danger">CRITICAL</span>',
    warn:   '<span class="badge badge-warn">WARNING</span>',
    info:   '<span class="badge badge-info">INFO</span>',
  };
  return map[s] || map.info;
}

function clearLogs() {
  if (confirm('Clear all logs?')) { SYSTEM.history = []; renderLogs(); }
}

function exportCSV() {
  const rows = [['#','Date','Time','Event','Data','Action','Severity']];
  SYSTEM.history.forEach((e, i) => {
    rows.push([i+1, e.date, e.time, `"${e.event}"`, `"${e.data}"`, `"${e.action}"`, e.severity]);
  });
  const a = document.createElement('a');
  a.href = 'data:text/csv,' + encodeURIComponent(rows.map(r => r.join(',')).join('\n'));
  a.download = `ignisguard-log-${Date.now()}.csv`;
  a.click();
}

document.addEventListener('ignis:update', renderLogs);
