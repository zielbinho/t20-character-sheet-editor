import React from 'react';
import { type Item } from '../types';
import Section from './Section';

interface InventoryProps {
  inventory: Item[];
  moneyTS: number;
  moneyTO: number;
  onUpdate: (field: string, value: any) => void;
  encumbrance: {
    totalLoad: number;
    capacity: number;
    maxCapacity: number;
    isOverencumbered: boolean;
    isOverloaded: boolean;
  };
}

const Inventory: React.FC<InventoryProps> = ({ inventory, moneyTS, moneyTO, onUpdate, encumbrance }) => {
  const handleItemChange = (id: string, field: keyof Item, value: string | number | boolean) => {
    const newInventory = inventory.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdate('inventory', newInventory);
  };

  const addItem = () => {
    const newItem: Item = { id: Date.now().toString(), name: '', slots: 1, equipped: false };
    onUpdate('inventory', [...inventory, newItem]);
  };

  const removeItem = (id: string) => {
    onUpdate('inventory', inventory.filter(item => item.id !== id));
  };

  const { totalLoad, capacity, maxCapacity, isOverencumbered, isOverloaded } = encumbrance;

  const itemSlots = inventory.reduce((sum, item) => sum + Number(item.slots || 0), 0);
  const totalCoins = moneyTS + moneyTO;
  const coinSlots = Math.floor(totalCoins / 1000);
  
  const progressBarWidth = maxCapacity > 0 ? Math.min((totalLoad / maxCapacity) * 100, 100) : 0;
  const progressBarColor = isOverloaded ? 'bg-red-600' : isOverencumbered ? 'bg-yellow-500' : 'bg-blue-600';

  return (
    <Section title="Inventário & Carga">
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 px-2">
            <div className="col-span-7">Item</div>
            <div className="col-span-2 text-center">Espaços</div>
            <div className="col-span-2 text-center">Equip.</div>
            <div className="col-span-1"></div>
        </div>
        
        <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
            {inventory.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-100 dark:bg-slate-900 p-2 rounded-lg border border-slate-300 dark:border-slate-700">
                    <div className="col-span-7">
                        <input
                            type="text"
                            value={item.name}
                            placeholder="Nome do item"
                            onChange={e => handleItemChange(item.id, 'name', e.target.value)}
                            className="w-full bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 text-sm"
                        />
                    </div>
                    <div className="col-span-2">
                         <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={item.slots}
                            onChange={e => handleItemChange(item.id, 'slots', parseFloat(e.target.value) || 0)}
                            className="w-full text-center bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 text-sm"
                        />
                    </div>
                    <div className="col-span-2 flex justify-center">
                        <input
                            type="checkbox"
                            checked={item.equipped}
                            onChange={e => handleItemChange(item.id, 'equipped', e.target.checked)}
                            className="form-checkbox h-5 w-5 text-red-600 bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-600 rounded focus:ring-red-500"
                        />
                    </div>
                    <div className="col-span-1 text-right">
                         <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-400">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      <button onClick={addItem} className="mt-4 text-sm bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 transition-colors w-full">
        + Adicionar Item
      </button>

      <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 space-y-2">
        <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="flex flex-col">
                <label className="text-sm text-slate-500 dark:text-slate-400 mb-1">T$ (Prata)</label>
                <input
                    type="number"
                    value={moneyTS}
                    onChange={(e) => onUpdate('moneyTS', parseInt(e.target.value) || 0)}
                    className="w-full text-center bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 text-md font-semibold"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-slate-500 dark:text-slate-400 mb-1">TO$ (Ouro)</label>
                <input
                    type="number"
                    value={moneyTO}
                    onChange={(e) => onUpdate('moneyTO', parseInt(e.target.value) || 0)}
                    className="w-full text-center bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded px-2 py-1 text-md font-semibold"
                />
            </div>
        </div>
        <hr className="border-slate-300 dark:border-slate-600 my-1"/>

        <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Espaços (Itens):</span>
            <span className="font-bold text-slate-800 dark:text-white">{itemSlots.toFixed(1)}</span>
        </div>
        <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Espaços (Moedas - {totalCoins.toLocaleString('pt-BR')}):</span>
            <span className="font-bold text-slate-800 dark:text-white">{coinSlots}</span>
        </div>
        <hr className="border-slate-300 dark:border-slate-600 my-1"/>

        <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2.5 relative my-3">
            <div 
                className={`h-2.5 rounded-full transition-all duration-300 ${progressBarColor}`}
                style={{ width: `${progressBarWidth}%` }}
            ></div>
            { maxCapacity > 0 && capacity < maxCapacity && (
                <div 
                    className="absolute h-full top-0 border-r-2 border-slate-500 dark:border-slate-400 border-dashed"
                    style={{ left: `${(capacity / maxCapacity) * 100}%` }}
                    title={`Limite de carga normal: ${capacity}`}
                ></div>
            )}
        </div>

        <div className="flex justify-between text-md font-bold">
            <span className="text-slate-600 dark:text-slate-300">Carga Total:</span>
            <span className={isOverloaded ? "text-red-500" : isOverencumbered ? "text-yellow-400" : "text-slate-800 dark:text-white"}>
                {totalLoad.toFixed(1)} / {capacity}
            </span>
        </div>
        <div className="text-xs text-slate-500 text-right">(Máximo: {maxCapacity})</div>
        
        {isOverencumbered && (
            <div className="mt-2 text-center text-yellow-600 dark:text-yellow-400 bg-yellow-400/20 dark:bg-yellow-900/50 border border-yellow-500 dark:border-yellow-700 p-2 rounded-md text-sm">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                <span>SOBRECARREGADO: Penalidade de armadura –5 e deslocamento –3m.</span>
            </div>
        )}
        {isOverloaded && (
            <div className="mt-2 text-center text-red-600 dark:text-red-500 bg-red-400/20 dark:bg-red-900/50 border border-red-500 dark:border-red-700 p-2 rounded-md text-sm">
                <i className="fas fa-times-circle mr-2"></i>
                <span>CARGA MÁXIMA EXCEDIDA: Você não pode carregar mais nada.</span>
            </div>
        )}
    </div>
    </Section>
  );
};

export default Inventory;