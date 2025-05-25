
import React from 'react';
import { QuoteItem, ProjectCategory } from '../types';
import { HOURLY_RATE, CURRENCY_SYMBOL, CURRENCY_LOCALE } from '../constants';
import Icon from './Icon';
import Button from './Button';

interface QuoteItemRowProps {
  item: QuoteItem;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (item: QuoteItem) => void;
  index: number;
}

const QuoteItemRow: React.FC<QuoteItemRowProps> = ({ item, onDeleteItem, onUpdateItem, index }) => {
  
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHours = parseFloat(e.target.value);
    if (isNaN(newHours) || newHours < 0) {
      newHours = 0;
    }
    onUpdateItem({ ...item, hours: newHours });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateItem({ ...item, description: e.target.value });
  };

  const itemSubtotal = item.hours * HOURLY_RATE;

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
      <td className="py-3 px-4 text-sm text-slate-300 text-center">{index + 1}</td>
      <td className="py-3 px-4">
        <input
          type="text"
          value={item.description}
          onChange={handleDescriptionChange}
          className="w-full bg-transparent text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-slate-600 p-1 rounded-md"
          placeholder="Descrizione attività"
        />
      </td>
      <td className="py-3 px-4 text-center">
        <input
          type="number"
          value={item.hours.toString()} // Keep as string for input control, converted on change
          onChange={handleHoursChange}
          min="0"
          step="0.5"
          className="w-20 bg-transparent text-slate-100 text-center focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-slate-600 p-1 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </td>
      <td className="py-3 px-4 text-sm text-slate-300 text-right">
        {itemSubtotal.toLocaleString(CURRENCY_LOCALE, { style: 'currency', currency: 'EUR' })}
      </td>
      <td className="py-3 px-4 text-center">
        <Button
            onClick={() => onDeleteItem(item.id)}
            variant="danger"
            size="sm"
            aria-label="Elimina attività"
            className="p-1.5"
        >
            <Icon type="trash" className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
};

export default QuoteItemRow;
