export type AttributeName = 'for' | 'des' | 'con' | 'int' | 'sab' | 'car';

export interface Attribute {
  modifier: number;
}

export interface Vital {
  current: number;
  max: number;
  temp: number;
}

export interface Skill {
  name: string;
  attribute: AttributeName;
  isTrained: boolean;
  others: number;
  isTrainedOnly: boolean;
  applyArmorPenalty: boolean;
  showInSummary?: boolean;
  isCustom?: boolean;
}

export type Skills = Record<string, Skill>;

export interface Attributes {
  for: Attribute;
  des: Attribute;
  con: Attribute;
  int: Attribute;
  sab: Attribute;
  car: Attribute;
}

export type AttackSkill = 'luta' | 'pontaria';

export interface Attack {
  id: string;
  name: string;
  skillUsed: AttackSkill;
  others: number;
  damageDice: string;
  damageAttribute: AttributeName | 'none';
  critRange: number;
  critMultiplier: number;
  damageType: string;
  range: string;
}

export interface CalculatedAttack extends Attack {
    testBonus: number;
    damageRoll: string;
}

export interface ArmorOrShield {
    name: string;
    defense: number;
    penalty: number;
    maxDexBonus?: number;
}

export interface Spell {
  id: string;
  name: string;
  school: string;
  execution: string;
  range: string;
  area: string;
  duration: string;
  resistance: string;
  effect: string;
}

export interface Item {
  id: string;
  name: string;
  slots: number;
  equipped: boolean;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
}

export interface SkillBreakdown {
  halfLevel: number;
  attribute: number;
  training: number;
  others: number;
  armorPenalty: number;
}

export interface CalculatedSkill extends Skill {
    total: number;
    breakdown: SkillBreakdown;
    isUsable: boolean;
}

export type CalculatedSkills = Record<string, CalculatedSkill>;

export type EffectTarget = string;

export interface Effect {
  id: string;
  name: string;
  value: number;
  target: EffectTarget;
  source?: string;
}

export interface Condition {
    key: string;
    name: string;
    description: string;
    effects: Omit<Effect, 'id' | 'source'>[];
}

export interface DiceRoll {
  isOpen: boolean;
  title: string;
  diceString: string;
  rolls: number[];
  modifier: number;
  total: number;
}

export interface Proficiencies {
  marciais: boolean;
  fogo: boolean;
  pesadas: boolean;
  escudos: boolean;
  exoticas: boolean;
  custom: string;
}

export interface CharacterSheet {
  id: string;
  name: string;
  distinction: string;
  race: string;
  origin: string;
  classAndLevel: string;
  divinity: string;
  level: number;
  attributes: Attributes;
  life: Vital;
  mana: Vital;
  moneyTS: number;
  moneyTO: number;
  characterImage: string | null;
  attacks: Attack[];
  defense: {
    others: number;
    armor: ArmorOrShield;
    shield: ArmorOrShield;
  };
  proficiencies: Proficiencies;
  skills: Skills;
  magic: {
    keyAttribute: AttributeName;
    spells: {
      circle1: Spell[];
      circle2: Spell[];
      circle3: Spell[];
      circle4: Spell[];
      circle5: Spell[];
    };
  };
  inventory: Item[];
  abilitiesAndPowers: {
    race: Ability[];
    origin: Ability[];
    class: Ability[];
    general: Ability[];
  };
  notes: string;
  personality?: string;
  appearance?: string;
}

export type UITheme = 'light' | 'dark';

export interface AppState {
  characters: Record<string, CharacterSheet>;
  activeCharacterId: string | null;
  theme: UITheme;
}

// Data for Character Creation Wizard
export interface RaceData {
  key: string;
  name: string;
  description: string;
  attributeBonuses: Partial<Record<AttributeName, number>>;
  abilities: Ability[];
}

export interface OriginData {
  key: string;
  name: string;
  description: string;
  benefits: (string | Ability)[]; // Can be a skill name (string) or a power (Ability)
}

export interface ClassLevelBenefit {
  level: number;
  description: string;
}

export interface ClassData {
  key: string;
  name: string;
  description: string;
  keyAttribute: AttributeName | AttributeName[];
  initialHP: number;
  hpPerLevel: number;
  initialMP: number;
  mpPerLevel: number;
  fixedSkills: string[];
  skillChoices: number;
  proficiencies: string[];
  levelBenefits: ClassLevelBenefit[];
  spellcasterType: 'arcane' | 'divine' | 'none';
}

export interface DivinityData {
  key: string;
  name: string;
  description: string;
  symbol: string;
  beliefs: string[];
  allowedRaces?: string[]; 
  allowedClasses?: string[];
  powers: Ability[];
}

export interface GeneralPowerData {
  id: string;
  name: string;
  description: string;
  category: 'Combate' | 'Destino' | 'Magia' | 'Concedidos' | 'Tormenta';
  prerequisites?: string;
}

export interface ItemData {
    key: string;
    name: string;
}

export interface SpellData {
    key: string;
    name: string;
    description: string;
}