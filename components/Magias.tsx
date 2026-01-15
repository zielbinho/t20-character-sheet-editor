import React, { useState } from 'react';
import { type CharacterSheet, type Spell, type AttributeName } from '../types';
import Section from './Section';

interface MagiasProps {
  data: CharacterSheet;
  onUpdate: (field: string, value: any) => void;
}

const CIRCLE_COSTS = {
    circle1: '1 PM',
    circle2: '3 PM',
    circle3: '6 PM',
    circle4: '10 PM',
    circle5: '15 PM',
};

const ATTRIBUTE_OPTIONS: { value: AttributeName, label: string }[] = [
    { value: 'for', label: 'Força' },
    { value: 'des', label: 'Destreza' },
    { value: 'con', label: 'Constituição' },
    { value: 'int', label: 'Inteligência' },
    { value: 'sab', label: 'Sabedoria' },
    { value: 'car', label: 'Carisma' },
];

const Magias: React.FC<MagiasProps> = ({ data, onUpdate }) => {
    const [openCircles, setOpenCircles] = useState<Record<string, boolean>>({});

    const toggleCircle = (circleKey: keyof typeof data.magic.spells) => {
        setOpenCircles(prev => ({
            ...prev,
            [circleKey]: !prev[circleKey]
        }));
    };

    const keyAttributeModifier = data.attributes[data.magic.keyAttribute].modifier;
    const resistanceDC = 10 + Math.floor(data.level / 2) + keyAttributeModifier;

    const handleKeyAttributeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate('magic.keyAttribute', e.target.value);
    };

    const handleSpellChange = (circle: keyof typeof data.magic.spells, id: string, field: keyof Spell, value: string) => {
        const newSpells = data.magic.spells[circle].map(spell => 
            spell.id === id ? { ...spell, [field]: value } : spell
        );
        onUpdate(`magic.spells.${String(circle)}`, newSpells);
    };

    const addSpell = (circle: keyof typeof data.magic.spells) => {
        const newSpell: Spell = {
            id: Date.now().toString(), name: '', school: '', execution: '', range: '', area: '', 
            duration: '', resistance: '', effect: ''
        };
        onUpdate(`magic.spells.${String(circle)}`, [...data.magic.spells[circle], newSpell]);
    };

    const removeSpell = (circle: keyof typeof data.magic.spells, id: string) => {
        const newSpells = data.magic.spells[circle].filter(spell => spell.id !== id);
        onUpdate(`magic.spells.${String(circle)}`, newSpells);
    };

    return (
        <Section title="Magias">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700">
                <div className="flex flex-col">
                    <label className="text-sm text-slate-500 dark:text-slate-400">Atributo-Chave</label>
                    <select value={data.magic.keyAttribute} onChange={handleKeyAttributeChange} className="bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500">
                        {ATTRIBUTE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Mod. Atributo</span>
                    <span className="text-2xl font-bold">{keyAttributeModifier >= 0 ? `+${keyAttributeModifier}` : keyAttributeModifier}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">CD Resistência</span>
                     <span className="text-2xl font-bold">{resistanceDC}</span>
                </div>
            </div>

            <div className="space-y-4">
                {(Object.keys(data.magic.spells) as Array<keyof typeof data.magic.spells>).map((circleKey, index) => {
                    const isOpen = openCircles[circleKey] || false;
                    const spellCount = data.magic.spells[circleKey].length;

                    return (
                        <div key={circleKey} className="bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => toggleCircle(circleKey)}
                                className="w-full text-left p-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex justify-between items-center"
                                aria-expanded={isOpen}
                                aria-controls={`circle-content-${String(circleKey)}`}
                            >
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                                        {index + 1}º Círculo
                                    </h3>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-300 dark:bg-slate-900 px-2 py-0.5 rounded-full">{spellCount} {spellCount === 1 ? 'magia' : 'magias'}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-normal text-slate-600 dark:text-slate-300">{CIRCLE_COSTS[circleKey]}</span>
                                    <i className={`fas fa-chevron-down transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
                                </div>
                            </button>

                            {isOpen && (
                                <div id={`circle-content-${String(circleKey)}`} className="p-4">
                                    <div className="space-y-4">
                                        {data.magic.spells[circleKey].length > 0 ? data.magic.spells[circleKey].map(spell => (
                                            <div key={spell.id} className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg border border-slate-300 dark:border-slate-700 relative">
                                                <div className="absolute top-2 right-2 flex items-center gap-3">
                                                    <button onClick={() => removeSpell(circleKey, spell.id)} className="text-red-600 hover:text-red-400" aria-label={`Remover magia ${spell.name}`}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2 pr-10">
                                                    <input type="text" placeholder="Magia" value={spell.name} onChange={e => handleSpellChange(circleKey, spell.id, 'name', e.target.value)} className="sm:col-span-2 lg:col-span-2 bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                                                    <input type="text" placeholder="Escola" value={spell.school} onChange={e => handleSpellChange(circleKey, spell.id, 'school', e.target.value)} className="lg:col-span-2 bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                                                    <input type="text" placeholder="Execução" value={spell.execution} onChange={e => handleSpellChange(circleKey, spell.id, 'execution', e.target.value)} className="lg:col-span-2 bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                                                    <input type="text" placeholder="Alcance" value={spell.range} onChange={e => handleSpellChange(circleKey, spell.id, 'range', e.target.value)} className="lg:col-span-2 bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                                                    <input type="text" placeholder="Área" value={spell.area} onChange={e => handleSpellChange(circleKey, spell.id, 'area', e.target.value)} className="lg:col-span-2 bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                                                    <input type="text" placeholder="Duração" value={spell.duration} onChange={e => handleSpellChange(circleKey, spell.id, 'duration', e.target.value)} className="lg:col-span-2 bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                                                    <div className="relative flex items-center sm:col-span-2 lg:col-span-4">
                                                        <i className="fas fa-shield-alt absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none"></i>
                                                        <input type="text" placeholder="Resistência" value={spell.resistance} onChange={e => handleSpellChange(circleKey, spell.id, 'resistance', e.target.value)} className="w-full bg-slate-200 dark:bg-slate-800 border border-sky-600 rounded px-2 py-1 pl-8 focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                                                    </div>
                                                </div>
                                                <textarea placeholder="Efeito" value={spell.effect} onChange={e => handleSpellChange(circleKey, spell.id, 'effect', e.target.value)} rows={2} className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded p-2 resize-y"></textarea>
                                            </div>
                                        )) : (
                                            <p className="text-center text-sm text-slate-500 italic py-2">Nenhuma magia neste círculo.</p>
                                        )}
                                    </div>
                                    <button onClick={() => addSpell(circleKey)} className="mt-4 text-sm bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 transition-colors w-full">+ Adicionar Magia</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Section>
    );
};

export default Magias;