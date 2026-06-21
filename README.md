# 🏆 WK Pool 2026 — DSP Groep

De interne **FIFA wereldkampioenschap-pool** van DSP Groep. Deelnemers voorspellen de
knock-outfase (laatste 16 → 8 → 4 → 2 → wereldkampioen) en kiezen 3 topscorers.
Scores verschijnen automatisch in een live klassement.

Volledig statisch (HTML/CSS/JS) — draait op **GitHub Pages** met een gratis
**Supabase**-database als gedeelde opslag.

---

## ✅ Wat het kan

- **Inloggen/registreren** met alleen een gebruikersnaam + wachtwoord (géén e-mail).
- De **eerste geregistreerde deelnemer wordt automatisch beheerder**.
- **Knock-out voorspellingen** met puntentelling volgens het reglement (40/80/150/250/400).
- **3 topscorers** — 25 punten per doelpunt in de knock-outfase.
- **Deadline**: na de deadline kan niemand nog wijzigen (door admin in te stellen).
- **Live klassement** met podium en prijzenpot (70/20/10, aanpasbaar).
- **Admin-paneel**: deadline, prijzen, deelnemers beheren (admin maken/afnemen, verwijderen,
  inleg ✓, groepsfase-punten), **uitslagen + doelpunten invoeren**, teams/spelers beheren.

---

## ✅ Stap 1 & 2 — Supabase: AL GEDAAN

De database is al voor je aangemaakt en gekoppeld via de Supabase-connector:

- Project **FinnDuijvestijn's Project** (`krzfojxsrxvbvntuldnj`, regio EU).
- De tabellen (`users`, `predictions`, `settings`) + beveiligingsregels staan klaar.
- De pool is geseed met 32 teams, 12 spelers en een standaard-deadline.
- **`assets/js/config.js`** is al ingevuld met je Project URL + publishable key.

> Je hoeft hier dus niets meer te doen. (`supabase/schema.sql` blijft in het project staan
> voor het geval je het ooit opnieuw wilt opzetten.)

## 🌐 Stap 3 — Online zetten met GitHub Pages (het enige dat nog moet)

1. Maak een nieuwe **GitHub repository** (bijv. `wk-pool-2026`).
2. Upload **alle bestanden** uit deze map naar de repo
   (`index.html`, de map `assets/`, `.nojekyll`, enz.). Eenvoudigste weg:
   - via de site: **Add file → Upload files** → sleep de bestanden erin → **Commit**.
   - of via git:
     ```bash
     git init
     git add .
     git commit -m "WK Pool 2026"
     git branch -M main
     git remote add origin https://github.com/<jouw-account>/wk-pool-2026.git
     git push -u origin main
     ```
3. In de repo: **Settings → Pages**. Bij **Source** kies **Deploy from a branch**,
   branch **main**, map **/ (root)**, en **Save**.
4. Na ~1 minuut staat je pool op:
   **`https://<jouw-account>.github.io/wk-pool-2026/`**

Deel die link met je collega's. De eerste die registreert is de admin. 🎉

---

## 🛠️ Gebruik als admin

- Ga naar het tabblad **Admin** (alleen zichtbaar voor admins).
- Stel de **deadline** in en eventueel inleg/prijsverdeling.
- Vul per deelnemer de **groepsfase-punten** in (de startstand uit de groepsfase).
- Tik op de inleg-chip om **Betaald/Open** te wisselen.
- Onderaan: voer na elke ronde de **uitslagen** (welke teams door zijn) en de
  **doelpunten per topscorer** in, en klik **opslaan & herbereken** — het klassement
  werkt direct bij.
- **Teams/spelers** kun je aanpassen aan de echte WK-deelnemers en -spelers.

---

## 📁 Structuur

```
index.html              # de app (laadt alles)
.nojekyll               # nodig zodat GitHub Pages de assets/ map serveert
assets/
  css/styles.css        # het volledige (FIFA-thema) ontwerp
  img/dsp-logo.png      # DSP Groep logo
  js/config.js          # <-- jouw 2 Supabase-waarden
  js/data.js            # standaard teams/spelers + puntentelling
  js/db.js              # Supabase + login + scoring-engine
  js/render.js          # alle schermen (UI)
  js/app.js             # navigatie, events, acties
supabase/schema.sql     # éénmalig in Supabase draaien
```

De losse `.docx`, `.zip`, de extra `dsp-logo*` bestanden en de map `.claude/` zijn alleen
referentie of lokaal — die staan in `.gitignore` en hoef je niet te uploaden.

---

## 🔒 Beveiliging (bewust simpel)

Dit is een interne, laagdrempelige kantoorpool zonder e-mail of gevoelige gegevens.
De `anon`-sleutel staat in de pagina en de databaseregels staan open — dat is prima voor
dit doel, maar gebruik er **geen wachtwoorden die je elders ook gebruikt**. Wachtwoorden
worden als hash opgeslagen, niet als platte tekst.
