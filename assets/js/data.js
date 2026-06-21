/* ============================================================
   WK Pool 2026 — static defaults & constants
   These seed the pool the first time an admin registers.
   Admins can edit teams / players later from the Admin page.
   ============================================================ */

// Scoring per correctly predicted team, per stage (from the reglement)
const KO_STAGES = [
  { key: "sel16",     label: "8e finales (laatste 16)", short: "8e finales",   count: 16, points: 40,  color: "#1F36C7" },
  { key: "quarter",   label: "Kwartfinales",            short: "Kwartfinale",  count: 8,  points: 80,  color: "#03B0AA" },
  { key: "semi",      label: "Halve finales",           short: "Halve finale", count: 4,  points: 150, color: "#1A9D52" },
  { key: "finalists", label: "Finale",                  short: "Finale",       count: 2,  points: 250, color: "#F0531C" },
  { key: "winner",    label: "Wereldkampioen",          short: "Kampioen",     count: 1,  points: 400, color: "#E22B2B" }
];

// Topscorers: punten per doelpunt in de knock-outfase, afhankelijk van de
// positie van de speler (defensieve doelpunten zijn zeldzamer → meer waard).
//   K = Keeper, V = Verdediger, M = Middenvelder, A = Aanvaller
const GOAL_POINTS_BY_POS = { K: 80, V: 80, M: 40, A: 20 };
function goalPointsForPos(pos) {
  return GOAL_POINTS_BY_POS[pos] != null ? GOAL_POINTS_BY_POS[pos] : 20;
}
const TOPSCORER_COUNT = 3;

// Avatar palette (cycled per participant)
const AVATAR_COLORS = ["#1F36C7", "#03B0AA", "#1A9D52", "#F0531C", "#E22B2B", "#16215E", "#2D6BE0", "#0E7C77"];

// Default candidate teams — WK 2026 loting (48 landen, 12 poules).
// cc = ISO-landcode voor de vlag-afbeelding (werkt op Windows/Android/iOS).
const DEFAULT_TEAMS = [
  // Poule A
  ["MEX", "Mexico", "mx"], ["RSA", "Zuid-Afrika", "za"], ["KOR", "Zuid-Korea", "kr"], ["CZE", "Tsjechië", "cz"],
  // Poule B
  ["CAN", "Canada", "ca"], ["BIH", "Bosnië en Herzegovina", "ba"], ["QAT", "Qatar", "qa"], ["SUI", "Zwitserland", "ch"],
  // Poule C
  ["BRA", "Brazilië", "br"], ["MAR", "Marokko", "ma"], ["HAI", "Haïti", "ht"], ["SCO", "Schotland", "gb-sct"],
  // Poule D
  ["USA", "Verenigde Staten", "us"], ["PAR", "Paraguay", "py"], ["AUS", "Australië", "au"], ["TUR", "Turkije", "tr"],
  // Poule E
  ["GER", "Duitsland", "de"], ["CUW", "Curaçao", "cw"], ["CIV", "Ivoorkust", "ci"], ["ECU", "Ecuador", "ec"],
  // Poule F
  ["NED", "Nederland", "nl"], ["JPN", "Japan", "jp"], ["SWE", "Zweden", "se"], ["TUN", "Tunesië", "tn"],
  // Poule G
  ["BEL", "België", "be"], ["EGY", "Egypte", "eg"], ["IRN", "Iran", "ir"], ["NZL", "Nieuw-Zeeland", "nz"],
  // Poule H
  ["ESP", "Spanje", "es"], ["CPV", "Kaapverdië", "cv"], ["KSA", "Saoedi-Arabië", "sa"], ["URU", "Uruguay", "uy"],
  // Poule I
  ["FRA", "Frankrijk", "fr"], ["SEN", "Senegal", "sn"], ["IRQ", "Irak", "iq"], ["NOR", "Noorwegen", "no"],
  // Poule J
  ["ARG", "Argentinië", "ar"], ["ALG", "Algerije", "dz"], ["AUT", "Oostenrijk", "at"], ["JOR", "Jordanië", "jo"],
  // Poule K
  ["POR", "Portugal", "pt"], ["COD", "Congo DR", "cd"], ["UZB", "Oezbekistan", "uz"], ["COL", "Colombia", "co"],
  // Poule L
  ["ENG", "Engeland", "gb-eng"], ["CRO", "Kroatië", "hr"], ["GHA", "Ghana", "gh"], ["PAN", "Panama", "pa"]
].map(([code, name, cc]) => ({ code, name, cc }));

// The topscorer pool is the full World Cup squad database in players-wc.js
// (WC_PLAYERS), filterable by country + position. Admins can still add extra
// players by hand (stored in settings.players); the curated "popular" shortlist
// lives in players-wc.js as POPULAR_IDS.

// Default deadline (admin can change): zondag 21 juni 2026, 23:59
const DEFAULT_DEADLINE = "2026-06-21T23:59:00";

function slugify(s) {
  var combiningMarks = new RegExp("[\\u0300-\\u036f]", "g"); // strip accents after NFD
  return s.toLowerCase()
    .normalize("NFD").replace(combiningMarks, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
