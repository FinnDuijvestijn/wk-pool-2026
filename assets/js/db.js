/* ============================================================
   WK Pool 2026 — data layer (Supabase + auth + scoring)
   ============================================================ */

let sb = null;            // Supabase client
let CONFIG_OK = false;

function initDb() {
  const c = window.WKPOOL_CONFIG || {};
  CONFIG_OK = c.SUPABASE_URL && c.SUPABASE_ANON_KEY &&
    !/PASTE_YOUR/.test(c.SUPABASE_URL) && !/PASTE_YOUR/.test(c.SUPABASE_ANON_KEY);
  if (CONFIG_OK && window.supabase) {
    sb = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  }
  return CONFIG_OK;
}

/* ---------- password hashing (low-stakes, no e-mail) ---------- */
async function hashPassword(pw) {
  const data = new TextEncoder().encode("wkpool26::" + pw);
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  // fallback hash (non-secure context) — still deterministic
  let h = 0x811c9dc5;
  for (const b of data) { h ^= b; h = Math.imul(h, 0x01000193); }
  return "f" + (h >>> 0).toString(16);
}

/* ---------- session (localStorage) ---------- */
const SESSION_KEY = "wkpool_session";
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
}
function setSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }

/* ---------- auth ---------- */
// Accounts that have been pre-created (claimed=false) but not yet registered.
// These are offered in the register dropdown with their group-phase total.
async function loadClaimableAccounts() {
  const { data, error } = await sb.from("users")
    .select("id, username, group_points")
    .eq("claimed", false)
    .order("group_points", { ascending: false });
  if (error) throw error;
  return data || [];
}

// Claim a pre-created account: set its password and mark it registered.
async function claimAccount(username, password) {
  username = (username || "").trim();
  if ((password || "").length < 4) throw new Error("Wachtwoord moet minstens 4 tekens zijn.");

  const { data: u, error: e1 } = await sb.from("users")
    .select("*").eq("username", username).maybeSingle();
  if (e1) throw e1;
  if (!u) throw new Error("Dit account bestaat niet meer.");
  if (u.claimed) throw new Error("Dit account is intussen al geclaimd. Kies een ander of maak een nieuw account.");

  const password_hash = await hashPassword(password);
  const { data, error } = await sb.from("users")
    .update({ password_hash, claimed: true }).eq("id", u.id).eq("claimed", false)
    .select().single();
  if (error) throw new Error("Dit account is intussen al geclaimd. Kies een ander of maak een nieuw account.");

  await sb.from("predictions").insert({ user_id: data.id }).then(() => {}, () => {});
  return data;
}

async function registerUser(username, password) {
  username = (username || "").trim();
  if (username.length < 2) throw new Error("Gebruikersnaam moet minstens 2 tekens zijn.");
  if ((password || "").length < 4) throw new Error("Wachtwoord moet minstens 4 tekens zijn.");

  const { data: existing, error: e1 } = await sb.from("users").select("id, claimed").eq("username", username);
  if (e1) throw e1;
  if (existing && existing.length) {
    if (existing[0].claimed === false)
      throw new Error("Die naam staat al in de poule-lijst — kies hem in het uitklapmenu om je account te claimen.");
    throw new Error("Die gebruikersnaam bestaat al. Kies een andere.");
  }

  const { count, error: e2 } = await sb.from("users").select("id", { count: "exact", head: true });
  if (e2) throw e2;
  const isFirst = (count || 0) === 0;

  const password_hash = await hashPassword(password);
  const { data, error } = await sb.from("users")
    .insert({ username, password_hash, is_admin: isFirst, claimed: true })
    .select().single();
  if (error) throw error;

  if (isFirst) await ensureSettings();           // first admin seeds the pool
  await sb.from("predictions").insert({ user_id: data.id }).then(() => {}, () => {});
  return data;
}

async function loginUser(username, password) {
  username = (username || "").trim();
  const { data, error } = await sb.from("users").select("*").eq("username", username).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Gebruiker niet gevonden.");
  if (data.claimed === false || !data.password_hash)
    throw new Error("Dit account is nog niet geregistreerd. Kies je naam bij 'Registreren' en stel een wachtwoord in.");
  const password_hash = await hashPassword(password);
  if (password_hash !== data.password_hash) throw new Error("Onjuist wachtwoord.");
  return data;
}

/* ---------- settings ---------- */
async function ensureSettings() {
  const { data } = await sb.from("settings").select("id").eq("id", "pool").maybeSingle();
  if (!data) {
    await sb.from("settings").insert({
      id: "pool",
      deadline: DEFAULT_DEADLINE,
      entry_fee: 10,
      prize_pct: [70, 20, 10],
      teams: DEFAULT_TEAMS,
      players: [],   // topscorer pool comes from the full WC database (players-wc.js);
                     // this holds only extra players an admin adds by hand
      results: { sel16: [], quarter: [], semi: [], finalists: [], winner: null, goals: {} }
    });
  }
}

async function loadSettings() {
  await ensureSettings();
  const { data, error } = await sb.from("settings").select("*").eq("id", "pool").single();
  if (error) throw error;
  data.results = data.results || { sel16: [], quarter: [], semi: [], finalists: [], winner: null, goals: {} };
  data.results.goals = data.results.goals || {};
  if (!data.teams || !data.teams.length) data.teams = DEFAULT_TEAMS;
  data.players = data.players || [];   // extra hand-added players only; full pool = WC_PLAYERS
  return data;
}

async function saveSettings(patch) {
  patch.updated_at = new Date().toISOString();
  const { error } = await sb.from("settings").update(patch).eq("id", "pool");
  if (error) throw error;
}

/* ---------- predictions ---------- */
function emptyPrediction(user_id) {
  return { user_id, sel16: [], quarter: [], semi: [], finalists: [], winner: null, topscorers: [], status: "concept" };
}
async function loadMyPrediction(user_id) {
  const { data, error } = await sb.from("predictions").select("*").eq("user_id", user_id).maybeSingle();
  if (error) throw error;
  return data || emptyPrediction(user_id);
}
async function savePrediction(pred, status) {
  const row = {
    user_id: pred.user_id,
    sel16: pred.sel16, quarter: pred.quarter, semi: pred.semi,
    finalists: pred.finalists, winner: pred.winner, topscorers: pred.topscorers,
    status: status || pred.status || "concept",
    updated_at: new Date().toISOString()
  };
  if (status === "ingeleverd") row.submitted_at = new Date().toISOString();
  const { error } = await sb.from("predictions").upsert(row, { onConflict: "user_id" });
  if (error) throw error;
}

/* ---------- users (admin) ---------- */
async function loadAllUsers() {
  const { data, error } = await sb.from("users").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}
async function loadAllPredictions() {
  const { data, error } = await sb.from("predictions").select("*");
  if (error) throw error;
  return data || [];
}
async function updateUser(id, patch) {
  const { error } = await sb.from("users").update(patch).eq("id", id);
  if (error) throw error;
}
async function deleteUser(id) {
  const { error } = await sb.from("users").delete().eq("id", id);
  if (error) throw error;
}

/* ============================================================
   SCORING ENGINE  (per reglement GDWKP26)
   ============================================================ */
function scoreKnockout(pred, results) {
  let total = 0;
  const breakdown = {};
  for (const st of KO_STAGES) {
    const actual = st.key === "winner"
      ? (results.winner ? [results.winner] : [])
      : (results[st.key] || []);
    const picks = st.key === "winner"
      ? (pred.winner ? [pred.winner] : [])
      : (pred[st.key] || []);
    const actualSet = new Set(actual);
    const hits = picks.filter(c => actualSet.has(c)).length;
    const pts = hits * st.points;
    breakdown[st.key] = { hits, points: pts };
    total += pts;
  }
  return { total, breakdown };
}

function scoreTopscorers(pred, results) {
  const goals = results.goals || {};
  let total = 0;
  for (const pid of (pred.topscorers || [])) {
    total += (Number(goals[pid]) || 0) * POINTS_PER_GOAL;
  }
  return total;
}

// Build the full leaderboard: group base + knock-out + topscorers
function buildLeaderboard(users, predictions, settings) {
  const predByUser = {};
  predictions.forEach(p => { predByUser[p.user_id] = p; });
  const results = settings.results || {};

  const rows = users.map(u => {
    const pred = predByUser[u.id] || emptyPrediction(u.id);
    const ko = scoreKnockout(pred, results);
    const ts = scoreTopscorers(pred, results);
    const g = Number(u.group_points) || 0;
    return {
      id: u.id, name: u.username, is_admin: u.is_admin, paid: u.paid,
      claimed: u.claimed !== false, edit_unlocked: !!u.edit_unlocked,
      status: pred.status || "concept",
      g, k: ko.total, t: ts, total: g + ko.total + ts
    };
  });

  rows.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  rows.forEach((r, i) => { r.rank = i + 1; });
  return rows;
}
