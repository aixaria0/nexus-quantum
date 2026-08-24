'use client';
import React from 'react';

interface ConfidenceIndicatorProps {
  confidence: number;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ confidence }) => {
  const percentage = confidence * 100;
  const color = confidence > 0.9 ? 'text-quantum-accent' : confidence > 0.5 ? 'text-quantum-warning' : 'text-quantum-error';
  const label = confidence > 0.9 ? 'High' : confidence > 0.5 ? 'Medium' : 'Low';

  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-2 bg-quantum-surface rounded-full overflow-hidden border border-quantum-accent/20">
        <div
          className={`h-full transition-all ${color.replace('text-', 'bg-')}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${color}`}>{label}</span>
    </div>
  );
};

export default ConfidenceIndicator;