import React from 'react';
import { type Attributes, type AttributeName } from '../types';
import Section from './Section';

interface AttributesProps {
  attributes: Attributes;
  onUpdate: (field: `attributes.${AttributeName}.modifier`, value: number) => void;
  onRoll: (title: string, diceString: string) => void;
}

const ATTRIBUTE_NAMES: { key: AttributeName, name: string }[] = [
    { key: 'for', name: 'Força' },
    { key: 'des', name: 'Destreza' },
    { key: 'con', name: 'Constituição' },
    { key: 'int', name: 'Inteligência' },
    { key: 'sab', name: 'Sabedoria' },
    { key: 'car', name: 'Carisma' },
];

const AttributeBox: React.FC<{
    name: string;
    modifier: number;
    onChange: (value: number) => void;
    onRoll: () => void;
}> = ({ name, modifier, onChange, onRoll }) => (
    <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-2 rounded-lg border border-slate-300 dark:border-slate-700 space-y-1">
        <button 
            onClick={onRoll}
            className="text-base font-bold text-red-600 dark:text-red-400 text-center h-10 flex items-center justify-center rounded-md hover:bg-red-500/10 dark:hover:bg-red-900/50 w-full transition-colors"
            aria-label={`Rolar teste de ${name}`}
        >
            {name}
        </button>
        <div className="relative group">
            <input 
                type="number" 
                value={modifier}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className="w-20 text-3xl text-center font-bold bg-transparent border-b-2 border-slate-400 dark:border-slate-600 focus:outline-none focus:border-red-500 transition-colors appearance-none"
                aria-label={`Modificador de ${name}`}
            />
        </div>
    </div>
);

const Attributes: React.FC<AttributesProps> = ({ attributes, onUpdate, onRoll }) => {
  return (
    <Section title="Atributos">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {ATTRIBUTE_NAMES.map(({ key, name }) => (
                <AttributeBox
                    key={key}
                    name={name}
                    modifier={attributes[key].modifier}
                    onChange={(value) => onUpdate(`attributes.${key}.modifier`, value)}
                    onRoll={() => onRoll(
                        `Teste de ${name}`, 
                        `1d20${attributes[key].modifier >= 0 ? '+' : ''}${attributes[key].modifier}`
                    )}
                />
            ))}
        </div>
    </Section>
  );
};

export default Attributes;