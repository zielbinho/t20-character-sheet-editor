import React, { useEffect } from 'react';
import { type DiceRoll } from '../types';

interface RollHistoryProps {
  history: DiceRoll[];
  onClose: () => void;
}

const RollHistory: React.FC<RollHistoryProps> = ({ history, onClose }) => {

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

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-40 transition-opacity animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="roll-history-title"
        >
            <div 
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-slate-200 dark:bg-slate-800 border-l-2 border-slate-300 dark:border-slate-700 shadow-2xl flex flex-col transform transition-transform animate-slide-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b border-slate-300 dark:border-slate-700">
                    <h2 id="roll-history-title" className="text-xl font-bold text-red-600 dark:text-red-400">
                        <i className="fas fa-history mr-2"></i>
                        Histórico de Rolagens
                    </h2>
                    <button onClick={onClose} className="text-2xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">&times;</button>
                </header>
                
                <div className="flex-1 overflow-y-auto p-4">
                    {history.length > 0 ? (
                        <ul className="space-y-3">
                            {history.map((roll, index) => (
                                <li key={index} className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-3 rounded-lg flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-white">{roll.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{roll.diceString}</p>
                                    </div>
                                    <div className="text-3xl font-bold text-red-600 dark:text-red-400 border-l-2 border-slate-300 dark:border-slate-600 pl-3">
                                        {roll.total}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-500 italic">Nenhuma rolagem no histórico.</p>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default RollHistory;