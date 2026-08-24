'use client';
import React, { useState } from 'react';
import { useQuantum } from './context/QuantumContext';
import GatePerformancePanel from './components/GatePerformancePanel';
import ZNEDashboard from './components/ZNEDashboard';
import LiveMetricsStream from './components/LiveMetricsStream';
import FormalVerificationPanel from './components/FormalVerificationPanel';
import Header from './components/Header';
import Navigation from './components/Navigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState('performance');

  return (
    <div className="quantum-grid min-h-screen">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {activeTab === 'performance' && <GatePerformancePanel />}
        {activeTab === 'zne' && <ZNEDashboard />}
        {activeTab === 'live' && <LiveMetricsStream />}
        {activeTab === 'verification' && <FormalVerificationPanel />}
      </main>

      <footer className="bg-black/30 border-t border-quantum-accent/20 mt-16 py-8 text-center text-sm text-gray-400">
        <p>Nexus Quantum | Formal Verification meets Quantum Error Mitigation</p>
        <p className="text-xs mt-2">Built with Lean 4, Qiskit, Mitiq, and revolutionary thinking</p>
      </footer>
    </div>
  );
}