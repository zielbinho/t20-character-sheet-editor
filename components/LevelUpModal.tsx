import React from 'react';
import { CharacterSheet } from '../types';

interface LevelUpModalProps {
  onClose: () => void;
  onConfirm: () => void;
  character: CharacterSheet;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ onClose, onConfirm, character }) => {
  const newLevel = character.level + 1;

  const checklistItems = [
    "Aumentar PV e PM de acordo com sua classe.",
    `Distribuir ${Math.floor(newLevel / 2) + character.attributes.int.modifier} pontos em perícias.`,
    "Verificar se o bônus de treinamento aumentou.",
    "Anotar um novo poder de classe ou geral.",
    "Verificar se a CD de suas magias aumentou.",
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
    >
      <div
        className="bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-lg shadow-2xl p-6 w-full max-w-lg transform transition-all animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-4">
          <h2 id="levelup-title" className="text-2xl font-bold text-green-600 dark:text-green-400">
            <i className="fas fa-arrow-up mr-2"></i>
            Subindo para o Nível {newLevel}!
          </h2>
          <button onClick={onClose} className="text-2xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">&times;</button>
        </header>

        <p className="text-slate-600 dark:text-slate-300 mb-6">Parabéns pela evolução! Não se esqueça de atualizar sua ficha. Aqui está um checklist para ajudar:</p>

        <ul className="space-y-3 mb-8">
          {checklistItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3 p-2 bg-slate-100 dark:bg-slate-900/50 rounded-md">
              <i className="fas fa-check-circle text-green-500 mt-1"></i>
              <span className="text-slate-700 dark:text-slate-200">{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-slate-400 hover:bg-slate-500 text-slate-900 font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Confirmar Nível {newLevel}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LevelUpModal;
