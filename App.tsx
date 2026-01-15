import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { type AppState, type CharacterSheet, type CalculatedSkills, type Skill, type DiceRoll, UITheme, CalculatedAttack } from './types';
import { INITIAL_CHARACTER_SHEET } from './constants';
import CharacterHeader from './components/CharacterHeader';
import Attributes from './components/Attributes';
import Vitals from './components/Vitals';
import Combat from './components/Combat';
import Skills from './components/Skills';
import CharacterMisc from './components/CharacterMisc';
import Magias from './components/Magias';
import DiceRoller from './components/DiceRoller';
import RollHistory from './components/RollHistory';
import CharacterSelector from './components/CharacterSelector';
import LevelUpModal from './components/LevelUpModal';
import { rollDice, getTrainingBonus } from './utils';
import CharacterCreationWizard from './components/CharacterCreationWizard';


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const defaultState: AppState = { characters: {}, activeCharacterId: null, theme: 'dark' };
    try {
      const savedState = localStorage.getItem('tormenta20AppState');
      if (savedState) {
          const parsedState = JSON.parse(savedState);
          if (parsedState.name && !parsedState.characters) {
              const oldSheet = parsedState;
              const id = Date.now().toString();
              return {
                  ...defaultState,
                  characters: { [id]: { ...INITIAL_CHARACTER_SHEET, ...oldSheet, id } },
                  activeCharacterId: id,
                  theme: parsedState.theme || 'dark'
              };
          }
          return { ...defaultState, ...parsedState };
      }
    } catch (error) {
      console.error("Failed to parse app state from localStorage", error);
    }
    return defaultState;
  });
  
  const [view, setView] = useState<'selector' | 'sheet' | 'creation'>('selector');
  const [rollResult, setRollResult] = useState<DiceRoll | null>(null);
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);

  const characterSheet = useMemo(() => {
    if (appState.activeCharacterId && appState.characters[appState.activeCharacterId]) {
        return appState.characters[appState.activeCharacterId];
    }
    return null;
  }, [appState.activeCharacterId, appState.characters]);

  useEffect(() => {
    try {
        localStorage.setItem('tormenta20AppState', JSON.stringify(appState));
    } catch (error) {
        console.error("Failed to save app state to localStorage", error);
    }
  }, [appState]);

  useEffect(() => {
    const html = document.documentElement;
    if (appState.theme === 'light') {
        html.classList.remove('dark');
    } else {
        html.classList.add('dark');
    }
  }, [appState.theme]);
  
  const handleUpdate = useCallback((field: string, value: any) => {
    if (!appState.activeCharacterId) return;

    setAppState(prev => {
        const newCharacters = { ...prev.characters };
        const activeChar = { ...newCharacters[prev.activeCharacterId!] };
        
        const keys = field.split('.');
        let currentLevel: any = activeChar;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!currentLevel[keys[i]]) currentLevel[keys[i]] = {};
            currentLevel = currentLevel[keys[i]];
        }
        
        if (value === undefined) {
            delete currentLevel[keys[keys.length - 1]];
        } else {
            currentLevel[keys[keys.length - 1]] = value;
        }

        newCharacters[prev.activeCharacterId!] = activeChar;
        return { ...prev, characters: newCharacters };
    });
  }, [appState.activeCharacterId]);

  const handleVitalUpdate = useCallback((
    field: 'life' | 'mana', 
    subField: 'current' | 'max' | 'temp', 
    value: number
  ) => {
      if (!characterSheet) return;
      handleUpdate(`${field}.${subField}`, value);
  }, [characterSheet, handleUpdate]);
  
  const handleRoll = useCallback((title: string, diceString: string) => {
    const result = rollDice(diceString);
    if (result) {
      const newRoll: DiceRoll = { isOpen: true, title, diceString, ...result };
      setRollResult(newRoll);
      setRollHistory(prev => [newRoll, ...prev].slice(0, 15));
    } else {
      const errorRoll: DiceRoll = { isOpen: true, title: 'Erro na Rolagem', diceString, rolls: [], modifier: 0, total: 0 };
      setRollResult(errorRoll);
      setRollHistory(prev => [errorRoll, ...prev].slice(0, 15));
    }
  }, []);

  const handleCloseRoll = useCallback(() => setRollResult(null), []);

  const encumbrance = useMemo(() => {
    if (!characterSheet) return { totalLoad: 0, capacity: 10, maxCapacity: 20, isOverencumbered: false, isOverloaded: false };
    
    const { attributes, inventory, moneyTS, moneyTO } = characterSheet;
    const forModifier = attributes.for.modifier;

    const capacity = 10 + (forModifier * 2);
    const maxCapacity = capacity * 2;
    
    const itemSlots = inventory.reduce((sum, item) => sum + Number(item.slots || 0), 0);
    const totalCoins = moneyTS + moneyTO;
    const coinSlots = Math.floor(totalCoins / 1000);
    const totalLoad = itemSlots + coinSlots;

    const isOverencumbered = totalLoad > capacity && totalLoad <= maxCapacity;
    const isOverloaded = totalLoad > maxCapacity;

    return { totalLoad, capacity, maxCapacity, isOverencumbered, isOverloaded };
  }, [characterSheet]);

  const equipmentArmorPenalty = useMemo(() => {
    if (!characterSheet) return 0;
    return (characterSheet.defense.armor?.penalty || 0) + (characterSheet.defense.shield?.penalty || 0);
  }, [characterSheet?.defense.armor?.penalty, characterSheet?.defense.shield?.penalty]);

  const encumbranceArmorPenalty = useMemo(() => {
    return encumbrance.isOverencumbered ? 5 : 0;
  }, [encumbrance.isOverencumbered]);
  
  const totalArmorPenalty = useMemo(() => {
    return equipmentArmorPenalty + encumbranceArmorPenalty;
  }, [equipmentArmorPenalty, encumbranceArmorPenalty]);

  const cappedDexBonus = useMemo(() => {
    if (!characterSheet) return 0;
    const dexBonusRaw = characterSheet.attributes.des.modifier;
    const maxDexBonus = characterSheet.defense.armor?.maxDexBonus;
    return (maxDexBonus !== undefined && maxDexBonus !== null)
        ? Math.min(dexBonusRaw, maxDexBonus)
        : dexBonusRaw;
  }, [characterSheet?.attributes.des.modifier, characterSheet?.defense.armor?.maxDexBonus]);

  const calculatedDefense = useMemo(() => {
    if (!characterSheet) return 10;
    return 10 
        + cappedDexBonus
        + (characterSheet.defense.armor?.defense || 0)
        + (characterSheet.defense.shield?.defense || 0)
        + characterSheet.defense.others;
  }, [characterSheet, cappedDexBonus]);

  const calculatedSkills: CalculatedSkills = useMemo(() => {
      if (!characterSheet) return {};
      const { level, attributes, skills } = characterSheet;
      const halfLevel = Math.floor(level / 2);

      return Object.entries(skills).filter(([, skill]) => !!skill).reduce((acc, [key, skillValue]) => {
          const skill = skillValue as Skill;
          const isUsable = !(skill.isTrainedOnly && !skill.isTrained);
          const attributeModifier = attributes[skill.attribute].modifier;
          const trainingBonus = skill.isTrained ? getTrainingBonus(level) : 0;
          const armorPenaltyValue = skill.applyArmorPenalty ? -Math.abs(totalArmorPenalty) : 0;

          const total = halfLevel + attributeModifier + trainingBonus + skill.others + armorPenaltyValue;

          acc[key] = {
              ...skill,
              total,
              breakdown: {
                  halfLevel,
                  attribute: attributeModifier,
                  training: trainingBonus,
                  others: skill.others,
                  armorPenalty: armorPenaltyValue,
              },
              isUsable,
          };
          return acc;
      }, {} as CalculatedSkills);
  }, [characterSheet, totalArmorPenalty]);

  const calculatedAttacks = useMemo<CalculatedAttack[]>(() => {
    if (!characterSheet || !calculatedSkills.luta || !calculatedSkills.pontaria) return [];
    const { attacks, attributes } = characterSheet;
    
    return attacks.map(attack => {
        const skillBonus = calculatedSkills[attack.skillUsed]?.total || 0;
        const testBonus = skillBonus + attack.others;

        let damageRoll = attack.damageDice || '0';
        if (attack.damageAttribute && attack.damageAttribute !== 'none') {
            const attrMod = attributes[attack.damageAttribute].modifier;
            if (attrMod !== 0) {
                damageRoll = damageRoll.replace(/[+-]\d+$/, '');
                damageRoll += (attrMod >= 0 ? `+${attrMod}` : `${attrMod}`);
            }
        }

        return { ...attack, testBonus, damageRoll };
    });
}, [characterSheet, calculatedSkills]);

  const setActiveCharacter = (id: string | null) => {
    setAppState(prev => ({ ...prev, activeCharacterId: id }));
    if (id) setView('sheet');
  };

  const deleteCharacter = (id: string) => {
    if (window.confirm("Tem certeza que deseja apagar este personagem? Esta ação é irreversível.")) {
        setAppState(prev => {
            const newChars = { ...prev.characters };
            delete newChars[id];
            const newActiveId = prev.activeCharacterId === id ? null : prev.activeCharacterId;
            if (!newActiveId && Object.keys(newChars).length === 0) {
                setView('selector');
            }
            return {
                ...prev,
                characters: newChars,
                activeCharacterId: newActiveId,
            };
        });
    }
  };
  
  const handleThemeToggle = () => {
    setAppState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const handleExportCharacter = () => {
    if (!characterSheet) return;
    const dataStr = JSON.stringify(characterSheet, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${characterSheet.name.replace(/ /g, '_')}_t20.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleImportCharacter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedSheet = JSON.parse(e.target?.result as string);
            const id = importedSheet.id || Date.now().toString();
            importedSheet.id = id;
            setAppState(prev => ({
                ...prev,
                characters: { ...prev.characters, [id]: importedSheet },
                activeCharacterId: id,
            }));
            setView('sheet');
            alert(`Personagem "${importedSheet.name}" importado com sucesso!`);
        } catch (err) {
            console.error("Error importing character sheet:", err);
            alert("Erro ao importar a ficha. O arquivo pode estar corrompido ou em formato inválido.");
        }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  
  const handleLevelUp = () => {
    if (!characterSheet) return;
    handleUpdate('level', characterSheet.level + 1);
    setIsLevelUpOpen(false);
  };
  
  const handleStartCreation = () => setView('creation');
  
  const handleFinishCreation = (newCharacter: CharacterSheet) => {
      setAppState(prev => ({
          ...prev,
          characters: { ...prev.characters, [newCharacter.id]: newCharacter },
          activeCharacterId: newCharacter.id,
      }));
      setView('sheet');
  };

  if (view === 'creation') {
      return <CharacterCreationWizard onFinish={handleFinishCreation} onCancel={() => setView('selector')} />
  }

  if (view === 'selector' || !characterSheet) {
    return (
        <CharacterSelector 
            characters={Object.values(appState.characters)}
            onSelect={setActiveCharacter}
            onStartCreation={handleStartCreation}
            onDelete={deleteCharacter}
        />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-red-500 dark:text-red-500">
            <i className="fas fa-dragon mr-2"></i>
            Tormenta 20
          </h1>
          <div className="flex items-center gap-2">
            <input type="file" id="import-character" className="hidden" onChange={handleImportCharacter} accept=".json" />
            <button onClick={() => document.getElementById('import-character')?.click()} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold py-2 px-4 rounded transition-colors" title="Importar Personagem"><i className="fas fa-upload"></i></button>
            <button onClick={handleExportCharacter} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold py-2 px-4 rounded transition-colors" title="Exportar Personagem"><i className="fas fa-download"></i></button>
            <button onClick={handleThemeToggle} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold py-2 px-4 rounded transition-colors" title="Mudar Tema"><i className={`fas ${appState.theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i></button>
            <button onClick={() => setIsHistoryOpen(true)} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold py-2 px-4 rounded transition-colors" title="Histórico de Rolagens"><i className="fas fa-history"></i></button>
            <button onClick={() => setView('selector')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors" title="Trocar de Personagem"><i className="fas fa-users"></i></button>
          </div>
        </header>
        
        <main>
            <CharacterHeader data={characterSheet} onUpdate={handleUpdate} onLevelUpClick={() => setIsLevelUpOpen(true)} />
            
            <div className="my-6">
                <Attributes attributes={characterSheet.attributes} onUpdate={handleUpdate} onRoll={handleRoll} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                   <Vitals life={characterSheet.life} mana={characterSheet.mana} onUpdate={handleVitalUpdate} />
                    <Combat 
                      data={characterSheet}
                      calculatedAttacks={calculatedAttacks}
                      calculatedSkills={calculatedSkills}
                      onUpdate={handleUpdate} 
                      onRoll={handleRoll}
                      defenseTotal={calculatedDefense}
                      totalArmorPenalty={totalArmorPenalty}
                      equipmentPenalty={equipmentArmorPenalty}
                      encumbrancePenalty={encumbranceArmorPenalty}
                      dexBonusForDefense={cappedDexBonus}
                    />
                    <Skills 
                      skills={calculatedSkills}
                      level={characterSheet.level}
                      onUpdate={handleUpdate} 
                      onRoll={handleRoll} 
                    />
                    <Magias data={characterSheet} onUpdate={handleUpdate} />
                </div>
                
                <div className="xl:col-span-1 space-y-6">
                    <CharacterMisc data={characterSheet} onUpdate={handleUpdate} calculatedSkills={calculatedSkills} encumbrance={encumbrance} />
                </div>
            </div>
        </main>
      </div>
      
      {rollResult && rollResult.isOpen && (<DiceRoller {...rollResult} onClose={handleCloseRoll} />)}
      {isHistoryOpen && (<RollHistory history={rollHistory} onClose={() => setIsHistoryOpen(false)} />)}
      {isLevelUpOpen && (<LevelUpModal onClose={() => setIsLevelUpOpen(false)} onConfirm={handleLevelUp} character={characterSheet} />)}
    </div>
  );
};

export default App;
