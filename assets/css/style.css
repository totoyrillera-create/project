
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --c-bg:       #0b0b12;
  --c-surface:  #111118;
  --c-surface2: #17171f;
  --c-border:   rgba(255,255,255,0.07);
  --c-border2:  rgba(255,255,255,0.13);
  --c-fire:     #ff5722;
  --c-fire2:    #ff8a50;
  --c-safe:     #00e676;
  --c-warn:     #ffb300;
  --c-danger:   #f44336;
  --c-info:     #29b6f6;
  --c-text:     #f0ece8;
  --c-text2:    #888898;
  --c-text3:    rgba(240,236,232,0.3);
  --font:       -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --mono:       ui-monospace, 'Cascadia Code', 'Fira Mono', Consolas, monospace;
  --r:          13px;
  --r-sm:       8px;
  --sw:         252px;
  --th:         60px;
  --ease:       cubic-bezier(0.16,1,0.3,1);
  --spring:     cubic-bezier(0.34,1.4,0.64,1);
}

body.light {
  --c-bg:       #f0f0f5;
  --c-surface:  #ffffff;
  --c-surface2: #e8e8ee;
  --c-border:   rgba(0,0,0,0.1);
  --c-border2:  rgba(0,0,0,0.18);
  --c-text:     #0d0d1a;
  --c-text2:    #2a2a3a;
  --c-text3:    rgba(10,10,26,0.55);
  --c-fire:     #d94010;
  --c-fire2:    #e85a30;
}

html { scroll-behavior: smooth; }
body {
  font-family: var(--font);
  background: var(--c-bg);
  color: var(--c-text);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  transition: background 0.25s, color 0.25s;
}
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,87,34,0.3); border-radius: 3px; }

/* ── Shell ── */
.shell { display: flex; min-height: 100vh; position: relative; }
.main-wrap { flex: 1; display: flex; flex-direction: column; min-width: 0; animation: fadeIn 0.28s ease both; }

/* ── Burger ── fixed inside shell, moves right when sidebar open ── */
.sidebar-toggle {
  position: fixed;
  top: calc(var(--th) / 2);
  left: 16px;
  transform: translateY(-50%);
  z-index: 300;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  border-radius: var(--r-sm);
  transition: left 0.3s var(--ease), background 0.15s;
}
.sidebar-toggle:hover { background: rgba(255,87,34,0.09); }
.sidebar-toggle:active { opacity: 0.7; }
.shell.open .sidebar-toggle { left: calc(var(--sw) + 12px); }

.toggle-icon { display: flex; flex-direction: column; gap: 5px; pointer-events: none; }
.toggle-icon span {
  display: block;
  width: 18px; height: 1.5px;
  background: var(--c-text2);
  border-radius: 2px;
  transition: transform 0.24s var(--ease), opacity 0.2s, background 0.2s;
  transform-origin: center;
}
.shell.open .toggle-icon span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); background: var(--c-fire); }
.shell.open .toggle-icon span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.shell.open .toggle-icon span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); background: var(--c-fire); }

/* ── Sidebar ── */
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--sw);
  background: var(--c-surface);
  border-right: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  z-index: 200;
  transform: translateX(-100%);
  transition: transform 0.28s var(--ease), box-shadow 0.28s var(--ease);
  overflow: hidden;
}
.shell.open .sidebar { transform: translateX(0); box-shadow: 6px 0 48px rgba(0,0,0,0.55); }

.sidebar-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.48);
  backdrop-filter: blur(4px);
  z-index: 199;
  opacity: 0; pointer-events: none;
  transition: opacity 0.28s;
}
.shell.open .sidebar-backdrop { opacity: 1; pointer-events: all; }

.sidebar-brand {
  display: flex; align-items: center; gap: 11px;
  padding: 18px 16px 15px;
  border-bottom: 1px solid var(--c-border);
  text-decoration: none;
  transition: background 0.15s;
}
.sidebar-brand:hover { background: rgba(255,87,34,0.05); }
.brand-icon {
  width: 34px; height: 34px; border-radius: 9px;
  background: linear-gradient(135deg,#bf360c,var(--c-fire));
  display: grid; place-items: center; font-size: 1rem;
  box-shadow: 0 0 16px rgba(255,87,34,0.3);
  animation: brandPulse 3s ease-in-out infinite; flex-shrink: 0;
}
@keyframes brandPulse { 0%,100%{box-shadow:0 0 16px rgba(255,87,34,0.3)} 50%{box-shadow:0 0 28px rgba(255,87,34,0.55)} }
.brand-text strong { display:block; font-size:1rem; font-weight:700; letter-spacing:1px; color:var(--c-text); }
.brand-text span   { font-family:var(--mono); font-size:0.61rem; color:var(--c-text3); letter-spacing:1.5px; }

.sidebar-nav { flex:1; padding:10px 9px; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }
.nav-section { font-family:var(--mono); font-size:0.59rem; letter-spacing:2px; color:var(--c-text3); text-transform:uppercase; padding:10px 10px 4px; margin-top:4px; }
.nav-link {
  display:flex; align-items:center; gap:9px;
  padding:9px 11px; border-radius:var(--r-sm);
  text-decoration:none; color:var(--c-text2);
  font-size:1rem; font-weight:500; color:var(--c-text2);
  transition:background 0.14s, color 0.14s; position:relative;
}
.nav-link:hover { background:rgba(255,87,34,0.07); color:var(--c-text); }
.nav-link.active { background:rgba(255,87,34,0.1); color:var(--c-fire2); }
.nav-link.active::before { content:''; position:absolute; left:0; top:50%; transform:translateY(-50%); width:3px; height:55%; background:var(--c-fire); border-radius:0 2px 2px 0; }
.nav-icon { font-size:0.95rem; width:20px; text-align:center; flex-shrink:0; }
.nav-badge { margin-left:auto; background:var(--c-danger); color:#fff; font-family:var(--mono); font-size:0.6rem; padding:1px 6px; border-radius:99px; font-weight:600; }
.nav-link.nav-emg { color:rgba(244,67,54,0.75); }
.nav-link.nav-emg:hover { background:rgba(244,67,54,0.08); color:var(--c-danger); }

/* ── User row (click → settings) ── */
.sidebar-user {
  padding:12px 14px; border-top:1px solid var(--c-border);
  display:flex; align-items:center; gap:9px;
  cursor:pointer; transition:background 0.14s; user-select:none;
}
.sidebar-user:hover { background:rgba(255,87,34,0.05); }
.user-av { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#bf360c,var(--c-fire)); display:grid; place-items:center; font-size:0.88rem; flex-shrink:0; }
.user-info { flex:1; min-width:0; }
.user-name { font-size:1rem; font-weight:600; color:var(--c-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.user-role { font-family:var(--mono); font-size:0.64rem; font-weight:400; color:var(--c-text2); letter-spacing:0.8px; text-transform:uppercase; }
.user-chevron { font-size:0.65rem; color:var(--c-text3); transition:transform 0.2s; }
.sidebar-user.settings-open .user-chevron { transform:rotate(180deg); }

/* ── Settings drawer ── */
.settings-drawer {
  position:absolute; bottom:56px; left:0; right:0;
  background:var(--c-surface);
  border-top:1px solid var(--c-border);
  border-bottom:1px solid var(--c-border);
  max-height:0; overflow:hidden;
  transition:max-height 0.3s var(--ease);
  z-index:10;
}
.settings-drawer.open { max-height:440px; }

.settings-header { display:flex; align-items:center; justify-content:space-between; padding:12px 14px 8px; border-bottom:1px solid var(--c-border); }
.settings-title { font-size:0.85rem; font-weight:600; color:var(--c-text); }
.settings-close { background:none; border:none; color:var(--c-text3); cursor:pointer; font-size:0.95rem; padding:2px 6px; border-radius:5px; transition:color 0.14s, background 0.14s; }
.settings-close:hover { color:var(--c-text); background:rgba(255,255,255,0.07); }

.settings-body { padding:6px 8px 8px; display:flex; flex-direction:column; gap:1px; overflow-y:auto; }
.settings-section { display: none; }
.settings-item {
  display:flex; align-items:center; gap:9px;
  padding:10px 12px; border-radius:var(--r-sm);
  font-size:1rem; color:var(--c-text2);
  cursor:pointer; transition:background 0.14s, color 0.14s; user-select:none;
}
.settings-body > .settings-item:first-of-type {
  border-top: 1px solid var(--c-border);
  margin-top: 4px;
  padding-top: 14px;
}
.settings-item:hover { background:rgba(255,87,34,0.07); color:var(--c-text); }
.settings-item.danger:hover { background:rgba(244,67,54,0.08); color:var(--c-danger); }
.settings-ico   { font-size:0.95rem; width:20px; text-align:center; flex-shrink:0; }
.settings-label { flex:1; font-size:1rem; color:var(--c-text); }

.toggle-sw {
  width:38px; height:22px; border-radius:99px;
  background:rgba(255,255,255,0.15); position:relative;
  transition:background 0.2s; flex-shrink:0;
  border: 1px solid rgba(255,255,255,0.08);
}
.toggle-sw::after {
  content:''; position:absolute; left:3px; top:2px;
  width:16px; height:16px; border-radius:50%; background:#fff;
  transition:transform 0.2s var(--spring);
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.toggle-sw.on { background:var(--c-fire); border-color: transparent; }
.toggle-sw.on::after { transform:translateX(16px); }

/* ── Users panel inside settings ── */
.users-list { padding:0 8px 8px; display:flex; flex-direction:column; gap:4px; }
.user-item {
  display:flex; align-items:center; gap:9px;
  padding:9px 11px; border-radius:var(--r-sm);
  background:rgba(255,255,255,0.03); border:1px solid var(--c-border);
}
.user-item-av { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#bf360c,var(--c-fire)); display:grid; place-items:center; font-size:0.78rem; flex-shrink:0; }
.user-item-info { flex:1; min-width:0; }
.user-item-name { font-size:0.82rem; font-weight:600; color:var(--c-text); }
.user-item-role { font-family:var(--mono); font-size:0.58rem; color:var(--c-text3); letter-spacing:1px; text-transform:uppercase; }
.user-item-del { background:none; border:none; color:var(--c-text3); cursor:pointer; font-size:0.85rem; padding:3px 6px; border-radius:5px; transition:color 0.14s, background 0.14s; }
.user-item-del:hover { color:var(--c-danger); background:rgba(244,67,54,0.08); }
.add-user-row { display:flex; gap:6px; padding:4px 8px 2px; }
.add-user-row .input { font-size:0.82rem; padding:7px 10px; }
.add-user-row .btn   { padding:7px 12px; font-size:0.82rem; }

/* ── Topbar ── */
.topbar {
  height:var(--th);
  background:var(--c-surface);
  border-bottom:1px solid var(--c-border);
  display:flex; align-items:center;
  padding:0 20px 0 60px;
  position:sticky; top:0; z-index:100;
  backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
  box-shadow:0 1px 0 rgba(255,255,255,0.03), 0 2px 14px rgba(0,0,0,0.18);
}
.topbar-title { font-size:1.3rem; font-weight:600; letter-spacing:-0.2px; color:var(--c-text); flex:1; }
.topbar-right { display:flex; align-items:center; gap:12px; }
.status-pill { display:flex; align-items:center; gap:6px; font-family:var(--mono); font-size:0.74rem; font-weight:500; letter-spacing:0.8px; padding:5px 12px; border-radius:99px; }
.status-pill.online  { color:var(--c-safe);   background:rgba(0,230,118,0.07);  border:1px solid rgba(0,230,118,0.15); }
.status-pill.offline { color:var(--c-danger); background:rgba(244,67,54,0.07);  border:1px solid rgba(244,67,54,0.18); }
.status-pill.warn    { color:var(--c-warn);   background:rgba(255,179,0,0.07);  border:1px solid rgba(255,179,0,0.18); }
.pulse-dot { width:6px; height:6px; border-radius:50%; background:currentColor; box-shadow:0 0 5px currentColor; animation:pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
.topbar-clock { font-family:var(--mono); font-size:0.92rem; font-weight:500; color:var(--c-text); letter-spacing:2px; background:rgba(255,255,255,0.04); border:1px solid var(--c-border); padding:5px 11px; border-radius:var(--r-sm); }

/* ── Content ── */
.page-content { flex:1; padding:22px 24px; overflow-y:auto; }
.page-header { margin-bottom:20px; }
.page-header h2 { font-size:1.45rem; font-weight:600; color:var(--c-text); letter-spacing:-0.2px; }
.page-header p  { font-family:var(--mono); font-size:0.78rem; font-weight:400; color:var(--c-text2); letter-spacing:1.5px; text-transform:uppercase; margin-top:5px; }

/* ── Cards ── */
.card { background:var(--c-surface2); border:1px solid var(--c-border); border-radius:var(--r); padding:20px; transition:border-color 0.2s, box-shadow 0.2s; }
.card:hover { border-color:var(--c-border2); box-shadow:0 3px 22px rgba(0,0,0,0.22); }
.card-label { font-family:var(--mono); font-size:0.72rem; font-weight:600; letter-spacing:2px; color:var(--c-fire); text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; gap:7px; }
.card-label::before { content:''; display:block; width:2.5px; height:12px; background:var(--c-fire); border-radius:2px; }

/* ── Grids ── */
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.gap-b { margin-bottom:14px; }

/* ── Sensors ── */
.sensor-val  { font-family:var(--mono); font-size:2.7rem; font-weight:600; line-height:1; color:var(--c-text); letter-spacing:-1px; }
.sensor-unit { font-family:var(--mono); font-size:0.9rem; color:var(--c-text2); margin-left:4px; }
.sensor-meta { font-family:var(--mono); font-size:0.84rem; font-weight:400; color:var(--c-text2); letter-spacing:0.3px; margin-top:6px; }
.sensor-offline { font-family:var(--mono); font-size:0.7rem; color:var(--c-text3); letter-spacing:1px; font-style:italic; }

.bar-track { height:3px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; margin:10px 0 7px; }
.bar-fill  { height:100%; border-radius:3px; transition:width 0.6s var(--ease), background 0.4s; }
.bar-safe   { background:var(--c-safe); }
.bar-warn   { background:var(--c-warn); }
.bar-danger { background:var(--c-danger); }
.bar-muted  { background:rgba(255,255,255,0.12); }

/* ── Ring ── */
.ring-wrap  { position:relative; width:140px; height:140px; flex-shrink:0; }
.ring-wrap svg { transform:rotate(-90deg); }
.ring-bg   { fill:none; stroke:rgba(255,255,255,0.05); stroke-width:10; }
.ring-fill { fill:none; stroke-width:10; stroke-linecap:round; transition:stroke-dashoffset 0.7s var(--ease), stroke 0.4s; }
.ring-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:2px; }
.ring-pct { font-family:var(--mono); font-size:1.75rem; font-weight:700; color:var(--c-text); line-height:1; }
.ring-lbl { font-family:var(--mono); font-size:0.65rem; font-weight:500; letter-spacing:2px; color:var(--c-text2); }

/* ── Badges ── */
.badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:99px; font-family:var(--mono); font-size:0.62rem; font-weight:600; letter-spacing:1px; text-transform:uppercase; }
.badge-safe   { background:rgba(0,230,118,0.1);  color:var(--c-safe);   border:1px solid rgba(0,230,118,0.2); }
.badge-warn   { background:rgba(255,179,0,0.1);  color:var(--c-warn);   border:1px solid rgba(255,179,0,0.2); }
.badge-danger { background:rgba(244,67,54,0.12); color:var(--c-danger); border:1px solid rgba(244,67,54,0.25); }
.badge-info   { background:rgba(41,182,246,0.1); color:var(--c-info);   border:1px solid rgba(41,182,246,0.2); }

/* ── Buttons ── */
.btn { display:inline-flex; align-items:center; gap:6px; padding:9px 17px; border:none; border-radius:var(--r-sm); font-family:var(--font); font-size:0.95rem; font-weight:500; cursor:pointer; transition:all 0.14s; white-space:nowrap; }
.btn:active { transform:scale(0.96); }
.btn-primary { background:var(--c-fire); color:#fff; box-shadow:0 2px 12px rgba(255,87,34,0.28); }
.btn-primary:hover { background:var(--c-fire2); box-shadow:0 4px 20px rgba(255,87,34,0.42); }
.btn-ghost  { background:transparent; border:1px solid var(--c-border2); color:var(--c-text2); }
.btn-ghost:hover { border-color:rgba(255,255,255,0.24); color:var(--c-text); background:rgba(255,255,255,0.04); }
.btn-danger { background:var(--c-danger); color:#fff; }
.btn-danger:hover { background:#ef5350; }
.btn-warn   { background:var(--c-warn); color:#111; }
.btn-warn:hover { filter:brightness(1.1); }
.btn-sm   { padding:5px 11px; font-size:0.8rem; }
.btn-full { width:100%; justify-content:center; }

/* ── Dots ── */
.dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.dot-on   { background:var(--c-safe);   box-shadow:0 0 6px var(--c-safe);   animation:pulse 2s ease-in-out infinite; }
.dot-off  { background:rgba(255,255,255,0.15); }
.dot-warn { background:var(--c-warn);   box-shadow:0 0 6px var(--c-warn);   animation:pulse 1.2s ease-in-out infinite; }
.dot-err  { background:var(--c-danger); box-shadow:0 0 8px var(--c-danger); animation:pulse 0.7s ease-in-out infinite; }

/* ── Inputs ── */
.input { width:100%; padding:10px 12px; background:rgba(255,255,255,0.04); border:1px solid var(--c-border); border-radius:var(--r-sm); color:var(--c-text); font-family:var(--font); font-size:1rem; font-weight:450; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
.input:focus { border-color:rgba(255,87,34,0.5); box-shadow:0 0 0 3px rgba(255,87,34,0.08); }
.input-label { display:block; font-family:var(--mono); font-size:0.72rem; font-weight:600; letter-spacing:1px; color:var(--c-text2); text-transform:uppercase; margin-bottom:7px; }
input[type=range] { -webkit-appearance:none; width:100%; height:4px; background:rgba(255,255,255,0.08); border-radius:4px; outline:none; cursor:pointer; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:var(--c-fire); box-shadow:0 0 8px rgba(255,87,34,0.4); cursor:pointer; transition:transform 0.14s; }
input[type=range]::-webkit-slider-thumb:hover { transform:scale(1.2); }

/* ── Table ── */
.table-wrap { background:var(--c-surface2); border:1px solid var(--c-border); border-radius:var(--r); overflow:hidden; }
.table-head { display:grid; padding:9px 16px; background:rgba(255,87,34,0.05); border-bottom:1px solid var(--c-border); font-family:var(--mono); font-size:0.6rem; letter-spacing:2px; color:var(--c-fire); text-transform:uppercase; }
.table-body { max-height:480px; overflow-y:auto; }
.table-row { display:grid; padding:10px 16px; border-bottom:1px solid rgba(255,255,255,0.03); align-items:center; font-size:0.84rem; transition:background 0.14s; }
.table-row:hover { background:rgba(255,255,255,0.03); }
.table-row.sev-danger { border-left:2px solid var(--c-danger); }
.table-row.sev-warn   { border-left:2px solid var(--c-warn); }
.table-row.sev-info   { border-left:2px solid rgba(41,182,246,0.45); }
.col-mono { font-family:var(--mono); font-size:0.78rem; font-weight:400; color:var(--c-text2); }

/* ── Emergency overlay ── */
.emg-overlay { position:fixed; inset:0; background:rgba(244,67,54,0.06); pointer-events:none; z-index:400; opacity:0; }
@keyframes strobe { 0%,100%{opacity:0} 50%{opacity:1} }

/* ── Footer ── */
.footer { padding:13px 24px; border-top:1px solid var(--c-border); display:flex; align-items:center; justify-content:space-between; font-family:var(--mono); font-size:0.72rem; font-weight:500; color:var(--c-text2); letter-spacing:0.5px; flex-wrap:wrap; gap:5px; }

/* ── Animations ── */
@keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
@keyframes fadeIn  { from{opacity:0} to{opacity:1} }
@keyframes slideR  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
.anim-up   { animation:fadeUp  0.4s var(--ease) both; }
.anim-in   { animation:fadeIn  0.3s ease both; }
.anim-slide{ animation:slideR  0.28s var(--ease) both; }
.stagger>*:nth-child(1){animation-delay:0.04s}
.stagger>*:nth-child(2){animation-delay:0.08s}
.stagger>*:nth-child(3){animation-delay:0.13s}
.stagger>*:nth-child(4){animation-delay:0.18s}
.stagger>*:nth-child(5){animation-delay:0.23s}
.stagger>*:nth-child(6){animation-delay:0.28s}

/* ── Utilities ── */
.mt-sm{margin-top:11px} .mt-md{margin-top:15px} .mt-lg{margin-top:19px} .mb-md{margin-bottom:16px}
.flex-row{display:flex;align-items:center} .flex-wrap{flex-wrap:wrap} .gap-sm{gap:8px}
.divider-line{height:3px;margin:11px 0 8px}
.dot-fire{background:var(--c-fire)} .dot-info{background:var(--c-info)}
.dot-warn-dashed{background:rgba(255,179,0,0.6);border:1px dashed var(--c-warn)}
.pulse-dot-danger{background:var(--c-danger);box-shadow:0 0 6px var(--c-danger)}
.rs-bar-safe{background:var(--c-safe)} .rs-bar-warn{background:var(--c-warn)} .rs-bar-danger{background:var(--c-danger)}
.flame-val{font-size:1.5rem}

@media(max-width:900px){.g4{grid-template-columns:1fr 1fr}.g3{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.g2,.g3,.g4{grid-template-columns:1fr}.page-content{padding:14px}.topbar{padding-left:54px;padding-right:14px}}
