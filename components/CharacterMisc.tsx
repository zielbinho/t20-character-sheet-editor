import React, { useRef, useEffect } from 'react';
import { type CharacterSheet, type Ability, type CalculatedSkills } from '../types';
import Section from './Section';
import Inventory from './Inventory';

interface CharacterMiscProps {
  data: CharacterSheet;
  onUpdate: (field: string, value: any) => void;
  calculatedSkills: CalculatedSkills;
  encumbrance: {
    totalLoad: number;
    capacity: number;
    maxCapacity: number;
    isOverencumbered: boolean;
    isOverloaded: boolean;
  };
}

const TextAreaSection: React.FC<{
    title: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    autoExpand?: boolean;
}> = ({ title, value, onChange, rows = 5, autoExpand = false }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (autoExpand && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto'; 
            textarea.style.height = `${textarea.scrollHeight}px`; 
        }
    }, [value, autoExpand]);
    
    return (
        <Section title={title}>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className={`w-full bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${autoExpand ? 'resize-none overflow-y-hidden' : ''}`}
            />
        </Section>
    );
};

interface AbilityListProps {
  title: string;
  abilities: Ability[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: 'name' | 'description', value: string) => void;
}

const AbilityList: React.FC<AbilityListProps> = ({ title, abilities, onAdd, onRemove, onUpdate }) => {
    return (
        <div>
            <label className="text-md font-semibold text-slate-600 dark:text-slate-300 mb-2 block">{title}</label>
            <div className="space-y-3">
                {abilities.length > 0 ? abilities.map(ability => (
                    <div key={ability.id} className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg border border-slate-300 dark:border-slate-700 relative">
                        <button 
                            onClick={() => onRemove(ability.id)} 
                            className="absolute top-2 right-2 text-red-600 hover:text-red-400 transition-colors"
                            aria-label={`Remover habilidade ${ability.name || 'sem nome'}`}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                        <input
                            type="text"
                            placeholder="Nome da Habilidade"
                            value={ability.name}
                            onChange={(e) => onUpdate(ability.id, 'name', e.target.value)}
                            className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 mb-2 font-semibold focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                        <textarea
                            placeholder="Descrição"
                            value={ability.description}
                            onChange={(e) => onUpdate(ability.id, 'description', e.target.value)}
                            rows={3}
                            className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded p-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                    </div>
                )) : (
                    <p className="text-center text-sm text-slate-500 italic py-2">Nenhuma habilidade adicionada.</p>
                )}
            </div>
            <button onClick={onAdd} className="mt-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 transition-colors w-full">
                + Adicionar Habilidade
            </button>
        </div>
    );
};

const CheckboxProficiency: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  title?: string;
}> = ({ label, checked, onChange, disabled = false, title }) => (
  <label
    className={`flex items-center gap-2 p-2 rounded-md border-2 transition-all cursor-pointer
      ${
        disabled
          ? 'bg-slate-200/50 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          : checked
          ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400'
          : 'bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
      }
    `}
    title={title}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="form-checkbox h-4 w-4 text-blue-600 bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-600 rounded focus:ring-blue-500 disabled:opacity-50"
    />
    <span className="font-semibold text-sm">{label}</span>
  </label>
);


const CharacterMisc: React.FC<CharacterMiscProps> = ({ data, onUpdate, calculatedSkills, encumbrance }) => {
    type AbilityType = 'race' | 'origin' | 'class' | 'general';
    
    const handleAddAbility = (type: AbilityType) => {
        const newAbility: Ability = { id: Date.now().toString(), name: '', description: '' };
        const currentAbilities = data.abilitiesAndPowers[type] || [];
        const updatedAbilities = [...currentAbilities, newAbility];
        onUpdate(`abilitiesAndPowers.${type}`, updatedAbilities);
    };

    const handleRemoveAbility = (type: AbilityType, id: string) => {
        const currentAbilities = data.abilitiesAndPowers[type] || [];
        const updatedAbilities = currentAbilities.filter(ability => ability.id !== id);
        onUpdate(`abilitiesAndPowers.${type}`, updatedAbilities);
    };

    const handleUpdateAbility = (type: AbilityType, id: string, field: 'name' | 'description', value: string) => {
        const currentAbilities = data.abilitiesAndPowers[type] || [];
        const updatedAbilities = currentAbilities.map(ability => 
            ability.id === id ? { ...ability, [field]: value } : ability
        );
        onUpdate(`abilitiesAndPowers.${type}`, updatedAbilities);
    };
    
  return (
    <div className="space-y-6">
        <Section title="Proficiências">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <CheckboxProficiency
                    label="Armas Marciais"
                    checked={data.proficiencies.marciais}
                    onChange={(v) => onUpdate('proficiencies.marciais', v)}
                />
                <CheckboxProficiency
                    label="Armas de Fogo"
                    checked={data.proficiencies.fogo}
                    onChange={(v) => onUpdate('proficiencies.fogo', v)}
                />
                <CheckboxProficiency
                    label="Armaduras Pesadas"
                    checked={data.proficiencies.pesadas}
                    onChange={(v) => onUpdate('proficiencies.pesadas', v)}
                />
                <CheckboxProficiency
                    label="Escudos"
                    checked={data.proficiencies.escudos}
                    onChange={(v) => onUpdate('proficiencies.escudos', v)}
                />
                <div className="sm:col-span-2">
                    <CheckboxProficiency
                        label="Armas Exóticas"
                        checked={data.proficiencies.exoticas}
                        onChange={(v) => onUpdate('proficiencies.exoticas', v)}
                        disabled={!data.proficiencies.marciais}
                        title={!data.proficiencies.marciais ? "Requer proficiência com Armas Marciais" : ""}
                    />
                </div>
            </div>
            <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2 block">Outras Proficiências</label>
                <textarea
                    value={data.proficiencies.custom}
                    onChange={(e) => onUpdate('proficiencies.custom', e.target.value)}
                    rows={3}
                    placeholder="Ex: Usar Gadanho, Usar Canhão..."
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                />
            </div>
        </Section>
        <Inventory
          inventory={data.inventory}
          moneyTS={data.moneyTS}
          moneyTO={data.moneyTO}
          onUpdate={(field, value) => onUpdate(field, value)}
          encumbrance={encumbrance}
        />

        <Section title="Habilidades & Poderes">
            <div className="space-y-6">
                <AbilityList 
                    title="Habilidades de Raça"
                    abilities={data.abilitiesAndPowers.race || []}
                    onAdd={() => handleAddAbility('race')}
                    onRemove={(id) => handleRemoveAbility('race', id)}
                    onUpdate={(id, field, value) => handleUpdateAbility('race', id, field, value)}
                />
                <AbilityList 
                    title="Habilidades de Origem"
                    abilities={data.abilitiesAndPowers.origin || []}
                    onAdd={() => handleAddAbility('origin')}
                    onRemove={(id) => handleRemoveAbility('origin', id)}
                    onUpdate={(id, field, value) => handleUpdateAbility('origin', id, field, value)}
                />
                <AbilityList 
                    title="Habilidades de Classe"
                    abilities={data.abilitiesAndPowers.class || []}
                    onAdd={() => handleAddAbility('class')}
                    onRemove={(id) => handleRemoveAbility('class', id)}
                    onUpdate={(id, field, value) => handleUpdateAbility('class', id, field, value)}
                />
                <AbilityList 
                    title="Poderes Gerais"
                    abilities={data.abilitiesAndPowers.general || []}
                    onAdd={() => handleAddAbility('general')}
                    onRemove={(id) => handleRemoveAbility('general', id)}
                    onUpdate={(id, field, value) => handleUpdateAbility('general', id, field, value)}
                />
            </div>
        </Section>

        <TextAreaSection title="Anotações" value={data.notes} onChange={v => onUpdate('notes', v)} rows={8} autoExpand={true} />
    </div>
  );
};

export default CharacterMisc;