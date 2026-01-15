import React, { useEffect } from 'react';
import { type DiceRoll } from '../types';

interface DiceRollerProps extends DiceRoll {
  onClose: () => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ isOpen, title, diceString, rolls, modifier, total, onClose }) => {
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    if (!isOpen) return null;

    const isError = rolls.length === 0 && modifier === 0 && total === 0;

  return (
    <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dice-roller-title"
    >
      <div 
        className="bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg shadow-2xl p-6 w-full max-w-sm text-center transform transition-all animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="dice-roller-title" className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">({diceString})</p>

        {isError ? (
            <div className="text-red-500 my-4">
                <p className="font-bold">Fórmula inválida!</p>
                <p className="text-xs">Exemplos: 1d20+5, 2d6, 1d8-2</p>
            </div>
        ) : (
            <>
                <div className="my-5">
                    <p className="text-6xl font-bold text-slate-900 dark:text-white">{total}</p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md text-sm">
                    <span className="text-slate-700 dark:text-slate-300">
                        {rolls.join(' + ')}
                    </span>
                    <span className={`ml-2 ${modifier > 0 ? 'text-green-500' : modifier < 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                        {modifier > 0 ? `+ ${modifier}` : modifier < 0 ? `- ${Math.abs(modifier)}` : ''}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300"> = {rolls.reduce((a, b) => a + b, 0) + modifier}</span>
                </div>
            </>
        )}


        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
        >
          Fechar
        </button>
      </div>

      <style>{`
        @keyframes scale-in {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DiceRoller;