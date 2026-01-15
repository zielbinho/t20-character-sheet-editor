import React from 'react';
import { type Vital } from '../types';
import Section from './Section';

interface VitalsProps {
  life: Vital;
  mana: Vital;
  onUpdate: (field: 'life' | 'mana', subField: 'current' | 'max' | 'temp', value: number) => void;
}

const VitalBox: React.FC<{
    label: string;
    vital: Vital;
    onChange: (subField: 'current' | 'max' | 'temp', value: number) => void;
}> = ({ label, vital, onChange }) => (
    <div className="flex-1">
        <Section title={label} className="h-full" titleClassName="text-lg">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 h-full py-2">
                <input
                    type="number"
                    value={vital.current}
                    onChange={(e) => onChange('current', parseInt(e.target.value) || 0)}
                    className="w-20 text-2xl text-center bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`${label} Atuais`}
                />
                <span className="text-2xl text-slate-500 dark:text-slate-400">/</span>
                <input
                    type="number"
                    value={vital.max}
                    onChange={(e) => onChange('max', parseInt(e.target.value) || 0)}
                    className="w-20 text-2xl text-center bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`${label} Máximos`}
                />
                 <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                        <input
                            type="number"
                            value={vital.temp}
                            onChange={(e) => onChange('temp', parseInt(e.target.value) || 0)}
                            className="w-20 text-xl text-center bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`${label} Temporários`}
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Temp</span>
                    </div>
                </div>
            </div>
        </Section>
    </div>
);

const Vitals: React.FC<VitalsProps> = ({ life, mana, onUpdate }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <VitalBox label="Pontos de Vida" vital={life} onChange={(sub, val) => onUpdate('life', sub, val)} />
      <VitalBox label="Pontos de Mana" vital={mana} onChange={(sub, val) => onUpdate('mana', sub, val)} />
    </div>
  );
};

export default Vitals;