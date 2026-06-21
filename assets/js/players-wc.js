/* ============================================================
   WK Pool 2026 — full World Cup player database
   ------------------------------------------------------------
   Every squad for the 48 teams, grouped by position so the
   topscorer pool can be filtered by country + position instead
   of typing flag codes by hand.

   Position keys:  K = Keeper, V = Verdediger,
                   M = Middenvelder, A = Aanvaller
   Each entry is "Naam (Club)"; the club is optional.
   ============================================================ */

const WC_SQUADS = [
  /* ---------------- Poule A ---------------- */
  { code: "MEX", cc: "mx", country: "Mexico",
    K: ["Raúl Rangel (Guadalajara)", "Guillermo Ochoa (AEL Limassol)", "Carlos Acevedo (Santos Laguna)"],
    V: ["César Montes (Lokomotiv Moscow)", "Johan Vásquez (Genoa)", "Jesús Gallardo (Toluca)", "Jorge Sánchez (PAOK)", "Israel Reyes (América)", "Mateo Chávez (AZ)"],
    M: ["Edson Álvarez (Fenerbahçe)", "Brian Gutiérrez (Guadalajara)", "Luis Chávez (Dynamo Moscow)", "Luis Romo (Guadalajara)", "Érik Lira (Cruz Azul)", "Orbelín Pineda (AEK Athens)", "Álvaro Fidalgo (Real Betis)", "Obed Vargas (Atlético Madrid)", "Gilberto Mora (Tijuana)"],
    A: ["Raúl Jiménez (Fulham)", "César Huerta (Anderlecht)", "Santiago Giménez (AC Milan)", "Alexis Vega (Toluca)", "Roberto Alvarado (Guadalajara)", "Julián Quiñones (Al-Qadisiyah)", "Guillermo Martínez (UNAM)", "Armando González (Guadalajara)"] },

  { code: "RSA", cc: "za", country: "Zuid-Afrika",
    K: ["Ronwen Williams (Mamelodi Sundowns FC)", "Ricardo Goss (Philadelphia Union)", "Sipho Chaine (Orlando Pirates FC)"],
    V: ["Khuliso Mudau (Mamelodi Sundowns FC)", "Nkosinathi Sibisi (Orlando Pirates FC)", "Ime Okon (Hannover 96)", "Khulumani Ndamane (Mamelodi Sundowns FC)", "Aubrey Modiba (Mamelodi Sundowns FC)", "Samukele Kabini (Molde FK)", "Thabang Matuludi (Polokwane City FC)", "Olwethu Makhanya (Philadelphia Union)", "Kamogelo Sebelebele (Orlando Pirates FC)", "Bradley Cross (Kaizer Chiefs FC)", "Mbekezeli Mbokazi (Chicago Fire)"],
    M: ["Teboho Mokoena (Mamelodi Sundowns FC)", "Thalente Mbatha (Orlando Pirates FC)", "Sphephelo Sithole (CD Tondela)", "Jayden Adams (Mamelodi Sundowns FC)"],
    A: ["Oswin Appollis (Orlando Pirates FC)", "Iqraam Rayners (Mamelodi Sundowns FC)", "Tshepang Moremi (Orlando Pirates FC)", "Relebohile Mofokeng (Orlando Pirates FC)", "Evidence Makgopa (Orlando Pirates FC)", "Themba Zwane (Mamelodi Sundowns FC)", "Lyle Foster (Burnley FC)", "Thapelo Maseko (AEL Limassol)"] },

  { code: "KOR", cc: "kr", country: "Zuid-Korea",
    K: ["Seung-Gyu Kim (FC Tokyo)", "Bum-keun Song (Jeonbuk Hyundai Motors)", "Hyeon-woo Jo (Ulsan HD FC)"],
    V: ["Moon-hwan Kim (Daejeon Hana Citizen)", "Min-jae Kim (Bayern München)", "Tae-hyeon Kim (Kashima Antlers)", "Jin-seob Park (Zhejiang FC)", "Young-woo Seol (Rode Ster Belgrado)", "Jens Castrop (Borussia Mönchengladbach)", "Ki-hyuk Lee (Gangwon FC)", "Tae-seok Lee (FK Austria Wien)", "Han-beom Lee (FC Midtjylland)", "Yu-min Cho (Sharjah FC)"],
    M: ["Jin-gyu Kim (Jeonbuk Hyundai Motors)", "Jun-ho Bae (Stoke City)", "Seung-ho Paik (Birmingham City)", "Hyun-jun Yang (Celtic FC)", "Ji-sung Eom (Swansea City)", "Kang-in Lee (Paris Saint-Germain)", "Dong-gyeong Lee (Ulsan HD FC)", "Jae-sung Lee (FSV Mainz 05)", "In-beom Hwang (Feyenoord)", "Hee-chan Hwang (Wolverhampton Wanderers)"],
    A: ["Heung-min Son (LAFC)", "Hyeon-gyu Oh (Besiktas)", "Gue-sung Cho (FC Midtjylland)"] },

  { code: "CZE", cc: "cz", country: "Tsjechië",
    K: ["Lukáš Horníček (Braga SC)", "Matěj Kovář (PSV)", "Jindřich Staněk (SK Slavia Praag)"],
    V: ["Vladimír Coufal (TSG Hoffenheim)", "David Douděra (SK Slavia Praag)", "Tomáš Holeš (SK Slavia Praag)", "Robin Hranáč (TSG Hoffenheim)", "Štěpán Chaloupek (SK Slavia Praag)", "David Jurásek (SK Slavia Praag)", "Ladislav Krejčí (Wolverhampton Wanderers)", "Jaroslav Zelený (AC Sparta Praag)", "David Zima (SK Slavia Praag)"],
    M: ["Lukáš Červ (Viktoria Plzeň)", "Vladimír Darida (FC Hradec Králové)", "Lukáš Provod (SK Slavia Praag)", "Michal Sadílek (SK Slavia Praag)", "Hugo Sochůrek (AC Sparta Praag)", "Alexandr Sojka (FC Viktoria Plzeň)", "Tomáš Souček (West Ham United)", "Pavel Šulc (Olympique Lyonnais)", "Denis Višinský (FC Viktoria Plzeň)"],
    A: ["Adam Hložek (TSG Hoffenheim 1899)", "Tomáš Chorý (SK Slavia Praag)", "Mojmír Chytil (SK Slavia Praag)", "Jan Kuchta (AC Sparta Praag)", "Patrik Schick (Bayer 04 Leverkusen)"] },

  /* ---------------- Poule B ---------------- */
  { code: "CAN", cc: "ca", country: "Canada",
    K: ["Maxime Crépeau (Orlando City)", "Owen Goodman (Barnsley)", "Dayne St. Clair (Inter Miami)"],
    V: ["Moïse Bombito (OGC Nice)", "Derek Cornelius (Olympique Marseille)", "Alphonso Davies (Bayern München)", "Luc de Fougerolles (Fulham)", "Alistair Johnston (Celtic)", "Alfie Jones (Middlesbrough)", "Richie Laryea (Toronto FC)", "Niko Sigur (Hajduk Split)", "Joel Waterman (Chicago Fire)"],
    M: ["Ali Ahmed (Norwich City)", "Tajon Buchanan (Villarreal)", "Mathieu Choinière (LAFC)", "Stephen Eustáquio (FC Porto)", "Marcelo Flores (Tigres UANL)", "Ismaël Koné (Sassuolo)", "Liam Millar (Hull City)", "Jonathan Osorio (Toronto FC)", "Nathan Saliba (Anderlecht)", "Jacob Shaffelburg (LAFC)"],
    A: ["Jonathan David (Juventus)", "Promise David (Royale Union Saint-Gilloise)", "Cyle Larin (Real Mallorca)", "Tani Oluwaseyi (Villarreal)"] },

  { code: "BIH", cc: "ba", country: "Bosnië en Herzegovina",
    K: ["Nikola Vasilj (FC St. Pauli)", "Martin Zlomislić (HNK Rijeka)", "Osman Hadžikić (Slaven Belupo)"],
    V: ["Sead Kolašinac (Atalanta)", "Amar Dedić (Benfica)", "Nihad Mujakić (Gaziantep FK)", "Nikola Katić (Schalke 04)", "Tarik Muharemović (Sassuolo)", "Stjepan Radeljić (HNK Rijeka)", "Dennis Hadžikadunić (Sampdoria)", "Nidal Čelik (RC Lens)"],
    M: ["Amir Hadžiahmetović (Hull City)", "Ivan Šunjić (Pafos FC)", "Ivan Bašić (FC Astana)", "Dženis Burnić (Karlsruher SC)", "Ermin Mahmić (Slovan Liberec)", "Benjamin Tahirović (Brøndby)", "Amar Memić (Viktoria Plzeň)", "Armin Gigović (Young Boys)", "Kerim Alajbegović (RB Salzburg)"],
    A: ["Esmir Bajraktarević (PSV)", "Ermedin Demirović (VfB Stuttgart)", "Jovo Lukić (Universitatea Cluj)", "Samed Baždar (Jagiellonia Białystok)", "Haris Tabaković (Borussia Mönchengladbach)", "Edin Džeko (Schalke 04)"] },

  { code: "QAT", cc: "qa", country: "Qatar",
    K: ["Mahmud Abunada (Al-Rayyan)", "Salah Zakaria (Al-Duhail)", "Meshaal Barsham (Al-Sadd)"],
    V: ["Pedro Miguel (Al-Sadd)", "Lucas Mendes (Al-Wakrah)", "Issa Laye (Al-Arabi)", "Ayoub Al-Oui (Al-Gharafa)", "Homam Ahmed (Cultural Leonesa)", "Boualem Khoukhi (Al-Sadd)", "Sultan Al-Brake (Al-Duhail)", "Al-Hashmi Al-Hussain (Al-Arabi)"],
    M: ["Jassem Gaber (Al-Rayyan)", "Abdulaziz Hatem (Al-Rayyan)", "Karim Boudiaf (Al-Duhail)", "Ahmed Fathy (Al-Arabi)", "Assim Madibo (Al-Wakrah)", "Tahsin Jamshid (Al-Duhail)", "Mohamed Al-Mannai (Al-Shamal)"],
    A: ["Ahmed Alaaeldin (Al-Rayyan)", "Edmilson Junior (Al-Duhail)", "Mohammed Muntari (Al-Gharafa)", "Hassan Al-Haydos (Al-Sadd)", "Akram Afif (Al-Sadd)", "Yusuf Abdurisag (Al-Wakrah)", "Ahmed Al-Ganehi (Al-Gharafa)", "Almoez Ali (Al-Duhail)"] },

  { code: "SUI", cc: "ch", country: "Zwitserland",
    K: ["Gregor Kobel (Borussia Dortmund)", "Marvin Keller (Young Boys)", "Yvon Mvogo (Lorient)"],
    V: ["Ricardo Rodríguez (Real Betis)", "Manuel Akanji (Internazionale, huur)", "Silvan Widmer (FSV Mainz 05)", "Miro Muheim (Hamburger SV)", "Nico Elvedi (Borussia Mönchengladbach)", "Eray Cömert (Valencia)", "Aurèle Amenda (Eintracht Frankfurt)", "Luca Jaquez (VfB Stuttgart)"],
    M: ["Remo Freuler (Bologna)", "Granit Xhaka (Sunderland)", "Noah Okafor (Leeds United)", "Djibril Sow (Sevilla)", "Denis Zakaria (AS Monaco)", "Johan Manzambi (SC Freiburg)", "Ardon Jashari (AC Milan)", "Christian Fassnacht (Young Boys)", "Michel Aebischer (Pisa)"],
    A: ["Dan Ndoye (Nottingham Forest)", "Zeki Amdouni (Burnley)", "Breel Embolo (Stade Rennais)", "Ruben Vargas (Sevilla)", "Fabian Rieder (Augsburg)", "Cedric Itten (Fortuna Düsseldorf)"] },

  /* ---------------- Poule C ---------------- */
  { code: "BRA", cc: "br", country: "Brazilië",
    K: ["Alisson Becker (Liverpool)", "Ederson (Fenerbahçe)", "Weverton (Gremio)"],
    V: ["Alex Sandro (Flamengo)", "Bremer (Juventus)", "Danilo (Flamengo)", "Douglas Santos (Zenit Sint-Petersburg)", "Gabriel Magalhães (Arsenal)", "Leo Pereira (Flamengo)", "Marquinhos (Paris Saint-Germain)", "Roger Ibañez (Al-Ahli)", "Wesley (AS Roma)"],
    M: ["Bruno Guimarães (Newcastle United)", "Casemiro (Manchester United)", "Danilo (Botafogo)", "Fabinho (Al-Ittihad)", "Lucas Paqueta (Flamengo)"],
    A: ["Endrick (Olympique Lyon)", "Gabriel Martinelli (Arsenal)", "Igor Thiago (Brentford)", "Luiz Henrique (Zenit Sint-Petersburg)", "Matheus Cunha (Manchester United)", "Neymar (Santos)", "Raphinha (FC Barcelona)", "Rayan (Bournemouth)", "Vinicius Junior (Real Madrid)"] },

  { code: "MAR", cc: "ma", country: "Marokko",
    K: ["Mounir El Kajoui (RS Berkane)", "Yassine Bounou (Al-Hilal)", "Ahmed Reda Tagnaouti (AS FAR Rabat)"],
    V: ["Achraf Hakimi (Paris Saint-Germain)", "Issa Diop (Fulham)", "Anass Salah-Eddine (PSV)", "Chadi Riad (Crystal Palace)", "Redouane Halhal (KV Mechelen)", "Zakaria El Ouahdi (KRC Genk)", "Youssef Belammari (Al Ahly)", "Noussair Mazraoui (Manchester United)", "Marwane Saâdane (Al Fateh)"],
    M: ["Azzeddine Ounahi (Girona)", "Bilal El Khannouss (VfB Stuttgart)", "Ismael Saibari (PSV)", "Ayyoub Bouaddi (LOSC Lille)", "Sofyan Amrabat (Real Betis)", "Neil El Aynaoui (AS Roma)", "Samir El Mourabet (RC Strasbourg)"],
    A: ["Brahim Díaz (Real Madrid)", "Abdessamad Ezzalzouli (Real Betis)", "Yassine Gessime (RC Strasbourg)", "Chemsdine Talbi (Sunderland)", "Soufiane Rahimi (Al-Ain)", "Ayoub El Kaabi (Olympiakos)", "Ayoube Amaimouni (Eintracht Frankfurt)", "Amine Sbaï (Angers)"] },

  { code: "HAI", cc: "ht", country: "Haïti",
    K: ["Johny Placide (SC Bastia)", "Alexandre Pierre (FC Sochaux)", "Josué Duverger (Cosmos Koblenz)"],
    V: ["Carlens Arcus (Angers)", "Wilguens Paugain (Zulte Waregem)", "Ricardo Adé (LDU Quito)", "Jean Kévin Duverne (KAA Gent)", "Hannes Delcroix (FC Lugano)", "Keeto Thermoncy (Young Boys)", "Martin Expérience (AS Nancy)", "Duke Lacroix (Colorado Springs)"],
    M: ["Josué Casimir (AJ Auxerre)", "Leverton Pierre (FC Vizela)", "Dominique Simon (Tatran Presov)", "Woodensky Pierre (Violette AC)", "Carl Fred Sainté (El Paso Locomotive)", "Danley Jean-Jacques (Philadelphia Union)", "Jean Ricner Bellegarde (Wolverhampton)"],
    A: ["Duckens Nazon (Esteghlal)", "Frantzdy Pierrot (Rizespor)", "Deedson Louicius (FC Dallas)", "Ruben Providence (Almere City)", "Yassin Fortuné (Vizela)", "Wilson Isidor (Sunderland)", "Lenny Joseph (Ferencváros)", "Derrick Etienne jr. (Toronto FC)"] },

  { code: "SCO", cc: "gb-sct", country: "Schotland",
    K: ["Craig Gordon (Hearts)", "Angus Gunn (Nottingham Forest)", "Liam Kelly (Rangers)"],
    V: ["Grant Hanley (Hibernian)", "Jack Hendry (Al Etiffaq)", "Aaron Hickey (Brentford)", "Dom Hyam (Wrexham)", "Scott McKenna (Dinamo Zagreb)", "Nathan Patterson (Everton)", "Anthony Ralston (Celtic)", "Andy Robertson (Liverpool)", "John Souttar (Rangers)", "Kieran Tierney (Celtic)"],
    M: ["Ryan Christie (Bournemouth)", "Finlay Curtis (Kilmarnock)", "Lewis Ferguson (Bologna)", "Ben Gannon-Doak (Bournemouth)", "John McGinn (Aston Villa)", "Kenny McLean (Norwich)", "Scott McTominay (Napoli)", "Tyler Fletcher (Manchester United)"],
    A: ["Che Adams (Torino)", "Lyndon Dykes (Charlton Athletic)", "George Hirst (Ipswich)", "Lawrence Shankland (Hearts)", "Ross Stewart (Southampton)"] },

  /* ---------------- Poule D ---------------- */
  { code: "USA", cc: "us", country: "Verenigde Staten",
    K: ["Chris Brady (Chicago Fire)", "Matt Freese (New York City)", "Matt Turner (New England Revolution)"],
    V: ["Max Arfsten (Columbus Crew)", "Sergiño Dest (PSV)", "Alex Freeman (Villarreal)", "Mark McKenzie (Toulouse)", "Tim Ream (Charlotte FC)", "Chris Richards (Crystal Palace)", "Antonee Robinson (Fulham)", "Miles Robinson (FC Cincinnati)", "Joe Scally (Borussia Mönchengladbach)", "Auston Trusty (Celtic)"],
    M: ["Tyler Adams (AFC Bournemouth)", "Sebastian Berhalter (Vancouver Whitecaps)", "Weston McKennie (Juventus)", "Cristian Roldan (Seattle Sounders)", "Malik Tillman (Bayer Leverkusen)", "Brenden Aaronson (Leeds United)"],
    A: ["Folarin Balogun (AS Monaco)", "Ricardo Pepi (PSV)", "Haji Wright (Coventry City)", "Christian Pulisic (Milan)", "Giovanni Reyna (Borussia Mönchengladbach)", "Timothy Weah (Marseille)", "Alejandro Zendejas (Club América)"] },

  { code: "PAR", cc: "py", country: "Paraguay",
    K: ["Orlando Gill (San Lorenzo)", "Roberto Junior Fernández (Club Cerro Porteño)", "Gastón Olveira (Olympia Asunción)"],
    V: ["Juan José Cáceres (Dinamo Moskou)", "Gustavo Velázquez (Club Cerro Porteño)", "Gustavo Gómez (Palmeiras)", "Júnior Alonso (Atlético Mineiro)", "José Canale (Lanús)", "Omar Alderete (Sunderland)", "Alexandro Maidana (CA Tallares)", "Fabián Balbuena (Gremio)"],
    M: ["Diego Gómez (Brighton & Hove Albion)", "Mauricio Magalhães (Palmeiras)", "Damián Bobadilla (São Paulo)", "Braian Ojeda (Orlando City)", "Andrés Cubas (Vancouver Whitecaps)", "Matías Galarza (CA Tallares)", "Alejandro Gamarra (Al-Ain)"],
    A: ["Gustavo Caballero (Portsmouth)", "Ramón Sosa (Palmeiras)", "Álex Arce (CS Independiente Rivadavia)", "Isidro Pitta (Red Bull Bragantino)", "Gabriel Ávalos (CA Independiente)", "Miguel Almirón (Atlanta United)", "Julio Enciso (Strasbourg)", "Antonio Sanabria (Cremonense)"] },

  { code: "AUS", cc: "au", country: "Australië",
    K: ["Mathew Ryan (Levante UD)", "Paul Izzo (Randers FC)", "Patrick Beach (Melbourne City FC)"],
    V: ["Jordan Bos (Feyenoord)", "Aziz Behich (Melbourne City FC)", "Harry Souttar (Leicester City)", "Alessandro Circati (Parma)", "Lucas Herrington (Colorado Rapids)", "Cameron Burgess (Swansea City)", "Kai Trewin (New York City FC)", "Miloš Degenek (APOEL Nicosia)", "Jason Geria (Albirex Niigata)", "Jacob Italiano (Grazeker AK 1902)"],
    M: ["Jackson Irvine (St. Pauli)", "Aiden O'Neill (New York City FC)", "Paul Okon-Engstler (Sydney FC)", "Cameron Devlin (Heart of Midlothian FC)"],
    A: ["Connor Metcalfe (St. Pauli)", "Matthew Leckie (Melbourne City FC)", "Nishan Velupillay (Melbourne Victory)", "Cristian Volpato (US Sassuolo)", "Nestory Irankunda (Watford)", "Awer Mabil (CD Castellón)", "Ajdin Hrustić (Heracles Almelo)", "Mohamed Touré (Norwich City)", "Tete Yengi (Machida Zelvia)"] },

  { code: "TUR", cc: "tr", country: "Turkije",
    K: ["Uğurcan Çakir (Galatasaray)", "Altay Bayindir (Manchester United)", "Mert Günok (Besiktas)"],
    V: ["Ferdi Kadioglu (Brighton and Hove Albion)", "Merih Demiral (Al Ahli)", "Zeki Çelik (AS Roma)", "Ozan Kabak (Hoffenheim)", "Mert Müldür (Fenerbahçe)", "Abdulkerim Bardakci (Galatasaray)", "Eren Elmali (Galatasaray)", "Çağlar Söyüncü (Fenerbahçe)", "Samet Akaydin (Rizespor)"],
    M: ["Orkun Kokcü (Besiktas)", "Hakan Çalhanoğlu (Internazionale)", "Ismail Yüksek (Fenerbahçe)", "Kaan Ayhan (Galatasaray)", "Salih Özcan (Borussia Dortmund)"],
    A: ["Arda Güler (Real Madrid)", "Kenan Yildiz (Juventus)", "Can Uzun (Eintracht Frankfurt)", "Baris Alper Yilmaz (Galatasaray)", "Kerem Aktürkoğlu (Fenerbahçe)", "Yunus Akgün (Galatasaray)", "Oğuz Aydin (Fenerbahçe)", "Deniz Gül (FC Porto)", "Irfan Can Kahveci (Fenerbahçe)"] },

  /* ---------------- Poule E ---------------- */
  { code: "GER", cc: "de", country: "Duitsland",
    K: ["Manuel Neuer (Bayern München)", "Oliver Baumann (TSG Hoffenheim)", "Alexander Nübel (VfB Stuttgart)"],
    V: ["Nico Schlotterbeck (Borussia Dortmund)", "Antonio Rüdiger (Real Madrid)", "David Raum (RB Leipzig)", "Jonathan Tah (Bayern München)", "Waldemar Anton (Borussia Dortmund)", "Nathaniel Brown (Eintracht Frankfurt)", "Malick Thiaw (Newcastle United)"],
    M: ["Joshua Kimmich (Bayern München)", "Jamal Musiala (Bayern München)", "Pascal Gross (Brighton & Hove Albion)", "Leon Goretzka (Bayern München)", "Florian Wirtz (Liverpool)", "Aleksander Pavlovic (Bayern München)", "Felix Nmecha (Borussia Dortmund)", "Angelo Stiller (VfB Stuttgart)", "Nadiem Amiri (FSV Mainz)"],
    A: ["Leroy Sané (Galatasaray)", "Nick Woltemade (Newcastle United)", "Deniz Undav (VfB Stuttgart)", "Jamie Leweling (VfB Stuttgart)", "Kai Havertz (Arsenal)", "Lennart Karl (Bayern München)", "Maximilian Beier (Borussia Dortmund)"] },

  { code: "CUW", cc: "cw", country: "Curaçao",
    K: ["Tyrick Bodak (Telstar)", "Trevor Doornbusch (VVV-Venlo)", "Eloy Room (Miami FC)"],
    V: ["Riechedly Bazoer (Konyaspor)", "Joshua Brenet (Kayserispor)", "Roshon Van Eijma (RKC Waalwijk)", "Sherel Floranus (PEC Zwolle)", "Deveron Fonville (N.E.C.)", "Juriën Gaari (Abha Club)", "Armando Obispo (PSV)", "Shurandy Sambo (Sparta Rotterdam)"],
    M: ["Juninho Bacuna (FC Volendam)", "Leandro Bacuna (Iğdır)", "Livano Comenencia (FC Zürich)", "Kevin Felida (FC Den Bosch)", "Ar'Jany Martha (Rotherham United)", "Tyrese Noslin (Telstar)", "Godfried Roemeratoe (RKC Waalwijk)"],
    A: ["Jeremy Antonisse (AE Kifisia)", "Tahith Chong (Sheffield United)", "Kenji Gorré (Maccabi Haifa)", "Sontje Hansen (Middlesbrough)", "Gervane Kastaneer (Terengganu FC)", "Brandley Kuwas (FC Volendam)", "Jürgen Locadia (Miami FC)", "Jearl Margaritha (SK Beveren)"] },

  { code: "CIV", cc: "ci", country: "Ivoorkust",
    K: ["Yahia Fofana (Çaykur Rizespor)", "Mohamed Koné (Sporting Charleroi)", "Alban Lafont (Panathinaikos)"],
    V: ["Ghislain Konan (Gil Vicente)", "Odilon Kossounou (Atalanta)", "Wilfried Singo (Galatasaray)", "Evan Ndicka (AS Roma)", "Emmanuel Agbadou (Besiktas)", "Guela Doue (Strasbourg)", "Ousmane Diomande (Sporting CP)", "Christopher Operi (Istanbul Basaksehir)"],
    M: ["Franck Kessie (Al-Ahli)", "Jean Michael Seri (Maribor)", "Ibrahim Sangare (Nottingham Forest)", "Seko Fofana (FC Porto)", "Christ Inao Oulai (Trabzonspor)", "Parfait Guiagon (Charleroi)"],
    A: ["Nicolas Pepe (Villarreal)", "Oumar Diakite (Cercle Brugge)", "Simon Adingra (AS Monaco)", "Evann Guessand (Crystal Palace)", "Amad Diallo (Manchester United)", "Yan Diomande (RB Leipzig)", "Bazoumana Toure (TSG Hoffenheim)", "Elye Wahi (Nice)", "Ange-Yoan Bonny (Inter)"] },

  { code: "ECU", cc: "ec", country: "Ecuador",
    K: ["Hernán Galindez (Huracán)", "Moisés Ramírez (Kifisia)", "Gonzalo Valle (LDU Quito)"],
    V: ["Angelo Preciado (Atlético Mineiro)", "Pervis Estupiñán (AC Milan)", "Piero Hincapié (Arsenal)", "Félix Torres (Internacional)", "Willian Pacho (PSG)", "Joel Ordóñez (Club Brugge)", "Jackson Porozo (Tijuana)"],
    M: ["Moisés Caicedo (Chelsea)", "Alan Franco (Atlético Mineiro)", "Gonzalo Plata (Flamengo)", "Kendry Paez (River Plate)", "John Yeboah (Venezia)", "Alan Minda (Atlético Mineiro)", "Pedro Vite (UNAM)", "Jordy Alcivar (Independiente del Valle)", "Denil Castillo (Midtjylland)", "Yaimar Medina (Genk)"],
    A: ["Enner Valencia (Pachuca)", "Kevin Rodríguez (Union Saint-Gilloise)", "Jordy Caicedo (Huracán)", "Nilson Angulo (Sunderland)", "Jeremy Arevalo (VfB Stuttgart)", "Anthony Valencia (Antwerp)"] },

  /* ---------------- Poule F ---------------- */
  { code: "NED", cc: "nl", country: "Nederland",
    K: ["Bart Verbruggen (Brighton)", "Robin Roefs (Sunderland)", "Mark Flekken (Bayer Leverkusen)"],
    V: ["Denzel Dumfries (Internazionale)", "Virgil van Dijk (Liverpool FC)", "Micky van de Ven (Tottenham Hotspur)", "Nathan Aké (Manchester City)", "Jorrel Hato (Chelsea)", "Jan Paul van Hecke (Brighton)", "Mats Wieffer (Brighton)", "Lutsharel Geertruida (Sunderland)"],
    M: ["Ryan Gravenberch (Liverpool)", "Frenkie de Jong (FC Barcelona)", "Tijjani Reijnders (Manchester City)", "Teun Koopmeiners (Juventus)", "Marten de Roon (Atalanta)", "Guus Til (PSV)", "Quinten Timber (Olympique Marseille)"],
    A: ["Donyell Malen (AS Roma)", "Memphis Depay (Corinthians)", "Cody Gakpo (Liverpool)", "Wout Weghorst (Ajax)", "Justin Kluivert (Bournemouth)", "Brian Brobbey (Sunderland)", "Crysencio Summerville (West Ham United)", "Noa Lang (Napoli)"] },

  { code: "JPN", cc: "jp", country: "Japan",
    K: ["Zion Suzuki (Parma)", "Keisuke Osako (Sanfrecce Hiroshima)", "Tomoki Hayakawa (Kashima Antlers)"],
    V: ["Yuta Nagatomo (FC Tokyo)", "Shogo Taniguchi (Sint-Truiden)", "Ko Itakura (Ajax)", "Tsuyoshi Watanabe (Feyenoord)", "Takehiro Tomiyasu (Ajax)", "Hiroki Ito (Bayern München)", "Ayumu Seko (Le Havre)", "Yukinari Sugawara (Werder Bremen)", "Junnosuke Suzuki (FC Kopenhagen)"],
    M: ["Junya Ito (Genk)", "Daichi Kamada (Crystal Palace)", "Ritsu Doan (Eintracht Frankfurt)", "Ao Tanaka (Leeds United)", "Kaishu Sano (Mainz)", "Yuito Suzuki (Freiburg)"],
    A: ["Kōki Ogawa (N.E.C.)", "Daizen Maeda (Celtic)", "Ayase Ueda (Feyenoord)", "Kento Shiogai (VfL Wolfsburg)", "Keisuke Gotō (Sint-Truiden)", "Keito Nakamura (Reims)", "Takefusa Kubo (Real Sociedad)", "Shuto Machino (Borussia Mönchengladbach)"] },

  { code: "SWE", cc: "se", country: "Zweden",
    K: ["Kristoffer Nordfeldt (AIK Solna)", "Viktor Johansson (Stoke City)", "Jacob Widell Zetterström (Derby County)"],
    V: ["Daniel Svensson (Borussia Dortmund)", "Victor Lindelöf (Aston Villa)", "Isak Hien (Atalanta)", "Carl Starfelt (Celta Vigo)", "Elliot Stroud (Mjällby AIF)", "Gustaf Lagerbielke (SC Braga)", "Gabriel Gudmundsson (Leeds United)", "Hjalmar Ekdal (Burnley)", "Eric Smith (FC St. Pauli)"],
    M: ["Yasin Ayari (Brighton)", "Lucas Bergvall (Tottenham Hotspur)", "Jesper Karlström (Udinese)", "Mattias Svanberg (VfL Wolfsburg)", "Besfort Zeneli (Union Saint-Gilloise)", "Herman Johansson (FC Dallas)"],
    A: ["Taha Ali (Malmö FF)", "Anthony Elanga (Newcastle United)", "Viktor Gyökeres (Arsenal)", "Gustaf Nilsson (Club Brugge)", "Benjamin Nygren (Celtic)", "Alexander Isak (Liverpool)", "Alexander Bernhardsson (Holstein Kiel)", "Ken Sema (Pafos FC)"] },

  { code: "TUN", cc: "tn", country: "Tunesië",
    K: ["Aymen Dahmen (CS Sfaxien)", "Sabri Ben Hassen (Es Sahel)", "Abdelmouhib Chamakh (Club Africain)"],
    V: ["Yan Valéry (Young Boys)", "Moutaz Neffati (IFK Norrköping)", "Dylan Bronn (Servette FC)", "Raed Chikhaoui (US Monastir)", "Montassar Talbi (FC Lorient)", "Adem Arous (Kasimpasa)", "Omar Rekik (NK Maribor)", "Ali Abdi (OGC Nice)", "Mohamed Ben Hmida (Esperance)"],
    M: ["Ellyes Skhiri (Eintract Frankfurt)", "Anis Ben Slimane (Norwich City)", "Rani Khedira (Union Berlin)", "Mortada Ben Ouanes (Kasimpasa)", "Ismaël Gharbi (Augsburg)", "Mohamed Hadj-Mahmoud (Lugano)", "Hannibal Mejrbi (Burnley)"],
    A: ["Elias Saad (Hannover 96)", "Khalil Ayari (Paris Saint-Germain)", "Elias Achouri (FC Kopenhagen)", "Sebastien Tounekti (Celtic)", "Hazem Mastouri (Dynamo Machatsjkala)", "Firas Chawat (Club Africain)", "Rayan Elloumi (Vancouver Whitecaps)"] },

  /* ---------------- Poule G ---------------- */
  { code: "BEL", cc: "be", country: "België",
    K: ["Thibaut Courtois (Real Madrid)", "Senne Lammens (Manchester United)", "Mike Penders (Strasbourg)"],
    V: ["Arthur Theate (Eintracht Frankfurt)", "Brandon Mechele (Club Brugge)", "Nathan Ngoy (Lille)", "Koni De Winter (AC Milan)", "Zeno Debast (Sporting)", "Maxim De Cuyper (Brighton)", "Joaquin Seys (Club Brugge)", "Thomas Meunier (Lille)", "Timothy Castagne (Fulham)"],
    M: ["Nicolas Raskin (Rangers)", "Axel Witsel (Girona)", "Hans Vanaken (Club Brugge)", "Kevin De Bruyne (Napoli)", "Youri Tielemans (Aston Villa)", "Amadou Onana (Aston Villa)"],
    A: ["Jeremy Doku (Manchester City)", "Alexis Saelemaekers (AC Milan)", "Matías Fernández Pardo (Lille)", "Diego Moreira (Strasbourg)", "Romelu Lukaku (Napoli)", "Leandro Trossard (Arsenal)", "Charles De Ketelaere (Atalanta)", "Dodi Lukebakio (Benfica)"] },

  { code: "EGY", cc: "eg", country: "Egypte",
    K: ["Mohamed Elshenawy (Al-Ahly)", "Mostafa Shobeir (Al-Ahly)", "El-Mahdy Soliman (Zamalek SC)", "Mohamed Alaa (El-Gounah)"],
    V: ["Mohamed Hany (Al-Ahly)", "Ramy Rabia (Al-Ain)", "Yasser Ibrahim (Al-Ahly)", "Tarek Alaa (Zed FC)", "Mohamed Abdelmonem (OGC Nice)", "Karim Hafez (Pyramids FC)", "Hossam Abdelmeguid (Zamalek SC)", "Ahmed Fatouh (Zamalek SC)"],
    M: ["Marwan Attia (Al-Ahly)", "Hamdy Fathy (Al-Wakrah)", "Mohanad Lasheen (Pyramids FC)", "Mahmoud Saber (Zed FC)", "Emam Ashour (Al-Ahly)", "Ahmed Sayed Zizo (Al-Ahly)", "Ibrahim Adel (Al-Jazira)", "Mostafa Ziko (Pyramids FC)", "Nabil Emad Donga (Al-Nejma)"],
    A: ["Omar Marmoush (Manchester City)", "Mahmoud Trézéguet (Al-Ahly)", "Mohamed Salah (Liverpool)", "Hamza Abdelkarim (FC Barcelona B)", "Haissem Hassen (Real Oviedo)"] },

  { code: "IRN", cc: "ir", country: "Iran",
    K: ["Alireza Beiranvand (Tractor)", "Hossein Hosseini (Sepahan)", "Payam Niazmand (Persepolis)"],
    V: ["Danial Eiri (Malavan)", "Ehsan Hajsafi (Sepahan)", "Saleh Hardani (Esteghlal)", "Hossein Kanaani (Persepolis)", "Shoja Khalilzadeh (Tractor)", "Milad Mohammadi (Persepolis)", "Ali Nemati", "Omid Noorafkan (Foolad)", "Ramin Rezaeian (Foolad)"],
    M: ["Rouzbeh Cheshmi (Esteghlal)", "Saeid Ezatolahi (Shabab Al-Ahli)", "Mehdi Ghaedi (Al-Nassr)", "Saman Ghoddos (Kalba)", "Mohammad Ghorbani (Al-Wahda)", "Alireza Jahanbakhsh (FC Dender)", "Mohammad Mohebi (Rostov)", "Amir Mohammad Razzaghinia (Esteghlal)", "Mehdi Torabi (Tractor)", "Aria Yousefi (Sepahan)"],
    A: ["Ali Alipour (Persepolis)", "Dennis Dargahi (Standard Luik)", "Amirhossein Hosseinzadeh (Tractor)", "Shahriyar Moghanlou (Kalba)", "Mehdi Taremi (Olympiakos Piraeus)"] },

  { code: "NZL", cc: "nz", country: "Nieuw-Zeeland",
    K: ["Max Crocombe (Millwall)", "Alex Paulsen (Lechia Gdańsk)", "Michael Woud (Auckland FC)"],
    V: ["Tim Payne (Wellington Phoenix)", "Francis De Vries (Auckland FC)", "Tyler Bindon (Nottingham Forest)", "Michael Boxall (Minnesota United)", "Liberato Cacace (Wrexham)", "Nando Pijnaker (Auckland FC)", "Finn Surman (Portland Timbers)", "Callan Elliot (Auckland FC)", "Tommy Smith (Braintree Town)"],
    M: ["Joe Bell (Viking FK)", "Matt Garbett (Peterborough United)", "Marko Stamenic (Swansea City)", "Sarpreet Singh (Wellington Phoenix)", "Alex Rufer (Wellington Phoenix)", "Ryan Thomas (PEC Zwolle)"],
    A: ["Chris Wood (Nottingham Forest)", "Eli Just (Motherwell)", "Kosta Barbarouses (Western Sydney Wanderers)", "Ben Waine (Port Vale)", "Ben Old (Saint-Étienne)", "Callum McCowatt (Silkeborg IF)", "Jesse Randall (Auckland FC)", "Lachlan Bayliss (Newcastle Jets)"] },

  /* ---------------- Poule H ---------------- */
  { code: "ESP", cc: "es", country: "Spanje",
    K: ["Unai Simón (Athletic Club)", "David Raya (Arsenal)", "Joan Garcia (FC Barcelona)"],
    V: ["Marc Cucurella (Chelsea)", "Alejandro Grimaldo (Bayer Leverkussen)", "Pau Cubarsí (FC Barcelona)", "Aymeric Laporte (Athletic Club)", "Marc Pubill (Atletico Madrid)", "Eric Garcia (FC Barcelona)", "Marcos Llorente (Atletico Madrid)", "Pedro Porro (Tottenham Hotspur)"],
    M: ["Pedri (FC Barcelona)", "Fabián Ruiz (Paris Saint-Germain)", "Martín Zubimendi (Arsenal)", "Gavi (FC Barcelona)", "Rodri (Manchester City)", "Álex Baena (Atletico Madrid)", "Mikel Merino (Arsenal)"],
    A: ["Mikel Oyarzabal (Real Sociedad)", "Dani Olmo (FC Barcelona)", "Nico Williams (Athletic Club)", "Yeremy Pino (Crystal Palace)", "Ferran Torres (FC Barcelona)", "Borja Iglesias (Celta de Vigo)", "Victor Munoz (Osasuna)", "Lamine Yamal (FC Barcelona)"] },

  { code: "CPV", cc: "cv", country: "Kaapverdië",
    K: ["Carlos dos Santos (San Diego)", "Marcio Rosa (Montana 1921)", "Vozinha (Chaves)"],
    V: ["Sidny Cabral (Benfica)", "Diney Borges (Al Bataeh)", "Logan Costa (Villarreal)", "Roberto Lopes (Shamrock Rovers)", "Steven Moreira (Columbus Crew)", "Wagner Pina (Trabzonspor)", "Kelvin Pires (SJK Seinäjoki)", "Stopira (Torreense)"],
    M: ["Telmo Arcanjo (Vitoria Guimaraes)", "Deroy Duarte (Ludogorets)", "Laros Duarte (Puskas Akademia)", "Joao Paulo Fernandes (Oțelul Galați)", "Jamiro Monteiro (PEC Zwolle)", "Kevin Pina (FK Krasnodar)", "Yannick Semedo (Farense)"],
    A: ["Gilson Benchimol", "Jovane Cabral (Estrela Amadora)", "Dailon Livramento (Casa Pia)", "Ryan Mendes (Igdir FK)", "Nuno da Costa (Istanbul Basaksehir)", "Garry Rodrigues (Apollon Limassol)", "Willy Semedo (Omonia Nicosia)", "Helio Varela (Maccabi Tel Aviv)"] },

  { code: "KSA", cc: "sa", country: "Saoedi-Arabië",
    K: ["Mohammed Al Owais (Al Ula)", "Nawaf Al Aqidi (Al Nassr)", "Ahmed Al Kassar (Al Qadsiah)"],
    V: ["Abdulelah Al Amri (Al Nassr)", "Hassan Tambakti (Al Hilal)", "Jehad Thikri (Al Qadsiah)", "Ali Lajami (Al Hilal)", "Hassan Kadesh (Al Ittihad)", "Saud Abdulhamid (Lens)", "Mohammed Abu Al Shamat (Al Qadsiah)", "Ali Majrashi (Al Ahli)", "Moteb Al Harbi (Al Hilal)", "Nawaf Boushal (Al Nassr)", "Sultan Al-Ghannam (Al Nassr)"],
    M: ["Mohammed Kanno (Al Hilal)", "Abdullah Al Khaibari (Al Nassr)", "Ziyad Al Johani (Al Ahli)", "Nasser Al Dawsari (Al Hilal)", "Musab Al Juwayr (Al Qadsiah)", "Alaa Al Hajji (Neom)", "Salem Al Dawsari (Al Hilal)", "Khalid Al Ghannam (Al Ettifaq)", "Ayman Yahya (Al Nassr)"],
    A: ["Firas Al Buraikan (Al Ahli)", "Saleh Al Shehri (Al Ittihad)", "Abdullah Al Hamdan (Al Nassr)"] },

  { code: "URU", cc: "uy", country: "Uruguay",
    K: ["Fernando Muslera (Estudiantes de La Plata)", "Sergio Rochet (International)", "Santiago Mele (Monterrey)"],
    V: ["Ronald Araujo (FC Barcelona)", "Sebastián Cáceres (Club América)", "Santiago Bueno (Wolves)", "Mathías Olivera (Napoli)", "Matías Viña (River Plate)", "Joaquín Piquerez (Palmeiras)", "Guillermo Varela (Flamengo)", "Juan Manuel Sanabria (Real Salt Lake)"],
    M: ["Manuel Ugarte (Manchester United)", "Federico Valverde (Real Madrid)", "Rodrigo Bentancur (Tottenham Hotspur)", "Emiliano Martínez (Palmeiras)", "Giorgian De Arrascaeta (Flamengo)", "Nicolás De la Cruz (Flamengo)", "Rodrigo Zalazar (Sporting Portugal)", "Agustín Canobbio (Fluminense)", "Facundo Pellistri (Panathninaikos)", "Brian Rodríguez (Club América)", "Maxi Araújo (Sporting Portugal)"],
    A: ["Federico Viñas (Real Oviedo)", "Darwin Núñez (Al-Hilal)", "Rodrigo Aguirre (Tigres)"] },

  /* ---------------- Poule I ---------------- */
  { code: "FRA", cc: "fr", country: "Frankrijk",
    K: ["Mike Maignan (AC Milan)", "Robin Risser Birckel (RC Lens)", "Brice Samba (Stade Rennais)"],
    V: ["Lucas Digne (Aston Villa)", "Malo Gusto (Chelsea)", "Lucas Hernandez (Paris Saint-Germain)", "Théo Hernandez (Al-Hilal)", "Ibrahima Konaté (Liverpool)", "Jules Koundé (FC Barcelona)", "Maxence Lacroix (Crystal Palace)", "William Saliba (Arsenal)", "Dayot Upamecano (FC Bayern München)"],
    M: ["N'Golo Kanté (Fenerbahce)", "Manu Koné (AS Roma)", "Adrien Rabiot (AC Milan)", "Aurélien Tchouaméni (Real Madrid)", "Warren Zaïre-Emery (Paris Saint-Germain)"],
    A: ["Maghnes Akliouche (AS Monaco)", "Bradley Barcola (Paris Saint-Germain)", "Rayan Cherki (Manchester City)", "Ousmane Dembélé (Paris Saint-Germain)", "Désiré Doué (Paris Saint-Germain)", "Jean-Philippe Mateta (Crystal Palace)", "Kylian Mbappé (Real Madrid)", "Michael Olise (Bayern Munchen)", "Marcus Thuram (Inter Milan)"] },

  { code: "SEN", cc: "sn", country: "Senegal",
    K: ["Édouard Mendy (Al Ahli)", "Mory Diaw (Le Havre)", "Yehvann Diouf (OGC Nice)"],
    V: ["Krépin Diatta (AS Monaco)", "Antoine Mendy (OGC Nice)", "Kalidou Koulibaly (Al Hilal)", "El Hadji Malick Diouf (West Ham)", "Mamadou Sarr (Chelsea)", "Moussa Niakhaté (Olympique Lyon)", "Abdoulaye Seck (Maccabi Haifa)", "Ismail Jakobs (Galatasaray)"],
    M: ["Idrissa Gana Gueye (Everton)", "Pape Gueye (Villarreal)", "Lamine Camara (AS Monaco)", "Habib Diarra (Sunderland)", "Pathé Ciss (Rayo Vallecano)", "Pape Matar Sarr (Tottenham Hotspur)", "Bara Sapoko Ndiaye (Bayern München)"],
    A: ["Sadio Mané (Al Nassr)", "Ismaïla Sarr (Crystal Palace)", "Iliman Ndiaye (Everton)", "Assane Diao (Como)", "Ibrahim Mbaye (PSG)", "Nicolas Jackson (Bayern München)", "Bamba Dieng (Lorient)", "Cherif Ndiaye (Samsunspor)"] },

  { code: "IRQ", cc: "iq", country: "Irak",
    K: ["Fahad Talib (Al-Talaba SC)", "Jalal Hassan (Al-Zawraa SC)", "Ahmed Basil (Al-Shorta SC)"],
    V: ["Hussein Ali (Pogon Szczecin)", "Manaf Younis (Al-Shorta SC)", "Zaid Tahseen (Pachtakor Tasjkent)", "Rebin Sulaka (Port FC)", "Akam Hashem (Al-Zawraa SC)", "Merchas Doski (FC Viktoria Pilsen)", "Ahmed Yahya (Al-Shorta SC)", "Mustafa Saadoon (Al-Shorta SC)", "Frans Putros (Persib Bandung)"],
    M: ["Zidane Iqbal (FC Utrecht)", "Amir Al-Ammari (KS Cracovia)", "Zaid Ismail (Al-Talaba SC)", "Aimar Sher (Sarpsborg 08)", "Kevin Yakob (Aarhus GF)", "Ibrahim Bayesh (Al-Dhafra FC)", "Marko Farji (Venezia FC)", "Youssef Amyn (AEK Larnaca)", "Ahmed Qasem", "Ali Jassim (Al-Najma SC)"],
    A: ["Mohanad Ali (Dibba SCC)", "Aymen Hussein (Al-Karma)", "Ali Al-Hamadi (Luton Lown)", "Ali Yousef (Al-Talaba SC)"] },

  { code: "NOR", cc: "no", country: "Noorwegen",
    K: ["Orjan Haskjold Nyland (Sevilla)", "Egil Selvik (Watford)", "Sander Tangvik (Hamburger SV)"],
    V: ["Julian Ryerson (Borussia Dortmund)", "Marcus Holmgren Pedersen (Torino)", "David Moller Wolfe (Wolverhampton)", "Fredrik Bjorkan (Bodo/Glimt)", "Kristoffer Ajer (Brentford)", "Torbjorn Heggem (Bologna)", "Leo Skiri Ostigard (Genoa)", "Sondre Langas (Derby County)", "Henrik Falchener (Viking)"],
    M: ["Martin Odegaard (Arsenal)", "Sander Berge (Fulham)", "Fredrik Aursnes (Benfica)", "Patrick Berg (Bodo/Glimt)", "Kristian Thorstvedt (Sassuolo)", "Morten Thorsby (Cremonese)", "Thelo Aasgaard (Rangers)", "Antonio Nusa (RB Leipzig)", "Oscar Bobb (Fulham)", "Andreas Schjelderup (Benfica)", "Jens Petter Hauge (Bodo/Glimt)"],
    A: ["Erling Haaland (Manchester City)", "Alexander Sørloth (Atletico Madrid)", "Jørgen Strand Larsen (Crystal Palace)"] },

  /* ---------------- Poule J ---------------- */
  { code: "ARG", cc: "ar", country: "Argentinië",
    K: ["Gerónimo Rulli (Olympique Marseille)", "Emilio Martinez (Aston Villa)", "Juan Musso (Atlético Madrid)"],
    V: ["Nicolás Tagliafico (Olympique Lyonnais)", "Gonzalo Montiel (River Plate)", "Lisandro Martinez (Manchester United)", "Cristian Romero (Tottenham Hotspur)", "Nicolas Otamendi (Benfica)", "Facundo Medina (Olympique Marseille)", "Nahuel Molina (Atlético Madrid)", "Marcos Senesi (Tottenham Hotspur)"],
    M: ["Leandro Paredes (Boca Juniors)", "Rodrigo De Paul (Inter Miami)", "Valentin Barco (Strasbourg)", "Giovani Lo Celso (Real Betis)", "Exequiel Palacios (Bayer Leverkusen)", "Alexis Mac Allister (Liverpool)", "Enzo Fernandez (Chelsea)"],
    A: ["Lionel Messi (Inter Miami)", "Julian Álvarez (Atletico Madrid)", "Nicolás González (Atletico Madrid)", "Thiago Almada (Atletico Madrid)", "Giuliano Simeone (Atlético Madrid)", "Nico Paz (Como 1907)", "Lopez (Palmeiras)", "Lautaro Martinez (Internazionale)"] },

  { code: "ALG", cc: "dz", country: "Algerije",
    K: ["Luca Zidane (Granada CF)", "Oussama Benbot (USM Alger)", "Melvin Mastil (Stade Nyonnais)", "Abdelatif Ramdane (MC Alger)"],
    V: ["Rafik Belghali (Hellas Verona)", "Samir Chergui (Paris FC)", "Rayan Aït-Nouri (Manchester City)", "Jaouen Hadjam (BSC Young Boys)", "Aïssa Mandi (LOSC Lille)", "Ramy Bensebaïni (Borussia Dortmund)", "Zineddine Belaïd (JS Kabylie)", "Achref Abada (USM Alger)", "Mohamed Amine Tougaï (Espérance de Tunis)"],
    M: ["Nabil Bentaleb (LOSC Lille)", "Hicham Boudaoui (OGC Nice)", "Houssem Aouar (Al-Ittihad)", "Farès Chaïbi (Eintracht Frankfurt)", "Ibrahim Maza (Bayer Leverkusen)", "Yacine Titraoui (R. Charleroi SC)", "Ramiz Zerrouki (FC Twente)"],
    A: ["Mohamed Amine Amoura (VfL Wolfsburg)", "Nadhir Benbouali (ETO FC)", "Adil Boulbina (Al-Duhail SC)", "Farès Ghedjemis (Frosinone)", "Amine Gouiri (Olympique Marseille)", "Anis Hadj Moussa (Feyenoord)", "Riyad Mahrez (Al-Ahli)"] },

  { code: "AUT", cc: "at", country: "Oostenrijk",
    K: ["Patrick Pentz (Bröndby IF)", "Alexander Schlager (Red Bull Salzburg)", "Florian Wiegele (Viktoria Pilsen)"],
    V: ["David Affengruber (Elche CF)", "David Alaba (Real Madrid)", "Kevin Danso (Tottenham Hotspur)", "Marco Friedl (Werder Bremen)", "Philipp Lienhart (SC Freiburg)", "Phillipp Mwene (FSV Mainz 05)", "Stefan Posch (FSV Mainz 05)", "Alexander Prass (TSG 1899 Hoffenheim)", "Michael Svoboda (Venezia FC)"],
    M: ["Carney Chukwuemeka (Borussia Dortmund)", "Florian Grillitsch (SC Braga)", "Konrad Laimer (FC Bayern München)", "Marcel Sabitzer (Borussia Dortmund)", "Xaver Schlager (RB Leipzig)", "Nicolas Seiwald (RB Leipzig)", "Romano Schmid (Werder Bremen)", "Alessandro Schöpf (RZ Pellets WAC)", "Paul Wanner (PSV)", "Patrick Wimmer (VfL Wolfsburg)"],
    A: ["Marko Arnautovic (FK Crvena Zvezda)", "Michael Gregoritsch (FC Augsburg)", "Sasa Kalajdzic (LASK)"] },

  { code: "JOR", cc: "jo", country: "Jordanië",
    K: ["Yazeed Abulaila (Al-Hussein SC)", "Noureddin Bani Attiah (Al-Faisaly)", "Abdallah Al-Fakhouri (Al-Wehdat SC)"],
    V: ["Mohammad Abu Hasheesh (Al-Karma)", "Abdallah Nasib (Al-Zawraa SC)", "Husam Abu Dahab (Al-Faisaly)", "Yazan Al-Arab (FC Seoul)", "Mohammad Abualnadi (Selangor FC)", "Saleem Obaid (Al-Hussein SC)", "Saed Al-Rosan (Al-Hussein SC)", "Ehsan Haddad (Al-Hussein SC)", "Anas Badawi (Al-Faisaly)"],
    M: ["Amer Jamous (Al-Zawraa SC)", "Noor Al-Rawabdeh (Selangor FC)", "Rajaei Ayed (Al-Hussein SC)", "Ibrahim Saadeh (Al-Karma)", "Mohannad Abu Taha (Al-Quwa Al-Jaw.)", "Nizar Al-Rashdan (Qatar SC)", "Mohammad Al-Dawoud (Al-Wehdat SC)"],
    A: ["Shararh (Raja Casablanca)", "Ali Olwan (Al-Sailiya SC)", "Odeh Fakhoury (Pyramids FC)", "Mahmoud Al-Mardi (Al-Hussein SC)", "Ali Azaizeh (Al-Shabab)", "Mohammad Taha (Al-Hussein SC)", "Mousa Tamari (Stade Rennes)"] },

  /* ---------------- Poule K ---------------- */
  { code: "POR", cc: "pt", country: "Portugal",
    K: ["Diogo Costa (FC Porto)", "José Sá (Wolverhampton Wanderers)", "Rui Silva (Sporting CP)"],
    V: ["Diogo Dalot (Manchester United)", "Matheus Nunes (Manchester City)", "Nélson Semedo (Fenerbahce SK)", "João Cancelo (FC Barcelona)", "Nuno Mendes (PSG)", "Gonçalo Inácio (Sporting CP)", "Renato Veiga (Villarreal)", "Rúben Dias (Manchester City)", "Tomás Araújo (SL Benfica)"],
    M: ["Rúben Neves (Al Hilal)", "Samuel Costa (Mallorca)", "João Neves (PSG)", "Vitinha (PSG)", "Bruno Fernandes (Manchester United)", "Bernardo Silva (Manchester City)"],
    A: ["João Félix (Al Nassr)", "Francisco Trincão (Sporting CP)", "Francisco Conceição (Juventus)", "Pedro Neto (Chelsea)", "Rafael Leão (AC Milan)", "Gonçalo Guedes (Real Sociedad)", "Gonçalo Ramos (PSG)", "Cristiano Ronaldo (Al Nassr)"] },

  { code: "COD", cc: "cd", country: "Congo DR",
    K: ["Timothy Fayulu (FC Noah)", "Lionel Mpasi (Le Havre)", "Mattieu Epolo (Standard Luik)"],
    V: ["Aaron Wan-Bissaka (West Ham)", "Gedeon Kalulu (Aris)", "Chancel Mbemba (LOSC)", "Steve Kapuadi (Widzew Lodz)", "Axel Tuanzebe (Burnley)", "Dylan Batubinsika (Larissa)", "Aaron Tshibola (Kilmarnock)", "Arthur Masuaku (RC Lens)", "Joris Kayembe (KRC Genk)"],
    M: ["Samuel Moutoussamy (Atromitos)", "Ngal'Ayel Mukau (LOSC)", "Gaël Kakuta (Larissa)", "Charles Pickel (Espanyol)", "Noah Sadiki (Sunderland)", "Edo Kayembe (Watford)"],
    A: ["Théo Bongonda (Spartak Moskou)", "Nathanaël Mbuku (Montpellier)", "Cédric Bakambu (Real Betis)", "Simon Banza (Al-Jazira)", "Fiston Mayele (Pyramids FC)", "Brian Cipenga (CD Castellon)", "Yoane Wissa (Newcastle)", "Meschack Elia (Alanyaspor)"] },

  { code: "UZB", cc: "uz", country: "Oezbekistan",
    K: ["Botirali Ergashev (FC Neftchi Fergana)", "Abduvohid Nematov (FC Nasaf)", "Utkir Yusupov (PFC Navbahor)"],
    V: ["Abdulla Abdullaev (Dibba)", "Khojiakbar Alijonov (Pakhtakor FC)", "Rustam Ashurmatov (Esteghlal)", "Umar Eshmurodov (FC Nasaf)", "Bekhruz Karimov (FC Surkhon)", "Abdukodir Khusanov (Manchester City)", "Sherzod Nasrullaev (FC Nasaf)", "Farrukh Sayfiev (FC Neftchi Fergana)", "Avazbek Ulmasaliev (AGMK)", "Jakhongir Urozov (Dinamo Samarqand)"],
    M: ["Azizjon Ganiev (Al Bataeh)", "Odiljon Hamrobekov (Tractor)", "Jamshid Iskanderov (FC Neftchi Fergana)", "Akmal Mozgovoy (Pakhtakor FC)", "Otabek Shukurov (Baniyas)"],
    A: ["Azizbek Amonov (FC Bukhara)", "Abbosbek Fayzullaev (Basaksehir)", "Dostonbek Khamdamov (Pakhtakor FC)", "Jaloliddin Masharipov (Esteghlal)", "Igor Sergeev (Persepolis)", "Eldor Shomurodov (Basaksehir)", "Oston Urunov (Persepolis)"] },

  { code: "COL", cc: "co", country: "Colombia",
    K: ["Camilo Vargas (Atlas)", "Álvaro Montero (Vélez Sarsfield)", "David Ospina (Atlético Nacional)"],
    V: ["Dávinson Sánchez (Galatasaray)", "Jhon Lucumí (Bologna)", "Yerry Mina (Cagliari Calcio)", "Willer Ditta (Cruz Azul)", "Daniel Muñoz (Crystal Palace)", "Santiago Arias (Independiente)", "Johan Mojica (R.C.D Mallorca)", "Deiver Machado (Nantes)"],
    M: ["Richard Ríos (Benfica)", "Jefferson Lerma (Crystal Palace)", "Kevin Castaño (River Plate)", "Juan Camilo Portilla (Athletico Paranaense)", "Gustavo Puerta (Racing de Santander)", "Jhon Arias (Palmeiras)", "Jorge Carrascal (Flamengo)", "Juan Fernando Quintero (River Plate)", "James Rodríguez (Minnesota United FC)", "Jaminton Campaz (Rosario Central)"],
    A: ["Juan Camilo Hernández (Real Betis)", "Luis Díaz (Bayern München)", "Luis Suárez (Sporting CP)", "Carlos Andrés Gómez (Vasco da Gama)", "Jhon Córdoba (FC Krasnodar)"] },

  /* ---------------- Poule L ---------------- */
  { code: "ENG", cc: "gb-eng", country: "Engeland",
    K: ["Jordan Pickford (Everton)", "Dean Henderson (Crystal Palace)", "James Trafford (Manchester City)"],
    V: ["Ezri Konsa (Aston Villa)", "Jarell Quansah (Bayer Leverkusen)", "Tino Livramento (Newcastle United)", "Dan Burn (Newcastle United)", "Marc Guéhi (Manchester City)", "John Stones (Manchester City)", "Djed Spence (Tottenham Hotspur)", "Nico O'Reilly (Manchester City)", "Reece James (Chelsea)"],
    M: ["Kobbie Mainoo (Manchester United)", "Elliot Anderson (Nottingham Forest)", "Declan Rice (Arsenal)", "Jude Bellingham (Real Madrid)", "Jordan Henderson (Brentford)", "Eberechi Eze (Arsenal)", "Morgan Rogers (Aston Villa)"],
    A: ["Bukayo Saka (Arsenal)", "Noni Madueke (Arsenal)", "Anthony Gordon (Newcastle United)", "Marcus Rashford (FC Barcelona)", "Harry Kane (Bayern München)", "Ivan Toney (Al-Ahli)", "Ollie Watkins (Aston Villa)"] },

  { code: "CRO", cc: "hr", country: "Kroatië",
    K: ["Dominik Livaković (Dinamo)", "Dominik Kotarski (Copenhagen)", "Ivor Pandur (Hull City)"],
    V: ["Joško Gvardiol (Manchester City)", "Duje Ćaleta-Car (Real Sociedad)", "Josip Šutalo (Ajax)", "Josip Stanišić (Bayern)", "Marin Pongračić (Fiorentina)", "Martin Erlić (Midtjylland)", "Luka Vušković (HSV)"],
    M: ["Luka Modrić (Milan)", "Mateo Kovačić (Manchester City)", "Mario Pašalić (Atalanta)", "Nikola Vlašić (Torino)", "Luka Sučić (Real Sociedad)", "Martin Baturina (Como)", "Kristijan Jakić (Augsburg)", "Petar Sučić (Inter)", "Nikola Moro (Bologna)", "Toni Fruk (Rijeka)"],
    A: ["Ivan Perišić (PSV)", "Andrej Kramarić (Hoffenheim)", "Ante Budimir (Osasuna)", "Marco Pašalić (Orlando City)", "Petar Musa (Dallas)", "Igor Matanović (Freiburg)"] },

  { code: "GHA", cc: "gh", country: "Ghana",
    K: ["Benjamin Asare (Hearts of Oak)", "Lawrence Ati-Zigi (FC St. Gallen 1879)", "Joseph Anang (St. Patrick's Athletic)"],
    V: ["Baba Abdul Rahman (PAOK)", "Gideon Mensah (AJ Auxerre)", "Marvin Senaya (AJ Auxerre)", "Alidu Seidu (Stade Rennes)", "Abdul Mumin (Rayo Vallecano)", "Jerome Opoku (Basaksehir FK)", "Jonas Adjetey (VfL Wolfsburg)", "Kojo Oppong Peprah (OGC Nice)", "Derrick Luckassen (Pafos FC)"],
    M: ["Elisha Owusu (AJ Auxerre)", "Thomas Partey (Villarreal CF)", "Kwasi Sibo (Real Oviedo)", "Augustine Boakye (Saint-Étienne)", "Caleb Yirenkyi (Nordsjaelland)", "Abdul Fatawu Issahaku (Leicester City)", "Kamal Deen Sulemana (Atalanta)"],
    A: ["Christopher Bonsu Baah (Al-Qadsiah)", "Ernest Nuamah (Olympique Lyon)", "Antoine Semenyo (Manchester City)", "Brandon Thomas-Asante (Coventry City)", "Prince Kwabena Adu (Viktoria Pilsen)", "Inaki Williams (Athletic Bilbao)", "Jordan Ayew (Leicester City)"] },

  { code: "PAN", cc: "pa", country: "Panama",
    K: ["Orlando Mosquera (Al-Fayha FC)", "Luis Mejía (Club Nacional)", "César Samudio (CD Marathon)"],
    V: ["César Blackman (Slovan Bratislava)", "Jorge Gutiérrez (Deportivo La Guaira)", "Amir Murillo (Besiktas)", "Fidel Escobar (Deportivo Saprissa)", "Andrés Andrade (LASK)", "Edgardo Fariña (FC Pari Nizhniy Novgorod)", "José Córdoba (Norwich City)", "Eric Davis (CD Plaza Amador)", "Jiovani Ramos (Academia Puerto Cabello)", "Roderick Miller (Turan Tovuz)"],
    M: ["Aníbal Godoy (San Diego FC)", "Adalberto Carrasquilla (UNAM Pumas)", "Carlos Harvey (Minnesota United FC)", "Cristian Martínez (Ironi Kiryat Shmona)", "José Luis Rodríguez (FC Juarez)", "Cesar Yanis (CD Cobresal)", "Yoel Bárcenas (Mazatlan FC)", "Alberto Quintero (CD Plaza Amador)", "Azarías Londoño (CD Universidad Catolica)"],
    A: ["Ismael Díaz (Club Leon FC)", "Cecilio Waterman (Universidad de Concepcion)", "José Fajardo (CD Universidad Catolica)", "Tomás Rodríguez (Deportivo Saprissa)"] }
];

/* ---- Flatten into a unique, id'd player list ----------------------------- */
const POS_LABEL = { K: "Keeper", V: "Verdediger", M: "Middenvelder", A: "Aanvaller" };
const POS_ORDER = ["K", "V", "M", "A"];

const WC_PLAYERS = (function () {
  const seen = {};
  function uid(base) {
    base = base || "speler";
    let id = base, n = 2;
    while (seen[id]) { id = base + "-" + n; n++; }
    seen[id] = true;
    return id;
  }
  const out = [];
  WC_SQUADS.forEach(sq => {
    POS_ORDER.forEach(pos => {
      (sq[pos] || []).forEach(entry => {
        const m = String(entry).match(/^(.*?)\s*\(([^()]*)\)\s*$/);
        const name = (m ? m[1] : entry).replace(/\*/g, "").replace(/\s+/g, " ").trim();
        const club = m ? m[2].trim() : "";
        out.push({
          id: uid(slugify(name)),
          name, club, cc: sq.cc, country: sq.country, team: sq.code,
          pos, posLabel: POS_LABEL[pos]
        });
      });
    });
  });
  return out;
})();

/* ---- Curated "popular" players (the default, no-filter view) ------------- */
const POPULAR_NAMES = [
  "Lionel Messi", "Jonathan David", "Deniz Undav", "Erling Haaland", "Eli Just",
  "Daichi Kamada", "Ismael Saibari", "Ayase Ueda", "Harry Kane", "Kylian Mbappé",
  "Yasin Ayari", "Folarin Balogun", "Brian Brobbey", "Matheus Cunha", "Cody Gakpo",
  "Kai Havertz", "Cyle Larin", "Johan Manzambi", "Crysencio Summerville", "Vinicius Junior",
  "Jude Bellingham", "Lamine Yamal", "Mohamed Salah", "Heung-min Son", "Julian Álvarez",
  "Florian Wirtz", "Achraf Hakimi", "Rafael Leão"
];
const POPULAR_IDS = POPULAR_NAMES.map(slugify);
const POPULAR_SET = new Set(POPULAR_IDS);

/* Full topscorer pool = the WC database + any extra players an admin added
   by hand (settings.players). De-duplicated by id, WC entries win. */
function buildPlayerPool(custom) {
  const byId = {};
  WC_PLAYERS.forEach(p => { byId[p.id] = p; });
  (custom || []).forEach(p => {
    if (!p || !p.id || byId[p.id]) return;
    byId[p.id] = Object.assign({ pos: "A", posLabel: POS_LABEL.A, country: "", team: "", cc: p.cc || "" }, p);
  });
  return Object.values(byId);
}

/* Filter the pool for the selection / goals screens.
   filter = { scope:"popular"|"all", team:"", pos:"", q:"" } */
function filterPlayerPool(players, f) {
  f = f || {};
  if (f.scope === "popular") return (players || []).filter(p => POPULAR_SET.has(p.id));
  let list = players || [];
  if (f.team) list = list.filter(p => p.team === f.team);
  if (f.pos) list = list.filter(p => p.pos === f.pos);
  if (f.q) {
    const q = f.q.toLowerCase().trim();
    if (q) list = list.filter(p => (p.name || "").toLowerCase().includes(q) || (p.club || "").toLowerCase().includes(q));
  }
  return list;
}
