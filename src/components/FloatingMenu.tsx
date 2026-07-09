import React, { useState } from 'react';
import { Menu, X, Phone, FileText, ArrowUp } from 'lucide-react';

interface FloatingMenuProps {
  onTriggerEmergency: () => void;
  onScrollToPlanner: () => void;
}

export default function FloatingMenu({ onTriggerEmergency, onScrollToPlanner }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Mini-Popup Menu */}
      <div 
        className={`flex flex-col gap-3 mb-4 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'
        }`}
      >
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsOpen(false);
          }}
          className="flex items-center gap-3 justify-end group"
        >
          <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            Ke Atas
          </span>
          <div className="w-12 h-12 rounded-full bg-white text-[#546258] shadow-lg flex items-center justify-center border border-[#eae7e9] hover:bg-gray-50 transition-colors">
            <ArrowUp className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => {
            onScrollToPlanner();
            setIsOpen(false);
          }}
          className="flex items-center gap-3 justify-end group"
        >
          <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            Mulai Perencanaan
          </span>
          <div className="w-12 h-12 rounded-full bg-white text-[#546258] shadow-lg flex items-center justify-center border border-[#eae7e9] hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => {
            onTriggerEmergency();
            setIsOpen(false);
          }}
          className="flex items-center gap-3 justify-end group"
        >
          <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            Darurat 24 Jam
          </span>
          <div className="w-12 h-12 rounded-full bg-[#ba1a1a] text-white shadow-lg flex items-center justify-center hover:bg-[#ba1a1a]/90 transition-colors">
            <Phone className="w-5 h-5 animate-pulse" />
          </div>
        </button>
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#546258] text-white shadow-xl flex items-center justify-center hover:bg-[#4a5568] transition-colors ml-auto relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
}
