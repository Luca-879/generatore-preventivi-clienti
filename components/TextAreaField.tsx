
import React from 'react';
import { TextAreaFieldProps } from '../types';

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400
                   focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                   disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:shadow-none"
      />
    </div>
  );
};

export default TextAreaField;
