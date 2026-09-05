# Architectuur — Dictee Engels

Een Engelse woordentrainer voor obs De Trinoom (Wijchen). Spelers kiezen een
onderwerp, een onderdeel (woordjes / werkwoorden / zinnen / alles) en een
richting (NL→EN of EN→NL), typen de vertaling, en bouwen een streak op.

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
  App.jsx                 — schermwissel + gedeelde state (naam, groep8, onderwerp, onderdeel, richting)
  api.js                   — "backend-laagje": leest/schrijft data lokaal (geen fetch meer)
  data/wordPacks.js         — TOPICS: alle onderwerpen, per onderwerp de 3 onderdelen
  data/categories.js         — label/icoon/kleur per onderdeel (woorden/werkwoorden/zinnen/alles)
  utils.js                  — shuffle/normalize/fmtTime/promptWord-helpers
  hooks/useSound.js          — Web Audio geluidseffecten (correct/fout/streak/klaar)
  components/Header.jsx      — logo, geluid-knop, contextuele rechterkant-slot
  components/Modal.jsx       — herbruikbare pop-up/dialoog in de huisstijl
  screens/
    StartScreen.jsx           — naam, Groep 8-vinkje, richting, onderwerp- en onderdeelkeuze
    QuizScreen.jsx             — de quiz-motor (useReducer)
    ResultScreen.jsx            — score, sterren, "nieuw record", top 5
    BoardScreen.jsx              — volledig scorebord, gegroepeerd per speler
  styles/woordavontuur.css       — het custom ontwerp
```

### Datamodel (`src/data/wordPacks.js`)

Alle onderwerpen (topics) gelden voor **zowel Groep 7 als Groep 8** — er is
geen aparte groepsdata. Elk onderwerp heeft tot drie onderdelen
(categorieën): `woorden`, `werkwoorden` en `zinnen`, elk een array van
`{ english, dutch }`:

```js
export const TOPICS = {
  Emotions: {
    categories: {
      woorden: [{ english, dutch }, ...],
      werkwoorden: [{ english, dutch, hint? }, ...],
      zinnen: [{ english, dutch }, ...],
    },
  },
  Style: { categories: { ... } },
  ...
  People: { categories: { woorden: [...], zinnen: [...] } },  // geen werkwoorden — niet elk onderwerp heeft alle 3
}
```

Het **enige** verschil tussen Groep 7 en Groep 8 is dat de categorie
`zinnen` alleen zichtbaar/speelbaar is als het "Ik zit in groep 8"-vinkje op
`StartScreen.jsx` aan staat (`groep8` state in `App.jsx`) — zie `api.js`
hieronder. Er is dus bewust geen groep-toggle meer en geen `groep8Only`-vlag
op onderwerpniveau: alle 8 onderwerpen zijn altijd zichtbaar.

Bij "you"-vervoegingen (Engels maakt geen onderscheid enkelvoud/meervoud,
Nederlands wel: jij vs. jullie) krijgt zo'n paar een `hint` (`'jij'` of
`'jullie'`) die alleen als aanwijzing bij de vraag verschijnt
(`promptWord` in `utils.js`) — nooit onderdeel van het te typen antwoord.

`src/data/categories.js` bevat de label/icoon/kleur-metadata (📖 Woordjes,
🏃 Werkwoorden, 💬 Zinnen) die zowel de onderdeel-chips op `StartScreen` als
het kleurtje/icoontje per vraag op `QuizScreen` (`.category-badge`) tekenen —
in de "Alles"-modus behoudt elke vraag zo zijn eigen categorie-kleurtje, ook
al zijn de onderdelen door elkaar geshuffeld.

### `api.js` — onderwerp + onderdeel + groep8 → pakket

- `getTopics()` — alle onderwerpnamen, altijd (geen groep8-parameter nodig).
- `getCategories(topicName, groep8)` — de onderdelen die voor dit onderwerp
  beschikbaar zijn (zinnen alleen als `groep8`), plus een `alles`-optie met
  het opgetelde aantal.
- `getPack(topicName, category, groep8)` — bouwt het daadwerkelijke
  oefenpakket. Bij `category === 'alles'` worden alle beschikbare onderdelen
  samengevoegd tot één array, waarbij elk paar zijn eigen `category` behoudt
  (voor het kleurtje/icoontje in de quiz). Pakket-`id` is
  `"<onderwerp>::<onderdeel>"` (bv. `"Animals::werkwoorden"`,
  `"Animals::alles"`) — geen database-ids nodig omdat de data statisch is.
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
reizen (naam, `groep8`, onderwerp, onderdeel, richting, laatste resultaat).
Elk scherm is een losstaand component dat die waarden en setters als props
krijgt — geen context/store, want de boom is maar 4 schermen diep.

**Quiz-motor** (`QuizScreen.jsx`): een `useReducer` met een wachtrij van
woord-indexen. Fout beantwoorde woorden gaan terug achteraan de wachtrij
(pas "onder de knie" na een goed antwoord); goed beantwoorde woorden worden
uit de rotatie gehaald. Automatisch doorschakelen na een correct (700ms) of
fout (1700ms) antwoord via `useEffect` + `setTimeout` (met cleanup zodat een
handmatige "volgende"-klik geen dubbele advance veroorzaakt).

## Pop-ups / dialogen

`src/components/Modal.jsx` is een herbruikbare, in de eigen huisstijl
gestylede dialoog (afgeronde kaart, Patrick Hand-titel, `.start-btn`/
`.ghost-btn` als primaire/secundaire actie, sluit op Escape of klik buiten
de kaart). De browser-native `window.confirm()` is hiermee vervangen in
`QuizScreen.jsx` (bevestiging bij "terug naar hoofdmenu"). Nieuwe
bevestigings- of informatie-pop-ups elders in de app moeten dezelfde
`Modal`-component hergebruiken in plaats van `window.confirm`/`alert`.

## Testen

Twee lagen, beide in `frontend/`:

- **Unit tests** (Vitest, `jsdom`-omgeving, config in `vitest.config.js`) —
  colocated naast de broncode als `*.test.js`: `src/utils.test.js`,
  `src/api.test.js` (localStorage-laag), `src/data/wordPacks.test.js`
  (datasanity), `src/hooks/useSound.test.js` (via
  `@testing-library/react`'s `renderHook`, met een gemockte
  `AudioContext`), en `src/screens/QuizScreen.reducer.test.js` (de
  quiz-reducer/wachtrijlogica los van React getest — `reducer` en
  `initialQuizState` zijn daarom als named exports beschikbaar naast de
  default `QuizScreen`-component). Draaien: `npm run test:unit`.
- **Frontend/e2e tests** (Playwright, `@playwright/test`, config in
  `playwright.config.js`) — in `frontend/e2e/`: `start-screen.spec.js`
  (onderwerpenlijst, het Groep 8-vinkje dat alleen "zinnen" toont/verbergt,
  leeg scorebord) en `quiz-flow.spec.js` (volledige quiz met bekende
  antwoorden uit `wordPacks.js`, de categorie-badge, foutfeedback,
  scorebord-persistentie na reload, en de Modal-dialoog). De
  Playwright-config bouwt en serveert de app zelf
  (`webServer` draait `npm run build && npm run preview`), dus
  `npm run test:e2e` heeft geen los gestarte dev-server nodig. Chromium
  moet wel eenmalig lokaal geïnstalleerd zijn: `npx playwright install
  chromium`.
- `npm test` draait beide lagen na elkaar.

## Hosten op GitHub Pages

- `vite.config.js` heeft `base: './'` (relatieve paden) zodat de build werkt
  op elk subpad — of de repo nu als user-site (`gebruiker.github.io`) of als
  project-site (`gebruiker.github.io/reponaam`) gehost wordt, hoeft er niets
  aangepast te worden.
- `.github/workflows/deploy.yml` (heet "CI en Deploy naar GitHub Pages")
  draait op elke push/PR naar `main` eerst de volledige testset (`test`-job:
  unit + Playwright e2e, incl. chromium-install), dan pas de `build`-job
  (`npm run build`) en tot slot de `deploy`-job — die laatste alleen bij een
  echte push naar `main` (niet bij pull requests), zodat een kapotte build
  nooit gepubliceerd wordt. Playwright-rapporten worden als CI-artifact
  bewaard bij een falende run.

## Bekende kanttekeningen / gotchas

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
