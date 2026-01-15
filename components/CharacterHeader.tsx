import React, { useRef } from 'react';
import { type CharacterSheet } from '../types';
import EditableField from './EditableField';

interface CharacterHeaderProps {
  data: Pick<CharacterSheet, 'name' | 'distinction' | 'race' | 'origin' | 'classAndLevel' | 'divinity' | 'level' | 'characterImage'>;
  onUpdate: (field: keyof CharacterSheet, value: any) => void;
  onLevelUpClick: () => void;
}

const CharacterHeader: React.FC<CharacterHeaderProps> = ({ data, onUpdate, onLevelUpClick }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onUpdate('characterImage', e.target?.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
        <div className="flex-shrink-0 w-full md:w-48 flex flex-col items-center">
            {data.characterImage ? (
                <img src={data.characterImage} alt="Character" className="h-48 w-48 object-cover rounded-lg mb-2 border-2 border-slate-300 dark:border-slate-700" />
            ) : (
                <div className="h-48 w-48 flex items-center justify-center bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-lg mb-2">
                    <i className="fas fa-user text-6xl text-slate-400 dark:text-slate-600"></i>
                </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
            <div className="flex gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition-colors">
                    <i className="fas fa-upload mr-1"></i> Carregar
                </button>
                {data.characterImage && (
                        <button onClick={() => onUpdate('characterImage', null)} className="text-sm bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition-colors">
                        <i className="fas fa-trash mr-1"></i>Remover
                    </button>
                )}
            </div>
        </div>
        <div className="flex-grow w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <EditableField label="Personagem" value={data.name} onChange={value => onUpdate('name', value)} inputClassName="text-xl" className="sm:col-span-2 lg:col-span-3"/>
            <EditableField label="Raça" value={data.race} onChange={value => onUpdate('race', value)} />
            <EditableField label="Origem" value={data.origin} onChange={value => onUpdate('origin', value)} />
            <EditableField label="Classe" value={data.classAndLevel} onChange={value => onUpdate('classAndLevel', value)} />
            <EditableField label="Divindade" value={data.divinity} onChange={value => onUpdate('divinity', value)} />
            <EditableField label="Distinção" value={data.distinction} onChange={value => onUpdate('distinction', value)} />
            <div className="flex items-end gap-2">
                <EditableField label="Nível" type="number" value={data.level} onChange={value => onUpdate('level', Math.max(1, value as number))} className="flex-grow" />
                <button
                    onClick={onLevelUpClick}
                    className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                    title="Subir de Nível"
                >
                    <i className="fas fa-arrow-up"></i>
                </button>
            </div>
        </div>
    </div>
  );
};

export default CharacterHeader;