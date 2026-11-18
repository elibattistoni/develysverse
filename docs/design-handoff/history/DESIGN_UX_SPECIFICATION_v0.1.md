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
