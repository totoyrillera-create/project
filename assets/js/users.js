'use strict';

const USERS_KEY = 'fw_users';

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);
  const d = [
    { username:'admin',    role:'Administrator', pass:'admin123' },
    { username:'operator', role:'Operator',      pass:'op2026'   },
    { username:'viewer',   role:'Viewer',         pass:'view123'  },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(d));
  return d;
}

function saveUsersList(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

let pendingDeleteIdx = null;

function renderUsers() {
  const list = document.getElementById('usersList');
  if (!list) return;
  const users = getUsers();
  const cur   = sessionStorage.getItem('ignis_user') || '';

  list.innerHTML = users.map((u, i) => {
    const isYou = u.username === cur;
    const roleClass = { Administrator:'role-admin', Operator:'role-operator', Viewer:'role-viewer' }[u.role] || 'role-viewer';
    return `<div class="ul-user-item${isYou ? ' is-you' : ''}">
      <div class="ul-av">👤</div>
      <div class="ul-info">
        <div class="ul-name">${u.username.charAt(0).toUpperCase() + u.username.slice(1)}</div>
        <div class="ul-role">${u.role}</div>
      </div>
      ${isYou
        ? '<span class="you-tag">YOU</span>'
        : `<button class="ul-del" onclick="askDelete(${i})" title="Remove user">✕</button>`
      }
    </div>`;
  }).join('');
}

function addUser() {
  const un = document.getElementById('newUsername').value.trim().toLowerCase();
  const pw = document.getElementById('newPass').value.trim();
  const ro = document.getElementById('newRole').value;
  const errEl = document.getElementById('addError');
  errEl.textContent = '';

  if (!un) { errEl.textContent = 'Username is required.'; return; }
  if (!pw) { errEl.textContent = 'Password is required.'; return; }
  if (un.length < 3) { errEl.textContent = 'Username must be at least 3 characters.'; return; }

  const users = getUsers();
  if (users.find(u => u.username === un)) { errEl.textContent = 'Username already exists.'; return; }

  users.push({ username: un, role: ro, pass: pw });
  saveUsersList(users);

  document.getElementById('newUsername').value = '';
  document.getElementById('newPass').value     = '';
  document.getElementById('newRole').value     = 'Viewer';

  renderUsers();
  showToast(`User "${un}" added`);
}

function askDelete(idx) {
  pendingDeleteIdx = idx;
  const users = getUsers();
  const u = users[idx];
  const sub = document.getElementById('deleteModalSub');
  if (sub) sub.textContent = `Remove "${u.username}" (${u.role}) from the system?`;
  document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
  pendingDeleteIdx = null;
  document.getElementById('deleteModal').classList.remove('show');
}

function confirmDelete() {
  if (pendingDeleteIdx === null) return;
  const users = getUsers();
  const removed = users.splice(pendingDeleteIdx, 1)[0];
  saveUsersList(users);
  closeDeleteModal();
  renderUsers();
  showToast(`User "${removed.username}" removed`);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = '✓ ' + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderUsers();
  document.getElementById('newUsername')?.addEventListener('keydown', e => { if (e.key === 'Enter') addUser(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDeleteModal(); });
});
