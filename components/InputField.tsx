
import React from 'react';
import { InputFieldProps } from '../types';


const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400
                   focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                   disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:shadow-none"
      />
    </div>
  );
};

export default InputField;
