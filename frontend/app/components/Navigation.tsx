'use client';
import React from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'performance', label: '⚡ Gate Performance', icon: '📊' },
    { id: 'zne', label: '🔬 ZNE Mitigation', icon: '✨' },
    { id: 'live', label: '🌊 Live Stream', icon: '📡' },
    { id: 'verification', label: '✓ Formal Proofs', icon: '🔐' },
  ];

  return (
    <nav className="border-b border-quantum-accent/20 bg-quantum-surface/30 backdrop-blur-sm sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-4 font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'text-quantum-accent border-b-2 border-quantum-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;