import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className = '', titleClassName = '' }) => {
  return (
    <div className={`bg-slate-200/50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-4 shadow-lg relative ${className}`}>
      <h2 className={`text-lg font-bold text-red-600 dark:text-red-400 mb-4 absolute -top-4 left-4 bg-slate-200/80 dark:bg-slate-800 px-2 ${titleClassName}`}>{title}</h2>
      {children}
    </div>
  );
};

export default Section;