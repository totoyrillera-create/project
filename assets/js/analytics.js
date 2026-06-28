'use strict';

function drawChart(id, data, color, threshold, maxVal) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400;
  const H = 160;
  canvas.width  = W;
  canvas.height = H;
  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth   = 1;
  for (let i = 0; i <= 3; i++) {
    const y = (i / 3) * H;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  const thY = H - Math.min(threshold / maxVal, 1) * H;
  ctx.strokeStyle = 'rgba(255,179,0,0.35)';
  ctx.setLineDash([6, 5]); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, thY); ctx.lineTo(W, thY); ctx.stroke();
  ctx.setLineDash([]);

  if (data.length < 2) return;
  const step = W / (data.length - 1);
  const pts  = data.map((v, i) => ({ x: i * step, y: H - Math.min(v / maxVal, 1) * H }));

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, color + '44');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, H);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, H);
  ctx.closePath(); ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth   = 1.8;
  ctx.lineJoin    = 'round';
  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();

  const lp = pts[pts.length - 1];
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(lp.x, lp.y, 3.5, 0, Math.PI * 2); ctx.fill();
}

const bootTime = Date.now();
setInterval(() => {
  const sec = Math.floor((Date.now() - bootTime) / 1000);
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  const el = document.getElementById('statUptime');
  if (el) el.textContent = m + ':' + s;
}, 1000);

document.addEventListener('ignis:update', () => {
  const el = id => document.getElementById(id);
  if (el('statAlarms'))     el('statAlarms').textContent = SYSTEM.alarmCount;

  const avgT = SYSTEM.tempHistory.reduce((a, b) => a + b, 0) / SYSTEM.tempHistory.length;
  if (el('statAvgTemp'))    el('statAvgTemp').textContent  = avgT.toFixed(1) + '°C';
  if (el('statTempDelta')) {
    const ok = avgT <= SYSTEM.tempThreshold;
    el('statTempDelta').textContent  = ok ? '✓ Within range' : '⚠ Above threshold';
    el('statTempDelta').className    = 'stat-delta ' + (ok ? 'stat-ok' : 'stat-bad');
  }

  const peak = Math.max(...SYSTEM.smokeHistory);
  if (el('statPeak'))       el('statPeak').textContent = Math.floor(peak) + ' ppm';
  if (el('statPeakDelta')) {
    const ok = peak <= SYSTEM.smokeThreshold;
    el('statPeakDelta').textContent = ok ? '✓ Within range' : '⚠ Above threshold';
    el('statPeakDelta').className   = 'stat-delta ' + (ok ? 'stat-ok' : 'stat-bad');
  }

  drawChart('tempChart',  SYSTEM.tempHistory,  '#ff5722', SYSTEM.tempThreshold, 100);
  drawChart('smokeChart', SYSTEM.smokeHistory, '#29b6f6', SYSTEM.smokeThreshold, 1000);

  if (el('sidebarBadge')) el('sidebarBadge').textContent = SYSTEM.alarmCount;

  const th = SYSTEM.tempHistory, tn = th.length || 1;
  const pct = (n) => Math.round(n / tn * 100);
  const setDist = (id, valId, val) => {
    const b = el(id); const v = el(valId);
    if (b) b.style.width = val + '%';
    if (v) v.textContent = val + '%';
  };
  setDist('dtSafe', 'dvSafe', pct(th.filter(v => v <= SYSTEM.tempThreshold).length));
  setDist('dtWarn', 'dvWarn', pct(th.filter(v => v > SYSTEM.tempThreshold && v <= 70).length));
  setDist('dtCrit', 'dvCrit', pct(th.filter(v => v > 70).length));

  const sh = SYSTEM.smokeHistory, sn = sh.length || 1;
  const sp = (n) => Math.round(n / sn * 100);
  const sSafe = sp(sh.filter(v => v <= SYSTEM.smokeThreshold).length);
  setDist('dsSafe', 'dvsSafe', sSafe);
  setDist('dsCrit', 'dvsCrit', 100 - sSafe);
});
