
import { RaceData, OriginData, ClassData, DivinityData, Ability, ItemData, GeneralPowerData } from '../types';

export const RACES: RaceData[] = [
  {
    key: 'humano',
    name: 'Humano',
    description: 'Versáteis e ambiciosos, os humanos são a raça mais numerosa de Arton.',
    attributeBonuses: {},
    abilities: [{ id: 'hum_versatil', name: 'Versátil', description: '+2 perícias ou 1 perícia e 1 poder geral.' }]
  },
  {
    key: 'anao',
    name: 'Anão',
    description: 'Resilientes e tradicionais, criados por Khalmyr e Tenebra.',
    attributeBonuses: { con: 2, sab: 1, des: -1 },
    abilities: [{ id: 'ana_duro', name: 'Duro como Pedra', description: '+3 PV no 1º nível e +1 por nível.' }]
  },
  {
    key: 'dahllan',
    name: 'Dahllan',
    description: 'Meio-dríades com ligação profunda com a natureza.',
    attributeBonuses: { sab: 2, des: 1, int: -1 },
    abilities: [{ id: 'dah_armadura', name: 'Armadura de Casca', description: '+2 na Defesa.' }]
  },
  {
    key: 'elfo',
    name: 'Elfo',
    description: 'Graciosos e mágicos, sobreviventes da queda de Lenórienn.',
    attributeBonuses: { int: 2, des: 1, con: -1 },
    abilities: [{ id: 'elf_sangue', name: 'Sangue Mágico', description: '+1 PM por nível.' }]
  },
  {
    key: 'goblin',
    name: 'Goblin',
    description: 'Engenhosos e adaptáveis, comuns em favelas urbanas ou tribos.',
    attributeBonuses: { des: 2, int: 1, car: -1 },
    abilities: [{ id: 'gob_rato', name: 'Rato de Esgoto', description: '+2 em Fortitude e imune a doenças.' }]
  },
  {
    key: 'lefou',
    name: 'Lefou',
    description: 'Crias da Tormenta, deformados mas poderosos.',
    attributeBonuses: { car: -1 },
    abilities: [{ id: 'lef_deformidade', name: 'Deformidade', description: '+2 em duas perícias ou um poder da Tormenta.' }]
  },
  {
    key: 'minotauro',
    name: 'Minotauro',
    description: 'Fortes e territoriais, vindos do império de Tapista.',
    attributeBonuses: { for: 2, con: 1, sab: -1 },
    abilities: [{ id: 'min_chifres', name: 'Chifres', description: 'Arma natural (1d6).' }]
  },
  {
    key: 'qareen',
    name: 'Qareen',
    description: 'Descendentes de gênios, conhecidos por sua generosidade.',
    attributeBonuses: { car: 2, int: 1, sab: -1 },
    abilities: [{ id: 'qar_desejos', name: 'Desejos', description: '-1 PM em magias pedidas por outros.' }]
  }
];

export const CLASSES: ClassData[] = [
  {
    key: 'arcanista',
    name: 'Arcanista',
    description: 'Mestres da magia arcana, seja por estudo, herança ou pacto.',
    keyAttribute: ['int', 'car'],
    initialHP: 8, hpPerLevel: 2, initialMP: 6, mpPerLevel: 6,
    fixedSkills: ['misticismo', 'vontade'],
    skillChoices: 2,
    proficiencies: ['Armas Simples'],
    levelBenefits: [{ level: 1, description: 'Caminho do Arcanista, Magias (3 de 1º círculo).' }],
    spellcasterType: 'arcane'
  },
  {
    key: 'barbaro',
    name: 'Bárbaro',
    description: 'Guerreiros selvagens que canalizam fúria bruta.',
    keyAttribute: 'for',
    initialHP: 24, hpPerLevel: 6, initialMP: 3, mpPerLevel: 3,
    fixedSkills: ['fortitude', 'luta'],
    skillChoices: 4,
    proficiencies: ['Armas Marciais', 'Escudos'],
    levelBenefits: [{ level: 1, description: 'Fúria (+2 ataque e dano, RD 2).' }],
    spellcasterType: 'none'
  },
  {
    key: 'bardo',
    name: 'Bardo',
    description: 'Artistas versáteis que misturam música e magia.',
    keyAttribute: 'car',
    initialHP: 12, hpPerLevel: 3, initialMP: 4, mpPerLevel: 4,
    fixedSkills: ['atuacao', 'reflexos'],
    skillChoices: 6,
    proficiencies: ['Armas Marciais (uma)', 'Armaduras Leves'],
    levelBenefits: [{ level: 1, description: 'Inspiração, Magias.' }],
    spellcasterType: 'arcane'
  },
  {
    key: 'clerigo',
    name: 'Clérigo',
    description: 'Canais vivos do poder dos deuses.',
    keyAttribute: 'sab',
    initialHP: 16, hpPerLevel: 4, initialMP: 5, mpPerLevel: 5,
    fixedSkills: ['religiao', 'vontade'],
    skillChoices: 2,
    proficiencies: ['Armaduras Pesadas', 'Escudos'],
    levelBenefits: [{ level: 1, description: 'Devoto Fiel, Canalizar Energia, Magias.' }],
    spellcasterType: 'divine'
  },
  {
    key: 'guerreiro',
    name: 'Guerreiro',
    description: 'O mestre do combate técnico e das armas.',
    keyAttribute: ['for', 'des'],
    initialHP: 20, hpPerLevel: 5, initialMP: 3, mpPerLevel: 3,
    fixedSkills: ['fortitude', 'luta'],
    skillChoices: 2,
    proficiencies: ['Armas Marciais', 'Armaduras Pesadas', 'Escudos'],
    levelBenefits: [{ level: 1, description: 'Ataque Especial (+4 no ataque ou dano).' }],
    spellcasterType: 'none'
  },
  {
    key: 'ladino',
    name: 'Ladino',
    description: 'Especialistas em furtividade, perícias e ataques precisos.',
    keyAttribute: 'des',
    initialHP: 12, hpPerLevel: 3, initialMP: 4, mpPerLevel: 4,
    fixedSkills: ['ladinagem', 'reflexos'],
    skillChoices: 8,
    proficiencies: ['Armas Marciais (uma)', 'Armaduras Leves'],
    levelBenefits: [{ level: 1, description: 'Ataque Furtivo (+1d6), Especialista.' }],
    spellcasterType: 'none'
  },
  {
    key: 'paladino',
    name: 'Paladino',
    description: 'Campeões sagrados da justiça e da ordem.',
    keyAttribute: ['for', 'car'],
    initialHP: 20, hpPerLevel: 5, initialMP: 3, mpPerLevel: 3,
    fixedSkills: ['luta', 'vontade'],
    skillChoices: 2,
    proficiencies: ['Armas Marciais', 'Armaduras Pesadas', 'Escudos'],
    levelBenefits: [{ level: 1, description: 'Abençoado, Golpe Divino, Código do Herói.' }],
    spellcasterType: 'none'
  }
];

export const DIVINITIES: DivinityData[] = [
  { 
    key: 'aharakak', 
    name: 'Aharadak', 
    symbol: 'Olho com Espinhos', 
    beliefs: ['Reverenciar a Tormenta', 'Deturpar o normal'], 
    powers: [
      { id: 'ah_afinidade', name: 'Afinidade com a Tormenta', description: 'Você não sofre penalidades por estar em áreas da Tormenta.' },
      { id: 'ah_extase', name: 'Êxtase da Loucura', description: 'Ganha PM ao causar dano crítico.' }
    ],
    description: 'O Deus da Tormenta. Uma divindade alienígena que busca corromper Arton.' 
  },
  { 
    key: 'allihanna', 
    name: 'Allihanna', 
    symbol: 'Árvore ou Animal', 
    beliefs: ['Proteger a vida selvagem', 'Viver em harmonia'], 
    allowedClasses: ['barbaro', 'cacador', 'druida'],
    allowedRaces: ['dahllan', 'elfo', 'silfide'],
    powers: [
      { id: 'al_voz', name: 'Voz da Natureza', description: 'Você pode falar com animais e plantas.' },
      { id: 'al_dedo', name: 'Dedo Verde', description: 'Pode lançar Controlar Plantas.' }
    ],
    description: 'A Deusa da Natureza. Representa a pureza dos animais e plantas.' 
  },
  { 
    key: 'arsenal', 
    name: 'Arsenal', 
    symbol: 'Martelo e Espada', 
    beliefs: ['Vencer a qualquer custo', 'Jamais se render'], 
    allowedClasses: ['barbaro', 'cavaleiro', 'guerreiro', 'lutador'],
    powers: [{ id: 'ars_sangue', name: 'Sangue de Ferro', description: '+2 na Defesa e RD 2.' }],
    description: 'O Deus da Guerra. O ex-vilão que derrotou Keenn.' 
  },
  { 
    key: 'khalmyr', 
    name: 'Khalmyr', 
    symbol: 'Espada e Balança', 
    beliefs: ['Defender a lei', 'Combater o mal'], 
    allowedClasses: ['cavaleiro', 'guerreiro', 'nobre', 'paladino'],
    powers: [{ id: 'kha_coragem', name: 'Coragem Total', description: 'Imune a medo.' }],
    description: 'O Deus da Justiça. Antigo líder do Panteão.' 
  },
  { 
    key: 'valkaria', 
    name: 'Valkaria', 
    symbol: 'Estátua ou Seis Faixas', 
    beliefs: ['Almejar o impossível', 'Combater a tirania'], 
    powers: [{ id: 'val_liberdade', name: 'Liberdade Divina', description: 'Imune a efeitos de paralisia.' }],
    description: 'A Deusa da Ambição e dos Humanos. Líder atual do Panteão.' 
  },
  { 
    key: 'wynna', 
    name: 'Wynna', 
    symbol: 'Anel Metálico', 
    beliefs: ['Magia para todos', 'Praticar generosidade'], 
    allowedClasses: ['arcanista', 'bardo'],
    powers: [{ id: 'wyn_bencao', name: 'Bênção do Mana', description: '+1 PM por nível par.' }],
    description: 'A Deusa da Magia. Concede poder arcano a todos que pedem.' 
  }
];

export const ORIGINS: OriginData[] = [
  {
    key: 'acolito',
    name: 'Acólito',
    description: 'Você viveu em um templo, servindo aos deuses e aprendendo orações.',
    benefits: ['cura', 'religiao', 'vontade', 
      { id: 'medicina', name: 'Medicina', description: 'Você pode usar Sabedoria para Cura.' },
      { id: 'vontade_ferro', name: 'Vontade de Ferro', description: '+1 PM por nível e +2 em Vontade.' }
    ]
  },
  {
    key: 'aristocrata',
    name: 'Aristocrata',
    description: 'Você nasceu em berço de ouro, entre nobres e intrigas palacianas.',
    benefits: ['diplomacia', 'nobreza', 
      { id: 'riqueza', name: 'Riqueza', description: 'Começa com +T$ 100.' }
    ]
  },
  {
    key: 'soldado',
    name: 'Soldado',
    description: 'Você foi treinado em um exército, milícia ou guarda urbana.',
    benefits: ['fortitude', 'guerra', 'luta', 'pontaria', 
      { id: 'influencia_militar', name: 'Influência Militar', description: 'Hospedagem e ajuda em quartéis.' }
    ]
  }
];
