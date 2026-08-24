'use client';
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-b from-quantum-surface to-transparent border-b border-quantum-accent/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-quantum-accent to-quantum-primary bg-clip-text text-transparent">
              ⚛️ Nexus Quantum
            </h1>
            <p className="text-quantum-accent/80 text-sm font-medium mt-1">
              Zero-Noise Extrapolation meets Formal Verification
            </p>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs">
            <div className="bg-quantum-accent/10 px-3 py-2 rounded border border-quantum-accent/30">
              <span className="text-quantum-accent">🟢</span>
              <span className="ml-2">Qiskit Backend</span>
            </div>
            <div className="bg-quantum-primary/10 px-3 py-2 rounded border border-quantum-primary/30">
              <span className="text-quantum-primary">🔐</span>
              <span className="ml-2">Lean 4 Verified</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;