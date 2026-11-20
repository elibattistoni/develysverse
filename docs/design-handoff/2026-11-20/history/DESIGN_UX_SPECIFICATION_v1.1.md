# Develysverse — Design & UX Specification

**Versione v1.1 · 20 novembre 2026 · Direzioni di revisione approvate**  
Owner e responsabile delle approvazioni: Elisa Battistoni.  
La v1.1 consolida la baseline v10 approvata il 17 novembre e le decisioni della revisione dopo la pubblicazione, discussa il 19–20 novembre. Sostituisce la v0.1 e la bozza di consolidamento v0.2 come riferimento operativo.

## 1. Stato, fonti e gestione delle decisioni

La revisione iniziata il 19 novembre riguardava UX/UI, favicon e immagini Journey. Sono state poi approvate le direzioni su Contact, Expertise, Skills Constellation, Journey, immagini dei progetti, movimento e interazioni, oltre al concept della favicon e alle rifiniture mobile. Le dimensioni indicative vanno validate sulla UI e i file finali vanno scelti dove indicato.

Ordine delle fonti:
1. Questa specifica, comprese le decisioni del 20 novembre.
2. Implementazione esistente per componenti, dati e convenzioni. Usare la v10 per verificare l'intento originale e le differenze.
3. Screenshot del sito post pubblicazione allegati alla conversazione. I 18 screenshot mobile coprono Hero, carousel Projects, Expertise su entrambe le facce, le pubblicazioni, Skills Constellation, Journey in più stati, Contact e footer.
4. Pacchetto `Develysverse_Codex_Handoff_v10.zip` per la specifica v1.0, il prototipo, i valori esatti, le risorse, il copy e i riferimenti visivi. Le scelte v10 citate qui si mantengono dove la revisione non le modifica. L'appendice A conserva la v0.1 come archivio.

La v10 e i riferimenti visivi allegati sono stati confrontati durante il consolidamento. Il sorgente del sito pubblicato e il comportamento nel browser non sono stati verificati durante questa revisione del documento.

Stati: **approvato**, **approvato come direzione**, **da validare** per misure e collaudi, **da completare** per output mancanti, **superato** per scelte sostituite. Aggiornare specifica, registro decisioni e changelog a ogni scelta significativa. Per l'implementazione nel repository serve l'autorizzazione specifica di Elisa. Accesso a Linear, pubblicazione e deployment restano azioni distinte.

## 2. Scopo e posizionamento — APPROVATO

Portfolio di Elisa Battistoni, Software Developer / Frontend Engineer, con esperienza in Data Science e PhD in Cognitive Neuroscience. Destinatari: engineering manager, recruiter, clienti freelance e collaboratori software/scientifici.

Il software engineering è il focus professionale principale. Il background scientifico è distintivo. Non trasformare interessi o percorsi di studio in qualifiche acquisite. Non inventare risultati, metriche, clienti, certificazioni o contatti.

Lingua dell'interfaccia e copy: inglese. Lingua della documentazione: italiano.

## 3. Architettura — APPROVATO

Ordine homepage: Hero → Selected Projects → Expertise (con Skills Constellation) → Journey → Contact → footer.
Navbar aperta sullo sfondo, brand a sinistra e quattro anchor a destra. Nessun riquadro e nessun menu hamburger nel layout approvato. Su mobile i link possono andare a capo.
Skip link al contenuto. Brand e Back to top tornano all'inizio. Nessuna pagina case study aggiuntiva richiesta.

Ruolo delle tre rappresentazioni. La Hero presenta l'identità professionale, Expertise rende leggibili competenze e applicazioni, la costellazione mostra le connessioni. La revisione accorcia il percorso verso Journey riducendo lo spazio occupato da Expertise e dalla costellazione, mantenendo il respiro della pagina.

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

### Revisione 20 novembre

Conservare selezione, tilt e profondità della Hero. Rendere più evidente l'interazione con bordo e moderato aumento di luminosità su hover e focus, più uno stato selezionato riconoscibile su touch. Attenuare il glow del cursore soprattutto durante la lettura. Con `prefers-reduced-motion` mantenere la selezione, con cambio immediato senza movimenti spaziali.

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
Nella v10, il contenitore è 8:5, con object-fit contain, raggio 11 px e bordo 1 px bianco al 9%. Brenta usa crop desktop e mobile distinti. La finestra Raycast intera del Palette Manager è il riferimento precedente al lavoro di crop descritto sotto. Il bordo può reagire all'hover, le immagini non si ingrandiscono.
SCARTATI: testo placeholder, visual generati al posto di screenshot reali, layout v7 con descrizioni fuori dalle card, zoom hover delle immagini.

### Revisione 20 novembre

Trattamento coerente degli screenshot autentici: margini e cornici comparabili, rapporto d'aspetto uniforme, bordi e raggi coerenti. Conservare i colori dei prodotti. Usare i file già in uso o gli originali del pacchetto v10 come punto di partenza. Privilegiare inquadrature che rendono leggibile la funzione a dimensione reale della card:

- Brenta Wild Race: porzione riconoscibile del sito, da valutare separatamente per desktop e mobile.
- Color Palette Manager: palette e campioni colore riconoscibili, anche se serve un crop della finestra.
- Color Picker: mostrare la selezione multipla e, se l'asset lo documenta, l'esportazione in blocco.

La cornice uniforme e il criterio funzionale sono approvati. Selezione, crop finali e resa nei viewport effettivi restano da verificare.

## 7. Expertise — APPROVATO

Titolo Expertise. Intro: Software development is my focus, shaped by a background in data science and cognitive neuroscience.
Grid desktop 1.12 fr/1 fr/1 fr, gap 24 px. Software Engineering reca Primary focus e gradiente discreto. Su mobile una colonna gap 18 px.
Tre card indipendenti con due facce e icone teal a tratto sottile. Sul fronte sono subito visibili icona, titolo, descrizione breve, tecnologie o metodi principali e **View details**. Il retro mantiene titolo, gruppi di approfondimento e **Back to overview** e racconta come Elisa ha applicato le competenze.

| Card | Fronte | Approfondimento |
|---|---|---|
| Software Engineering | TypeScript, React, Next.js | Funzionalità customer-facing, interfacce di billing e sicurezza, code review e problemi in produzione. |
| Data Science | Python, analisi dati, machine learning, NLP | Applicazioni documentate, ad esempio modelli predittivi, NLP/chatbot e analisi geospaziale. |
| Cognitive Neuroscience | Eye tracking, EEG/MEG e metodi sperimentali | Oggetto della ricerca, metodi analitici, strumenti e le quattro pubblicazioni. |

I temi guidano il copy inglese del retro. Redigere la formulazione finale usando esperienze verificabili.

Desktop: provare una riduzione del 20–25% rispetto alla baseline di 400 px, adattando padding e spazi al contenuto. È un obiettivo di confronto, con altezza e allineamenti da verificare in particolare sul retro Neuroscience. Su mobile ridurre i vuoti mantenendo testi e controlli leggibili, con altezza naturale.
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
Canvas ristampato su richiesta, resize e font ready, DPR massimo 2. Rotazione iniziale yaw-.12,pitch.07. Nella v10 il layout stretto usa cluster verticali. La revisione adatta composizione e densità come indicato sotto. Nella panoramica sotto 380 px alcune etichette secondarie si omettono, selezionando una disciplina se ne vedono i dettagli.
Elenco testuale accessibile e fallback canvas presenti nell'HTML. Preservarli nella migrazione.

### Revisione 20 novembre

#### Desktop

Titolo più discreto rispetto ai titoli di sezione, filtri su una riga quando lo spazio lo permette, scena più orizzontale. **Altezza di prova 320–380 px CSS**, da validare con etichette leggibili e senza sovrapposizioni.

#### Mobile

1. Vista iniziale compatta: tre reti più vicine e poche etichette principali.
2. Comando **Explore connections** per espandere il componente nella pagina.
3. Vista espansa con controlli completi per esplorare le discipline.
4. Comando **Close exploration** per richiudere il componente.

Non ottenere la versione compatta scalando semplicemente l'attuale grafico verticale: testo e controlli devono restare leggibili. Preservare la rappresentazione delle tre discipline anche nella vista iniziale.

Filtri per tutte le discipline e per singola disciplina; controlli di rotazione, zoom e reset da verificare nella vista espansa. Conservare le funzioni utili correnti, con stati visibili e nomi accessibili. L'esplorazione touch non deve impedire lo scorrimento della pagina.

**DA VALIDARE:** altezza mobile compatta/espansa, posizione esatta dei controlli, selezione delle etichette principali, gestione del focus alla chiusura, layout e interazioni effettive. La soluzione a espansione è approvata; non è richiesta una nuova decisione per iniziare a prototiparla.

## 9. Journey — APPROVATO

Titolo A non-linear journey. Timeline verticale semplice, cinque capitoli cronologici. The Present aperto al caricamento. Ogni details è indipendente, sono consentite più aperture simultanee.
Pallini teal, pieni quando aperti, anello teal quando chiusi.
Header mantiene date, capitolo, ruolo, organizzazione e chevron. Corpo con testo e tag. Desktop con illustrazione a lato del testo, mobile a una colonna con il visual centrato sotto il contenuto. Il copy completo è nel `content.json` del pacchetto v10.

| Periodo | Capitolo | Ruolo | Organizzazione |
|---|---|---|---|
| 2010–2015 | The Origin | Cognitive Science | Trento & Amsterdam |
| 2015–2018 | The Depth | PhD in Cognitive Neuroscience | CIMeC · University of Trento |
| 2018–2021 | The Bridge | Data Scientist | BTData · JAKALA |
| 2021–2023 | The Crossing | Frontend Developer & Data Scientist | BlueTensor · bestbytes |
| 2024–Present | The Present | Software Developer | Namecheap · EasyWP |

L'apertura è nativa details/summary. Nessuna animazione artificiale dell'altezza da aggiungere. Chevron 200 ms, bordo 250 ms.
SCARTATI: timeline tortuosa, card quasi quadrate, pubblicazioni a fine Journey.

### Serie illustrata e rifinitura mobile

Le cinque illustrazioni seguono la sequenza **percezione → cervello → dati → interfaccia → prodotto**. Palette, scala dei soggetti e un punto teal collegano i capitoli. Ogni immagine funziona anche da sola quando gli altri accordion sono chiusi.

Brief della serie: formato orizzontale 16:10, fondo trasparente, lavanda e teal, stile scientifico editoriale. Soggetti leggibili attorno a 200 px, pochi dettagli, tratti robusti e circa 10% di margine. Evitare testo, numeri, loghi, cornici esterne, fotografie e glow marcato.

| Capitolo | Brief del visual | Funzione del punto teal |
|---|---|---|
| 01 · The Origin | Occhio di profilo, tre stimoli geometrici, poche fissazioni con una traiettoria. | Fissazione dello sguardo. |
| 02 · The Depth | Cervello di profilo dominante, circonvoluzioni semplificate, piccola regione evidenziata e due brevi segnali neurali. | Regione studiata. |
| 03 · The Bridge | Un grafico a dispersione con punti teal e lavanda, curva di regressione leggibile, assi e griglia appena accennati. | Osservazione nel grafico. |
| 04 · The Crossing | Navigazione, scheda di un prodotto tecnologico e controllo interattivo separati, in allineamento verso una pagina e-commerce. | Controllo dell'interfaccia in costruzione. |
| 05 · The Present | Finestra di prodotto astratta, frontale, con sidebar, pannello e un piccolo elemento di sicurezza integrato, senza marchi EasyWP. | Indicatore di stato di un prodotto completo. |

- Desktop: provare **200–220 px CSS** di larghezza, lasciando al testo lo spazio necessario.
- Mobile: provare **180–220 px CSS**, centrati sotto il contenuto con meno spazio verticale attorno.
- Titolo mobile: tenere **non-linear** insieme quando lo spazio lo consente, verificando reflow e zoom.
- Esistono diverse varianti generate. Il brief è approvato e la selezione dei cinque file finali resta aperta. Il lavoro su layout, accordion e altre sezioni può procedere usando i visual correnti in attesa della selezione.


## 10. Contact e footer — revisione approvata

Conservare la sezione libera con gradiente discreto. Desktop: titolo e testo a sinistra, azioni a destra. Mobile: una colonna con CTA, indirizzo e social su righe distinte.

**Headline:** Let's build something together.  
**Body:** Have a project in mind? I'm open to freelance opportunities, software collaborations, and projects connecting technology, data, and neuroscience.

1. **Email me** è l'azione primaria e apre l'app di posta via `mailto:`.
2. L'indirizzo pubblico della v10, **elisa.battistoni.dev@gmail.com**, è leggibile e selezionabile. Verificare il valore effettivamente configurato nel repository durante l'implementazione.
3. La copia è un'azione secondaria. Mostrare **Copied** solo a operazione riuscita, con annuncio accessibile. L'indirizzo resta selezionabile in caso di errore o con JavaScript disabilitato.
4. GitHub e LinkedIn restano link secondari con le destinazioni documentate nella v10.

- GitHub: https://github.com/elibattistoni
- LinkedIn: https://www.linkedin.com/in/elisa-battistoni-21597980/

Nel footer, impilare copyright e **Back to top** alle larghezze più strette. La gerarchia desktop v10 è il riferimento.

## 11. Responsive e accessibilità

Breakpoint approvati 1060/800/520 px, più adattamento interno Canvas a 550/380 px. CSS è autoritativo per ciascuna soglia. Non introdurre salti di layout non presenti nel riferimento.
- Sotto 801 px Hero e Contact impilati, progetti carousel, expertise colonna, journey compatto.
- Nessun overflow orizzontale del documento, consentito nel solo carousel.
- Focus sempre visibile, nomi accessibili, link esterni con noopener noreferrer.
- Azioni principali almeno 44 px, pulsanti del sito 50–51 px. Link progetto 34 px desktop/44 px mobile.
- H1 disponibile subito, landmark e skip link. Testi e link dei paper nel DOM.
- Reduced motion disabilita animazioni/transizioni/smooth scroll e mouse tilt.
- Immagini progetti lazy, Hero subito disponibile. Nessuna dipendenza framework o libreria grafica richiesta dal prototipo.

### Verifica della revisione

| Area | Criterio |
|---|---|
| Layout | Verificare desktop, tablet e mobile, ad esempio 1440, 900, 390 e 320 px. Controllare zoom e reflow, senza scorrimento orizzontale della pagina. |
| Hero e motion | Tutti i frammenti raggiungibili da mouse, touch e tastiera. Focus e selezione riconoscibili. Tilt e flip sostituiti da cambi di stato immediati con movimento ridotto. |
| Progetti | Crop autentici, leggibili e coerenti tra card. Carousel manuale e link utilizzabili. |
| Expertise | Fronte immediatamente informativo, retro utile, quattro pubblicazioni raggiungibili. Focus spostato e ripristinato correttamente. |
| Costellazione | Vista iniziale più breve e vista espansa utilizzabile. Verificare filtri, zoom, rotazione, reset, focus al rientro e scorrimento verticale touch. |
| Journey | Aperture indipendenti, The Present aperto al caricamento, testo e immagini leggibili con reflow. |
| Contact | Verificare `mailto:`, copia e feedback di esito, fallback manuale, footer stretto. |
| Favicon | Controllare riconoscibilità a 16 e 32 px sui temi chiaro e scuro. |

Segnalare verifiche non eseguibili, in particolare browser, dispositivi, tecnologie assistive o stati per i quali servono asset definitivi.

## 12. Asset e provenienza

Vedere assets/manifest.json e ASSETS_AND_LICENSES.md. Immagini usate estratte byte-per-byte dalla v10, PNG originali separati,16 SVG unici riutilizzabili, font locali con licenze. Gli SVG inline del prototipo sono il riferimento esatto per il tema. La costellazione è generata da codice, non richiede immagine esterna.

### Favicon — direzione approvata

Monogramma **d.** geometrico. Asta semplice, curva netta, lettera lavanda, punto teal e fondo grafite. Niente glow. A 16 e 32 px il punto deve essere distinto e il vuoto interno della lettera deve restare aperto. Il disegno preciso e l'asset da integrare vanno valutati a queste dimensioni.

## 13. Lavoro da completare

- Provare altezze Expertise, costellazione e immagini Journey su viewport reali. Regolare intensità del glow, densità delle etichette e crop dei progetti in base alla leggibilità.
- Rifinire in inglese i retro delle tre card Expertise e verificare che i quattro DOI restino sul retro Cognitive Neuroscience, come mostrano gli screenshot del sito e il prototipo v10.
- Selezionare le illustrazioni Journey finali. Verificare trasparenza, dimensione utile del soggetto, coerenza della serie e leggibilità accanto al testo. Verificare il disegno finale della favicon prima di considerare chiuso l'asset.
- Eseguire i controlli della sezione 11 e riportare le eventuali differenze fra implementazione reale e baseline v10. Per le verifiche di produzione restano pertinenti Safari/Firefox, iOS/Android, screen reader e diritti sui contenuti di terzi negli screenshot. Metadata social, CV, ritratto e case study erano questioni o opzioni della v10 fuori da questa revisione.

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

### Decisioni della revisione dopo la pubblicazione, 19–20 novembre 2026

I codici D-01–D-28 restano quelli della v1.0. Le approvazioni raccolte nella bozza v0.2 sono consolidate qui con identificativi successivi.

| ID | Decisione | Stato e raccordo |
|---|---|---|
| D-29 | Usare la baseline v10, gli screenshot attuali e le conferme di Elisa. | Approvato. Le nuove decisioni hanno precedenza nelle aree interessate. |
| D-30 | Email me primaria, indirizzo visibile e copia secondaria con feedback. | Approvato. Aggiorna D-26 per azioni e feedback. |
| D-31 | Expertise più compatta, tecnologie sul fronte, retro con approfondimenti. | Approvato. Aggiorna D-22/D-24. Riduzione del 20–25% da validare. D-23 e pubblicazioni confermate. |
| D-32 | Costellazione secondaria, vista desktop più orizzontale, mobile compatta ed espandibile. | Approvato. Altezza desktop 320–380 px come prova e dettagli mobile da validare. |
| D-33 | Cinque illustrazioni Journey coordinate e più leggibili. | Direzione approvata. Aggiorna la parte illustrativa di D-25. Asset e dimensioni finali da validare. |
| D-34 | Trattamento coerente degli screenshot e crop che spiegano il progetto. | Approvato. Precisa D-21, con colori originali e selezione finale dei crop aperta. |
| D-35 | Glow cursore attenuato e stati Hero più evidenti. | Approvato. Precisa D-18 e D-27. |
| D-36 | Favicon d. geometrica lavanda, punto teal e fondo grafite. | Direzione approvata. Disegno e verifica a 16/32 px da completare. |
| D-37 | Titolo mobile con non-linear unito quando possibile e footer impilato alle larghezze strette. | Approvato. Reflow da verificare. |
| D-38 | Procedere con layout e interazioni durante la preparazione degli asset. | Approvato. |


## 15. Changelog

| Versione | Data | Modifiche |
|---|---|---|
| v0.1 | 2026-11-14 | Brief iniziale con varianti Signal Atlas, conservato integralmente nell'appendice A. |
| v1.0 | 2026-11-17 | Consolidamento della v10 approvata, interazioni, asset, responsive design e decisioni D-16–D-28. Versione originale nel pacchetto di handoff v10. |
| v0.2, bozza | 2026-11-20 | Prima sintesi della revisione del sito a partire dalla v0.1 allora allegata. Sostituita dalla v1.1, che integra la baseline v1.0 completa. |
| **v1.1** | **2026-11-20** | Consolidamento della v1.0 e della revisione del 19–20 novembre. Riprende i valori e i comportamenti approvati, integra tutti gli screenshot mobile disponibili e aggiorna decisioni, brief Journey, favicon e verifica. |

## Appendice A — v0.1 integrale, solo per archivio

La v0.1 è conservata integralmente. Consultare le sezioni 1–15 per il riferimento operativo. La v1.0 originale è disponibile nel pacchetto v10.

````markdown
# Develysverse v2 — Design & UX Specification

> **Documento vivo · Draft v0.1 · 14 novembre 2026**  
> **Stato generale:** progettazione e prototipazione, **non approvato per implementazione**.  
> **Fonte di verità:** decisioni esplicite di Elisa in questa chat e nelle successive conversazioni di design del progetto Develysverse.  
> **Responsabile delle approvazioni:** Elisa.  
> **Lingua di lavoro:** italiano; copy del sito: inglese.

## Come mantenere aggiornato questo documento

Questo file contiene **decisioni di prodotto/design, non istruzioni permanenti del progetto ChatGPT**. Aggiornarlo quando Elisa approva o modifica una scelta. Non sostituire una preferenza con una decisione definitiva senza consenso esplicito.

Stati ammessi:

- **APPROVATO** — decisione esplicita confermata; cambiarla solo dopo nuova discussione.
- **PREFERITO / PROVVISORIO** — direzione corrente su cui iterare; può cambiare.
- **DA DEFINIRE** — alternativa non ancora valutata o scelta mancante.
- **ACCANTONATO** — idea esplorata e sospesa, da non riattivare automaticamente.
- **SCARTATO** — scelta consapevolmente esclusa.

**Regola di manutenzione:** a ogni nuova decisione, aggiornare la sezione specifica, lo stato, il registro decisioni e il changelog; mantenere motivazione e storico. Incrementare la versione (v0.2, v0.3, …) quando cambia una decisione significativa. Evitare di gonfiare il documento con ogni micro-esperimento non approvato.

---

## 1. Vision, audience & positioning

**Progetto:** Develysverse — https://develysverse.com  
**Owner:** Elisa Battistoni  
**Scopo:** portfolio personale che valorizzi esperienza software, lavori realmente realizzati e prospettiva scientifica; supporti recruiter, opportunità freelance e collaborazioni software/scientifiche.

**Posizionamento (APPROVATO nel concept):** **Software Developer esperta**, attualmente focalizzata sul software engineering, con esperienza precedente in Data Science e PhD in Cognitive Neuroscience. Il percorso multidisciplinare deve essere un elemento distintivo, **non** un modo per ridimensionare l'esperienza tecnica già acquisita.

**Principi:**
- Professionalità prima dello spettacolo; personalità senza estetica infantile.
- Dimostrare competenze tramite progetti concreti e risultati verificabili.
- Comunicazione corretta: non presentare aree ancora in studio come expertise consolidata.
- Esperienza leggibile, accessibile, responsive e performante.
- Motion come parte dell'identità, ma non a discapito dell'usabilità.

**Pubblico prioritario:** engineering managers, recruiter, potenziali clienti freelance, sviluppatori e possibili collaboratori in ambiti data/scientifici. **Personas dettagliate:** DA DEFINIRE, non indispensabili per il primo redesign.

## 2. Stato del progetto / confini

**Fase attuale: UX/UI design e prototipazione**. Non è autorizzata alcuna modifica al repository, al sito live o al deployment. Non è ancora il momento di creare issue Linear. Tutti i prototipi devono essere **indipendenti**, anche quando simulano il sito intero.

**Già svolto:** confronto fra tre direzioni visive; selezione di Hybrid Scientific Premium; prototipi HTML dell'intera pagina; esperimenti su Brain → Interface e Signal Atlas; quattro varianti di Signal Atlas.

**Prossimo step:** creare e valutare una **quinta variante Interactive Tilted Glass**, preservando Signal Atlas e le altre quattro versioni, con confronto HTML e verifica nel browser.

**Non ancora svolto:** scelta finale del trattamento Hero, scelta definitiva dei font/colori, screenshot reali e design system definitivo, asset Journey definitivi, design review finale e specifica di implementazione pronta per Linear.

## 3. Information architecture

**APPROVATO — sequenza homepage:**

1. **Hero**
2. **Selected Projects**
3. **Expertise**
4. **Journey**
5. **Contact**

La navbar deve permettere l'accesso immediato alle sezioni e a Contact. La gerarchia delle sezioni è approvata; particolari di navigazione, CTA sticky e comportamento mobile sono ancora perfezionabili.

**Nessuna pagina case study dedicata è ancora obbligatoria.** Può essere valutata in futuro, quando il materiale è sufficiente.

## 4. Visual direction & design system

### 4.1 Direzione estetica

**APPROVATO come direzione generale:** **Hybrid Scientific Premium**, ibrido fra chiarezza tipografica/editoriale e immaginario scientifico-tech. Non equivale a un mockup definitivo da copiare al pixel.

**Riferimenti:**
- **Resend:** composizione, tipografia, gerarchia, qualità editoriale.
- **Raycast:** card grandi, carousel, glassmorphism, gradienti e interazioni.
- **Linear:** pulizia, precisione e attenzione ai dettagli.

**APPROVATO:** aumentare respiro verticale; evitare linee divisorie decorative fra sezioni; usare spazio, atmosfera e leggere variazioni cromatiche per il ritmo. Bordi sottili su card e pannelli consentiti.

### 4.2 Palette — PREFERITA / PROVVISORIA

| Token di lavoro | Valore proposto | Uso |
|---|---|---|
| `--background` | `#081019` | midnight blue/graphite, base pagina |
| `--surface` | `#111B29` | card e pannelli |
| `--text-primary` | `#F0F5FA` | testo principale |
| `--accent-lavender` | `#B8A7F9` | enfasi e dettagli |
| `--accent-teal` | `#70CFD0` | visual scientifici e accent secondario |

Tutti i valori sono **non definitivi**. Mancano token approvati per secondary text, borders, hover, focus, disabled, shadow e ambient glows. Verificare contrasto reale prima dell'approvazione.

### 4.3 Font — DA DEFINIRE

**Preferenza:** sans-serif moderna e netta, adatta a un portfolio tecnico premium. Font discussi: ABC Favorit (verificare licenza), Inter, Geist, DM Sans, Manrope. Non distribuire font non autorizzati e non presumere che ABC Favorit sia libero da licenza.

### 4.4 Tipografia e spaziatura — LINEE GUIDA PROVVISORIE

| Componente | Range desktop proposto |
|---|---|
| H1 Hero | ~60–76px |
| Heading sezioni | ~40–56px |
| Intro / testo principale | ~17–18px |
| Descrizioni delle card / Journey | ~16px |
| Metadata / label | ~12–13px (con contrasto adeguato) |
| Padding verticale sezioni | circa 120–160px, a seconda dei contenuti |

**APPROVATO come criterio:** i primi prototipi erano troppo compatti e con alcuni font troppo piccoli; le nuove versioni devono essere più spaziose e leggibili. Non imporre `100vh` a ogni sezione. Decidere token e breakpoint finali dopo verifica visiva.

### 4.5 Superfici

**PREFERITO:** glassmorphism discreto (trasparenze, lieve blur, hairline borders), gradiente ambiente lavender/teal, glow usato con parsimonia, profondità coerente. Evitare che tutti gli elementi sembrino card di dashboard; non applicare vetro su ogni blocco.

**Da definire:** radii, shadow scale, elevazioni, hover scale, blur e line thickness finali.

## 5. Hero

### 5.1 Copy — APPROVATO

**Eyebrow:** `ELISA BATTISTONI`

**H1:** **Building software with a scientist's mindset.**

**Descrizione:** **Experienced Software Developer with a PhD in Cognitive Neuroscience and a background in Data Science.**

**CTA:** `Explore Projects` · `Get in Touch`

**Accessibilità:** H1 leggibile immediatamente nel DOM/HTML. **SCARTATO:** vecchio typewriter che rendeva l'H1 vuoto o ritardato al caricamento.

### 5.2 Layout — PREFERITO

Desktop: copy a sinistra e visual a destra, spazio ampio, CTA subito raggiungibili. Mobile: priorità al testo, visual adattato, nessun overflow. Il visual non deve ridurre contrasto o leggibilità.

### 5.3 Hero visual — SIGNAL ATLAS (PREFERITO)

**Direzione attuale:** **Signal Atlas**, visual astratto che evoca reti, segnali, traiettorie e attenzione visiva: punti luminosi e connessioni sottili animate, palette fredda lavender/teal, ritmo lento, presenza non invadente.

**Importante:** il visual nasce come canvas animato organico. Nuove varianti di trattamento (glass/tilt) devono mantenere il carattere, evitando di sostituirlo con un grafico differente.

Varianti **esistenti ma non approvate come definitiva**:

| ID | Nome | Trattamento |
|---|---|---|
| 01 | **Original Open** | rete senza riquadro, integrata nello sfondo |
| 02 | **Floating Glass** | pannello frontale semitrasparente |
| 03 | **Tilted Glass** | pannello staticamente inclinato, vista di lato |
| 04 | **Oblique Open** | rete obliqua senza cornice |
| 05 | **Interactive Tilted Glass** | **DA CREARE**: tilt dinamico al movimento del cursore |

**Criteri per la variante 05:** pannello già leggermente inclinato, movimento 3D morbido e limitato al mouse, minimo parallax/riflessi, rientro dolce alla posa base a pointerleave, nessun layout shift, fallback touch statico, motion ridotto rispettato, preservazione animazione interna. Il primo test deve comparare le cinque versioni con **identico copy e layout**.

**ACCANTONATO:** `Brain → Interface` (cervello line drawing che evolve in dashboard): idea interessante ma il risultato visuale non convince per ora. Non riproporla senza richiesta.

**DA DEFINIRE:** pannello sì/no, prospettiva finale, intensità della rete, motion speed, parallax, densità/numero particelle, eventuale interazione con focus/scroll.

## 6. Selected Projects

**Intro — APPROVATO:** **A selection of things I've built, designed, and contributed to.**

### 6.1 Contenuti

**A. Brenta Wild Race — featured / end-to-end**  
https://brentawildrace.it/

> Designed and developed the complete website for a mountain running event, from information architecture and user experience to visual design and implementation.

Elisa ha curato progettazione UX, organizzazione delle informazioni, design e sviluppo.

**B. Color Palette Manager — featured / Raycast extension author**  
https://www.raycast.com/elibattistoni/palette-colors  
PR: https://github.com/raycast/extensions/pull/32325

Estensione sostanzialmente ricostruita, funzionalità di gestione/creazione/import-export palette e AI generation. **Authorship ufficiale trasferita a Elisa**. Evitare il vecchio URL dell'autore precedente.

**C. Color Picker — compact / OSS contribution**  
https://www.raycast.com/thomas/color-picker  
PR: https://github.com/raycast/extensions/pull/27420

Contributi per selezione di più colori e bulk export; **non** presentare Elisa come autrice dell'intera estensione.

### 6.2 UX — APPROVATO COME DIREZIONE

- Due card principali più grandi e una card OSS meno dominante.
- **Carousel orizzontale manuale**, niente autoplay; frecce, touch, trackpad e scroll snap.
- Hover desktop: lieve `scale` (~1.02), sollevamento, bordi/glow discreti, zoom dell'immagine; senza spostare le altre card.
- Layout scalabile quando verranno aggiunti nuovi progetti; niente placeholder «Coming Soon» riempitivi.
- Screenshot **reali** nei progetti finali; i mockup/screenshot nei prototipi attuali sono stilizzati e non sostituiscono asset reali.

**DA DEFINIRE:** numero di card visibili per breakpoint, indicatori di progressione, UX del mouse dragging e fallback se carousel non necessario con pochi progetti, eventuali case studies.

## 7. Expertise

**Sezione “Expertise” — APPROVATA.**

**Heading proposto — PREFERITO / NON DEFINITIVO:** **Three disciplines. One perspective.**

**Intro proposta:** **Software development is my focus, shaped by a background in data science and cognitive neuroscience.**

Tre blocchi accessibili e direttamente leggibili:

| Area | Gerarchia | Temi chiave |
|---|---|---|
| **Software Engineering** | focus professionale principale | TypeScript, React, Next.js, architettura frontend, UI/UX, software in produzione |
| **Data Science** | esperienza professionale precedente | Python, analytics, ML, visualization, NLP |
| **Cognitive Neuroscience** | formazione/ricerca scientifica | PhD, experimental research, eye tracking, EEG/MEG, MATLAB, R |

Una **3D Skills Constellation** può arricchire il racconto come elemento secondario. **Non deve essere l'unica maniera di accedere alle competenze**.

**DA DEFINIRE:** layout finale, densità del testo, presenza e comportamento della costellazione, visual e animazioni.

## 8. Journey

**Titolo — APPROVATO:** **A non-linear journey.**

**Struttura — APPROVATA:** cinque capitoli in ordine cronologico (non invertire per far comparire il presente in cima). **The Present aperto di default**, mantenendo ruolo/organizzazione/date visibili anche a card chiusa. Ampie card narrative e timeline verticale; no carousel.

| Capitolo | Periodo | Ruolo/contesto | Visual suggerito (NON definitivo) |
|---|---|---|---|
| **01 · The Origin** | 2010–2015 | Cognitive Science, Trento / Amsterdam | gaze paths / eye tracking |
| **02 · The Depth** | 2015–2018 | PhD Cognitive Neuroscience, CIMeC | MEG / reti neurali stilizzate |
| **03 · The Bridge** | 2018–2021 | Data Science, BTData / JAKALA | analytics / mappe / dati |
| **04 · The Crossing** | 2021–2023 | Frontend & Data Science, BlueTensor / bestbytes | UI layouts / wireframes |
| **05 · The Present** | 2024–Present | Software Developer, Namecheap / EasyWP | componenti di prodotto / dashboard astratte |

### Copy — bozze avanzate, da rifinire senza inventare risultati

**The Origin:**
> I studied cognitive science and began researching visual perception and attention through eye tracking, EEG, and behavioral experiments. During this period, I co-authored my first peer-reviewed publication.

**The Depth:**
> My PhD focused on visual attention in natural scenes, using MEG and machine learning to decode patterns of brain activity.

**The Bridge:**
> I applied data science to real-world problems, working on predictive modeling, natural language processing, chatbots, geospatial analysis and user journey mapping.

**The Crossing:**
> I worked across data science and frontend development before focusing on software engineering, contributing to production e-commerce applications with React, Next.js and TypeScript.

**The Present:**
> I develop customer-facing features for EasyWP, Namecheap's managed WordPress platform. My work includes feature delivery, billing and security-related interfaces, code reviews and production issue resolution. Outside work, I build and contribute to open-source Raycast extensions.

**Pubblicazioni scientifiche:** quattro pubblicazioni peer-reviewed; link preferibilmente discreto e accessibile dalla Journey:

1. [Searching near and far: The attentional template incorporates viewing distance (2024)](https://doi.org/10.1037/xhp0001172)
2. [The time course of spatial attention during naturalistic visual search (online 2018, volume 2020)](https://doi.org/10.1016/j.cortex.2018.11.018)
3. [Preparatory attention in visual cortex (2017)](https://doi.org/10.1111/nyas.13320)
4. [Rapid influences of cued visual memories on attentional guidance (online 2014, volume 2015)](https://doi.org/10.1111/nyas.12574)

**Evita imprecisioni:** non attribuire quattro paper interamente al PhD; non usare formulazioni come «reading minds» o affermazioni scientifiche iperboliche.

**DA DEFINIRE:** layout delle card aperte, posizione visivi, transizione apertura, comportamento di apertura multipla/singola, soluzione mobile, link pubblicazioni.

## 9. Contact

**Copy — APPROVATO:**

**Headline:** **Let's build something together.**

**Body:** **Have a project in mind? I'm open to freelance opportunities, software collaborations, and projects connecting technology, data, and neuroscience.**

**CTA:** email primaria; GitHub e LinkedIn secondari. Non inventare né usare `hello@example.com` come indirizzo di produzione; indirizzo reale **DA CONFERMARE**.

**Visual — PREFERITO:** finale pulito, elegante, con eventuale pannello glass discreto. **CV PDF** opzionale; **foto personale** opzionale, probabilmente in Journey/About e non dominante nell'Hero. Non generare automaticamente un ritratto senza nuova richiesta.

## 10. Interaction & motion guidelines

**APPROVATO COME CRITERIO DI QUALITÀ:**
- Motion lenta, naturale e non invadente; no autoplay dei carousel.
- Focus/hover/stati interattivi evidenti e coerenti.
- `prefers-reduced-motion` con fallback statici appropriati.
- Interazioni non basate soltanto su hover, soprattutto su mobile e tastiera.
- Evitare jank, layout shifts, overscroll accidentali e scrolling che impedisce la lettura.
- Verificare realmente mouse, pointerleave, touch, keyboard e vari breakpoint.

**DA DEFINIRE:** easing/durata di ogni microinterazione, eventuale scroll reveal, gestione canvas quando fuori viewport, limiti quantitativi di movimento.

## 11. Responsive, accessibility, performance & SEO

**Requisiti trasversali:**
- Gerarchia semantica `h1`–`h2`–`h3`, landmarks, pulsanti e link corretti, contenuti SEO immediatamente presenti nel DOM.
- Focus visibile, contrasto adeguato, controllo da tastiera, accessibilità delle accordion e delle frecce carousel.
- Test desktop, tablet, mobile e zoom; i piccoli font dei prototipi iniziali sono stati ritenuti insufficienti.
- Reflow senza scroll orizzontale dell'intera pagina; carousel orizzontale delimitato al componente.
- Ottimizzazione canvas/3D: evitare lavoro inutile, tenere conto di FPS, CPU/GPU e batteria.
- Immagini reali ottimizzate e dimensionate correttamente; caricamento e SEO curati.
- I componenti decorativi non devono nascondere informazioni critiche o impedire CTA.

**DA DEFINIRE:** breakpoints ufficiali, metriche target, test matrix, content strategy di eventuali case study e metadata/OG finali.

## 12. Asset register

| Asset | Stato | Note |
|---|---|---|
| Signal Atlas canvas | **PREFERITO** | Preserve the existing animation language; variants in attachments |
| Real screenshots — Brenta Wild Race | **DA ACQUISIRE** | Screenshot prodotti reali, non generazioni illustrative |
| Real screenshots — Color Palette Manager | **DA ACQUISIRE** | Preferire schermate dell'estensione autentiche |
| Real screenshots — Color Picker | **DA ACQUISIRE** | Mostrare contributo reale |
| Journey abstract illustrations (5) | **DA PROGETTARE** | Coerenti con contenuto e brand |
| Optional portrait | **NON DECISO** | Solo con richiesta e immagini di riferimento |
| CV PDF | **NON DECISO** | Solo se utile e disponibile |
| Fonts/licensing | **DA VERIFICARE** | Non distribuire font proprietari senza licenza |

## 13. Prototipi e file di riferimento

**Allegati da fornire a ChatGPT Work:**

- `develysverse_signal_atlas_interactive_comparison.html` — scelta interattiva fra 4 varianti, ideale per confronto.
- `develysverse_signal_atlas_open.html` — 01 Original Open.
- `develysverse_signal_atlas_glass.html` — 02 Floating Glass.
- `develysverse_signal_atlas_tilt.html` — 03 Tilted Glass.
- `develysverse_signal_atlas_open3d.html` — 04 Oblique Open.

**Avvertenze:** i prototipi sono studi visivi e non codice di produzione. Alcuni elementi restano dimostrativi: immagini stilizzate, dettagli di microcopy, link email placeholder. Non assumere che siano stati completamente testati solo perché caricabili.

**Prima modifica richiesta:** aggiungere variante **05 Interactive Tilted Glass** mantenendo 01–04; fornire demo compare, singola variante e browser verification report.

## 14. Questioni aperte — lista prioritaria

1. **Hero:** preferiamo Original Open, Floating Glass, Tilted Glass, Oblique Open o Interactive Tilted Glass? Definire prospettiva, cornice e intensità motion.
2. **Typography:** font primario/secondario definitivo, licenza, type scale responsive.
3. **Color system:** palette finale, livelli di contrasto, accenti, fondi, border/glow tokens.
4. **Projects:** screenshot autentici, layout con soli 3 progetti e crescita futura, carousel UX completa.
5. **Expertise:** composizione finale e ruolo della costellazione 3D.
6. **Journey:** dimensione/visual delle card e animazione espansione; pubblicazioni e mobile behavior.
7. **Contact:** indirizzo email reale, collocazione di CV/foto se necessari.
8. **QA/design handoff:** responsive design finalizzato, target performance, checklist test, materiali per issue Linear dopo autorizzazione.

## 15. Decision log

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

## 16. Change log

| Versione | Data | Modifiche |
|---|---|---|
| **v0.1** | **2026-11-14** | Prima consolidazione del brief esistente; decisioni con stati espliciti; collegamenti ai 4 HTML; piano per quinto Signal Atlas interattivo. |

---

### Criterio per considerare il documento pronto alla fase di implementazione

Elisa deve aver approvato: tipografia e palette, comportamento e trattamento dell'Hero, layout responsive di tutte le sezioni, screenshot e asset, copy finale, motion/accessibility patterns e flussi interattivi. Solo allora questa specifica potrà essere tradotta in requisiti e issue Linear, **previa autorizzazione per il connettore**.

````
