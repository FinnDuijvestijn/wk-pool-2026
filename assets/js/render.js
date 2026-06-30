/* ============================================================
   WK Pool 2026 — rendering layer (pure functions of `state`)
   Returns HTML strings; events are wired by delegation in app.js
   ============================================================ */

const LOGO = "assets/img/dsp-logo.png";

/* ---------- flags (SVG images — render identically on Windows/Android/iOS) ---------- */
const FLAG_BASE = "https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/";
function ccFromEmoji(e) {
  if (!e) return null;
  const cps = [...e].map(c => c.codePointAt(0));
  // subdivision flags (England/Scotland/Wales): black flag + tag letters
  if (cps[0] === 0x1F3F4) {
    const tags = cps.filter(cp => cp >= 0xE0061 && cp <= 0xE007A).map(cp => String.fromCharCode(cp - 0xE0000)).join("");
    if (tags.indexOf("gbeng") === 0) return "gb-eng";
    if (tags.indexOf("gbsct") === 0) return "gb-sct";
    if (tags.indexOf("gbwls") === 0) return "gb-wls";
    return null;
  }
  const ri = cps.filter(cp => cp >= 0x1F1E6 && cp <= 0x1F1FF);
  if (ri.length >= 2) return String.fromCharCode(97 + ri[0] - 0x1F1E6) + String.fromCharCode(97 + ri[1] - 0x1F1E6);
  return null;
}
// Flag <img> sized via height:1em — the wrapping element's font-size controls the size.
function flagHTML(cc, label) {
  if (!cc) return `<span>🏳️</span>`;
  return `<img class="flag" src="${FLAG_BASE}${cc}.svg" alt="${esc(label || "")}" loading="lazy">`;
}
function tflag(t) { return flagHTML(t.cc || ccFromEmoji(t.flag), t.name); }
function pflag(p) { return flagHTML(p.cc || ccFromEmoji(p.flag), p.name); }

/* ---------- helpers ---------- */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function teamMap() { const m = {}; (state.teams || []).forEach(t => m[t.code] = t); return m; }
function playerMap() { const m = {}; (state.players || []).forEach(p => m[p.id] = p); return m; }
function initial(name) { return (name || "?").trim().charAt(0).toUpperCase(); }
function colorFor(name) {
  let h = 0; for (const c of (name || "")) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function fmtDeadline(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const days = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const mon = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${days[d.getDay()]} ${d.getDate()} ${mon[d.getMonth()]} · ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function deadlinePassed() {
  const dl = state.settings && state.settings.deadline;
  return dl ? Date.now() > new Date(dl).getTime() : false;
}
// Admin granted me the right to edit again after the deadline.
function editUnlocked() { return !!state.editUnlocked; }
// True while an admin is filling in / editing a participant's entry on their behalf.
function adminEditing() { return !!state.adminEdit; }
// You can keep editing until the deadline — even after handing in a "final"
// version. The deadline is the only hard lock (an admin can reopen it). An admin
// editing on someone's behalf bypasses the lock entirely.
function isLocked() {
  if (adminEditing()) return false;
  return !editUnlocked() && deadlinePassed();
}
// A prediction counts as final once submitted OR once the deadline passes
// (forgot to submit → latest concept becomes the final entry).
function effectiveSubmitted() {
  return (state.draft && state.draft.status === "ingeleverd") || deadlinePassed();
}
// Once the deadline passes nobody can still change anything, so it's safe to let
// everyone peek at what others picked. Admins can always look.
function canSeeOtherEntries() { return deadlinePassed() || !!(state.session && state.session.is_admin); }
function participants() { return (state.users || []).length; }
function entryFee() { return (state.settings && state.settings.entry_fee) || 10; }
function pot() { return participants() * entryFee(); }
function prizePct() {
  return ((state.settings && state.settings.prize_pct) || [70, 20, 10]).map(Number);
}
function prizes() {
  return prizePct().map(p => pot() * p / 100);
}
// "33.3" → "33,3"  ·  whole numbers stay whole  (Dutch decimal comma)
function fmtNum(n) {
  const r = Math.round((Number(n) || 0) * 100) / 100;
  return (Number.isInteger(r) ? String(r) : r.toFixed(2).replace(/0$/, "")).replace(".", ",");
}
function fmtEuro(n) {
  const r = Math.round((Number(n) || 0) * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2).replace(".", ",");
}

/* ============================================================
   LOGIN / REGISTER
   ============================================================ */
function renderAuth() {
  const isLogin = state.authMode === "login";
  const pick = state.claimUsername;          // "", "__new__", or a name
  const claiming = !isLogin && pick && pick !== "__new__";
  const newAccount = !isLogin && pick === "__new__";

  const claimOptions = (state.claimable || []).map(a =>
    `<option value="${esc(a.username)}" ${pick === a.username ? "selected" : ""}>${esc(a.username)} · ${Number(a.group_points) || 0} pt</option>`
  ).join("");

  const registerBody = `
    <label class="field-label">Wie ben je in de poule?</label>
    <select id="au-claim" class="field" data-action="claimselect">
      <option value="" ${pick === "" ? "selected" : ""}>— Kies je naam uit de poule —</option>
      ${claimOptions}
      <option value="__new__" ${pick === "__new__" ? "selected" : ""}>➕ Mijn naam staat er niet bij — nieuw account</option>
    </select>
    ${claiming ? `<div class="claim-hint">Je activeert het account van <strong>${esc(pick)}</strong>. Je punten uit de groepsfase staan al klaar — stel alleen nog een wachtwoord in.</div>` : ""}
    ${newAccount ? `<label class="field-label">Gebruikersnaam</label>
      <input id="au-username" class="field" type="text" placeholder="bijv. daan_dsp" autocomplete="username">` : ""}
    ${(claiming || newAccount) ? `
      <label class="field-label">Wachtwoord</label>
      <input id="au-password" class="field" type="password" placeholder="••••••••" autocomplete="new-password">
      <label class="field-label">Bevestig wachtwoord</label>
      <input id="au-confirm" class="field" type="password" placeholder="••••••••" autocomplete="new-password">
      <button type="button" class="btn btn-primary btn-block" data-action="authsubmit" style="margin-top:4px;">${claiming ? "Account activeren" : "Account aanmaken"}</button>
    ` : `<div class="note"><span style="font-size:16px;flex:none;">👉</span><p>Kies hierboven je naam uit de poule om je account te activeren — of maak een nieuw account aan.</p></div>`}`;

  const loginBody = `
    <label class="field-label">Gebruikersnaam</label>
    <input id="au-username" class="field" type="text" placeholder="bijv. daan_dsp" autocomplete="username">
    <label class="field-label">Wachtwoord</label>
    <input id="au-password" class="field" type="password" placeholder="••••••••" autocomplete="current-password">
    <button type="button" class="btn btn-primary btn-block" data-action="authsubmit" style="margin-top:4px;">Inloggen</button>
    <div class="note">
      <span style="font-size:16px;flex:none;">🔒</span>
      <p>Geen e-mail nodig — verzin zelf een gebruikersnaam en wachtwoord. Zo blijven inzendingen aan je naam gekoppeld zonder gedoe.</p>
    </div>`;

  return `
  <div class="auth-wrap">
    <div class="auth-hero">
      <div class="brandline">
        <img src="${LOGO}" alt="DSP">
        <span class="brandname">DSP-GROEP</span>
      </div>
      <div class="hero-rings"><div class="ring-badge"><div class="cup">🏆</div><div class="yr">26</div></div></div>
      <div class="hero-fade"></div>
      <div class="hero-copy">
        <div class="kicker">Grote DSP WK POOL 2026 · Knock-outfase</div>
        <h1>Voorspel de<br>knock-out.<br>Pak de titel.</h1>
        <p>De interne wereldkampioenschap-pool van DSP-Groep. Voorspel wie de laatste 16 haalt, kies je topscorers en klim naar de top van het klassement.</p>
      </div>
    </div>
    <div class="auth-panel">
      <div class="auth-card">
        <div class="eyebrow">Welkom bij de pool</div>
        <h2>${isLogin ? "Log in op de pool" : "Activeer je account"}</h2>
        <div class="auth-tabs">
          <button type="button" class="auth-tab ${isLogin ? "active" : ""}" data-action="authtab" data-mode="login">Inloggen</button>
          <button type="button" class="auth-tab ${!isLogin ? "active" : ""}" data-action="authtab" data-mode="register">Registreren</button>
        </div>
        ${state.authError ? `<div class="auth-error">${esc(state.authError)}</div>` : ""}
        ${isLogin ? loginBody : registerBody}
      </div>
    </div>
  </div>`;
}

/* ============================================================
   APP SHELL (topbar + footer wrap a screen)
   ============================================================ */
function navDefs() {
  const items = [
    ["dashboard", "Dashboard"], ["voorspellingen", "Voorspellingen"], ["topscorers", "Topscorers"],
    ["klassement", "Klassement"], ["mijn", "Mijn voorspellingen"], ["reglement", "Reglement"]
  ];
  if (state.session && state.session.is_admin) items.push(["admin", "Admin"]);
  return items;
}
function navItems() {
  return navDefs().map(([id, label]) =>
    `<button type="button" class="nav-btn ${state.screen === id ? "active" : ""}" data-action="nav" data-screen="${id}">${label}</button>`
  ).join("");
}
function navItemsMobile() {
  return navDefs().map(([id, label]) =>
    `<button type="button" class="mm-item ${state.screen === id ? "active" : ""}" data-action="nav" data-screen="${id}"><span>${label}</span><span class="mm-arrow">→</span></button>`
  ).join("");
}
function renderShell(inner) {
  const myTotal = state.me ? state.me.total : 0;
  const u = state.session;
  return `
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand" data-action="nav" data-screen="dashboard" title="Grote DSP WK POOL 2026">
        <img src="${LOGO}" alt="DSP">
        <div>
          <div class="b1">GD<span>WKP</span>26</div>
          <div class="b2">DSP-Groep · Knock-out</div>
        </div>
      </div>
      <nav class="nav">${navItems()}</nav>
      <div class="topbar-right">
        <div class="points-pill"><span class="lbl">PNT</span><span class="val">${myTotal}</span></div>
        <div class="avatar desktop-only" style="background:${colorFor(u.username)};">${initial(u.username)}</div>
        <button type="button" class="btn-ghost btn desktop-only" style="padding:6px 8px;font-size:13px;" data-action="logout">Uitloggen</button>
        <button type="button" class="hamburger mobile-only" data-action="togglemenu" aria-label="Menu" aria-expanded="${state.menuOpen ? "true" : "false"}">${state.menuOpen ? "✕" : "☰"}</button>
      </div>
    </div>
    <div class="rainbow-stripe"></div>
    ${state.menuOpen ? `
    <div class="mm-overlay" data-action="closemenu"></div>
    <div class="mobile-menu">
      <div class="mm-user">
        <div class="avatar" style="background:${colorFor(u.username)};">${initial(u.username)}</div>
        <div class="mm-user-info">
          <div class="mm-name">${esc(u.username)}</div>
          <div class="mm-role">${u.is_admin ? "Beheerder" : "Deelnemer"} · ${myTotal} pnt</div>
        </div>
      </div>
      <div class="mm-list">${navItemsMobile()}</div>
      <button type="button" class="btn btn-outline btn-block" data-action="logout" style="margin-top:8px;">Uitloggen</button>
    </div>` : ""}
  </div>
  ${inner}
  <div class="foot"><div class="foot-inner">
    <div style="display:flex;align-items:center;gap:10px;"><img src="${LOGO}" alt="DSP"><span style="font-size:12.5px;color:var(--muted2);">Grote DSP WK POOL 2026 · een interne pool van DSP-Groep</span></div>
    <span class="mono" style="font-size:11px;color:#b8b3a6;">GDWKP26</span>
  </div></div>`;
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  const me = state.me || { rank: "-", total: 0, g: 0, k: 0, t: 0 };
  const locked = isLocked();
  const submitted = state.draft && state.draft.status === "ingeleverd";
  let statusColor, statusText, statusSub;
  if (deadlinePassed() && editUnlocked()) { statusColor = "var(--blue)"; statusText = "Bewerken open 🔓"; statusSub = "Een beheerder zette je voorspelling open"; }
  else if (deadlinePassed()) { statusColor = "var(--green)"; statusText = "Definitief ✓"; statusSub = submitted ? "Je voorspelling staat vast" : "Je laatste inzending telt mee"; }
  else if (submitted) { statusColor = "var(--green)"; statusText = "Ingeleverd ✓"; statusSub = "Je kunt nog wijzigen tot de deadline"; }
  else { statusColor = "var(--orange)"; statusText = "Concept opgeslagen"; statusSub = "Nog niet definitief ingeleverd"; }

  const canPeek = canSeeOtherEntries();
  const top5 = (state.leaderboard || []).slice(0, 5).map(r => `
    <div class="mini-row ${r.id === state.session.id ? "me" : ""} ${canPeek ? "clickable" : ""}" ${canPeek ? `data-action="view-user" data-id="${r.id}"` : ""}>
      <span class="rk">${r.rank}</span>
      <div class="av" style="background:${colorFor(r.name)};">${initial(r.name)}</div>
      <span class="nm">${esc(r.name)}</span>
      <span class="pt">${r.total}</span>
    </div>`).join("") || `<div style="padding:18px;color:var(--muted2);font-size:13px;">Nog geen deelnemers.</div>`;

  return renderShell(`
  <div class="page">
    <div class="hero">
      <div class="hero-rings-sm"></div>
      <div style="position:relative;z-index:2;max-width:620px;">
        <div class="kicker">Welkom terug, ${esc(state.session.username)} 👋</div>
        <h1>De knock-outfase begint bijna</h1>
        <p>Lever vóór de deadline je voorspellingen in voor de laatste 16, kwart-, halve finales, de finalisten én je 3 topscorers. Daarna gaat het slot erop.</p>
        <div class="countdown">
          <span class="lbl">${deadlinePassed() ? "Deadline" : "Deadline over"}</span>
          ${deadlinePassed()
      ? `<span class="exp" style="font-size:20px;color:var(--lime);">Verstreken</span>`
      : `<div class="cd-boxes" id="cd-boxes">
              <div class="cd-box"><div class="v" id="cd-d">–</div><div class="l">DAGEN</div></div>
              <div class="cd-box"><div class="v" id="cd-h">–</div><div class="l">UREN</div></div>
              <div class="cd-box"><div class="v" id="cd-m">–</div><div class="l">MIN</div></div>
              <div class="cd-box"><div class="v" id="cd-s">–</div><div class="l">SEC</div></div>
            </div>`}
        </div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat">
        <div class="bar" style="background:${statusColor};"></div>
        <div class="lbl">Jouw status</div>
        <div class="exp" style="font-weight:800;font-size:18px;color:${statusColor};">${statusText}</div>
        <div class="sub">${statusSub}</div>
        ${!locked ? `<button type="button" class="btn btn-dark btn-block btn-sm" style="margin-top:13px;padding:9px;" data-action="nav" data-screen="voorspellingen">${submitted ? "Voorspelling wijzigen →" : "Afmaken &amp; inleveren →"}</button>` : ""}
      </div>
      <div class="stat">
        <div class="bar" style="background:var(--blue);"></div>
        <div class="lbl">Huidige plek</div>
        <div class="big">#${me.rank}<small> / ${participants()}</small></div>
        <button type="button" class="btn btn-outline btn-block btn-sm" style="margin-top:18px;padding:9px;" data-action="nav" data-screen="klassement">Naar klassement →</button>
      </div>
      <div class="stat">
        <div class="bar" style="background:var(--green);"></div>
        <div class="lbl">Jouw punten</div>
        <div class="big">${me.total}</div>
        <div class="sub">${me.g} groepsfase · ${me.k + me.t} knock-out</div>
      </div>
      <div class="stat teal">
        <div class="lbl">Prijzenpot</div>
        <div class="big">€${pot()}</div>
        <div class="sub">${participants()} × €${entryFee()} inleg · top 3 wint</div>
      </div>
    </div>

    <div class="dash-2col" style="display:grid;grid-template-columns:1.25fr 1fr;gap:20px;">
      <div>
        <h3 class="section-title">Snel aan de slag</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="quick" data-action="nav" data-screen="voorspellingen">
            <div class="ic" style="background:#EEF1FF;">🧩</div>
            <div style="flex:1;"><div class="t1">Knock-out voorspellingen</div><div class="t2">Laatste 16 → 8 → 4 → 2 → wereldkampioen</div></div>
            <span class="arrow" style="color:var(--blue);">→</span>
          </div>
          <div class="quick" data-action="nav" data-screen="topscorers" style="--c:var(--green);">
            <div class="ic" style="background:#E9F7EE;">⚽</div>
            <div style="flex:1;"><div class="t1">Kies je 3 topscorers</div><div class="t2">20–80 punten per doelpunt · afhankelijk van positie</div></div>
            <span class="arrow" style="color:var(--green);">→</span>
          </div>
          <div class="quick" data-action="nav" data-screen="reglement">
            <div class="ic" style="background:#F2EEFE;">📋</div>
            <div style="flex:1;"><div class="t1">Lees het reglement</div><div class="t2">Puntentelling, deadlines en prijzen</div></div>
            <span class="arrow" style="color:var(--ink);">→</span>
          </div>
        </div>
      </div>
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin:0 0 14px;">
          <h3 class="section-title" style="margin:0;">Top 5</h3>
          <button type="button" class="btn-ghost btn" style="color:var(--blue);font-size:12.5px;padding:0;" data-action="nav" data-screen="klassement">Volledig klassement →</button>
        </div>
        <div class="card" style="padding:8px;">${top5}</div>
      </div>
    </div>
  </div>`);
}

/* ============================================================
   VOORSPELLINGEN (knock-out funnel)
   ============================================================ */
function pickList(stageKey, sourceCodes, max, accent, lightBg, lightBorder) {
  const tm = teamMap();
  const chosen = state.draft[stageKey] || [];
  if (!sourceCodes.length) {
    return `<div style="font-size:13px;color:var(--muted2);padding:14px;border:1.5px dashed var(--border);border-radius:11px;">Selecteer eerst de vorige ronde.</div>`;
  }
  return sourceCodes.map(code => {
    const t = tm[code]; if (!t) return "";
    const on = chosen.includes(code);
    const full = chosen.length >= max && !on;
    const style = on ? `border-color:${accent};background:${lightBg};` : "";
    return `<div class="pick-row ${on ? "on" : ""} ${full ? "disabled" : ""}" style="${style}${full ? "opacity:.45;cursor:not-allowed;" : ""}" ${isLocked() ? "" : `data-action="toggle" data-stage="${stageKey}" data-code="${code}"`}>
      <span class="fl">${tflag(t)}</span>
      <span class="nm">${esc(t.name)}</span>
      <span class="tick" style="${on ? `background:${accent};color:#fff;` : ""}">${on ? "✓" : ""}</span>
    </div>`;
  }).join("");
}

// Sticky banner shown on the edit screens while an admin fills in for someone else.
function renderAdminEditBar() {
  if (!adminEditing()) return "";
  return `
  <div class="admin-edit-bar">
    <div class="aeb-info">
      <span class="aeb-ic">⚙️</span>
      <div class="aeb-tx">
        <div class="aeb-t">Beheerdersmodus — invullen namens <strong>${esc(state.adminEdit.username)}</strong></div>
        <div class="aeb-s">Wijzigingen worden automatisch opgeslagen &amp; gelogd. De deelnemer kan dit zelf niet wijzigen.</div>
      </div>
    </div>
    <button type="button" class="btn aeb-done" data-action="admin-finish-edit">✓ Klaar</button>
  </div>`;
}

function renderVoorspellingen() {
  const d = state.draft;
  const tm = teamMap();
  const locked = isLocked();
  const submitted = d.status === "ingeleverd";

  const count16 = d.sel16.length;
  const full16 = count16 >= 16;
  const counterStyle = full16 ? "background:#E9F7EE;color:var(--green);" : "background:#EEF1FF;color:var(--blue);";

  const teamsGrid = (state.teams || []).map(t => {
    const on = d.sel16.includes(t.code);
    const full = count16 >= 16 && !on;
    return `<button type="button" class="team-btn ${on ? "sel" : ""} ${full ? "disabled" : ""}" ${locked || full ? "" : `data-action="toggle" data-stage="sel16" data-code="${t.code}"`}>
      <span class="fl">${tflag(t)}</span>
      <span class="nm">${esc(t.name)}</span>
      ${on ? `<span class="ring"></span><span class="check">✓</span>` : ""}
    </button>`;
  }).join("");

  const champCode = d.winner;
  const champ = champCode ? tm[champCode] : null;
  const champOptions = d.finalists.map(c => {
    const t = tm[c]; const on = d.winner === c;
    return `<button type="button" class="btn ${on ? "btn-primary" : "btn-outline"} btn-sm" style="${on ? "background:var(--gold);color:var(--navy);" : ""}" ${locked ? "" : `data-action="toggle" data-stage="winner" data-code="${c}"`}>${tflag(t)} ${esc(t.name)}</button>`;
  }).join(" ");

  const allComplete = d.sel16.length === 16 && d.quarter.length === 8 && d.semi.length === 4 && d.finalists.length === 2 && d.winner && d.topscorers.length === TOPSCORER_COUNT;

  const lockBanner = deadlinePassed()
    ? (editUnlocked()
        ? `<div class="lockbar" style="background:#EEF1FF;border-color:#C9D2F7;"><span style="font-size:15px;">🔓</span><p>Een beheerder heeft jouw voorspelling <strong>opengezet om te wijzigen</strong> na de deadline. Pas hem aan en lever opnieuw in.</p></div>`
        : `<div class="lockbar"><span style="font-size:15px;">⏰</span><p>De deadline is verstreken — je laatste inzending is <strong>vergrendeld</strong>.</p></div>`)
    : (submitted
        ? `<div class="lockbar" style="background:#E9F7EE;border-color:#BFE6CE;"><span style="font-size:15px;">✅</span><p>Je voorspelling is <strong>ingeleverd</strong> — je kunt hem nog aanpassen tot de deadline. Wijzigingen worden automatisch bewaard.</p></div>`
        : "");

  return renderShell(`
  <div class="page">
    ${renderAdminEditBar()}
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:8px;">
      <div>
        <div class="eyebrow">Stap 1 van 2 · Teams</div>
        <h1 class="display" style="font-size:30px;">Voorspellingen knock-outfase</h1>
      </div>
      <div class="deadpill"><span style="font-size:14px;">⏳</span><span class="t">DEADLINE: ${fmtDeadline(state.settings.deadline).toUpperCase()}</span></div>
    </div>
    ${adminEditing() ? "" : (lockBanner || `<div class="lockbar" style="margin-top:14px;"><span style="font-size:15px;">🛈</span><p>Je kunt je voorspellingen <strong>blijven wijzigen tot de deadline</strong>. Daarna telt automatisch je laatste inzending mee.</p></div>`)}

    <div class="stage-card">
      <div class="stage-head" style="justify-content:space-between;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="stage-badge" style="background:var(--blue);">16</div>
          <div><div class="stage-title">8e finales (laatste 16)</div>
          <div class="stage-sub">Selecteer welke 16 landen de 8e finales halen · <strong style="color:var(--blue);">40 punten</strong> per goed</div></div>
        </div>
        <div class="counter" style="${counterStyle}">${count16} / 16 geselecteerd</div>
      </div>
      <div class="team-grid">${teamsGrid}</div>
    </div>

    <div class="funnel-grid">
      <div class="stage-card" style="margin:0;">
        <div class="stage-head"><div class="stage-badge" style="background:var(--teal);">8</div>
          <div><div class="stage-title">Kwartfinalisten</div><div class="stage-sub"><strong style="color:var(--teal);">80 punten</strong> per goed · kies 8 uit je laatste 16 (${d.quarter.length}/8)</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">${pickList("quarter", d.sel16, 8, "#03B0AA", "#F4FCFB", "#CFEFED")}</div>
      </div>
      <div class="stage-card" style="margin:0;">
        <div class="stage-head"><div class="stage-badge" style="background:var(--green);">4</div>
          <div><div class="stage-title">Halve finalisten</div><div class="stage-sub"><strong style="color:var(--green);">150 punten</strong> per goed · kies 4 uit je 8 (${d.semi.length}/4)</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">${pickList("semi", d.quarter, 4, "#1A9D52", "#F3FBF6", "#C9EAD5")}</div>
      </div>
    </div>

    <div class="funnel-grid">
      <div class="stage-card" style="margin:0;">
        <div class="stage-head"><div class="stage-badge" style="background:var(--orange);">2</div>
          <div><div class="stage-title">Finalisten</div><div class="stage-sub"><strong style="color:var(--orange);">250 punten</strong> per goed · kies 2 uit je 4 (${d.finalists.length}/2)</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">${pickList("finalists", d.semi, 2, "#F0531C", "#FEF6F2", "#F6D3C3")}</div>
      </div>
      <div class="champ-card">
        <div class="stage-head" style="position:relative;z-index:2;"><div class="stage-badge" style="background:var(--gold);color:var(--navy);font-size:18px;">🏆</div>
          <div><div class="stage-title">Wereldkampioen</div><div class="stage-sub" style="color:#c7cee8;"><strong style="color:var(--gold);">400 punten</strong> als je het goed hebt</div></div>
        </div>
        <div class="champ-pick ${champ ? "" : "empty"}" style="position:relative;z-index:2;">
          ${champ
      ? `<span style="font-size:42px;">${tflag(champ)}</span><div><div class="exp" style="font-weight:900;font-size:24px;letter-spacing:-.5px;">${esc(champ.name)}</div><div class="mono" style="font-size:12px;color:var(--gold);">JOUW WERELDKAMPIOEN 2026</div></div>`
      : `<div style="color:#c7cee8;font-size:13.5px;">Kies hieronder je kampioen uit de 2 finalisten.</div>`}
        </div>
        ${d.finalists.length ? `<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;position:relative;z-index:2;">${champOptions}</div>` : ""}
      </div>
    </div>

    ${locked ? "" : `
    ${d.topscorers.length < TOPSCORER_COUNT ? `
    <button type="button" class="topscorer-cta" data-action="nav" data-screen="topscorers">
      <span class="ic">⚽</span>
      <span class="tx"><span class="t1">Stap 2 — kies je ${TOPSCORER_COUNT} topscorers</span><span class="t2">Verplicht om in te leveren · punten per goal o.b.v. positie · (${d.topscorers.length}/${TOPSCORER_COUNT} gekozen)</span></span>
      <span class="ar">→</span>
    </button>` : `
    <div class="topscorer-cta done" data-action="nav" data-screen="topscorers">
      <span class="ic">✓</span>
      <span class="tx"><span class="t1">${adminEditing() ? "De" : "Je"} ${TOPSCORER_COUNT} topscorers zijn gekozen</span><span class="t2">Klik om ze nog te wijzigen</span></span>
      <span class="ar">→</span>
    </div>`}
    ${adminEditing() ? `
    <div class="submitbar">
      <div style="font-size:13px;color:var(--muted);">Je vult in namens <strong>${esc(state.adminEdit.username)}</strong>. Alles wordt automatisch opgeslagen.</div>
      <button type="button" class="btn btn-primary" data-action="admin-finish-edit">✓ Klaar — terug naar admin</button>
    </div>
    ` : `
    <div class="submitbar">
      <div style="font-size:13px;color:var(--muted);">Je voortgang wordt automatisch bewaard. Je kunt tot de deadline blijven wijzigen.</div>
      <div style="display:flex;gap:10px;">
        <button type="button" class="btn btn-outline" data-action="savedraft">Concept opslaan</button>
        <button type="button" class="btn btn-primary" data-action="submitfinal">Definitief inleveren →</button>
      </div>
    </div>
    ${allComplete ? "" : `<p style="font-size:12.5px;color:var(--muted2);margin:12px 2px 0;">Je kunt pas definitief inleveren als alle rondes (16/8/4/2/1) én ${TOPSCORER_COUNT} topscorers zijn ingevuld.</p>`}
    `}
    `}
  </div>`);
}

/* ============================================================
   TOPSCORERS
   ============================================================ */
// Shared filter bar for the pick page ("ts") and the admin goals page ("goal").
function renderPlayerFilters(which, f) {
  const teamOpts = (state.teams || []).slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(t => `<option value="${t.code}" ${f.team === t.code ? "selected" : ""}>${esc(t.name)}</option>`).join("");
  const posOpts = [["K", "Keepers"], ["V", "Verdedigers"], ["M", "Middenvelders"], ["A", "Aanvallers"]]
    .map(([k, l]) => `<option value="${k}" ${f.pos === k ? "selected" : ""}>${l}</option>`).join("");
  const scopes = which === "goal"
    ? [["selected", "🎯 Gekozen"], ["all", "Alle spelers"]]
    : [["popular", "⭐ Populair"], ["all", "Alle spelers"]];
  return `
  <div class="pfbar">
    <div class="pf-seg">
      ${scopes.map(([s, lbl]) => `<button type="button" class="pf-tab ${f.scope === s ? "active" : ""}" data-action="pf-scope" data-which="${which}" data-scope="${s}">${lbl}</button>`).join("")}
    </div>
    ${f.scope === "all" ? `
    <select class="pf-sel" data-action="pf-team" data-which="${which}"><option value="">🌍 Alle landen</option>${teamOpts}</select>
    <select class="pf-sel" data-action="pf-pos" data-which="${which}"><option value="">Alle posities</option>${posOpts}</select>
    <input id="${which}-q" class="pf-q" type="text" placeholder="Zoek op naam of club…" value="${esc(f.q || "")}" data-action="pf-q" data-which="${which}" autocomplete="off">
    ` : ``}
  </div>`;
}

function renderTopscorers() {
  const d = state.draft;
  const pm = playerMap();
  const locked = isLocked();
  const goals = (state.settings.results && state.settings.results.goals) || {};

  const slots = [];
  for (let i = 0; i < TOPSCORER_COUNT; i++) {
    const pid = d.topscorers[i];
    const p = pid ? pm[pid] : null;
    if (p) {
      const g = Number(goals[p.id]) || 0;
      slots.push(`<div class="top3"><div class="slot">KEUZE ${i + 1}</div>
        <div class="av">${pflag(p)}</div>
        <div style="flex:1;"><div class="nm">${esc(p.name)}</div><div class="cl">${esc([p.club, p.posLabel].filter(Boolean).join(" · "))}</div></div>
        <div style="text-align:right;"><div class="pt">${g * goalPointsForPos(p.pos)}</div><div class="gl">${g} GOALS</div></div></div>`);
    } else {
      slots.push(`<div class="top3 empty"><div>Keuze ${i + 1}<br><span style="font-size:11px;">nog leeg</span></div></div>`);
    }
  }

  const filtered = filterPlayerPool(state.players, state.tsFilter);
  const PCAP = 150;
  const moreNote = filtered.length > PCAP ? `<div class="pf-empty" style="margin-top:12px;">Nog ${filtered.length - PCAP} spelers — verfijn met land, positie of zoek.</div>` : "";
  const grid = filtered.slice(0, PCAP).map(p => {
    const chosen = d.topscorers.includes(p.id);
    const full = d.topscorers.length >= TOPSCORER_COUNT && !chosen;
    const g = Number(goals[p.id]) || 0;
    const sub = [p.club, p.posLabel].filter(Boolean).join(" · ");
    return `<button type="button" class="player-card ${chosen ? "chosen" : ""}" ${locked || full ? "" : `data-action="topscorer" data-id="${p.id}"`} ${full ? "style='opacity:.5;cursor:not-allowed;'" : ""}>
      <div class="row"><div class="av">${pflag(p)}</div>
        <div style="flex:1;min-width:0;"><div class="nm">${esc(p.name)}</div><div class="cl">${esc(sub)}</div></div>
      </div>
      <div class="meta"><span class="mt">${g} goals · ${g * goalPointsForPos(p.pos)} pt · ${goalPointsForPos(p.pos)}/goal</span>
        <span class="badge ${chosen ? "on" : ""} ${full ? "disabled" : ""}">${chosen ? "✓ Gekozen" : "+ Kies"}</span>
      </div>
    </button>`;
  }).join("") || `<div class="pf-empty">Geen spelers gevonden — pas je filter aan.</div>`;

  return renderShell(`
  <div class="page">
    ${renderAdminEditBar()}
    <div class="eyebrow">Stap 2 van 2 · Spelers</div>
    <h1 class="display" style="font-size:30px;margin-bottom:6px;">Kies ${adminEditing() ? "de" : "je"} 3 topscorers</h1>
    <p style="font-size:14px;color:var(--muted);margin:0 0 22px;max-width:600px;">Punten per doelpunt in de knock-outfase, <strong style="color:var(--green);">afhankelijk van de positie</strong> van je speler: <strong>keeper/verdediger 80</strong> · <strong>middenvelder 40</strong> · <strong>aanvaller 20</strong> punten per goal. Geen punten voor assists.</p>
    ${adminEditing() ? "" : (isLocked()
      ? `<div class="lockbar"><span style="font-size:15px;">🔒</span><p>De deadline is verstreken — topscorers kunnen niet meer gewijzigd worden.</p></div>`
      : (deadlinePassed() && editUnlocked()
          ? `<div class="lockbar" style="background:#EEF1FF;border-color:#C9D2F7;"><span style="font-size:15px;">🔓</span><p>Een beheerder heeft jouw voorspelling <strong>opengezet om te wijzigen</strong> na de deadline.</p></div>`
          : (state.draft.status === "ingeleverd"
              ? `<div class="lockbar" style="background:#E9F7EE;border-color:#BFE6CE;"><span style="font-size:15px;">✅</span><p>Ingeleverd — je kunt je topscorers nog wijzigen tot de deadline.</p></div>`
              : "")))}
    <div class="top3-grid">${slots.join("")}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin:0 0 12px;">
      <h3 class="section-title" style="margin:0;">Spelers <span style="color:var(--muted2);font-weight:600;">(${d.topscorers.length}/${TOPSCORER_COUNT} gekozen)</span></h3>
      ${adminEditing()
        ? `<button type="button" class="btn btn-primary btn-sm" style="padding:9px 16px;" data-action="admin-finish-edit">✓ Klaar</button>`
        : (isLocked() ? "" : `<button type="button" class="btn btn-primary btn-sm" style="padding:9px 16px;" data-action="savedraft">Concept opslaan</button>`)}
    </div>
    ${renderPlayerFilters("ts", state.tsFilter)}
    <div class="player-grid">${grid}</div>${moreNote}
  </div>`);
}

/* ============================================================
   KLASSEMENT
   ============================================================ */
function renderKlassement() {
  const board = state.leaderboard || [];
  const pz = prizes();
  const medals = ["🥇", "🥈", "🥉"];
  const podBg = ["#FFFBEF", "#FBFAF5", "#FCF6F0"];
  const podBorder = ["#E8B43A", "#C9C4B5", "#D9A06A"];

  const canPeek = canSeeOtherEntries();
  const peekAttr = r => canPeek ? `data-action="view-user" data-id="${r.id}"` : "";

  const podium = board.slice(0, 3).map((r, i) => `
    <div class="podium ${i === 0 ? "first" : ""} ${canPeek ? "clickable" : ""}" style="background:${podBg[i]};border:1.5px solid ${podBorder[i]};" ${peekAttr(r)}>
      <div class="medal">${medals[i]}</div>
      <div class="av" style="background:${colorFor(r.name)};">${initial(r.name)}</div>
      <div class="nm">${esc(r.name)}</div>
      <div class="tot">${r.total}</div>
      <div class="prize">${pz[i] != null ? "€" + fmtEuro(pz[i]) : "—"}</div>
    </div>`).join("");

  const boardRow = (r, rank) => `
    <div class="board-row ${r.id === state.session.id ? "me" : ""} ${canPeek ? "clickable" : ""}" ${peekAttr(r)}>
      <div class="rk" style="color:${rank <= 3 ? "var(--gold)" : "#c2bdb0"};">${rank}</div>
      <div class="who">
        <div class="av" style="background:${colorFor(r.name)};">${initial(r.name)}</div>
        <span class="nm">${esc(r.name)}</span>
        ${r.id === state.session.id ? `<span class="tag-me">JIJ</span>` : ""}
        ${canPeek ? `<span class="peek-ic" title="Bekijk voorspelling">👁</span>` : ""}
      </div>
      <div class="num">${r.g}</div>
      <div class="num">${r.k}</div>
      <div class="num">${r.t}</div>
      <div class="tot">${r.total}</div>
    </div>`;

  const rows = board.map(r => boardRow(r, r.rank)).join("");

  // Final group-phase standings — compact: just the group-phase points.
  const groupBoard = board.slice().sort((a, b) => b.g - a.g || a.name.localeCompare(b.name));
  const groupRows = groupBoard.map((r, i) => `
    <div class="board-row ${r.id === state.session.id ? "me" : ""} ${canPeek ? "clickable" : ""}" ${peekAttr(r)}>
      <div class="rk" style="color:${i < 3 ? "var(--gold)" : "#c2bdb0"};">${i + 1}</div>
      <div class="who">
        <div class="av" style="background:${colorFor(r.name)};">${initial(r.name)}</div>
        <span class="nm">${esc(r.name)}</span>
        ${r.id === state.session.id ? `<span class="tag-me">JIJ</span>` : ""}
        ${canPeek ? `<span class="peek-ic" title="Bekijk voorspelling">👁</span>` : ""}
      </div>
      <div class="tot">${r.g}</div>
    </div>`).join("");

  const headRow = `<div class="board-head"><div>Pos</div><div>Deelnemer</div><div style="text-align:right;">Groepsf.</div><div style="text-align:right;">Knock-out</div><div style="text-align:right;">Topsc.</div><div style="text-align:right;">Totaal</div></div>`;
  const groupHeadRow = `<div class="board-head"><div>Pos</div><div>Deelnemer</div><div style="text-align:right;">Groepsfase</div></div>`;

  return renderShell(`
  <div class="page">
    <div class="eyebrow">Eindklassement · Live</div>
    <h1 class="display" style="font-size:30px;margin-bottom:22px;">Klassement</h1>
    ${canPeek
      ? `<div class="peek-hint"><span style="font-size:15px;">👁</span><p>De deadline is verstreken — <strong>tik op een deelnemer</strong> om te zien wat hij/zij heeft voorspeld.</p></div>`
      : `<div class="peek-hint locked"><span style="font-size:15px;">🔒</span><p>De voorspellingen van anderen worden zichtbaar <strong>zodra de deadline verstrijkt</strong>.</p></div>`}
    ${board.length >= 3 ? `<div class="podium-grid">${podium}</div>` : ""}
    <div class="board">
      ${headRow}
      ${rows || `<div class="empty-state" style="border:none;">Nog geen deelnemers in het klassement.</div>`}
    </div>
    <p style="font-size:12.5px;color:var(--muted2);margin:14px 2px 0;">Eindscore = stand na groepsfase + knock-out punten + topscorers. Punten verschijnen zodra een admin de uitslagen invult.</p>

    ${board.length ? `
    <h3 class="section-title" style="margin:38px 0 14px;">Eindstand groepsfase</h3>
    <div class="board board-compact">
      ${groupHeadRow}
      ${groupRows}
    </div>
    <p style="font-size:12.5px;color:var(--muted2);margin:14px 2px 0;">De stand zoals die na de groepsfase vaststond — de startpunten waarmee iedereen aan de knock-outpool begint.</p>
    ` : ""}
  </div>`);
}

/* ============================================================
   MIJN VOORSPELLINGEN
   ============================================================ */
function chipFlags(codes, bg, border) {
  const tm = teamMap();
  if (!codes.length) return `<span style="font-size:12.5px;color:var(--muted2);">— nog niet ingevuld —</span>`;
  return codes.map(c => { const t = tm[c]; return t ? `<span class="chip-flag" style="background:${bg};border:1px solid ${border};">${tflag(t)} ${esc(t.name)}</span>` : ""; }).join("");
}
function renderMijn() {
  const d = state.draft;
  const me = state.me || { g: 0, k: 0, t: 0, total: 0 };
  const tm = teamMap(), pm = playerMap();
  const submitted = d.status === "ingeleverd";
  const finalNow = effectiveSubmitted();      // submitted OR deadline passed
  const statusCls = editUnlocked() && finalNow ? "status-concept" : (finalNow ? "status-done" : "status-concept");
  const statusTxt = editUnlocked() && finalNow ? "BEWERKEN OPENGEZET 🔓"
    : submitted ? "INGELEVERD ✓"
    : deadlinePassed() ? "DEFINITIEF · LAATSTE CONCEPT"
    : "CONCEPT · NOG NIET INGELEVERD";
  const goals = (state.settings.results && state.settings.results.goals) || {};

  const sel16 = d.sel16.map(c => { const t = tm[c]; return t ? `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;background:#F7F8FF;border:1px solid #DCE1FB;border-radius:11px;padding:10px 4px;"><span style="font-size:22px;">${tflag(t)}</span><span style="font-size:10px;font-weight:700;text-align:center;line-height:1.1;color:#3a3d45;">${esc(t.name)}</span></div>` : ""; }).join("") || `<div style="grid-column:1/-1;color:var(--muted2);font-size:13px;">Nog geen teams gekozen.</div>`;

  const champ = d.winner ? tm[d.winner] : null;
  const tops = d.topscorers.map(pid => { const p = pm[pid]; if (!p) return ""; const g = Number(goals[p.id]) || 0;
    return `<div style="display:flex;align-items:center;gap:12px;border:1px solid var(--border);border-radius:12px;padding:12px 14px;"><div style="width:42px;height:42px;border-radius:50%;background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:21px;flex:none;">${pflag(p)}</div><div style="flex:1;"><div class="exp" style="font-weight:800;font-size:14.5px;">${esc(p.name)}</div><div style="font-size:12px;color:var(--muted2);">${esc([p.club, p.posLabel].filter(Boolean).join(" · "))}</div></div><div style="text-align:right;"><div class="exp" style="font-weight:900;font-size:18px;color:var(--green);">${g * goalPointsForPos(p.pos)}</div><div class="mono" style="font-size:9px;color:var(--muted2);">${g} GOALS · ${goalPointsForPos(p.pos)}/G</div></div></div>`; }).join("") || `<span style="font-size:12.5px;color:var(--muted2);">Nog geen topscorers gekozen.</span>`;

  return renderShell(`
  <div class="page">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px;">
      <div><div class="eyebrow">Profiel · ${esc(state.session.username)}</div><h1 class="display" style="font-size:30px;">Mijn voorspellingen</h1></div>
      <div class="statusline ${statusCls}"><span class="dot"></span><span class="t">${statusTxt}</span></div>
    </div>

    <div class="stat-grid">
      <div class="minicard"><div class="lbl">GROEPSFASE</div><div class="v">${me.g}</div></div>
      <div class="minicard"><div class="lbl">KNOCK-OUT</div><div class="v" style="color:var(--blue);">${me.k}</div></div>
      <div class="minicard"><div class="lbl">TOPSCORERS</div><div class="v" style="color:var(--green);">${me.t}</div></div>
      <div class="minicard dark"><div class="lbl">TOTAAL</div><div class="v" style="color:var(--lime);">${me.total}</div></div>
    </div>

    <div class="card card-pad" style="margin-bottom:20px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h3 class="section-title" style="margin:0;">Mijn laatste 16</h3>
        ${isLocked() ? "" : `<button type="button" class="btn-ghost btn" style="color:var(--blue);font-weight:700;font-size:13px;padding:0;" data-action="nav" data-screen="voorspellingen">Wijzigen →</button>`}
      </div>
      <div class="team-grid">${sel16}</div>
    </div>

    <div class="two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="card card-pad">
        <h3 class="section-title" style="margin:0 0 16px;">Mijn knock-out pad</h3>
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div><div class="mono" style="font-size:10px;color:var(--muted2);letter-spacing:1px;margin-bottom:7px;">KWARTFINALISTEN (8)</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${chipFlags(d.quarter, "#F4FCFB", "#CFEFED")}</div></div>
          <div><div class="mono" style="font-size:10px;color:var(--muted2);letter-spacing:1px;margin-bottom:7px;">HALVE FINALISTEN (4)</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${chipFlags(d.semi, "#F3FBF6", "#C9EAD5")}</div></div>
          <div><div class="mono" style="font-size:10px;color:var(--muted2);letter-spacing:1px;margin-bottom:7px;">FINALISTEN (2)</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${chipFlags(d.finalists, "#FEF6F2", "#F6D3C3")}</div></div>
          <div style="display:flex;align-items:center;gap:11px;background:var(--navy);border-radius:12px;padding:13px 15px;color:#fff;"><span style="font-size:28px;">${champ ? tflag(champ) : "🏆"}</span><div><div class="mono" style="font-size:9px;color:var(--gold);letter-spacing:1px;">WERELDKAMPIOEN</div><div class="exp" style="font-weight:800;font-size:17px;">${champ ? esc(champ.name) : "— nog niet gekozen —"}</div></div></div>
        </div>
      </div>
      <div class="card card-pad">
        <h3 class="section-title" style="margin:0 0 16px;">Mijn topscorers</h3>
        <div style="display:flex;flex-direction:column;gap:10px;">${tops}</div>
        ${isLocked() ? "" : `<button type="button" class="btn btn-outline btn-block" style="margin-top:14px;" data-action="nav" data-screen="topscorers">Topscorers wijzigen →</button>`}
      </div>
    </div>
  </div>`);
}

/* ============================================================
   REGLEMENT
   ============================================================ */
function renderReglement() {
  const pz = prizes();
  const pct = (state.settings.prize_pct) || [70, 20, 10];
  const ko = KO_STAGES.map(st => `
    <div class="ko-row"><span class="swatch" style="background:${st.color};"></span>
      <span class="lab">${st.label}</span>
      <span class="per" style="color:${st.color};">${st.points} pt</span>
      <span style="font-size:12px;color:var(--muted2);width:64px;text-align:right;">per goed</span>
    </div>`).join("");

  return renderShell(`
  <div class="page-narrow">
    <div class="eyebrow">🏆 GDWKP26</div>
    <h1 class="display" style="font-size:32px;margin-bottom:6px;">Reglement WK-pool — Knock-outfase</h1>
    <p style="font-size:14px;color:var(--muted);margin:0 0 30px;">De stand na de groepsfase (t/m zondag 21 juni, inclusief België – Iran) vormt de startstand. Punten uit deze fase blijven staan en tellen volledig mee in het eindklassement.</p>

    <div class="reg-card"><div class="reg-head"><div class="reg-num" style="background:var(--blue);">1</div>
      <div><h3>Voorspellingen knock-outfase</h3><p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#3a3d45;">Vóór de start van de knock-outfase levert iedere deelnemer éénmalig zijn voorspellingen in. Te voorspellen: de 16 teams die de 8e finales halen, de 8 kwartfinalisten, de 4 halve finalisten, de 2 finalisten en de wereldkampioen.</p><p style="margin:0;font-size:13px;color:#A52121;"><strong>Let op:</strong> je kunt je voorspelling wijzigen tot de deadline. Daarna telt automatisch je laatste inzending — na de deadline zijn wijzigingen niet meer mogelijk (tenzij een beheerder dit op verzoek openzet).</p></div>
    </div></div>

    <div class="reg-card"><div class="reg-head"><div class="reg-num" style="background:var(--blue);">2</div>
      <div style="flex:1;"><h3 style="margin-bottom:14px;">Puntentelling knock-outfase</h3><div style="display:flex;flex-direction:column;gap:8px;">${ko}</div></div>
    </div></div>

    <div class="reg-card"><div class="reg-head"><div class="reg-num" style="background:var(--green);">3</div>
      <div><h3>Topscorers</h3><p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#3a3d45;">Iedere deelnemer kiest <strong>3 topscorers</strong>. Je krijgt punten per doelpunt dat een gekozen speler maakt in de knock-outfase, <strong>afhankelijk van zijn positie</strong>:</p><ul style="margin:0 0 10px;padding-left:18px;font-size:13.5px;line-height:1.7;color:var(--muted);"><li><strong style="color:var(--green);">Keeper &amp; verdediger:</strong> 80 punten per doelpunt</li><li><strong style="color:var(--green);">Middenvelder:</strong> 40 punten per doelpunt</li><li><strong style="color:var(--green);">Aanvaller:</strong> 20 punten per doelpunt</li></ul><ul style="margin:0;padding-left:18px;font-size:13.5px;line-height:1.7;color:var(--muted);"><li>Alleen doelpunten in de knock-outfase tellen mee</li><li>Geen punten voor assists of andere statistieken</li></ul></div>
    </div></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;" class="two-col">
      <div style="background:var(--navy);border-radius:18px;padding:24px;color:#fff;">
        <div style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-family:var(--exp);font-weight:900;font-size:14px;margin-bottom:12px;">4</div>
        <h3 class="exp" style="font-weight:800;font-size:16px;margin:0 0 8px;">Eindstand</h3>
        <p style="margin:0;font-size:13.5px;line-height:1.6;color:#c7cee8;">Eindscore = stand na groepsfase <strong style="color:#fff;">+</strong> punten knock-out <strong style="color:#fff;">+</strong> topscorers. Wie de meeste punten heeft, wint de pool.</p>
      </div>
      <div style="background:var(--teal);border-radius:18px;padding:24px;color:#fff;">
        <div style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;font-size:15px;margin-bottom:12px;">💶</div>
        <h3 class="exp" style="font-weight:800;font-size:16px;margin:0 0 10px;">Prijzenpot · €${fmtEuro(entryFee())} inleg p.p.</h3>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;">
          ${pct.map((p, i) => `<div style="display:flex;justify-content:space-between;"><span>${["🥇", "🥈", "🥉"][i] || "🏅"} ${i + 1}e plaats (${fmtNum(p)}%)</span><strong>€${fmtEuro(pz[i])}</strong></div>`).join("")}
        </div>
        <div style="margin-top:12px;font-size:12px;color:#d8f6f4;">Totale pot: €${fmtEuro(pot())} · ${participants()} deelnemers</div>
      </div>
    </div>
  </div>`);
}

/* ------------------------------------------------------------
   Read-only modal with everything one participant filled in (knock-out picks
   per round + their topscorers). Admins open it from the "Deelnemers beheren"
   list (and can edit from here); everyone can open it from the leaderboard once
   the deadline has passed, to see what others chose.
   ------------------------------------------------------------ */
function renderUserDetailModal() {
  const uid = state.viewUserId;
  if (!uid) return "";
  const u = (state.users || []).find(x => x.id === uid);
  if (!u) return "";
  const isAdmin = !!(state.session && state.session.is_admin);

  const predBy = {}; (state.predictions || []).forEach(p => predBy[p.user_id] = p);
  const d = predBy[uid] || emptyPrediction(uid);
  const row = (state.leaderboard || []).find(r => r.id === uid) || { g: 0, k: 0, t: 0, total: 0 };
  const tm = teamMap(), pm = playerMap();
  const goals = (state.settings.results && state.settings.results.goals) || {};

  const submitted = d.status === "ingeleverd";
  const finalNow = submitted || deadlinePassed();
  const statusCls = finalNow ? "status-done" : "status-concept";
  const statusTxt = submitted ? "INGELEVERD ✓"
    : deadlinePassed() ? "DEFINITIEF · LAATSTE CONCEPT"
    : "CONCEPT · NIET INGELEVERD";

  const sel16 = d.sel16.map(c => { const t = tm[c]; return t
    ? `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;background:#F7F8FF;border:1px solid #DCE1FB;border-radius:11px;padding:10px 4px;"><span style="font-size:22px;">${tflag(t)}</span><span style="font-size:10px;font-weight:700;text-align:center;line-height:1.1;color:#3a3d45;">${esc(t.name)}</span></div>`
    : ""; }).join("")
    || `<div style="grid-column:1/-1;color:var(--muted2);font-size:13px;padding:6px 2px;">— geen teams gekozen —</div>`;

  const champ = d.winner ? tm[d.winner] : null;

  const tops = d.topscorers.map(pid => { const p = pm[pid]; if (!p) return ""; const g = Number(goals[p.id]) || 0;
    return `<div style="display:flex;align-items:center;gap:12px;border:1px solid var(--border);border-radius:12px;padding:11px 13px;"><div style="width:40px;height:40px;border-radius:50%;background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:20px;flex:none;">${pflag(p)}</div><div style="flex:1;min-width:0;"><div class="exp" style="font-weight:800;font-size:14px;">${esc(p.name)}</div><div style="font-size:12px;color:var(--muted2);">${esc([p.country, p.club, p.posLabel].filter(Boolean).join(" · "))}</div></div><div style="text-align:right;flex:none;"><div class="exp" style="font-weight:900;font-size:17px;color:var(--green);">${g * goalPointsForPos(p.pos)}</div><div class="mono" style="font-size:9px;color:var(--muted2);">${g} GOALS · ${goalPointsForPos(p.pos)}/G</div></div></div>`;
    }).join("")
    || `<span style="font-size:12.5px;color:var(--muted2);">— geen topscorers gekozen —</span>`;

  return `
  <div class="modal-back">
    <div class="detail-overlay" data-action="admin-view-close"></div>
    <div class="modal modal-detail">
      <button type="button" class="detail-close" data-action="admin-view-close" aria-label="Sluiten" title="Sluiten (Esc)">✕</button>
      <div class="detail-head">
        <div class="av" style="width:48px;height:48px;border-radius:50%;background:${colorFor(u.username)};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:19px;flex:none;">${initial(u.username)}</div>
        <div style="flex:1;min-width:0;">
          <div class="eyebrow" style="margin:0;">Inzending deelnemer</div>
          <h3 class="exp" style="font-weight:900;font-size:21px;margin:2px 0 0;">${esc(u.username)}</h3>
        </div>
        <div class="statusline ${statusCls}" style="flex:none;"><span class="dot"></span><span class="t">${statusTxt}</span></div>
      </div>

      <div class="stat-grid" style="margin:18px 0 4px;">
        <div class="minicard"><div class="lbl">GROEPSFASE</div><div class="v">${row.g}</div></div>
        <div class="minicard"><div class="lbl">KNOCK-OUT</div><div class="v" style="color:var(--blue);">${row.k}</div></div>
        <div class="minicard"><div class="lbl">TOPSCORERS</div><div class="v" style="color:var(--green);">${row.t}</div></div>
        <div class="minicard dark"><div class="lbl">TOTAAL</div><div class="v" style="color:var(--lime);">${row.total}</div></div>
      </div>

      <h4 class="detail-section-title">Laatste 16 <span>(${d.sel16.length}/16)</span></h4>
      <div class="team-grid">${sel16}</div>

      <h4 class="detail-section-title">Knock-out pad</h4>
      <div style="display:flex;flex-direction:column;gap:13px;">
        <div><div class="mono" style="font-size:10px;color:var(--muted2);letter-spacing:1px;margin-bottom:6px;">KWARTFINALISTEN (${d.quarter.length}/8)</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${chipFlags(d.quarter, "#F4FCFB", "#CFEFED")}</div></div>
        <div><div class="mono" style="font-size:10px;color:var(--muted2);letter-spacing:1px;margin-bottom:6px;">HALVE FINALISTEN (${d.semi.length}/4)</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${chipFlags(d.semi, "#F3FBF6", "#C9EAD5")}</div></div>
        <div><div class="mono" style="font-size:10px;color:var(--muted2);letter-spacing:1px;margin-bottom:6px;">FINALISTEN (${d.finalists.length}/2)</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${chipFlags(d.finalists, "#FEF6F2", "#F6D3C3")}</div></div>
        <div style="display:flex;align-items:center;gap:11px;background:var(--navy);border-radius:12px;padding:12px 15px;color:#fff;"><span style="font-size:26px;">${champ ? tflag(champ) : "🏆"}</span><div><div class="mono" style="font-size:9px;color:var(--gold);letter-spacing:1px;">WERELDKAMPIOEN</div><div class="exp" style="font-weight:800;font-size:16px;">${champ ? esc(champ.name) : "— nog niet gekozen —"}</div></div></div>
      </div>

      <h4 class="detail-section-title">Topscorers <span>(${d.topscorers.length}/${TOPSCORER_COUNT})</span></h4>
      <div style="display:flex;flex-direction:column;gap:9px;">${tops}</div>
      ${isAdmin ? `
      <div class="detail-actions">
        ${(d.sel16.length === 16 && d.quarter.length === 8 && d.semi.length === 4 && d.finalists.length === 2 && d.winner && d.topscorers.length === TOPSCORER_COUNT)
          ? `<span class="detail-actions-hint done">✓ Volledig ingevuld</span>`
          : `<span class="detail-actions-hint warn">⚠ Nog niet compleet</span>`}
        <button type="button" class="btn btn-dark" data-action="admin-edit-start" data-id="${uid}">✏️ Invullen / bewerken</button>
      </div>
      <p class="detail-actions-note">Als beheerder vul je dit in namens ${esc(u.username)} — ook ná de deadline. De deelnemer kan zelf niets meer wijzigen. Elke bewerking komt in het logboek.</p>
      ` : ""}
    </div>
  </div>`;
}

// Audit trail of admin actions, so multiple admins can see who did what.
function fmtLogWhen(iso) {
  const dt = new Date(iso);
  const now = new Date();
  const time = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
  if (dt.toDateString() === now.toDateString()) return `vandaag ${time}`;
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (dt.toDateString() === y.toDateString()) return `gisteren ${time}`;
  const days = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const mon = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  return `${days[dt.getDay()]} ${dt.getDate()} ${mon[dt.getMonth()]} · ${time}`;
}
function renderAdminLog() {
  const log = state.adminLog || [];
  const items = log.map(a => `
    <div class="log-item">
      <div class="log-av" style="background:${colorFor(a.admin_name || "?")};">${initial(a.admin_name)}</div>
      <div class="log-body">
        <div class="log-line"><strong>${esc(a.admin_name)}</strong> <span class="log-act">${esc(a.action)}</span>${a.target_name ? ` <span class="log-tgt">${esc(a.target_name)}</span>` : ""}</div>
        ${a.detail ? `<div class="log-detail">${esc(a.detail)}</div>` : ""}
      </div>
      <div class="log-when">${fmtLogWhen(a.created_at)}</div>
    </div>`).join("") || `<div class="pf-empty">Nog geen acties gelogd. Zodra een beheerder iets doet (bv. iemands voorspelling invullen), verschijnt het hier.</div>`;
  return `
    <div class="admin-section">
      <h3 class="section-title">Logboek <span style="font-weight:600;color:var(--muted2);font-size:13px;">— wat beheerders al deden (zodat jullie elkaar niet overlappen)</span></h3>
      <div class="log-list">${items}</div>
    </div>`;
}

/* ============================================================
   ADMIN
   ============================================================ */
function renderAdmin() {
  const users = state.users || [];
  const preds = {}; (state.predictions || []).forEach(p => preds[p.user_id] = p);
  const submitted = users.filter(u => (preds[u.id] || {}).status === "ingeleverd").length;
  const paid = users.filter(u => u.paid).length;
  const res = state.settings.results || { round16: [], quarter: [], semi: [], finalists: [], winner: null, goals: {} };
  const pct = state.settings.prize_pct || [70, 20, 10];
  const tm = teamMap();

  const rows = users.map(u => {
    const p = preds[u.id] || {};
    const sub = p.status === "ingeleverd";
    const unclaimed = u.claimed === false;
    const subLabel = unclaimed
      ? `<div class="mono" style="font-size:10px;color:var(--orange);">nog niet geregistreerd</div>`
      : `<div class="mono" style="font-size:11px;color:var(--muted2);">${new Date(u.created_at).toLocaleDateString("nl-NL")}</div>`;
    return `<div class="admin-grid admin-row">
      <div class="admin-who" data-action="admin-view" data-id="${u.id}" title="Bekijk alles wat ${esc(u.username)} heeft ingevuld" style="display:flex;align-items:center;gap:11px;cursor:pointer;"><div class="av" style="width:32px;height:32px;border-radius:50%;background:${colorFor(u.username)};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;">${initial(u.username)}</div>
        <div><div style="font-weight:700;font-size:14px;display:flex;align-items:center;gap:6px;">${esc(u.username)}<span class="admin-who-eye">👁</span></div>${subLabel}</div></div>
      <div><span class="chip ${u.is_admin ? "chip-admin" : "chip-user"}">${u.is_admin ? "Admin" : "Deelnemer"}</span></div>
      <div class="col-hide"><span class="chip ${u.paid ? "chip-yes" : "chip-no"}" data-action="admin-paid" data-id="${u.id}">${u.paid ? "Betaald" : "Open"}</span></div>
      <div class="col-hide" style="display:flex;flex-direction:column;gap:5px;align-items:flex-start;">
        <span class="chip ${sub ? "chip-yes" : "chip-no"}" style="cursor:default;">${sub ? "Ingeleverd" : "Concept"}</span>
        <span class="chip ${u.edit_unlocked ? "chip-edit-on" : "chip-edit-off"}" data-action="admin-editunlock" data-id="${u.id}" title="Geef deze deelnemer toestemming om na inleveren te wijzigen">${u.edit_unlocked ? "🔓 Wijzigen aan" : "🔒 Wijzigen uit"}</span>
      </div>
      <div class="col-hide"><input class="gp-input" type="number" value="${Number(u.group_points) || 0}" data-action="admin-gp" data-id="${u.id}" title="Groepsfase punten"></div>
      <div style="display:flex;gap:7px;justify-content:flex-end;">
        <button type="button" class="btn btn-dark btn-sm" data-action="admin-view" data-id="${u.id}">Bekijk</button>
        <button type="button" class="btn btn-outline btn-sm" data-action="admin-role" data-id="${u.id}">${u.is_admin ? "Beheer afnemen" : "Maak admin"}</button>
        ${unclaimed ? "" : `<button type="button" class="btn btn-outline btn-sm" data-action="admin-reset" data-id="${u.id}" data-name="${esc(u.username)}" title="Wachtwoord resetten — account komt weer vrij in het registermenu">Reset</button>`}
        <button type="button" class="btn btn-danger btn-sm" data-action="admin-delete" data-id="${u.id}" data-name="${esc(u.username)}">Verwijder</button>
      </div>
    </div>`;
  }).join("");

  const stageResultBlock = KO_STAGES.filter(s => s.key !== "winner").map(st => {
    const picked = res[st.key] || [];
    const opts = (state.teams || []).map(t => {
      const on = picked.includes(t.code);
      return `<button type="button" class="res-btn ${on ? "on" : ""}" data-action="admin-result" data-stage="${st.key}" data-code="${t.code}"><span class="fl">${tflag(t)}</span>${esc(t.code)}</button>`;
    }).join("");
    return `<div style="margin-bottom:16px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span class="swatch" style="width:8px;height:18px;border-radius:4px;background:${st.color};display:inline-block;"></span><strong style="font-size:13.5px;">${st.short}</strong> <span style="font-size:12px;color:var(--muted2);">(${picked.length}/${st.count} · ${st.points} pt)</span></div><div class="results-grid">${opts}</div></div>`;
  }).join("");

  const winnerOpts = (state.teams || []).map(t => `<button type="button" class="btn ${res.winner === t.code ? "btn-primary" : "btn-outline"} btn-sm" style="${res.winner === t.code ? "background:var(--gold);color:var(--navy);" : ""}margin:0 6px 6px 0;" data-action="admin-winner" data-code="${t.code}">${tflag(t)} ${esc(t.code)}</button>`).join("");

  // Players actually chosen by participants (so the admin only scores those).
  const chosenSet = new Set();
  (state.predictions || []).forEach(p => (p.topscorers || []).forEach(id => chosenSet.add(id)));
  const pmGoals = playerMap();
  let goalPlayersAll;
  if (state.goalFilter.scope === "selected") {
    goalPlayersAll = [...chosenSet].map(id => pmGoals[id]).filter(Boolean)
      .sort((a, b) => (Number((res.goals || {})[b.id]) || 0) - (Number((res.goals || {})[a.id]) || 0) || a.name.localeCompare(b.name));
  } else {
    goalPlayersAll = filterPlayerPool(state.players, state.goalFilter);
  }
  const GCAP = 150;
  const goalMoreNote = goalPlayersAll.length > GCAP ? `<div class="pf-empty" style="margin-top:10px;">Nog ${goalPlayersAll.length - GCAP} spelers — verfijn met land, positie of zoek.</div>` : "";
  const goalEmpty = state.goalFilter.scope === "selected"
    ? `<div class="pf-empty">Nog geen topscorers gekozen door deelnemers. Zodra iemand spelers kiest, verschijnen ze hier automatisch. (Of kies "Alle spelers".)</div>`
    : `<div class="pf-empty">Geen spelers gevonden — pas je filter aan.</div>`;
  const goalRows = goalPlayersAll.slice(0, GCAP).map(p => `<div class="goal-row"><span style="font-size:13.5px;">${pflag(p)} ${esc(p.name)} <span style="color:var(--muted2);font-size:12px;">· ${esc([p.club, p.posLabel].filter(Boolean).join(" · "))}</span></span><input class="gp-input" style="text-align:center;" type="number" min="0" value="${Number((res.goals || {})[p.id]) || 0}" data-action="admin-goal" data-id="${p.id}" title="Doelpunten in knock-out"></div>`).join("")
    || goalEmpty;

  // Only hand-added (custom) players are listed here; the full WC squad pool is built in.
  const customPlayers = state.settings.players || [];
  const playerList = customPlayers.map(p => `<span class="chip chip-user" style="margin:0 6px 6px 0;">${pflag(p)} ${esc(p.name)} <button type="button" style="border:none;background:none;color:#C53030;cursor:pointer;font-weight:800;" data-action="admin-del-player" data-id="${p.id}" title="Verwijder">×</button></span>`).join("");
  const teamSelOpts = (state.teams || []).slice().sort((a, b) => a.name.localeCompare(b.name)).map(t => `<option value="${t.code}">${esc(t.name)}</option>`).join("");
  const teamList = (state.teams || []).map(t => `<span class="chip chip-user" style="margin:0 6px 6px 0;">${tflag(t)} ${esc(t.code)} <button type="button" style="border:none;background:none;color:#C53030;cursor:pointer;font-weight:800;" data-action="admin-del-team" data-code="${t.code}" title="Verwijder">×</button></span>`).join("");

  const dlValue = state.settings.deadline ? new Date(new Date(state.settings.deadline).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";

  // ----- prize-split editor -----
  if (!state.prizeEdit) state.prizeEdit = { pct: prizePct().slice() };
  const pe = state.prizeEdit;
  const peSum = pe.pct.reduce((a, b) => a + (Number(b) || 0), 0);
  const sumOk = Math.abs(peSum - 100) < 0.05;
  const medalFor = i => (["🥇", "🥈", "🥉"][i] || `${i + 1}e`);
  const countBtns = [1, 2, 3, 4, 5, 6].map(n =>
    `<button type="button" class="pf-tab ${pe.pct.length === n ? "active" : ""}" data-action="prize-count" data-n="${n}">${n}</button>`).join("");
  const prizeRows = pe.pct.map((v, i) => `
    <div class="prize-row">
      <div class="prize-rank">${medalFor(i)} <span>${i + 1}e</span></div>
      <input type="range" class="prize-slider" min="0" max="100" step="0.5" value="${v}" data-action="prize-slider" data-i="${i}">
      <div class="prize-num-wrap"><input type="number" class="prize-num" min="0" max="100" step="0.1" value="${v}" data-action="prize-num" data-i="${i}"><span>%</span></div>
      <span class="prize-amt" data-amt="${i}">€${fmtEuro(pot() * v / 100)}</span>
    </div>`).join("");

  return renderShell(`
  <div class="page">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px;">
      <div><div class="eyebrow">Beheer · alleen voor admins</div><h1 class="display" style="font-size:30px;">Admin</h1></div>
      <button type="button" class="btn btn-outline btn-sm" data-action="admin-refresh">↻ Vernieuwen</button>
    </div>

    <div class="stat-grid">
      <div class="minicard"><div class="lbl">DEELNEMERS</div><div class="v">${users.length}</div></div>
      <div class="minicard"><div class="lbl">INGELEVERD</div><div class="v" style="color:var(--green);">${submitted}<span style="font-size:14px;color:var(--muted2);font-weight:600;"> / ${users.length}</span></div></div>
      <div class="minicard"><div class="lbl">BETAALD</div><div class="v" style="color:var(--teal);">${paid}<span style="font-size:14px;color:var(--muted2);font-weight:600;"> / ${users.length}</span></div></div>
      <div class="minicard"><div class="lbl">IN KAS</div><div class="v">€${paid * entryFee()}</div></div>
    </div>

    <div class="admin-section">
      <h3 class="section-title">Pool-instellingen</h3>
      <div class="inline-form" style="margin-bottom:14px;">
        <label style="font-size:13px;font-weight:700;">Inlever-deadline</label>
        <input type="datetime-local" id="adm-deadline" value="${dlValue}">
        <button type="button" class="btn btn-dark btn-sm" data-action="admin-deadline">Deadline opslaan</button>
        <span style="font-size:12.5px;color:var(--muted);">Huidig: ${fmtDeadline(state.settings.deadline)}</span>
      </div>
      <div class="inline-form" style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:700;">Inleg p.p. €</label>
        <input type="number" id="adm-fee" value="${entryFee()}" style="width:90px;" step="0.5" min="0">
        <span style="font-size:12.5px;color:var(--muted);">Pot: <strong>€${fmtEuro(pot())}</strong> (${participants()} × €${fmtEuro(entryFee())})</span>
      </div>

      <div class="prize-head">
        <span style="font-size:13px;font-weight:700;">Aantal prijzen</span>
        <div class="pf-seg">${countBtns}</div>
        <button type="button" class="btn btn-outline btn-sm" data-action="prize-even">Gelijk verdelen</button>
        <span class="prize-sum ${sumOk ? "ok" : "bad"}" id="prize-sum">Totaal: ${fmtNum(peSum)}%</span>
      </div>
      <div class="prize-rows">${prizeRows}</div>
      <button type="button" class="btn btn-dark btn-sm" style="margin-top:12px;" data-action="admin-prizes">Inleg &amp; prijsverdeling opslaan</button>
      <div style="font-size:12px;color:var(--muted2);margin-top:8px;">Sleep de balk of typ een percentage (decimalen mogen, bv. 33,3). Samen exact 100%.</div>
    </div>

    <div class="admin-section" style="padding:0;overflow:hidden;">
      <div style="padding:18px 20px 0;"><h3 class="section-title">Deelnemers beheren</h3></div>
      <div class="admin-grid admin-head"><div>Deelnemer</div><div>Rol</div><div class="col-hide">Inleg</div><div class="col-hide">Voorspelling</div><div class="col-hide">Groepsf.</div><div style="text-align:right;">Acties</div></div>
      ${rows || `<div style="padding:20px;color:var(--muted2);">Nog geen deelnemers.</div>`}
      <p style="font-size:12.5px;color:var(--muted2);margin:0;padding:14px 20px;">Tik op een deelnemer (of <strong>Bekijk</strong>) om hun volledige inzending te zien; daar kun je als beheerder ook hun voorspelling <strong>invullen of bewerken namens hen</strong> — ook ná de deadline. Tik op de <strong>inleg-chip</strong> om Betaald/Open te wisselen en op de <strong>🔒 Wijzigen-chip</strong> om een deelnemer (op verzoek) zijn voorspelling weer te laten aanpassen, ook ná inleveren of na de deadline. Groepsfase-punten worden direct opgeslagen. Met <strong>Reset</strong> wis je het wachtwoord van een deelnemer die het vergeten is — hun account komt dan weer vrij in het registermenu om opnieuw te claimen (voorspelling en punten blijven behouden). Deelnemers met "nog niet geregistreerd" claimen hun account zelf via het uitklapmenu.</p>
    </div>

    ${renderAdminLog()}

    <div class="admin-section">
      <h3 class="section-title">Uitslagen invoeren <span style="font-weight:600;color:var(--muted2);font-size:13px;">— bepaalt de scores in het klassement</span></h3>
      ${stageResultBlock}
      <div style="margin-bottom:6px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span class="swatch" style="width:8px;height:18px;border-radius:4px;background:var(--gold);display:inline-block;"></span><strong style="font-size:13.5px;">Wereldkampioen</strong> <span style="font-size:12px;color:var(--muted2);">(400 pt)</span></div><div>${winnerOpts}</div></div>
      <button type="button" class="btn btn-primary btn-sm" style="margin-top:14px;" data-action="admin-save-results">Uitslagen opslaan &amp; herbereken</button>
    </div>

    <div class="admin-section">
      <h3 class="section-title">Doelpunten topscorers (knock-out) <span style="font-weight:600;color:var(--muted2);font-size:13px;">— standaard alleen de spelers die deelnemers kozen${state.goalFilter.scope === "selected" ? ` (${chosenSet.size})` : ""}</span></h3>
      ${renderPlayerFilters("goal", state.goalFilter)}
      <div style="max-width:560px;">${goalRows}</div>${goalMoreNote}
      <button type="button" class="btn btn-primary btn-sm" style="margin-top:14px;" data-action="admin-save-goals">Doelpunten opslaan &amp; herbereken</button>
    </div>

    <div class="two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="admin-section" style="margin:0;">
        <h3 class="section-title">Spelers (topscorer-keuze)</h3>
        <p style="font-size:12.5px;color:var(--muted);margin:0 0 14px;">Alle <strong>${WC_PLAYERS.length} WK-spelers</strong> zitten al in de pool — te kiezen via het filter op land/positie. Hieronder voeg je alleen extra spelers toe (bv. een late selectie).</p>
        ${playerList ? `<div style="margin-bottom:14px;">${playerList}</div>` : ""}
        <div class="inline-form">
          <input type="text" id="np-name" placeholder="Naam" style="flex:1;min-width:120px;">
          <select id="np-team" class="pf-sel" style="min-width:120px;"><option value="">Land…</option>${teamSelOpts}</select>
          <select id="np-pos" class="pf-sel"><option value="A">Aanvaller</option><option value="M">Middenvelder</option><option value="V">Verdediger</option><option value="K">Keeper</option></select>
          <input type="text" id="np-club" placeholder="Club (optioneel)" style="width:140px;">
          <button type="button" class="btn btn-dark btn-sm" data-action="admin-add-player">+ Speler</button>
        </div>
      </div>
      <div class="admin-section" style="margin:0;">
        <h3 class="section-title">Teams (kandidaten)</h3>
        <div style="margin-bottom:14px;">${teamList || `<span style="color:var(--muted2);font-size:13px;">Geen teams.</span>`}</div>
        <div class="inline-form">
          <input type="text" id="nt-code" placeholder="NED" style="width:70px;text-transform:uppercase;">
          <input type="text" id="nt-name" placeholder="Naam" style="flex:1;min-width:100px;">
          <input type="text" id="nt-cc" placeholder="nl" style="width:70px;" title="Landcode voor de vlag, bv. nl, br, gb-eng">
          <button type="button" class="btn btn-dark btn-sm" data-action="admin-add-team">+ Team</button>
        </div>
      </div>
    </div>
  </div>`);
}

/* ============================================================
   ROOT RENDER
   ============================================================ */
function renderApp() {
  const root = document.getElementById("app");
  if (!CONFIG_OK) { root.innerHTML = renderSetup(); return; }
  if (state.loading) { root.innerHTML = `<div class="spinner"></div>`; return; }
  if (!state.session) { root.innerHTML = renderAuth(); return; }
  const scr = state.screen;
  const map = {
    dashboard: renderDashboard, voorspellingen: renderVoorspellingen, topscorers: renderTopscorers,
    klassement: renderKlassement, mijn: renderMijn, reglement: renderReglement, admin: renderAdmin
  };
  // The participant-detail modal can be opened from several screens (admin list,
  // leaderboard after the deadline), so render it at the root for any screen.
  root.innerHTML = (map[scr] || renderDashboard)() + renderUserDetailModal();
}

function renderSetup() {
  return `<div class="setup">
    <h1>⚙️ Eénmalige setup nodig</h1>
    <p style="color:var(--muted);font-size:14px;">De WK Pool is bijna klaar — hij moet alleen nog gekoppeld worden aan je gratis Supabase-database.</p>
    <ol>
      <li>Maak een gratis account op <code>supabase.com</code> en een nieuw project.</li>
      <li>Open <strong>SQL Editor</strong> → plak de inhoud van <code>supabase/schema.sql</code> → <strong>Run</strong>.</li>
      <li>Ga naar <strong>Project Settings → Data API</strong> en kopieer <code>Project URL</code> en de <code>anon</code> key.</li>
      <li>Plak beide in <code>assets/js/config.js</code> en herlaad deze pagina.</li>
    </ol>
    <p style="font-size:13px;color:var(--muted2);">Volledige stappen staan in <code>README.md</code>.</p>
  </div>`;
}
