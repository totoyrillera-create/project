.ul-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 60px;
}

.ul-user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  animation: fadeUp 0.3s var(--ease) both;
  transition: border-color 0.15s;
}
.ul-user-item:hover { border-color: var(--c-border2); }
.ul-user-item.is-you { border-color: rgba(255,87,34,0.2); background: rgba(255,87,34,0.04); }

.ul-av {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #bf360c, var(--c-fire));
  display: grid; place-items: center;
  font-size: 0.95rem; flex-shrink: 0;
}
.ul-info { flex: 1; min-width: 0; }
.ul-name { font-size: 0.9rem; font-weight: 600; color: var(--c-text); }
.ul-role { font-family: var(--mono); font-size: 0.68rem; color: var(--c-text3); letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }

.you-tag {
  font-family: var(--mono);
  font-size: 0.66rem;
  color: var(--c-safe);
  letter-spacing: 1.5px;
  background: rgba(0,230,118,0.08);
  border: 1px solid rgba(0,230,118,0.2);
  padding: 2px 8px;
  border-radius: 99px;
  flex-shrink: 0;
}

.ul-del {
  background: none;
  border: none;
  color: var(--c-text3);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 5px;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}
.ul-del:hover { color: var(--c-danger); background: rgba(244,67,54,0.08); }

.ul-form { display: flex; flex-direction: column; gap: 14px; }
.ul-field { display: flex; flex-direction: column; gap: 5px; }
.ul-submit { margin-top: 4px; }
.ul-error {
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--c-danger);
  min-height: 1em;
  letter-spacing: 0.5px;
}

.ul-roles-guide { display: flex; flex-direction: column; gap: 8px; }
.role-row { display: flex; align-items: center; gap: 10px; padding: 4px 0; }
.role-badge {
  font-family: var(--mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 99px;
  flex-shrink: 0;
  width: 100px;
  text-align: center;
}
.role-viewer   { background: rgba(41,182,246,0.1);  color: var(--c-info);   border: 1px solid rgba(41,182,246,0.2); }
.role-operator { background: rgba(255,179,0,0.1);   color: var(--c-warn);   border: 1px solid rgba(255,179,0,0.2); }
.role-admin    { background: rgba(255,87,34,0.1);   color: var(--c-fire2);  border: 1px solid rgba(255,87,34,0.25); }
.role-desc { font-size: 0.83rem; color: var(--c-text2); }

.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.68); backdrop-filter:blur(6px); z-index:1000; display:none; align-items:center; justify-content:center; }
.modal-overlay.show { display:flex; }
.modal-box { background:var(--c-surface); border:1px solid var(--c-border2); border-radius:var(--r); padding:32px 28px; width:100%; max-width:380px; box-shadow:0 20px 72px rgba(0,0,0,0.65); animation:modalIn 0.28s var(--spring) both; }
@keyframes modalIn { from{opacity:0;transform:scale(0.94) translateY(14px)} to{opacity:1;transform:none} }
.modal-icon  { font-size:2rem; text-align:center; margin-bottom:10px; }
.modal-title { font-size:1.1rem; font-weight:700; color:var(--c-text); text-align:center; margin-bottom:5px; }
.modal-sub   { font-family:var(--mono); font-size:0.67rem; color:var(--c-text3); text-align:center; letter-spacing:1px; margin-bottom:22px; }
.modal-btns  { display:flex; gap:10px; margin-top:18px; }

.toast { display:none; position:fixed; bottom:22px; right:22px; background:var(--c-surface2); border:1px solid var(--c-fire); border-radius:var(--r); padding:12px 18px; font-family:var(--mono); font-size:0.76rem; color:var(--c-fire2); letter-spacing:0.5px; z-index:9999; box-shadow:0 8px 28px rgba(0,0,0,0.35); }
.toast.show { display:block; animation:toastIn 0.28s var(--spring) both; }
@keyframes toastIn { from{transform:translateY(10px);opacity:0} to{transform:none;opacity:1} }

/* Access requests */
.empty-req {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--c-text3);
  letter-spacing: 1px;
  padding: 24px 0;
  text-align: center;
}
.req-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--c-border);
  animation: fadeUp 0.3s var(--ease) both;
}
.req-row:last-child { border-bottom: none; }
.req-row.req-done { opacity: 0.55; }
.req-info { flex: 1; min-width: 0; }
.req-name { font-size: 0.9rem; font-weight: 600; color: var(--c-text); }
.req-meta { font-family: var(--mono); font-size: 0.65rem; color: var(--c-text2); margin-top: 2px; }
.req-time { font-family: var(--mono); font-size: 0.68rem; color: var(--c-text3); margin-top: 2px; letter-spacing: 0.5px; }
.req-actions { display: flex; gap: 6px; flex-shrink: 0; }
.req-status {
  font-family: var(--mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 99px;
  flex-shrink: 0;
}
.req-status.pending  { background: rgba(255,179,0,0.1);  color: var(--c-warn);   border: 1px solid rgba(255,179,0,0.25); }
.req-status.approved { background: rgba(0,230,118,0.1);  color: var(--c-safe);   border: 1px solid rgba(0,230,118,0.25); }
.req-status.denied   { background: rgba(244,67,54,0.1);  color: var(--c-danger); border: 1px solid rgba(244,67,54,0.25); }
.req-divider { font-family: var(--mono); font-size: 0.68rem; color: var(--c-text3); letter-spacing: 2px; text-transform: uppercase; padding: 14px 0 6px; }
