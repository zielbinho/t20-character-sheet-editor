import React from 'react';
import { type Skill, type CalculatedSkills, type CalculatedSkill, type AttributeName } from '../types';
import Section from './Section';

interface SkillsProps {
  skills: CalculatedSkills;
  level: number;
  onUpdate: (field: string, value: any) => void;
  onRoll: (title: string, diceString: string) => void;
}

const ATTRIBUTE_OPTIONS: { value: AttributeName, label: string }[] = [
    { value: 'for', label: 'FOR' },
    { value: 'des', label: 'DES' },
    { value: 'con', label: 'CON' },
    { value: 'int', label: 'INT' },
    { value: 'sab', label: 'SAB' },
    { value: 'car', label: 'CAR' },
];

const SkillRow: React.FC<{
  skillKey: string;
  skill: CalculatedSkill;
  onUpdate: (skillKey: string, field: keyof Skill, value: any) => void;
  onDelete?: (skillKey: string) => void;
  onRoll: (title: string, diceString: string) => void;
}> = ({ skillKey, skill, onUpdate, onDelete, onRoll }) => {

  const handleRoll = () => {
    onRoll(
        `Teste de ${skill.name}`,
        `1d20${skill.total >= 0 ? '+' : ''}${skill.total}`
    );
  };

  const breakdownTitle = `Total: ${skill.total} = ${skill.breakdown.halfLevel} (½ Nível) + ${skill.breakdown.attribute} (Atr) + ${skill.breakdown.training} (Treino) + ${skill.others} (Outros) ${skill.breakdown.armorPenalty !== 0 ? `+ ${skill.breakdown.armorPenalty}` : ''} (Pen. Armadura)`;

  return (
    <div className="flex flex-wrap md:grid md:grid-cols-12 items-center text-sm py-1.5 border-b border-slate-300 dark:border-slate-700 last:border-b-0 px-2 gap-x-2 gap-y-2 md:gap-y-0">
      {/* Training Icon & Star */}
      <div className="flex justify-center items-center md:col-span-1">
         <button
            onClick={() => onUpdate(skillKey, 'isTrained', !skill.isTrained)}
            className={`text-xl transition-colors ${skill.isTrained ? 'text-blue-500 hover:text-blue-400' : 'text-slate-400 dark:text-slate-600 hover:text-slate-300'}`}
            disabled={skill.isTrainedOnly && skill.isCustom}
            aria-label={skill.isTrained ? `Remover treino de ${skill.name}` : `Adicionar treino em ${skill.name}`}
            title={skill.isTrained ? "Treinado" : "Não Treinado"}
        >
            <i className="fas fa-graduation-cap"></i>
        </button>
      </div>
      <div className="flex justify-center items-center md:col-span-1">
         <button 
            onClick={() => onUpdate(skillKey, 'showInSummary', !skill.showInSummary)}
            className={`text-lg transition-colors ${skill.showInSummary ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-500 dark:text-slate-600 hover:text-slate-400'}`}
            aria-label={skill.showInSummary ? 'Remover do resumo' : 'Adicionar ao resumo'}
        >
            <i className={`fa-star ${skill.showInSummary ? 'fas' : 'far'}`}></i>
        </button>
      </div>

      {/* Name & Attr Select */}
      <div className="font-semibold flex items-center gap-2 w-full md:w-auto md:col-span-4" title={!skill.isUsable ? 'Requer treinamento para usar' : breakdownTitle}>
        {skill.isCustom ? (
            <input
                type="text"
                value={skill.name}
                onChange={(e) => onUpdate(skillKey, 'name', e.target.value)}
                className="w-full bg-transparent focus:outline-none focus:bg-slate-300/50 dark:focus:bg-slate-900 rounded px-1"
            />
        ) : (
             <button
                onClick={handleRoll}
                className={`text-left w-full ${!skill.isUsable ? 'text-slate-500 dark:text-slate-600 cursor-not-allowed' : 'hover:text-red-500 dark:hover:text-red-400 transition-colors'}`}
                disabled={!skill.isUsable}
             >
                {skill.name}
                {skill.isTrainedOnly && <span className="text-red-500 dark:text-red-400">*</span>}
             </button>
        )}
      </div>
      
      {/* Total */}
      <div className="text-center font-bold text-lg md:col-span-1">{skill.total >= 0 ? `+${skill.total}` : skill.total}</div>
      <div className="text-center text-slate-500 md:hidden">=</div>
      
      {/* Breakdown */}
      <div className="text-center text-slate-600 dark:text-slate-300 md:col-span-1">{skill.breakdown.halfLevel}</div>
      <div className="md:col-span-1">
          <select
            value={skill.attribute}
            onChange={(e) => onUpdate(skillKey, 'attribute', e.target.value as AttributeName)}
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded py-0.5 px-1 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none text-center"
            aria-label={`Atributo para ${skill.name}`}
          >
              {ATTRIBUTE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
      </div>
      <div className="text-center text-slate-600 dark:text-slate-300 md:col-span-1">{skill.breakdown.training}</div>

      {/* Outros (input) */}
      <div className="md:col-span-1">
          <input 
            type="number"
            value={skill.others}
            onChange={(e) => onUpdate(skillKey, 'others', parseInt(e.target.value) || 0)}
            className="w-full text-center bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded py-0.5 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
      </div>
      
      {/* Delete button */}
      <div className="text-right md:col-span-1">
        {skill.isCustom && onDelete && (
            <button onClick={() => onDelete(skillKey)} className="text-red-600 hover:text-red-400 text-xs">
                <i className="fas fa-trash"></i>
            </button>
        )}
      </div>
    </div>
  );
};

const Skills: React.FC<SkillsProps> = ({ skills, level, onUpdate, onRoll }) => {
    
    const getPatamar = (level: number): string => {
        if (level >= 1 && level <= 4) return 'Iniciante';
        if (level >= 5 && level <= 10) return 'Veterano';
        if (level >= 11 && level <= 16) return 'Campeão';
        if (level >= 17 && level <= 20) return 'Lenda';
        return 'Indefinido';
    };
    const patamar = getPatamar(level);

    const handleSkillUpdate = (skillKey: string, field: keyof Skill, value: any) => {
        onUpdate(`skills.${skillKey}.${field}`, value);
    };

    const handleAddOficio = () => {
        const newKey = `oficio_${Date.now()}`;
        const newOficio: Skill = {
            name: 'Ofício (Novo)',
            attribute: 'int',
            isTrained: true,
            others: 0,
            isTrainedOnly: true,
            applyArmorPenalty: false,
            isCustom: true,
            showInSummary: false,
        };
        onUpdate(`skills.${newKey}`, newOficio);
    };

    const handleDeleteOficio = (skillKey: string) => {
        onUpdate(`skills.${skillKey}`, undefined);
    }
    
    // FIX: Use Object.keys() to avoid issues with Object.entries() type inference
    // which was causing properties to be of type 'unknown'.
    const favoriteSkills = Object.keys(skills)
        .filter((key) => skills[key] && skills[key].showInSummary)
        .sort((a, b) => skills[a].name.localeCompare(skills[b].name));

  return (
    <Section title="Perícias">
        <h3 className="text-xl font-bold text-center mb-4 text-slate-700 dark:text-slate-300">
            Patamar: <span className="text-red-500">{patamar}</span>
        </h3>

        {favoriteSkills.length > 0 && (
            <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg">
                <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 text-center tracking-wider uppercase">Favoritos</h4>
                <div className="flex flex-wrap justify-center gap-2">
                    {/* FIX: Update map to iterate over keys and access skill from the skills object. */}
                    {favoriteSkills.map((key) => {
                        const skill = skills[key];
                        return (
                            <button 
                                key={key}
                                onClick={() => onRoll(`Teste de ${skill.name}`, `1d20${skill.total >= 0 ? '+' : ''}${skill.total}`)}
                                className={`bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${skill.isUsable ? 'hover:bg-slate-300 dark:hover:bg-slate-700' : 'opacity-50 cursor-not-allowed'}`}
                                disabled={!skill.isUsable}
                                title={!skill.isUsable ? 'Requer treinamento para usar' : ''}
                            >
                                <span>{skill.name}</span>
                                <span className="font-bold text-red-500">{skill.total >= 0 ? `+${skill.total}` : skill.total}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        )}
        
        <div className="border border-slate-300 dark:border-slate-700 rounded-lg max-h-[500px] overflow-y-auto relative">
            <div className="sticky top-0 z-10 hidden md:grid md:grid-cols-12 items-center text-xs font-bold text-slate-500 dark:text-slate-400 px-2 gap-x-2 bg-slate-200/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-300 dark:border-slate-700 py-2">
                <div className="col-span-1 text-center" title="Treinado"><i className="fas fa-graduation-cap"></i></div>
                <div className="col-span-1 text-center" title="Favorito"><i className="fas fa-star"></i></div>
                <div className="col-span-4">Perícia</div>
                <div className="col-span-1 text-center">Total</div>
                <div className="col-span-1 text-center" title="Metade do Nível">½ Nível</div>
                <div className="col-span-1 text-center" title="Modificador de Atributo">Atributo</div>
                <div className="col-span-1 text-center">Treino</div>
                <div className="col-span-1 text-center">Outros</div>
                <div className="col-span-1"></div>
            </div>
            <div>
                {Object.keys(skills).sort((a, b) => skills[a].name.localeCompare(skills[b].name)).map((key) => {
                    const skill = skills[key];
                    if (!skill) return null;
                    return (
                        <SkillRow 
                            key={key}
                            skillKey={key}
                            skill={skill}
                            onUpdate={handleSkillUpdate}
                            onDelete={skill.isCustom ? handleDeleteOficio : undefined}
                            onRoll={onRoll}
                        />
                    );
                })}
            </div>
        </div>
         <button onClick={handleAddOficio} className="mt-4 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 transition-colors w-full">+ Adicionar Ofício</button>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2"><span className="text-red-500 dark:text-red-400">*</span> Apenas treinado. Perícias inutilizáveis (sem treinamento) aparecem desabilitadas. A penalidade de armadura é somada automaticamente.</p>
    </Section>
  );
};

export default Skills;