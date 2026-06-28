'use strict';

(function applyTheme() {
  if (localStorage.getItem('fw_theme') === 'light') document.body.classList.add('light');
})();

const USERS_KEY    = 'fw_users';
const REQUESTS_KEY = 'fw_requests';

function getUsers() {
  var raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);
  var d = [
    { username: 'admin',    role: 'Administrator', pass: 'admin123' },
    { username: 'operator', role: 'Operator',      pass: 'op2026'   },
    { username: 'viewer',   role: 'Viewer',         pass: 'view123'  },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(d));
  return d;
}

var attempts = 0, locked = false, cdTimer = null;

function doLogin() {
  if (locked) return;

  var u   = document.getElementById('uname').value.trim().toLowerCase();
  var p   = document.getElementById('upass').value;
  var err = document.getElementById('loginError');
  var btn = document.getElementById('loginBtn');

  err.classList.remove('show');

  var users = getUsers();
  var found = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === u && users[i].pass === p) { found = users[i]; break; }
  }

  if (found) {
    attempts = 0;
    btn.textContent   = 'ACCESS GRANTED ✓';
    btn.style.background = '#2e7d32';
    sessionStorage.setItem('ignis_user', u);
    sessionStorage.setItem('ignis_role', found.role);
    sessionStorage.setItem('ignis_pass', p);
    setTimeout(function() { window.location.href = 'pages/dashboard.html'; }, 700);
    return;
  }

  attempts++;
  document.getElementById('upass').value = '';
  void err.offsetWidth;
  err.classList.add('show');

  if (attempts >= 3) {
    locked = true;
    btn.disabled  = true;
    btn.style.opacity = '0.45';
    document.getElementById('uname').disabled = true;
    document.getElementById('upass').disabled = true;

    var secs = 30;
    err.textContent = '⛔ Too many attempts — locked (' + secs + 's)';
    cdTimer = setInterval(function() {
      secs--;
      err.textContent = '⛔ Too many attempts — locked (' + secs + 's)';
      if (secs <= 0) {
        clearInterval(cdTimer);
        locked = false; attempts = 0;
        btn.disabled = false;
        btn.textContent = 'AUTHENTICATE';
        btn.style.background = '';
        btn.style.opacity    = '';
        document.getElementById('uname').disabled = false;
        document.getElementById('upass').disabled = false;
        err.classList.remove('show');
      }
    }, 1000);
  } else {
    var rem = 3 - attempts;
    err.textContent = '⚠ Invalid credentials — ' + rem + ' attempt' + (rem !== 1 ? 's' : '') + ' remaining';
  }
}

function openRequestModal() {
  document.getElementById('reqModal').classList.add('show');
  document.getElementById('reqError').textContent = '';
  document.getElementById('reqName').value   = '';
  document.getElementById('reqUser').value   = '';
  document.getElementById('reqReason').value = '';
  setTimeout(function() { document.getElementById('reqName').focus(); }, 60);
}

function closeRequestModal() {
  document.getElementById('reqModal').classList.remove('show');
}

function submitRequest() {
  var name   = document.getElementById('reqName').value.trim();
  var user   = document.getElementById('reqUser').value.trim().toLowerCase();
  var reason = document.getElementById('reqReason').value.trim();
  var errEl  = document.getElementById('reqError');
  errEl.textContent = '';

  if (!name)   { errEl.textContent = 'Full name is required.';        return; }
  if (!user)   { errEl.textContent = 'Desired username is required.'; return; }
  if (!reason) { errEl.textContent = 'Reason is required.';           return; }

  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === user) { errEl.textContent = 'Username already taken.'; return; }
  }

  var requests = JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
  for (var j = 0; j < requests.length; j++) {
    if (requests[j].username === user && requests[j].status === 'pending') {
      errEl.textContent = 'Request already submitted.'; return;
    }
  }

  requests.push({
    id: Date.now(),
    name: name,
    username: user,
    reason: reason,
    status: 'pending',
    createdAt: new Date().toLocaleString(),
  });
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));

  closeRequestModal();
  var success = document.getElementById('loginSuccess');
  success.textContent = '✓ Request sent! An admin will review it shortly.';
  success.classList.add('show');
  setTimeout(function() { success.classList.remove('show'); }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keydown', function(e) { if (e.key === 'Enter') doLogin(); });
  var modal = document.getElementById('reqModal');
  if (modal) {
    modal.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeRequestModal(); });
  }
});
