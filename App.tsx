
import React, { useState, useCallback, useEffect } from 'react';
import { QuoteItem, ProjectCategory } from './types';
import { HOURLY_RATE, CURRENCY_SYMBOL, CURRENCY_LOCALE, VAT_RATE } from './constants';
import InputField from './components/InputField';
import TextAreaField from './components/TextAreaField';
import NumberInputField from './components/NumberInputField';
import SelectField from './components/SelectField';
import Button from './components/Button';
import QuoteItemRow from './components/QuoteItemRow';
import Icon from './components/Icon';

// Dichiarazioni per jsPDF e jsPDF-autotable caricati globalmente
declare global {
  interface Window {
    jspdf: any; // jsPDF library attaches itself to window.jspdf
  }
}

const App: React.FC = () => {
  const [clientName, setClientName] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [projectCategory, setProjectCategory] = useState<ProjectCategory | string>('');

  // Nuovi campi cliente
  const [clientVatNumber, setClientVatNumber] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');
  const [clientPhoneNumber, setClientPhoneNumber] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPec, setClientPec] = useState<string>('');
  const [applyVat, setApplyVat] = useState<boolean>(true); // Applica IVA per default

  const [items, setItems] = useState<QuoteItem[]>([]);
  
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskHours, setNewTaskHours] = useState<number | string>('');

  const projectCategoryOptions = Object.entries(ProjectCategory).map(([key, value]) => ({
    value: key as ProjectCategory, 
    label: value,
  }));
  
  const handleAddItem = useCallback(() => {
    if (!newTaskDescription.trim() || (typeof newTaskHours === 'string' && !newTaskHours.trim()) || Number(newTaskHours) <= 0) {
      alert('Per favore, inserisci una descrizione valida e un numero di ore positivo per l\'attività.');
      return;
    }
    const newItem: QuoteItem = {
      id: crypto.randomUUID(),
      description: newTaskDescription.trim(),
      hours: Number(newTaskHours),
    };
    setItems(prevItems => [...prevItems, newItem]);
    setNewTaskDescription('');
    setNewTaskHours('');
  }, [newTaskDescription, newTaskHours]);

  const handleDeleteItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const handleUpdateItem = useCallback((updatedItem: QuoteItem) => {
    setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, []);

  const totalHours = items.reduce((sum, item) => sum + item.hours, 0);
  const subtotalCost = totalHours * HOURLY_RATE;
  const vatAmount = applyVat ? subtotalCost * VAT_RATE : 0;
  const grandTotalCost = subtotalCost + vatAmount;

  const handleDownloadQuote = useCallback(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const today = new Date().toLocaleDateString(CURRENCY_LOCALE, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const categoryLabel = projectCategoryOptions.find(opt => opt.value === projectCategory)?.label || projectCategory;
    const safeProjectName = projectName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'Progetto';

    // Titolo
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("PREVENTIVO", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Informazioni Generali
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let yPosition = 35;
    const lineSpacing = 7;

    doc.text(`Data: ${today}`, 15, yPosition);
    yPosition += lineSpacing;
    doc.text(`Cliente: ${clientName || 'Non specificato'}`, 15, yPosition);
    if (clientVatNumber) {
        yPosition += lineSpacing;
        doc.text(`P.IVA/CF: ${clientVatNumber}`, 15, yPosition);
    }
    if (clientAddress) {
        yPosition += lineSpacing;
        doc.text(`Indirizzo: ${clientAddress}`, 15, yPosition);
    }
    if (clientPhoneNumber) {
        yPosition += lineSpacing;
        doc.text(`Telefono: ${clientPhoneNumber}`, 15, yPosition);
    }
    if (clientEmail) {
        yPosition += lineSpacing;
        doc.text(`Email: ${clientEmail}`, 15, yPosition);
    }
    if (clientPec) {
        yPosition += lineSpacing;
        doc.text(`PEC: ${clientPec}`, 15, yPosition);
    }
    yPosition += lineSpacing;
    doc.text(`Progetto: ${projectName || 'Non specificato'}`, 15, yPosition);
    if (projectCategory) {
      yPosition += lineSpacing;
      doc.text(`Tipo Progetto: ${categoryLabel}`, 15, yPosition);
    }
    yPosition += lineSpacing * 1.5; 

    // Descrizione Progetto
    doc.setFont('helvetica', 'bold');
    doc.text("Descrizione Progetto:", 15, yPosition);
    yPosition += lineSpacing;
    doc.setFont('helvetica', 'normal');
    const projectDescLines = doc.splitTextToSize(projectDescription || 'Nessuna descrizione fornita.', doc.internal.pageSize.getWidth() - 30);
    doc.text(projectDescLines, 15, yPosition);
    yPosition += projectDescLines.length * lineSpacing + lineSpacing; 

    // Dettaglio Attività
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("DETTAGLIO ATTIVITÀ", 15, yPosition);
    yPosition += lineSpacing;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tariffa Oraria: ${HOURLY_RATE.toLocaleString(CURRENCY_LOCALE, { style: 'currency', currency: CURRENCY_SYMBOL })} /ora`, 15, yPosition);
    yPosition += lineSpacing * 1.5;

    // Tabella Attività
    const tableColumnStyles = {
      0: { cellWidth: 15, halign: 'center' }, 
      1: { cellWidth: 'auto', halign: 'left' }, 
      2: { cellWidth: 25, halign: 'right' }, 
      3: { cellWidth: 30, halign: 'right' }, 
    };

    const tableHead = [['#', 'Descrizione Attività', 'Ore Stimate', 'Costo']];
    const tableBody = items.map((item, index) => {
      const itemCost = item.hours * HOURLY_RATE;
      return [
        index + 1,
        item.description,
        item.hours.toFixed(1) + 'h',
        itemCost.toLocaleString(CURRENCY_LOCALE, { style: 'currency', currency: CURRENCY_SYMBOL })
      ];
    });

    (doc as any).autoTable({
      head: tableHead,
      body: tableBody,
      startY: yPosition,
      theme: 'striped', 
      headStyles: { fillColor: [30, 136, 229], textColor: 255, fontStyle: 'bold' }, 
      columnStyles: tableColumnStyles,
      didDrawPage: (data: any) => { 
        yPosition = data.cursor.y;
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + lineSpacing * 1.5; 

    // Totali
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Totale Ore Stimate: ${totalHours.toFixed(1)}h`, 15, yPosition);
    yPosition += lineSpacing;
    doc.text(`Subtotale Imponibile: ${subtotalCost.toLocaleString(CURRENCY_LOCALE, { style: 'currency', currency: CURRENCY_SYMBOL })}`, 15, yPosition);
    yPosition += lineSpacing;

    if (applyVat) {
      doc.text(`IVA (${(VAT_RATE * 100).toFixed(0)}%): ${vatAmount.toLocaleString(CURRENCY_LOCALE, { style: 'currency', currency: CURRENCY_SYMBOL })}`, 15, yPosition);
      yPosition += lineSpacing;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const totalLabel = applyVat ? `COSTO TOTALE (IVA Incl.):` : `COSTO TOTALE (Es. IVA):`;
    doc.text(`${totalLabel} ${grandTotalCost.toLocaleString(CURRENCY_LOCALE, { style: 'currency', currency: CURRENCY_SYMBOL })}`, 15, yPosition);
    yPosition += lineSpacing * 2;

    // Note a piè di pagina
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text("Questo preventivo è valido per 30 giorni dalla data di emissione.", 15, yPosition);
    yPosition += lineSpacing * 0.8;
    doc.text("Per accettazione, si prega di firmare e restituire una copia.", 15, yPosition);
    yPosition += lineSpacing * 0.8;
    doc.text("Modalità di pagamento: 50% all'inizio dei lavori, 50% alla consegna finale del progetto.", 15, yPosition);
    
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Pagina ${i} di ${pageCount}`, doc.internal.pageSize.getWidth() - 25, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save(`Preventivo_${safeProjectName}.pdf`);

  }, [
    clientName, projectName, projectCategory, projectDescription, items, totalHours, 
    subtotalCost, applyVat, vatAmount, grandTotalCost, projectCategoryOptions,
    clientVatNumber, clientAddress, clientPhoneNumber, clientEmail, clientPec
  ]);
  
  useEffect(() => {
    // Placeholder
  }, []);


  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-sky-400">Generatore di Preventivi</h1>
          <p className="text-slate-400 mt-2">Crea e personalizza i tuoi preventivi professionali.</p>
        </header>

        {/* Project Information Section */}
        <section className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-semibold text-sky-500 mb-6 border-b border-slate-700 pb-3">Informazioni Cliente e Progetto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Nome Cliente" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Es. Mario Rossi S.r.l." />
            <InputField label="Nome Progetto" id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Es. Sito Web E-commerce" />
            <InputField label="Partita IVA / Cod. Fiscale" id="clientVatNumber" value={clientVatNumber} onChange={e => setClientVatNumber(e.target.value)} placeholder="Es. IT01234567890" />
            <InputField label="Indirizzo Cliente" id="clientAddress" value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="Es. Via Roma 1, 00100 Città (XX)" />
            <InputField label="Numero di Telefono" id="clientPhoneNumber" value={clientPhoneNumber} onChange={e => setClientPhoneNumber(e.target.value)} placeholder="Es. 333 1234567" type="tel" />
            <InputField label="Email Cliente" id="clientEmail" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="Es. cliente@email.com" type="email" />
            <InputField label="PEC Cliente (Opzionale)" id="clientPec" value={clientPec} onChange={e => setClientPec(e.target.value)} placeholder="Es. cliente@pec.it" type="email" />
             <SelectField
              label="Tipo di Lavoro / Tecnologia Principale"
              id="projectCategory"
              value={projectCategory}
              onChange={e => setProjectCategory(e.target.value as ProjectCategory)}
              options={projectCategoryOptions}
            />
          </div>
          <div className="mt-6">
            <TextAreaField label="Breve Descrizione del Progetto" id="projectDescription" value={projectDescription} onChange={e => setProjectDescription(e.target.value)} placeholder="Descrivi brevemente il lavoro richiesto..." rows={4}/>
          </div>
           <div className="mt-6">
            <label htmlFor="applyVat" className="flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                id="applyVat"
                checked={applyVat}
                onChange={e => setApplyVat(e.target.checked)}
                className="h-5 w-5 text-sky-600 border-slate-500 rounded focus:ring-sky-500 bg-slate-700"
                aria-describedby="vatLabel"
              />
              <span id="vatLabel" className="ml-3 text-sm font-medium text-slate-300">
                Applica IVA ({ (VAT_RATE * 100).toFixed(0) }%) al preventivo
              </span>
            </label>
          </div>
        </section>

        {/* Add Task Section */}
        <section className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-semibold text-sky-500 mb-6 border-b border-slate-700 pb-3">Aggiungi Attività al Preventivo</h2>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <InputField 
              label="Descrizione Attività" 
              id="newTaskDescription" 
              value={newTaskDescription} 
              onChange={e => setNewTaskDescription(e.target.value)} 
              placeholder="Es. Sviluppo Homepage" 
              className="flex-grow"
            />
            <NumberInputField 
              label="Ore Stimate" 
              id="newTaskHours" 
              value={newTaskHours} 
              onChange={e => setNewTaskHours(e.target.value)}
              placeholder="Es. 10" 
              min={0} 
              step={0.5}
              className="sm:w-32"
            />
            <Button onClick={handleAddItem} variant="primary" size="md" className="w-full sm:w-auto mt-4 sm:mt-0" leftIcon={<Icon type="add" className="w-5 h-5"/>}>
              Aggiungi
            </Button>
          </div>
        </section>

        {/* Quote Items Table Section */}
        {items.length > 0 && (
          <section className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8">
            <h2 className="text-2xl font-semibold text-sky-500 mb-6 border-b border-slate-700 pb-3">Dettaglio Lavori</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider text-center w-12">#</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Attività</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider text-center w-28">Ore</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider text-right w-32">Subtotale</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider text-center w-20">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <QuoteItemRow
                      key={item.id}
                      item={item}
                      index={index}
                      onDeleteItem={handleDeleteItem}
                      onUpdateItem={handleUpdateItem}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        
        {/* Summary and Download Section */}
        <section className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-sky-500 mb-6 border-b border-slate-700 pb-3">Riepilogo Preventivo</h2>
          <div className="space-y-3 text-lg">
            <div className="flex justify-between">
              <span className="text-slate-300">Tariffa Oraria:</span>
              <span className="font-semibold">{HOURLY_RATE.toLocaleString(CURRENCY_LOCALE, { style: 'currency', currency: 'EUR' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Totale Ore Stimate:</span>
              <span className="font-semibold">{totalHours.toFixed(1)} h</span>
            </div>
             <div className="flex justify-between">
              <span className="text-slate-300">Subtotale Imponibile:</span>
              <span className="font-semibold">{subtotalCost.toLocaleString(CURRENCY_LOCALE, { style: 'currency', currency: 'EUR' })}</span>
            </div>
            {applyVat && (
              <div className="flex justify-between">
                <span className="text-slate-300">IVA ({ (VAT_RATE * 100).toFixed(0) }%):</span>
                <span className="font-semibold">{vatAmount.toLocaleString(CURRENCY_LOCALE, { style: 'currency', currency: 'EUR' })}</span>
              </div>
            )}
            <hr className="border-slate-700 my-3"/>
            <div className="flex justify-between text-2xl font-bold text-sky-400">
              <span>COSTO TOTALE {applyVat ? '(IVA Incl.)' : '(Es. IVA)'}:</span>
              <span>{grandTotalCost.toLocaleString(CURRENCY_LOCALE, { style: 'currency', currency: 'EUR' })}</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-6">
            Modalità di pagamento: 50% all'inizio dei lavori, 50% alla consegna finale del progetto.
          </p>
          {items.length > 0 && (
            <div className="mt-8 text-center">
              <Button onClick={handleDownloadQuote} variant="success" size="lg" leftIcon={<Icon type="download" className="w-5 h-5"/>}>
                Scarica Preventivo (.pdf)
              </Button>
            </div>
          )}
        </section>

        <footer className="text-center text-sm text-slate-500 mt-12 pb-8">
          <p>&copy; {new Date().getFullYear()} Generatore Preventivi. Realizzato con ❤️ da: Luca Difede.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
