
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RACES, ORIGINS, CLASSES, DIVINITIES } from '../data/T20Data';
import { INITIAL_CHARACTER_SHEET, SKILL_LIST } from '../constants';
import { type CharacterSheet, type RaceData, type OriginData, type ClassData, type DivinityData, type Ability, AttributeName, GeneralPowerData } from '../types';
import { rollDice } from '../utils';

interface CharacterCreationWizardProps {
  onFinish: (newCharacter: CharacterSheet) => void;
  onCancel: () => void;
}

const ATTRIBUTE_COSTS: Record<number, number> = { 1: 1, 2: 2, 3: 4, 4: 7 };
const ATTRIBUTE_NAMES: Record<AttributeName, string> = {
    for: 'Força', des: 'Destreza', con: 'Constituição', int: 'Inteligência', sab: 'Sabedoria', car: 'Carisma'
};

const CharacterCreationWizard: React.FC<CharacterCreationWizardProps> = ({ onFinish, onCancel }) => {
    const [step, setStep] = useState(0);
    const stepTitleRef = useRef<HTMLHeadingElement>(null);

    const [draft, setDraft] = useState({
        name: '',
        attributeMethod: 'points' as 'points' | 'dice',
        attributes: { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 },
        dicePool: [] as number[],
        humanAttributeBonuses: [] as AttributeName[],
        lefouAttributeBonuses: [] as AttributeName[],
        race: null as RaceData | null,
        class: null as ClassData | null,
        arcanistPath: '' as 'mago' | 'bruxo' | 'feiticeiro' | '',
        origin: null as OriginData | null,
        originBenefits: [] as (string | Ability)[],
        divinity: null as DivinityData | null,
        trainedSkills: [] as string[],
        extraPowers: [] as GeneralPowerData[],
        equipment: { money: 20 },
    });

    const steps = [
        { id: 1, title: 'Atributos', desc: 'Defina seu potencial físico e mental.' },
        { id: 2, title: 'Raça', desc: 'Escolha sua ascendência.' },
        { id: 3, title: 'Classe', desc: 'Sua vocação e treinamento.' },
        { id: 4, title: 'Origem', desc: 'Seu passado antes da aventura.' },
        { id: 5, title: 'Divindade', desc: 'Escolha seu patrono divino (Opcional).' },
        { id: 6, title: 'Revisão', desc: 'Confirme os detalhes finais.' }
    ];

    useEffect(() => {
        stepTitleRef.current?.focus();
        window.scrollTo(0, 0);
    }, [step]);

    const finalAttributes = useMemo(() => {
        const final = { ...draft.attributes };
        if (draft.race?.attributeBonuses) {
            Object.entries(draft.race.attributeBonuses).forEach(([attr, bonus]) => {
                final[attr as AttributeName] += (bonus as number);
            });
        }
        draft.humanAttributeBonuses.forEach(attr => final[attr]++);
        draft.lefouAttributeBonuses.forEach(attr => final[attr]++);
        return final;
    }, [draft.attributes, draft.race, draft.humanAttributeBonuses, draft.lefouAttributeBonuses]);

    const pointsInfo = useMemo(() => {
        const attributeValues = Object.values(draft.attributes);
        const spent = attributeValues.reduce((total, val) => val > 0 ? total + (ATTRIBUTE_COSTS[val] || 0) : total, 0);
        const negatives = attributeValues.filter(v => v === -1).length;
        const budget = 10 + negatives;
        return { spent, budget, remaining: budget - spent, negatives };
    }, [draft.attributes]);

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const handleBack = () => setStep(s => Math.max(s - 1, 0));

    const rollDiceAttributes = () => {
        const convertToMod = (roll: number) => {
            if (roll <= 7) return -2;
            if (roll <= 9) return -1;
            if (roll <= 11) return 0;
            if (roll <= 13) return 1;
            if (roll <= 15) return 2;
            if (roll <= 17) return 3;
            return 4;
        };

        let mods: number[] = [];
        let sum = 0;
        while (sum < 6) {
            mods = [];
            for (let i = 0; i < 6; i++) {
                const rolls = [1, 2, 3, 4].map(() => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
                mods.push(convertToMod(rolls[0] + rolls[1] + rolls[2]));
            }
            sum = mods.reduce((a, b) => a + b, 0);
        }
        setDraft(d => ({ ...d, dicePool: mods.sort((a, b) => b - a), attributes: { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 } }));
    };

    const isCompatible = (div: DivinityData) => {
        if (!draft.race || !draft.class) return false;
        if (draft.race.key === 'humano' || draft.class.key === 'clerigo') return true;
        const raceOk = !div.allowedRaces || div.allowedRaces.includes(draft.race.key);
        const classOk = !div.allowedClasses || div.allowedClasses.includes(draft.class.key);
        return raceOk || classOk;
    };

    const handleFinish = () => {
        const con = finalAttributes.con;
        const hp = (draft.class?.initialHP || 0) + con;
        const mp = (draft.class?.initialMP || 0);

        const newSheet: CharacterSheet = {
            ...INITIAL_CHARACTER_SHEET,
            id: Date.now().toString(),
            name: draft.name || 'Herói sem nome',
            race: draft.race?.name || '',
            classAndLevel: `${draft.class?.name || ''} 1${draft.arcanistPath ? ` (${draft.arcanistPath})` : ''}`,
            origin: draft.origin?.name || '',
            divinity: draft.divinity?.name || 'Nenhuma',
            attributes: {
                for: { modifier: finalAttributes.for },
                des: { modifier: finalAttributes.des },
                con: { modifier: finalAttributes.con },
                int: { modifier: finalAttributes.int },
                sab: { modifier: finalAttributes.sab },
                car: { modifier: finalAttributes.car },
            },
            life: { current: hp, max: hp, temp: 0 },
            mana: { current: mp, max: mp, temp: 0 },
            abilitiesAndPowers: {
                race: draft.race?.abilities || [],
                origin: draft.originBenefits.filter(b => typeof b !== 'string') as Ability[],
                class: (draft.class?.levelBenefits || []).map(b => ({ id: Math.random().toString(), name: 'Classe', description: b.description })),
                general: draft.extraPowers.map(p => ({ id: p.id, name: p.name, description: p.description })),
            },
            magic: {
                keyAttribute: draft.arcanistPath === 'feiticeiro' ? 'car' : (Array.isArray(draft.class?.keyAttribute) ? draft.class?.keyAttribute[0] : (draft.class?.keyAttribute || 'int')),
                spells: INITIAL_CHARACTER_SHEET.magic.spells
            }
        };
        onFinish(newSheet);
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 flex flex-col items-center">
            <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                <div className="h-2 bg-slate-200 dark:bg-slate-800">
                    <div className="h-full bg-red-600 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }}></div>
                </div>

                <header className="p-8 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <h1 ref={stepTitleRef} tabIndex={-1} className="text-3xl font-black text-red-600 dark:text-red-500">{steps[step].title}</h1>
                    <p className="text-slate-500">{steps[step].desc}</p>
                </header>

                <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-[65vh]">
                    {step === 0 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-800">
                                    <h3 className="font-bold text-lg text-red-600 mb-4">Método: {draft.attributeMethod === 'points' ? 'Pontos' : 'Rolagens'}</h3>
                                    <div className="flex gap-4 mb-6">
                                        <button onClick={() => setDraft(d => ({...d, attributeMethod: 'points'}))} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${draft.attributeMethod === 'points' ? 'bg-red-600 text-white border-red-600' : 'border-slate-300 dark:border-slate-700'}`}>Pontos</button>
                                        <button onClick={() => { setDraft(d => ({...d, attributeMethod: 'dice'})); rollDiceAttributes(); }} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${draft.attributeMethod === 'dice' ? 'bg-red-600 text-white border-red-600' : 'border-slate-300 dark:border-slate-700'}`}>Rolagens</button>
                                    </div>
                                    <table className="w-full text-xs text-center border-collapse">
                                        <thead><tr className="border-b dark:border-slate-700"><th className="py-2">Mod</th><th className="py-2">Custo</th><th className="py-2">Rolagem</th></tr></thead>
                                        <tbody>
                                            {[-2, -1, 0, 1, 2, 3, 4].map(v => (
                                                <tr key={v} className="hover:bg-slate-200 dark:hover:bg-slate-700/50">
                                                    <td className="py-1 font-bold">{v}</td>
                                                    <td>{v === -1 ? '-1 pt' : v === 0 ? '0 pt' : v === 1 ? '1 pt' : v === 2 ? '2 pt' : v === 3 ? '4 pt' : v === 4 ? '7 pt' : '-'}</td>
                                                    <td className="italic">{v === -2 ? '≤ 7' : v === -1 ? '8-9' : v === 0 ? '10-11' : v === 1 ? '12-13' : v === 2 ? '14-15' : v === 3 ? '16-17' : '18'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-red-600 text-white rounded-2xl shadow-xl flex justify-between items-center">
                                        {draft.attributeMethod === 'points' ? (
                                            <><div><span className="block text-xs uppercase opacity-70">Disponíveis</span><span className="text-4xl font-black">{pointsInfo.remaining}</span></div>
                                            <div className="text-right text-xs opacity-70">Apenas um atributo pode ser -1.</div></>
                                        ) : (
                                            <div className="w-full">
                                                <div className="flex justify-between items-center mb-2"><span className="text-xs uppercase opacity-70">Pool de Dados</span><button onClick={rollDiceAttributes} className="bg-white/20 px-3 py-1 rounded-lg text-xs hover:bg-white/40">Rerrolar</button></div>
                                                <div className="flex gap-2">{draft.dicePool.map((v, i) => <span key={i} className="bg-white/20 px-3 py-1 rounded-lg font-bold">{v}</span>)}</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(Object.keys(ATTRIBUTE_NAMES) as AttributeName[]).map(key => (
                                            <div key={key} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                                                <span className="text-xs uppercase font-bold text-slate-500 mb-2">{ATTRIBUTE_NAMES[key]}</span>
                                                <div className="flex items-center gap-4">
                                                    {draft.attributeMethod === 'points' ? (
                                                        <><button onClick={() => setDraft(d => ({...d, attributes: {...d.attributes, [key]: Math.max(pointsInfo.negatives > 0 && d.attributes[key] === 0 ? 0 : -1, d.attributes[key] - 1)}}))} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700">-</button>
                                                        <span className="text-2xl font-black">{draft.attributes[key]}</span>
                                                        <button onClick={() => setDraft(d => ({...d, attributes: {...d.attributes, [key]: Math.min(4, d.attributes[key] + 1)}}))} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700">+</button></>
                                                    ) : (
                                                        <select value={draft.attributes[key]} onChange={e => setDraft(d => ({...d, attributes: {...d.attributes, [key]: parseInt(e.target.value)}}))} className="w-full bg-transparent text-2xl font-black outline-none text-center">
                                                            <option value="0">0</option>
                                                            {draft.dicePool.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                                        </select>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {RACES.map(r => (
                                    <button key={r.key} onClick={() => setDraft(d => ({...d, race: r, humanAttributeBonuses: [], lefouAttributeBonuses: []}))} className={`p-5 text-left border-4 rounded-2xl transition-all ${draft.race?.key === r.key ? 'border-red-600 bg-red-600/5' : 'border-slate-100 dark:border-slate-800 hover:border-red-400'}`}>
                                        <h3 className="font-bold text-xl">{r.name}</h3>
                                        <p className="text-xs text-slate-500 mt-2">{r.description}</p>
                                    </button>
                                ))}
                            </div>
                            {(draft.race?.key === 'humano' || draft.race?.key === 'lefou') && (
                                <div className="p-8 bg-blue-600/10 rounded-3xl border-2 border-blue-500/30">
                                    <h3 className="text-xl font-bold text-blue-600 mb-4">Bônus de {draft.race.name}: Selecione 3</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(Object.keys(ATTRIBUTE_NAMES) as AttributeName[]).map(attr => {
                                            const isLefou = draft.race?.key === 'lefou';
                                            if (isLefou && attr === 'car') return null;
                                            const list = isLefou ? draft.lefouAttributeBonuses : draft.humanAttributeBonuses;
                                            const active = list.includes(attr);
                                            return (
                                                <button key={attr} onClick={() => setDraft(d => {
                                                    const current = isLefou ? d.lefouAttributeBonuses : d.humanAttributeBonuses;
                                                    const next = active ? current.filter(a => a !== attr) : (current.length < 3 ? [...current, attr] : current);
                                                    return isLefou ? {...d, lefouAttributeBonuses: next} : {...d, humanAttributeBonuses: next};
                                                })} className={`px-4 py-2 rounded-xl font-bold border-2 transition-all ${active ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 dark:border-slate-700 hover:border-blue-400'}`}>{ATTRIBUTE_NAMES[attr]}</button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {CLASSES.map(c => (
                                    <button key={c.key} onClick={() => setDraft(d => ({...d, class: c}))} className={`p-5 text-left border-4 rounded-2xl transition-all ${draft.class?.key === c.key ? 'border-red-600 bg-red-600/5' : 'border-slate-100 dark:border-slate-800 hover:border-red-400'}`}>
                                        <h3 className="font-bold text-xl">{c.name}</h3>
                                        <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">{c.initialHP} PV | {c.initialMP} PM</div>
                                    </button>
                                ))}
                            </div>
                            {draft.class && (
                                <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-2xl font-black text-red-600 mb-4">{draft.class.name}</h3>
                                    <p className="text-sm text-slate-500 mb-6">{draft.class.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div><h4 className="font-bold mb-2">Perícias Iniciais</h4><div className="flex flex-wrap gap-2">{draft.class.fixedSkills.map(s => <span key={s} className="bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold">{SKILL_LIST[s].name}</span>)}<span className="text-xs text-slate-400">+ {draft.class.skillChoices} a sua escolha</span></div></div>
                                        <div><h4 className="font-bold mb-2">Habilidades de 1º Nível</h4><ul className="text-xs space-y-1 text-slate-500">{draft.class.levelBenefits.map((b, i) => <li key={i}>• {b.description}</li>)}</ul></div>
                                    </div>
                                    {draft.class.key === 'arcanista' && (
                                        <div className="mt-8 border-t dark:border-slate-700 pt-6">
                                            <h4 className="font-bold mb-4 text-blue-500">Caminho do Arcanista</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {['mago', 'bruxo', 'feiticeiro'].map(p => (
                                                    <button key={p} onClick={() => setDraft(d => ({...d, arcanistPath: p as any}))} className={`p-4 text-left border-2 rounded-xl transition-all ${draft.arcanistPath === p ? 'border-blue-600 bg-blue-600/10' : 'border-slate-200 dark:border-slate-700'}`}>
                                                        <div className="font-bold capitalize">{p}</div>
                                                        <div className="text-[10px] text-slate-500">{p === 'mago' ? 'Atributo Int. Recebe uma magia extra.' : p === 'bruxo' ? 'Atributo Int. Usa um item de foco.' : 'Atributo Car. Magia vem do sangue.'}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {DIVINITIES.map(div => {
                                    const ok = isCompatible(div);
                                    return (
                                        <button key={div.key} onClick={() => ok && setDraft(d => ({...d, divinity: div}))} className={`p-5 text-left border-4 rounded-2xl transition-all ${draft.divinity?.key === div.key ? 'border-red-600 bg-red-600/5' : ok ? 'border-slate-100 dark:border-slate-800 hover:border-red-400' : 'opacity-30 grayscale cursor-not-allowed border-slate-200'}`}>
                                            <div className="font-black text-xl">{div.name}</div>
                                            <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">{div.symbol}</div>
                                            {!ok && <div className="text-[9px] text-red-500 font-bold mt-2">RAÇA OU CLASSE NÃO PERMITIDA</div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                                <h3 className="text-3xl font-black mb-8 text-center uppercase tracking-widest text-red-600">Ficha de Resumo</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b dark:border-slate-700 pb-2"><span>Raça/Classe</span><span className="font-bold">{draft.race?.name} / {draft.class?.name}</span></div>
                                    <div className="flex justify-between border-b dark:border-slate-700 pb-2"><span>PV/PM</span><span className="font-bold">{ (draft.class?.initialHP || 0) + finalAttributes.con} / {draft.class?.initialMP}</span></div>
                                    <div className="flex justify-between border-b dark:border-slate-700 pb-2"><span>Divindade</span><span className="font-bold">{draft.divinity?.name || 'Ateu'}</span></div>
                                    <div className="pt-4 grid grid-cols-6 gap-2 text-center">
                                        {Object.keys(ATTRIBUTE_NAMES).map(k => (
                                            <div key={k} className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700"><div className="text-[10px] font-bold text-slate-400 uppercase">{k}</div><div className="text-lg font-black">{finalAttributes[k as AttributeName]}</div></div>
                                        ))}
                                    </div>
                                    <div className="pt-8">
                                        <input placeholder="Nome do Personagem" value={draft.name} onChange={e => setDraft(d => ({...d, name: e.target.value}))} className="w-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 p-4 rounded-xl text-xl font-bold outline-none focus:border-red-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="p-8 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                    <button onClick={onCancel} className="text-slate-400 font-bold hover:text-red-600 transition-colors uppercase text-xs tracking-widest">Cancelar</button>
                    <div className="flex gap-4">
                        {step > 0 && <button onClick={handleBack} className="px-8 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 font-bold hover:bg-slate-300 transition-all uppercase text-xs">Voltar</button>}
                        {step < steps.length - 1 ? (
                            <button onClick={handleNext} disabled={(step === 0 && pointsInfo.remaining !== 0 && draft.attributeMethod === 'points')} className="px-12 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 uppercase text-xs">Próximo</button>
                        ) : (
                            <button onClick={handleFinish} className="px-12 py-3 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-xl shadow-green-600/30 uppercase text-xs">Concluir</button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CharacterCreationWizard;
