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

// Default candidate players for topscorers (admin can add/remove/score later).
// club-veld toont het land; cc = vlag-landcode. Doelpunten staan in settings.results.goals.
const DEFAULT_PLAYERS = [
  // huidige topscorers (knock-out)
  ["Lionel Messi", "ar", "Argentinië"], ["Jonathan David", "ca", "Canada"],
  ["Deniz Undav", "de", "Duitsland"], ["Erling Haaland", "no", "Noorwegen"],
  ["Elijah Just", "nz", "Nieuw-Zeeland"], ["Daichi Kamada", "jp", "Japan"],
  ["Ismael Saibari", "ma", "Marokko"], ["Ayase Ueda", "jp", "Japan"],
  ["Harry Kane", "gb-eng", "Engeland"], ["Kylian Mbappé", "fr", "Frankrijk"],
  ["Yasin Ayari", "se", "Zweden"], ["Folarin Balogun", "us", "Verenigde Staten"],
  ["Brian Brobbey", "nl", "Nederland"], ["Matheus Cunha", "br", "Brazilië"],
  ["Cody Gakpo", "nl", "Nederland"], ["Kai Havertz", "de", "Duitsland"],
  ["Cyle Larin", "ca", "Canada"], ["Johan Manzambi", "ch", "Zwitserland"],
  ["Crysencio Summerville", "nl", "Nederland"], ["Vinícius Júnior", "br", "Brazilië"],
  // grote namen die nog moeten scoren
  ["Jude Bellingham", "gb-eng", "Engeland"], ["Lamine Yamal", "es", "Spanje"],
  ["Mohamed Salah", "eg", "Egypte"], ["Heung-min Son", "kr", "Zuid-Korea"],
  ["Julián Álvarez", "ar", "Argentinië"], ["Florian Wirtz", "de", "Duitsland"],
  ["Achraf Hakimi", "ma", "Marokko"], ["Rafael Leão", "pt", "Portugal"]
].map(([name, cc, club]) => ({ id: slugify(name), name, cc, club }));

// Default deadline (admin can change): zondag 21 juni 2026, 23:59
const DEFAULT_DEADLINE = "2026-06-21T23:59:00";

function slugify(s) {
  var combiningMarks = new RegExp("[\\u0300-\\u036f]", "g"); // strip accents after NFD
  return s.toLowerCase()
    .normalize("NFD").replace(combiningMarks, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
