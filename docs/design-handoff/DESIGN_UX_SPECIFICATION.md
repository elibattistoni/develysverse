# Develysverse — Design & UX Specification

**Versione 1.0 · 17 novembre 2026 · APPROVATO per implementazione**  
Owner e responsabile approvazioni: Elisa Battistoni.  
Baseline definitiva: prototipo HTML v10, approvato esplicitamente alla chiusura della progettazione.

## 1. Stato, fonti e gestione delle decisioni

Questa specifica consolida le decisioni definitive della conversazione e il comportamento effettivo della v10. Il design è concluso. La preparazione di questo handoff non comporta modifiche al repository o deployment.

Ordine delle fonti per lo sviluppo:
1. Questa specifica per decisioni e requisiti.
2. `index.html`, `styles.css`, `script.js` per composizione, valori esatti, copy e interazioni.
3. `visual-references/` per confronto agli stessi viewport.
4. `history/` per consultare le decisioni precedenti, superate quando incompatibili con questa versione.

Il prototipo confezionato esternalizza CSS, JavaScript e immagini della v10 e rende locali i font. Non introduce modifiche al design. La v10 originale è conservata integralmente. Il copy completo è anche in `content.json`.

Stati: APPROVATO, DA DEFINIRE (produzione), SCARTATO, ACCANTONATO. Le decisioni cambiano solo dopo approvazione di Elisa. Ogni modifica significativa aggiorna versione, decision log e changelog. Lo storico v0.1 è conservato integralmente in `history/DESIGN_UX_SPECIFICATION_v0.1.md`, inclusi motivazioni e log originali.

## 2. Scopo e posizionamento — APPROVATO

Portfolio di Elisa Battistoni, Software Developer / Frontend Engineer, con esperienza in Data Science e PhD in Cognitive Neuroscience. Destinatari: engineering manager, recruiter, clienti freelance e collaboratori software/scientifici.

Il software engineering è il focus professionale principale. Il background scientifico è distintivo. Non trasformare interessi o percorsi di studio in qualifiche acquisite. Non inventare risultati, metriche, clienti, certificazioni o contatti.

Lingua dell'interfaccia e copy: inglese. Lingua della documentazione: italiano.

## 3. Architettura — APPROVATO

Ordine homepage: Hero → Selected Projects → Expertise (con Skills Constellation) → Journey → Contact → footer.
Navbar aperta sullo sfondo, brand a sinistra e quattro anchor a destra. Nessun riquadro e nessun menu hamburger nel layout approvato. Su mobile i link possono andare a capo.
Skip link al contenuto. Brand e Back to top tornano all'inizio. Nessuna pagina case study aggiuntiva richiesta.

## 4. Design system — APPROVATO

| Token CSS | Valore |
|---|---|
| --bg | #090f19 |
| --surface | #111a28 |
| --text | #f2f5fb |
| --muted | #acb9cb |
| --subtle | #9baac0 |
| --accent | #bdb3ff |
| --accent2 | #76d9d3 |
| --edge | rgba(177,201,232,.19) |
| --glow | rgba(100,93,233,.18) |
| --radius | 21 px |
| --section-gap | clamp(124 px,10 vw,154 px), 82 px sotto 801 px |
| --display | DM Sans, Inter, system-ui, sans-serif |
| --body | Inter, system-ui, sans-serif |

Tipografia e superfici esatte sono definite in styles.css. Le superfici di Expertise e Journey hanno gradienti specifici. Preservare i gradienti e gli spessori esistenti.
Container desktop max 1240 px, larghezza viewport meno 96 px. A 1060 px e meno margine totale 56 px. A 800 px e meno margine totale 36 px.
Hero H1 clamp(46 px,5 vw,70 px), line-height 1.09. Mobile clamp(39 px,8.4 vw,62 px).
Eyebrow e kicker teal, testo maiuscolo con tracking. Titoli bianchi e punto finale lilla. Body grigio.
Font locali distribuiti con licenze OFL. fonts.css conserva le dichiarazioni restituite dal servizio usato dalla v10. I pesi CSS intermedi sono risolti dal browser sulle facce incluse, come nella risposta originale. Non sostituire le famiglie.

### Link e azioni

Link testuali e controlli testuali: grigio #acb9cb, hover/focus #f0f5fa, transizione 180 ms. Link nel contenuto sottolineati con offset 4 px, navbar e controlli flip senza sottolineatura.
Focus outline 2 px lilla, offset 4 px, con eccezione del focus sulla card frontale come da CSS.
CTA primaria lilla con testo scuro. Secondaria Hero con bordo discreto.
Le frecce diagonali identificano destinazioni esterne. Frecce orizzontali per dettagli/ritorno. Non utilizzare una libreria di icone diversa senza approvazione.

## 5. Hero — APPROVATO

Eyebrow: ELISA BATTISTONI.  
H1: Building software with a scientist's mindset.  
Body: Experienced Software Developer with a PhD in Cognitive Neuroscience and a background in Data Science.  
CTA: Explore Projects → #projects; Get in Touch → #contact.

Desktop due colonne, testo a sinistra e tre frammenti a destra. Mobile testo, CTA, quindi visual.
I tre visual sono illustrazioni generiche di Software Engineering, Data Science e Neuroscience. Stato iniziale: Software davanti, Data in alto, Neuroscience in basso. Click/tap/Enter/Space su un frammento scambia la sua posizione con quello frontale. La posizione, non la disciplina, determina inclinazione e scala.

| Posizione | translate x/y | rotate | scale | z-index |
|---|---|---|---|---|
| front | 0% / 42% | -1.8 deg | 1 | 3 |
| upper | 31% / 4% | 3.6 deg | .92 | 1 |
| lower | 28% / 79% | 10 deg | .92 | 2 |

Scambio 520 ms cubic-bezier(.2,.78,.24,1). Stack rotateX 2 deg/rotateY-3 deg.
Tilt al mouse limitato circa ±3.5 deg su X e ±4.5 deg su Y, reset a pointerleave/cancel, aggiornamento via requestAnimationFrame. Nessun tilt touch o con reduced motion. Il tilt interno ha durata 240 ms ease-out.
aria-pressed identifica il frammento frontale. Immagini decorative alt vuoto, etichette visibili danno il nome al pulsante.
SCARTATI per questa release: Signal Atlas nell'Hero, typewriter, cubo e flip a tre facce. Signal Atlas resta documentato nello storico.

## 6. Selected Projects — APPROVATO

Due card featured in prima riga desktop, contributo Color Picker compatto a tutta larghezza sotto.
A 800 px e meno tutte le card in carousel orizzontale manuale, scroll snap, frecce, touch/trackpad. Nessun autoplay. Le frecce si disabilitano agli estremi e i controlli spariscono quando non serve scroll.
Card mobile min(84%,390px), gap 14 px.

| Progetto | Ruolo | Destinazioni |
|---|---|---|
| Brenta Wild Race | Web Design & Development · End-to-end | https://brentawildrace.it/ e https://github.com/elibattistoni/brenta-wild-race |
| Color Palette Manager | Raycast Extension · Author | https://www.raycast.com/elibattistoni/palette-colors e https://github.com/raycast/extensions/pull/32325 |
| Color Picker | Raycast Extension · Contribution | https://www.raycast.com/thomas/color-picker e https://github.com/raycast/extensions/pull/27420 |

Preservare descrizioni esatte in index.html/content.json, senza attribuire l'intera estensione Color Picker a Elisa.
Padding 24 px desktop/20 px mobile. Immagine→contenuto 32 px/24 px. Categoria→titolo 12 px. Titolo→descrizione 16 px. Descrizione→link 24 px. Le eccezioni della card compatta sono in CSS.
Visual 8:5, object-fit contain, raggio 11 px, bordo 1 px bianco al 9%. Brenta usa crop desktop e mobile distinti. Palette conserva tutta la finestra Raycast con margine. Il bordo può reagire all'hover, le immagini non si ingrandiscono.
SCARTATI: testo placeholder, visual generati al posto di screenshot reali, layout v7 con descrizioni fuori dalle card, zoom hover delle immagini.

## 7. Expertise — APPROVATO

Titolo Expertise. Intro: Software development is my focus, shaped by a background in data science and cognitive neuroscience.
Grid desktop 1.12 fr/1 fr/1 fr, gap 24 px. Software Engineering reca Primary focus e gradiente discreto. Su mobile una colonna gap 18 px.
Tre card indipendenti con due facce. Lato A: icona, titolo, descrizione, View details. Niente elenco linguaggi duplicato sul fronte.
Lato B: intestazione con icona e titolo allineati, gruppi di dettagli, Back to overview. Le tre icone sono SVG inline con stroke 1.4,32 px, teal.

| Card | Dettagli |
|---|---|
| Software Engineering | Language & frameworks: TypeScript, React, Next.js. Practice: Frontend architecture, UI/UX |
| Data Science | Language: Python. Methods: Data analysis, machine learning, visualization |
| Cognitive Neuroscience | Research methods: Experimental research, eye tracking, EEG/MEG. Tools: MATLAB, R. Publications: quattro titoli e DOI |

Desktop altezza minima 400 px, padding 30 px sui lati/sopra e 24 px sotto (24 px a 1060 px e meno).
Intestazione→contenuto 24 px, gruppi 20 px, etichetta→valore 6 px. Pubblicazioni 15 px, line-height 1.55, gap 14 px.
Su desktop scorre solo il corpo Neuroscience, titolo e Back restano fermi. Scrollbar sottile e sfumatura inferiore quando resta contenuto. Su mobile altezza naturale e nessuno scroll interno.
Flip 480 ms cubic-bezier(.25,.65,.23,1), perspective 1200 px e backface nascosta. La faccia inattiva è inert. Apertura sposta focus al titolo B, chiusura lo restituisce a View details. Reset scroll del corpo quando si riapre.
Reduced motion elimina rotazione e transizioni, mantenendo cambio di faccia e focus.
Senza JS i contenuti delle due facce restano leggibili.

Pubblicazioni approvate sul lato B, senza date nell'interfaccia:
1. Searching near and far: The attentional template incorporates viewing distance — https://doi.org/10.1037/xhp0001172
2. The time course of spatial attention during naturalistic visual search — https://doi.org/10.1016/j.cortex.2018.11.018
3. Preparatory attention in visual cortex — https://doi.org/10.1111/nyas.13320
4. Rapid influences of cued visual memories on attentional guidance — https://doi.org/10.1111/nyas.12574

I paper coprono più periodi del percorso, non sono tutti del PhD.
SCARTATI: modale, tab nel lato B, pubblicazioni esterne sotto la grid, software a tutta riga con le altre due sotto, quadratini attorno alle icone.

## 8. Skills Constellation — APPROVATO

Mappa Canvas 2D con proiezione 3D, libera sullo sfondo, dopo la grid Expertise. Tre cluster di competenze, colori teal/data periwinkle/neuroscience lilla. Dati, coordinate, collegamenti e algoritmo anti-collisione etichette in script.js.
Filtri All disciplines / Software Engineering / Data Science / Cognitive Neuroscience. aria-pressed coerente. Note brevi Software e Data presenti nella v10, nota Neuroscience e spiegazione generale rimossi.
Drag ruota, frecce tastiera ruotano, +/- zoom, Home reset. Pulsanti equivalenti presenti. Zoom clamp .72–1.4. Touch riconosce drag orizzontale mantenendo scroll verticale della pagina.
Canvas ristampato su richiesta, resize e font ready, DPR massimo 2. Rotazione iniziale yaw-.12,pitch.07. Layout stretto usa cluster verticali. Nella panoramica sotto 380 px alcune etichette secondarie si omettono, selezionando una disciplina se ne vedono i dettagli.
Elenco testuale accessibile e fallback canvas presenti nell'HTML. Preservarli nella migrazione.

## 9. Journey — APPROVATO

Titolo A non-linear journey. Timeline verticale semplice, cinque capitoli cronologici. The Present aperto al caricamento. Ogni details è indipendente, sono consentite più aperture simultanee.
Pallini teal, pieni quando aperti, anello teal quando chiusi.
Header mantiene date, capitolo, ruolo, organizzazione e chevron. Corpo con testo e tag, illustrazione SVG piccola a destra. Mobile una colonna, visual sotto il testo. Copy completo in content.json.

| Periodo | Capitolo | Ruolo | Organizzazione |
|---|---|---|---|
| 2010–2015 | The Origin | Cognitive Science | Trento & Amsterdam |
| 2015–2018 | The Depth | PhD in Cognitive Neuroscience | CIMeC · University of Trento |
| 2018–2021 | The Bridge | Data Scientist | BTData · JAKALA |
| 2021–2023 | The Crossing | Frontend Developer & Data Scientist | BlueTensor · bestbytes |
| 2024–Present | The Present | Software Developer | Namecheap · EasyWP |

L'apertura è nativa details/summary. Nessuna animazione artificiale dell'altezza da aggiungere. Chevron 200 ms, bordo 250 ms.
SCARTATI: timeline tortuosa, card quasi quadrate, pubblicazioni a fine Journey.

## 10. Contact e footer — APPROVATO

Sezione libera, leggero gradiente ambiente. Desktop colonne 13 fr/7 fr (65/35), gap clamp 32–64 px, allineamento verticale centrato.
Sinistra: titolo Let's build something together. e descrizione sottostante a 24 px, max 60 ch.
Body: Have a project in mind? I'm open to freelance opportunities, software collaborations, and projects connecting technology, data, and neuroscience.
Destra: un pulsante Copy email e link GitHub/LinkedIn sotto a 16 px.
Mobile una colonna, gap 32 px tra testo e azioni.

Indirizzo: elisa.battistoni.dev@gmail.com.
Clipboard.writeText su azione esplicita. Successo Email copied per 2500 ms, larghezza minima 146 px invariata, annuncio role=status. Errore: indirizzo selezionabile e istruzione manuale. Senza JS indirizzo visibile e pulsante nascosto.
Nessun invio email automatico. SCARTATI box Contact, link Open email app e indirizzo sempre esposto con JS.
GitHub https://github.com/elibattistoni
LinkedIn https://www.linkedin.com/in/elisa-battistoni-21597980/
Footer copyright 2026 e Back to top. L'eventuale anno dinamico è una scelta tecnica futura, non una variazione richiesta.

## 11. Responsive e accessibilità

Breakpoint approvati 1060/800/520 px, più adattamento interno Canvas a 550/380 px. CSS è autoritativo per ciascuna soglia. Non introdurre salti di layout non presenti nel riferimento.
- Sotto 801 px Hero e Contact impilati, progetti carousel, expertise colonna, journey compatto.
- Nessun overflow orizzontale del documento, consentito nel solo carousel.
- Focus sempre visibile, nomi accessibili, link esterni con noopener noreferrer.
- Azioni principali almeno 44 px, pulsanti del sito 50–51 px. Link progetto 34 px desktop/44 px mobile.
- H1 disponibile subito, landmark e skip link. Testi e link dei paper nel DOM.
- Reduced motion disabilita animazioni/transizioni/smooth scroll e mouse tilt.
- Immagini progetti lazy, Hero subito disponibile. Nessuna dipendenza framework o libreria grafica richiesta dal prototipo.

## 12. Asset e provenienza

Vedere assets/manifest.json e ASSETS_AND_LICENSES.md. Immagini usate estratte byte-per-byte dalla v10, PNG originali separati,16 SVG unici riutilizzabili, font locali con licenze. Gli SVG inline del prototipo sono il riferimento esatto per il tema. La costellazione è generata da codice, non richiede immagine esterna.

## 13. Questioni aperte di produzione

Il design corrente è APPROVATO. Restano da definire/verificare in sviluppo:
- Stack, componentizzazione, infrastruttura e deploy sul repository reale, che non è stato ispezionato in questo handoff.
- Metadata social/OG, favicon e manifest di installazione non fanno parte degli asset v10. Non inventare nuovi visual senza approvazione.
- QA reale Safari/Firefox, iOS/Android, screen reader, zoom 200%, metriche performance e audit WCAG completo.
- Verifica dei diritti sulle fotografie/loghi contenuti negli screenshot Brenta e sugli elementi di terzi. I file sono stati forniti per il portfolio, non sono accompagnati da liberatorie.
- Disponibilità futura delle destinazioni esterne. I link sono preservati, nessuna garanzia di disponibilità perpetua.
CV, ritratto e case study dedicati sono opzionali non inclusi nella release approvata.

## 14. Decision log storico e consolidamento

Le righe D-01–D-15 e le motivazioni originarie sono riportate di seguito senza alterare gli stati storici. La tabella successiva indica gli esiti finali.



> **Data iniziale di consolidamento:** 14 novembre 2026. Le decisioni elencate sono state prese nelle conversazioni precedenti e registrate qui in questa data; non è la data della loro approvazione originale.

| ID | Decisione | Stato al 14 nov 2026 | Motivazione / note |
|---|---|---|---|
| D-01 | Homepage Hero → Projects → Expertise → Journey → Contact | APPROVATO | Progetti subito visibili, percorso dopo le competenze |
| D-02 | Hero copy e CTA | APPROVATO | Comunicare esperienza tecnica e background scientifico senza ridimensionarsi |
| D-03 | Direzione Hybrid Scientific Premium | APPROVATO come direzione | Più professionale dei primi concept, con identità scientifica |
| D-04 | Palette lavender/teal su midnight graphite | PREFERITO / PROVVISORIO | Può essere cambiata |
| D-05 | Sans moderna; font specifici | DA DEFINIRE | Valutare licenze e leggibilità |
| D-06 | Sezioni più spaziose, niente divider decorativi | APPROVATO | Evitare aspetto troppo compresso/dashboard |
| D-07 | Projects carousel manuale + hover delicato | APPROVATO come UX | Evitare autoplay invasivo; supportare progetti futuri |
| D-08 | Expertise leggibile, 3D secondario | APPROVATO | Accessibilità delle competenze |
| D-09 | Journey cronologica, The Present espanso | APPROVATO | Valorizzare esperienza attuale senza perdere la narrazione |
| D-10 | Contact copy | APPROVATO | Invito chiaro a collaborazioni e freelance |
| D-11 | Hero Signal Atlas come visual preferito | PREFERITO / PROVVISORIO | Preferito a Brain → Interface attuale |
| D-12 | Brain → Interface | ACCANTONATO | Animazione non ancora convincente |
| D-13 | Cornice/tilt di Signal Atlas | DA DEFINIRE | Quattro varianti esistenti; la quinta richiesta è da creare |
| D-14 | Foto personale | DA DEFINIRE / opzionale | Non necessaria nell'Hero |
| D-15 | Non iniziare implementazione reale prima del brief definitivo | APPROVATO | Separare design da sviluppo |

### Decisioni finali consolidate il 17 novembre 2026

| ID | Decisione finale | Stato | Collegamento storico |
|---|---|---|---|
| D-16 | Approvazione complessiva v10 e passaggio allo sviluppo | APPROVATO | Chiude la fase D-15, nessun deployment implicito |
| D-17 | Palette e font esatti v10 | APPROVATO | Risolve D-04/D-05 |
| D-18 | Hero con tre illustrazioni cliccabili e tilt, lower 10 deg | APPROVATO | Supera D-11/D-13 |
| D-19 | Navbar, costellazione e Contact senza box | APPROVATO | Precisa D-03/D-06 |
| D-20 | Due progetti featured + contributo compatto, carousel solo mobile | APPROVATO | Precisa D-07 |
| D-21 | Screenshot autentici, bordo 1 px, nessuno zoom immagine | APPROVATO | Supera hover zoom delle prime versioni |
| D-22 | Expertise tre card flip, tecnologie solo sul retro | APPROVATO | Precisa D-08 |
| D-23 | Neuroscience retro unico scrollabile desktop, naturale mobile | APPROVATO | Supera modali/tab/pannelli esterni |
| D-24 | Expertise 400 px, gruppi 20 px, icone stroke 1.4 | APPROVATO | Rifinitura v10 |
| D-25 | Timeline lineare, multi-open, pallini teal, SVG piccoli destra | APPROVATO | Precisa D-09 |
| D-26 | Contact testo sinistra, azioni destra, Copy email +2 social | APPROVATO | Precisa D-10, email confermata |
| D-27 | Link grigio→bianco, focus lilla, reduced motion | APPROVATO | Coerenza e accessibilità |
| D-28 | Packaging offline, originali e screenshot di handoff | APPROVATO | Richiesta attuale, nessuna riprogettazione |

## 15. Changelog

| Versione | Data | Modifiche |
|---|---|---|
| v0.1 | 2026-11-14 | Prima consolidazione del brief esistente; decisioni con stati espliciti; collegamenti ai 4 HTML; piano per quinto Signal Atlas interattivo. |
| v1.0 | 2026-11-17 | Consolidamento finale v10 approvata. Aggiornate tutte le sezioni divenute definitive, asset, interazioni e responsive. Conservati log D-01–D-15 e snapshot integrale v0.1. Aggiunte decisioni D-16–D-28 e questioni aperte esclusivamente di produzione. |

Le versioni v1–v10 citate nella conversazione sono versioni del prototipo, non versioni intermedie della specifica. Nessun changelog documentale intermedio è stato inventato.
