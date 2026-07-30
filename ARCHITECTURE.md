# Architectuur — Dictee Engels

Een Engelse woordentrainer voor obs De Trinoom (Wijchen). Spelers kiezen een
groep (leerjaar), een woordpakket en een richting (NL→EN of EN→NL), typen de
vertaling, en bouwen een streak op.

De app is een **volledig statische website** (`frontend/`): geen server, geen
database nodig om te draaien. Woordpakketten zitten ingebakken in de
JS-bundel en scores/het scorebord worden per browser opgeslagen in
`localStorage`. Dat maakt hosten op GitHub Pages triviaal — het is gewoon een
map met HTML/CSS/JS.

> Er bestaat ook een `backend/` (Express + Prisma + SQLite) uit een eerdere
> iteratie, met een echte gedeelde database en een `/scores`-API. Die wordt
> **niet meer gebruikt** door de huidige frontend, maar is bewaard als
> uitgangspunt mocht je later toch een gedeeld (niet per-browser) scorebord
> willen — zie "Geschiedenis" onderaan.

## Overzicht

```
┌───────────────────────────────┐
│  frontend (Vite/React, statisch) │
│                                    │
│  woordpakketten:  src/data/wordPacks.js (ingebakken in de build) │
│  scores/scorebord: window.localStorage (per browser/apparaat)     │
└───────────────────────────────┘
```

Eén map, één build (`npm run build` in `frontend/`) → een `dist/`-map met
statische bestanden die overal gehost kunnen worden (GitHub Pages, Netlify,
een simpele webserver, of gewoon lokaal geopend).

## Frontend (`frontend/`)

Vite + React. Tailwind v4 staat geïnstalleerd maar wordt niet gebruikt voor
de quiz-UI zelf: het ontwerp (kleuren, kaarten, animaties) is 1-op-1
overgenomen uit de originele HTML-app als een eigen stylesheet
(`src/styles/woordavontuur.css`), omdat het te specifiek/rijk is om zonder
visuele regressie in Tailwind-utilities te herschrijven.

```
src/
  App.jsx                 — schermwissel + gedeelde state (naam, groep, richting, pakket)
  api.js                   — "backend-laagje": leest/schrijft data lokaal (geen fetch meer)
  data/wordPacks.js         — alle woordpakketten, gegroepeerd per leerjaar
  utils.js                  — shuffle/normalize/fmtTime/promptWord-helpers
  hooks/useSound.js          — Web Audio geluidseffecten (correct/fout/streak/klaar)
  components/Header.jsx      — logo, geluid-knop, contextuele rechterkant-slot
  screens/
    StartScreen.jsx           — naam, groep-toggle, richting-toggle, pakketkeuze
    QuizScreen.jsx             — de quiz-motor (useReducer)
    ResultScreen.jsx            — score, sterren, "nieuw record", top 5
    BoardScreen.jsx              — volledig scorebord, gegroepeerd per speler
  styles/woordavontuur.css       — het custom ontwerp
```

### Datamodel (`src/data/wordPacks.js`)

```js
{
  "Groep 7": {
    Activities: [{ english, dutch }, ...],
    Animals: [...],
    ...
  },
  "Groep 8": {}   // nog leeg — vul aan zodra er lesstof voor is
}
```

Een pakket-`id` is simpelweg `"<groep>::<naam>"` (bv. `"Groep 7::Animals"`) —
geen database-ids nodig omdat de data statisch is.

### `api.js` — dezelfde interface, andere achterkant

`api.js` exporteert nog steeds `getPacks(group)`, `getPack(id)`,
`getScores()`, `postScore(score)` — exact dezelfde functies als toen ze naar
de Express-backend fetchten. Daardoor hoefden de schermen (`StartScreen`,
`QuizScreen`, `ResultScreen`, `BoardScreen`) **niet aangepast** te worden bij
de overstap naar statisch; alleen de implementatie van `api.js` veranderde:

- `getPacks`/`getPack` lezen uit `src/data/wordPacks.js`.
- `getScores`/`postScore` lezen/schrijven een array in
  `localStorage["dictee-engels-scores"]`.

**Belangrijke consequentie**: het scorebord is nu **per browser/apparaat**,
niet meer gedeeld tussen spelers. Twee kinderen die allebei op hun eigen
telefoon spelen zien elkaars scores niet, en `localStorage` wissen (of een
andere browser/incognito gebruiken) reset de geschiedenis. Dat is de prijs
voor "geen server nodig" — als een echt gedeeld klassenscorebord ooit nodig
is, is `backend/` (zie onder) het startpunt om dat terug te brengen.

**State-model**: `App.jsx` is de enige plek met scherm-state
(`start`/`quiz`/`result`/`board`) en de waarden die tussen schermen moeten
reizen (naam, groep, richting, gekozen pakket, laatste resultaat). Elk
scherm is een losstaand component dat die waarden en setters als props
krijgt — geen context/store, want de boom is maar 4 schermen diep.

**Quiz-motor** (`QuizScreen.jsx`): een `useReducer` met een wachtrij van
woord-indexen. Fout beantwoorde woorden gaan terug achteraan de wachtrij
(pas "onder de knie" na een goed antwoord); goed beantwoorde woorden worden
uit de rotatie gehaald. Automatisch doorschakelen na een correct (700ms) of
fout (1700ms) antwoord via `useEffect` + `setTimeout` (met cleanup zodat een
handmatige "volgende"-klik geen dubbele advance veroorzaakt).

## Hosten op GitHub Pages

- `vite.config.js` heeft `base: './'` (relatieve paden) zodat de build werkt
  op elk subpad — of de repo nu als user-site (`gebruiker.github.io`) of als
  project-site (`gebruiker.github.io/reponaam`) gehost wordt, hoeft er niets
  aangepast te worden.
- `.github/workflows/deploy.yml` bouwt bij elke push naar `main` de frontend
  (`npm ci && npm run build` in `frontend/`) en publiceert `frontend/dist`
  naar GitHub Pages via de officiële `actions/deploy-pages`-actie.
- Nog te doen (buiten deze sessie, vraagt om een GitHub-account/repo): een
  GitHub-repo aanmaken, deze code pushen, en in **Settings → Pages** de
  bron op "GitHub Actions" zetten.

## Bekende kanttekeningen / gotchas

- **Geen tests** — verificatie gebeurt handmatig/ad-hoc: `vite build` +
  `vite preview`, en tijdelijke Playwright-scriptjes (steeds weer
  verwijderd na gebruik, inclusief de `playwright`-devdependency zelf) om de
  volledige quizflow te controleren zonder dat er een server nodig is.
- **`localStorage`-limieten**: werkt niet in een privé/incognito-venster na
  sluiten, en is gebonden aan het exacte origin (domein) waarop de site
  draait — verhuizen naar een andere URL betekent dat oude scores niet
  meeverhuizen.

## Geschiedenis: de `backend/`-map

Vroege iteraties van deze app hadden een Express + Prisma + SQLite-backend
met een echte gedeelde database (`WordPack`/`WordPair`/`ScoreResult`-modellen,
`/packs` en `/scores`-endpoints). Die code staat nog in `backend/` maar wordt
**niet meer aangeroepen** door de huidige frontend. Relevant als je later
alsnog wilt dat scores gedeeld worden tussen apparaten (dat vereist weer een
server ergens — zie de eerdere discussie over een mini-pc thuis of een
gehoste backend), maar voor "gewoon hosten op GitHub Pages" is dit niet
nodig.
