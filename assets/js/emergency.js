'use strict';

var _pendingAction = null;

function requirePassword(label, callback) {
  _pendingAction = callback;
  var sub = document.getElementById('authModalSub');
  if (sub) sub.textContent = 'Enter your password to ' + label + '.';
  var inp = document.getElementById('authPass');
  if (inp) inp.value = '';
  var err = document.getElementById('authError');
  if (err) err.textContent = '';
  var m = document.getElementById('authModal');
  if (m) {
    m.classList.add('show');
    setTimeout(function() { inp && inp.focus(); }, 60);
  }
}

function closeAuthModal() {
  _pendingAction = null;
  var m = document.getElementById('authModal');
  if (m) m.classList.remove('show');
}

function confirmAuth() {
  var pass = document.getElementById('authPass').value;
  var err  = document.getElementById('authError');
  var curUser     = sessionStorage.getItem('ignis_user') || 'admin';
  var raw         = localStorage.getItem('fw_users');
  var users       = raw ? JSON.parse(raw) : [];
  var found       = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === curUser) { found = users[i]; break; }
  }
  var correctPass = found ? found.pass : (sessionStorage.getItem('ignis_pass') || 'admin123');
  if (!pass) { err.textContent = 'Enter your password.'; return; }
  if (pass !== correctPass) {
    err.textContent = '⚠ Incorrect password';
    document.getElementById('authPass').value = '';
    document.getElementById('authPass').focus();
    return;
  }
  closeAuthModal();
  if (_pendingAction) { _pendingAction(); _pendingAction = null; }
}

function refreshRow(which) {
  var on  = document.getElementById('btn_' + which + '_on');
  var off = document.getElementById('btn_' + which + '_off');
  if (!on || !off) return;
  var active = SYSTEM[which];
  on.className  = active ? 'btn btn-active-on btn-sm'  : 'btn btn-ghost btn-sm';
  off.className = active ? 'btn btn-ghost btn-sm'       : 'btn btn-active-off btn-sm';
}

function overrideActuator(which, state) {
  SYSTEM[which] = state;
  refreshRow(which);
  var names = { sprinkler: 'Sprinkler', fan: 'Exhaust Fan', buzzer: 'Buzzer' };
  var stIds = { sprinkler: 'stSprinkler', fan: 'stFan', buzzer: 'stBuzzer' };
  var el = document.getElementById(stIds[which]);
  if (el) {
    el.textContent = state ? 'ACTIVE' : 'OFF';
    el.className   = 'ov-st' + (state ? ' ov-active' : '');
  }
  addLog('Override: ' + names[which], 'Operator', state ? 'Activated' : 'Deactivated', state ? 'warn' : 'info');
  showToast(names[which] + ' ' + (state ? 'ON' : 'OFF'));
}

function saveThresholds() {
  requirePassword('save threshold settings', function() {
    SYSTEM.tempThreshold  = parseInt(document.getElementById('sliderTemp').value);
    SYSTEM.smokeThreshold = parseInt(document.getElementById('sliderSmoke').value);
    addLog('Thresholds Updated', 'T:' + SYSTEM.tempThreshold + '°C S:' + SYSTEM.smokeThreshold + 'ppm', 'Saved', 'info');
    showToast('Thresholds saved');
  });
}

function saveIntensity() {
  requirePassword('apply actuator intensity', function() {
    SYSTEM.fanSpeed      = parseInt(document.getElementById('sliderFanSpeed').value);
    SYSTEM.sprinklerFlow = parseInt(document.getElementById('sliderSprinklerFlow').value);
    addLog('Intensity Updated', 'Fan:' + SYSTEM.fanSpeed + '% Sprinkler:' + SYSTEM.sprinklerFlow + '%', 'Saved', 'info');
    showToast('Intensity saved');
  });
}

function resetSystemWithAuth() {
  requirePassword('perform a full system reset', function() {
    resetSystem();
    showToast('System reset complete');
  });
}

function showPanicModal() {
  requirePassword('trigger full emergency protocol', function() {
    SYSTEM.arduinoOnline = true;
    SYSTEM.temp  = 90;
    SYSTEM.smoke = 600;
    SYSTEM.flame = true;
    systemTick();
    addLog('MANUAL EMERGENCY', 'Admin triggered panic', 'Full emergency activated', 'danger');
    showToast('🚨 Emergency activated');
  });
}

function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = '✓ ' + msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

document.addEventListener('ignis:update', function() {
  var el = function(id) { return document.getElementById(id); };
  ['sprinkler', 'fan', 'buzzer'].forEach(refreshRow);
  var map = {
    stSprinkler: { val: SYSTEM.sprinkler, on: 'ACTIVE',  off: 'OFF'     },
    stFan:       { val: SYSTEM.fan,       on: 'RUNNING', off: 'OFF'     },
    stBuzzer:    { val: SYSTEM.buzzer,    on: 'ACTIVE',  off: 'STANDBY' },
  };
  Object.keys(map).forEach(function(id) {
    var cfg = map[id];
    var e   = el(id);
    if (!e) return;
    e.textContent = cfg.val ? cfg.on : cfg.off;
    e.className   = 'ov-st' + (cfg.val ? ' ov-active' : '');
  });
  if (el('sidebarBadge')) el('sidebarBadge').textContent = SYSTEM.alarmCount;
});

document.addEventListener('DOMContentLoaded', function() {
  var ap = document.getElementById('authPass');
  if (ap) {
    ap.addEventListener('keydown', function(e) {
      if (e.key === 'Enter')  confirmAuth();
      if (e.key === 'Escape') closeAuthModal();
    });
  }
});
