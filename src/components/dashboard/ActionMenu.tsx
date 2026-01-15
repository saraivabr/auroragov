import { Paperclip, Layers, List, Globe, Image } from 'lucide-react';
import { useState } from 'react';

interface ActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActionMenu({ isOpen, onClose }: ActionMenuProps) {
  const [selectedOption, setSelectedOption] = useState<string>('prompts');

  const options = [
    { id: 'arquivos', icon: Paperclip, label: 'Arquivos' },
    { id: 'contextos', icon: Layers, label: 'Contextos' },
    { id: 'prompts', icon: List, label: 'Prompts' },
    { id: 'web', icon: Globe, label: 'Web' },
    { id: 'imagem', icon: Image, label: 'Imagem' },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="absolute bottom-20 left-4 z-50 w-64 bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-2xl p-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              selectedOption === option.id
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <option.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
