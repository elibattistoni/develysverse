# Verifica del pacchetto — 17 novembre 2026

Baseline approvata: develysverse_design_refinement_v10.html. Nessuna modifica di design effettuata.

## Verifiche eseguite

- CSS e JavaScript confrontati con i blocchi originali v10: identici salvo whitespace esterno.
- Immagini WebP estratte senza ricompressione e verificate tramite hash.
- Destinazioni e testo degli anchor conservati.
- Tutti i riferimenti locali HTML e tutti i font CSS risolti a file presenti.
- Snapshot completo della specifica v0.1 e relativo decision log conservati.
- Chromium headless 143.0.7499.4, viewport 1440×1000, 900×1000, 390×1000, 320×1000, DPR 1: nessun errore JavaScript, nessun overflow orizzontale del documento, font caricati e immagini decodificate.
- Le richieste esterne sono state bloccate durante questi controlli: nessuna richiesta esterna di asset è stata tentata.
- Desktop 1440 e mobile 390: selezione di entrambi i frammenti Hero posteriori tramite tastiera, apertura di tutte le card Expertise, presenza dei quattro paper, chiusura Neuroscience con ritorno del focus, filtri/rotazione/zoom della costellazione, apertura simultanea di due capitoli Journey.
- Desktop: screenshot focus di un link progetto e scroll fino al fondo delle pubblicazioni. Mobile: avanzamento del carousel al secondo progetto.
- Clipboard: copia effettiva verificata contro l'indirizzo approvato; feedback Email copied; errore di copia simulato e fallback visibile.
- Reduced motion desktop: flip senza trasformazione. Mobile: riferimenti acquisiti con reduced motion per documentare stati stabili.
- JavaScript disattivato: contenuto Expertise e indirizzo di fallback consultabili.
- Acquisiti 33 PNG: pagina intera e stati di sezioni. Ispezionati visivamente Hero, progetti, retro Expertise/pubblicazioni e Contact, desktop/mobile, anche tramite tavola di controllo.

Risultati macchina: browser-results.json, static-results.json. Le immagini di sezione sono ritagli del relativo elemento: eventuali decorazioni che oltrepassano il suo box possono essere tagliate nel ritaglio. Usare page-initial per valutare la composizione della pagina completa.

## Ripetere le verifiche

Il prototipo non richiede dipendenze. Il solo script di QA usa Node.js e Playwright:

```sh
npm install --no-save playwright
npx playwright install chromium
node verification/capture-and-check.cjs
```

Lo script avvia un server locale sulla porta 8765, acquisisce e sovrascrive i riferimenti e salva i risultati. CHROMIUM_PATH opzionale permette di usare un eseguibile già installato. Non includere node_modules nella consegna di produzione.

## Limiti dichiarati

Non eseguiti: test Safari/Firefox, dispositivi mobili fisici, screen reader, audit WCAG completo, zoom 200%, misure Core Web Vitals, controllo live delle destinazioni esterne. Nessuna certificazione di accessibilità o prestazioni è implicita.
Le simulazioni responsive sono Chromium desktop con viewport stretto, non equivalgono a iOS/Android reali. Le transizioni sono attese fino allo stato stabile; non è stata registrata una valutazione frame-by-frame del motion.
I font locali corrispondono alla risposta Google Fonts scaricata per l'URL originale. Non si certifica equivalenza pixel-per-pixel con il rendering storico su macOS: matching dei pesi, versione font e antialiasing possono differire. Le PNG incluse documentano il pacchetto consegnato.
I file in history sono copie storiche e conservano i riferimenti Google Fonts online: l'entry point autosufficiente è index.html nella radice.
Per diritti e materiali non forniti vedere ASSETS_AND_LICENSES.md e specifica §13. Nessun repository di produzione modificato, nessun accesso a Linear.
