# Develysverse — Handoff per Codex

Il design approvato è la v10 del 17 novembre 2026. Iniziare da DESIGN_UX_SPECIFICATION.md e aprire index.html. Questo pacchetto è sufficiente per ricostruire la UI senza rileggere la conversazione.

## Avvio

Estrarre tutto lo ZIP. Dalla cartella Develysverse:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Aprire http://127.0.0.1:8000. Nessuna installazione, build o connessione Internet richiesta per rendering e interazioni. Le destinazioni esterne richiedono rete quando visitate.
Il doppio click su index.html funziona per la consultazione. Per font e Clipboard usare localhost, che offre un contesto sicuro. La copia può richiedere permesso del browser, con fallback manuale già presente.

## Struttura

| File/cartella | Uso |
|---|---|
| index.html | HTML finale con riferimenti locali |
| styles.css / script.js | CSS e JavaScript originali della v10, separati |
| DESIGN_UX_SPECIFICATION.md | Specifica 1.0 approvata, decision log e changelog |
| content.json | Testi e link estratti dalla v10, supporto alla migrazione |
| assets/images |7 raster esatti usati dal prototipo |
| assets/originals |6 PNG sorgente ad alta risoluzione |
| assets/icons |16 SVG unici estratti, incluse 5 illustrazioni Journey |
| assets/fonts | Font locali, CSS, provenienza e 2 licenze OFL |
| assets/manifest.json | Associazione file, dimensioni e hash immagini |
| ASSETS_AND_LICENSES.md | Provenienza, mapping e limiti dei materiali |
| visual-references | Screenshot desktop/mobile degli stati significativi e indice |
| verification | Risultati delle verifiche e limiti |
| history | Specifica 0.1 integrale, v9 e v10 originali |
| SHA256SUMS.txt | Integrità dei file del pacchetto |

Gli HTML in history conservano l'originale, compresi i collegamenti Google Fonts. Per l'apertura autosufficiente usare index.html nella radice.

## Indicazioni per Codex

Implementare il design usando le convenzioni del repository che Elisa autorizzerà a modificare. La scelta framework non è vincolata dal prototipo. Riutilizzare gli asset esatti e preservare semantica e comportamento.
Non introdurre nuove sezioni, contenuti, dipendenze grafiche o layout. Non sostituire i visual con placeholder.
I colori, i breakpoint e le durate sono in styles.css. I dati della costellazione e le interazioni sono in script.js.
Le modifiche di design richiedono approvazione. Linear richiede autorizzazione esplicita separata anche per letture. Questo handoff non richiede Linear.
La fotografia Brenta è contenuta nello screenshot del progetto, non è un background da estrarre e riutilizzare altrove.

## Criteri di accettazione

- Confrontare agli stessi viewport di visual-references, con font caricati. Conservare dimensioni, allineamenti, crop, spaziatura e colori. Piccole differenze di antialiasing tra OS sono attese.
- Hero iniziale Software davanti, Data sopra, Neuro sotto. Tutti e 3 i frammenti selezionabili da mouse/touch/tastiera, scambio corretto e tilt con reset.
- Progetti due featured +1 compatto desktop, carousel manuale mobile. Entrambe le immagini featured dentro la card, nessun zoom hover. Sei destinazioni esterne corrette.
- Expertise flip indipendenti e altezza stabile desktop. Focus sul titolo quando aperte, ritorno al trigger, faccia nascosta inert. Tecnologie solo sul retro.
- Neuroscience contiene 4 pubblicazioni, tutte raggiungibili. Desktop scorre solo il corpo. Mobile altezza naturale.
- Costellazione filtrabile, ruotabile e zoomabile da controlli/tastiera. Scroll verticale mobile preservato.
- Journey cronologica con Present aperto di default, più card apribili insieme e pallini teal.
- Contact titolo+descrizione a sinistra e tre azioni a destra. Solo Copy email come pulsante primario. Feedback 2.5 s, larghezza stabile, annuncio accessibile e fallback di errore.
- Link testuali coerenti grigio→bianco, focus lilla, reduced motion supportato.
- Nessun overflow del documento a 320/390/900/1440 px, immagini/font caricati, nessun errore JavaScript.
- Nessun requisito di rete per asset/UI. Le pagine esterne e le pubblicazioni restano link.
- Preservare skip link, landmark, alt e nomi dei controlli. Eseguire QA screen reader e cross-browser prima della release.

## Responsive e motion

Breakpoint 1060 px per padding, 800 px per layout mobile, 520 px per visual stretto. Canvas usa anche 550/380 px.
Navbar va a capo. Hero/Contact impilati. Expertise colonna. Journey header compatto e visual sotto il testo.
Flip 480 ms, scambio Hero 520 ms, tilt 240 ms, hover link 180 ms. Nessun autoplay, scroll reveal o transizione d'altezza Journey aggiuntivi.
Reduced motion azzera animazioni, transizioni e smooth scroll, mantiene selezioni e focus.

## Questioni aperte e verifiche

Leggere verification/REPORT.md e la sezione 13 della specifica. Design e copy sono approvati. Resta la QA di produzione, oltre a metadata social/favicon e verifica diritti su materiali di terzi. La provenienza delle icone è l'SVG del prototipo, nessuna libreria terza è stata identificata come dipendenza.
