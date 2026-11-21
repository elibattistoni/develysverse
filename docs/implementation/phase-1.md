# Develysverse — Fase 1: fondamenta v10 e aggiornamento stack

18 novembre 2026. Fase 1 completata; fermo prima della fase 2 per revisione.

## Stato e perimetro

- Branch: `redesign/v10-phase-1`.
- Worktree: checkout dedicato al redesign.
- Il checkout principale era su `main` a `45acb76` ed è rimasto invariato durante la fase. Il pacchetto `docs/` originale resta non tracciato come all'inizio.
- Modifiche nel worktree lasciate locali e non committate per revisione. Nessun push, merge, deployment o accesso a Linear.
- Il pacchetto handoff è copiato integralmente nel worktree e preservato byte per byte: tutti i 92 checksum verificati anche a fine fase. Non è stato eseguito `verification/capture-and-check.cjs`.

La pagina è intenzionalmente uno **scheletro di fase 1**, non il redesign completo. Contiene navbar, landmark, H1/copy iniziale e intestazioni approvate delle sezioni. Mancano ancora CTA e visual interattivo Hero, card Projects, Expertise, costellazione, corpi Journey, azioni Contact e footer: appartengono alle fasi successive. I componenti legacy restano nel repository, non montati nella pagina, fino alla loro sostituzione. Nessun contenuto o visual fittizio aggiunto.

## Decisione sugli upgrade

Upgrade effettuati **prima** dell'integrazione UI, così la fase è verificata sullo stack aggiornato. Tutte le dipendenze dirette sono fissate alle versioni stabili rilevate nel registry; `npm outdated --json` restituisce `{}`. Le dipendenze transitive sono aggiornate entro i vincoli dei rispettivi pacchetti, senza forzare major incompatibili.

Node **26.13.1** è l'ultima release stabile pubblicata nell'indice ufficiale Node al momento della verifica; è escluso il tag npm `node@latest`, che punta a una alpha. npm **12.2.3**. Node/npm sono stati installati soltanto nella cartella di lavoro del task, senza sostituire quelli di sistema. `.nvmrc`, `.node-version`, engines, packageManager e workflow descrivono la toolchain del progetto.

TypeScript **7.0.2** viene usato dal CLI `tsc` tramite alias `@typescript/native`. Il pacchetto `typescript` espone l'API ufficiale `@typescript/typescript6@6.0.2` necessaria agli strumenti che non supportano ancora l'API del compilatore nativo. Non è un downgrade del typecheck. Configurazione documentata da [Microsoft](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).

| Dipendenza diretta | Versione |
|---|---|
| `framer-motion` | `14.14.0` |
| `next` | `16.4.6` |
| `react` | `19.3.1` |
| `react-dom` | `19.3.1` |
| `three` | `0.187.0` |
| `@testing-library/jest-dom` | `7.0.1` |
| `@testing-library/react` | `16.3.3` |
| `@types/jest` | `30.0.0` |
| `@types/node` | `26.6.6` |
| `@types/react` | `19.3.0` |
| `@types/react-dom` | `19.3.0` |
| `@types/three` | `0.187.0` |
| `autoprefixer` | `10.6.2` |
| `eslint` | `10.15.0` |
| `eslint-config-next` | `16.4.6` |
| `jest` | `30.5.2` |
| `jest-environment-jsdom` | `30.5.2` |
| `postcss` | `8.5.33` |
| `sharp` | `0.35.5` |
| `tailwindcss` | `4.3.5` |
| `ts-node` | `10.9.2` |
| `typescript` | `npm:@typescript/typescript6@6.0.2` |
| `@tailwindcss/postcss` | `4.3.5` |
| `@playwright/test` | `1.65.1` |
| `@testing-library/dom` | `10.4.2` |
| `@typescript/native` | `npm:typescript@7.0.2` |

Anche le cinque GitHub Actions esistenti sono state aggiornate alle release stabili rilevate tramite API ufficiale e fissate a SHA: checkout 7.0.1, setup-node 7.1.0, configure-pages 6.0.0, upload-pages-artifact 5.0.0, deploy-pages 5.0.1. Il workflow locale aggiunge typecheck/lint; non è stato avviato sul remoto.

## Modifiche

- Token, palette, container e breakpoint 1060/800 della v10; CSS Modules per navigazione e tipografia delle sezioni.
- Tailwind 4 con plugin PostCSS dedicato e senza Preflight. Nome `site-container` per evitare collisioni con le utility.
- DM Sans/Inter locali, stessi file e pesi dell'handoff; rimosso il caricamento Google Fonts. Licenze OFL distribuite.
- Sette WebP e sedici SVG originali copiati senza ricompressione. Originali PNG conservati nell'handoff.
- Navbar server-rendered, brand e quattro anchor native, wrap mobile senza overlay; skip link utilizzabile da tastiera anche senza JavaScript.
- Focus lilla e reduced motion globali. Le interazioni delle sezioni non sono state anticipate.
- ESLint flat config/CLI per Next 16, Jest 30 e Playwright. Aggiornamento di piccoli pattern legacy richiesto dalle nuove regole React, senza disabilitare le regole: media query con `useSyncExternalStore`, reset asincroni e rimozione di variabili inutilizzate.
- Export statico e CNAME conservati. `npm start`/`npm run preview` servono `out/`, perché `next start` non serve un export statico.
- README e nota iniziale in CLAUDE aggiornati con precedenza della v10 e istruzioni QA. Immagine OG e favicon esistenti conservate.

Migrazioni riferite alla documentazione ufficiale [Next 16](https://nextjs.org/docs/app/guides/upgrading/version-16), [ESLint Next](https://nextjs.org/docs/app/api-reference/config/eslint) e [Tailwind 4](https://tailwindcss.com/docs/upgrade-guide).

## Verifiche eseguite

| Controllo | Esito |
|---|---|
| `npm run typecheck` — TypeScript 7 | PASS |
| `npm run lint` — ESLint 10 | PASS, nessun errore/warning di lint |
| `npm test -- --runInBand` | PASS, 1 test della sottoscrizione media query e cleanup |
| `npm run build` | PASS, export statico |
| `npm run test:e2e` | PASS, 36/36, nessun test saltato o flaky |
| `npm ci --dry-run --ignore-scripts --no-audit --no-fund` | PASS, validazione lockfile; non equivale a una nuova installazione CI completa |
| `npm outdated --json` | `{}` |
| `git diff --check` | PASS |
| Integrità handoff/asset serviti | PASS |
| `npm audit --omit=dev` | 0 vulnerabilità segnalate |

Browser: Chromium 159, Firefox 159, WebKit 27.2 su macOS. Nove larghezze: 320, 390, 520, 800, 801, 900, 1060, 1061, 1440 px. Verificati assenza di overflow, geometria navbar/container, font e stili tipografici H1/titoli rispetto alla v10 renderizzata nello stesso browser; anchor, skip link, focus, reduced motion, JavaScript disattivato, decodifica di tutte le immagini, caricamento delle nove facce font e hash degli asset serviti. Richieste esterne bloccate: nessuna necessaria. Nessun errore pagina/asset HTTP nel perimetro testato.

WebKit su macOS usa Option+Tab per la navigazione completa tra link, coerentemente con le impostazioni della piattaforma. Non sono test di Safari o dispositivi fisici.

## Confronto visivo e differenze

Screenshot nuovi esclusivamente in `test-results/phase1/`; copia per la revisione accanto a questo report. I riferimenti approvati non sono stati modificati.

Le etichette 1440/390 dei riferimenti corrispondono a PNG larghi 1425/375 px: i file escludono i 15 px a destra. Per il confronto si mantiene il viewport nominale e si ritaglia solamente quella parte dello screenshot nuovo, senza scalare la baseline.

La navigazione della nuova implementazione e quella del prototipo v10 renderizzato nello **stesso browser** hanno geometria e tipografia coincidenti. Differenza massima per canale RGB **2/255**, dovuta al compositing del gradiente.

Rispetto ai PNG storici, i pixel con differenza superiore a 32/255 sono **3,424% mobile** e **1,443% desktop** nel ritaglio di navigazione. Le differenze visibili riguardano la rasterizzazione/peso apparente dei glifi e si riproducono anche aprendo il prototipo originale nell'ambiente attuale; non sono state compensate alterando i font approvati. Il report dell'handoff ammette differenze di rendering font tra versioni browser/OS. Serve ulteriore controllo nell'ambiente di produzione prima del rilascio.

Il confronto pixel dell'intera pagina non è un criterio di questa fase: i corpi delle sezioni non sono ancora montati e la loro assenza cambia le altezze e le posizioni verticali. Non si dichiara equivalenza della homepage completa.

## Problemi residui e limiti

- `npm audit` completo segnala **52 pacchetti coinvolti** (48 high, 4 moderate), derivanti da dipendenze transitive degli strumenti di sviluppo, in particolare glob/minimatch/picomatch. Il controllo runtime è pulito. Non applicati downgrade automatici o override major non verificati solo per azzerare il contatore.
- I plugin transitori ESLint import/react/jsx-a11y dichiarano ancora peer range fino a ESLint 9; npm emette avvisi con ESLint 10. Lint e verifica resolver `npm ci --dry-run` passano, ma il supporto dichiarato upstream va ricontrollato nelle fasi successive.
- npm 12 segnala lo script opzionale di build di `@parcel/watcher` non autorizzato; non necessario per export e QA eseguiti. Non sono state autorizzate indiscriminatamente lifecycle script.
- GitHub Actions aggiornate ma non eseguite; nessun test Linux CI, Safari/iOS/Android fisici o screen reader, audit WCAG completo o misure Core Web Vitals in questa fase.
- Interazioni, motion e responsive dei corpi delle sezioni restano da implementare e verificare nelle rispettive fasi. Diritti su materiali terzi e nuovi metadata visuali restano i punti di produzione già dichiarati nell'handoff.

## Ripetere la verifica

Con Node/npm indicati in README: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test -- --runInBand`, `npm run build`, `npx playwright install chromium firefox webkit`, `npm run test:e2e`. Non eseguire build mentre è attivo il dev server. Il server QA espone i riferimenti solo quando avviato dai test; la preview normale serve esclusivamente `out/`.

## User review and spacing follow-up

Elisa passed the desktop, responsive, anchor, keyboard and no-JavaScript checks.
A follow-up compared rendered spacing against v10 at 1720, 1440, 900 and 390px:
Hero heading-to-paragraph 25px, section heading-to-paragraph 17px, kicker gap
19px, paragraph line-height and section margins matched exactly. Whole-page
vertical rhythm remains incomplete until the section bodies are implemented.
On 18 November 2026 Elisa authorized committing/pushing this first round and
continuing implementation. Only the dedicated feature branch is pushed.
