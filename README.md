# Generatore Preventivi Cliente

Questa applicazione React è un semplice strumento per generare preventivi per clienti. Permette di aggiungere attività con ore stimate, calcolare automaticamente il costo totale (con o senza IVA) e scaricare il preventivo in formato PDF.

## Funzionalità

*   Aggiunta e gestione di attività con descrizione e ore stimate.
*   Calcolo automatico del subtotale, IVA e totale.
*   Opzione per applicare o escludere l'IVA.
*   Generazione e download del preventivo in formato PDF.
*   Campi per inserire i dettagli del cliente (Nome, P.IVA/CF, Indirizzo, Telefono, Email, PEC) e del progetto (Nome, Descrizione, Categoria).

## Prerequisiti

Assicurati di avere installato:

*   Node.js (versione consigliata: 14 o superiore)
*   npm o yarn

## Installazione

1. Clona il repository:
   `git clone <https://github.com/Luca-879/generatore-preventivi-clienti.git>`
   `cd generatore-preventivi-cliente`

2. Installa le dipendenze:
   `npm install`
   o
   `yarn install`

3. Configurazione (Opzionale):
   Il progetto utilizza alcune costanti definite in `constants.ts` (es. tariffa oraria, aliquota IVA). Puoi modificarle se necessario.

## Esecuzione Locale

1. Avvia l'applicazione in modalità sviluppo:
   `npm run dev`
   o
   `yarn dev`

2. Apri il tuo browser e vai all'indirizzo indicato (solitamente `http://localhost:5173/`).

## Tecnologie Utilizzate

*   React
*   TypeScript
*   Vite
*   Tailwind CSS (via CDN)
*   jsPDF e jsPDF-AutoTable per la generazione del PDF.

## Struttura del Progetto

*   `src/`: Contiene il codice sorgente dell'applicazione.
    *   `App.tsx`: Componente principale dell'applicazione.
    *   `index.tsx`: Entry point dell'applicazione.
    *   `constants.ts`: File contenente le costanti configurabili (tariffa oraria, IVA, ecc.).
    *   `types.ts`: Definizioni dei tipi TypeScript.
    *   `components/`: Directory contenente i componenti riutilizzabili dell'UI.
*   `public/`: Contiene file statici (es. `index.html`).
*   `vite.config.ts`: Configurazione di Vite.
*   `package.json`: Dipendenze e script di progetto.

## Deploy

(Aggiungere istruzioni specifiche per il deploy se necessario)

## Contributi

(Aggiungere informazioni su come contribuire se il progetto è open source)

## Licenza

(Aggiungere informazioni sulla licenza del progetto)
