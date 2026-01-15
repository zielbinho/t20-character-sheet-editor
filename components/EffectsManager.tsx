import React, { useState } from 'react';
import { type Effect, type EffectTarget, CalculatedSkills, type Skill } from '../types';
import Section from './Section';

interface EffectsManagerProps {
    effects: Effect[];
    skills: CalculatedSkills;
    onUpdate: (newEffects: Effect[]) => void;
}

const EffectsManager: React.FC<EffectsManagerProps> = ({ effects, skills, onUpdate }) => {
    const [newEffectName, setNewEffectName] = useState('');
    const [newEffectValue, setNewEffectValue] = useState<number>(0);
    const [newEffectTarget, setNewEffectTarget] = useState<EffectTarget>('defense');

    const manuallyAddedEffects = effects.filter(e => !e.source || !e.source.startsWith('condition_'));

    const handleAddEffect = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEffectName || newEffectValue === 0) return;

        const newEffect: Effect = {
            id: Date.now().toString(),
            name: newEffectName,
            value: newEffectValue,
            target: newEffectTarget
        };
        onUpdate([...effects, newEffect]);
        
        setNewEffectName('');
        setNewEffectValue(0);
        setNewEffectTarget('defense');
    };

    const handleRemoveEffect = (id: string) => {
        onUpdate(effects.filter(effect => effect.id !== id));
    };

    return (
        <Section title="Efeitos Ativos (Manuais)">
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
                {manuallyAddedEffects.length > 0 ? manuallyAddedEffects.map(effect => (
                    <div key={effect.id} className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm">
                        <div className="flex-1">
                            <span className="font-semibold">{effect.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({skills[effect.target]?.name || effect.target.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())})</span>
                        </div>
                        <span className={`font-bold mr-4 ${effect.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {effect.value > 0 ? `+${effect.value}` : effect.value}
                        </span>
                        <button onClick={() => handleRemoveEffect(effect.id)} className="text-red-600 hover:text-red-400">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                )) : (
                    <p className="text-center text-sm text-slate-500 italic py-2">Nenhum efeito manual ativo.</p>
                )}
            </div>

            <form onSubmit={handleAddEffect} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     <input
                        type="text"
                        placeholder="Nome do Efeito (Ex: Oração)"
                        value={newEffectName}
                        onChange={e => setNewEffectName(e.target.value)}
                        className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                        required
                    />
                     <input
                        type="number"
                        placeholder="Valor (+2, -5)"
                        value={newEffectValue || ''}
                        onChange={e => setNewEffectValue(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                        required
                    />
                </div>
                <select 
                    value={newEffectTarget}
                    onChange={e => setNewEffectTarget(e.target.value as EffectTarget)}
                    className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                    <option value="defense">Defesa</option>
                    <option value="attack">Ataques</option>
                    <option value="all_skills">Todas as Perícias</option>
                    <optgroup label="Perícias Específicas">
                        {Object.entries(skills).filter(([,skill]) => !!skill).sort(([,a],[,b]) => (a as Skill).name.localeCompare((b as Skill).name)).map(([key, skill]) => (
                            <option key={key} value={key}>{(skill as Skill).name}</option>
                        ))}
                    </optgroup>
                </select>
                <button type="submit" className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 transition-colors">
                    + Adicionar Efeito
                </button>
            </form>
        </Section>
    );
};

export default EffectsManager;