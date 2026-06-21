/* ============================================================
   WK Pool 2026 — controller (state, init, events, actions)
   ============================================================ */

const state = {
  session: null,            // {id, username, is_admin}
  screen: "dashboard",
  loading: true,
  authMode: "login",
  authError: "",
  claimable: [],            // pre-created accounts you can claim on register
  claimUsername: "",        // "" = none picked, "__new__" = brand-new account
  editUnlocked: false,      // admin gave me rights to edit after submitting
  tsFilter: { scope: "popular", team: "", pos: "", q: "" },   // topscorer pick page
  goalFilter: { scope: "popular", team: "", pos: "", q: "" }, // admin goals page
  settings: null,
  teams: [],
  players: [],
  draft: null,              // my prediction (working copy)
  dirty: false,
  users: [],
  predictions: [],
  leaderboard: [],
  me: null
};

/* ---------- tiny UI helpers ---------- */
function toast(msg, type) {
  let wrap = document.getElementById("toast-root");
  if (!wrap) { wrap = document.createElement("div"); wrap.id = "toast-root"; wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
  const el = document.createElement("div");
  el.className = "toast " + (type || "");
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.transition = "opacity .3s"; el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 2600);
}
function confirmDialog(title, message, confirmLabel) {
  return new Promise(resolve => {
    const back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML = `<div class="modal"><h3>${esc(title)}</h3><p>${esc(message)}</p>
      <div class="modal-actions"><button class="btn btn-outline" data-x="c">Annuleren</button>
      <button class="btn btn-primary" data-x="ok">${esc(confirmLabel || "Bevestigen")}</button></div></div>`;
    document.body.appendChild(back);
    back.addEventListener("click", e => {
      if (e.target === back || e.target.dataset.x === "c") { back.remove(); resolve(false); }
      else if (e.target.dataset.x === "ok") { back.remove(); resolve(true); }
    });
  });
}
function rerender(preserveScroll) {
  const y = preserveScroll ? window.scrollY : 0;
  renderApp();
  if (preserveScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
}

/* ---------- data loading ---------- */
function recompute() {
  state.leaderboard = buildLeaderboard(state.users, state.predictions, state.settings);
  state.me = state.leaderboard.find(r => r.id === state.session.id) || null;
}
async function reloadAll() {
  state.settings = await loadSettings();
  state.teams = state.settings.teams;
  state.players = buildPlayerPool(state.settings.players);
  state.users = await loadAllUsers();
  state.predictions = await loadAllPredictions();

  // refresh my own record (admin status may have changed; account may be gone)
  const meUser = state.users.find(u => u.id === state.session.id);
  if (!meUser) {
    clearSession(); state.session = null;
    rerender(); toast("Je account bestaat niet meer.", "err");
    return;
  }
  state.session.is_admin = meUser.is_admin;
  state.editUnlocked = !!meUser.edit_unlocked;
  setSession(state.session);

  state.draft = await loadMyPrediction(state.session.id);
  state.draft.winner = state.draft.winner || null;
  recompute();
}

/* ---------- navigation ---------- */
async function navigate(screen) {
  // auto-save an unsaved draft when leaving a form
  if (state.dirty && (state.screen === "voorspellingen" || state.screen === "topscorers") && !isLocked()) {
    if (autosaveTimer) { clearTimeout(autosaveTimer); autosaveTimer = null; }
    try { await savePrediction(state.draft, "concept"); state.dirty = false; await refreshAfterPrediction(); } catch (e) {}
  }
  if (screen === "admin" && !(state.session && state.session.is_admin)) screen = "dashboard";
  state.screen = screen;
  rerender();
}
async function refreshAfterPrediction() {
  state.predictions = await loadAllPredictions();
  recompute();
}

/* ============================================================
   PREDICTION editing
   ============================================================ */
function sanitizeDraft() {
  const d = state.draft;
  d.quarter = d.quarter.filter(c => d.sel16.includes(c));
  d.semi = d.semi.filter(c => d.quarter.includes(c));
  d.finalists = d.finalists.filter(c => d.semi.includes(c));
  if (d.winner && !d.finalists.includes(d.winner)) d.winner = null;
}
/* Auto-save the working concept so nobody loses picks by forgetting to
   click "Concept opslaan" or by closing/leaving the page. */
let autosaveTimer = null;
function scheduleAutosave() {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => { autosaveTimer = null; flushAutosave(); }, 900);
}
async function flushAutosave() {
  if (autosaveTimer) { clearTimeout(autosaveTimer); autosaveTimer = null; }
  if (!state.dirty || isLocked() || !state.draft) return;
  try {
    await savePrediction(state.draft, "concept");
    state.dirty = false;
    await refreshAfterPrediction();
    rerender(true);
  } catch (e) { /* keep dirty; will retry on next change / leave */ }
}

function toggleStage(stage, code) {
  if (isLocked()) return;
  const d = state.draft;
  if (stage === "winner") { d.winner = d.winner === code ? null : code; }
  else {
    const arr = d[stage];
    const i = arr.indexOf(code);
    if (i >= 0) arr.splice(i, 1);
    else {
      const max = { sel16: 16, quarter: 8, semi: 4, finalists: 2 }[stage];
      if (arr.length < max) arr.push(code);
    }
  }
  sanitizeDraft();
  state.dirty = true;
  scheduleAutosave();
  rerender(true);
}
function toggleTopscorer(id) {
  if (isLocked()) return;
  const arr = state.draft.topscorers;
  const i = arr.indexOf(id);
  if (i >= 0) arr.splice(i, 1);
  else if (arr.length < TOPSCORER_COUNT) arr.push(id);
  state.dirty = true;
  scheduleAutosave();
  rerender(true);
}
async function saveDraft() {
  try {
    await savePrediction(state.draft, "concept");
    state.dirty = false;
    await refreshAfterPrediction();
    rerender(true);
    toast("Concept opgeslagen ✓", "ok");
  } catch (e) { toast("Opslaan mislukt: " + e.message, "err"); }
}
async function submitFinal() {
  if (isLocked()) {
    toast(deadlinePassed() ? "De deadline is verstreken — inleveren kan niet meer." : "Je voorspelling is al ingeleverd.", "err");
    return;
  }
  const d = state.draft;

  // Topscorers must be filled in first — guide the user to that page.
  if (d.topscorers.length < TOPSCORER_COUNT) {
    const go = await confirmDialog("Eerst je topscorers kiezen",
      `Voordat je definitief kunt inleveren, moet je nog je ${TOPSCORER_COUNT} topscorers invullen. Wil je daar nu naartoe?`,
      "Naar topscorers →");
    if (go) navigate("topscorers");
    return;
  }

  const koComplete = d.sel16.length === 16 && d.quarter.length === 8 &&
    d.semi.length === 4 && d.finalists.length === 2 && d.winner;
  if (!koComplete) { toast("Vul eerst alle rondes volledig in (16 / 8 / 4 / 2 / kampioen).", "err"); return; }

  const yes = await confirmDialog("Definitief inleveren?",
    "Na inleveren staan je voorspellingen vast en kun je ze niet meer wijzigen. Doorgaan?", "Ja, inleveren");
  if (!yes) return;
  try {
    await savePrediction(state.draft, "ingeleverd");
    state.draft.status = "ingeleverd";
    state.dirty = false;
    await refreshAfterPrediction();
    navigate("mijn");
    toast("Voorspelling ingeleverd! Succes ⚽", "ok");
  } catch (e) { toast("Inleveren mislukt: " + e.message, "err"); }
}

/* ============================================================
   AUTH
   ============================================================ */
async function doAuth() {
  const password = (document.getElementById("au-password") || {}).value || "";
  state.authError = "";
  const claimingExisting = state.authMode === "register" && state.claimUsername && state.claimUsername !== "__new__";
  try {
    let user;
    if (state.authMode === "register") {
      const confirm = (document.getElementById("au-confirm") || {}).value || "";
      if (password !== confirm) { state.authError = "Wachtwoorden komen niet overeen."; rerender(); return; }
      if (claimingExisting) {
        user = await claimAccount(state.claimUsername, password);
        toast("Welkom terug! Je account is geactiveerd ✓", "ok");
      } else {
        const username = (document.getElementById("au-username") || {}).value || "";
        user = await registerUser(username, password);
        toast(user.is_admin ? "Account aangemaakt — jij bent beheerder! 👑" : "Account aangemaakt ✓", "ok");
      }
    } else {
      const username = (document.getElementById("au-username") || {}).value || "";
      user = await loginUser(username, password);
    }
    state.session = { id: user.id, username: user.username, is_admin: user.is_admin };
    setSession(state.session);
    state.claimUsername = "";
    state.loading = true; rerender();
    await reloadAll();
    state.loading = false;
    state.screen = "dashboard";
    rerender();
  } catch (e) {
    state.authError = e.message || "Er ging iets mis.";
    // a claim race may have removed our pick from the list — refresh it
    if (claimingExisting) { try { state.claimable = await loadClaimableAccounts(); } catch (_) {} }
    rerender();
  }
}
async function logout() {
  clearSession();
  state.session = null; state.draft = null; state.dirty = false;
  state.authMode = "login"; state.authError = ""; state.claimUsername = ""; state.editUnlocked = false;
  try { state.claimable = await loadClaimableAccounts(); } catch (_) {}
  rerender();
}

/* ============================================================
   ADMIN actions
   ============================================================ */
function adminCount() { return state.users.filter(u => u.is_admin).length; }

async function adminToggleRole(id) {
  const u = state.users.find(x => x.id === id); if (!u) return;
  if (u.is_admin && adminCount() <= 1) { toast("Er moet minstens één beheerder blijven.", "err"); return; }
  try {
    await updateUser(id, { is_admin: !u.is_admin });
    await reloadAll(); rerender();
    toast(!u.is_admin ? `${u.username} is nu beheerder.` : `Beheer van ${u.username} afgenomen.`, "ok");
  } catch (e) { toast("Mislukt: " + e.message, "err"); }
}
async function adminTogglePaid(id) {
  const u = state.users.find(x => x.id === id); if (!u) return;
  try { await updateUser(id, { paid: !u.paid }); u.paid = !u.paid; rerender(true); }
  catch (e) { toast("Mislukt: " + e.message, "err"); }
}
async function adminToggleEditUnlock(id) {
  const u = state.users.find(x => x.id === id); if (!u) return;
  const next = !u.edit_unlocked;
  try {
    await updateUser(id, { edit_unlocked: next });
    u.edit_unlocked = next;
    if (id === state.session.id) state.editUnlocked = next;
    rerender(true);
    toast(next ? `${u.username} mag z'n voorspelling weer wijzigen.` : `Wijzigen voor ${u.username} weer vergrendeld.`, "ok");
  } catch (e) { toast("Mislukt: " + e.message, "err"); }
}
async function adminDelete(id, name) {
  if (id === state.session.id) { toast("Je kunt je eigen account hier niet verwijderen.", "err"); return; }
  const u = state.users.find(x => x.id === id);
  if (u && u.is_admin && adminCount() <= 1) { toast("Er moet minstens één beheerder blijven.", "err"); return; }
  const yes = await confirmDialog("Deelnemer verwijderen?", `Weet je zeker dat je ${name} en hun voorspellingen wilt verwijderen?`, "Verwijderen");
  if (!yes) return;
  try { await deleteUser(id); await reloadAll(); rerender(); toast(`${name} verwijderd.`, "ok"); }
  catch (e) { toast("Mislukt: " + e.message, "err"); }
}
async function adminSetGroupPoints(id, value) {
  const v = Math.max(0, parseInt(value, 10) || 0);
  const u = state.users.find(x => x.id === id); if (!u) return;
  u.group_points = v;
  try { await updateUser(id, { group_points: v }); recompute(); toast("Groepsfase-punten opgeslagen.", "ok"); }
  catch (e) { toast("Mislukt: " + e.message, "err"); }
}
async function adminSaveDeadline() {
  const val = (document.getElementById("adm-deadline") || {}).value;
  if (!val) { toast("Kies een datum/tijd.", "err"); return; }
  try { await saveSettings({ deadline: new Date(val).toISOString() }); state.settings = await loadSettings(); rerender(); toast("Deadline opgeslagen.", "ok"); }
  catch (e) { toast("Mislukt: " + e.message, "err"); }
}
async function adminSavePrizes() {
  const fee = Math.max(0, parseInt((document.getElementById("adm-fee") || {}).value, 10) || 0);
  const p1 = parseInt((document.getElementById("adm-p1") || {}).value, 10) || 0;
  const p2 = parseInt((document.getElementById("adm-p2") || {}).value, 10) || 0;
  const p3 = parseInt((document.getElementById("adm-p3") || {}).value, 10) || 0;
  try { await saveSettings({ entry_fee: fee, prize_pct: [p1, p2, p3] }); state.settings = await loadSettings(); rerender(); toast("Instellingen opgeslagen.", "ok"); }
  catch (e) { toast("Mislukt: " + e.message, "err"); }
}
function adminToggleResult(stage, code) {
  const res = state.settings.results;
  const arr = res[stage] || (res[stage] = []);
  const i = arr.indexOf(code);
  const max = (KO_STAGES.find(s => s.key === stage) || {}).count || 99;
  if (i >= 0) arr.splice(i, 1);
  else if (arr.length < max) arr.push(code);
  else { toast(`Maximaal ${max} teams voor deze ronde.`, "err"); return; }
  rerender(true);
}
function adminSetWinner(code) {
  state.settings.results.winner = state.settings.results.winner === code ? null : code;
  rerender(true);
}
function adminSetGoal(id, value) {
  state.settings.results.goals = state.settings.results.goals || {};
  state.settings.results.goals[id] = Math.max(0, parseInt(value, 10) || 0);
}
async function adminSaveResults() {
  try {
    await saveSettings({ results: state.settings.results });
    await reloadAll(); rerender();
    toast("Uitslagen opgeslagen — klassement herberekend.", "ok");
  } catch (e) { toast("Mislukt: " + e.message, "err"); }
}
async function adminAddPlayer() {
  const name = ((document.getElementById("np-name") || {}).value || "").trim();
  const teamCode = ((document.getElementById("np-team") || {}).value || "").trim();
  const pos = ((document.getElementById("np-pos") || {}).value || "A").trim();
  const club = ((document.getElementById("np-club") || {}).value || "").trim();
  if (!name) { toast("Vul een spelersnaam in.", "err"); return; }
  if (!teamCode) { toast("Kies een land.", "err"); return; }
  const team = (state.teams || []).find(t => t.code === teamCode);
  if (!team) { toast("Onbekend land.", "err"); return; }
  const id = slugify(name);
  if (state.players.some(p => p.id === id)) { toast("Die speler bestaat al.", "err"); return; }
  const custom = (state.settings.players || []).slice();
  custom.push({ id, name, club, cc: team.cc, country: team.name, team: team.code, pos, posLabel: POS_LABEL[pos] || "Aanvaller" });
  try {
    await saveSettings({ players: custom });
    state.settings = await loadSettings();
    state.players = buildPlayerPool(state.settings.players);
    rerender(); toast("Speler toegevoegd.", "ok");
  } catch (e) { toast("Mislukt: " + e.message, "err"); }
}
async function adminDelPlayer(id) {
  const custom = (state.settings.players || []).filter(p => p.id !== id);
  try {
    await saveSettings({ players: custom });
    state.settings.players = custom;
    state.players = buildPlayerPool(custom);
    rerender(true);
  } catch (e) { toast("Mislukt: " + e.message, "err"); }
}
async function adminAddTeam() {
  const code = ((document.getElementById("nt-code") || {}).value || "").trim().toUpperCase();
  const name = (document.getElementById("nt-name") || {}).value.trim();
  const cc = ((document.getElementById("nt-cc") || {}).value || "").trim().toLowerCase();
  if (!code || !name) { toast("Vul code én naam in.", "err"); return; }
  if (state.teams.some(t => t.code === code)) { toast("Die teamcode bestaat al.", "err"); return; }
  state.teams.push({ code, name, cc });
  try { await saveSettings({ teams: state.teams }); state.settings = await loadSettings(); state.teams = state.settings.teams; rerender(); toast("Team toegevoegd.", "ok"); }
  catch (e) { toast("Mislukt: " + e.message, "err"); }
}
async function adminDelTeam(code) {
  state.teams = state.teams.filter(t => t.code !== code);
  try { await saveSettings({ teams: state.teams }); rerender(true); }
  catch (e) { toast("Mislukt: " + e.message, "err"); }
}

/* ---------- player filter bar (topscorers + admin goals) ---------- */
function setPlayerFilter(which, field, value) {
  const f = which === "goal" ? state.goalFilter : state.tsFilter;
  if (field === "scope") { f.scope = value; }
  else { f.scope = "all"; f[field] = value; }   // touching team/pos/q implies "all"
  rerender(true);
  // keep focus in the search box after a re-render
  if (field === "q") {
    const el = document.getElementById(which === "goal" ? "goal-q" : "ts-q");
    if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  }
}

/* ============================================================
   EVENT DELEGATION
   ============================================================ */
function onClick(e) {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const a = el.dataset.action;
  const d = el.dataset;
  switch (a) {
    case "authtab": state.authMode = d.mode; state.authError = ""; rerender(); break;
    case "authsubmit": doAuth(); break;
    case "logout": logout(); break;
    case "nav": navigate(d.screen); break;
    case "toggle": toggleStage(d.stage, d.code); break;
    case "topscorer": toggleTopscorer(d.id); break;
    case "pf-scope": setPlayerFilter(d.which, "scope", d.scope); break;
    case "savedraft": saveDraft(); break;
    case "submitfinal": submitFinal(); break;
    case "admin-role": adminToggleRole(d.id); break;
    case "admin-paid": adminTogglePaid(d.id); break;
    case "admin-editunlock": adminToggleEditUnlock(d.id); break;
    case "admin-delete": adminDelete(d.id, d.name); break;
    case "admin-deadline": adminSaveDeadline(); break;
    case "admin-prizes": adminSavePrizes(); break;
    case "admin-result": adminToggleResult(d.stage, d.code); break;
    case "admin-winner": adminSetWinner(d.code); break;
    case "admin-save-results": adminSaveResults(); break;
    case "admin-save-goals": adminSaveResults(); break;
    case "admin-add-player": adminAddPlayer(); break;
    case "admin-del-player": adminDelPlayer(d.id); break;
    case "admin-add-team": adminAddTeam(); break;
    case "admin-del-team": adminDelTeam(d.code); break;
    case "admin-refresh": (async () => { await reloadAll(); rerender(); toast("Vernieuwd.", "ok"); })(); break;
  }
}
function onChange(e) {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  if (el.dataset.action === "admin-gp") adminSetGroupPoints(el.dataset.id, el.value);
  else if (el.dataset.action === "admin-goal") adminSetGoal(el.dataset.id, el.value);
  else if (el.dataset.action === "claimselect") { state.claimUsername = el.value; state.authError = ""; rerender(); }
  else if (el.dataset.action === "pf-team") setPlayerFilter(el.dataset.which, "team", el.value);
  else if (el.dataset.action === "pf-pos") setPlayerFilter(el.dataset.which, "pos", el.value);
}
function onInput(e) {
  const el = e.target.closest("[data-action='pf-q']");
  if (el) setPlayerFilter(el.dataset.which, "q", el.value);
}
function onKeydown(e) {
  if (e.key === "Enter" && !state.session && (e.target.id === "au-password" || e.target.id === "au-confirm" || e.target.id === "au-username")) {
    e.preventDefault(); doAuth();
  }
}

/* ---------- countdown ticker ---------- */
function tickCountdown() {
  if (!state.settings || !state.settings.deadline) return;
  const elD = document.getElementById("cd-d"); if (!elD) return;
  const diff = Math.max(0, new Date(state.settings.deadline).getTime() - Date.now());
  const pad = n => String(n).padStart(2, "0");
  elD.textContent = Math.floor(diff / 86400000);
  const h = document.getElementById("cd-h"); if (h) h.textContent = pad(Math.floor(diff / 3600000) % 24);
  const m = document.getElementById("cd-m"); if (m) m.textContent = pad(Math.floor(diff / 60000) % 60);
  const s = document.getElementById("cd-s"); if (s) s.textContent = pad(Math.floor(diff / 1000) % 60);
}

/* ============================================================
   INIT
   ============================================================ */
// Best-effort save when the user leaves or hides the tab without saving.
function saveOnLeave() {
  if (state.dirty && !isLocked() && state.draft) {
    try { savePrediction(state.draft, "concept"); state.dirty = false; } catch (e) {}
  }
}

async function boot() {
  document.addEventListener("click", onClick);
  document.addEventListener("change", onChange);
  document.addEventListener("input", onInput);
  document.addEventListener("keydown", onKeydown);
  window.addEventListener("pagehide", saveOnLeave);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") saveOnLeave(); });
  setInterval(tickCountdown, 1000);

  if (!initDb()) { state.loading = false; renderApp(); return; }

  const sess = getSession();
  if (sess && sess.id) {
    state.session = sess;
    try {
      await reloadAll();
      state.loading = false;
      if (state.session) rerender(); else renderApp();
    } catch (e) {
      state.loading = false;
      clearSession(); state.session = null;
      renderApp();
      toast("Kon niet verbinden met de database. Controleer config.js / schema.", "err");
    }
  } else {
    state.loading = false;
    try { state.claimable = await loadClaimableAccounts(); } catch (e) {}
    renderApp();
  }
}

document.addEventListener("DOMContentLoaded", boot);
