export const getTrainingBonus = (level: number): number => {
    if (level >= 1 && level <= 6) {
        return 2;
    }
    if (level >= 7 && level <= 14) {
        return 4;
    }
    if (level >= 15) {
        return 6;
    }
    return 0; // Default case for level 0 or less
};

export interface RollResult {
  rolls: number[];
  modifier: number;
  total: number;
}

export const rollDice = (diceString: string): RollResult | null => {
  if (!diceString) {
    diceString = '1d20';
  }

  diceString = diceString.replace(/\s+/g, '').toLowerCase();
  
  const diceRegex = /^(\d*)d(\d+)([+-]\d+)?$/;
  const modifierRegex = /^[+-]?\d+$/;

  let rolls: number[] = [];
  let modifier = 0;
  let total = 0;

  if (diceRegex.test(diceString)) {
    const match = diceString.match(diceRegex);
    if (!match) return null;

    const numDice = match[1] ? parseInt(match[1], 10) : 1;
    const numSides = parseInt(match[2], 10);
    modifier = match[3] ? parseInt(match[3], 10) : 0;
    
    if (numSides <= 0) return null;

    for (let i = 0; i < numDice; i++) {
      rolls.push(Math.floor(Math.random() * numSides) + 1);
    }

    total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;

  } else if (modifierRegex.test(diceString)) {
    modifier = parseInt(diceString, 10);
    total = modifier;
  } else {
    return null;
  }

  return { rolls, modifier, total };
};