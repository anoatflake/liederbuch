This is an app is a songbook collection with guitar chords, where the singers are able to follow the guitar player.

## Development

Use Node.js 26 LTS (`nvm use`) and install dependencies with `npm ci`.
Copy `.env.example` to `.env` and fill in the values before running the app.

Run `npm run lint`, `npm run typecheck`, `npm test`,
`npm run validate:songs:strict`, and `npm run build` to run the same checks as CI.

TypeScript stays on 6.0 because the latest stable typescript-eslint packages
require TypeScript below 6.1. ESLint stays on 9.x because Next.js's React,
import, and accessibility lint plugins do not yet support ESLint 10.
Prisma stays on the latest stable 7.x release; the 8.x release candidates
are excluded.

The scoped minimatch override patches GHSA-g3hv-75wg-m249 in the lint toolchain
until typescript-eslint updates its dependency.

## TODOs:

- [x] LetterGroup css override with selected
- [ ] Replace Ref. in html song templates
- [ ] wenn der abend naht --> below

- [ ] Pages
  - [x] Song
    - [x] ~~addSongToRep-button/removeSongFromRep-button (with dropdown)~~
    - [ ] **currentSongButton**
  - [x] ~~Songslist~~
    - [x] ~~addSongToRep-button/removeSongFromRep-button (with dropdown)~~
  - [x] ~~transformTitle~~
    - [x] ~~english edge cases~~
  - [x] Sidebarbar
    - [x] ~~responsive sidebar~~
    - [x] icons for text labels
    - [ ] search bar
      - [x] by title
      - [ ] by text simalarity
    - [x] bug report button
    - [x] song request button
  - [ ] **create songbook**
  - [ ] **follow page**
  - [ ] **Profile page**
    - [x] profile
    - [x] repertoire dispaly
    - [x] buttons for adding and removing songs to repertoire
    - [ ] **set password for singers ???**
    - [ ] **change user settings**
    - [ ] **styling**
    - [ ] generate qr code
    - [ ] import from ultimateguitar?
  - [ ] **"login" singer**
    - [ ] **display followed players repertoire**
    - [ ] suggestions to guitarplayer?
- [ ] **follow me page**
  - [ ] **follow me update**
- [ ] Styling
  - [x] ~~icon~~
  - [x] ~~Chords~~
  - [x] ~~fix Chords nav bug~~
  - [x] ~~Letter list sidebar???~~
  - [x] dark mode toggle
  - [ ] english lang support --> **meta data**
  - [x] ~~responsive~~
  - [ ] Autoanimate??? --> for adding/removing songs to reportaire
  - [x] ~~TranslateLatex~~
    - [x] ~~customToLatex~~
    - [x] ~~intro/outro~~
    - [x] ~~meadly~~
    - [x] ~~remove translateLatex and transform the files to html~~
    - [ ] **clean up songs**
- [x] ~~database for user profiles~~
- [x] nextAuth-Login
  - [x] ~~general stuff~~
  - [ ] mail login
    - [ ] smtp account
- [x] ~~actually deploying it~~
  - [x] ~~deploying database~~
- [ ] far future: stress test user
- [ ] **logging**

## SONGS TO ADD:

- [ ] Bock Schilf
- [ ] Bock der pete
- [ ] drei rote pfiffer
- [ ] doppelbock panama
- [ ] Bock miroschaka
- [ ] Loch lomond --> DEUTSCH

## TEXT NOT RIGHT??

- [ ] Jalava
- [ ] ye jacobites by name
- [ ] leise weht der wind

## WEIRD CHORD HTML:

- [ ] What shall we do with the drunken sailor
- [ ] Wer bist du wirklich
- [ ] Wenn der Abend naht
- [ ] Wake me up when september ends
- [ ] star of the county down
- [ ] roter wein
- [ ] regenwald
