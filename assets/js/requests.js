'use strict';

const REQUESTS_KEY = 'fw_requests';
const USERS_KEY    = 'fw_users';

let pendingApproveId = null;

function getRequests() {
  return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
}
function saveRequests(r) { localStorage.setItem(REQUESTS_KEY, JSON.stringify(r)); }

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);
  return [];
}
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

function renderRequests() {
  const list = document.getElementById('requestsList');
  if (!list) return;
  const all     = getRequests();
  const pending = all.filter(r => r.status === 'pending');
  const done    = all.filter(r => r.status !== 'pending');

  const badge = document.getElementById('reqsBadge');
  if (badge) badge.textContent = pending.length;

  if (all.length === 0) {
    list.innerHTML = '<div class="empty-req">No requests yet</div>';
    return;
  }

  const mkRow = (r) => {
    const isPending = r.status === 'pending';
    const statusBadge = isPending
      ? '<span class="req-status pending">Pending</span>'
      : r.status === 'approved'
        ? '<span class="req-status approved">Approved</span>'
        : '<span class="req-status denied">Denied</span>';
    return `<div class="req-row${isPending ? '' : ' req-done'}">
      <div class="req-info">
        <div class="req-name">${r.name}</div>
        <div class="req-meta">@${r.username} · ${r.reason}</div>
        <div class="req-time">${r.createdAt}</div>
      </div>
      ${statusBadge}
      ${isPending ? `
        <div class="req-actions">
          <button class="btn btn-primary btn-sm" onclick="openApprove(${r.id})">Approve</button>
          <button class="btn btn-ghost btn-sm" onclick="denyRequest(${r.id})">Deny</button>
        </div>` : ''}
    </div>`;
  };

  list.innerHTML = pending.map(mkRow).join('') + (done.length ? '<div class="req-divider">Past Requests</div>' + done.map(mkRow).join('') : '');
}

function openApprove(id) {
  pendingApproveId = id;
  const reqs = getRequests();
  const r    = reqs.find(x => x.id === id);
  if (!r) return;
  document.getElementById('approveModalSub').textContent = 'Approving access for: ' + r.name + ' (@' + r.username + ')';
  document.getElementById('approvePass').value = '';
  document.getElementById('approveRole').value = 'Viewer';
  document.getElementById('approveModal').classList.add('show');
  setTimeout(() => document.getElementById('approvePass').focus(), 60);
}

function closeApproveModal() {
  document.getElementById('approveModal').classList.remove('show');
  pendingApproveId = null;
}

function confirmApprove() {
  const pass = document.getElementById('approvePass').value.trim();
  const role = document.getElementById('approveRole').value;
  if (!pass) { alert('Set a password for the new user.'); return; }

  const reqs = getRequests();
  const r    = reqs.find(x => x.id === pendingApproveId);
  if (!r) return;

  const users = getUsers();
  if (!users.find(u => u.username === r.username)) {
    users.push({ username: r.username, role, pass });
    saveUsers(users);
  }

  r.status = 'approved';
  saveRequests(reqs);
  closeApproveModal();
  renderRequests();
  showToast('User @' + r.username + ' approved');
}

function denyRequest(id) {
  if (!confirm('Deny this request?')) return;
  const reqs = getRequests();
  const r    = reqs.find(x => x.id === id);
  if (r) { r.status = 'denied'; saveRequests(reqs); }
  renderRequests();
  showToast('Request denied');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = '✓ ' + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderRequests();
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeApproveModal(); });
});
