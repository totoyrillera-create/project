'use strict';

const IS_SUBPAGE = window.location.pathname.includes('/pages/');
const ROOT = IS_SUBPAGE ? '../' : './';

(function authGuard() {
  if (!sessionStorage.getItem('ignis_user') && IS_SUBPAGE) {
    window.location.href = ROOT + 'index.html';
  }
})();

(function applyTheme() {
  if (localStorage.getItem('fw_theme') === 'light') document.body.classList.add('light');
})();

const USERS_DB_KEY = 'fw_users';

function getUsers() {
  const raw = localStorage.getItem(USERS_DB_KEY);
  if (raw) return JSON.parse(raw);
  const defaults = [
    { username: 'admin',    role: 'Administrator', pass: 'admin123' },
    { username: 'operator', role: 'Operator',      pass: 'op2026'   },
    { username: 'viewer',   role: 'Viewer',         pass: 'view123'  },
  ];
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveUsers(users) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

const SYSTEM = {
  temp:           null,
  smoke:          null,
  flame:          null,
  isEmergency:    false,
  buzzer:         false,
  fan:            false,
  sprinkler:      false,
  tempThreshold:  60,
  smokeThreshold: 300,
  fanSpeed:       50,
  sprinklerFlow:  50,
  smsEnabled:     true,
  history:        [],
  tempHistory:    Array(20).fill(null),
  smokeHistory:   Array(20).fill(null),
  alarmCount:     0,
  arduinoOnline:  false,
  lastPing:       null,
};

let _mockInterval = null;

function setArduinoStatus(online) {
  SYSTEM.arduinoOnline = online;
  if (!online) {
    SYSTEM.temp  = null;
    SYSTEM.smoke = null;
    SYSTEM.flame = null;
    SYSTEM.tempHistory  = Array(20).fill(null);
    SYSTEM.smokeHistory = Array(20).fill(null);
    if (_mockInterval) { clearInterval(_mockInterval); _mockInterval = null; }
  } else {
    if (!_mockInterval) {
      let t = 25, s = 10;
      _mockInterval = setInterval(() => {
        t += (Math.random() - 0.5) * 0.8;
        s += (Math.random() - 0.5) * 3;
        t = Math.max(15, Math.min(t, 95));
        s = Math.max(0,  Math.min(s, 900));
        SYSTEM.temp  = parseFloat(t.toFixed(1));
        SYSTEM.smoke = Math.floor(s);
        SYSTEM.flame = false;
        SYSTEM.tempHistory.push(SYSTEM.temp);
        SYSTEM.smokeHistory.push(SYSTEM.smoke);
        if (SYSTEM.tempHistory.length  > 30) SYSTEM.tempHistory.shift();
        if (SYSTEM.smokeHistory.length > 30) SYSTEM.smokeHistory.shift();
      }, 2000);
    }
  }
  document.dispatchEvent(new CustomEvent('arduino:status', { detail: { online } }));
}

function pingArduino() {
  fetch('http://192.168.1.100/data', { signal: AbortSignal.timeout(2500) })
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => {
      if (d.temp  !== undefined) SYSTEM.temp  = parseFloat(d.temp);
      if (d.smoke !== undefined) SYSTEM.smoke = parseFloat(d.smoke);
      if (d.flame !== undefined) SYSTEM.flame = !!d.flame;
      SYSTEM.lastPing = new Date().toLocaleTimeString();
      if (!SYSTEM.arduinoOnline) setArduinoStatus(true);
    })
    .catch(() => {
      if (SYSTEM.arduinoOnline) setArduinoStatus(false);
    });
}

setInterval(pingArduino, 4000);

function calcRisk() {
  if (!SYSTEM.arduinoOnline || SYSTEM.temp === null) return 0;
  let r = 0;
  if (SYSTEM.temp  > SYSTEM.tempThreshold)  r += 30;
  if (SYSTEM.smoke > SYSTEM.smokeThreshold) r += 30;
  if (SYSTEM.temp  > 70)  r += 20;
  if (SYSTEM.smoke > 500) r += 20;
  if (SYSTEM.flame) r = 100;
  return Math.min(Math.floor(r), 100);
}

function riskLevel(r)  { return r >= 70 ? 'CRITICAL' : r >= 35 ? 'WARNING' : 'SAFE'; }
function riskColor(lv) { return { CRITICAL: '#f44336', WARNING: '#ffb300', SAFE: '#00e676' }[lv]; }

function addLog(event, data, action, severity) {
  severity = severity || 'info';
  const e = {
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
    event: event, data: data, action: action, severity: severity,
  };
  SYSTEM.history.unshift(e);
  if (SYSTEM.history.length > 200) SYSTEM.history.pop();
  return e;
}

function sendGSMAlert(msg) {
  if (!SYSTEM.smsEnabled) return;
  console.log('[GSM]', msg);
  addLog('SMS Alert', 'Emergency Contact', msg, 'danger');
}

function handleActuators(level) {
  if (level === 'CRITICAL' && !SYSTEM.isEmergency) {
    SYSTEM.isEmergency = true;
    SYSTEM.buzzer      = true;
    SYSTEM.fan         = true;
    SYSTEM.sprinkler   = true;
    SYSTEM.alarmCount++;
    addLog('CRITICAL ALARM', 'T:' + (SYSTEM.temp ? SYSTEM.temp.toFixed(1) : '--') + '°C S:' + SYSTEM.smoke + 'ppm', 'All actuators ON', 'danger');
    sendGSMAlert('CRITICAL FIRE DETECTED — FIREWATCH UNIT 001');
    document.querySelectorAll('.emg-overlay').forEach(function(el) {
      el.style.animation = 'strobe 0.8s ease-in-out infinite';
    });
  } else if (level === 'SAFE' && SYSTEM.isEmergency) {
    SYSTEM.isEmergency = false;
    SYSTEM.buzzer      = false;
    SYSTEM.sprinkler   = false;
    addLog('System Cleared', 'Risk SAFE', 'Actuators off', 'info');
    document.querySelectorAll('.emg-overlay').forEach(function(el) {
      el.style.animation = 'none';
      el.style.opacity   = '0';
    });
  }
  if (level === 'WARNING' && !SYSTEM.fan) {
    SYSTEM.fan = true;
    addLog('Warning', 'T:' + (SYSTEM.temp ? SYSTEM.temp.toFixed(1) : '--') + '°C S:' + SYSTEM.smoke + 'ppm', 'Fan ON', 'warn');
  }
}

function systemTick() {
  var risk  = calcRisk();
  var level = riskLevel(risk);
  handleActuators(level);
  document.dispatchEvent(new CustomEvent('ignis:update', { detail: { risk: risk, level: level } }));
}

setInterval(systemTick, 2000);

function resetSystem() {
  SYSTEM.isEmergency = false;
  SYSTEM.buzzer      = false;
  SYSTEM.fan         = false;
  SYSTEM.sprinkler   = false;
  document.querySelectorAll('.emg-overlay').forEach(function(el) {
    el.style.animation = 'none';
    el.style.opacity   = '0';
  });
  addLog('System Reset', 'Manual', 'Actuators cleared', 'info');
  systemTick();
}

function startClock() {
  var el = document.getElementById('clock');
  if (!el) return;
  function tick() { el.textContent = new Date().toLocaleTimeString('en-PH', { hour12: false }); }
  tick();
  setInterval(tick, 1000);
}

function initSidebar() {
  var shell    = document.querySelector('.shell');
  var toggle   = document.querySelector('.sidebar-toggle');
  var backdrop = document.querySelector('.sidebar-backdrop');
  if (!shell || !toggle) return;

  function openSidebar() {
    shell.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    shell.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    closeSettings();
  }
  function toggleSidebar() {
    if (shell.classList.contains('open')) closeSidebar(); else openSidebar();
  }

  toggle.addEventListener('click', toggleSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeSidebar(); });
  document.querySelectorAll('.nav-link').forEach(function(a) {
    a.addEventListener('click', function() { setTimeout(closeSidebar, 80); });
  });
}

function closeSettings() {
  var drawer  = document.getElementById('settingsDrawer');
  var userRow = document.getElementById('sidebarUserRow');
  if (drawer)  drawer.classList.remove('open');
  if (userRow) userRow.classList.remove('settings-open');
}

function initSettings() {
  var userRow = document.getElementById('sidebarUserRow');
  var drawer  = document.getElementById('settingsDrawer');
  if (!userRow || !drawer) return;

  userRow.addEventListener('click', function() {
    var isOpen = drawer.classList.toggle('open');
    userRow.classList.toggle('settings-open', isOpen);
  });

  var lightSw = document.getElementById('swLight');
  if (lightSw) {
    lightSw.classList.toggle('on', document.body.classList.contains('light'));
    lightSw.addEventListener('click', function(e) {
      e.stopPropagation();
      var on = document.body.classList.toggle('light');
      lightSw.classList.toggle('on', on);
      localStorage.setItem('fw_theme', on ? 'light' : 'dark');
    });
  }
}

function updateRequestsBadge() {
  var role      = sessionStorage.getItem('ignis_role') || '';
  var reqsLink  = document.getElementById('reqsLink');
  var reqsBadge = document.getElementById('reqsBadge');
  if (!reqsBadge) return;
  var requests = JSON.parse(localStorage.getItem('fw_requests') || '[]');
  var pending  = requests.filter(function(r) { return r.status === 'pending'; }).length;
  reqsBadge.textContent = pending;
  if (reqsLink) {
    reqsLink.style.display = (role === 'Administrator' && pending > 0) ? 'flex' : 'none';
  }
}

function initNav() {
  var page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(function(a) {
    if (a.getAttribute('href') && a.getAttribute('href').split('/').pop() === page) {
      a.classList.add('active');
    }
  });
}

function initUser() {
  var u  = sessionStorage.getItem('ignis_user') || 'admin';
  var r  = sessionStorage.getItem('ignis_role')  || 'Administrator';
  document.querySelectorAll('#userName').forEach(function(e) {
    e.textContent = u.charAt(0).toUpperCase() + u.slice(1);
  });
  document.querySelectorAll('#userRole').forEach(function(e) {
    e.textContent = r;
  });
}

function logout() {
  sessionStorage.clear();
  window.location.href = ROOT + 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
  startClock();
  initNav();
  initUser();
  initSidebar();
  initSettings();
  updateRequestsBadge();
  systemTick();
  pingArduino();
});

var _strobeStyle = document.createElement('style');
_strobeStyle.textContent = '@keyframes strobe{0%,100%{opacity:0}50%{opacity:1}}';
document.head.appendChild(_strobeStyle);
