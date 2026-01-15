import React from 'react';
import { type CharacterSheet, type Attack, type ArmorOrShield, AttackSkill, CalculatedAttack, CalculatedSkills, AttributeName } from '../types';
import { DAMAGE_TYPES } from '../constants';
import Section from './Section';

interface CombatProps {
  data: CharacterSheet;
  calculatedAttacks: CalculatedAttack[];
  calculatedSkills: CalculatedSkills;
  onUpdate: (field: string, value: any) => void;
  onRoll: (title: string, diceString: string) => void;
  defenseTotal: number;
  totalArmorPenalty: number;
  equipmentPenalty: number;
  encumbrancePenalty: number;
  dexBonusForDefense: number;
}

const ATTRIBUTE_OPTIONS: { value: AttributeName | 'none', label: string }[] = [
    { value: 'none', label: 'Nenhum' },
    { value: 'for', label: 'Força' },
    { value: 'des', label: 'Destreza' },
    { value: 'con', label: 'Constituição' },
    { value: 'int', label: 'Inteligência' },
    { value: 'sab', label: 'Sabedoria' },
    { value: 'car', label: 'Carisma' },
];

const Combat: React.FC<CombatProps> = ({ data, calculatedAttacks, calculatedSkills, onUpdate, onRoll, defenseTotal, totalArmorPenalty, equipmentPenalty, encumbrancePenalty, dexBonusForDefense }) => {
  const handleAttackChange = (id: string, field: keyof Attack, value: string | number | boolean) => {
    const newAttacks = data.attacks.map(attack =>
      attack.id === id ? { ...attack, [field]: value } : attack
    );
    onUpdate('attacks', newAttacks);
  };

  const addAttack = () => {
    const newAttack: Attack = { 
        id: Date.now().toString(),
        name: 'Novo Ataque',
        skillUsed: 'luta',
        others: 0,
        damageDice: '1d6',
        damageAttribute: 'for',
        critRange: 20,
        critMultiplier: 2,
        damageType: 'Corte',
        range: 'Corpo a corpo'
    };
    onUpdate('attacks', [...data.attacks, newAttack]);
  };
  
  const removeAttack = (id: string) => {
    onUpdate('attacks', data.attacks.filter(attack => attack.id !== id));
  };
  
  const handleEquipmentChange = (type: 'armor' | 'shield', field: keyof ArmorOrShield, value: string) => {
    const path = `defense.${type}.${field}`;
    
    let finalValue: string | number | undefined;

    if (field === 'name') {
        finalValue = value;
    } else if (field === 'maxDexBonus') {
        const parsed = parseInt(value, 10);
        finalValue = isNaN(parsed) ? undefined : Math.abs(parsed);
    } else { // for 'defense' and 'penalty'
        finalValue = Math.abs(parseInt(value, 10) || 0);
    }
    
    onUpdate(path, finalValue);
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Section title="Defesa">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-2">
            <div className="md:col-span-1 flex justify-center items-center">
                <div className="relative w-32 h-36 flex items-center justify-center" title={`Defesa Total: ${defenseTotal}`}>
                    <i className="fas fa-shield-alt text-slate-300 dark:text-slate-700 absolute text-[9rem] -z-0"></i>
                    <span className="relative text-5xl font-bold text-red-600 dark:text-red-400 z-10">{defenseTotal}</span>
                </div>
            </div>

            <div className="md:col-span-2 space-y-2 text-sm">
                <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2 rounded-md">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Base</span>
                    <span className="font-bold text-xl">10</span>
                </div>
                <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2 rounded-md">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Bônus de Destreza</span>
                    <span className="font-bold text-xl">{dexBonusForDefense}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2 rounded-md">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Bônus de Armadura</span>
                    <span className="font-bold text-xl">{data.defense.armor?.defense || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2 rounded-md">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Bônus de Escudo</span>
                    <span className="font-bold text-xl">{data.defense.shield?.defense || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2 rounded-md">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Outros</span>
                    <input
                        type="number"
                        value={data.defense.others}
                        onChange={(e) => onUpdate('defense.others', parseInt(e.target.value) || 0)}
                        className="w-20 text-right text-xl font-bold bg-transparent border-b-2 border-transparent hover:border-slate-400 focus:border-red-500 focus:outline-none transition-colors"
                        aria-label="Outros bônus de defesa"
                    />
                </div>
            </div>
        </div>
        <div className="text-right mt-2 text-sm text-slate-500 dark:text-slate-400 pr-2">
            Penalidade de Armadura:
            <span className="font-bold text-slate-800 dark:text-white">
                {totalArmorPenalty > 0 ? ` -${totalArmorPenalty}` : ' 0'}
            </span>
            {encumbrancePenalty > 0 && (
                <span 
                    className="text-xs ml-1" 
                    title={`Equipamento: -${equipmentPenalty} | Sobrecarga: -${encumbrancePenalty}`}
                >
                    (Sobrecarga)
                </span>
            )}
        </div>
      </Section>
      
      <Section title="Equipamentos de Defesa">
        <div className="space-y-4">
            <div>
                <h4 className="text-md font-semibold text-slate-600 dark:text-slate-300 mb-2">Armadura</h4>
                <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-6">
                        <label htmlFor="armor_name" className="text-xs text-slate-500 dark:text-slate-400">Nome</label>
                        <input id="armor_name" value={data.defense.armor.name} onChange={e => handleEquipmentChange('armor', 'name', e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="armor_def" className="text-xs text-slate-500 dark:text-slate-400 block text-center">Def</label>
                        <input id="armor_def" type="number" value={data.defense.armor.defense} onChange={e => handleEquipmentChange('armor', 'defense', e.target.value)} className="w-full text-center bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="armor_pen" className="text-xs text-slate-500 dark:text-slate-400 block text-center">Pen</label>
                        <input id="armor_pen" type="number" value={data.defense.armor.penalty} onChange={e => handleEquipmentChange('armor', 'penalty', e.target.value)} className="w-full text-center bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="armor_max_dex" className="text-xs text-slate-500 dark:text-slate-400 block text-center" title="Bônus Máximo de Destreza">Max.Des</label>
                        <input id="armor_max_dex" type="number" value={data.defense.armor.maxDexBonus ?? ''} onChange={e => handleEquipmentChange('armor', 'maxDexBonus', e.target.value)} className="w-full text-center bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="text-md font-semibold text-slate-600 dark:text-slate-300 mb-2">Escudo</h4>
                <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-8">
                        <label htmlFor="shield_name" className="text-xs text-slate-500 dark:text-slate-400">Nome</label>
                        <input id="shield_name" value={data.defense.shield.name} onChange={e => handleEquipmentChange('shield', 'name', e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="shield_def" className="text-xs text-slate-500 dark:text-slate-400 block text-center">Def</label>
                        <input id="shield_def" type="number" value={data.defense.shield.defense} onChange={e => handleEquipmentChange('shield', 'defense', e.target.value)} className="w-full text-center bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="shield_pen" className="text-xs text-slate-500 dark:text-slate-400 block text-center">Pen</label>
                        <input id="shield_pen" type="number" value={data.defense.shield.penalty} onChange={e => handleEquipmentChange('shield', 'penalty', e.target.value)} className="w-full text-center bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                    </div>
                </div>
            </div>
        </div>
      </Section>

      <div className="lg:col-span-2">
        <Section title="Ataques">
            <div className="space-y-4">
                {calculatedAttacks.map(attack => (
                    <div key={attack.id} className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg border border-slate-300 dark:border-slate-700 relative transition-all">
                        <button 
                            onClick={() => removeAttack(attack.id)} 
                            className="absolute top-2 right-2 text-red-600 hover:text-red-400 transition-colors"
                            aria-label={`Remover ataque ${attack.name || 'sem nome'}`}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-3 gap-y-3">
                            <div className="sm:col-span-2 lg:col-span-12">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Ataque</label>
                                <input type="text" value={attack.name} onChange={e => handleAttackChange(attack.id, 'name', e.target.value)} placeholder="Ex: Espada Longa" className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"/>
                            </div>

                            <div className="lg:col-span-3">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Perícia Base</label>
                                <select value={attack.skillUsed} onChange={e => handleAttackChange(attack.id, 'skillUsed', e.target.value as AttackSkill)} className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500">
                                    <option value="luta">Luta ({calculatedSkills.luta?.total > 0 ? '+' : ''}{calculatedSkills.luta?.total})</option>
                                    <option value="pontaria">Pontaria ({calculatedSkills.pontaria?.total > 0 ? '+' : ''}{calculatedSkills.pontaria?.total})</option>
                                </select>
                            </div>
                            <div className="lg:col-span-2">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Outros</label>
                                <input type="number" value={attack.others} onChange={e => handleAttackChange(attack.id, 'others', parseInt(e.target.value) || 0)} placeholder="0" className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"/>
                            </div>

                            <div className="lg:col-span-7 flex items-end">
                                <div className="w-full flex items-center">
                                    <div className="flex-grow text-center text-2xl font-bold bg-slate-200 dark:bg-slate-800/50 border border-r-0 border-slate-400 dark:border-slate-600 rounded-l-md py-1">
                                        {attack.testBonus >= 0 ? `+${attack.testBonus}` : attack.testBonus}
                                    </div>
                                    <button onClick={() => onRoll(`${attack.name || 'Ataque'} - Teste`, `1d20${attack.testBonus >= 0 ? '+' : ''}${attack.testBonus}`)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-md text-lg"><i className="fas fa-dice-d20"></i></button>
                                </div>
                            </div>

                            <div className="lg:col-span-3">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Dados de Dano</label>
                                <input type="text" value={attack.damageDice} onChange={e => handleAttackChange(attack.id, 'damageDice', e.target.value)} placeholder="1d8" className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"/>
                            </div>
                            <div className="lg:col-span-3">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Atributo no Dano</label>
                                <select value={attack.damageAttribute} onChange={e => handleAttackChange(attack.id, 'damageAttribute', e.target.value)} className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500">
                                    {ATTRIBUTE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            <div className="lg:col-span-6 flex items-end">
                                <div className="w-full flex items-center">
                                    <div className="flex-grow text-center text-md font-bold bg-slate-200 dark:bg-slate-800/50 border border-r-0 border-slate-400 dark:border-slate-600 rounded-l-md py-1 px-2 truncate">
                                        {attack.damageRoll}
                                    </div>
                                    <button onClick={() => onRoll(`${attack.name || 'Ataque'} - Dano`, attack.damageRoll)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-[5px] rounded-r"><i className="fas fa-dice-d20"></i></button>
                                </div>
                            </div>

                             <div className="lg:col-span-4">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Crítico</label>
                                <div className="flex items-center gap-1">
                                    <input type="number" value={attack.critRange} onChange={e => handleAttackChange(attack.id, 'critRange', parseInt(e.target.value) || 20)} className="w-1/2 bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                                    <span className="text-slate-500">/ x</span>
                                    <input type="number" value={attack.critMultiplier} onChange={e => handleAttackChange(attack.id, 'critMultiplier', parseInt(e.target.value) || 2)} className="w-1/2 bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1"/>
                                </div>
                            </div>
                            <div className="lg:col-span-4">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Tipo de Dano</label>
                                <select value={attack.damageType} onChange={e => handleAttackChange(attack.id, 'damageType', e.target.value)} className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500">
                                    {DAMAGE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div className="lg:col-span-4">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Alcance</label>
                                <input type="text" value={attack.range} onChange={e => handleAttackChange(attack.id, 'range', e.target.value)} placeholder="Curto" className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={addAttack} className="mt-4 text-sm bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 transition-colors w-full">+ Adicionar Ataque</button>
        </Section>
      </div>
    </div>
  );
};

export default Combat;