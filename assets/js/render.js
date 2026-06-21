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
function isLocked() { return deadlinePassed() || (state.draft && state.draft.status === "ingeleverd"); }
function participants() { return (state.users || []).length; }
function entryFee() { return (state.settings && state.settings.entry_fee) || 10; }
function pot() { return participants() * entryFee(); }
function prizes() {
  const pct = (state.settings && state.settings.prize_pct) || [70, 20, 10];
  return pct.map(p => Math.round(pot() * p / 100));
}

/* ============================================================
   LOGIN / REGISTER
   ============================================================ */
function renderAuth() {
  const isLogin = state.authMode === "login";
  return `
  <div class="auth-wrap">
    <div class="auth-hero">
      <div class="brandline">
        <img src="${LOGO}" alt="DSP">
        <span class="brandname">DSP&nbsp;GROEP</span>
      </div>
      <div class="hero-rings"><div class="ring-badge"><div class="cup">🏆</div><div class="yr">26</div></div></div>
      <div class="hero-fade"></div>
      <div class="hero-copy">
        <div class="kicker">WK Pool 2026 · Knock-outfase</div>
        <h1>Voorspel de<br>knock-out.<br>Pak de titel.</h1>
        <p>De interne wereldkampioenschap-pool van DSP Groep. Voorspel wie de laatste 16 haalt, kies je topscorers en klim naar de top van het klassement.</p>
      </div>
    </div>
    <div class="auth-panel">
      <div class="auth-card">
        <div class="eyebrow">Welkom bij de pool</div>
        <h2>${isLogin ? "Log in op de pool" : "Maak je account"}</h2>
        <div class="auth-tabs">
          <button type="button" class="auth-tab ${isLogin ? "active" : ""}" data-action="authtab" data-mode="login">Inloggen</button>
          <button type="button" class="auth-tab ${!isLogin ? "active" : ""}" data-action="authtab" data-mode="register">Registreren</button>
        </div>
        ${state.authError ? `<div class="auth-error">${esc(state.authError)}</div>` : ""}
        <label class="field-label">Gebruikersnaam</label>
        <input id="au-username" class="field" type="text" placeholder="bijv. daan_dsp" autocomplete="username">
        <label class="field-label">Wachtwoord</label>
        <input id="au-password" class="field" type="password" placeholder="••••••••" autocomplete="${isLogin ? "current-password" : "new-password"}">
        ${!isLogin ? `<label class="field-label">Bevestig wachtwoord</label><input id="au-confirm" class="field" type="password" placeholder="••••••••" autocomplete="new-password">` : ""}
        <button type="button" class="btn btn-primary btn-block" data-action="authsubmit" style="margin-top:4px;">${isLogin ? "Inloggen" : "Account aanmaken"}</button>
        <div class="note">
          <span style="font-size:16px;flex:none;">🔒</span>
          <p>Geen e-mail nodig — verzin zelf een gebruikersnaam en wachtwoord. Zo blijven inzendingen aan je naam gekoppeld zonder gedoe. <strong style="color:var(--ink);">De eerste deelnemer wordt automatisch beheerder.</strong></p>
        </div>
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
      <div class="brand" data-action="nav" data-screen="dashboard">
        <img src="${LOGO}" alt="DSP">
        <div>
          <div class="b1">WK&nbsp;POOL&nbsp;<span>'26</span></div>
          <div class="b2">DSP Groep · Knock-out</div>
        </div>
      </div>
      <nav class="nav">${navItems()}</nav>
      <div class="topbar-right">
        <div class="points-pill"><span class="lbl">PNT</span><span class="val">${myTotal}</span></div>
        <div class="avatar" style="background:${colorFor(u.username)};">${initial(u.username)}</div>
        <button type="button" class="btn-ghost btn" style="padding:6px 8px;font-size:13px;" data-action="logout">Uitloggen</button>
      </div>
    </div>
    <div class="rainbow-stripe"></div>
  </div>
  ${inner}
  <div class="foot"><div class="foot-inner">
    <div style="display:flex;align-items:center;gap:10px;"><img src="${LOGO}" alt="DSP"><span style="font-size:12.5px;color:var(--muted2);">WK Pool 2026 · een interne pool van DSP Groep</span></div>
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
  if (submitted) { statusColor = "var(--green)"; statusText = "Ingeleverd ✓"; statusSub = "Je voorspelling staat vast"; }
  else if (locked) { statusColor = "var(--red)"; statusText = "Niet ingeleverd"; statusSub = "De deadline is verstreken"; }
  else { statusColor = "var(--orange)"; statusText = "Concept opgeslagen"; statusSub = "Nog niet definitief ingeleverd"; }

  const top5 = (state.leaderboard || []).slice(0, 5).map(r => `
    <div class="mini-row ${r.id === state.session.id ? "me" : ""}">
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
        ${!locked && !submitted ? `<button type="button" class="btn btn-dark btn-block btn-sm" style="margin-top:13px;padding:9px;" data-action="nav" data-screen="voorspellingen">Afmaken &amp; inleveren →</button>` : ""}
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
            <div style="flex:1;"><div class="t1">Kies je 3 topscorers</div><div class="t2">25 punten per doelpunt in de knock-outfase</div></div>
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

  const lockBanner = submitted
    ? `<div class="lockbar"><span style="font-size:15px;">🔒</span><p>Je voorspelling is <strong>definitief ingeleverd</strong> en kan niet meer gewijzigd worden.</p></div>`
    : deadlinePassed()
      ? `<div class="lockbar"><span style="font-size:15px;">⏰</span><p>De deadline is verstreken — voorspellingen zijn vergrendeld.</p></div>`
      : "";

  return renderShell(`
  <div class="page">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:8px;">
      <div>
        <div class="eyebrow">Stap 1 van 2 · Teams</div>
        <h1 class="display" style="font-size:30px;">Voorspellingen knock-outfase</h1>
      </div>
      <div class="deadpill"><span style="font-size:14px;">⏳</span><span class="t">DEADLINE: ${fmtDeadline(state.settings.deadline).toUpperCase()}</span></div>
    </div>
    ${lockBanner || `<div class="warn" style="margin-top:14px;"><span style="font-size:15px;">⚠️</span><p>Let op: voorspellingen zijn <strong>definitief na inleveren</strong>. Wijzigingen achteraf zijn niet mogelijk.</p></div>`}

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
    <div class="submitbar">
      <div style="font-size:13px;color:var(--muted);">Klaar met je teams? Vergeet daarna je <button type="button" class="btn-ghost btn" style="padding:0;color:var(--green);font-weight:700;font-size:13px;text-decoration:underline;" data-action="nav" data-screen="topscorers">3 topscorers</button> niet.</div>
      <div style="display:flex;gap:10px;">
        <button type="button" class="btn btn-outline" data-action="savedraft">Concept opslaan</button>
        <button type="button" class="btn btn-primary" data-action="submitfinal" ${allComplete ? "" : "disabled title='Vul eerst alle rondes en 3 topscorers in'"}>Definitief inleveren →</button>
      </div>
    </div>
    ${allComplete ? "" : `<p style="font-size:12.5px;color:var(--muted2);margin:12px 2px 0;">Je kunt pas definitief inleveren als alle rondes (16/8/4/2/1) én 3 topscorers zijn ingevuld.</p>`}
    `}
  </div>`);
}

/* ============================================================
   TOPSCORERS
   ============================================================ */
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
        <div style="flex:1;"><div class="nm">${esc(p.name)}</div><div class="cl">${esc(p.club)}</div></div>
        <div style="text-align:right;"><div class="pt">${g * POINTS_PER_GOAL}</div><div class="gl">${g} GOALS</div></div></div>`);
    } else {
      slots.push(`<div class="top3 empty"><div>Keuze ${i + 1}<br><span style="font-size:11px;">nog leeg</span></div></div>`);
    }
  }

  const grid = (state.players || []).map(p => {
    const chosen = d.topscorers.includes(p.id);
    const full = d.topscorers.length >= TOPSCORER_COUNT && !chosen;
    const g = Number(goals[p.id]) || 0;
    return `<button type="button" class="player-card ${chosen ? "chosen" : ""}" ${locked || full ? "" : `data-action="topscorer" data-id="${p.id}"`} ${full ? "style='opacity:.5;cursor:not-allowed;'" : ""}>
      <div class="row"><div class="av">${pflag(p)}</div>
        <div style="flex:1;min-width:0;"><div class="nm">${esc(p.name)}</div><div class="cl">${esc(p.club)}</div></div>
      </div>
      <div class="meta"><span class="mt">${g} goals · ${g * POINTS_PER_GOAL} pt</span>
        <span class="badge ${chosen ? "on" : ""} ${full ? "disabled" : ""}">${chosen ? "✓ Gekozen" : "+ Kies"}</span>
      </div>
    </button>`;
  }).join("");

  return renderShell(`
  <div class="page">
    <div class="eyebrow">Stap 2 van 2 · Spelers</div>
    <h1 class="display" style="font-size:30px;margin-bottom:6px;">Kies je 3 topscorers</h1>
    <p style="font-size:14px;color:var(--muted);margin:0 0 26px;max-width:560px;"><strong style="color:var(--green);">25 punten per doelpunt</strong> dat je speler maakt in de knock-outfase. Geen onderscheid naar positie, geen punten voor assists.</p>
    ${isLocked() ? `<div class="lockbar"><span style="font-size:15px;">🔒</span><p>${state.draft.status === "ingeleverd" ? "Je voorspelling is definitief ingeleverd." : "De deadline is verstreken."} Topscorers kunnen niet meer gewijzigd worden.</p></div>` : ""}
    <div class="top3-grid">${slots.join("")}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin:0 0 14px;">
      <h3 class="section-title" style="margin:0;">Alle spelers <span style="color:var(--muted2);font-weight:600;">(${d.topscorers.length}/${TOPSCORER_COUNT} gekozen)</span></h3>
      ${isLocked() ? "" : `<button type="button" class="btn btn-primary btn-sm" style="padding:9px 16px;" data-action="savedraft">Concept opslaan</button>`}
    </div>
    <div class="player-grid">${grid}</div>
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

  const podium = board.slice(0, 3).map((r, i) => `
    <div class="podium ${i === 0 ? "first" : ""}" style="background:${podBg[i]};border:1.5px solid ${podBorder[i]};">
      <div class="medal">${medals[i]}</div>
      <div class="av" style="background:${colorFor(r.name)};">${initial(r.name)}</div>
      <div class="nm">${esc(r.name)}</div>
      <div class="tot">${r.total}</div>
      <div class="prize">€${pz[i] || 0}</div>
    </div>`).join("");

  const rows = board.map(r => `
    <div class="board-row ${r.id === state.session.id ? "me" : ""}">
      <div class="rk" style="color:${r.rank <= 3 ? "var(--gold)" : "#c2bdb0"};">${r.rank}</div>
      <div class="who">
        <div class="av" style="background:${colorFor(r.name)};">${initial(r.name)}</div>
        <span class="nm">${esc(r.name)}</span>
        ${r.id === state.session.id ? `<span class="tag-me">JIJ</span>` : ""}
      </div>
      <div class="num">${r.g}</div>
      <div class="num">${r.k}</div>
      <div class="num">${r.t}</div>
      <div class="tot">${r.total}</div>
    </div>`).join("");

  return renderShell(`
  <div class="page">
    <div class="eyebrow">Eindklassement · Live</div>
    <h1 class="display" style="font-size:30px;margin-bottom:22px;">Klassement</h1>
    ${board.length >= 3 ? `<div class="podium-grid">${podium}</div>` : ""}
    <div class="board">
      <div class="board-head"><div>Pos</div><div>Deelnemer</div><div style="text-align:right;">Groepsf.</div><div style="text-align:right;">Knock-out</div><div style="text-align:right;">Topsc.</div><div style="text-align:right;">Totaal</div></div>
      ${rows || `<div class="empty-state" style="border:none;">Nog geen deelnemers in het klassement.</div>`}
    </div>
    <p style="font-size:12.5px;color:var(--muted2);margin:14px 2px 0;">Eindscore = stand na groepsfase + knock-out punten + topscorers. Punten verschijnen zodra een admin de uitslagen invult.</p>
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
  const goals = (state.settings.results && state.settings.results.goals) || {};

  const sel16 = d.sel16.map(c => { const t = tm[c]; return t ? `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;background:#F7F8FF;border:1px solid #DCE1FB;border-radius:11px;padding:10px 4px;"><span style="font-size:22px;">${tflag(t)}</span><span style="font-size:10px;font-weight:700;text-align:center;line-height:1.1;color:#3a3d45;">${esc(t.name)}</span></div>` : ""; }).join("") || `<div style="grid-column:1/-1;color:var(--muted2);font-size:13px;">Nog geen teams gekozen.</div>`;

  const champ = d.winner ? tm[d.winner] : null;
  const tops = d.topscorers.map(pid => { const p = pm[pid]; if (!p) return ""; const g = Number(goals[p.id]) || 0;
    return `<div style="display:flex;align-items:center;gap:12px;border:1px solid var(--border);border-radius:12px;padding:12px 14px;"><div style="width:42px;height:42px;border-radius:50%;background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:21px;flex:none;">${pflag(p)}</div><div style="flex:1;"><div class="exp" style="font-weight:800;font-size:14.5px;">${esc(p.name)}</div><div style="font-size:12px;color:var(--muted2);">${esc(p.club)}</div></div><div style="text-align:right;"><div class="exp" style="font-weight:900;font-size:18px;color:var(--green);">${g * POINTS_PER_GOAL}</div><div class="mono" style="font-size:9px;color:var(--muted2);">${g} GOALS</div></div></div>`; }).join("") || `<span style="font-size:12.5px;color:var(--muted2);">Nog geen topscorers gekozen.</span>`;

  return renderShell(`
  <div class="page">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px;">
      <div><div class="eyebrow">Profiel · ${esc(state.session.username)}</div><h1 class="display" style="font-size:30px;">Mijn voorspellingen</h1></div>
      <div class="statusline ${submitted ? "status-done" : "status-concept"}"><span class="dot"></span><span class="t">${submitted ? "INGELEVERD ✓" : "CONCEPT · NOG NIET INGELEVERD"}</span></div>
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
          <div style="display:flex;align-items:center;gap:11px;background:var(--navy);border-radius:12px;padding:13px 15px;color:#fff;"><span style="font-size:28px;">${champ ? champ.flag : "🏆"}</span><div><div class="mono" style="font-size:9px;color:var(--gold);letter-spacing:1px;">WERELDKAMPIOEN</div><div class="exp" style="font-weight:800;font-size:17px;">${champ ? esc(champ.name) : "— nog niet gekozen —"}</div></div></div>
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
      <div><h3>Voorspellingen knock-outfase</h3><p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#3a3d45;">Vóór de start van de knock-outfase levert iedere deelnemer éénmalig zijn voorspellingen in. Te voorspellen: de 16 teams die de 8e finales halen, de 8 kwartfinalisten, de 4 halve finalisten, de 2 finalisten en de wereldkampioen.</p><p style="margin:0;font-size:13px;color:#A52121;"><strong>Let op:</strong> voorspellingen zijn definitief na inleveren — wijzigingen achteraf zijn niet mogelijk.</p></div>
    </div></div>

    <div class="reg-card"><div class="reg-head"><div class="reg-num" style="background:var(--blue);">2</div>
      <div style="flex:1;"><h3 style="margin-bottom:14px;">Puntentelling knock-outfase</h3><div style="display:flex;flex-direction:column;gap:8px;">${ko}</div></div>
    </div></div>

    <div class="reg-card"><div class="reg-head"><div class="reg-num" style="background:var(--green);">3</div>
      <div><h3>Topscorers</h3><p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#3a3d45;">Iedere deelnemer kiest <strong>3 topscorers</strong>. Je krijgt <strong style="color:var(--green);">25 punten per doelpunt</strong> dat een gekozen speler maakt in de knock-outfase.</p><ul style="margin:0;padding-left:18px;font-size:13.5px;line-height:1.7;color:var(--muted);"><li>Alleen doelpunten in de knock-outfase tellen mee</li><li>Geen onderscheid naar positie (verdediger/middenvelder/aanvaller)</li><li>Geen punten voor assists of andere statistieken</li></ul></div>
    </div></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;" class="two-col">
      <div style="background:var(--navy);border-radius:18px;padding:24px;color:#fff;">
        <div style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-family:var(--exp);font-weight:900;font-size:14px;margin-bottom:12px;">4</div>
        <h3 class="exp" style="font-weight:800;font-size:16px;margin:0 0 8px;">Eindstand</h3>
        <p style="margin:0;font-size:13.5px;line-height:1.6;color:#c7cee8;">Eindscore = stand na groepsfase <strong style="color:#fff;">+</strong> punten knock-out <strong style="color:#fff;">+</strong> topscorers. Wie de meeste punten heeft, wint de pool.</p>
      </div>
      <div style="background:var(--teal);border-radius:18px;padding:24px;color:#fff;">
        <div style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;font-size:15px;margin-bottom:12px;">💶</div>
        <h3 class="exp" style="font-weight:800;font-size:16px;margin:0 0 10px;">Prijzenpot · €${entryFee()} inleg p.p.</h3>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:13.5px;">
          <div style="display:flex;justify-content:space-between;"><span>🥇 1e plaats (${pct[0]}%)</span><strong>€${pz[0]}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span>🥈 2e plaats (${pct[1]}%)</span><strong>€${pz[1]}</strong></div>
          <div style="display:flex;justify-content:space-between;"><span>🥉 3e plaats (${pct[2]}%)</span><strong>€${pz[2]}</strong></div>
        </div>
        <div style="margin-top:12px;font-size:12px;color:#d8f6f4;">Totale pot: €${pot()} · ${participants()} deelnemers</div>
      </div>
    </div>
  </div>`);
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
    return `<div class="admin-grid admin-row">
      <div style="display:flex;align-items:center;gap:11px;"><div class="av" style="width:32px;height:32px;border-radius:50%;background:${colorFor(u.username)};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;">${initial(u.username)}</div>
        <div><div style="font-weight:700;font-size:14px;">${esc(u.username)}</div><div class="mono" style="font-size:11px;color:var(--muted2);">${new Date(u.created_at).toLocaleDateString("nl-NL")}</div></div></div>
      <div><span class="chip ${u.is_admin ? "chip-admin" : "chip-user"}">${u.is_admin ? "Admin" : "Deelnemer"}</span></div>
      <div class="col-hide"><span class="chip ${u.paid ? "chip-yes" : "chip-no"}" data-action="admin-paid" data-id="${u.id}">${u.paid ? "Betaald" : "Open"}</span></div>
      <div class="col-hide"><span class="chip ${sub ? "chip-yes" : "chip-no"}" style="cursor:default;">${sub ? "Ingeleverd" : "Concept"}</span></div>
      <div class="col-hide"><input class="gp-input" type="number" value="${Number(u.group_points) || 0}" data-action="admin-gp" data-id="${u.id}" title="Groepsfase punten"></div>
      <div style="display:flex;gap:7px;justify-content:flex-end;">
        <button type="button" class="btn btn-outline btn-sm" data-action="admin-role" data-id="${u.id}">${u.is_admin ? "Beheer afnemen" : "Maak admin"}</button>
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

  const goalRows = (state.players || []).map(p => `<div class="goal-row"><span style="font-size:13.5px;">${pflag(p)} ${esc(p.name)} <span style="color:var(--muted2);font-size:12px;">· ${esc(p.club)}</span></span><input class="gp-input" style="text-align:center;" type="number" min="0" value="${Number((res.goals || {})[p.id]) || 0}" data-action="admin-goal" data-id="${p.id}" title="Doelpunten in knock-out"></div>`).join("");

  const playerList = (state.players || []).map(p => `<span class="chip chip-user" style="margin:0 6px 6px 0;">${pflag(p)} ${esc(p.name)} <button type="button" style="border:none;background:none;color:#C53030;cursor:pointer;font-weight:800;" data-action="admin-del-player" data-id="${p.id}" title="Verwijder">×</button></span>`).join("");
  const teamList = (state.teams || []).map(t => `<span class="chip chip-user" style="margin:0 6px 6px 0;">${tflag(t)} ${esc(t.code)} <button type="button" style="border:none;background:none;color:#C53030;cursor:pointer;font-weight:800;" data-action="admin-del-team" data-code="${t.code}" title="Verwijder">×</button></span>`).join("");

  const dlValue = state.settings.deadline ? new Date(new Date(state.settings.deadline).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";

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
      <div class="inline-form">
        <label style="font-size:13px;font-weight:700;">Inleg p.p. €</label>
        <input type="number" id="adm-fee" value="${entryFee()}" style="width:80px;">
        <label style="font-size:13px;font-weight:700;">Prijsverdeling %</label>
        <input type="number" id="adm-p1" value="${pct[0]}" style="width:64px;" title="1e">
        <input type="number" id="adm-p2" value="${pct[1]}" style="width:64px;" title="2e">
        <input type="number" id="adm-p3" value="${pct[2]}" style="width:64px;" title="3e">
        <button type="button" class="btn btn-dark btn-sm" data-action="admin-prizes">Opslaan</button>
      </div>
    </div>

    <div class="admin-section" style="padding:0;overflow:hidden;">
      <div style="padding:18px 20px 0;"><h3 class="section-title">Deelnemers beheren</h3></div>
      <div class="admin-grid admin-head"><div>Deelnemer</div><div>Rol</div><div class="col-hide">Inleg</div><div class="col-hide">Voorspelling</div><div class="col-hide">Groepsf.</div><div style="text-align:right;">Acties</div></div>
      ${rows || `<div style="padding:20px;color:var(--muted2);">Nog geen deelnemers.</div>`}
      <p style="font-size:12.5px;color:var(--muted2);margin:0;padding:14px 20px;">De eerste geregistreerde deelnemer is automatisch beheerder. Tik op de inleg-chip om Betaald/Open te wisselen; vul groepsfase-punten in en ze worden direct opgeslagen.</p>
    </div>

    <div class="admin-section">
      <h3 class="section-title">Uitslagen invoeren <span style="font-weight:600;color:var(--muted2);font-size:13px;">— bepaalt de scores in het klassement</span></h3>
      ${stageResultBlock}
      <div style="margin-bottom:6px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span class="swatch" style="width:8px;height:18px;border-radius:4px;background:var(--gold);display:inline-block;"></span><strong style="font-size:13.5px;">Wereldkampioen</strong> <span style="font-size:12px;color:var(--muted2);">(400 pt)</span></div><div>${winnerOpts}</div></div>
      <button type="button" class="btn btn-primary btn-sm" style="margin-top:14px;" data-action="admin-save-results">Uitslagen opslaan &amp; herbereken</button>
    </div>

    <div class="admin-section">
      <h3 class="section-title">Doelpunten topscorers (knock-out)</h3>
      <div style="max-width:520px;">${goalRows}</div>
      <button type="button" class="btn btn-primary btn-sm" style="margin-top:14px;" data-action="admin-save-goals">Doelpunten opslaan &amp; herbereken</button>
    </div>

    <div class="two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="admin-section" style="margin:0;">
        <h3 class="section-title">Spelers (topscorer-keuze)</h3>
        <div style="margin-bottom:14px;">${playerList || `<span style="color:var(--muted2);font-size:13px;">Geen spelers.</span>`}</div>
        <div class="inline-form">
          <input type="text" id="np-name" placeholder="Naam" style="flex:1;min-width:120px;">
          <input type="text" id="np-cc" placeholder="ar" style="width:60px;" title="Landcode voor de vlag, bv. nl, br, gb-eng">
          <input type="text" id="np-club" placeholder="Land" style="width:120px;">
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
  root.innerHTML = (map[scr] || renderDashboard)();
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
