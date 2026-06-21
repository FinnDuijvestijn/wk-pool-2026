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

const POINTS_PER_GOAL = 25;     // topscorers: 25 punten per doelpunt in de knock-outfase
const TOPSCORER_COUNT = 3;

// Avatar palette (cycled per participant)
const AVATAR_COLORS = ["#1F36C7", "#03B0AA", "#1A9D52", "#F0531C", "#E22B2B", "#16215E", "#2D6BE0", "#0E7C77"];

// Default candidate teams (admin can add/remove later)
const DEFAULT_TEAMS = [
  ["ARG", "Argentinië", "🇦🇷"], ["FRA", "Frankrijk", "🇫🇷"], ["BRA", "Brazilië", "🇧🇷"], ["ESP", "Spanje", "🇪🇸"],
  ["NED", "Nederland", "🇳🇱"], ["POR", "Portugal", "🇵🇹"], ["ENG", "Engeland", "🇬🇧"], ["GER", "Duitsland", "🇩🇪"],
  ["BEL", "België", "🇧🇪"], ["CRO", "Kroatië", "🇭🇷"], ["MAR", "Marokko", "🇲🇦"], ["URU", "Uruguay", "🇺🇾"],
  ["JPN", "Japan", "🇯🇵"], ["USA", "VS", "🇺🇸"], ["SEN", "Senegal", "🇸🇳"], ["DEN", "Denemarken", "🇩🇰"],
  ["MEX", "Mexico", "🇲🇽"], ["CAN", "Canada", "🇨🇦"], ["COL", "Colombia", "🇨🇴"], ["SUI", "Zwitserland", "🇨🇭"],
  ["KOR", "Zuid-Korea", "🇰🇷"], ["AUS", "Australië", "🇦🇺"], ["POL", "Polen", "🇵🇱"], ["SRB", "Servië", "🇷🇸"],
  ["ECU", "Ecuador", "🇪🇨"], ["GHA", "Ghana", "🇬🇭"], ["IRN", "Iran", "🇮🇷"], ["KSA", "Saoedi-Arabië", "🇸🇦"],
  ["NGA", "Nigeria", "🇳🇬"], ["AUT", "Oostenrijk", "🇦🇹"], ["NOR", "Noorwegen", "🇳🇴"], ["CRC", "Costa Rica", "🇨🇷"]
].map(([code, name, flag]) => ({ code, name, flag }));

// Default candidate players for topscorers (admin can add/remove later)
const DEFAULT_PLAYERS = [
  ["Kylian Mbappé", "🇫🇷", "Real Madrid"], ["Erling Haaland", "🇳🇴", "Manchester City"],
  ["Lionel Messi", "🇦🇷", "Inter Miami"], ["Harry Kane", "🇬🇧", "Bayern München"],
  ["Vinícius Jr.", "🇧🇷", "Real Madrid"], ["Robert Lewandowski", "🇵🇱", "Barcelona"],
  ["Jude Bellingham", "🇬🇧", "Real Madrid"], ["Cody Gakpo", "🇳🇱", "Liverpool"],
  ["Julián Álvarez", "🇦🇷", "Atlético"], ["Victor Osimhen", "🇳🇬", "Galatasaray"],
  ["Christian Pulisic", "🇺🇸", "AC Milan"], ["Heung-min Son", "🇰🇷", "Tottenham"]
].map(([name, flag, club]) => ({ id: slugify(name), name, flag, club }));

// Default deadline (admin can change): zondag 21 juni 2026, 23:59
const DEFAULT_DEADLINE = "2026-06-21T23:59:00";

function slugify(s) {
  var combiningMarks = new RegExp("[\\u0300-\\u036f]", "g"); // strip accents after NFD
  return s.toLowerCase()
    .normalize("NFD").replace(combiningMarks, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
