// FIX: Import `Condition` type
import { type CharacterSheet, type Skills, type Condition } from './types';

export const SKILL_LIST: Record<string, { name: string; attribute: 'for' | 'des' | 'con' | 'int' | 'sab' | 'car'; isTrainedOnly: boolean; applyArmorPenalty: boolean }> = {
    acrobacia: { name: 'Acrobacia', attribute: 'des', isTrainedOnly: false, applyArmorPenalty: true },
    adestramento: { name: 'Adestramento', attribute: 'car', isTrainedOnly: true, applyArmorPenalty: false },
    atletismo: { name: 'Atletismo', attribute: 'for', isTrainedOnly: false, applyArmorPenalty: false },
    atuacao: { name: 'Atuação', attribute: 'car', isTrainedOnly: true, applyArmorPenalty: false },
    cavalgar: { name: 'Cavalgar', attribute: 'des', isTrainedOnly: false, applyArmorPenalty: false },
    conhecimento: { name: 'Conhecimento', attribute: 'int', isTrainedOnly: true, applyArmorPenalty: false },
    cura: { name: 'Cura', attribute: 'sab', isTrainedOnly: false, applyArmorPenalty: false },
    diplomacia: { name: 'Diplomacia', attribute: 'car', isTrainedOnly: false, applyArmorPenalty: false },
    enganacao: { name: 'Enganação', attribute: 'car', isTrainedOnly: false, applyArmorPenalty: false },
    fortitude: { name: 'Fortitude', attribute: 'con', isTrainedOnly: false, applyArmorPenalty: false },
    furtividade: { name: 'Furtividade', attribute: 'des', isTrainedOnly: false, applyArmorPenalty: true },
    guerra: { name: 'Guerra', attribute: 'int', isTrainedOnly: true, applyArmorPenalty: false },
    iniciativa: { name: 'Iniciativa', attribute: 'des', isTrainedOnly: false, applyArmorPenalty: false },
    intimidacao: { name: 'Intimidação', attribute: 'car', isTrainedOnly: false, applyArmorPenalty: false },
    intuicao: { name: 'Intuição', attribute: 'sab', isTrainedOnly: false, applyArmorPenalty: false },
    investigacao: { name: 'Investigação', attribute: 'int', isTrainedOnly: false, applyArmorPenalty: false },
    jogatina: { name: 'Jogatina', attribute: 'car', isTrainedOnly: true, applyArmorPenalty: false },
    ladinagem: { name: 'Ladinagem', attribute: 'des', isTrainedOnly: true, applyArmorPenalty: true },
    luta: { name: 'Luta', attribute: 'for', isTrainedOnly: false, applyArmorPenalty: false },
    misticismo: { name: 'Misticismo', attribute: 'int', isTrainedOnly: true, applyArmorPenalty: false },
    nobreza: { name: 'Nobreza', attribute: 'int', isTrainedOnly: true, applyArmorPenalty: false },
    percepcao: { name: 'Percepção', attribute: 'sab', isTrainedOnly: false, applyArmorPenalty: false },
    pilotagem: { name: 'Pilotagem', attribute: 'des', isTrainedOnly: true, applyArmorPenalty: false },
    pontaria: { name: 'Pontaria', attribute: 'des', isTrainedOnly: false, applyArmorPenalty: false },
    reflexos: { name: 'Reflexos', attribute: 'des', isTrainedOnly: false, applyArmorPenalty: false },
    religiao: { name: 'Religião', attribute: 'sab', isTrainedOnly: true, applyArmorPenalty: false },
    sobrevivencia: { name: 'Sobrevivência', attribute: 'sab', isTrainedOnly: false, applyArmorPenalty: false },
    vontade: { name: 'Vontade', attribute: 'sab', isTrainedOnly: false, applyArmorPenalty: false },
};

export const IMPORTANT_SKILLS = ['iniciativa', 'fortitude', 'reflexos', 'vontade', 'percepcao', 'luta', 'pontaria', 'atletismo', 'acrobacia', 'furtividade'];

const initialSkills: Skills = Object.keys(SKILL_LIST).reduce((acc, key) => {
    const skillInfo = SKILL_LIST[key];
    acc[key] = {
        name: skillInfo.name,
        attribute: skillInfo.attribute,
        isTrained: false,
        others: 0,
        isTrainedOnly: skillInfo.isTrainedOnly,
        applyArmorPenalty: skillInfo.applyArmorPenalty,
        showInSummary: IMPORTANT_SKILLS.includes(key),
    };
    return acc;
}, {} as Skills);

export const INITIAL_CHARACTER_SHEET: Omit<CharacterSheet, 'id'> = {
  name: 'Novo Personagem',
  distinction: '',
  race: '',
  origin: '',
  classAndLevel: '',
  divinity: '',
  level: 1,
  attributes: {
    for: { modifier: 0 },
    des: { modifier: 0 },
    con: { modifier: 0 },
    int: { modifier: 0 },
    sab: { modifier: 0 },
    car: { modifier: 0 },
  },
  life: { current: 10, max: 10, temp: 0 },
  mana: { current: 10, max: 10, temp: 0 },
  moneyTS: 0,
  moneyTO: 0,
  characterImage: null,
  attacks: [],
  defense: {
    others: 0,
    armor: { name: '', defense: 0, penalty: 0 },
    shield: { name: '', defense: 0, penalty: 0 },
  },
  proficiencies: {
    marciais: false,
    fogo: false,
    pesadas: false,
    escudos: false,
    exoticas: false,
    custom: '',
  },
  skills: initialSkills,
  magic: {
    keyAttribute: 'int',
    spells: {
      circle1: [],
      circle2: [],
      circle3: [],
      circle4: [],
      circle5: [],
    }
  },
  inventory: [],
  abilitiesAndPowers: {
    race: [],
    origin: [],
    class: [],
    general: [],
  },
  notes: '',
};

// FIX: Define and export the CONDITIONS constant
export const CONDITIONS: Condition[] = [
    { 
        key: 'abalado', 
        name: 'Abalado', 
        description: 'Penalidade de –2 em testes de perícia.', 
        effects: [{ name: 'Abalado', value: -2, target: 'all_skills' }] 
    },
    { 
        key: 'apavorado', 
        name: 'Apavorado', 
        description: 'Penalidade de –5 em testes de perícia.', 
        effects: [{ name: 'Apavorado', value: -5, target: 'all_skills' }] 
    },
    { 
        key: 'atordoado', 
        name: 'Atordoado', 
        description: 'Não pode fazer ações e sofre –2 na Defesa.', 
        effects: [{ name: 'Atordoado', value: -2, target: 'defense' }] 
    },
    { 
        key: 'ofuscado', 
        name: 'Ofuscado', 
        description: '–2 em ataques e Percepção baseada em visão.', 
        effects: [
            { name: 'Ofuscado', value: -2, target: 'attack' },
            { name: 'Ofuscado', value: -2, target: 'percepcao' }
        ] 
    },
    { 
        key: 'enredado', 
        name: 'Enredado', 
        description: 'Não pode se mover. –2 em ataques e –5 em testes de Destreza.', 
        effects: [
            { name: 'Enredado', value: -2, target: 'attack' },
            { name: 'Enredado', value: -5, target: 'acrobacia' },
            { name: 'Enredado', value: -5, target: 'cavalgar' },
            { name: 'Enredado', value: -5, target: 'furtividade' },
            { name: 'Enredado', value: -5, target: 'ladinagem' },
            { name: 'Enredado', value: -5, target: 'pilotagem' },
            { name: 'Enredado', value: -5, target: 'pontaria' },
            { name: 'Enredado', value: -5, target: 'reflexos' },
        ]
    },
    { 
        key: 'fatigado', 
        name: 'Fatigado', 
        description: '–2 em testes de Força e Destreza.', 
        effects: [
            { name: 'Fatigado', value: -2, target: 'atletismo' },
            { name: 'Fatigado', value: -2, target: 'luta' },
            { name: 'Fatigado', value: -2, target: 'acrobacia' },
            { name: 'Fatigado', value: -2, target: 'cavalgar' },
            { name: 'Fatigado', value: -2, target: 'furtividade' },
            { name: 'Fatigado', value: -2, target: 'iniciativa' },
            { name: 'Fatigado', value: -2, target: 'ladinagem' },
            { name: 'Fatigado', value: -2, target: 'pilotagem' },
            { name: 'Fatigado', value: -2, target: 'pontaria' },
            { name: 'Fatigado', value: -2, target: 'reflexos' },
        ]
    },
    { 
        key: 'surdo', 
        name: 'Surdo', 
        description: '–5 em testes de Iniciativa.', 
        effects: [{ name: 'Surdo', value: -5, target: 'iniciativa' }] 
    },
];

export const DAMAGE_TYPES = [
    'Ácido', 'Corte', 'Eletricidade', 'Essência', 'Fogo', 'Frio',
    'Impacto', 'Luz', 'Perfuração', 'Psíquico', 'Trevas'
];