import React from 'react';
import { Effect } from '../types';
import { CONDITIONS } from '../constants';
import Section from './Section';

interface ConditionManagerProps {
  effects: Effect[];
  onUpdate: (newEffects: Effect[]) => void;
}

const ConditionManager: React.FC<ConditionManagerProps> = ({ effects, onUpdate }) => {
  const handleConditionToggle = (conditionKey: string, isActive: boolean) => {
    const condition = CONDITIONS.find(c => c.key === conditionKey);
    if (!condition) return;

    let newEffects = [...effects];
    const sourcePrefix = `condition_${condition.key}`;

    // First, remove all effects associated with this condition key
    newEffects = newEffects.filter(e => !e.source?.startsWith(sourcePrefix));

    // If we are activating the condition, add all its effects
    if (isActive) {
      condition.effects.forEach((effect, index) => {
        const effectToAdd: Effect = {
          id: `${sourcePrefix}_${index}_${Date.now()}`,
          ...effect,
          source: `${sourcePrefix}_${effect.target}`
        };
        newEffects.push(effectToAdd);
      });
    }
    
    onUpdate(newEffects);
  };

  return (
    <Section title="Condições">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {CONDITIONS.map(condition => {
          const isActive = effects.some(e => e.source?.startsWith(`condition_${condition.key}`));
          return (
            <div key={condition.key} className="relative">
              <label
                title={condition.description}
                className={`w-full block text-sm text-center font-semibold p-2 rounded-md cursor-pointer border-2 transition-all ${
                  isActive
                    ? 'bg-red-500/20 border-red-500 text-red-500'
                    : 'bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => handleConditionToggle(condition.key, e.target.checked)}
                  className="absolute opacity-0 w-0 h-0"
                />
                {condition.name}
              </label>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default ConditionManager;