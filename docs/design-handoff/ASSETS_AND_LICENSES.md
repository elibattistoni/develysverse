# Asset, originali e licenze

## File effettivamente usati

I 7 WebP in assets/images sono estratti senza ricompressione dalla v10 approvata. I nomi corrispondono a Hero Software/Data/Neuroscience, Brenta desktop/mobile, Palette Manager e Color Picker. Il manifest riporta dimensioni e SHA256.
Per riprodurre il design usare questi file. I due PNG Raycast in `assets/originals/` servono alla rigenerazione dei crop. Gli altri originali elencati qui sono conservati nell’archivio del handoff.

| Sorgente | Derivati | Provenienza |
|---|---|---|
| hero-software-original.png | hero-software.webp | Modern Code Editor and UI Preview(1).png, illustrazione generata e fornita per questo progetto |
| hero-data-original.png | hero-data.webp | Minimal Three-Cluster Scatter Plot.png, illustrazione generata e fornita per questo progetto |
| hero-neuroscience-original.png | hero-neuroscience.webp | Brain Waves on Screen(1).png, illustrazione generata e fornita per questo progetto |
| brenta-original.png | project-brenta-desktop.webp / project-brenta-mobile.webp | Screenshot fornito da Elisa del sito Brenta Wild Race |
| palette-colors-original.png | project-palette.webp | Screenshot dell'estensione, URL fornito da Elisa |
| color-picker-original.png | project-picker.webp | Screenshot dell'estensione, URL fornito da Elisa |

Le tre illustrazioni Hero sono raster originali, non sono disponibili file vettoriali/livelli sorgente.
Il crop Palette della v10 è (180,112,1820,1137) sul PNG 2000 × 1250, ridimensionato a 1440 × 900. Preservare il margine attorno alla finestra.
Le dimensioni intrinseche di alcuni img dell'HTML storico sono indicative. Le dimensioni reali sono nel manifest, le proporzioni visibili sono governate dal CSS.

Sorgenti screenshot Raycast:
- https://raw.githubusercontent.com/elibattistoni/extensions/53ca62e6b68bc105b017a14cd0111ad9afa58383/extensions/palette-colors/metadata/palette-colors-1.png
- https://raw.githubusercontent.com/elibattistoni/extensions/fb534d5009/extensions/color-picker/metadata/color-picker-4.png

## SVG

expertise-1/2/3 corrispondono a Software/Data/Neuroscience. journey-1…5 seguono l'ordine cronologico. interface-* contiene frecce, chevron e altri simboli unici.
Sono estratti dai path effettivi del prototipo. Le versioni standalone aggiungono namespace e colori/variabili per facilitarne l'apertura. Il prototipo conserva gli SVG inline con i rispettivi stili e attributi accessibili.
Nessun pacchetto di icone esterno è necessario. Non è stata identificata una licenza terza separata per questi path prodotti durante la prototipazione. Nessuna nuova licenza viene attribuita in questo handoff.

## Font

DM Sans e Inter, facce TrueType distribuite da Google Fonts. Incluse le licenze SIL Open Font License 1.1 per ciascuna famiglia e i relativi copyright. Conservare i file di licenza nella distribuzione.
fonts.css deriva dalla risposta al medesimo URL CSS usato dalla v10, con URL sostituiti da percorsi locali. sources.txt registra gli URL dei singoli binari.
La risposta include pesi statici 500/600/700/800 per DM Sans e 400/500/600/700/800 per Inter. I valori intermedi richiesti dal CSS del prototipo utilizzano il normale matching del browser.

Font CSS di origine:
https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;650;750&family=Inter:wght@400;500;600;650;700;750&display=swap

Licenze originali:
- https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt
- https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt

## Limiti di provenienza

I materiali sono quelli forniti/utilizzati nel progetto. L'inclusione non trasferisce diritti su marchi, fotografie o interfacce di terzi. Non sono state fornite liberatorie della fotografia/loghi Brenta o una licenza separata per ogni elemento raffigurato negli screenshot.
Il prototipo conserva i WebP usati per il rendering e i font con le relative licenze.
