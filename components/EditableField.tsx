import React from 'react';

interface EditableFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number';
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  className = '',
  labelClassName = '',
  inputClassName = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.value);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <label className={`text-sm text-slate-500 dark:text-slate-400 mb-1 ${labelClassName}`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        className={`bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${inputClassName}`}
      />
    </div>
  );
};

export default EditableField;