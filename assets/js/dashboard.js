'use strict';

const CIRC = 2 * Math.PI * 54;

function setOfflineUI() {
  const e = id => document.getElementById(id);

  const ring = e('ringFill');
  if (ring) { ring.style.strokeDashoffset = CIRC; ring.style.stroke = 'rgba(255,255,255,0.08)'; }
  setTxt('riskPct',  '--'); setCol('riskPct',  'var(--c-text3)');
  setTxt('riskLvl',  'OFFLINE'); setCol('riskLvl', 'var(--c-text3)');
  setTxt('riskTitle','No Connection'); setCol('riskTitle','var(--c-text3)');

  setTxt('tempVal',  '--'); setCol('tempVal',  'var(--c-text3)'); setTxt('tempUnit', '');
  setTxt('smokeVal', '--'); setCol('smokeVal', 'var(--c-text3)'); setTxt('smokeUnit', '');
  setTxt('flameVal', '--'); setCol('flameVal', 'var(--c-text3)');
  setTxt('tempMeta',  'No sensor data');
  setTxt('smokeMeta', 'No sensor data');
  setTxt('flameMeta', 'No sensor data');

  const tb = e('tempBar');  if (tb)  { tb.style.width  = '0%'; tb.className  = 'bar-fill bar-muted'; }
  const sb = e('smokeBar'); if (sb)  { sb.style.width  = '0%'; sb.className  = 'bar-fill bar-muted'; }

  const fd = e('flameDot'); if (fd) fd.className = 'dot dot-off';

  const zone = e('zoneMain');
  const zl   = e('zoneStatusLabel');
  if (zone) zone.className = 'zone-single';
  if (zl)   { zl.textContent = '● Offline'; zl.style.color = 'var(--c-text3)'; }

  ['dotBuzzer','dotFan','dotSprinkler'].forEach(id => { const d=e(id); if(d) d.className='dot dot-off'; });
  [['stBuzzer','--'],['stFan','--'],['stSprinkler','--']].forEach(([id,txt]) => {
    const s=e(id); if(s) { s.textContent=txt; s.style.color='var(--c-text3)'; }
  });

  const da = e('dotArduino'); if (da) da.className = 'dot dot-err';
  const sa = e('stArduino'); if (sa) { sa.textContent = 'OFFLINE'; sa.style.color = 'var(--c-danger)'; }

  const pill  = e('arduinoPill');
  const label = e('arduinoLabel');
  const badge = e('arduinoBadge');
  if (pill)  pill.className  = 'status-pill offline';
  if (label) label.textContent = 'Arduino Offline';
  if (badge) { badge.textContent = 'Arduino Offline'; badge.className = 'badge badge-danger'; }
}

function setOnlineUI() {
  const e = id => document.getElementById(id);
  const da = e('dotArduino'); if (da) da.className = 'dot dot-on';
  const sa = e('stArduino'); if (sa) { sa.textContent = 'RUNNING'; sa.style.color = 'var(--c-safe)'; }

  const pill  = e('arduinoPill');
  const label = e('arduinoLabel');
  const badge = e('arduinoBadge');
  if (pill)  pill.className  = 'status-pill online';
  if (label) label.textContent = 'Arduino Online';
  if (badge) { badge.textContent = 'Arduino Online'; badge.className = 'badge badge-safe'; }
}

document.addEventListener('arduino:status', ({ detail: { online } }) => {
  if (online) setOnlineUI(); else setOfflineUI();
});

document.addEventListener('ignis:update', ({ detail: { risk, level } }) => {
  if (!SYSTEM.arduinoOnline) { setOfflineUI(); return; }

  setOnlineUI();

  const color  = riskColor(level);
  const offset = CIRC - (risk / 100) * CIRC;
  const ring   = document.getElementById('ringFill');
  if (ring) { ring.style.strokeDashoffset = offset; ring.style.stroke = color; }

  setTxt('riskPct',   risk + '%');      setCol('riskPct',   color);
  setTxt('riskLvl',   level);           setCol('riskLvl',   color);
  const titles = { SAFE:'All Clear', WARNING:'Elevated Risk', CRITICAL:'Emergency!' };
  setTxt('riskTitle', titles[level]);   setCol('riskTitle', color);

  const t = SYSTEM.temp;
  const tempPct = Math.min(t / 100 * 100, 100);
  setBar('tempBar', tempPct, t > 70 ? 'danger' : t > SYSTEM.tempThreshold ? 'warn' : 'safe');
  setTxt('tempVal',  t.toFixed(1));     setCol('tempVal', 'var(--c-text)');
  setTxt('tempUnit', '°C');
  setTxt('tempMeta', (t > SYSTEM.tempThreshold ? '⚠ HIGH' : 'Normal') + ' · Threshold ' + SYSTEM.tempThreshold + '°C');

  const s = SYSTEM.smoke;
  const smokePct = Math.min(s / 1000 * 100, 100);
  setBar('smokeBar', smokePct, s > 500 ? 'danger' : s > SYSTEM.smokeThreshold ? 'warn' : 'safe');
  setTxt('smokeVal',  String(Math.floor(s))); setCol('smokeVal', 'var(--c-text)');
  setTxt('smokeUnit', 'ppm');
  setTxt('smokeMeta', (s > SYSTEM.smokeThreshold ? '⚠ HIGH' : 'Normal') + ' · Threshold ' + SYSTEM.smokeThreshold + 'ppm');

  const fd = document.getElementById('flameDot');
  const fv = document.getElementById('flameVal');
  if (SYSTEM.flame) {
    if (fv) { fv.textContent = 'DETECTED!'; fv.style.color = 'var(--c-danger)'; }
    if (fd) fd.className = 'dot dot-err';
    setTxt('flameMeta', '🔥 Flame detected — Emergency');
  } else {
    if (fv) { fv.textContent = 'NOT DETECTED'; fv.style.color = 'var(--c-safe)'; }
    if (fd) fd.className = 'dot dot-on';
    setTxt('flameMeta', 'IR sensor active · No source');
  }

  setComp('dotBuzzer',    'stBuzzer',    SYSTEM.buzzer,    'ACTIVE',  'var(--c-danger)');
  setComp('dotFan',       'stFan',       SYSTEM.fan,       'RUNNING', 'var(--c-warn)');
  setComp('dotSprinkler', 'stSprinkler', SYSTEM.sprinkler, 'ACTIVE',  'var(--c-info)');

  const zone = document.getElementById('zoneMain');
  const zl   = document.getElementById('zoneStatusLabel');
  if (zone && zl) {
    if      (level === 'CRITICAL') { zone.className = 'zone-single zone-critical'; zl.textContent = '● Critical'; zl.style.color = ''; }
    else if (level === 'WARNING')  { zone.className = 'zone-single zone-warn';     zl.textContent = '● Warning';  zl.style.color = ''; }
    else                           { zone.className = 'zone-single';               zl.textContent = '● Safe';     zl.style.color = 'var(--c-safe)'; }
  }

  const badge = document.getElementById('zoneBadge');
  if (badge) {
    if      (level === 'CRITICAL') { badge.textContent = '● Critical'; badge.className = 'badge badge-danger'; }
    else if (level === 'WARNING')  { badge.textContent = '● Warning';  badge.className = 'badge badge-warn'; }
    else                           { badge.textContent = '● Safe';     badge.className = 'badge badge-safe'; }
  }

  setTxt('sidebarBadge', SYSTEM.alarmCount);

  if (SYSTEM.history.length > 0 && !SYSTEM.history[0]._rendered) {
    const ev = SYSTEM.history[0]; ev._rendered = true;
    const icons = { danger:'🚨', warn:'⚠️', info:'ℹ️' };
    const feed  = document.getElementById('alertFeed');
    if (feed) {
      const item = document.createElement('div');
      item.className = 'alert-item ' + ev.severity;
      item.innerHTML = '<span class="alert-ico">' + (icons[ev.severity]||'🔔') + '</span>' +
        '<div class="alert-body"><div class="alert-title">' + ev.event + '</div><div class="alert-time">' + ev.time + '</div></div>';
      feed.prepend(item);
      while (feed.children.length > 6) feed.lastChild.remove();
    }
  }
});

function setTxt(id, v)      { const e=document.getElementById(id); if(e) e.textContent=v; }
function setCol(id, c)      { const e=document.getElementById(id); if(e) e.style.color=c; }
function setBar(id, pct, s) { const e=document.getElementById(id); if(!e) return; e.style.width=pct+'%'; e.className='bar-fill bar-'+s; }
function setComp(dId, sId, active, lbl, col) {
  const d=document.getElementById(dId); const s=document.getElementById(sId);
  if(d) d.className='dot '+(active?'dot-err':'dot-off');
  if(s) { s.textContent=active?lbl:'OFF'; s.style.color=active?col:'var(--c-text2)'; }
}
