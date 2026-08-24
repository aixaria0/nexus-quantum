'use client';
import React, { useState } from 'react';
import { useQuantum } from '../context/QuantumContext';

const FormalVerificationPanel: React.FC = () => {
  const { apiUrl } = useQuantum();
  const [proofHash, setProofHash] = useState('0x7f3e9d2c');
  const [proof, setProof] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchProof = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/formal-proof/${proofHash}`);
      const data = await response.json();
      setProof(data);
    } catch (error) {
      console.error('Failed to fetch proof:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-gradient-to-r from-quantum-primary/20 to-quantum-accent/20 border border-quantum-primary/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-quantum-primary mb-2">🔐 Formal Verification Layer</h2>
        <p className="text-gray-300">
          Nexus Quantum uses Lean 4 to formally prove consistency properties of quantum circuits.
          This ensures that Zero-Noise Extrapolation results are mathematically guaranteed, not just heuristic.
        </p>
      </div>

      {/* Proof Explorer */}
      <div className="bg-quantum-surface/50 border border-quantum-accent/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-quantum-accent">Browse Formal Proofs</h3>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={proofHash}
            onChange={(e) => setProofHash(e.target.value)}
            placeholder="Enter proof hash (e.g., 0x7f3e9d2c)"
            className="flex-1 bg-quantum-surface border border-quantum-accent/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-quantum-accent focus:outline-none"
          />
          <button
            onClick={fetchProof}
            disabled={loading}
            className="bg-quantum-accent text-black px-4 py-2 rounded font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? '...' : '→'}
          </button>
        </div>

        {proof && (
          <div className="bg-quantum-surface/30 rounded-lg p-6 border border-quantum-primary/20 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-quantum-primary mb-1">Theorem</h4>
              <code className="text-xs font-mono bg-black/30 rounded px-3 py-2 block text-quantum-accent break-words">
                {proof.theorem}
              </code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-quantum-primary mb-1">Proof System</h4>
                <p className="text-sm text-gray-300">{proof.proof_system}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-quantum-primary mb-1">Axioms</h4>
                <p className="text-sm text-gray-300">{proof.axioms}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-quantum-primary mb-2">Key Lemmas</h4>
              <ul className="text-sm space-y-1">
                {proof.key_lemmas.map((lemma: string, idx: number) => (
                  <li key={idx} className="text-gray-300 ml-4">
                    <span className="text-quantum-accent">▹</span> {lemma}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-quantum-accent/10 rounded p-4 border border-quantum-accent/30">
              <p className="text-xs text-gray-400 mb-2">Git Reference</p>
              <code className="text-xs font-mono text-quantum-accent break-all">{proof.git_commit}</code>
              <p className="text-xs text-gray-500 mt-1">Repository: {proof.repository}</p>
            </div>

            <div className="text-xs text-gray-500">
              Verified at: {new Date(proof.verified_at).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Theory */}
      <div className="bg-quantum-surface/50 border border-quantum-accent/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-quantum-accent">Formal Theory Overview</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-quantum-primary mb-2">🎯 ZFA Hypothesis</h4>
            <p className="text-sm text-gray-300 mb-2">
              Zero-Fidelity-Alignment (ZFA) defines when a quantum circuit achieves perfect consistency
              through its geometric spectral properties sitting on the null cone.
            </p>
            <code className="text-xs bg-black/30 rounded px-3 py-2 block text-quantum-accent overflow-x-auto">
              toSpectralMode s = c • (1 : Matrix) ∧ c ≠ 0
            </code>
          </div>

          <div>
            <h4 className="font-semibold text-quantum-primary mb-2">✓ Consistency Guarantee</h4>
            <p className="text-sm text-gray-300 mb-2">
              When a circuit satisfies ZFA, it provably avoids the logical collapse condition.
              This means the circuit is guaranteed to execute without fundamental consistency violations.
            </p>
            <code className="text-xs bg-black/30 rounded px-3 py-2 block text-quantum-accent overflow-x-auto">
              ZFA(s) → IsConsistent(s)
            </code>
          </div>

          <div>
            <h4 className="font-semibold text-quantum-primary mb-2">∞ Non-Hallucinatory Design</h4>
            <p className="text-sm text-gray-300">
              Every metric shown in this dashboard includes provenance information:
              whether it's measured from hardware, simulated, theoretical, or extrapolated.
              This transparency prevents false confidence in predictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormalVerificationPanel;